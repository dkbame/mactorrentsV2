import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { user_id, email, username } = await request.json()
    
    if (!user_id || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: user_id, email' 
      }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Call the database function to create user profile
    const { data, error } = await supabase.rpc('create_user_profile_api', {
      user_id,
      user_email: email,
      user_username: username || null
    })

    if (error) {
      console.error('Database function error:', error)
      return NextResponse.json({ 
        error: 'Failed to create user profile',
        details: error.message 
      }, { status: 500 })
    }

    if (data && !data.success) {
      return NextResponse.json({ 
        error: 'Profile creation failed',
        details: data.error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User profile created successfully',
      data 
    })

  } catch (error) {
    console.error('Create profile API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
