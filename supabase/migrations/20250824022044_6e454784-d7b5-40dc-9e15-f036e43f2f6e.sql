-- Create employee_sessions table for tracking logins
CREATE TABLE IF NOT EXISTS public.employee_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employee_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for employee_sessions
CREATE POLICY "Employees can view their own sessions" 
ON public.employee_sessions 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can manage sessions" 
ON public.employee_sessions 
FOR ALL 
USING (true);

-- Create reports table for analytics
CREATE TABLE IF NOT EXISTS public.hr_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  department TEXT,
  date_range_start DATE,
  date_range_end DATE,
  generated_by UUID REFERENCES public.profiles(user_id),
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hr_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for hr_reports
CREATE POLICY "HR and admins can manage reports" 
ON public.hr_reports 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'hr_admin', 'staff')
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_tasks_employee_id ON public.employee_tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_tasks_status ON public.employee_tasks(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_employee_date ON public.attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee ON public.performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_entries_employee_period ON public.payroll_entries(employee_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_employee_sessions_employee ON public.employee_sessions(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_sessions_active ON public.employee_sessions(is_active);

-- Add missing columns to existing tables if needed
ALTER TABLE public.employee_tasks 
ADD COLUMN IF NOT EXISTS assigned_to_name TEXT,
ADD COLUMN IF NOT EXISTS department TEXT;

ALTER TABLE public.performance_reviews
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS position TEXT;

-- Create triggers for updated_at columns
CREATE TRIGGER update_employee_sessions_updated_at
BEFORE UPDATE ON public.employee_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hr_reports_updated_at
BEFORE UPDATE ON public.hr_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();