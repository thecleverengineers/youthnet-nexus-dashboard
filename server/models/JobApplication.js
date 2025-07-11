const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  application_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'interviewed', 'selected', 'rejected'],
    default: 'pending'
  },
  interview_date: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique job-student combination
jobApplicationSchema.index({ job_id: 1, student_id: 1 }, { unique: true });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ application_date: -1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);