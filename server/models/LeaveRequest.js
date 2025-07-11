const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leave_type: {
    type: String,
    enum: ['vacation', 'sick', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement'],
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  days_requested: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approved_at: {
    type: Date
  },
  comments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
leaveRequestSchema.index({ employee_id: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ start_date: 1, end_date: 1 });

// Pre-save middleware to calculate days
leaveRequestSchema.pre('save', function(next) {
  if (this.start_date && this.end_date) {
    const diffTime = this.end_date - this.start_date;
    this.days_requested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);