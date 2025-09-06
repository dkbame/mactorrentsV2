-- Test script to verify user registration works
-- This simulates what happens when a user registers

-- Test 1: Check if we can create a user profile using our function
SELECT public.create_user_profile_api(
    '11111111-1111-1111-1111-111111111111'::UUID,
    'test@example.com',
    'testuser'
) as test_result;

-- Test 2: Check if the user was created
SELECT 
    id,
    email,
    username,
    passkey,
    role,
    created_at
FROM public.users 
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Test 3: Test duplicate user creation (should not fail)
SELECT public.create_user_profile_api(
    '11111111-1111-1111-1111-111111111111'::UUID,
    'test@example.com',
    'testuser'
) as duplicate_test_result;

-- Test 4: Create another test user
SELECT public.create_user_profile_api(
    '22222222-2222-2222-2222-222222222222'::UUID,
    'test2@example.com',
    'testuser2'
) as test2_result;

-- Test 5: Show all test users
SELECT 
    id,
    email,
    username,
    passkey,
    role,
    created_at
FROM public.users 
WHERE email LIKE 'test%@example.com'
ORDER BY created_at;

-- Clean up test users
DELETE FROM public.users WHERE email LIKE 'test%@example.com';

-- Show final user count
SELECT COUNT(*) as total_users FROM public.users;
