-- Random UUID cleanup - use completely random UUID
-- This avoids any existing UUID conflicts

-- Add missing columns to users table (if they don't exist)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passkey VARCHAR(32) UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create index for passkey lookups
CREATE INDEX IF NOT EXISTS idx_users_passkey ON public.users(passkey);

-- Generate a completely random UUID for admin
-- Using uuid_generate_v4() to ensure no conflicts
DO $$
DECLARE
    admin_uuid UUID;
BEGIN
    -- Generate random UUID
    admin_uuid := uuid_generate_v4();
    
    -- Create admin user in auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        admin_uuid,
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
        admin_uuid,
        'admin@mactorrents.com',
        'admin',
        'ADMIN1234567890123456789012',
        'admin',
        NOW(),
        true,
        '{}'
    );
    
    -- Show the created admin user
    RAISE NOTICE 'Admin user created with UUID: %', admin_uuid;
END $$;

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
