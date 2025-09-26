-- Step 1: Create a SECURITY DEFINER function to get user role (fixes infinite recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(check_user_id uuid)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = check_user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Step 2: Drop and recreate the problematic RLS policy for profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'admin'::user_role);

-- Step 3: Create education_courses table
CREATE TABLE IF NOT EXISTS public.education_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_code TEXT NOT NULL UNIQUE,
  description TEXT,
  department TEXT,
  credits INTEGER DEFAULT 3,
  duration_weeks INTEGER DEFAULT 12,
  max_students INTEGER DEFAULT 30,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for education_courses
ALTER TABLE public.education_courses ENABLE ROW LEVEL SECURITY;

-- Create policies for education_courses
CREATE POLICY "Anyone can view active courses" 
ON public.education_courses 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admin can manage courses" 
ON public.education_courses 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Staff can view all courses" 
ON public.education_courses 
FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'staff'::user_role);

-- Step 4: Create course_enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.education_courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'enrolled',
  assignment_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Enable RLS for course_enrollments
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for course_enrollments
CREATE POLICY "Students can view their own enrollments" 
ON public.course_enrollments 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Admin can manage all enrollments" 
ON public.course_enrollments 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Staff can view and create enrollments" 
ON public.course_enrollments 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'staff'::user_role);

-- Step 5: Create update triggers for new tables
CREATE TRIGGER update_education_courses_updated_at
BEFORE UPDATE ON public.education_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Create indexes for better performance
CREATE INDEX idx_course_enrollments_student_id ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX idx_education_courses_status ON public.education_courses(status);
CREATE INDEX idx_education_courses_code ON public.education_courses(course_code);