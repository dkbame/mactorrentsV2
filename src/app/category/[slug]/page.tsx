import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  
  // Fetch category info
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/categories">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {category.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder={`Search ${category.name.toLowerCase()}...`}
                  className="pl-10"
                />
              </div>
              <Button className="bg-apple-blue text-white hover:bg-apple-blue/90">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Torrents Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{category.name} Apps</h2>
            <Badge variant="secondary">0 apps</Badge>
          </div>

          {/* Placeholder - No torrents yet */}
          <div className="text-center py-16">
            <div className="space-y-4">
              <div className="text-6xl">{category.icon}</div>
              <h3 className="text-xl font-semibold">No {category.name} Apps Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This category is waiting for its first upload. Share a free {category.name.toLowerCase()} app with the community!
              </p>
              <div className="pt-4">
                <Button className="bg-apple-blue text-white hover:bg-apple-blue/90">
                  <a href="/upload">Upload to {category.name}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
