-- Create table for landing page content
CREATE TABLE public.landing_page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key text NOT NULL UNIQUE,
  content_value jsonb NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.landing_page_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admin can manage landing page content" 
ON public.landing_page_content 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Everyone can view active landing page content" 
ON public.landing_page_content 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_landing_page_content_updated_at
  BEFORE UPDATE ON public.landing_page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.landing_page_content (content_key, content_value, content_type) VALUES
('site_title', '"YouthNet"', 'text'),
('site_subtitle', '"MIS Platform"', 'text'),
('hero_badge_text', '"Advanced Management Platform"', 'text'),
('hero_title', '"YouthNet MIS"', 'text'),
('hero_description', '"Comprehensive Management Information System designed for youth development, education programs, and career advancement initiatives."', 'text'),
('hero_cta_primary', '"Get Started Now"', 'text'),
('hero_cta_secondary', '"Learn More"', 'text'),
('features_title', '"Powerful Features for"', 'text'),
('features_subtitle', '"Modern Management"', 'text'),
('features_description', '"Everything you need to manage youth development programs, track progress, and drive success."', 'text'),
('benefits_title', '"Why Choose"', 'text'),
('benefits_subtitle', '"YouthNet MIS?"', 'text'),
('benefits_description', '"Built specifically for youth development organizations, our platform combines powerful features with intuitive design."', 'text'),
('cta_title', '"Ready to Transform Your Organization?"', 'text'),
('cta_description', '"Join thousands of organizations already using YouthNet MIS to drive success."', 'text'),
('cta_button_text', '"Start Your Journey"', 'text'),
('footer_description', '"Empowering youth development through innovative technology solutions."', 'text'),
('footer_copyright', '"© 2024 YouthNet. All rights reserved."', 'text'),
('logo_url', '""', 'image'),
('stats', '[
  {"label": "Active Students", "value": "10,000+", "icon": "Users"},
  {"label": "Success Rate", "value": "95%", "icon": "TrendingUp"},
  {"label": "Programs", "value": "150+", "icon": "BookOpen"},
  {"label": "Partners", "value": "50+", "icon": "Globe"}
]', 'array'),
('features', '[
  {
    "title": "Student Management",
    "description": "Comprehensive student tracking and enrollment management",
    "icon": "Users",
    "color": "from-blue-500 to-cyan-500"
  },
  {
    "title": "Education Programs",
    "description": "Manage courses, curricula, and academic progress",
    "icon": "BookOpen",
    "color": "from-purple-500 to-pink-500"
  },
  {
    "title": "Career Services",
    "description": "Job placement tracking and career counseling",
    "icon": "Briefcase",
    "color": "from-green-500 to-emerald-500"
  },
  {
    "title": "Analytics Dashboard",
    "description": "Real-time insights and performance metrics",
    "icon": "TrendingUp",
    "color": "from-orange-500 to-yellow-500"
  },
  {
    "title": "Role-Based Access",
    "description": "Secure multi-level permission management",
    "icon": "Shield",
    "color": "from-red-500 to-rose-500"
  },
  {
    "title": "Skill Development",
    "description": "Training programs and certification tracking",
    "icon": "GraduationCap",
    "color": "from-indigo-500 to-blue-500"
  }
]', 'array'),
('benefits', '[
  "Streamlined administrative processes",
  "Real-time data analytics and reporting",
  "Automated workflow management",
  "Secure cloud-based infrastructure",
  "Mobile-responsive design",
  "24/7 technical support"
]', 'array');