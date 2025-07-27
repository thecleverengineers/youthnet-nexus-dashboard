-- Create enhanced RBAC system

-- Table for role definitions
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for available features/permissions
CREATE TABLE public.system_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_key TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for assigning features to roles
CREATE TABLE public.role_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES system_features(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, feature_id)
);

-- Table for assigning roles to users
CREATE TABLE public.user_role_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Admin can manage user roles" ON public.user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view active roles" ON public.user_roles
FOR SELECT USING (is_active = true);

-- RLS Policies for system_features
CREATE POLICY "Admin can manage system features" ON public.system_features
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view active features" ON public.system_features
FOR SELECT USING (is_active = true);

-- RLS Policies for role_features
CREATE POLICY "Admin can manage role features" ON public.role_features
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view role features" ON public.role_features
FOR SELECT USING (true);

-- RLS Policies for user_role_assignments
CREATE POLICY "Admin can manage user role assignments" ON public.user_role_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view their own role assignments" ON public.user_role_assignments
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Insert default system features
INSERT INTO public.system_features (feature_key, feature_name, description, category) VALUES
('dashboard', 'Dashboard Access', 'Access to main dashboard', 'core'),
('user_management', 'User Management', 'Manage users and their information', 'admin'),
('role_management', 'Role Management', 'Manage roles and permissions', 'admin'),
('hr_admin', 'HR Administration', 'Access to HR admin features', 'hr'),
('employee_management', 'Employee Management', 'Manage employee records', 'hr'),
('payroll_management', 'Payroll Management', 'Manage payroll and compensation', 'hr'),
('attendance_tracking', 'Attendance Tracking', 'Track and manage attendance', 'hr'),
('performance_reviews', 'Performance Reviews', 'Conduct performance evaluations', 'hr'),
('task_management', 'Task Management', 'Assign and track tasks', 'hr'),
('education_management', 'Education Management', 'Manage educational programs', 'education'),
('student_management', 'Student Management', 'Manage student records', 'education'),
('teacher_management', 'Teacher Management', 'Manage teacher information', 'education'),
('course_management', 'Course Management', 'Manage courses and curriculum', 'education'),
('skill_development', 'Skill Development', 'Access skill development features', 'training'),
('training_programs', 'Training Programs', 'Manage training programs', 'training'),
('certification_tracking', 'Certification Tracking', 'Track certifications', 'training'),
('career_centre', 'Career Centre', 'Access career development features', 'career'),
('job_centre', 'Job Centre', 'Manage job postings and applications', 'career'),
('incubation', 'Incubation Programs', 'Manage incubation programs', 'business'),
('livelihood', 'Livelihood Programs', 'Manage livelihood initiatives', 'business'),
('made_in_nagaland', 'Made in Nagaland', 'Manage marketplace features', 'business'),
('inventory_management', 'Inventory Management', 'Manage inventory and assets', 'operations'),
('reports_analytics', 'Reports & Analytics', 'View reports and analytics', 'analytics'),
('system_settings', 'System Settings', 'Configure system settings', 'admin'),
('backup_restore', 'Backup & Restore', 'Manage system backups', 'admin');

-- Insert default roles with features
INSERT INTO public.user_roles (role_name, description, is_system_role) VALUES
('admin', 'Full system administrator', true),
('staff', 'General staff member', true),
('trainer', 'Training program instructor', true),
('student', 'Program participant', true);

-- Get role IDs for feature assignments
DO $$
DECLARE
    admin_role_id UUID;
    staff_role_id UUID;
    trainer_role_id UUID;
    student_role_id UUID;
BEGIN
    SELECT id INTO admin_role_id FROM user_roles WHERE role_name = 'admin';
    SELECT id INTO staff_role_id FROM user_roles WHERE role_name = 'staff';
    SELECT id INTO trainer_role_id FROM user_roles WHERE role_name = 'trainer';
    SELECT id INTO student_role_id FROM user_roles WHERE role_name = 'student';

    -- Admin gets all features
    INSERT INTO public.role_features (role_id, feature_id)
    SELECT admin_role_id, id FROM system_features;

    -- Staff gets core operational features
    INSERT INTO public.role_features (role_id, feature_id)
    SELECT staff_role_id, id FROM system_features 
    WHERE feature_key IN ('dashboard', 'hr_admin', 'employee_management', 'attendance_tracking', 'task_management', 'education_management', 'student_management', 'teacher_management', 'inventory_management', 'reports_analytics');

    -- Trainer gets training and education features
    INSERT INTO public.role_features (role_id, feature_id)
    SELECT trainer_role_id, id FROM system_features 
    WHERE feature_key IN ('dashboard', 'skill_development', 'training_programs', 'certification_tracking', 'student_management', 'education_management', 'reports_analytics');

    -- Student gets basic access features
    INSERT INTO public.role_features (role_id, feature_id)
    SELECT student_role_id, id FROM system_features 
    WHERE feature_key IN ('dashboard', 'skill_development', 'career_centre', 'job_centre');
END $$;

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user has feature access
CREATE OR REPLACE FUNCTION public.user_has_feature_access(user_id UUID, feature_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_role_assignments ura
    JOIN role_features rf ON ura.role_id = rf.role_id
    JOIN system_features sf ON rf.feature_id = sf.id
    WHERE ura.user_id = user_id 
    AND sf.feature_key = feature_key
    AND ura.is_active = true
    AND sf.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;