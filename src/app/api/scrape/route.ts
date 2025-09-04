import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const infoHashParams = searchParams.getAll('info_hash')
    
    if (infoHashParams.length === 0) {
      return sendError('Missing info_hash parameter')
    }

    const supabase = await createServerSupabaseClient()
    const results: Record<string, { complete: number; incomplete: number; downloaded: number }> = {}
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

    for (const hashParam of infoHashParams) {
      if (!hashParam) continue
      
      const infoHash = decodeInfoHash(hashParam)
      
      // Get peer stats
      const { data: stats } = await supabase
        .from('peers')
        .select('is_seeder')
        .eq('info_hash', infoHash)
        .gte('last_announce', oneHourAgo)

      // Get torrent download count
      const { data: torrent } = await supabase
        .from('torrents')
        .select('download_count')
        .eq('info_hash', infoHash)
        .single()

      const seeders = stats?.filter(p => p.is_seeder).length || 0
      const leechers = stats?.filter(p => !p.is_seeder).length || 0

      results[infoHash] = {
        complete: seeders,
        incomplete: leechers,
        downloaded: torrent?.download_count || 0
      }
    }

    const response = bencode({ files: results })
    
    return new NextResponse(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Scrape error:', error)
    return sendError('Internal error')
  }
}

function sendError(message: string) {
  const response = bencode({ 'failure reason': message })
  return new NextResponse(response, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  })
}

function decodeInfoHash(hash: string): string {
  return decodeURIComponent(hash)
    .split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

function bencode(data: unknown): string {
  if (typeof data === 'string') {
    return `${data.length}:${data}`
  } else if (typeof data === 'number') {
    return `i${data}e`
  } else if (Buffer.isBuffer(data)) {
    return `${data.length}:${data.toString('binary')}`
  } else if (Array.isArray(data)) {
    return `l${data.map(item => bencode(item)).join('')}e`
  } else if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data).sort()
    const pairs = keys.map(key => bencode(key) + bencode((data as Record<string, unknown>)[key]))
    return `d${pairs.join('')}e`
  }
  return ''
}
