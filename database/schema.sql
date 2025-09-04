-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    profile_data JSONB DEFAULT '{}'::jsonb
);

-- Categories table
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Torrents table
CREATE TABLE public.torrents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    info_hash TEXT UNIQUE NOT NULL,
    file_size BIGINT NOT NULL,
    piece_length INTEGER NOT NULL,
    magnet_link TEXT NOT NULL,
    torrent_file_path TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    uploader_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    download_count INTEGER DEFAULT 0 NOT NULL,
    seed_count INTEGER DEFAULT 0 NOT NULL,
    leech_count INTEGER DEFAULT 0 NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0 NOT NULL CHECK (rating >= 0 AND rating <= 5),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL
);

-- Torrent files table (for multi-file torrents)
CREATE TABLE public.torrent_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    torrent_id UUID REFERENCES public.torrents(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT
);

-- Peers table (for tracker functionality)
CREATE TABLE public.peers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Downloads table (track user downloads)
CREATE TABLE public.downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    torrent_id UUID REFERENCES public.torrents(id) ON DELETE CASCADE NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ip_address INET
);

-- Ratings table (for future use)
CREATE TABLE public.ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    torrent_id UUID REFERENCES public.torrents(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, torrent_id)
);

-- Indexes for better performance
CREATE INDEX idx_torrents_category ON public.torrents(category_id);
CREATE INDEX idx_torrents_uploader ON public.torrents(uploader_id);
CREATE INDEX idx_torrents_created_at ON public.torrents(created_at DESC);
CREATE INDEX idx_torrents_is_active ON public.torrents(is_active);
CREATE INDEX idx_torrents_is_featured ON public.torrents(is_featured);
CREATE INDEX idx_torrents_info_hash ON public.torrents(info_hash);
CREATE INDEX idx_peers_info_hash ON public.peers(info_hash);
CREATE INDEX idx_peers_last_announce ON public.peers(last_announce);
CREATE INDEX idx_downloads_torrent_id ON public.downloads(torrent_id);
CREATE INDEX idx_downloads_user_id ON public.downloads(user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_torrents_updated_at BEFORE UPDATE ON public.torrents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update torrent stats
CREATE OR REPLACE FUNCTION update_torrent_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update seed and leech counts for the affected torrent
    UPDATE public.torrents SET
        seed_count = (
            SELECT COUNT(*)
            FROM public.peers
            WHERE info_hash = COALESCE(NEW.info_hash, OLD.info_hash)
            AND is_seeder = TRUE
            AND last_announce > NOW() - INTERVAL '1 hour'
        ),
        leech_count = (
            SELECT COUNT(*)
            FROM public.peers
            WHERE info_hash = COALESCE(NEW.info_hash, OLD.info_hash)
            AND is_seeder = FALSE
            AND last_announce > NOW() - INTERVAL '1 hour'
        )
    WHERE info_hash = COALESCE(NEW.info_hash, OLD.info_hash);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_torrent_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.peers
    FOR EACH ROW EXECUTE FUNCTION update_torrent_stats();

-- RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torrents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torrent_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Categories are readable by everyone
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (is_active = TRUE);

-- Torrents are readable by everyone if active
CREATE POLICY "Active torrents are viewable by everyone" ON public.torrents
    FOR SELECT USING (is_active = TRUE);

-- Users can create torrents
CREATE POLICY "Users can create torrents" ON public.torrents
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Users can update their own torrents
CREATE POLICY "Users can update own torrents" ON public.torrents
    FOR UPDATE USING (auth.uid() = uploader_id);

-- Torrent files are readable by everyone
CREATE POLICY "Torrent files are viewable by everyone" ON public.torrent_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.torrents
            WHERE id = torrent_id AND is_active = TRUE
        )
    );

-- Peers can be inserted/updated by anyone (for tracker functionality)
CREATE POLICY "Peers can be managed by tracker" ON public.peers
    FOR ALL USING (TRUE);

-- Downloads can be inserted by authenticated users
CREATE POLICY "Users can log downloads" ON public.downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Downloads are viewable by the user who made them
CREATE POLICY "Users can view own downloads" ON public.downloads
    FOR SELECT USING (auth.uid() = user_id);

-- Ratings can be managed by authenticated users
CREATE POLICY "Users can manage own ratings" ON public.ratings
    FOR ALL USING (auth.uid() = user_id);
