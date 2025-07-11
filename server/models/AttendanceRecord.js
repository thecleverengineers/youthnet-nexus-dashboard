const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  check_in: {
    type: Date
  },
  check_out: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'work_from_home'],
    default: 'present'
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

// Compound index for unique employee-date combination
attendanceRecordSchema.index({ employee_id: 1, date: 1 }, { unique: true });
attendanceRecordSchema.index({ date: 1 });
attendanceRecordSchema.index({ status: 1 });

// Virtual for hours worked
attendanceRecordSchema.virtual('hours_worked').get(function() {
  if (this.check_in && this.check_out) {
    return Math.round((this.check_out - this.check_in) / (1000 * 60 * 60) * 100) / 100;
  }
  return 0;
});

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);