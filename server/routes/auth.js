const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Employee = require('../models/Employee');
const { generateToken, generateRefreshToken, authenticate } = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'youthnet_jwt_secret_key_2024';

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, fullName, role = 'student' } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      profile: {
        fullName,
        role
      },
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    await user.save();

    // Create role-specific record
    const roleId = user.generateRoleId();
    
    switch (role) {
      case 'student':
        await new Student({
          userId: user._id,
          studentId: roleId
        }).save();
        break;
        
      case 'trainer':
        await new Trainer({
          userId: user._id,
          trainerId: roleId,
          specialization: ['General Training']
        }).save();
        break;
        
      case 'staff':
      case 'admin':
        await new Employee({
          userId: user._id,
          employeeId: roleId,
          department: role === 'admin' ? 'administration' : 'hr',
          position: role === 'admin' ? 'Administrator' : 'Staff Member',
          compensation: {
            salary: role === 'admin' ? 60000 : 40000
          }
        }).save();
        break;
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact administrator.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    let roleData = null;
    
    // Get role-specific data
    switch (req.user.profile.role) {
      case 'student':
        roleData = await Student.findOne({ userId: req.user._id });
        break;
      case 'trainer':
        roleData = await Trainer.findOne({ userId: req.user._id });
        break;
      case 'staff':
      case 'admin':
        roleData = await Employee.findOne({ userId: req.user._id });
        break;
    }

    res.json({
      success: true,
      data: {
        user: req.user.toJSON(),
        roleData
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    
    if (fullName) req.user.profile.fullName = fullName;
    if (phone) req.user.profile.phone = phone;
    
    await req.user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Logout (invalidate token on client side)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET + '_refresh');
    const user = await User.findById(decoded.userId);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

module.exports = router;
