-- Create missing tables for non-functional components

-- Education Department Analytics
CREATE TABLE IF NOT EXISTS public.education_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_type text NOT NULL DEFAULT 'count',
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Instructors table
CREATE TABLE IF NOT EXISTS public.instructors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id),
  instructor_id text NOT NULL UNIQUE,
  specialization text[],
  qualification text NOT NULL,
  experience_years integer DEFAULT 0,
  subjects text[],
  status text DEFAULT 'active',
  hire_date date DEFAULT CURRENT_DATE,
  salary numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Funding Applications
CREATE TABLE IF NOT EXISTS public.funding_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id uuid REFERENCES public.startup_applications(id),
  funding_type text NOT NULL,
  amount_requested numeric NOT NULL,
  amount_approved numeric DEFAULT 0,
  purpose text NOT NULL,
  status text DEFAULT 'pending',
  application_date date DEFAULT CURRENT_DATE,
  decision_date date,
  reviewed_by uuid REFERENCES public.profiles(id),
  disbursement_date date,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Incubation Program Details
CREATE TABLE IF NOT EXISTS public.incubation_program_details (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_name text NOT NULL,
  description text,
  duration_months integer NOT NULL,
  max_participants integer DEFAULT 20,
  coordinator_id uuid REFERENCES public.profiles(id),
  start_date date,
  end_date date,
  status text DEFAULT 'planning',
  modules text[],
  requirements text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Mentorship Sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id uuid REFERENCES public.mentors(id),
  mentee_id uuid REFERENCES public.profiles(id),
  session_date timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 60,
  session_type text DEFAULT 'one_on_one',
  topics_discussed text[],
  action_items text[],
  feedback text,
  status text DEFAULT 'scheduled',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Community Impact Metrics
CREATE TABLE IF NOT EXISTS public.community_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid REFERENCES public.livelihood_programs(id),
  metric_type text NOT NULL,
  metric_name text NOT NULL,
  baseline_value numeric,
  current_value numeric NOT NULL,
  target_value numeric,
  measurement_date date NOT NULL,
  location text,
  beneficiaries_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Outcome Assessments
CREATE TABLE IF NOT EXISTS public.outcome_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid REFERENCES public.livelihood_programs(id),
  participant_id uuid REFERENCES public.profiles(id),
  assessment_type text NOT NULL,
  assessment_date date NOT NULL,
  scores jsonb,
  improvements text[],
  challenges text[],
  recommendations text,
  assessor_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Participant Progress
CREATE TABLE IF NOT EXISTS public.participant_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid REFERENCES public.livelihood_programs(id),
  participant_id uuid REFERENCES public.profiles(id),
  milestone_name text NOT NULL,
  milestone_date date,
  completion_percentage integer DEFAULT 0,
  status text DEFAULT 'in_progress',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Product Certifications
CREATE TABLE IF NOT EXISTS public.product_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.local_products(id),
  certification_type text NOT NULL,
  certification_body text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  certificate_number text,
  status text DEFAULT 'active',
  verification_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Marketplace Metrics
CREATE TABLE IF NOT EXISTS public.marketplace_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date date NOT NULL,
  total_sales numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  unique_buyers integer DEFAULT 0,
  top_categories text[],
  average_order_value numeric DEFAULT 0,
  revenue_by_region jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Producers (separate from artisans)
CREATE TABLE IF NOT EXISTS public.producers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  producer_name text NOT NULL,
  contact_person text,
  contact_email text,
  contact_phone text,
  address text,
  production_categories text[],
  certification_status text DEFAULT 'pending',
  monthly_capacity integer DEFAULT 0,
  quality_rating numeric DEFAULT 0,
  partnership_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Maintenance Schedules
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id uuid REFERENCES public.inventory_items(id),
  task_name text NOT NULL,
  task_description text,
  frequency text NOT NULL,
  next_due_date date NOT NULL,
  assigned_to uuid REFERENCES public.profiles(id),
  priority text DEFAULT 'medium',
  estimated_duration integer DEFAULT 60,
  cost_estimate numeric DEFAULT 0,
  status text DEFAULT 'scheduled',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Analytics Reports
CREATE TABLE IF NOT EXISTS public.analytics_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name text NOT NULL,
  report_type text NOT NULL,
  data_source text[],
  filters jsonb,
  generated_by uuid REFERENCES public.profiles(id),
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  file_url text,
  report_data jsonb,
  status text DEFAULT 'generated'
);

