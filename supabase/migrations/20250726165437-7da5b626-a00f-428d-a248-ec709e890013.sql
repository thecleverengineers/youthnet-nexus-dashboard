-- Drop the conflicting policy and create a comprehensive one
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow service role to read admin profiles" ON public.profiles;

-- Create a comprehensive SELECT policy for profiles
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow authenticated users to read their own profile
  auth.uid() = id 
  OR 
  -- Allow checking for admin profiles during initialization (for admin service)
  (role = 'admin' AND email = 'thecleverengineers@gmail.com')
);