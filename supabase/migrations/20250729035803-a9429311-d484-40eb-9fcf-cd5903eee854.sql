-- Create banners table for dynamic banner management
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies for banner management
CREATE POLICY "Everyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage banners" 
ON public.banners 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default banners
INSERT INTO public.banners (title, subtitle, image_url, display_order, is_active) VALUES
('Welcome to Youth Nexus', 'Empowering the next generation through skill development and opportunities', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop', 1, true),
('Career Development Programs', 'Join our comprehensive training programs designed for youth success', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop', 2, true),
('Made in Nagaland Initiative', 'Supporting local artisans and promoting traditional crafts', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop', 3, true);