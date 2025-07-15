
-- Add super_admin to the user_role enum type
ALTER TYPE user_role ADD VALUE 'super_admin';

-- Update the handle_new_user function to support super_admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_role text;
  email_prefix text;
  timestamp_suffix text;
  profile_exists boolean;
  role_record_exists boolean;
BEGIN
  -- Extract role from user metadata, default to 'student'
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  
  -- Get email prefix for ID generation
  email_prefix := UPPER(SUBSTRING(NEW.email FROM 1 FOR 3));
  timestamp_suffix := RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6);
  
  -- Check if profile already exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
  
  -- Insert or update profile
  IF NOT profile_exists THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
      user_role
    );
  ELSE
    UPDATE public.profiles SET
      email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
      role = user_role,
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  -- Create role-specific records based on user role
  CASE user_role
    WHEN 'student' THEN
      SELECT EXISTS(SELECT 1 FROM public.students WHERE user_id = NEW.id) INTO role_record_exists;
      IF NOT role_record_exists THEN
        INSERT INTO public.students (user_id, student_id, enrollment_date, status)
        VALUES (
          NEW.id,
          'STU' || email_prefix || timestamp_suffix,
          CURRENT_DATE,
          'active'
        );
      END IF;
    
    WHEN 'trainer' THEN
      SELECT EXISTS(SELECT 1 FROM public.trainers WHERE user_id = NEW.id) INTO role_record_exists;
      IF NOT role_record_exists THEN
        INSERT INTO public.trainers (user_id, trainer_id, specialization, hire_date, status)
        VALUES (
          NEW.id,
          'TRA' || email_prefix || timestamp_suffix,
          'General Training',
          CURRENT_DATE,
          'active'
        );
      END IF;
    
    WHEN 'staff' THEN
      SELECT EXISTS(SELECT 1 FROM public.employees WHERE user_id = NEW.id) INTO role_record_exists;
      IF NOT role_record_exists THEN
        INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
        VALUES (
          NEW.id,
          'EMP' || email_prefix || timestamp_suffix,
          'Staff Member',
          'General',
          'active',
          'full_time',
          CURRENT_DATE,
          40000
        );
      END IF;
    
    WHEN 'admin' THEN
      SELECT EXISTS(SELECT 1 FROM public.employees WHERE user_id = NEW.id) INTO role_record_exists;
      IF NOT role_record_exists THEN
        INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
        VALUES (
          NEW.id,
          'ADM' || email_prefix || timestamp_suffix,
          'Administrator',
          'Administration',
          'active',
          'full_time',
          CURRENT_DATE,
          60000
        );
      END IF;
    
    WHEN 'super_admin' THEN
      SELECT EXISTS(SELECT 1 FROM public.employees WHERE user_id = NEW.id) INTO role_record_exists;
      IF NOT role_record_exists THEN
        INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
        VALUES (
          NEW.id,
          'SUP' || email_prefix || timestamp_suffix,
          'Super Administrator',
          'System Administration',
          'active',
          'full_time',
          CURRENT_DATE,
          80000
        );
      END IF;
    
    ELSE
      -- Default to student if role not recognized
      SELECT EXISTS(SELECT 1 FROM public.students WHERE user_id = NEW.id) INTO role_record_exists;
      IF NOT role_record_exists THEN
        INSERT INTO public.students (user_id, student_id, enrollment_date, status)
        VALUES (
          NEW.id,
          'STU' || email_prefix || timestamp_suffix,
          CURRENT_DATE,
          'active'
        );
      END IF;
  END CASE;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Update RLS policies to allow super_admin access to everything
-- Drop existing restrictive policies and create super_admin policies

-- Profiles table - super admin can manage all profiles
CREATE POLICY "Super admin can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Employees table - super admin can manage all employees
CREATE POLICY "Super admin can manage all employees" ON public.employees
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Students table - super admin can manage all students
CREATE POLICY "Super admin can manage all students" ON public.students
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Trainers table - super admin can manage all trainers
CREATE POLICY "Super admin can manage all trainers" ON public.trainers
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Create system settings table for website configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only super admin can manage system settings
CREATE POLICY "Super admin can manage system settings" ON public.system_settings
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Public can view public settings
CREATE POLICY "Anyone can view public settings" ON public.system_settings
  FOR SELECT USING (is_public = true);

-- Create user activity log table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on user_activity_logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Super admin can view all activity logs
CREATE POLICY "Super admin can view all activity logs" ON public.user_activity_logs
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Users can view their own activity logs
CREATE POLICY "Users can view their own activity logs" ON public.user_activity_logs
  FOR SELECT USING (user_id = auth.uid());

-- System can insert activity logs
CREATE POLICY "System can insert activity logs" ON public.user_activity_logs
  FOR INSERT WITH CHECK (true);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', '"YouthNet MIS"', 'string', 'Website name', true),
('site_description', '"Management Information System for Youth Development"', 'string', 'Website description', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false),
('max_file_upload_size', '10485760', 'number', 'Maximum file upload size in bytes', false),
('email_notifications', 'true', 'boolean', 'Enable email notifications', false),
('registration_enabled', 'true', 'boolean', 'Allow new user registrations', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Create triggers for updated_at
CREATE TRIGGER update_system_settings_updated_at 
  BEFORE UPDATE ON public.system_settings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
