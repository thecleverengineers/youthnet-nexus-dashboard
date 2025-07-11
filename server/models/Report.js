const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['attendance', 'performance', 'financial', 'training', 'inventory', 'general'],
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  generated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  generated_at: {
    type: Date,
    default: Date.now
  },
  period_start: {
    type: Date
  },
  period_end: {
    type: Date
  },
  file_url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
reportSchema.index({ type: 1 });
reportSchema.index({ generated_by: 1 });
reportSchema.index({ generated_at: -1 });
reportSchema.index({ department: 1 });

module.exports = mongoose.model('Report', reportSchema);