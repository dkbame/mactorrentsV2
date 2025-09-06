-- Truncate cleanup - completely reset tables
-- This will force clear everything

-- Truncate all tables (this is more forceful than DELETE)
TRUNCATE TABLE public.torrents CASCADE;
TRUNCATE TABLE public.peers CASCADE;
TRUNCATE TABLE public.users CASCADE;
TRUNCATE TABLE auth.users CASCADE;

-- Add missing columns to users table (if they don't exist)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passkey VARCHAR(32) UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create index for passkey lookups
CREATE INDEX IF NOT EXISTS idx_users_passkey ON public.users(passkey);

-- Create a simple admin user in auth.users
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@mactorrents.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "admin"}'
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
    'ADMIN1234567890123456789012',
    'admin',
    NOW(),
    true,
    '{}'
);

-- Show the created admin user
SELECT 
    u.id,
    u.email,
    u.username,
    u.passkey,
    u.role,
    u.created_at,
    u.is_verified
FROM public.users u
WHERE u.email = 'admin@mactorrents.com';

-- Show total user count
SELECT COUNT(*) as total_users FROM public.users;
