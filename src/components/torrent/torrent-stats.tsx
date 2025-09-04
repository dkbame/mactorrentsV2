'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, Download } from 'lucide-react'

interface TorrentStatsProps {
  seeders: number
  leechers: number
  completed?: number
  className?: string
  showLabels?: boolean
}

export function TorrentStats({ 
  seeders, 
  leechers, 
  completed, 
  className = "",
  showLabels = false 
}: TorrentStatsProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge 
        variant="success" 
        className="text-xs bg-apple-green/10 text-apple-green border-apple-green/20"
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        {seeders}
        {showLabels && <span className="ml-1">S</span>}
      </Badge>
      
      <Badge 
        variant="secondary" 
        className="text-xs bg-apple-orange/10 text-apple-orange border-apple-orange/20"
      >
        <Download className="h-3 w-3 mr-1" />
        {leechers}
        {showLabels && <span className="ml-1">L</span>}
      </Badge>
      
      {completed !== undefined && (
        <Badge 
          variant="outline" 
          className="text-xs"
        >
          {completed} completed
        </Badge>
      )}
    </div>
  )
}

export function TorrentStatsInline({ 
  seeders, 
  leechers, 
  className = "" 
}: Omit<TorrentStatsProps, 'completed' | 'showLabels'>) {
  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      <span className="text-apple-green font-medium">🌱 {seeders}</span>
      {' '}
      <span className="text-apple-orange font-medium">📥 {leechers}</span>
    </span>
  )
}
