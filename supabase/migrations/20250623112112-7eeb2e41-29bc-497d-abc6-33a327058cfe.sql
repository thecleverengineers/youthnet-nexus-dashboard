
-- Fix missing role-specific records for existing demo users
-- First, let's check and create missing student records
INSERT INTO public.students (user_id, student_id, enrollment_date, status)
SELECT 
  p.id,
  'STU' || UPPER(SUBSTRING(p.email FROM 1 FOR 3)) || RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6),
  CURRENT_DATE,
  'active'
FROM public.profiles p
LEFT JOIN public.students s ON p.id = s.user_id
WHERE p.role = 'student' AND s.user_id IS NULL;

-- Create missing trainer records
INSERT INTO public.trainers (user_id, trainer_id, specialization, hire_date, status)
SELECT 
  p.id,
  'TRA' || UPPER(SUBSTRING(p.email FROM 1 FOR 3)) || RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6),
  'General Training',
  CURRENT_DATE,
  'active'
FROM public.profiles p
LEFT JOIN public.trainers t ON p.id = t.user_id
WHERE p.role = 'trainer' AND t.user_id IS NULL;

-- Create missing employee records for staff users
INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
SELECT 
  p.id,
  'EMP' || UPPER(SUBSTRING(p.email FROM 1 FOR 3)) || RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6),
  'Staff Member',
  'General',
  'active',
  'full_time',
  CURRENT_DATE,
  40000
FROM public.profiles p
LEFT JOIN public.employees e ON p.id = e.user_id
WHERE p.role = 'staff' AND e.user_id IS NULL;

-- Ensure admin users have employee records
INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
SELECT 
  p.id,
  'ADM' || UPPER(SUBSTRING(p.email FROM 1 FOR 3)) || RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6),
  'Administrator',
  'Administration',
  'active',
  'full_time',
  CURRENT_DATE,
  60000
FROM public.profiles p
LEFT JOIN public.employees e ON p.id = e.user_id
WHERE p.role = 'admin' AND e.user_id IS NULL;

-- Update the handle_new_user function to be more robust
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
