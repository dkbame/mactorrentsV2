import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
// Crypto import removed - not used in this file
import { createServerSupabaseClient } from './supabase'

interface Peer {
  peer_id: string
  ip: string
  port: number
  uploaded: number
  downloaded: number
  left: number
  event?: string
  compact?: boolean
}

interface AnnounceParams extends Peer {
  info_hash: string
  numwant: number
}

export class TorrentTracker {
  private server: ReturnType<typeof createServer>
  private port: number

  constructor(port: number = 8080) {
    this.port = port
    this.server = createServer(this.handleRequest.bind(this))
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const url = parse(req.url || '', true)
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    try {
      switch (url.pathname) {
        case '/announce':
          await this.handleAnnounce(req, res, url.query)
          break
        case '/scrape':
          await this.handleScrape(req, res, url.query)
          break
        case '/stats':
          await this.handleStats(req, res)
          break
        default:
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('Not Found')
      }
    } catch (error) {
      console.error('Tracker error:', error)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    }
  }

  private async handleAnnounce(req: IncomingMessage, res: ServerResponse, query: Record<string, string | string[] | undefined>) {
    // Validate required parameters
    const requiredParams = ['info_hash', 'peer_id', 'port', 'uploaded', 'downloaded', 'left']
    for (const param of requiredParams) {
      if (!query[param]) {
        return this.sendError(res, `Missing required parameter: ${param}`)
      }
    }

    const params: AnnounceParams = {
      info_hash: this.decodeInfoHash(query.info_hash as string),
      peer_id: query.peer_id as string,
      ip: this.getClientIP(req),
      port: parseInt(query.port as string) || 0,
      uploaded: parseInt(query.uploaded as string) || 0,
      downloaded: parseInt(query.downloaded as string) || 0,
      left: parseInt(query.left as string) || 0,
      event: query.event as string,
      compact: (query.compact as string) === '1',
      numwant: parseInt(query.numwant as string) || 50
    }

    try {
      const supabase = await createServerSupabaseClient()
      
      // Check if torrent exists
      const { data: torrent, error: torrentError } = await supabase
        .from('torrents')
        .select('id')
        .eq('info_hash', params.info_hash)
        .single()

      if (torrentError || !torrent) {
        return this.sendError(res, 'Torrent not registered')
      }

      // Update or insert peer
      const { error: peerError } = await supabase
        .from('peers')
        .upsert({
          peer_id: params.peer_id,
          info_hash: params.info_hash,
          ip_address: params.ip,
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

      // Get active peers for this torrent
      const { data: peers, error: peersError } = await supabase
        .from('peers')
        .select('ip_address, port, peer_id')
        .eq('info_hash', params.info_hash)
        .gte('last_announce', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .limit(params.numwant)

      if (peersError) {
        console.error('Peers fetch error:', peersError)
        return this.sendError(res, 'Database error')
      }

      // Get stats
      const { data: stats } = await supabase
        .from('peers')
        .select('is_seeder')
        .eq('info_hash', params.info_hash)
        .gte('last_announce', new Date(Date.now() - 3600000).toISOString())

      const seeders = stats?.filter(p => p.is_seeder).length || 0
      const leechers = stats?.filter(p => !p.is_seeder).length || 0

      // Build response
      const response = this.buildAnnounceResponse({
        interval: 1800, // 30 minutes
        'min interval': 900, // 15 minutes
        complete: seeders,
        incomplete: leechers,
        peers: peers || []
      }, params.compact)

      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(response)

    } catch (error) {
      console.error('Announce error:', error)
      return this.sendError(res, 'Internal error')
    }
  }

  private async handleScrape(req: IncomingMessage, res: ServerResponse, query: Record<string, string | string[] | undefined>) {
    const infoHashes = Array.isArray(query.info_hash) ? query.info_hash : [query.info_hash]
    
    if (!infoHashes[0]) {
      return this.sendError(res, 'Missing info_hash parameter')
    }

    try {
      const supabase = await createServerSupabaseClient()
      const results: Record<string, { complete: number; incomplete: number; downloaded: number }> = {}

      for (const hashParam of infoHashes) {
        if (!hashParam) continue
        
        const infoHash = this.decodeInfoHash(hashParam)
        
        const { data: stats } = await supabase
          .from('peers')
          .select('is_seeder')
          .eq('info_hash', infoHash)
          .gte('last_announce', new Date(Date.now() - 3600000).toISOString())

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

      const response = this.bencode({ files: results })
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(response)

    } catch (error) {
      console.error('Scrape error:', error)
      return this.sendError(res, 'Internal error')
    }
  }

  private async handleStats(req: IncomingMessage, res: ServerResponse) {
    try {
      const supabase = await createServerSupabaseClient()
      
      const { data: torrents, error: torrentsError } = await supabase
        .from('torrents')
        .select('id')
        .eq('is_active', true)

      const { data: peers, error: peersError } = await supabase
        .from('peers')
        .select('is_seeder')
        .gte('last_announce', new Date(Date.now() - 3600000).toISOString())

      if (torrentsError || peersError) {
        return this.sendError(res, 'Database error')
      }

      const stats = {
        torrents: torrents?.length || 0,
        seeders: peers?.filter(p => p.is_seeder).length || 0,
        leechers: peers?.filter(p => !p.is_seeder).length || 0,
        peers: peers?.length || 0
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(stats))

    } catch (error) {
      console.error('Stats error:', error)
      return this.sendError(res, 'Internal error')
    }
  }

  private sendError(res: ServerResponse, message: string) {
    const response = this.bencode({ 'failure reason': message })
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(response)
  }

  private buildAnnounceResponse(data: {
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
      
      return this.bencode({
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
      
      return this.bencode({
        interval: data.interval,
        'min interval': data['min interval'],
        complete: data.complete,
        incomplete: data.incomplete,
        peers: peersDict
      })
    }
  }

  private decodeInfoHash(hash: string): string {
    // URL decode and convert to hex string
    return decodeURIComponent(hash)
      .split('')
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  }

  private getClientIP(req: IncomingMessage): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    )
  }

  private bencode(data: unknown): string {
    // Simple bencode implementation
    if (typeof data === 'string') {
      return `${data.length}:${data}`
    } else if (typeof data === 'number') {
      return `i${data}e`
    } else if (Buffer.isBuffer(data)) {
      return `${data.length}:${data.toString('binary')}`
    } else if (Array.isArray(data)) {
      return `l${data.map(item => this.bencode(item)).join('')}e`
    } else if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data).sort()
      const pairs = keys.map(key => this.bencode(key) + this.bencode((data as Record<string, unknown>)[key]))
      return `d${pairs.join('')}e`
    }
    return ''
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (err?: Error) => {
        if (err) {
          reject(err)
        } else {
          console.log(`Torrent tracker running on port ${this.port}`)
          resolve()
        }
      })
    })
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log('Torrent tracker stopped')
        resolve()
      })
    })
  }
}
