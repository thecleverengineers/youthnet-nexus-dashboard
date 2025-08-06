
import { supabase } from '@/integrations/supabase/client';

// Temporary type definitions until Supabase types are regenerated
export interface Student {
  id: string;
  user_id: string;
  student_id: string;
  date_of_birth?: string;
  gender?: string;
  education_level?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  status?: 'pending' | 'active' | 'completed' | 'dropped';
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

// Add interfaces for HR Admin tables
export interface PayrollCycle {
  id: string;
  cycle_name: string;
  start_date: string;
  end_date: string;
  pay_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollEntry {
  id: string;
  employee_id: string;
  cycle_id: string;
  basic_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  bonuses: number;
  deductions: number;
  net_pay: number;
  ai_risk_score: number;
  created_at: string;
  updated_at: string;
}

export interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_period: string;
  overall_rating: number;
  technical_skills: number;
  communication: number;
  leadership: number;
  teamwork: number;
  innovation: number;
  ai_generated_insights: string;
  skill_assessment: any;
  development_goals: string[];
  achievements: string[];
  areas_for_improvement: string[];
  comments: string;
  created_at: string;
  updated_at: string;
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
  payroll_cycles: {
    select: (query = '*') => (supabase as any).from('payroll_cycles').select(query),
    insert: (data: Partial<PayrollCycle>[]) => (supabase as any).from('payroll_cycles').insert(data),
    update: (data: Partial<PayrollCycle>) => (supabase as any).from('payroll_cycles').update(data),
    delete: () => (supabase as any).from('payroll_cycles').delete(),
  },
  payroll_entries: {
    select: (query = '*') => (supabase as any).from('payroll_entries').select(query),
    insert: (data: Partial<PayrollEntry>[]) => (supabase as any).from('payroll_entries').insert(data),
    update: (data: Partial<PayrollEntry>) => (supabase as any).from('payroll_entries').update(data),
    delete: () => (supabase as any).from('payroll_entries').delete(),
  },
  performance_reviews: {
    select: (query = '*') => (supabase as any).from('performance_reviews').select(query),
    insert: (data: Partial<PerformanceReview>[]) => (supabase as any).from('performance_reviews').insert(data),
    update: (data: Partial<PerformanceReview>) => (supabase as any).from('performance_reviews').update(data),
    delete: () => (supabase as any).from('performance_reviews').delete(),
  },
};
