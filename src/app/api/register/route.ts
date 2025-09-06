import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()
    
    if (!email || !password || !username) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, password, username' 
      }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ 
        error: 'Registration failed',
        details: authError.message 
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'No user data returned' 
      }, { status: 500 })
    }

    // Generate passkey
    const passkey = Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]
    ).join('')

    // Create user profile in our simple users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        username,
        passkey,
        role: 'user'
      })
      .select()
      .single()

    if (userError) {
      console.error('User profile creation error:', userError)
      return NextResponse.json({ 
        error: 'User profile creation failed',
        details: userError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        passkey: userData.passkey,
        role: userData.role
      },
      message: 'Registration successful!'
    })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
