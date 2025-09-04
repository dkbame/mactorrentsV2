-- Create a system user for uploads when no authentication is available
-- This is a temporary solution until proper user authentication is implemented

-- Insert system user (this will be used for uploads when no user is authenticated)
INSERT INTO public.users (id, email, username, role, is_active) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@mactorrents.com',
  'system',
  'admin',
  true
) ON CONFLICT (id) DO NOTHING;

-- Also insert by email in case the UUID conflicts
INSERT INTO public.users (email, username, role, is_active) 
VALUES (
  'anonymous@mactorrents.com',
  'anonymous',
  'user',
  true
) ON CONFLICT (email) DO NOTHING;
