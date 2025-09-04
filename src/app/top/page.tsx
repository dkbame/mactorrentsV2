import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Download, Calendar } from 'lucide-react'

export default function TopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Top Downloads
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Most popular macOS applications and games downloaded by the community.
          </p>
        </div>

        {/* Time Period Filters */}
        <div className="flex justify-center space-x-4">
          <Button variant="default" size="sm">Today</Button>
          <Button variant="outline" size="sm">This Week</Button>
          <Button variant="outline" size="sm">This Month</Button>
          <Button variant="outline" size="sm">All Time</Button>
        </div>

        {/* Placeholder Content */}
        <div className="text-center py-16">
          <div className="space-y-4">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Top downloads will appear here once users start uploading and downloading torrents.
            </p>
            <div className="pt-4">
              <Button className="bg-apple-blue text-white hover:bg-apple-blue/90">
                <a href="/upload">Upload a Torrent</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
