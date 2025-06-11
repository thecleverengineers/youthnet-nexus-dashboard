
-- Create employee_tasks table for advanced task management
CREATE TABLE public.employee_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.employees(id) NOT NULL,
  assigned_by UUID REFERENCES public.employees(id),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  tags TEXT[],
  dependencies UUID[],
  attachments JSONB DEFAULT '[]'::jsonb,
  ai_complexity_score NUMERIC DEFAULT 0,
  auto_assigned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create task_comments table for collaboration
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.employee_tasks(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  comment TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_time_logs table for precise time tracking
CREATE TABLE public.task_time_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.employee_tasks(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  description TEXT,
  activity_type TEXT DEFAULT 'work' CHECK (activity_type IN ('work', 'break', 'meeting', 'research')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create advanced payroll_cycles table
CREATE TABLE public.payroll_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pay_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'approved', 'paid', 'cancelled')),
  total_gross_pay NUMERIC DEFAULT 0,
  total_deductions NUMERIC DEFAULT 0,
  total_net_pay NUMERIC DEFAULT 0,
  ai_anomaly_detected BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.employees(id),
  approved_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced payroll table with AI features
ALTER TABLE public.payroll ADD COLUMN IF NOT EXISTS cycle_id UUID REFERENCES public.payroll_cycles(id);
ALTER TABLE public.payroll ADD COLUMN IF NOT EXISTS ai_calculated BOOLEAN DEFAULT false;
ALTER TABLE public.payroll ADD COLUMN IF NOT EXISTS ai_risk_score NUMERIC DEFAULT 0;
ALTER TABLE public.payroll ADD COLUMN IF NOT EXISTS performance_bonus NUMERIC DEFAULT 0;
ALTER TABLE public.payroll ADD COLUMN IF NOT EXISTS attendance_penalty NUMERIC DEFAULT 0;

-- Create performance_metrics table for KPI tracking
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  target_value NUMERIC,
  unit TEXT DEFAULT 'points',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  auto_calculated BOOLEAN DEFAULT false,
  data_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced performance_reviews table
ALTER TABLE public.performance_reviews ADD COLUMN IF NOT EXISTS ai_generated_insights TEXT;
ALTER TABLE public.performance_reviews ADD COLUMN IF NOT EXISTS skill_assessment JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.performance_reviews ADD COLUMN IF NOT EXISTS career_recommendations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.performance_reviews ADD COLUMN IF NOT EXISTS peer_feedback JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.performance_reviews ADD COLUMN IF NOT EXISTS self_assessment JSONB DEFAULT '{}'::jsonb;

-- Create analytics_dashboards table for custom reports
CREATE TABLE public.analytics_dashboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  created_by UUID REFERENCES public.employees(id),
  is_public BOOLEAN DEFAULT false,
  refresh_interval INTEGER DEFAULT 3600,
  last_refreshed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_insights table for machine learning predictions
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('performance_prediction', 'turnover_risk', 'skill_gap', 'productivity_trend', 'cost_optimization')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('employee', 'department', 'company')),
  entity_id UUID,
  confidence_score NUMERIC NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  prediction_data JSONB NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  validity_period INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_employee_tasks_assigned_to ON public.employee_tasks(assigned_to);
CREATE INDEX idx_employee_tasks_status ON public.employee_tasks(status);
CREATE INDEX idx_employee_tasks_due_date ON public.employee_tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON public.task_comments(task_id);
CREATE INDEX idx_task_time_logs_task_id ON public.task_time_logs(task_id);
CREATE INDEX idx_performance_metrics_employee_id ON public.performance_metrics(employee_id);
CREATE INDEX idx_ai_insights_entity ON public.ai_insights(entity_type, entity_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_employee_tasks_updated_at 
  BEFORE UPDATE ON public.employee_tasks 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_cycles_updated_at 
  BEFORE UPDATE ON public.payroll_cycles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.employee_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic access control)
CREATE POLICY "Employees can view their own tasks" ON public.employee_tasks FOR SELECT USING (assigned_to = auth.uid() OR assigned_by = auth.uid());
CREATE POLICY "Managers can manage tasks" ON public.employee_tasks FOR ALL USING (true);

CREATE POLICY "Employees can view task comments" ON public.task_comments FOR SELECT USING (true);
CREATE POLICY "Employees can add task comments" ON public.task_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Employees can view their time logs" ON public.task_time_logs FOR SELECT USING (employee_id = auth.uid());
CREATE POLICY "Employees can manage their time logs" ON public.task_time_logs FOR ALL USING (employee_id = auth.uid());

CREATE POLICY "HR can manage payroll cycles" ON public.payroll_cycles FOR ALL USING (true);
CREATE POLICY "Employees can view their metrics" ON public.performance_metrics FOR SELECT USING (employee_id = auth.uid());
CREATE POLICY "Managers can view all metrics" ON public.performance_metrics FOR ALL USING (true);
