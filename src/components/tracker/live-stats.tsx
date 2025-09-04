'use client'

import { useTrackerStats } from '@/hooks/use-tracker-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Download, Users, HardDrive, Activity } from 'lucide-react'

export function LiveStats() {
  const { stats, loading, error } = useTrackerStats()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="glass animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-12 mb-1"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="glass border-destructive/50">
        <CardContent className="pt-6">
          <p className="text-destructive text-sm">Failed to load tracker stats: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Tracker Stats</h3>
        <Badge variant="success" className="animate-pulse">
          <Activity className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-apple-blue" />
              Torrents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.torrents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active torrents</p>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-apple-green" />
              Seeders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-apple-green">{stats.seeders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active seeders</p>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-2 text-apple-orange" />
              Leechers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-apple-orange">{stats.leechers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active leechers</p>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-apple-purple" />
              Total Peers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-apple-purple">{stats.peers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Connected peers</p>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-2 text-apple-pink" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-apple-pink">{stats.downloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total downloads</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  )
}
