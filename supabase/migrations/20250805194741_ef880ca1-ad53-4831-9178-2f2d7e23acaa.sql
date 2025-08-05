-- Create missing analytics and management tables for full functionality

-- Education Analytics
CREATE TABLE IF NOT EXISTS public.education_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course Management
CREATE TABLE IF NOT EXISTS public.education_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_code TEXT UNIQUE NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.teachers(id),
  duration_weeks INTEGER DEFAULT 12,
  max_students INTEGER DEFAULT 30,
  course_fee NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course Enrollments
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.education_courses(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  completion_date DATE,
  grade TEXT,
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'transferred')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Skill Assessments
CREATE TABLE IF NOT EXISTS public.skill_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  assessor_id UUID REFERENCES public.trainers(id),
  assessment_type TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  score NUMERIC CHECK (score >= 0 AND score <= 100),
  assessment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  certification_type TEXT NOT NULL,
  issuing_authority TEXT,
  issued_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  certificate_url TEXT,
  verification_code TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance Reviews
CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.employees(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating NUMERIC CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_achievement TEXT,
  strengths TEXT,
  areas_for_improvement TEXT,
  development_plan TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'finalized')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Placement Analytics
CREATE TABLE IF NOT EXISTS public.placement_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  salary_offered NUMERIC,
  placement_date DATE DEFAULT CURRENT_DATE,
  employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
  industry TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Export Requests
CREATE TABLE IF NOT EXISTS public.export_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requested_by UUID NOT NULL,
  export_type TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Scheduled Reports Config
CREATE TABLE IF NOT EXISTS public.scheduled_reports_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  schedule_cron TEXT NOT NULL,
  recipients TEXT[] DEFAULT '{}',
  parameters JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketplace Metrics
CREATE TABLE IF NOT EXISTS public.marketplace_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE DEFAULT CURRENT_DATE,
  total_products INTEGER DEFAULT 0,
  active_producers INTEGER DEFAULT 0,
  total_sales NUMERIC DEFAULT 0,
  top_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product Sales
CREATE TABLE IF NOT EXISTS public.product_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.local_products(id) ON DELETE CASCADE,
  quantity_sold INTEGER NOT NULL CHECK (quantity_sold > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price > 0),
  total_amount NUMERIC GENERATED ALWAYS AS (quantity_sold * unit_price) STORED,
  sale_date DATE DEFAULT CURRENT_DATE,
  customer_info JSONB DEFAULT '{}',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mentorship Sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_assignment_id UUID REFERENCES public.mentor_assignments(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  session_type TEXT DEFAULT 'individual' CHECK (session_type IN ('individual', 'group', 'workshop')),
  topics_covered TEXT[],
  mentor_notes TEXT,
  participant_feedback TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product Certifications
CREATE TABLE IF NOT EXISTS public.product_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.local_products(id) ON DELETE CASCADE,
  certification_type TEXT NOT NULL,
  certification_authority TEXT NOT NULL,
  certificate_number TEXT UNIQUE,
  issued_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  certificate_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.education_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can manage education analytics" ON public.education_analytics FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage courses" ON public.education_courses FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage course enrollments" ON public.course_enrollments FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage skill assessments" ON public.skill_assessments FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage certifications" ON public.certifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage performance reviews" ON public.performance_reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage placement analytics" ON public.placement_analytics FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage export requests" ON public.export_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage scheduled reports" ON public.scheduled_reports_config FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage marketplace metrics" ON public.marketplace_metrics FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage product sales" ON public.product_sales FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage mentorship sessions" ON public.mentorship_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage product certifications" ON public.product_certifications FOR ALL TO authenticated USING (true);

-- Create updated_at triggers for all new tables
CREATE TRIGGER update_education_analytics_updated_at BEFORE UPDATE ON public.education_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_education_courses_updated_at BEFORE UPDATE ON public.education_courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skill_assessments_updated_at BEFORE UPDATE ON public.skill_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_export_requests_updated_at BEFORE UPDATE ON public.export_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_reports_config_updated_at BEFORE UPDATE ON public.scheduled_reports_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentorship_sessions_updated_at BEFORE UPDATE ON public.mentorship_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_certifications_updated_at BEFORE UPDATE ON public.product_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();