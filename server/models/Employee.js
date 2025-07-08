const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true,
    enum: ['administration', 'hr', 'education', 'training', 'placement', 'incubation', 'livelihood', 'it', 'finance', 'marketing']
  },
  position: {
    type: String,
    required: true
  },
  employment: {
    type: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'intern'],
      default: 'full_time'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'terminated'],
      default: 'active'
    },
    hireDate: {
      type: Date,
      default: Date.now
    },
    probationEndDate: Date,
    contractEndDate: Date
  },
  compensation: {
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    payScale: String,
    allowances: [{
      type: String,
      amount: Number,
      description: String
    }]
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  reportees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  personalInfo: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountType: String
  },
  documents: {
    panNumber: String,
    aadharNumber: String,
    passportNumber: String,
    drivingLicense: String
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    certifications: [String]
  }],
  performanceMetrics: {
    currentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    lastReviewDate: Date,
    nextReviewDate: Date,
    goals: [{
      title: String,
      description: String,
      deadline: Date,
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'overdue']
      }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
employeeSchema.index({ userId: 1 });
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ 'employment.status': 1 });
employeeSchema.index({ 'employment.hireDate': 1 });
employeeSchema.index({ manager: 1 });

// Virtual for full profile
employeeSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Employee', employeeSchema);