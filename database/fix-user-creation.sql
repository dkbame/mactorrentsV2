-- First, let's check what's happening
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Drop existing policies that might be blocking the trigger
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can create torrents" ON public.torrents;

-- Create a more permissive policy for user creation
CREATE POLICY "Allow user profile creation" ON public.users 
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to create torrents
CREATE POLICY "Users can create torrents" ON public.torrents 
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Keep the existing policies for torrents viewing
DROP POLICY IF EXISTS "Active torrents are viewable by everyone" ON public.torrents;
CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents 
  FOR SELECT USING (is_active = TRUE);

-- Test the trigger by creating a test user
-- This will help us see if the trigger works
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_email TEXT := 'test@example.com';
BEGIN
  -- Insert into auth.users (this should trigger our function)
  INSERT INTO auth.users (
    id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at,
    raw_user_meta_data
  ) VALUES (
    test_user_id,
    test_email,
    'encrypted_password_here',
    NOW(),
    NOW(),
    NOW(),
    '{"username": "testuser"}'
  );
  
  -- Check if the trigger created the profile
  IF EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) THEN
    RAISE NOTICE 'SUCCESS: User profile created by trigger';
  ELSE
    RAISE NOTICE 'ERROR: User profile NOT created by trigger';
  END IF;
  
  -- Clean up
  DELETE FROM auth.users WHERE id = test_user_id;
  DELETE FROM public.users WHERE id = test_user_id;
END $$;
