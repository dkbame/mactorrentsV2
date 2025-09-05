import { createServerSupabaseClient } from './supabase-server'
import { createClientSupabaseClient } from './supabase-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface User {
  id: string
  email: string
  username: string
  passkey: string
  created_at: string
  is_verified: boolean
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user profile with passkey
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    username: profile.username,
    passkey: profile.passkey,
    created_at: profile.created_at,
    is_verified: user.email_confirmed_at !== null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
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
  return createClientSupabaseClient()
}
