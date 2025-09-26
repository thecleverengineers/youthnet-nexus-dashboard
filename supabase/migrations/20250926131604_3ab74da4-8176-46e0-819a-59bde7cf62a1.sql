-- Add missing columns to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS employment_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full_time',
ADD COLUMN IF NOT EXISTS salary numeric(12,2);

-- Create export_logs table for tracking data exports
CREATE TABLE IF NOT EXISTS public.export_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  export_type TEXT NOT NULL,
  export_format TEXT NOT NULL,
  record_count INTEGER,
  file_path TEXT,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for export_logs
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for export_logs
CREATE POLICY "Admin can manage export logs" 
ON public.export_logs 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Staff can view export logs" 
ON public.export_logs 
FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'staff'::user_role);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_employees_employment_status ON public.employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_export_logs_created_by ON public.export_logs(created_by);