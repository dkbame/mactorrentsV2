-- First, let's debug what we have
SELECT 
  COUNT(*) as total_torrents,
  COUNT(uploader_id) as torrents_with_uploader,
  COUNT(*) - COUNT(uploader_id) as torrents_without_uploader
FROM public.torrents;

-- Check if there are any users
SELECT COUNT(*) as user_count FROM public.users;

-- If there are users, show them
SELECT id, username, email FROM public.users LIMIT 5;

-- Step 1: Add passkey column to users table (32 characters should be enough)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passkey VARCHAR(32) UNIQUE;

-- Step 2: Create index for faster passkey lookups
CREATE INDEX IF NOT EXISTS idx_users_passkey ON public.users(passkey);

-- Step 3: Update existing users with passkeys (if any exist) - using shorter format
UPDATE public.users 
SET passkey = substring(encode(gen_random_bytes(16), 'hex'), 1, 32)
WHERE passkey IS NULL;

-- Step 4: Handle torrents without uploader_id
-- If there are users, assign torrents to the first user
-- If no users exist, we'll need to create one first
DO $$
DECLARE
  user_count INTEGER;
  first_user_id UUID;
BEGIN
  -- Check if there are any users
  SELECT COUNT(*) INTO user_count FROM public.users;
  
  IF user_count > 0 THEN
    -- Get the first user's ID
    SELECT id INTO first_user_id FROM public.users LIMIT 1;
    
    -- Update all torrents without uploader_id
    UPDATE public.torrents 
    SET uploader_id = first_user_id
    WHERE uploader_id IS NULL;
    
    RAISE NOTICE 'Assigned % torrents to user %', 
      (SELECT COUNT(*) FROM public.torrents WHERE uploader_id = first_user_id), 
      first_user_id;
  ELSE
    RAISE NOTICE 'No users found. You need to create a user first.';
  END IF;
END $$;

-- Step 5: Now we can safely make the column NOT NULL (only if we have users)
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM public.torrents WHERE uploader_id IS NULL;
  
  IF null_count = 0 THEN
    ALTER TABLE public.torrents ALTER COLUMN uploader_id SET NOT NULL;
    RAISE NOTICE 'Successfully made uploader_id NOT NULL';
  ELSE
    RAISE NOTICE 'Cannot make uploader_id NOT NULL - % torrents still have NULL values', null_count;
  END IF;
END $$;

-- Step 6: Update RLS policies - drop existing ones first
DROP POLICY IF EXISTS "Allow anonymous torrent uploads" ON public.torrents;
DROP POLICY IF EXISTS "Users can create torrents" ON public.torrents;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Torrents are viewable by everyone" ON public.torrents;
DROP POLICY IF EXISTS "Active torrents are viewable by everyone" ON public.torrents;
DROP POLICY IF EXISTS "Users can update own torrents" ON public.torrents;

-- Step 7: Create new RLS policies
CREATE POLICY "Users can create torrents" ON public.torrents 
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents 
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can update own torrents" ON public.torrents 
  FOR UPDATE USING (auth.uid() = uploader_id);
