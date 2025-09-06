-- Clean up all existing users and data
-- WARNING: This will delete all user data!

-- Delete all torrents first (due to foreign key constraints)
DELETE FROM public.torrents;

-- Delete all peers
DELETE FROM public.peers;

-- Delete all users
DELETE FROM public.users;

-- Delete all auth users (this will also clean up auth sessions)
DELETE FROM auth.users;

-- Reset sequences if they exist
DO $$
BEGIN
    -- Reset any auto-increment sequences
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'users_id_seq') THEN
        ALTER SEQUENCE public.users_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'torrents_id_seq') THEN
        ALTER SEQUENCE public.torrents_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'peers_id_seq') THEN
        ALTER SEQUENCE public.peers_id_seq RESTART WITH 1;
    END IF;
END $$;

-- Create a super admin user
-- First, create the auth user
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@mactorrents.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NOW(),
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "admin"}',
    true,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    false,
    NULL
);

-- Create the public user profile for admin
INSERT INTO public.users (
    id,
    email,
    username,
    passkey,
    role,
    created_at,
    is_verified,
    profile_data
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@mactorrents.com',
    'admin',
    'ADMIN_PASSKEY_1234567890123456789012',
    'admin',
    NOW(),
    true,
    '{}'
);

-- Create some test categories if they don't exist
INSERT INTO public.categories (name, slug, description, icon, sort_order, is_active)
VALUES 
    ('Games', 'games', 'macOS games and entertainment software', '🎮', 1, true),
    ('Productivity', 'productivity', 'Apps for work, organization, and productivity', '⚡', 2, true),
    ('Developer Tools', 'developer-tools', 'Development environments, editors, and utilities', '💻', 3, true),
    ('Design', 'design', 'Creative and design applications', '🎨', 4, true),
    ('Utilities', 'utilities', 'System utilities and maintenance tools', '🔧', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Show the created admin user
SELECT 
    u.id,
    u.email,
    u.username,
    u.passkey,
    u.role,
    u.created_at
FROM public.users u
WHERE u.email = 'admin@mactorrents.com';

-- Show all users (should only be admin now)
SELECT 
    u.id,
    u.email,
    u.username,
    u.role,
    u.created_at
FROM public.users u
ORDER BY u.created_at;
