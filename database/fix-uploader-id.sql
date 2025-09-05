-- First, let's see what we have
SELECT COUNT(*) as total_torrents, 
       COUNT(uploader_id) as torrents_with_uploader,
       COUNT(*) - COUNT(uploader_id) as torrents_without_uploader
FROM public.torrents;

-- Option 1: Delete torrents without uploader_id (if you want to start fresh)
-- DELETE FROM public.torrents WHERE uploader_id IS NULL;

-- Option 2: Assign them to a system user (recommended)
-- First, create a system user if it doesn't exist
INSERT INTO public.users (id, email, username, role, passkey)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@mactorrents.com',
  'System',
  'system',
  'SYSTEM_PASSKEY_FOR_LEGACY_TORRENTS'
) ON CONFLICT (id) DO NOTHING;

-- Update all torrents without uploader_id to use the system user
UPDATE public.torrents 
SET uploader_id = '00000000-0000-0000-0000-000000000000'
WHERE uploader_id IS NULL;

-- Now we can safely make the column NOT NULL
ALTER TABLE public.torrents ALTER COLUMN uploader_id SET NOT NULL;
