import { createClient } from './supabase-client'

export interface User {
  id: string
  email: string
  username: string
  passkey: string
  created_at: string
  is_verified: boolean
}

export async function generatePasskey(): Promise<string> {
  // Generate a 32-character random passkey
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getClientSupabase() {
  return createClient()
}
