
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

export interface Employee {
  id: string;
  employee_id: string;
  user_id?: string;
  position?: string;
  department?: string;
  employment_status?: string;
  employment_type?: string;
  hire_date?: string;
  salary?: number;
  probation_end_date?: string;
  contract_end_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  bank_account?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface EmployeeTask {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  completion_percentage: number;
  tags: string[];
  dependencies: string[];
  ai_complexity_score: number;
  auto_assigned: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'sick_leave' | 'vacation';
  notes?: string;
  created_at: string;
  updated_at: string;
  employees?: {
    employee_id: string;
    profiles?: {
      full_name?: string;
    };
  };
}

// Add new interfaces for additional HR tables
export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Payroll {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_pay: number;
  net_pay: number;
  payment_status: 'pending' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface EmployeeBenefit {
  id: string;
  employee_id: string;
  benefit_name: string;
  benefit_type: string;
  provider?: string;
  coverage_amount?: number;
  premium_amount?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface EmployeeTraining {
  id: string;
  employee_id: string;
  training_name: string;
  training_type: string;
  provider?: string;
  status: 'pending' | 'in_progress' | 'completed';
  certification_earned?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

// Additional interfaces needed for the application
export interface Asset {
  id: string;
  name: string;
  category: string;
  description?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  location?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StockItem {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit?: string;
  reorder_level?: number;
  supplier?: string;
  unit_cost?: number;
  location?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  employment_type: string;
  status: string;
  posted_date: string;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_posting_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  application_status: string;
  applied_date: string;
  created_at: string;
  updated_at: string;
}

export interface StartupApplication {
  id: string;
  business_name: string;
  business_idea: string;
  industry: string;
  team_size: number;
  funding_required: number;
  notes?: string;
  application_status: string;
  submitted_date: string;
  created_at: string;
  updated_at: string;
}

export interface LivelihoodProgram {
  id: string;
  program_name: string;
  focus_area: string;
  target_demographic?: string;
  duration_months?: number;
  max_participants?: number;
  budget?: number;
  expected_outcomes?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface LocalProduct {
  id: string;
  product_name: string;
  category: string;
  description?: string;
  producer_name: string;
  producer_contact?: string;
  price?: number;
  stock_quantity: number;
  status: string;
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
  employees: {
    select: (query = '*') => (supabase as any).from('employees').select(query),
    insert: (data: Partial<Employee>[]) => (supabase as any).from('employees').insert(data),
    update: (data: Partial<Employee>) => (supabase as any).from('employees').update(data),
    delete: () => (supabase as any).from('employees').delete(),
  },
  employee_tasks: {
    select: (query = '*') => (supabase as any).from('employee_tasks').select(query),
    insert: (data: Partial<EmployeeTask>[]) => (supabase as any).from('employee_tasks').insert(data),
    update: (data: Partial<EmployeeTask>) => (supabase as any).from('employee_tasks').update(data),
    delete: () => (supabase as any).from('employee_tasks').delete(),
  },
  attendance_records: {
    select: (query = '*') => (supabase as any).from('attendance_records').select(query),
    insert: (data: Partial<AttendanceRecord>[]) => (supabase as any).from('attendance_records').insert(data),
    upsert: (data: Partial<AttendanceRecord>, options?: any) => (supabase as any).from('attendance_records').upsert(data, options),
    update: (data: Partial<AttendanceRecord>) => (supabase as any).from('attendance_records').update(data),
    delete: () => (supabase as any).from('attendance_records').delete(),
  },
  leave_requests: {
    select: (query = '*') => (supabase as any).from('leave_requests').select(query),
    insert: (data: Partial<LeaveRequest>[]) => (supabase as any).from('leave_requests').insert(data),
    update: (data: Partial<LeaveRequest>) => (supabase as any).from('leave_requests').update(data),
    delete: () => (supabase as any).from('leave_requests').delete(),
  },
  payroll: {
    select: (query = '*') => (supabase as any).from('payroll').select(query),
    insert: (data: Partial<Payroll>[]) => (supabase as any).from('payroll').insert(data),
    update: (data: Partial<Payroll>) => (supabase as any).from('payroll').update(data),
    delete: () => (supabase as any).from('payroll').delete(),
  },
  employee_benefits: {
    select: (query = '*') => (supabase as any).from('employee_benefits').select(query),
    insert: (data: Partial<EmployeeBenefit>[]) => (supabase as any).from('employee_benefits').insert(data),
    update: (data: Partial<EmployeeBenefit>) => (supabase as any).from('employee_benefits').update(data),
    delete: () => (supabase as any).from('employee_benefits').delete(),
  },
  employee_training: {
    select: (query = '*') => (supabase as any).from('employee_training').select(query),
    insert: (data: Partial<EmployeeTraining>[]) => (supabase as any).from('employee_training').insert(data),
    update: (data: Partial<EmployeeTraining>) => (supabase as any).from('employee_training').update(data),
    delete: () => (supabase as any).from('employee_training').delete(),
  },
  profiles: {
    select: (query = '*') => (supabase as any).from('profiles').select(query),
    insert: (data: Partial<Profile>[]) => (supabase as any).from('profiles').insert(data),
    update: (data: Partial<Profile>) => (supabase as any).from('profiles').update(data),
    delete: () => (supabase as any).from('profiles').delete(),
  },
  assets: {
    select: (query = '*') => (supabase as any).from('assets').select(query),
    insert: (data: Partial<Asset>[]) => (supabase as any).from('assets').insert(data),
    update: (data: Partial<Asset>) => (supabase as any).from('assets').update(data),
    delete: () => (supabase as any).from('assets').delete(),
  },
  stock_items: {
    select: (query = '*') => (supabase as any).from('stock_items').select(query),
    insert: (data: Partial<StockItem>[]) => (supabase as any).from('stock_items').insert(data),
    update: (data: Partial<StockItem>) => (supabase as any).from('stock_items').update(data),
    delete: () => (supabase as any).from('stock_items').delete(),
  },
  job_postings: {
    select: (query = '*') => (supabase as any).from('job_postings').select(query),
    insert: (data: Partial<JobPosting>[]) => (supabase as any).from('job_postings').insert(data),
    update: (data: Partial<JobPosting>) => (supabase as any).from('job_postings').update(data),
    delete: () => (supabase as any).from('job_postings').delete(),
  },
  job_applications: {
    select: (query = '*') => (supabase as any).from('job_applications').select(query),
    insert: (data: Partial<JobApplication>[]) => (supabase as any).from('job_applications').insert(data),
    update: (data: Partial<JobApplication>) => (supabase as any).from('job_applications').update(data),
    delete: () => (supabase as any).from('job_applications').delete(),
  },
  startup_applications: {
    select: (query = '*') => (supabase as any).from('startup_applications').select(query),
    insert: (data: Partial<StartupApplication>[]) => (supabase as any).from('startup_applications').insert(data),
    update: (data: Partial<StartupApplication>) => (supabase as any).from('startup_applications').update(data),
    delete: () => (supabase as any).from('startup_applications').delete(),
  },
  livelihood_programs: {
    select: (query = '*') => (supabase as any).from('livelihood_programs').select(query),
    insert: (data: Partial<LivelihoodProgram>[]) => (supabase as any).from('livelihood_programs').insert(data),
    update: (data: Partial<LivelihoodProgram>) => (supabase as any).from('livelihood_programs').update(data),
    delete: () => (supabase as any).from('livelihood_programs').delete(),
  },
  local_products: {
    select: (query = '*') => (supabase as any).from('local_products').select(query),
    insert: (data: Partial<LocalProduct>[]) => (supabase as any).from('local_products').insert(data),
    update: (data: Partial<LocalProduct>) => (supabase as any).from('local_products').update(data),
    delete: () => (supabase as any).from('local_products').delete(),
  },
};
