
-- First, let's drop the existing broken trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved handle_new_user function
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
          'pending'
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
          'pending'
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now let's fix the existing admin user by creating the missing employee record
DO $$
DECLARE
  admin_user_id uuid;
  admin_email text;
  employee_exists boolean;
BEGIN
  -- Find the admin user
  SELECT id, email INTO admin_user_id, admin_email
  FROM public.profiles 
  WHERE role = 'admin' 
  LIMIT 1;
  
  -- If we found an admin user, check if employee record exists and create if needed
  IF admin_user_id IS NOT NULL THEN
    SELECT EXISTS(SELECT 1 FROM public.employees WHERE user_id = admin_user_id) INTO employee_exists;
    
    IF NOT employee_exists THEN
      INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
      VALUES (
        admin_user_id,
        'ADM' || UPPER(SUBSTRING(admin_email FROM 1 FOR 3)) || RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6),
        'Administrator',
        'Administration',
        'active',
        'full_time',
        CURRENT_DATE,
        60000
      );
      
      RAISE NOTICE 'Created employee record for admin user: %', admin_user_id;
    ELSE
      RAISE NOTICE 'Employee record already exists for admin user: %', admin_user_id;
    END IF;
  ELSE
    RAISE NOTICE 'No admin user found in profiles table';
  END IF;
END $$;
