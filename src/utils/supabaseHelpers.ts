
import { supabase } from '@/integrations/supabase/client';

// Temporary type definitions until Supabase types are regenerated
export interface Student {
  id: string;
  user_id: string;
  student_id: string;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  user_id: string;
  trainer_id: string;
  specialization?: string;
  experience_years?: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description?: string;
  duration_weeks: number;
  max_participants?: number;
  trainer_id?: string;
  status: 'pending' | 'active' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
}

export interface StudentEnrollment {
  id: string;
  student_id: string;
  program_id: string;
  enrollment_date: string;
  status: 'active' | 'completed' | 'dropped' | 'pending';
  created_at: string;
  updated_at: string;
  training_programs?: TrainingProgram;
}

export interface EducationCourse {
  id: string;
  course_name: string;
  course_code: string;
  description?: string;
  duration_months?: number;
  credits?: number;
  department?: string;
  max_students?: number;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrollment_date: string;
  assignment_reason?: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'pending';
  created_at: string;
  updated_at: string;
  students?: {
    student_id: string;
    profiles?: {
      full_name?: string;
      email?: string;
    };
  };
  education_courses?: {
    course_name: string;
    course_code: string;
  };
}

// Type-safe Supabase helpers
export const supabaseHelpers = {
  students: {
    select: (query = '*') => (supabase as any).from('students').select(query),
    insert: (data: Partial<Student>[]) => (supabase as any).from('students').insert(data),
    update: (data: Partial<Student>) => (supabase as any).from('students').update(data),
    delete: () => (supabase as any).from('students').delete(),
  },
  trainers: {
    select: (query = '*') => (supabase as any).from('trainers').select(query),
    insert: (data: Partial<Trainer>[]) => (supabase as any).from('trainers').insert(data),
    update: (data: Partial<Trainer>) => (supabase as any).from('trainers').update(data),
    delete: () => (supabase as any).from('trainers').delete(),
  },
  training_programs: {
    select: (query = '*') => (supabase as any).from('training_programs').select(query),
    insert: (data: Partial<TrainingProgram>[]) => (supabase as any).from('training_programs').insert(data),
    update: (data: Partial<TrainingProgram>) => (supabase as any).from('training_programs').update(data),
    delete: () => (supabase as any).from('training_programs').delete(),
  },
  student_enrollments: {
    select: (query = '*') => (supabase as any).from('student_enrollments').select(query),
    insert: (data: Partial<StudentEnrollment>[]) => (supabase as any).from('student_enrollments').insert(data),
    update: (data: Partial<StudentEnrollment>) => (supabase as any).from('student_enrollments').update(data),
    delete: () => (supabase as any).from('student_enrollments').delete(),
  },
  education_courses: {
    select: (query = '*') => (supabase as any).from('education_courses').select(query),
    insert: (data: Partial<EducationCourse>[]) => (supabase as any).from('education_courses').insert(data),
    update: (data: Partial<EducationCourse>) => (supabase as any).from('education_courses').update(data),
    delete: () => (supabase as any).from('education_courses').delete(),
  },
  course_enrollments: {
    select: (query = '*') => (supabase as any).from('course_enrollments').select(query),
    insert: (data: Partial<CourseEnrollment>[]) => (supabase as any).from('course_enrollments').insert(data),
    update: (data: Partial<CourseEnrollment>) => (supabase as any).from('course_enrollments').update(data),
    delete: () => (supabase as any).from('course_enrollments').delete(),
  },
};
