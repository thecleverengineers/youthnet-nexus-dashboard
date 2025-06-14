
-- Create performance_reviews table
CREATE TABLE public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating TEXT NOT NULL CHECK (overall_rating IN ('excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory')),
  goals_achieved TEXT,
  areas_for_improvement TEXT,
  development_plan TEXT,
  ai_generated_insights TEXT,
  skill_assessment JSONB,
  career_recommendations JSONB,
  peer_feedback JSONB,
  self_assessment JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on performance_reviews table
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for performance reviews (admin and managers can access)
CREATE POLICY "Admin can manage performance reviews" ON public.performance_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Fix the foreign key relationships by ensuring proper references
-- Update students table to properly reference profiles
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_user_id_fkey;
ALTER TABLE public.students ADD CONSTRAINT students_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update trainers table to properly reference profiles  
ALTER TABLE public.trainers DROP CONSTRAINT IF EXISTS trainers_user_id_fkey;
ALTER TABLE public.trainers ADD CONSTRAINT trainers_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update employees table to properly reference profiles
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
ALTER TABLE public.employees ADD CONSTRAINT employees_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
