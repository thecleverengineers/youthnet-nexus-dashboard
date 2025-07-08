const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  trainerId: {
    type: String,
    required: true,
    unique: true
  },
  specialization: [{
    type: String,
    required: true
  }],
  experienceYears: {
    type: Number,
    min: 0,
    default: 0
  },
  qualification: [{
    degree: String,
    institution: String,
    year: Number,
    field: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String
  }],
  hireDate: {
    type: Date,
    default: Date.now
  },
  employment: {
    type: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'consultant'],
      default: 'full_time'
    },
    salary: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active'
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    yearsOfExperience: Number
  }],
  performanceMetrics: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    totalStudentsTrained: {
      type: Number,
      default: 0
    },
    averageStudentRating: {
      type: Number,
      min: 1,
      max: 5
    },
    coursesDelivered: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
trainerSchema.index({ userId: 1 });
trainerSchema.index({ trainerId: 1 });
trainerSchema.index({ status: 1 });
trainerSchema.index({ specialization: 1 });
trainerSchema.index({ hireDate: 1 });

// Virtual for full profile
trainerSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Trainer', trainerSchema);