-- Simple fix for user creation issues
-- Drop restrictive policies and create permissive ones

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow user profile creation" ON public.users;
DROP POLICY IF EXISTS "Users can create torrents" ON public.torrents;

-- Create permissive policies for user creation
CREATE POLICY "Allow user profile creation" ON public.users 
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile  
CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to create torrents
CREATE POLICY "Users can create torrents" ON public.torrents 
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Keep existing torrent viewing policy
DROP POLICY IF EXISTS "Active torrents are viewable by everyone" ON public.torrents;
CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents 
  FOR SELECT USING (is_active = TRUE);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.torrents TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
GRANT ALL ON public.peers TO anon, authenticated;
