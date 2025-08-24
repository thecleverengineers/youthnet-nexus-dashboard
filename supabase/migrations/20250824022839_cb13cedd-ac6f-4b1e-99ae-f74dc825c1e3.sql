-- Create missing tables for full HR functionality

-- Create payroll_cycles table
CREATE TABLE IF NOT EXISTS public.payroll_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pay_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payroll_cycles ENABLE ROW LEVEL SECURITY;

-- Create policies for payroll_cycles
CREATE POLICY "HR can manage payroll cycles" 
ON public.payroll_cycles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'hr_admin', 'staff')
  )
);

-- Update payroll_entries to link with cycles
ALTER TABLE public.payroll_entries 
ADD COLUMN IF NOT EXISTS cycle_id UUID REFERENCES public.payroll_cycles(id),
ADD COLUMN IF NOT EXISTS overtime_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS overtime_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_risk_score NUMERIC DEFAULT 0;

-- Add more fields to performance_reviews for comprehensive tracking
ALTER TABLE public.performance_reviews 
ADD COLUMN IF NOT EXISTS review_period TEXT,
ADD COLUMN IF NOT EXISTS technical_skills NUMERIC,
ADD COLUMN IF NOT EXISTS communication NUMERIC,
ADD COLUMN IF NOT EXISTS leadership NUMERIC,
ADD COLUMN IF NOT EXISTS problem_solving NUMERIC,
ADD COLUMN IF NOT EXISTS teamwork NUMERIC,
ADD COLUMN IF NOT EXISTS innovation NUMERIC,
ADD COLUMN IF NOT EXISTS employee_name TEXT,
ADD COLUMN IF NOT EXISTS reviewer_name TEXT;

-- Add fields to employee_tasks for better tracking
ALTER TABLE public.employee_tasks 
ADD COLUMN IF NOT EXISTS assigned_to TEXT,
ADD COLUMN IF NOT EXISTS overtime_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS overtime_rate NUMERIC DEFAULT 0;

-- Create export_logs table to track exports
CREATE TABLE IF NOT EXISTS public.export_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  export_type TEXT NOT NULL,
  export_format TEXT NOT NULL,
  exported_by UUID REFERENCES public.profiles(user_id),
  export_data JSONB,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own exports" 
ON public.export_logs 
FOR SELECT 
USING (exported_by = auth.uid());

CREATE POLICY "HR can view all exports" 
ON public.export_logs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'hr_admin')
  )
);

-- Create attendance_statistics view for analytics
CREATE OR REPLACE VIEW public.attendance_statistics AS
SELECT 
  employee_id,
  COUNT(*) as total_days,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
  COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
  COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
  ROUND(COUNT(CASE WHEN status = 'present' THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) as attendance_rate
FROM public.attendance_records
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY employee_id;

-- Create task_statistics view
CREATE OR REPLACE VIEW public.task_statistics AS
SELECT 
  assigned_to as employee_id,
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
  AVG(completion_percentage) as avg_completion,
  SUM(estimated_hours) as total_estimated_hours,
  SUM(actual_hours) as total_actual_hours
FROM public.employee_tasks
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY assigned_to;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payroll_cycles_status ON public.payroll_cycles(status);
CREATE INDEX IF NOT EXISTS idx_payroll_cycles_dates ON public.payroll_cycles(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payroll_entries_cycle ON public.payroll_entries(cycle_id);
CREATE INDEX IF NOT EXISTS idx_export_logs_user ON public.export_logs(exported_by);
CREATE INDEX IF NOT EXISTS idx_export_logs_type ON public.export_logs(export_type);

-- Add triggers for updated_at
CREATE TRIGGER update_payroll_cycles_updated_at
BEFORE UPDATE ON public.payroll_cycles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample payroll cycles to get started
INSERT INTO public.payroll_cycles (cycle_name, start_date, end_date, pay_date, status)
VALUES 
  ('January 2025', '2025-01-01', '2025-01-31', '2025-02-05', 'completed'),
  ('February 2025', '2025-02-01', '2025-02-28', '2025-03-05', 'processing'),
  ('March 2025', '2025-03-01', '2025-03-31', '2025-04-05', 'draft')
ON CONFLICT DO NOTHING;