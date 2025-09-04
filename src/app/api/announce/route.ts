import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

interface AnnounceParams {
  info_hash: string
  peer_id: string
  port: number
  uploaded: number
  downloaded: number
  left: number
  event?: string
  compact?: boolean
  numwant: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract and validate required parameters
    const requiredParams = ['info_hash', 'peer_id', 'port', 'uploaded', 'downloaded', 'left']
    for (const param of requiredParams) {
      if (!searchParams.get(param)) {
        return sendError(`Missing required parameter: ${param}`)
      }
    }

    const params: AnnounceParams = {
      info_hash: decodeInfoHash(searchParams.get('info_hash')!),
      peer_id: searchParams.get('peer_id')!,
      port: parseInt(searchParams.get('port')!) || 0,
      uploaded: parseInt(searchParams.get('uploaded')!) || 0,
      downloaded: parseInt(searchParams.get('downloaded')!) || 0,
      left: parseInt(searchParams.get('left')!) || 0,
      event: searchParams.get('event') || undefined,
      compact: searchParams.get('compact') === '1',
      numwant: parseInt(searchParams.get('numwant') || '50') || 50
    }

    const supabase = await createServerSupabaseClient()
    
    // Get client IP
    const clientIP = getClientIP(request)

    // Check if torrent exists
    const { data: torrent, error: torrentError } = await supabase
      .from('torrents')
      .select('id')
      .eq('info_hash', params.info_hash)
      .single()

    if (torrentError || !torrent) {
      return sendError('Torrent not registered')
    }

    // Update or insert peer
    const { error: peerError } = await supabase
      .from('peers')
      .upsert({
        peer_id: params.peer_id,
        info_hash: params.info_hash,
        ip_address: clientIP,
        port: params.port,
        uploaded: params.uploaded,
        downloaded: params.downloaded,
        left_bytes: params.left,
        event: params.event,
        last_announce: new Date().toISOString(),
        is_seeder: params.left === 0
      }, {
        onConflict: 'peer_id,info_hash'
      })

    if (peerError) {
      console.error('Peer upsert error:', peerError)
    }

    // Get active peers for this torrent (last hour)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    const { data: peers, error: peersError } = await supabase
      .from('peers')
      .select('ip_address, port, peer_id')
      .eq('info_hash', params.info_hash)
      .gte('last_announce', oneHourAgo)
      .limit(params.numwant)

    if (peersError) {
      console.error('Peers fetch error:', peersError)
      return sendError('Database error')
    }

    // Get stats
    const { data: stats } = await supabase
      .from('peers')
      .select('is_seeder')
      .eq('info_hash', params.info_hash)
      .gte('last_announce', oneHourAgo)

    const seeders = stats?.filter(p => p.is_seeder).length || 0
    const leechers = stats?.filter(p => !p.is_seeder).length || 0

    // Build response
    const response = buildAnnounceResponse({
      interval: 1800, // 30 minutes
      'min interval': 900, // 15 minutes
      complete: seeders,
      incomplete: leechers,
      peers: peers || []
    }, params.compact)

    return new NextResponse(response, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Announce error:', error)
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

function buildAnnounceResponse(data: {
  interval: number
  'min interval': number
  complete: number
  incomplete: number
  peers: Array<{ peer_id: string; ip_address: string; port: number }>
}, compact: boolean = false) {
  if (compact) {
    // Compact format: concatenated 6-byte strings (4 bytes IP + 2 bytes port)
    const peersBinary = Buffer.concat(
      data.peers.map((peer) => {
        const ip = peer.ip_address.split('.').map((octet: string) => parseInt(octet))
        const port = peer.port
        return Buffer.from([...ip, port >> 8, port & 0xFF])
      })
    )
    
    return bencode({
      interval: data.interval,
      'min interval': data['min interval'],
      complete: data.complete,
      incomplete: data.incomplete,
      peers: peersBinary
    })
  } else {
    // Dictionary format
    const peersDict = data.peers.map((peer) => ({
      'peer id': peer.peer_id,
      ip: peer.ip_address,
      port: peer.port
    }))
    
    return bencode({
      interval: data.interval,
      'min interval': data['min interval'],
      complete: data.complete,
      incomplete: data.incomplete,
      peers: peersDict
    })
  }
}

function decodeInfoHash(hash: string): string {
  // URL decode and convert to hex string
  return decodeURIComponent(hash)
    .split('')
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return '127.0.0.1'
}

function bencode(data: unknown): string {
  // Simple bencode implementation
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
