-- Security Migration: Drop all remaining role-dependent policies
DROP POLICY IF EXISTS "Users can update their notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can view their notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Admin can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can manage performance reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Admin can manage placement analytics" ON public.placement_analytics;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage user activities" ON public.user_activities;
DROP POLICY IF EXISTS "Admin can manage role assignments" ON public.user_role_assignments;
DROP POLICY IF EXISTS "Admin can manage user role assignments" ON public.user_role_assignments;
DROP POLICY IF EXISTS "Users can view their own role assignments" ON public.user_role_assignments;
DROP POLICY IF EXISTS "Admin can manage user roles" ON public.user_roles;