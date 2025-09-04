import Link from 'next/link'
import { Download, Users, Upload, Calendar, HardDrive } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatBytes, formatDate } from '@/lib/utils'

interface TorrentCardProps {
  torrent: {
    id: string
    title: string
    slug: string
    description?: string
    category: {
      name: string
      icon: string
    }
    file_size: number
    seed_count: number
    leech_count: number
    download_count: number
    created_at: string
    uploader: {
      username: string
    }
    is_featured?: boolean
  }
}

export function TorrentCard({ torrent }: TorrentCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] glass">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{torrent.category.icon}</span>
            <Badge variant="secondary" className="text-xs">
              {torrent.category.name}
            </Badge>
            {torrent.is_featured && (
              <Badge variant="warning" className="text-xs">
                Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{torrent.seed_count}</span>
            <span className="text-apple-red">
              {torrent.leech_count}
            </span>
          </div>
        </div>
        
        <Link 
          href={`/torrent/${torrent.slug}`}
          className="group-hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-base line-clamp-2 leading-tight">
            {torrent.title}
          </h3>
        </Link>
        
        {torrent.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {torrent.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <HardDrive className="h-3 w-3" />
            <span>{formatBytes(torrent.file_size)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-3 w-3" />
            <span>{torrent.download_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(torrent.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Upload className="h-3 w-3" />
            <span>{torrent.uploader.username}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex w-full space-x-2">
          <Button 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/torrent/${torrent.slug}`}>
              View Details
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="px-3"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
