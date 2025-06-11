
-- Create comprehensive HR tables with advanced features

-- Employee positions and departments enum
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'intern', 'consultant');
CREATE TYPE employment_status AS ENUM ('active', 'inactive', 'terminated', 'on_leave', 'probation');
CREATE TYPE leave_type AS ENUM ('vacation', 'sick', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE performance_rating AS ENUM ('excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory');

-- Enhanced employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_type employment_type DEFAULT 'full_time';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS probation_end_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS contract_end_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tax_id TEXT;

-- Leave management table
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

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL,
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  overtime_rate DECIMAL(8,2) DEFAULT 0,
  bonuses DECIMAL(10,2) DEFAULT 0,
  deductions DECIMAL(10,2) DEFAULT 0,
  gross_pay DECIMAL(12,2) NOT NULL,
  tax_deductions DECIMAL(10,2) DEFAULT 0,
  net_pay DECIMAL(12,2) NOT NULL,
  payment_date DATE,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Performance reviews table
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES employees(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating performance_rating NOT NULL,
  goals_achieved TEXT,
  areas_for_improvement TEXT,
  strengths TEXT,
  development_plan TEXT,
  next_review_date DATE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Employee benefits table
CREATE TABLE IF NOT EXISTS employee_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  benefit_type TEXT NOT NULL,
  benefit_name TEXT NOT NULL,
  provider TEXT,
  coverage_amount DECIMAL(10,2),
  premium_amount DECIMAL(8,2),
  employee_contribution DECIMAL(8,2),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Training and development table
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
  cost DECIMAL(8,2),
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_period ON payroll(pay_period_start, pay_period_end);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_benefits_employee ON employee_benefits(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_training_employee ON employee_training(employee_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON performance_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_benefits_updated_at BEFORE UPDATE ON employee_benefits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_training_updated_at BEFORE UPDATE ON employee_training FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
