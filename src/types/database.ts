export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          role: 'admin' | 'moderator' | 'user'
          created_at: string
          last_login: string | null
          is_active: boolean
          profile_data: Record<string, unknown> | null
        }
        Insert: {
          id?: string
          email: string
          username: string
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
          last_login?: string | null
          is_active?: boolean
          profile_data?: Record<string, any> | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
          last_login?: string | null
          is_active?: boolean
          profile_data?: Record<string, any> | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      torrents: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          info_hash: string
          file_size: number
          piece_length: number
          magnet_link: string
          torrent_file_path: string | null
          category_id: string
          uploader_id: string
          download_count: number
          seed_count: number
          leech_count: number
          rating: number
          metadata: Record<string, unknown> | null
          created_at: string
          updated_at: string
          is_active: boolean
          is_featured: boolean
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          info_hash: string
          file_size: number
          piece_length: number
          magnet_link: string
          torrent_file_path?: string | null
          category_id: string
          uploader_id: string
          download_count?: number
          seed_count?: number
          leech_count?: number
          rating?: number
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_featured?: boolean
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          info_hash?: string
          file_size?: number
          piece_length?: number
          magnet_link?: string
          torrent_file_path?: string | null
          category_id?: string
          uploader_id?: string
          download_count?: number
          seed_count?: number
          leech_count?: number
          rating?: number
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_featured?: boolean
        }
      }
      torrent_files: {
        Row: {
          id: string
          torrent_id: string
          file_path: string
          file_size: number
          file_type: string | null
        }
        Insert: {
          id?: string
          torrent_id: string
          file_path: string
          file_size: number
          file_type?: string | null
        }
        Update: {
          id?: string
          torrent_id?: string
          file_path?: string
          file_size?: number
          file_type?: string | null
        }
      }
      peers: {
        Row: {
          id: string
          peer_id: string
          info_hash: string
          ip_address: string
          port: number
          uploaded: number
          downloaded: number
          left: number
          event: string | null
          last_announce: string
          is_seeder: boolean
        }
        Insert: {
          id?: string
          peer_id: string
          info_hash: string
          ip_address: string
          port: number
          uploaded?: number
          downloaded?: number
          left?: number
          event?: string | null
          last_announce?: string
          is_seeder?: boolean
        }
        Update: {
          id?: string
          peer_id?: string
          info_hash?: string
          ip_address?: string
          port?: number
          uploaded?: number
          downloaded?: number
          left?: number
          event?: string | null
          last_announce?: string
          is_seeder?: boolean
        }
      }
      downloads: {
        Row: {
          id: string
          user_id: string
          torrent_id: string
          downloaded_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id: string
          torrent_id: string
          downloaded_at?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          torrent_id?: string
          downloaded_at?: string
          ip_address?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'moderator' | 'user'
    }
  }
}
