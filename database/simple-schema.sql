-- Simple, bulletproof user registration system
-- Drop and recreate everything cleanly

-- Drop existing tables in correct order
DROP TABLE IF EXISTS public.torrents CASCADE;
DROP TABLE IF EXISTS public.peers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;

-- Create simple enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Simple users table - no complex constraints
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    passkey TEXT UNIQUE NOT NULL DEFAULT substring(encode(gen_random_bytes(16), 'hex'), 1, 32),
    role user_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Simple categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Simple torrents table
CREATE TABLE public.torrents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    info_hash TEXT UNIQUE NOT NULL,
    file_size BIGINT NOT NULL,
    piece_length INTEGER NOT NULL,
    magnet_link TEXT NOT NULL,
    torrent_file_path TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    uploader_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    download_count INTEGER DEFAULT 0 NOT NULL,
    seed_count INTEGER DEFAULT 0 NOT NULL,
    leech_count INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Simple peers table
CREATE TABLE public.peers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    peer_id TEXT NOT NULL,
    info_hash TEXT NOT NULL,
    ip_address INET NOT NULL,
    port INTEGER NOT NULL,
    uploaded BIGINT DEFAULT 0 NOT NULL,
    downloaded BIGINT DEFAULT 0 NOT NULL,
    left_bytes BIGINT DEFAULT 0 NOT NULL,
    event TEXT,
    last_announce TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_seeder BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(peer_id, info_hash)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_passkey ON public.users(passkey);
CREATE INDEX idx_torrents_info_hash ON public.torrents(info_hash);
CREATE INDEX idx_torrents_uploader ON public.torrents(uploader_id);
CREATE INDEX idx_peers_info_hash ON public.peers(info_hash);
CREATE INDEX idx_peers_last_announce ON public.peers(last_announce);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
('Games', 'games', 'macOS games and entertainment software', '🎮', 1),
('Productivity', 'productivity', 'Apps for work, organization, and productivity', '⚡', 2),
('Developer Tools', 'developer-tools', 'Development environments, editors, and utilities', '💻', 3),
('Design', 'design', 'Creative and design applications', '🎨', 4),
('Utilities', 'utilities', 'System utilities and maintenance tools', '🔧', 5);

-- Create admin user
INSERT INTO public.users (email, username, passkey, role) VALUES
('admin@mactorrents.com', 'admin', 'ADMIN1234567890123456789012', 'admin');

-- Simple RLS policies - allow everything for now
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torrents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peers ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (we'll tighten this later)
CREATE POLICY "Allow all users operations" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all torrents operations" ON public.torrents FOR ALL USING (true);
CREATE POLICY "Allow all peers operations" ON public.peers FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.torrents TO anon, authenticated;
GRANT ALL ON public.peers TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
