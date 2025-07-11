const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationCourse',
    required: true
  },
  enrollment_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['enrolled', 'completed', 'dropped', 'failed'],
    default: 'enrolled'
  },
  assignment_reason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique student-course combination
courseEnrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });
courseEnrollmentSchema.index({ status: 1 });

module.exports = mongoose.model('CourseEnrollment', courseEnrollmentSchema);