-- Export Requests
CREATE TABLE IF NOT EXISTS public.export_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requested_by uuid REFERENCES public.profiles(id),
  export_type text NOT NULL,
  data_source text NOT NULL,
  filters jsonb,
  format text DEFAULT 'csv',
  status text DEFAULT 'pending',
  file_url text,
  requested_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Scheduled Reports Configuration
CREATE TABLE IF NOT EXISTS public.scheduled_reports_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name text NOT NULL,
  report_type text NOT NULL,
  schedule_pattern text NOT NULL,
  recipients text[],
  data_sources text[],
  filters jsonb,
  is_active boolean DEFAULT true,
  last_generated timestamp with time zone,
  next_scheduled timestamp with time zone,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Attendance Tracking
CREATE TABLE IF NOT EXISTS public.attendance_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid REFERENCES public.employees(id),
  check_in_time timestamp with time zone,
  check_out_time timestamp with time zone,
  break_start timestamp with time zone,
  break_end timestamp with time zone,
  total_hours numeric DEFAULT 0,
  overtime_hours numeric DEFAULT 0,
  status text DEFAULT 'present',
  location text,
  ip_address text,
  notes text,
  approved_by uuid REFERENCES public.profiles(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.education_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incubation_program_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
CREATE POLICY "Allow all access to education_analytics" ON public.education_analytics FOR ALL USING (true);
CREATE POLICY "Allow all access to instructors" ON public.instructors FOR ALL USING (true);
CREATE POLICY "Allow all access to funding_applications" ON public.funding_applications FOR ALL USING (true);
CREATE POLICY "Allow all access to incubation_program_details" ON public.incubation_program_details FOR ALL USING (true);
CREATE POLICY "Allow all access to mentorship_sessions" ON public.mentorship_sessions FOR ALL USING (true);
CREATE POLICY "Allow all access to community_metrics" ON public.community_metrics FOR ALL USING (true);
CREATE POLICY "Allow all access to outcome_assessments" ON public.outcome_assessments FOR ALL USING (true);
CREATE POLICY "Allow all access to participant_progress" ON public.participant_progress FOR ALL USING (true);
CREATE POLICY "Allow all access to product_certifications" ON public.product_certifications FOR ALL USING (true);
CREATE POLICY "Allow all access to marketplace_metrics" ON public.marketplace_metrics FOR ALL USING (true);
CREATE POLICY "Allow all access to producers" ON public.producers FOR ALL USING (true);
CREATE POLICY "Allow all access to maintenance_schedules" ON public.maintenance_schedules FOR ALL USING (true);
CREATE POLICY "Allow all access to analytics_reports" ON public.analytics_reports FOR ALL USING (true);
CREATE POLICY "Allow all access to export_requests" ON public.export_requests FOR ALL USING (true);
CREATE POLICY "Allow all access to scheduled_reports_config" ON public.scheduled_reports_config FOR ALL USING (true);
CREATE POLICY "Allow all access to attendance_tracking" ON public.attendance_tracking FOR ALL USING (true);

-- Add update triggers for updated_at columns
CREATE TRIGGER update_education_analytics_updated_at BEFORE UPDATE ON public.education_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_funding_applications_updated_at BEFORE UPDATE ON public.funding_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incubation_program_details_updated_at BEFORE UPDATE ON public.incubation_program_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentorship_sessions_updated_at BEFORE UPDATE ON public.mentorship_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_metrics_updated_at BEFORE UPDATE ON public.community_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_outcome_assessments_updated_at BEFORE UPDATE ON public.outcome_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_participant_progress_updated_at BEFORE UPDATE ON public.participant_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_certifications_updated_at BEFORE UPDATE ON public.product_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketplace_metrics_updated_at BEFORE UPDATE ON public.marketplace_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_producers_updated_at BEFORE UPDATE ON public.producers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON public.maintenance_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_reports_config_updated_at BEFORE UPDATE ON public.scheduled_reports_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_tracking_updated_at BEFORE UPDATE ON public.attendance_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();