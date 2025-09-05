-- First, let's check what roles are available
SELECT unnest(enum_range(NULL::user_role)) as available_roles;

-- Step 1: Add passkey column to users table (32 characters should be enough)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passkey VARCHAR(32) UNIQUE;

-- Step 2: Create index for faster passkey lookups
CREATE INDEX IF NOT EXISTS idx_users_passkey ON public.users(passkey);

-- Step 3: Update existing users with passkeys (if any exist) - using shorter format
UPDATE public.users 
SET passkey = substring(encode(gen_random_bytes(16), 'hex'), 1, 32)
WHERE passkey IS NULL;

-- Step 4: Instead of creating a system user, let's just update existing torrents to have a valid uploader_id
-- First, let's see if there are any existing users we can use
SELECT id, username FROM public.users LIMIT 1;

-- If there are existing users, use the first one as the system user
-- If not, we'll need to create a real user first
UPDATE public.torrents 
SET uploader_id = (SELECT id FROM public.users LIMIT 1)
WHERE uploader_id IS NULL;

-- Step 5: Now we can safely make the column NOT NULL
ALTER TABLE public.torrents ALTER COLUMN uploader_id SET NOT NULL;

-- Step 6: Update RLS policies
DROP POLICY IF EXISTS "Allow anonymous torrent uploads" ON public.torrents;
CREATE POLICY "Users can create torrents" ON public.torrents 
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Step 7: Add RLS policy for users to see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

-- Step 8: Add RLS policy for users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Step 9: Update torrents policy for viewing
DROP POLICY IF EXISTS "Torrents are viewable by everyone" ON public.torrents;
CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents 
  FOR SELECT USING (is_active = TRUE);

-- Step 10: Add RLS policy for torrents - users can update their own torrents
CREATE POLICY "Users can update own torrents" ON public.torrents 
  FOR UPDATE USING (auth.uid() = uploader_id);
