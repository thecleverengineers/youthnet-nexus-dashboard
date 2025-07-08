const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'trainer', 'student'],
      required: true,
      default: 'student'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ 'profile.role': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate user ID based on role
userSchema.methods.generateRoleId = function() {
  const rolePrefix = {
    'admin': 'ADM',
    'staff': 'EMP',
    'trainer': 'TRA',
    'student': 'STU'
  };
  
  const prefix = rolePrefix[this.profile.role] || 'STU';
  const emailPrefix = this.email.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  
  return `${prefix}${emailPrefix}${timestamp}`;
};

// Hide sensitive fields
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);