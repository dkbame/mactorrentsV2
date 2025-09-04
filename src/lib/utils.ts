import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function generateMagnetLink(infoHash: string, name: string, trackers: string[] = []) {
  const defaultTracker = process.env.NEXT_PUBLIC_TRACKER_ANNOUNCE_URL || 'http://localhost:8080/announce'
  const allTrackers = [defaultTracker, ...trackers]
  
  let magnetLink = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}`
  
  allTrackers.forEach(tracker => {
    magnetLink += `&tr=${encodeURIComponent(tracker)}`
  })
  
  return magnetLink
}

export function createSlug(title: string): string {
  if (!title || typeof title !== 'string') {
    return 'untitled'
  }
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
