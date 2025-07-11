const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration_weeks: {
    type: Number,
    required: true,
    default: 1
  },
  max_participants: {
    type: Number,
    required: true,
    default: 20
  },
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
trainingProgramSchema.index({ trainer_id: 1 });
trainingProgramSchema.index({ status: 1 });

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);