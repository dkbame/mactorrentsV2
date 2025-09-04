import Link from 'next/link'
import { ArrowRight, Download, Upload, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createServerSupabaseClient } from '@/lib/supabase'
import { LiveStats } from '@/components/tracker/live-stats'
import { TorrentStatsInline } from '@/components/torrent/torrent-stats'

export default async function Home() {
  // Fetch real categories from Supabase
  const supabase = await createServerSupabaseClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  // Fallback to empty array if there's an error
  const featuredCategories = categories || []

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-apple-blue/10 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Free macOS Apps & Games
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Discover and download free macOS applications and games through BitTorrent. 
              A curated platform for open-source and freeware macOS software.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-apple-blue text-white hover:bg-apple-blue/90" asChild>
                <Link href="/browse">
                  <Download className="mr-2 h-4 w-4" />
                  Browse Apps
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Torrent
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <LiveStats />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Browse by Category
            </h2>
            <p className="mt-4 text-muted-foreground">
              Discover apps organized by Apple&apos;s official macOS categories
            </p>
          </div>
          
          {featuredCategories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredCategories.map((category) => (
                  <Card key={category.slug} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] glass border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-accent/50 backdrop-blur-sm" asChild>
                        <Link href={`/category/${category.slug}`}>
                          Browse {category.name}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/categories">
                    View All Categories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {error ? 'Unable to load categories. Please try again later.' : 'Loading categories...'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Uploads */}
      <section className="py-16 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Recent Uploads
              </h2>
              <p className="mt-2 text-muted-foreground">
                Latest apps and games added to the platform
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/recent">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Placeholder for recent torrents - will be populated with real data later */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Games</Badge>
                    <Badge variant="success">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <CardTitle>Sample macOS Game {i}</CardTitle>
                  <CardDescription>
                    A fantastic free game for macOS users to enjoy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>250 MB</span>
                    <TorrentStatsInline seeders={45} leechers={12} />
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}