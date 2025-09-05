-- Create a system user for uploads when no authentication is available
-- This is a temporary solution until proper user authentication is implemented

-- Insert anonymous user with explicit UUID generation
INSERT INTO public.users (id, email, username, role, is_active) 
VALUES (
  uuid_generate_v4(),
  'anonymous@mactorrents.com',
  'anonymous',
  'user',
  true
) ON CONFLICT (email) DO NOTHING;
