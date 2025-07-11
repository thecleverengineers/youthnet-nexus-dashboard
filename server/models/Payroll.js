const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payroll_cycle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PayrollCycle',
    required: true
  },
  gross_pay: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  deductions: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  net_pay: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  ai_risk_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique employee-cycle combination
payrollSchema.index({ employee_id: 1, payroll_cycle_id: 1 }, { unique: true });
payrollSchema.index({ payroll_cycle_id: 1 });

// Pre-save middleware to calculate net pay
payrollSchema.pre('save', function(next) {
  this.net_pay = this.gross_pay - this.deductions;
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);