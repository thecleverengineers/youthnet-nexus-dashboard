
-- First, ensure all required types exist
DO $$ 
BEGIN
    -- Create user_role enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'trainer', 'staff', 'admin');
    END IF;
    
    -- Create employment_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employment_type') THEN
        CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
    END IF;
    
    -- Create training_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'training_status') THEN
        CREATE TYPE training_status AS ENUM ('pending', 'active', 'completed', 'dropped');
    END IF;
END $$;

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    phone text,
    address text,
    department text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure students table exists
CREATE TABLE IF NOT EXISTS public.students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id text UNIQUE NOT NULL,
    date_of_birth date,
    gender text,
    education_level text,
    emergency_contact text,
    emergency_phone text,
    enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
    status training_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure trainers table exists
CREATE TABLE IF NOT EXISTS public.trainers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    trainer_id text UNIQUE NOT NULL,
    specialization text NOT NULL,
    qualification text,
    experience_years integer,
    hire_date date NOT NULL DEFAULT CURRENT_DATE,
    status text NOT NULL DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure employees table exists
CREATE TABLE IF NOT EXISTS public.employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id text UNIQUE NOT NULL,
    position text NOT NULL,
    department text NOT NULL,
    manager_id uuid REFERENCES public.employees(id),
    employment_status text NOT NULL DEFAULT 'active',
    employment_type employment_type DEFAULT 'full_time',
    salary numeric,
    hire_date date,
    join_date date DEFAULT CURRENT_DATE,
    contract_end_date date,
    probation_end_date date,
    date_of_joining date,
    gender text,
    tax_id text,
    bank_account text,
    emergency_contact_name text,
    emergency_contact_phone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Drop and recreate the trigger function to ensure it works properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

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
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
