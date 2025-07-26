-- Allow reading admin profiles for initialization check
-- This is needed for the admin service to check if default admin exists
CREATE POLICY "Allow service role to read admin profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow authenticated users to read their own profile
  auth.uid() = id 
  OR 
  -- Allow service role or when checking for admin existence
  auth.role() = 'service_role'
  OR
  -- Allow checking for admin profiles during initialization
  (role = 'admin' AND email = 'thecleverengineers@gmail.com')
);