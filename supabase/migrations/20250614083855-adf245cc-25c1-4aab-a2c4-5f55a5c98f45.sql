
-- Clean up existing unconfirmed demo accounts
DELETE FROM auth.users WHERE email IN (
  'admin@youthnet.in',
  'staff@youthnet.in', 
  'trainer@youthnet.in',
  'student@youthnet.in'
) AND email_confirmed_at IS NULL;

-- Clean up any orphaned profile records
DELETE FROM public.profiles WHERE email IN (
  'admin@youthnet.in',
  'staff@youthnet.in',
  'trainer@youthnet.in', 
  'student@youthnet.in'
) AND id NOT IN (SELECT id FROM auth.users);

-- Clean up any orphaned role-specific records
DELETE FROM public.employees WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.trainers WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.students WHERE user_id NOT IN (SELECT id FROM auth.users);
