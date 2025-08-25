-- Ensure profiles are auto-created for new auth users
-- 1) Drop existing trigger if it exists to avoid duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2) Create trigger to call existing function public.handle_new_user after a user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 3) Add index to speed up lookups by user_id on profiles (safe even if it exists with IF NOT EXISTS style)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i'
      AND c.relname = 'idx_profiles_user_id'
      AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_profiles_user_id ON public.profiles (user_id);
  END IF;
END $$;
