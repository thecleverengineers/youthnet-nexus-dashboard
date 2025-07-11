const mongoose = require('mongoose');

const livelihoodProgramSchema = new mongoose.Schema({
  program_name: {
    type: String,
    required: true,
    trim: true
  },
  focus_area: {
    type: String,
    required: true,
    trim: true
  },
  target_demographic: {
    type: String,
    trim: true
  },
  duration_weeks: {
    type: Number,
    min: 1
  },
  max_participants: {
    type: Number,
    min: 1
  },
  coordinator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  budget: {
    type: Number,
    min: 0
  },
  program_status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'cancelled', 'on_hold'],
    default: 'planning'
  },
  expected_outcomes: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
livelihoodProgramSchema.index({ coordinator_id: 1 });
livelihoodProgramSchema.index({ program_status: 1 });
livelihoodProgramSchema.index({ focus_area: 1 });

module.exports = mongoose.model('LivelihoodProgram', livelihoodProgramSchema);