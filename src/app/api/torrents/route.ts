import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('torrents')
      .select(`
        *,
        categories (
          name,
          slug,
          icon
        ),
        users (
          username
        )
      `)
      .eq('is_active', true)

    // Apply filters
    if (category) {
      query = query.eq('categories.slug', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    const validSorts = ['created_at', 'download_count', 'seed_count', 'file_size', 'title']
    const sortField = validSorts.includes(sort) ? sort : 'created_at'
    const sortOrder = order === 'asc' ? { ascending: true } : { ascending: false }
    
    query = query.order(sortField, sortOrder)

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: torrents, error, count } = await query

    if (error) {
      console.error('Torrents fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch torrents' }, { status: 500 })
    }

    return NextResponse.json({
      torrents,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Torrents API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category_id,
      info_hash,
      file_size,
      piece_length,
      magnet_link,
      torrent_file_path,
      metadata
    } = body

    // Validate required fields
    if (!title || !category_id || !info_hash || !file_size || !piece_length || !magnet_link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data: torrent, error } = await supabase
      .from('torrents')
      .insert({
        title,
        slug,
        description,
        category_id,
        uploader_id: user.id,
        info_hash,
        file_size,
        piece_length,
        magnet_link,
        torrent_file_path,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('Torrent creation error:', error)
      return NextResponse.json({ error: 'Failed to create torrent' }, { status: 500 })
    }

    return NextResponse.json({ torrent }, { status: 201 })
  } catch (error) {
    console.error('Torrent creation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
