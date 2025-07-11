const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  skill_name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'needs_improvement'],
    default: 'pending'
  },
  last_assessed: {
    type: Date
  },
  next_assessment: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique student-skill combination
skillAssessmentSchema.index({ student_id: 1, skill_name: 1 }, { unique: true });
skillAssessmentSchema.index({ level: 1 });
skillAssessmentSchema.index({ status: 1 });

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);