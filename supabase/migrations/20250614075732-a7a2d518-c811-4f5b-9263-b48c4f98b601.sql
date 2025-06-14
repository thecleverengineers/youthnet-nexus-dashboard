
-- Create the user_role enum type first
CREATE TYPE user_role AS ENUM ('student', 'trainer', 'staff', 'admin');

-- Create other enum types that are referenced
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE training_status AS ENUM ('pending', 'active', 'completed', 'dropped');

-- First, let's ensure we have the proper trigger to handle new user creation
-- This trigger will automatically create profile and role-specific records when users sign up

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_role text;
  email_prefix text;
  timestamp_suffix text;
BEGIN
  -- Extract role from user metadata, default to 'student'
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  
  -- Get email prefix for ID generation
  email_prefix := UPPER(SUBSTRING(NEW.email FROM 1 FOR 3));
  timestamp_suffix := RIGHT(EXTRACT(EPOCH FROM NOW())::text, 6);
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    user_role::user_role
  );
  
  -- Create role-specific records based on user role
  CASE user_role
    WHEN 'student' THEN
      INSERT INTO public.students (user_id, student_id, enrollment_date, status)
      VALUES (
        NEW.id,
        'STU' || email_prefix || timestamp_suffix,
        CURRENT_DATE,
        'pending'::training_status
      );
    
    WHEN 'trainer' THEN
      INSERT INTO public.trainers (user_id, trainer_id, specialization, hire_date, status)
      VALUES (
        NEW.id,
        'TRA' || email_prefix || timestamp_suffix,
        'General Training',
        CURRENT_DATE,
        'active'
      );
    
    WHEN 'staff' THEN
      INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
      VALUES (
        NEW.id,
        'EMP' || email_prefix || timestamp_suffix,
        'Staff Member',
        'General',
        'active',
        'full_time'::employment_type,
        CURRENT_DATE,
        40000
      );
    
    WHEN 'admin' THEN
      INSERT INTO public.employees (user_id, employee_id, position, department, employment_status, employment_type, hire_date, salary)
      VALUES (
        NEW.id,
        'ADM' || email_prefix || timestamp_suffix,
        'Administrator',
        'Administration',
        'active',
        'full_time'::employment_type,
        CURRENT_DATE,
        60000
      );
    
    ELSE
      -- Default to student if role not recognized
      INSERT INTO public.students (user_id, student_id, enrollment_date, status)
      VALUES (
        NEW.id,
        'STU' || email_prefix || timestamp_suffix,
        CURRENT_DATE,
        'pending'::training_status
      );
  END CASE;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert test users if they don't exist (for the quick login buttons)
DO $$
BEGIN
  -- Check if test users exist, if not create them
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@youthnet.in') THEN
    -- We can't directly insert into auth.users, but we can ensure the profiles exist
    -- The actual user creation will happen through the signup process
    NULL;
  END IF;
END $$;
