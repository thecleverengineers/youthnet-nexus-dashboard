-- Phase 2: Enhanced Audit & Logging System

-- Create data_change_history table for before/after tracking
CREATE TABLE IF NOT EXISTS public.data_change_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  before_data JSONB,
  after_data JSONB,
  changed_fields TEXT[],
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on data_change_history
ALTER TABLE public.data_change_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_change_history
CREATE POLICY "Admins can view all data changes" 
ON public.data_change_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

CREATE POLICY "System can insert data changes" 
ON public.data_change_history 
FOR INSERT 
WITH CHECK (true);

-- Create error_logs table for system error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  page_url TEXT,
  user_action TEXT,
  severity TEXT DEFAULT 'error', -- error, warning, critical
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for error_logs
CREATE POLICY "Admins can manage all error logs" 
ON public.error_logs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

CREATE POLICY "System can insert error logs" 
ON public.error_logs 
FOR INSERT 
WITH CHECK (true);

-- Create login_attempts table for security monitoring
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on login_attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for login_attempts
CREATE POLICY "Admins can view all login attempts" 
ON public.login_attempts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

CREATE POLICY "System can insert login attempts" 
ON public.login_attempts 
FOR INSERT 
WITH CHECK (true);

-- Create system_metrics table for performance monitoring
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  tags JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system_metrics
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for system_metrics
CREATE POLICY "Admins can view all system metrics" 
ON public.system_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

CREATE POLICY "System can insert metrics" 
ON public.system_metrics 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_data_change_history_table_record ON public.data_change_history(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_data_change_history_user_id ON public.data_change_history(user_id);
CREATE INDEX IF NOT EXISTS idx_data_change_history_created_at ON public.data_change_history(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON public.login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON public.login_attempts(success);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON public.system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON public.system_metrics(recorded_at);