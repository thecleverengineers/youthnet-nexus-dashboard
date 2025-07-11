const mongoose = require('mongoose');

const incubationProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  founder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  status: {
    type: String,
    enum: ['idea', 'development', 'testing', 'launched', 'suspended'],
    default: 'idea'
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  expected_completion: {
    type: Date
  },
  funding_amount: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
incubationProjectSchema.index({ founder_id: 1 });
incubationProjectSchema.index({ mentor_id: 1 });
incubationProjectSchema.index({ status: 1 });

module.exports = mongoose.model('IncubationProject', incubationProjectSchema);