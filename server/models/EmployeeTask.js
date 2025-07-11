const mongoose = require('mongoose');

const employeeTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  due_date: {
    type: Date
  },
  estimated_hours: {
    type: Number,
    min: 0,
    default: 0
  },
  actual_hours: {
    type: Number,
    min: 0,
    default: 0
  },
  completion_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployeeTask'
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  tags: [{
    type: String,
    trim: true
  }],
  ai_complexity_score: {
    type: Number,
    min: 0,
    default: 0
  },
  auto_assigned: {
    type: Boolean,
    default: false
  },
  completed_at: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
employeeTaskSchema.index({ assigned_to: 1 });
employeeTaskSchema.index({ assigned_by: 1 });
employeeTaskSchema.index({ status: 1 });
employeeTaskSchema.index({ priority: 1 });
employeeTaskSchema.index({ due_date: 1 });

module.exports = mongoose.model('EmployeeTask', employeeTaskSchema);