import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    
    // Get torrent count
    const { data: torrents, error: torrentsError } = await supabase
      .from('torrents')
      .select('id')
      .eq('is_active', true)

    // Get active peers
    const { data: peers, error: peersError } = await supabase
      .from('peers')
      .select('is_seeder')
      .gte('last_announce', oneHourAgo)

    // Get total downloads
    const { data: downloads, error: downloadsError } = await supabase
      .from('downloads')
      .select('id')

    if (torrentsError || peersError || downloadsError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const seeders = peers?.filter(p => p.is_seeder).length || 0
    const leechers = peers?.filter(p => !p.is_seeder).length || 0

    const stats = {
      torrents: torrents?.length || 0,
      seeders,
      leechers,
      peers: peers?.length || 0,
      downloads: downloads?.length || 0,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(stats, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
