const mongoose = require('mongoose');

const payrollCycleSchema = new mongoose.Schema({
  cycle_name: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  pay_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'processing', 'completed', 'cancelled'],
    default: 'draft'
  },
  total_net_pay: {
    type: Number,
    min: 0
  },
  ai_anomaly_detected: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
payrollCycleSchema.index({ start_date: 1, end_date: 1 });
payrollCycleSchema.index({ status: 1 });
payrollCycleSchema.index({ pay_date: 1 });

module.exports = mongoose.model('PayrollCycle', payrollCycleSchema);