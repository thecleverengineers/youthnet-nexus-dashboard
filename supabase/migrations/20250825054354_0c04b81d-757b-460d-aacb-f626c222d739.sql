-- Add ID columns to profiles table for easier login with user IDs
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trainer_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON public.profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_profiles_trainer_id ON public.profiles(trainer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles(student_id);