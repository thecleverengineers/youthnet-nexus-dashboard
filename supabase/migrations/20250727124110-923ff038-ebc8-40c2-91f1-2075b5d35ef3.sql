-- Security Migration: Fix role enum (Part 1 - Drop conflicting policies)
-- Drop policies that depend on profiles.role column
DROP POLICY IF EXISTS "Admin can manage payroll" ON public.payroll;
DROP POLICY IF EXISTS "Admin can manage payroll cycles" ON public.payroll_cycles;
DROP POLICY IF EXISTS "Admin can manage staff templates" ON public.staff_templates;
DROP POLICY IF EXISTS "Admin can manage system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admin can manage system features" ON public.system_features;
DROP POLICY IF EXISTS "Admin can manage dynamic roles" ON public.dynamic_roles;
DROP POLICY IF EXISTS "Admin can manage role features" ON public.role_features;
DROP POLICY IF EXISTS "Admin can manage analytics cache" ON public.analytics_cache;
DROP POLICY IF EXISTS "Admin can manage backups" ON public.system_backups;
DROP POLICY IF EXISTS "Admin can manage landing page content" ON public.landing_page_content;
DROP POLICY IF EXISTS "Admin can view user activities" ON public.user_activities;