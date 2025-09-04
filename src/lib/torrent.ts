import bencode from 'bencode'
import { createHash } from 'crypto'

export interface TorrentFile {
  path: string[]
  length: number
}

export interface TorrentInfo {
  name: string
  files?: TorrentFile[]
  length?: number
  'piece length': number
  pieces: Buffer
}

export interface ParsedTorrent {
  info: TorrentInfo
  announce?: string
  'announce-list'?: string[][]
  comment?: string
  'created by'?: string
  'creation date'?: number
  encoding?: string
}

export interface TorrentMetadata {
  name: string
  infoHash: string
  magnetLink: string
  files: Array<{
    path: string
    size: number
  }>
  totalSize: number
  pieceLength: number
  announce: string[]
  comment?: string
  createdBy?: string
  creationDate?: Date
}

export function parseTorrentFile(buffer: Buffer): TorrentMetadata {
  try {
    const torrent = bencode.decode(buffer) as ParsedTorrent
    
    // Calculate info hash
    const infoBuffer = bencode.encode(torrent.info)
    const infoHash = createHash('sha1').update(infoBuffer).digest('hex')
    
    // Extract announce URLs
    const announceUrls: string[] = []
    if (torrent.announce) {
      announceUrls.push(torrent.announce)
    }
    if (torrent['announce-list']) {
      torrent['announce-list'].forEach(tier => {
        tier.forEach(url => {
          if (!announceUrls.includes(url)) {
            announceUrls.push(url)
          }
        })
      })
    }
    
    // Extract files information
    const files: Array<{ path: string; size: number }> = []
    let totalSize = 0
    
    if (torrent.info.files) {
      // Multi-file torrent
      torrent.info.files.forEach(file => {
        const filePath = Array.isArray(file.path) ? file.path.join('/') : String(file.path)
        files.push({
          path: filePath,
          size: file.length
        })
        totalSize += file.length
      })
    } else if (torrent.info.length) {
      // Single-file torrent
      const fileName = String(torrent.info.name || 'unknown')
      files.push({
        path: fileName,
        size: torrent.info.length
      })
      totalSize = torrent.info.length
    }
    
    // Generate magnet link
    const torrentName = String(torrent.info.name || 'unknown')
    const magnetLink = generateMagnetLink(infoHash, torrentName, announceUrls)
    
    return {
      name: torrentName,
      infoHash,
      magnetLink,
      files,
      totalSize,
      pieceLength: torrent.info['piece length'],
      announce: announceUrls,
      comment: torrent.comment,
      createdBy: torrent['created by'],
      creationDate: torrent['creation date'] ? new Date(torrent['creation date'] * 1000) : undefined
    }
  } catch (error) {
    throw new Error(`Failed to parse torrent file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function generateMagnetLink(infoHash: string, name: string, trackers: string[] = []): string {
  const defaultTracker = process.env.NEXT_PUBLIC_TRACKER_ANNOUNCE_URL || 'https://cmacked.netlify.app/api/announce'
  const allTrackers = [defaultTracker, ...trackers]
  
  let magnetLink = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}`
  
  allTrackers.forEach(tracker => {
    magnetLink += `&tr=${encodeURIComponent(tracker)}`
  })
  
  return magnetLink
}

export function validateTorrentFile(buffer: Buffer): boolean {
  try {
    const torrent = bencode.decode(buffer) as ParsedTorrent
    
    // Check required fields
    if (!torrent.info) return false
    if (!torrent.info.name) return false
    if (!torrent.info['piece length']) return false
    if (!torrent.info.pieces) return false
    
    // Check if it's either single-file or multi-file
    const hasFiles = torrent.info.files && Array.isArray(torrent.info.files)
    const hasLength = typeof torrent.info.length === 'number'
    
    if (!hasFiles && !hasLength) return false
    
    return true
  } catch {
    return false
  }
}
