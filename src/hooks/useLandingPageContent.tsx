import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LandingPageContent {
  [key: string]: any;
}

export const useLandingPageContent = () => {
  const [content, setContent] = useState<LandingPageContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('landing_page_content')
        .select('content_key, content_value, content_type')
        .eq('is_active', true);

      if (fetchError) throw fetchError;

      const contentMap: LandingPageContent = {};
      
      data?.forEach((item) => {
        try {
          const value = typeof item.content_value === 'string' 
            ? JSON.parse(item.content_value) 
            : item.content_value;
          contentMap[item.content_key] = value;
        } catch {
          contentMap[item.content_key] = item.content_value;
        }
      });

      setContent(contentMap);
    } catch (err) {
      console.error('Error fetching landing page content:', err);
      setError('Failed to load landing page content');
      
      // Fallback to default content
      setContent({
        site_title: 'YouthNet',
        site_subtitle: 'MIS Platform',
        hero_badge_text: 'Advanced Management Platform',
        hero_title: 'YouthNet MIS',
        hero_description: 'Comprehensive Management Information System designed for youth development, education programs, and career advancement initiatives.',
        hero_cta_primary: 'Get Started Now',
        hero_cta_secondary: 'Learn More',
        features_title: 'Powerful Features for',
        features_subtitle: 'Modern Management',
        features_description: 'Everything you need to manage youth development programs, track progress, and drive success.',
        benefits_title: 'Why Choose',
        benefits_subtitle: 'YouthNet MIS?',
        benefits_description: 'Built specifically for youth development organizations, our platform combines powerful features with intuitive design.',
        cta_title: 'Ready to Transform Your Organization?',
        cta_description: 'Join thousands of organizations already using YouthNet MIS to drive success.',
        cta_button_text: 'Start Your Journey',
        footer_description: 'Empowering youth development through innovative technology solutions.',
        footer_copyright: '© 2024 YouthNet. All rights reserved.',
        logo_url: '',
        stats: [
          { label: "Active Students", value: "10,000+", icon: "Users" },
          { label: "Success Rate", value: "95%", icon: "TrendingUp" },
          { label: "Programs", value: "150+", icon: "BookOpen" },
          { label: "Partners", value: "50+", icon: "Globe" }
        ],
        features: [
          {
            title: "Student Management",
            description: "Comprehensive student tracking and enrollment management",
            icon: "Users",
            color: "from-blue-500 to-cyan-500"
          },
          {
            title: "Education Programs",
            description: "Manage courses, curricula, and academic progress",
            icon: "BookOpen",
            color: "from-purple-500 to-pink-500"
          },
          {
            title: "Career Services",
            description: "Job placement tracking and career counseling",
            icon: "Briefcase",
            color: "from-green-500 to-emerald-500"
          },
          {
            title: "Analytics Dashboard",
            description: "Real-time insights and performance metrics",
            icon: "TrendingUp",
            color: "from-orange-500 to-yellow-500"
          },
          {
            title: "Role-Based Access",
            description: "Secure multi-level permission management",
            icon: "Shield",
            color: "from-red-500 to-rose-500"
          },
          {
            title: "Skill Development",
            description: "Training programs and certification tracking",
            icon: "GraduationCap",
            color: "from-indigo-500 to-blue-500"
          }
        ],
        benefits: [
          "Streamlined administrative processes",
          "Real-time data analytics and reporting",
          "Automated workflow management",
          "Secure cloud-based infrastructure",
          "Mobile-responsive design",
          "24/7 technical support"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshContent = () => {
    fetchContent();
  };

  return { content, loading, error, refreshContent };
};