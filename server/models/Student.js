const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  educationLevel: {
    type: String,
    enum: ['high_school', 'diploma', 'bachelor', 'master', 'phd', 'other']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'graduated', 'dropped_out', 'suspended'],
    default: 'active'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  academicInfo: {
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    creditsCompleted: {
      type: Number,
      default: 0
    },
    expectedGraduation: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
studentSchema.index({ userId: 1 });
studentSchema.index({ studentId: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ enrollmentDate: 1 });

// Virtual for full profile (populated user data)
studentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Student', studentSchema);