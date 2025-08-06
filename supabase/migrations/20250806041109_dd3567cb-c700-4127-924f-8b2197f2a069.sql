-- Modify the students and trainers tables to not require auth.users reference
-- First backup any existing data (if any)
CREATE TEMP TABLE temp_students AS SELECT * FROM public.students;
CREATE TEMP TABLE temp_trainers AS SELECT * FROM public.trainers;

-- Drop and recreate tables without foreign key to auth.users
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.trainers CASCADE;

-- Recreate students table without auth.users dependency
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Remove the foreign key constraint
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

-- Recreate trainers table without auth.users dependency
CREATE TABLE public.trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Remove the foreign key constraint
  trainer_id TEXT NOT NULL UNIQUE,
  specialization TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on trainers" ON public.trainers FOR ALL USING (true);

-- Add triggers
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trainers_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Now insert sample data
INSERT INTO public.students (user_id, student_id, date_of_birth, gender, education_level, emergency_contact, emergency_phone, status) VALUES
('00000000-0000-0000-0000-000000000001', 'STU2024002', '1996-07-22', 'female', 'Bachelor Degree', 'Sarah Johnson', '+91-9876543211', 'active'),
('00000000-0000-0000-0000-000000000002', 'STU2024003', '1994-11-08', 'male', 'Diploma', 'Michael Brown', '+91-9876543212', 'pending'),
('00000000-0000-0000-0000-000000000003', 'STU2024004', '1997-05-12', 'female', 'High School Graduate', 'Emily Davis', '+91-9876543213', 'active'),
('00000000-0000-0000-0000-000000000004', 'STU2024005', '1993-09-30', 'other', 'Master Degree', 'Alex Wilson', '+91-9876543214', 'completed');

INSERT INTO public.trainers (user_id, trainer_id, specialization, experience_years) VALUES
('00000000-0000-0000-0000-000000000005', 'TRN2024002', 'Digital Marketing', 8),
('00000000-0000-0000-0000-000000000006', 'TRN2024003', 'Data Science', 6);

-- Insert corresponding profiles
INSERT INTO public.profiles (user_id, full_name, email, phone, role) VALUES
('00000000-0000-0000-0000-000000000001', 'Jane Smith', 'jane.smith@example.com', '+91-9876543211', 'student'),
('00000000-0000-0000-0000-000000000002', 'Robert Johnson', 'robert.johnson@example.com', '+91-9876543212', 'student'),
('00000000-0000-0000-0000-000000000003', 'Maria Garcia', 'maria.garcia@example.com', '+91-9876543213', 'student'),
('00000000-0000-0000-0000-000000000004', 'David Lee', 'david.lee@example.com', '+91-9876543214', 'student'),
('00000000-0000-0000-0000-000000000005', 'Dr. Sarah Kumar', 'sarah.kumar@youthnet.in', '+91-9876543220', 'trainer'),
('00000000-0000-0000-0000-000000000006', 'Prof. Raj Patel', 'raj.patel@youthnet.in', '+91-9876543221', 'trainer');