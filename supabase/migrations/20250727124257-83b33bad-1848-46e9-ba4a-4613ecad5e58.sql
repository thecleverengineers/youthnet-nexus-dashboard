-- Security Migration: Implement role enum and secure functions
-- 1. Create proper role enum
CREATE TYPE public.user_role AS ENUM ('student', 'trainer', 'staff', 'admin');

-- 2. Update profiles table to use enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- 3. Create secure functions with proper search_path
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

-- 4. Recreate critical RLS policies with proper security
-- Profiles table policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Users can update their own profile (non-role fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (OLD.role = NEW.role OR public.is_admin())
);

-- User activities policies
CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admin can manage user activities" 
ON public.user_activities 
FOR ALL 
USING (public.is_admin());

-- Notification settings policies
CREATE POLICY "Users can view their notification settings" 
ON public.notification_settings 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their notification settings" 
ON public.notification_settings 
FOR ALL 
USING (user_id = auth.uid() OR public.is_admin());