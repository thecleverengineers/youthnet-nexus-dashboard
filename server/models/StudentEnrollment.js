const mongoose = require('mongoose');

const studentEnrollmentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  program_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },
  enrollment_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique student-program combination
studentEnrollmentSchema.index({ student_id: 1, program_id: 1 }, { unique: true });
studentEnrollmentSchema.index({ status: 1 });

module.exports = mongoose.model('StudentEnrollment', studentEnrollmentSchema);