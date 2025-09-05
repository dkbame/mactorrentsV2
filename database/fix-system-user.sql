-- First, let's check what roles are available
SELECT unnest(enum_range(NULL::user_role)) as available_roles;

-- Step 1: Add passkey column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passkey VARCHAR(32) UNIQUE;

-- Step 2: Create index for faster passkey lookups
CREATE INDEX IF NOT EXISTS idx_users_passkey ON public.users(passkey);

-- Step 3: Update existing users with passkeys (if any exist)
UPDATE public.users 
SET passkey = encode(gen_random_bytes(16), 'hex')
WHERE passkey IS NULL;

-- Step 4: Create a system user for legacy torrents (using 'user' role)
INSERT INTO public.users (id, email, username, role, passkey)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@mactorrents.com',
  'System',
  'user',
  'SYSTEM_PASSKEY_FOR_LEGACY_TORRENTS'
) ON CONFLICT (id) DO NOTHING;

-- Step 5: Update all torrents without uploader_id to use the system user
UPDATE public.torrents 
SET uploader_id = '00000000-0000-0000-0000-000000000000'
WHERE uploader_id IS NULL;

-- Step 6: Now we can safely make the column NOT NULL
ALTER TABLE public.torrents ALTER COLUMN uploader_id SET NOT NULL;

-- Step 7: Update RLS policies
DROP POLICY IF EXISTS "Allow anonymous torrent uploads" ON public.torrents;
CREATE POLICY "Users can create torrents" ON public.torrents 
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Step 8: Add RLS policy for users to see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

-- Step 9: Add RLS policy for users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Step 10: Update torrents policy for viewing
DROP POLICY IF EXISTS "Torrents are viewable by everyone" ON public.torrents;
CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents 
  FOR SELECT USING (is_active = TRUE);

-- Step 11: Add RLS policy for torrents - users can update their own torrents
CREATE POLICY "Users can update own torrents" ON public.torrents 
  FOR UPDATE USING (auth.uid() = uploader_id);
