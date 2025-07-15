
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Course {
  id: string;
  course_name: string;
  course_code: string;
  description: string;
  duration_months: number;
  credits: number;
  department: string;
  max_students: number;
  status: string;
}

export interface CourseEnrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_date: string;
  status: string;
  assignment_reason?: string;
  students?: {
    student_id: string;
    profiles?: {
      full_name: string;
      email: string;
    };
  };
  education_courses?: Course;
}

export const educationService = {
  async fetchCourses() {
    const { data, error } = await supabase
      .from('education_courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      return [];
    }

    return data || [];
  },

  async createCourse(courseData: any) {
    const { data, error } = await supabase
      .from('education_courses')
      .insert({
        course_name: courseData.course_name,
        course_code: courseData.course_code,
        description: courseData.description,
        duration_months: courseData.duration_months,
        credits: courseData.credits,
        department: courseData.department,
        max_students: courseData.max_students,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      return null;
    }

    toast.success('Course created successfully');
    return data;
  },

  async fetchCourseEnrollments() {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        students (
          student_id,
          profiles (
            full_name,
            email
          )
        ),
        education_courses (
          course_name,
          course_code
        )
      `)
      .order('enrollment_date', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to fetch course enrollments');
      return [];
    }

    return data || [];
  },

  async enrollStudent(studentId: string, courseId: string, assignmentReason?: string) {
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        student_id: studentId,
        course_id: courseId,
        assignment_reason: assignmentReason,
        status: 'enrolled'
      })
      .select(`
        *,
        students (
          student_id,
          profiles (
            full_name,
            email
          )
        ),
        education_courses (
          course_name,
          course_code
        )
      `)
      .single();

    if (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
      return null;
    }

    toast.success('Student enrolled successfully');
    return data;
  },

  async fetchStudents() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
      return [];
    }

    return data || [];
  }
};
