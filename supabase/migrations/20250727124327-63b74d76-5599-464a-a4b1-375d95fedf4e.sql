-- Security Migration: Create enum and secure functions (fixed)
-- 1. Create proper role enum
CREATE TYPE public.user_role AS ENUM ('student', 'trainer', 'staff', 'admin');

-- 2. Update profiles table to use enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- 3. Create secure functions
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = COALESCE(user_id, auth.uid()) 
    AND role = 'admin'::public.user_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(check_role text, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = COALESCE(user_id, auth.uid()) 
    AND role::text = check_role
  );
$$;