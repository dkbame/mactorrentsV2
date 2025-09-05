import { createServerSupabaseClient } from '@/lib/supabase-server'
import { TorrentCard } from './torrent-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import Link from 'next/link'

export async function RecentTorrents() {
  const supabase = await createServerSupabaseClient()
  
  // Fetch recent torrents
  const { data: torrents, error } = await supabase
    .from('torrents')
    .select(`
      *,
      categories (
        name,
        slug,
        icon
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching recent torrents:', error)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load recent torrents</p>
      </div>
    )
  }

  if (!torrents || torrents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="text-6xl">📦</div>
          <h3 className="text-xl font-semibold">Great! Your First Torrent is Uploaded!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your torrent has been successfully uploaded. It should appear here once the database updates.
          </p>
          <div className="pt-4">
            <Link href="/browse">
              <Button className="bg-apple-blue text-white hover:bg-apple-blue/90">
                Browse All Torrents
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Transform data for TorrentCard component
  const torrentCards = torrents.map(torrent => ({
    id: torrent.id,
    title: torrent.title,
    slug: torrent.slug,
    description: torrent.description,
    category: {
      name: torrent.categories?.name || 'Unknown',
      icon: torrent.categories?.icon || '📦'
    },
    file_size: torrent.file_size,
    seed_count: torrent.seed_count,
    leech_count: torrent.leech_count,
    download_count: torrent.download_count,
    created_at: torrent.created_at,
    uploader: {
      username: 'Anonymous' // Since we don't have users yet
    },
    is_featured: torrent.is_featured
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {torrentCards.map((torrent) => (
        <TorrentCard key={torrent.id} torrent={torrent} />
      ))}
    </div>
  )
}
