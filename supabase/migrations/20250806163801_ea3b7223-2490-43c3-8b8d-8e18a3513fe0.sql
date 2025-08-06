-- Phase 3: Notification & Communication System

-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error, system
  priority TEXT DEFAULT 'normal', -- low, normal, high, critical
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  action_label TEXT,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications" 
ON public.notifications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create announcements table for broadcast messages
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general', -- general, urgent, maintenance, event
  target_roles TEXT[] DEFAULT ARRAY['student', 'trainer', 'staff', 'admin'],
  target_departments TEXT[],
  priority TEXT DEFAULT 'normal', -- low, normal, high, critical
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  attachments JSONB,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for announcements
CREATE POLICY "Users can view published announcements for their role" 
ON public.announcements 
FOR SELECT 
USING (
  status = 'published' AND
  (target_roles IS NULL OR 
   EXISTS (
     SELECT 1 FROM public.profiles 
     WHERE user_id = auth.uid() AND role = ANY(target_roles)
   ))
);

CREATE POLICY "Admins can manage all announcements" 
ON public.announcements 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

-- Create email_templates table for email management
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB, -- List of available variables
  type TEXT DEFAULT 'system', -- system, marketing, transactional
  status TEXT DEFAULT 'active', -- active, inactive
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for email_templates
CREATE POLICY "Admins can manage email templates" 
ON public.email_templates 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, failed, bounced
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  variables_used JSONB,
  external_id TEXT, -- Resend email ID
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for email_logs
CREATE POLICY "Admins can view email logs" 
ON public.email_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'hr_admin')
  )
);

CREATE POLICY "System can manage email logs" 
ON public.email_logs 
FOR ALL 
WITH CHECK (true);

-- Create notification_preferences table for user preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  notification_types JSONB DEFAULT '{"system": true, "announcements": true, "reminders": true, "updates": true}',
  email_frequency TEXT DEFAULT 'immediate', -- immediate, daily, weekly, never
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences 
FOR ALL 
USING (user_id = auth.uid());

-- Add triggers for updated_at columns
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON public.announcements(published_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);

-- Insert default notification preferences for existing users
INSERT INTO public.notification_preferences (user_id)
SELECT user_id FROM public.profiles
WHERE user_id NOT IN (SELECT user_id FROM public.notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, html_content, text_content, variables, type) VALUES
('welcome', 'Welcome to YouthNet', 
 '<h1>Welcome {{name}}!</h1><p>Your account has been created successfully. You can now access the YouthNet platform.</p>',
 'Welcome {{name}}! Your account has been created successfully.',
 '["name", "email", "role"]', 'system'),
('password_reset', 'Password Reset Request',
 '<h1>Password Reset</h1><p>Click the link below to reset your password:</p><a href="{{reset_link}}">Reset Password</a>',
 'Password Reset: {{reset_link}}',
 '["name", "reset_link"]', 'system'),
('course_enrollment', 'Course Enrollment Confirmation',
 '<h1>Enrollment Confirmed</h1><p>You have been enrolled in {{course_name}}. Start date: {{start_date}}</p>',
 'Enrolled in {{course_name}}. Start: {{start_date}}',
 '["name", "course_name", "start_date"]', 'system');