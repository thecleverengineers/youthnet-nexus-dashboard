-- Security Migration: Critical Fixes
-- 1. Create proper role enum to prevent privilege escalation
CREATE TYPE public.user_role AS ENUM ('student', 'trainer', 'staff', 'admin');

-- 2. Update profiles table to use enum instead of text
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- 3. Add constraint to prevent unauthorized role changes
ALTER TABLE public.profiles 
ADD CONSTRAINT check_role_assignment 
CHECK (
  CASE 
    WHEN role = 'admin' THEN auth.uid() IS NOT NULL
    ELSE true
  END
);

-- 4. Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- 5. Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(check_role user_role, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = check_role
  );
$$;

-- 6. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role('admin', user_id);
$$;

-- 7. Update overly permissive RLS policies

-- Fix employees table RLS (was: using: true)
DROP POLICY IF EXISTS "Authenticated users can manage employees" ON public.employees;
CREATE POLICY "Users can view their own employee record" 
ON public.employees 
FOR SELECT 
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin can manage all employees" 
ON public.employees 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Staff can insert their own employee record" 
ON public.employees 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Fix trainers table RLS (was: using: true)
DROP POLICY IF EXISTS "Authenticated users can manage trainers" ON public.trainers;
CREATE POLICY "Users can view trainers" 
ON public.trainers 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage trainers" 
ON public.trainers 
FOR INSERT, UPDATE, DELETE 
USING (public.is_admin());

CREATE POLICY "Trainers can update their own record" 
ON public.trainers 
FOR UPDATE 
USING (user_id = auth.uid());

-- Fix training_programs table RLS (was: using: true)
DROP POLICY IF EXISTS "Authenticated users can manage training programs" ON public.training_programs;
CREATE POLICY "Users can view training programs" 
ON public.training_programs 
FOR SELECT 
USING (true);

CREATE POLICY "Admin and trainers can manage training programs" 
ON public.training_programs 
FOR INSERT, UPDATE, DELETE 
USING (public.is_admin() OR public.has_role('trainer') OR public.has_role('staff'));

-- Fix reports table RLS (was: using: true)
DROP POLICY IF EXISTS "Allow all access to reports" ON public.reports;
CREATE POLICY "Users can view relevant reports" 
ON public.reports 
FOR SELECT 
USING (
  public.is_admin() OR 
  generated_by = auth.uid() OR
  department IN (
    SELECT department FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admin and staff can manage reports" 
ON public.reports 
FOR INSERT, UPDATE, DELETE 
USING (public.is_admin() OR public.has_role('staff'));

-- Fix inventory_items table RLS (was: using: true)
DROP POLICY IF EXISTS "Allow all access to inventory_items" ON public.inventory_items;
CREATE POLICY "Users can view inventory items" 
ON public.inventory_items 
FOR SELECT 
USING (true);

CREATE POLICY "Admin and staff can manage inventory" 
ON public.inventory_items 
FOR INSERT, UPDATE, DELETE 
USING (public.is_admin() OR public.has_role('staff'));

-- Fix job_postings table RLS (was: using: true)
DROP POLICY IF EXISTS "Allow all access to job_postings" ON public.job_postings;
CREATE POLICY "Anyone can view active job postings" 
ON public.job_postings 
FOR SELECT 
USING (status = 'open');

CREATE POLICY "Admin and staff can manage job postings" 
ON public.job_postings 
FOR INSERT, UPDATE, DELETE 
USING (public.is_admin() OR public.has_role('staff'));

CREATE POLICY "Users can view their own job postings" 
ON public.job_postings 
FOR SELECT 
USING (posted_by = auth.uid());

-- 8. Improve profiles table RLS policies
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Restrict profile updates to prevent privilege escalation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile (non-role fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (OLD.role = NEW.role OR public.is_admin()) -- Only admin can change roles
);

-- 9. Add audit logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admin can view audit logs
CREATE POLICY "Admin can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (public.is_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- 10. Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.security_audit_log (
      user_id, action, table_name, record_id, old_values
    ) VALUES (
      auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.security_audit_log (
      user_id, action, table_name, record_id, old_values, new_values
    ) VALUES (
      auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.security_audit_log (
      user_id, action, table_name, record_id, new_values
    ) VALUES (
      auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_employees_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- 11. Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user ID
  action text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true);

-- 12. Add session security table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now()
);

-- Enable RLS on sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (user_id = auth.uid());

-- Admin can view all sessions
CREATE POLICY "Admin can view all sessions" 
ON public.user_sessions 
FOR SELECT 
USING (public.is_admin());

-- Only system can manage sessions
CREATE POLICY "System can manage sessions" 
ON public.user_sessions 
FOR INSERT, UPDATE, DELETE 
USING (true);