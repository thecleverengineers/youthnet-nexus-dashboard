-- Create course_enrollments table for assigning students to courses
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.education_courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  enrolled_by UUID REFERENCES public.profiles(user_id),
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_date DATE,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  grade TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins and staff can manage course enrollments"
ON public.course_enrollments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'hr_admin', 'staff')
  )
);

CREATE POLICY "Students can view their own enrollments"
ON public.course_enrollments
FOR SELECT
USING (student_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_course_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();