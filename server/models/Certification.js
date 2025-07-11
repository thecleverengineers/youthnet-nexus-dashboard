const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  credential_id: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'expired', 'revoked'],
    default: 'in_progress'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  issue_date: {
    type: Date
  },
  expiry_date: {
    type: Date
  },
  expected_completion: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
certificationSchema.index({ student_id: 1 });
certificationSchema.index({ status: 1 });
certificationSchema.index({ issuer: 1 });

module.exports = mongoose.model('Certification', certificationSchema);