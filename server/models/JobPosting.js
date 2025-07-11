const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  salary_range: {
    type: String,
    trim: true
  },
  job_type: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'internship', 'freelance'],
    trim: true
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  posted_date: {
    type: Date,
    default: Date.now
  },
  closing_date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft', 'expired'],
    default: 'open'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ posted_date: -1 });
jobPostingSchema.index({ job_type: 1 });
jobPostingSchema.index({ posted_by: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);