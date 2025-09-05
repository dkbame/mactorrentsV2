import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { info_hash } = await request.json()
    
    if (!info_hash) {
      return NextResponse.json({ error: 'Missing info_hash' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Check if torrent exists in our database
    const { data: torrent, error } = await supabase
      .from('torrents')
      .select('id, title')
      .eq('info_hash', info_hash)
      .single()

    if (error || !torrent) {
      return NextResponse.json({ 
        error: 'Torrent not found in database',
        info_hash 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      torrent: torrent.title,
      info_hash 
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
