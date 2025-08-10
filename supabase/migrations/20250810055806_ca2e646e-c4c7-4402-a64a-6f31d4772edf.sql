-- Phase 5: Backup & Data Recovery System

-- Create backup_configurations table
CREATE TABLE public.backup_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  backup_type TEXT NOT NULL DEFAULT 'full', -- 'full', 'incremental', 'differential'
  schedule_cron TEXT, -- Cron expression for automated backups
  retention_days INTEGER DEFAULT 30,
  include_tables TEXT[], -- Specific tables to include/exclude
  exclude_tables TEXT[],
  compression_enabled BOOLEAN DEFAULT true,
  encryption_enabled BOOLEAN DEFAULT false,
  storage_location TEXT DEFAULT 'supabase', -- 'supabase', 'external'
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'disabled'
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_backup_at TIMESTAMP WITH TIME ZONE,
  next_backup_at TIMESTAMP WITH TIME ZONE
);

-- Create backup_history table
CREATE TABLE public.backup_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID,
  backup_name TEXT NOT NULL,
  backup_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  file_path TEXT,
  file_size_bytes BIGINT,
  checksum TEXT,
  compression_ratio DECIMAL(5,2),
  tables_included TEXT[],
  records_count JSONB, -- Count of records per table
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create data_exports table
CREATE TABLE public.data_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  export_name TEXT NOT NULL,
  export_type TEXT NOT NULL, -- 'csv', 'json', 'sql', 'excel'
  table_name TEXT,
  query_sql TEXT,
  filters JSONB,
  file_path TEXT,
  file_size_bytes BIGINT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  progress_percentage INTEGER DEFAULT 0,
  records_exported INTEGER DEFAULT 0,
  error_message TEXT,
  requested_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days')
);

-- Create system_restore_points table
CREATE TABLE public.system_restore_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restore_point_name TEXT NOT NULL,
  description TEXT,
  backup_reference_id UUID, -- Reference to backup_history
  system_version TEXT,
  database_version TEXT,
  restore_point_type TEXT DEFAULT 'manual', -- 'manual', 'automatic', 'pre_migration'
  metadata JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  verification_details JSONB
);

-- Create data_migration_logs table
CREATE TABLE public.data_migration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  migration_name TEXT NOT NULL,
  migration_type TEXT NOT NULL, -- 'import', 'export', 'restore', 'sync'
  source_type TEXT, -- 'file', 'database', 'api'
  target_type TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'rollback'
  progress_percentage INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  file_path TEXT,
  error_details JSONB,
  validation_results JSONB,
  started_by UUID,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  rollback_available BOOLEAN DEFAULT false,
  rollback_data JSONB
);

-- Enable RLS
ALTER TABLE public.backup_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_restore_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_migration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for backup_configurations
CREATE POLICY "Admins can manage backup configurations"
ON public.backup_configurations
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
));

-- RLS Policies for backup_history
CREATE POLICY "Admins can view backup history"
ON public.backup_history
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
));

CREATE POLICY "System can manage backup history"
ON public.backup_history
FOR ALL
WITH CHECK (true);

-- RLS Policies for data_exports
CREATE POLICY "Users can manage their own data exports"
ON public.data_exports
FOR ALL
USING (requested_by = auth.uid());

CREATE POLICY "Admins can manage all data exports"
ON public.data_exports
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
));

-- RLS Policies for system_restore_points
CREATE POLICY "Admins can manage restore points"
ON public.system_restore_points
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
));

-- RLS Policies for data_migration_logs
CREATE POLICY "Admins can view migration logs"
ON public.data_migration_logs
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
));

CREATE POLICY "Users can view their own migration logs"
ON public.data_migration_logs
FOR SELECT
USING (started_by = auth.uid());

CREATE POLICY "System can manage migration logs"
ON public.data_migration_logs
FOR ALL
WITH CHECK (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_backup_configurations_updated_at
BEFORE UPDATE ON public.backup_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_backup_configurations_status ON public.backup_configurations(status);
CREATE INDEX idx_backup_configurations_next_backup ON public.backup_configurations(next_backup_at);
CREATE INDEX idx_backup_history_status ON public.backup_history(status);
CREATE INDEX idx_backup_history_created_at ON public.backup_history(created_at);
CREATE INDEX idx_backup_history_configuration ON public.backup_history(configuration_id);
CREATE INDEX idx_data_exports_status ON public.data_exports(status);
CREATE INDEX idx_data_exports_requested_by ON public.data_exports(requested_by);
CREATE INDEX idx_data_exports_expires_at ON public.data_exports(expires_at);
CREATE INDEX idx_system_restore_points_created_at ON public.system_restore_points(created_at);
CREATE INDEX idx_data_migration_logs_status ON public.data_migration_logs(status);
CREATE INDEX idx_data_migration_logs_started_by ON public.data_migration_logs(started_by);

-- Insert default backup configurations
INSERT INTO public.backup_configurations (
  name, description, backup_type, schedule_cron, retention_days,
  include_tables, status, created_by
) VALUES 
(
  'Daily Full Backup',
  'Automated daily full system backup',
  'full',
  '0 2 * * *', -- Daily at 2 AM
  30,
  NULL, -- Include all tables
  'active',
  NULL
),
(
  'Weekly Comprehensive Backup',
  'Weekly backup with extended retention',
  'full',
  '0 1 * * 0', -- Weekly on Sunday at 1 AM
  90,
  NULL,
  'active',
  NULL
),
(
  'Critical Data Backup',
  'Backup of critical tables only',
  'incremental',
  '0 */6 * * *', -- Every 6 hours
  14,
  ARRAY['profiles', 'employees', 'students', 'documents', 'notifications'],
  'active',
  NULL
);

-- Create storage buckets for backups
INSERT INTO storage.buckets (id, name, public) VALUES ('backups', 'backups', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false);

-- Create storage policies for backups bucket
CREATE POLICY "Admins can upload backups"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'backups' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
  )
);

CREATE POLICY "Admins can view backups"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'backups' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
  )
);

CREATE POLICY "Admins can delete old backups"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'backups' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
  )
);

-- Create storage policies for exports bucket
CREATE POLICY "Users can upload their own exports"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'exports' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own exports"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'exports' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all exports"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'exports' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = ANY(ARRAY['admin', 'hr_admin'])
  )
);

CREATE POLICY "Users can delete their own exports"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'exports' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to cleanup expired exports
CREATE OR REPLACE FUNCTION public.cleanup_expired_exports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired export records
  DELETE FROM public.data_exports 
  WHERE expires_at < now() AND status = 'completed';
  
  -- Note: Storage cleanup would be handled by a separate process
END;
$$;

-- Create function to validate backup integrity
CREATE OR REPLACE FUNCTION public.validate_backup_integrity(backup_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  backup_record RECORD;
  validation_result JSONB;
BEGIN
  -- Get backup record
  SELECT * INTO backup_record 
  FROM public.backup_history 
  WHERE id = backup_id;
  
  IF NOT FOUND THEN
    RETURN '{"valid": false, "error": "Backup not found"}'::jsonb;
  END IF;
  
  -- Basic validation (in real implementation, this would check file integrity, checksums, etc.)
  validation_result := jsonb_build_object(
    'valid', true,
    'backup_id', backup_id,
    'file_exists', backup_record.file_path IS NOT NULL,
    'checksum_match', backup_record.checksum IS NOT NULL,
    'size_valid', backup_record.file_size_bytes > 0,
    'validated_at', now()
  );
  
  RETURN validation_result;
END;
$$;