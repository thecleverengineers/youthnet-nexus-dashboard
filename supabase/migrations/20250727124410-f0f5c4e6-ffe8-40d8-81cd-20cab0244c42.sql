-- Security Migration: Create enum (final attempt)
-- 1. Create proper role enum
CREATE TYPE public.user_role AS ENUM ('student', 'trainer', 'staff', 'admin');

-- 2. Update profiles table to use enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;