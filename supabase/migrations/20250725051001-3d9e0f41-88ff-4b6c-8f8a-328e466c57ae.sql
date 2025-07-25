-- Create schools table for Education Department
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  udise_code TEXT UNIQUE,
  address TEXT,
  category TEXT CHECK (category IN ('GPS', 'GMS', 'GHS', 'GHSS')),
  district TEXT,
  enrollment_count INTEGER DEFAULT 0,
  phone TEXT,
  email TEXT,
  principal_name TEXT,
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  teacher_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  subject TEXT,
  contact TEXT,
  school_id UUID REFERENCES public.schools(id),
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  hire_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career_counseling_sessions table for YCDC
CREATE TABLE public.career_counseling_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  counselor_id UUID REFERENCES public.profiles(id),
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  session_type TEXT DEFAULT 'individual' CHECK (session_type IN ('individual', 'group', 'workshop')),
  topics_discussed TEXT[],
  recommendations TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshops table for attendance tracking
CREATE TABLE public.workshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  facilitator_id UUID REFERENCES public.profiles(id),
  workshop_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours DECIMAL(4,2) DEFAULT 2.0,
  venue TEXT,
  max_participants INTEGER DEFAULT 50,
  category TEXT DEFAULT 'career_development',
  materials_provided TEXT[],
  learning_objectives TEXT[],
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshop attendance table
CREATE TABLE public.workshop_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'cancelled')),
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_comments TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workshop_id, student_id)
);

-- Create resumes table for job seekers
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  skills TEXT[],
  experience_years INTEGER DEFAULT 0,
  education_level TEXT,
  preferred_locations TEXT[],
  preferred_salary_min DECIMAL(10,2),
  preferred_salary_max DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'employed', 'not_looking')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentors table for incubation programs
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  expertise_areas TEXT[],
  industry_experience INTEGER DEFAULT 0,
  company_affiliation TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  bio TEXT,
  linkedin_profile TEXT,
  mentorship_capacity INTEGER DEFAULT 5,
  current_mentees INTEGER DEFAULT 0,
  hourly_rate DECIMAL(8,2),
  availability_schedule JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_break')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentor assignments table
CREATE TABLE public.mentor_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.mentors(id),
  entrepreneur_id UUID REFERENCES public.students(id),
  incubation_project_id UUID REFERENCES public.incubation_projects(id),
  assignment_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'terminated')),
  goals TEXT[],
  meeting_frequency TEXT DEFAULT 'weekly',
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create artisans table for Made in Nagaland
CREATE TABLE public.artisans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,
  district TEXT,
  craft_specialization TEXT[],
  experience_years INTEGER DEFAULT 0,
  registration_number TEXT UNIQUE,
  bank_account_details JSONB,
  id_proof_type TEXT,
  id_proof_number TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  profile_image_url TEXT,
  bio TEXT,
  social_media_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product sales table
CREATE TABLE public.product_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.local_products(id),
  artisan_id UUID REFERENCES public.artisans(id),
  quantity_sold INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  customer_name TEXT,
  customer_contact TEXT,
  sale_channel TEXT DEFAULT 'direct' CHECK (sale_channel IN ('direct', 'online', 'wholesale', 'exhibition', 'retail')),
  commission_rate DECIMAL(5,2) DEFAULT 10.0,
  commission_amount DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
CREATE POLICY "Authenticated users can manage schools" ON public.schools FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage teachers" ON public.teachers FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage counseling sessions" ON public.career_counseling_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage workshops" ON public.workshops FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage workshop attendance" ON public.workshop_attendance FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage resumes" ON public.resumes FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage mentors" ON public.mentors FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage mentor assignments" ON public.mentor_assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage artisans" ON public.artisans FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage product sales" ON public.product_sales FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_schools_district ON public.schools(district);
CREATE INDEX idx_teachers_school_id ON public.teachers(school_id);
CREATE INDEX idx_counseling_sessions_student_id ON public.career_counseling_sessions(student_id);
CREATE INDEX idx_workshops_date ON public.workshops(workshop_date);
CREATE INDEX idx_workshop_attendance_workshop_id ON public.workshop_attendance(workshop_id);
CREATE INDEX idx_resumes_student_id ON public.resumes(student_id);
CREATE INDEX idx_mentor_assignments_mentor_id ON public.mentor_assignments(mentor_id);
CREATE INDEX idx_product_sales_product_id ON public.product_sales(product_id);
CREATE INDEX idx_product_sales_sale_date ON public.product_sales(sale_date);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_counseling_sessions_updated_at BEFORE UPDATE ON public.career_counseling_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workshop_attendance_updated_at BEFORE UPDATE ON public.workshop_attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON public.mentors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentor_assignments_updated_at BEFORE UPDATE ON public.mentor_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON public.artisans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_sales_updated_at BEFORE UPDATE ON public.product_sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();