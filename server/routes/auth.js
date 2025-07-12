
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  refreshToken
} = require('../controllers/authController');

const router = express.Router();

// Register new user
router.post('/register', authLimiter, registerUser);

// Login user
router.post('/login', authLimiter, loginUser);

// Get current user profile
router.get('/profile', authenticate, getUserProfile);

// Update user profile
router.put('/profile', authenticate, updateUserProfile);

// Logout (invalidate token on client side)
router.post('/logout', authenticate, logoutUser);

// Refresh token
router.post('/refresh', refreshToken);

module.exports = router;
