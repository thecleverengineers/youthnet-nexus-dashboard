const mongoose = require('mongoose');

const startupApplicationSchema = new mongoose.Schema({
  business_name: {
    type: String,
    required: true,
    trim: true
  },
  business_idea: {
    type: String,
    required: true,
    trim: true
  },
  applicant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  industry: {
    type: String,
    trim: true
  },
  funding_required: {
    type: Number,
    min: 0
  },
  team_size: {
    type: Number,
    min: 1
  },
  application_status: {
    type: String,
    enum: ['pending', 'shortlisted', 'interviewed', 'selected', 'rejected'],
    default: 'pending'
  },
  submitted_at: {
    type: Date,
    default: Date.now
  },
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewed_at: {
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

// Index for performance
startupApplicationSchema.index({ applicant_id: 1 });
startupApplicationSchema.index({ application_status: 1 });
startupApplicationSchema.index({ submitted_at: -1 });

module.exports = mongoose.model('StartupApplication', startupApplicationSchema);