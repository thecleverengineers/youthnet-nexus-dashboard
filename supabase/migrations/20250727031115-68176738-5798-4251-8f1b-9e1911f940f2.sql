-- Create staff_templates table for dynamic role templates
CREATE TABLE public.staff_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name text NOT NULL,
  description text,
  permissions jsonb DEFAULT '[]'::jsonb,
  responsibilities text[],
  required_qualifications text[],
  salary_range_min numeric,
  salary_range_max numeric,
  created_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for staff_templates
CREATE POLICY "Admin can manage staff templates" 
ON public.staff_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Authenticated users can view staff templates" 
ON public.staff_templates 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create trigger for staff_templates updated_at
CREATE TRIGGER update_staff_templates_updated_at
BEFORE UPDATE ON public.staff_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create job_applications table for tracking job applications
CREATE TABLE public.job_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id uuid REFERENCES public.job_postings(id),
  applicant_id uuid REFERENCES auth.users(id),
  resume_id uuid REFERENCES public.resumes(id),
  application_date timestamp with time zone DEFAULT now(),
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'interview_scheduled', 'rejected', 'accepted')),
  cover_letter text,
  interview_date timestamp with time zone,
  interview_notes text,
  feedback text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job_applications
CREATE POLICY "Users can view their own applications" 
ON public.job_applications 
FOR SELECT 
USING (applicant_id = auth.uid());

CREATE POLICY "Users can create their own applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Admin and staff can manage all applications" 
ON public.job_applications 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
));

-- Create trigger for job_applications updated_at
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create inventory_categories table for better inventory organization
CREATE TABLE public.inventory_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name text NOT NULL UNIQUE,
  description text,
  parent_category_id uuid REFERENCES public.inventory_categories(id),
  depreciation_rate numeric DEFAULT 0,
  maintenance_frequency_days integer DEFAULT 365,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory_categories
CREATE POLICY "Authenticated users can manage inventory categories" 
ON public.inventory_categories 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for inventory_categories updated_at
CREATE TRIGGER update_inventory_categories_updated_at
BEFORE UPDATE ON public.inventory_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default inventory categories
INSERT INTO public.inventory_categories (category_name, description, depreciation_rate, maintenance_frequency_days) VALUES
('IT Equipment', 'Computers, laptops, servers, and other IT hardware', 0.20, 180),
('Furniture', 'Office furniture, desks, chairs, and storage', 0.10, 365),
('Vehicles', 'Company vehicles and transportation equipment', 0.15, 90),
('Machinery', 'Manufacturing and production machinery', 0.12, 120),
('Office Supplies', 'Consumable office supplies and materials', 1.00, 30);

-- Insert some default staff templates
INSERT INTO public.staff_templates (role_name, description, responsibilities, required_qualifications, salary_range_min, salary_range_max) VALUES
('Software Developer', 'Develops and maintains software applications', ARRAY['Code development', 'Bug fixing', 'Code reviews', 'Documentation'], ARRAY['Bachelor''s in Computer Science', '2+ years experience', 'Proficiency in programming languages'], 45000, 80000),
('Project Manager', 'Manages project timelines and team coordination', ARRAY['Project planning', 'Team coordination', 'Stakeholder communication', 'Risk management'], ARRAY['Bachelor''s degree', 'PMP certification preferred', '3+ years management experience'], 55000, 95000),
('HR Specialist', 'Handles human resources and employee relations', ARRAY['Recruitment', 'Employee onboarding', 'Policy compliance', 'Performance reviews'], ARRAY['Bachelor''s in HR or related field', 'HR certification', '2+ years HR experience'], 40000, 70000),
('Marketing Coordinator', 'Coordinates marketing campaigns and strategies', ARRAY['Campaign planning', 'Content creation', 'Social media management', 'Analytics reporting'], ARRAY['Bachelor''s in Marketing', 'Digital marketing experience', 'Creative skills'], 35000, 60000);