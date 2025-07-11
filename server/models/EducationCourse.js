const mongoose = require('mongoose');

const educationCourseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
    trim: true
  },
  course_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  duration_months: {
    type: Number,
    required: true,
    default: 1
  },
  credits: {
    type: Number,
    min: 0
  },
  max_students: {
    type: Number,
    min: 1
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
educationCourseSchema.index({ course_code: 1 });
educationCourseSchema.index({ department: 1 });
educationCourseSchema.index({ status: 1 });

module.exports = mongoose.model('EducationCourse', educationCourseSchema);