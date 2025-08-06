-- Create education system tables

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  education_level TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'dropped')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trainers table  
CREATE TABLE public.trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trainer_id TEXT NOT NULL UNIQUE,
  specialization TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training programs table
CREATE TABLE public.training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL,
  max_participants INTEGER,
  trainer_id UUID REFERENCES public.trainers(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'dropped')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student enrollments table
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_date DATE,
  grade TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'dropped', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, program_id)
);

-- Education courses table (for formal education management)
CREATE TABLE public.education_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_code TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_months INTEGER,
  credits INTEGER,
  department TEXT,
  max_students INTEGER,
  instructor_id UUID REFERENCES public.trainers(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.education_courses(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  assignment_reason TEXT,
  completion_date DATE,
  final_grade TEXT,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now, can be refined later)
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on trainers" ON public.trainers FOR ALL USING (true);
CREATE POLICY "Allow all operations on training_programs" ON public.training_programs FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_enrollments" ON public.student_enrollments FOR ALL USING (true);
CREATE POLICY "Allow all operations on education_courses" ON public.education_courses FOR ALL USING (true);
CREATE POLICY "Allow all operations on course_enrollments" ON public.course_enrollments FOR ALL USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trainers_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_programs_updated_at
  BEFORE UPDATE ON public.training_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_enrollments_updated_at
  BEFORE UPDATE ON public.student_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_courses_updated_at
  BEFORE UPDATE ON public.education_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();