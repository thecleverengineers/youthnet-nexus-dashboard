-- Add missing RLS policies for security compliance

-- Enable RLS on tables that don't have it
ALTER TABLE public.payroll_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for payroll_cycles
CREATE POLICY "Admins and HR can manage payroll cycles"
ON public.payroll_cycles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Add RLS policies for payroll
CREATE POLICY "Admins and HR can manage payroll"
ON public.payroll
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

CREATE POLICY "Employees can view their own payroll"
ON public.payroll
FOR SELECT
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

-- Add RLS policies for notification_settings
CREATE POLICY "Users can manage their own notification settings"
ON public.notification_settings
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all notification settings"
ON public.notification_settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add RLS policies for system_backups
CREATE POLICY "Admins can manage system backups"
ON public.system_backups
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Update existing database functions to use proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Update user_has_feature_access function
CREATE OR REPLACE FUNCTION public.user_has_feature_access(user_id uuid, feature_key text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_role_assignments ura
    JOIN role_features rf ON ura.role_id = rf.role_id
    JOIN system_features sf ON rf.feature_id = sf.id
    WHERE ura.user_id = user_id 
    AND sf.feature_key = feature_key
    AND ura.is_active = true
    AND sf.is_active = true
  );
END;
$function$;