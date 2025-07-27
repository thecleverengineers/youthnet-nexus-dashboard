-- Security Migration: Fix role enum (Part 2 - Create enum and update column)
-- 1. Create proper role enum to prevent privilege escalation
CREATE TYPE public.user_role AS ENUM ('student', 'trainer', 'staff', 'admin');

-- 2. Update profiles table to use enum instead of text
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- 3. Create security definer functions (proper search_path)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.has_role(check_role user_role, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = check_role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.has_role('admin'::public.user_role, user_id);
$$;