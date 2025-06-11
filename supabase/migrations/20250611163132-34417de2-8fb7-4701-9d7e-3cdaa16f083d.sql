
-- Create tables for Education Department module
CREATE TABLE education_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_code TEXT UNIQUE NOT NULL,
  description TEXT,
  duration_months INTEGER NOT NULL,
  credits INTEGER,
  department TEXT,
  instructor_id UUID,
  max_students INTEGER,
  prerequisites TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for Incubation module
CREATE TABLE startup_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID,
  business_name TEXT NOT NULL,
  business_idea TEXT NOT NULL,
  industry TEXT,
  funding_required NUMERIC,
  team_size INTEGER,
  application_status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for Made in Nagaland module
CREATE TABLE local_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  producer_name TEXT NOT NULL,
  producer_contact TEXT,
  description TEXT,
  price NUMERIC,
  stock_quantity INTEGER DEFAULT 0,
  images TEXT[],
  certification_status TEXT DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for Livelihood Incubator module
CREATE TABLE livelihood_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_name TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  target_demographic TEXT,
  duration_weeks INTEGER,
  max_participants INTEGER,
  program_status TEXT NOT NULL DEFAULT 'planning',
  coordinator_id UUID,
  budget NUMERIC,
  expected_outcomes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for HR & Admin module
CREATE TABLE employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  user_id UUID,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  hire_date DATE NOT NULL,
  salary NUMERIC,
  employment_status TEXT NOT NULL DEFAULT 'active',
  manager_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for course enrollments with assignments
CREATE TABLE course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES education_courses(id),
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_date DATE,
  grade TEXT,
  status TEXT NOT NULL DEFAULT 'enrolled',
  assigned_by UUID,
  assignment_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX idx_local_products_category ON local_products(category);
CREATE INDEX idx_startup_applications_status ON startup_applications(application_status);

-- Add triggers for updated_at columns
CREATE TRIGGER update_education_courses_updated_at BEFORE UPDATE ON education_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_startup_applications_updated_at BEFORE UPDATE ON startup_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_local_products_updated_at BEFORE UPDATE ON local_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_livelihood_programs_updated_at BEFORE UPDATE ON livelihood_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
