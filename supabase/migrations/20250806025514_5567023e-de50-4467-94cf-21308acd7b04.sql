-- Fix the function search path issue
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Add security definer to the function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;