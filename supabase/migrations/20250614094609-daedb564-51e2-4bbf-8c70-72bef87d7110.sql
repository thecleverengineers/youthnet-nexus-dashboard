
-- Create enum types first
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE employment_status AS ENUM ('active', 'inactive', 'terminated', 'on_leave', 'probation');
CREATE TYPE leave_type AS ENUM ('vacation', 'sick', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE performance_rating AS ENUM ('excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE application_status AS ENUM ('pending', 'shortlisted', 'interviewed', 'selected', 'rejected');
CREATE TYPE project_status AS ENUM ('idea', 'development', 'testing', 'launched', 'suspended');
CREATE TYPE inventory_status AS ENUM ('available', 'in_use', 'maintenance', 'damaged', 'disposed');

-- Add missing columns to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_type employment_type DEFAULT 'full_time';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_status employment_status DEFAULT 'active';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS salary NUMERIC(10,2);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES employees(id);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS probation_end_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS contract_end_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_joining DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add enrollment_date to students table if missing
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_date DATE DEFAULT CURRENT_DATE;

-- Add missing columns to trainers table
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS hire_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS qualification TEXT;

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Create employee_tasks table
CREATE TABLE IF NOT EXISTS employee_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES employees(id) NOT NULL,
  assigned_by UUID REFERENCES employees(id),
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  due_date DATE,
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  tags TEXT[],
  dependencies UUID[],
  attachments JSONB DEFAULT '[]'::jsonb,
  ai_complexity_score NUMERIC DEFAULT 0,
  auto_assigned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status leave_status DEFAULT 'pending',
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee_benefits table
CREATE TABLE IF NOT EXISTS employee_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  benefit_type TEXT NOT NULL,
  benefit_name TEXT NOT NULL,
  provider TEXT,
  coverage_amount NUMERIC(10,2),
  premium_amount NUMERIC(8,2),
  employee_contribution NUMERIC(8,2),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee_training table
CREATE TABLE IF NOT EXISTS employee_training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  training_name TEXT NOT NULL,
  training_type TEXT NOT NULL,
  provider TEXT,
  start_date DATE,
  end_date DATE,
  completion_date DATE,
  certification_earned TEXT,
  cost NUMERIC(8,2),
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create startup_applications table
CREATE TABLE IF NOT EXISTS startup_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID,
  business_name TEXT NOT NULL,
  business_idea TEXT NOT NULL,
  industry TEXT,
  funding_required NUMERIC,
  team_size INTEGER,
  application_status application_status DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create local_products table
CREATE TABLE IF NOT EXISTS local_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create livelihood_programs table
CREATE TABLE IF NOT EXISTS livelihood_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  target_demographic TEXT,
  duration_weeks INTEGER,
  max_participants INTEGER,
  program_status TEXT DEFAULT 'planning',
  coordinator_id UUID,
  budget NUMERIC,
  expected_outcomes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create skill_assessments table
CREATE TABLE IF NOT EXISTS skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  last_assessed DATE,
  next_assessment DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'expired')),
  issue_date DATE,
  expiry_date DATE,
  expected_completion DATE,
  credential_id TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  location TEXT,
  salary_range TEXT,
  job_type TEXT,
  posted_by UUID REFERENCES profiles(id),
  posted_date DATE DEFAULT CURRENT_DATE,
  closing_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  application_date DATE DEFAULT CURRENT_DATE,
  status application_status DEFAULT 'pending',
  notes TEXT,
  interview_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(job_id, student_id)
);

-- Create incubation_projects table
CREATE TABLE IF NOT EXISTS incubation_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  founder_id UUID REFERENCES students(id),
  mentor_id UUID REFERENCES trainers(id),
  start_date DATE DEFAULT CURRENT_DATE,
  expected_completion DATE,
  status project_status DEFAULT 'idea',
  funding_amount NUMERIC(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  purchase_date DATE,
  purchase_price NUMERIC(10,2),
  current_value NUMERIC(10,2),
  location TEXT,
  status inventory_status DEFAULT 'available',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  department TEXT,
  generated_by UUID REFERENCES profiles(id),
  data JSONB,
  file_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  period_start DATE,
  period_end DATE
);

-- Create analytics_dashboards table
CREATE TABLE IF NOT EXISTS analytics_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  created_by UUID REFERENCES employees(id),
  is_public BOOLEAN DEFAULT false,
  refresh_interval INTEGER DEFAULT 3600,
  last_refreshed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_employee_tasks_assigned_to ON employee_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_employee_tasks_status ON employee_tasks(status);
CREATE INDEX IF NOT EXISTS idx_employee_tasks_due_date ON employee_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_employee_benefits_employee ON employee_benefits(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_training_employee ON employee_training(employee_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_student ON job_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_student ON skill_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_certifications_student ON certifications(student_id);

-- Enable RLS on all new tables
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE livelihood_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE incubation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_dashboards ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (permissive for now)
CREATE POLICY "Allow all access to attendance_records" ON attendance_records FOR ALL USING (true);
CREATE POLICY "Allow all access to employee_tasks" ON employee_tasks FOR ALL USING (true);
CREATE POLICY "Allow all access to leave_requests" ON leave_requests FOR ALL USING (true);
CREATE POLICY "Allow all access to employee_benefits" ON employee_benefits FOR ALL USING (true);
CREATE POLICY "Allow all access to employee_training" ON employee_training FOR ALL USING (true);
CREATE POLICY "Allow all access to startup_applications" ON startup_applications FOR ALL USING (true);
CREATE POLICY "Allow all access to local_products" ON local_products FOR ALL USING (true);
CREATE POLICY "Allow all access to livelihood_programs" ON livelihood_programs FOR ALL USING (true);
CREATE POLICY "Allow all access to skill_assessments" ON skill_assessments FOR ALL USING (true);
CREATE POLICY "Allow all access to certifications" ON certifications FOR ALL USING (true);
CREATE POLICY "Allow all access to job_postings" ON job_postings FOR ALL USING (true);
CREATE POLICY "Allow all access to job_applications" ON job_applications FOR ALL USING (true);
CREATE POLICY "Allow all access to incubation_projects" ON incubation_projects FOR ALL USING (true);
CREATE POLICY "Allow all access to inventory_items" ON inventory_items FOR ALL USING (true);
CREATE POLICY "Allow all access to reports" ON reports FOR ALL USING (true);
CREATE POLICY "Allow all access to analytics_dashboards" ON analytics_dashboards FOR ALL USING (true);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_employee_tasks_updated_at BEFORE UPDATE ON employee_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_benefits_updated_at BEFORE UPDATE ON employee_benefits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_training_updated_at BEFORE UPDATE ON employee_training FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_startup_applications_updated_at BEFORE UPDATE ON startup_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_local_products_updated_at BEFORE UPDATE ON local_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_livelihood_programs_updated_at BEFORE UPDATE ON livelihood_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_assessments_updated_at BEFORE UPDATE ON skill_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incubation_projects_updated_at BEFORE UPDATE ON incubation_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analytics_dashboards_updated_at BEFORE UPDATE ON analytics_dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
