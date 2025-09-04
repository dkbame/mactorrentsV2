import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Upload } from 'lucide-react'

export default function RecentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Recent Uploads
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Latest macOS applications and games added to the platform.
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="text-center py-16">
          <div className="space-y-4">
            <Clock className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Recent Uploads</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Recent uploads will appear here. Be the first to share a free macOS app or game!
            </p>
            <div className="pt-4">
              <Button className="bg-apple-blue text-white hover:bg-apple-blue/90">
                <a href="/upload">Upload Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
