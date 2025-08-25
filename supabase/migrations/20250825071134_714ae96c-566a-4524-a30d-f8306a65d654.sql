-- Create skill_assessments table
CREATE TABLE public.skill_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'beginner',
  max_score INTEGER DEFAULT 100,
  passing_score INTEGER DEFAULT 70,
  duration_minutes INTEGER DEFAULT 60,
  created_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skill_assessment_trainers table (admin assigns trainers)
CREATE TABLE public.skill_assessment_trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES skill_assessments(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES trainers(id),
  assigned_by UUID REFERENCES profiles(user_id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, trainer_id)
);

-- Create skill_assessment_students table (trainers assign students)
CREATE TABLE public.skill_assessment_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES skill_assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(user_id),
  trainer_id UUID NOT NULL REFERENCES trainers(id),
  assigned_by UUID REFERENCES profiles(user_id),
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  next_assessment_date DATE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, student_id)
);

-- Enable RLS
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessment_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessment_students ENABLE ROW LEVEL SECURITY;

-- Policies for skill_assessments
CREATE POLICY "Anyone can view assessments" 
ON public.skill_assessments 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage assessments" 
ON public.skill_assessments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policies for skill_assessment_trainers
CREATE POLICY "Anyone can view trainer assignments" 
ON public.skill_assessment_trainers 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can assign trainers" 
ON public.skill_assessment_trainers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can remove trainer assignments" 
ON public.skill_assessment_trainers 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policies for skill_assessment_students
CREATE POLICY "View student assignments" 
ON public.skill_assessment_students 
FOR SELECT 
USING (
  -- Students can see their own assignments
  student_id = auth.uid()
  OR
  -- Trainers can see students they assigned
  EXISTS (
    SELECT 1 FROM trainers 
    WHERE trainers.id = skill_assessment_students.trainer_id 
    AND trainers.user_id = auth.uid()
  )
  OR
  -- Admins can see all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Trainers can assign students to their assessments" 
ON public.skill_assessment_students 
FOR INSERT 
WITH CHECK (
  -- Trainer must be assigned to this assessment
  EXISTS (
    SELECT 1 FROM skill_assessment_trainers sat
    JOIN trainers t ON t.id = sat.trainer_id
    WHERE sat.assessment_id = skill_assessment_students.assessment_id
    AND t.user_id = auth.uid()
  )
);

CREATE POLICY "Trainers can update their student assignments" 
ON public.skill_assessment_students 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM trainers 
    WHERE trainers.id = skill_assessment_students.trainer_id 
    AND trainers.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_skill_assessments_updated_at
BEFORE UPDATE ON public.skill_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();