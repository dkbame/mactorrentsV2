-- Add passkey column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passkey VARCHAR(32) UNIQUE;

-- Create index for faster passkey lookups
CREATE INDEX IF NOT EXISTS idx_users_passkey ON public.users(passkey);

-- Update existing users with passkeys (if any exist)
UPDATE public.users 
SET passkey = encode(gen_random_bytes(16), 'hex')
WHERE passkey IS NULL;

-- Add RLS policy for users to see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

-- Add RLS policy for users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Update torrents table to require uploader_id
ALTER TABLE public.torrents ALTER COLUMN uploader_id SET NOT NULL;

-- Add RLS policy for torrents - users can create torrents
DROP POLICY IF EXISTS "Allow anonymous torrent uploads" ON public.torrents;
CREATE POLICY "Users can create torrents" ON public.torrents 
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Update torrents policy for viewing
DROP POLICY IF EXISTS "Torrents are viewable by everyone" ON public.torrents;
CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents 
  FOR SELECT USING (is_active = TRUE);

-- Add RLS policy for torrents - users can update their own torrents
CREATE POLICY "Users can update own torrents" ON public.torrents 
  FOR UPDATE USING (auth.uid() = uploader_id);
