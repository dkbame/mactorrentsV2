import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: categories, error } = await supabase
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
            Browse Categories
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore all official macOS App Store categories and discover free applications and games.
          </p>
        </div>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] glass h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{category.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {category.description}
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        0 torrents
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Click to browse
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {error ? 'Failed to load categories' : 'Loading categories...'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
