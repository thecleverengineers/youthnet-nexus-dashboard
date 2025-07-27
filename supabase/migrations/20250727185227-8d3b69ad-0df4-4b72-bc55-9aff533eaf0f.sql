-- Add SMTP configuration settings to system_settings table
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('smtp_host', '""', 'smtp', 'SMTP server hostname', false),
('smtp_port', '587', 'smtp', 'SMTP server port', false),
('smtp_username', '""', 'smtp', 'SMTP username/email', false),
('smtp_password', '""', 'smtp', 'SMTP password (encrypted)', false),
('smtp_encryption', '"tls"', 'smtp', 'SMTP encryption type (tls, ssl, none)', false),
('smtp_from_email', '""', 'smtp', 'From email address', false),
('smtp_from_name', '""', 'smtp', 'From display name', false),
('smtp_enabled', 'false', 'smtp', 'Enable SMTP email functionality', false);

-- Create RLS policies for system_settings table to allow admin access
CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on system_settings if not already enabled
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;