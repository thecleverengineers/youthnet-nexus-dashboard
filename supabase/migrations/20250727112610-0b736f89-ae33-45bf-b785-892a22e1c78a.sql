-- Create only missing tables that don't exist yet

-- Performance Reviews table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) NOT NULL,
  reviewer_id UUID REFERENCES employees(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_achievement INTEGER CHECK (goals_achievement >= 1 AND goals_achievement <= 5),
  communication_skills INTEGER CHECK (communication_skills >= 1 AND communication_skills <= 5),
  technical_skills INTEGER CHECK (technical_skills >= 1 AND technical_skills <= 5),
  teamwork INTEGER CHECK (teamwork >= 1 AND teamwork <= 5),
  comments TEXT,
  recommendations TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'finalized')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample data for testing
INSERT INTO public.skill_assessments (student_id, skill_name, level, progress, status) VALUES
  ((SELECT id FROM students LIMIT 1), 'JavaScript Programming', 'intermediate', 75, 'in_progress'),
  ((SELECT id FROM students LIMIT 1), 'React Development', 'beginner', 45, 'in_progress'),
  ((SELECT id FROM students LIMIT 1), 'Node.js', 'advanced', 90, 'completed');

INSERT INTO public.certifications (student_id, name, issuer, progress, status, expected_completion) VALUES
  ((SELECT id FROM students LIMIT 1), 'AWS Certified Developer', 'Amazon Web Services', 60, 'in_progress', '2025-03-15'),
  ((SELECT id FROM students LIMIT 1), 'Google Cloud Professional', 'Google', 30, 'in_progress', '2025-06-01'),
  ((SELECT id FROM students LIMIT 1), 'Microsoft Azure Fundamentals', 'Microsoft', 100, 'completed', NULL);

INSERT INTO public.education_courses (course_name, course_code, description, category, duration_months) VALUES
  ('Full Stack Web Development', 'FSWD-001', 'Complete course covering frontend and backend development', 'Technology', 6),
  ('Digital Marketing Fundamentals', 'DM-001', 'Introduction to digital marketing strategies', 'Business', 3),
  ('Data Science with Python', 'DS-001', 'Data analysis and machine learning with Python', 'Technology', 8);

INSERT INTO public.job_applications (job_posting_id, student_id, status, application_date) VALUES
  ((SELECT id FROM job_postings LIMIT 1), (SELECT id FROM students LIMIT 1), 'applied', CURRENT_DATE),
  ((SELECT id FROM job_postings LIMIT 1), (SELECT id FROM students LIMIT 1), 'reviewed', CURRENT_DATE - INTERVAL '2 days');

INSERT INTO public.livelihood_programs (program_name, description, target_beneficiaries, duration_months, budget, status) VALUES
  ('Rural Entrepreneurship Development', 'Supporting rural entrepreneurs with business skills and funding', 100, 12, 500000, 'active'),
  ('Women Self Help Groups', 'Empowering women through collective business activities', 200, 18, 750000, 'active'),
  ('Youth Skill Development', 'Technical skills training for unemployed youth', 150, 6, 300000, 'planning');

INSERT INTO public.program_participants (program_id, participant_name, contact_phone, enrollment_date, status) VALUES
  ((SELECT id FROM livelihood_programs WHERE program_name = 'Rural Entrepreneurship Development'), 'Asha Devi', '+91-9876543210', CURRENT_DATE - INTERVAL '30 days', 'active'),
  ((SELECT id FROM livelihood_programs WHERE program_name = 'Women Self Help Groups'), 'Priya Sharma', '+91-9876543211', CURRENT_DATE - INTERVAL '20 days', 'active'),
  ((SELECT id FROM livelihood_programs WHERE program_name = 'Youth Skill Development'), 'Rahul Kumar', '+91-9876543212', CURRENT_DATE - INTERVAL '10 days', 'enrolled');

-- Enable RLS and create policies for new tables
DO $$
BEGIN
    -- Enable RLS on performance_reviews if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'performance_reviews') THEN
        ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
        
        -- Create policy if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'performance_reviews' AND policyname = 'Authenticated users can manage performance reviews') THEN
            CREATE POLICY "Authenticated users can manage performance reviews" 
            ON performance_reviews FOR ALL USING (true);
        END IF;
        
        -- Create trigger if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'update_performance_reviews_updated_at') THEN
            CREATE TRIGGER update_performance_reviews_updated_at
            BEFORE UPDATE ON performance_reviews
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        END IF;
    END IF;
END $$;