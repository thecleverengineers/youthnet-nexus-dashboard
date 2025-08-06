-- Auto-confirm demo user emails to prevent email confirmation issues
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email IN (
  'admin@youthnet.in',
  'staff@youthnet.in', 
  'trainer@youthnet.in',
  'student@youthnet.in'
);