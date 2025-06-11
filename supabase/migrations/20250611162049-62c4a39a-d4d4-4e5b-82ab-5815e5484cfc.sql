
-- Create skill_assessments table
CREATE TABLE public.skill_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  last_assessed DATE,
  next_assessment DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'expired')),
  issue_date DATE,
  expiry_date DATE,
  expected_completion DATE,
  credential_id TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on skill_assessments
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for skill_assessments
CREATE POLICY "Users can view skill assessments" 
  ON public.skill_assessments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create skill assessments" 
  ON public.skill_assessments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update skill assessments" 
  ON public.skill_assessments 
  FOR UPDATE 
  USING (true);

-- Enable RLS on certifications
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications
CREATE POLICY "Users can view certifications" 
  ON public.certifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create certifications" 
  ON public.certifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update certifications" 
  ON public.certifications 
  FOR UPDATE 
  USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_skill_assessments_updated_at
  BEFORE UPDATE ON public.skill_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
