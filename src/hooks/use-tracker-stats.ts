'use client'

import { useState, useEffect } from 'react'

interface TrackerStats {
  torrents: number
  seeders: number
  leechers: number
  peers: number
  downloads: number
  lastUpdated: string
}

interface TorrentStats {
  info_hash: string
  seeders: number
  leechers: number
  completed: number
}

export function useTrackerStats() {
  const [stats, setStats] = useState<TrackerStats>({
    torrents: 0,
    seeders: 0,
    leechers: 0,
    peers: 0,
    downloads: 0,
    lastUpdated: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchStats()

    // Set up interval for real-time updates
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error }
}

export function useTorrentStats(infoHash: string) {
  const [stats, setStats] = useState<TorrentStats>({
    info_hash: infoHash,
    seeders: 0,
    leechers: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!infoHash) return

    const fetchTorrentStats = async () => {
      try {
        const encodedHash = encodeURIComponent(infoHash)
        const response = await fetch(`/api/scrape?info_hash=${encodedHash}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch torrent stats')
        }

        // Note: This would need to be parsed from bencode format
        // For now, we'll use a simpler approach with the database
        const dbResponse = await fetch(`/api/torrents/${infoHash}/stats`)
        if (dbResponse.ok) {
          const data = await dbResponse.json()
          setStats({
            info_hash: infoHash,
            seeders: data.seeders || 0,
            leechers: data.leechers || 0,
            completed: data.completed || 0
          })
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchTorrentStats()

    // Set up interval for real-time updates
    const interval = setInterval(fetchTorrentStats, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [infoHash])

  return { stats, loading, error }
}
