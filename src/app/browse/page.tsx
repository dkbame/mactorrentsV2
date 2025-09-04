import { createServerSupabaseClient } from '@/lib/supabase-server'
import { TorrentCard } from '@/components/torrent/torrent-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter } from 'lucide-react'

export default async function BrowsePage() {
  const supabase = await createServerSupabaseClient()
  
  // Fetch recent torrents (placeholder for now since we don't have real torrents yet)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Browse Torrents
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover and download free macOS applications and games from our curated collection.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder="Search for apps, games, or keywords..."
                  className="w-full"
                />
              </div>
              <div>
                <select className="w-full h-10 rounded-lg border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <option value="">All Categories</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <div className="text-sm text-muted-foreground">
                Sort by: 
                <select className="ml-2 bg-transparent border-none">
                  <option>Latest</option>
                  <option>Most Downloaded</option>
                  <option>Name A-Z</option>
                  <option>Size</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Uploads</h2>
            <span className="text-sm text-muted-foreground">0 torrents found</span>
          </div>

          {/* Placeholder - No torrents yet */}
          <div className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">📦</div>
              <h3 className="text-xl font-semibold">No Torrents Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to contribute! Upload a free macOS app or game to get started.
              </p>
              <div className="pt-4">
                <Button className="bg-apple-blue text-white hover:bg-apple-blue/90">
                  <a href="/upload">Upload First Torrent</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
