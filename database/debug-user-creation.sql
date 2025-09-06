-- Check if the trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
  routine_name, 
  routine_type, 
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check current RLS policies on users table
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Check if we can insert into users table manually (for testing)
-- This should work if permissions are correct
INSERT INTO public.users (id, email, username, passkey, role)
VALUES (
  'test-user-id-123',
  'test@example.com',
  'testuser',
  'testpasskey1234567890123456789012',
  'user'
) ON CONFLICT (id) DO NOTHING;

-- Check if the insert worked
SELECT * FROM public.users WHERE id = 'test-user-id-123';

-- Clean up test data
DELETE FROM public.users WHERE id = 'test-user-id-123';
