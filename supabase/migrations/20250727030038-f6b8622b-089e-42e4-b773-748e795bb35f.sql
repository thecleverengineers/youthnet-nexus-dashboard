-- Create employer partnerships tracking table
CREATE TABLE public.employer_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  partnership_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  partnership_end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  location TEXT,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory stock tracking table
CREATE TABLE public.inventory_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  current_stock INTEGER NOT NULL DEFAULT 0,
  minimum_threshold INTEGER NOT NULL DEFAULT 10,
  maximum_capacity INTEGER,
  last_restocked_date DATE,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location_id TEXT,
  notes TEXT
);

-- Create user activities tracking table
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  login_time TIMESTAMP WITH TIME ZONE,
  logout_time TIMESTAMP WITH TIME ZONE,
  session_duration_minutes INTEGER,
  ip_address TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for Made in Nagaland
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  producer_id UUID REFERENCES public.producers(id),
  artisan_id UUID REFERENCES public.artisans(id),
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  certification_status TEXT DEFAULT 'pending',
  certification_date DATE,
  images JSONB,
  materials ARRAY,
  dimensions TEXT,
  weight_grams INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Create analytics cache table for performance
CREATE TABLE public.analytics_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create placement analytics table
CREATE TABLE public.placement_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year DATE NOT NULL,
  total_placements INTEGER NOT NULL DEFAULT 0,
  total_applications INTEGER NOT NULL DEFAULT 0,
  placement_rate NUMERIC(5,2),
  industry_breakdown JSONB,
  salary_ranges JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.employer_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can manage employer partnerships" 
ON public.employer_partnerships 
FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can manage inventory stock" 
ON public.inventory_stock 
FOR ALL 
USING (true);

CREATE POLICY "Admin can manage user activities" 
ON public.user_activities 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can view analytics cache" 
ON public.analytics_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage analytics cache" 
ON public.analytics_cache 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Authenticated users can view placement analytics" 
ON public.placement_analytics 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage placement analytics" 
ON public.placement_analytics 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_employer_partnerships_updated_at
BEFORE UPDATE ON public.employer_partnerships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_cache_updated_at
BEFORE UPDATE ON public.analytics_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_placement_analytics_updated_at
BEFORE UPDATE ON public.placement_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_date ON public.user_activities(activity_date);
CREATE INDEX idx_inventory_stock_item_id ON public.inventory_stock(item_id);
CREATE INDEX idx_products_producer_id ON public.products(producer_id);
CREATE INDEX idx_products_artisan_id ON public.products(artisan_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_analytics_cache_key ON public.analytics_cache(cache_key);
CREATE INDEX idx_placement_analytics_month ON public.placement_analytics(month_year);