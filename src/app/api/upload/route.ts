import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { parseTorrentFile } from '@/lib/torrent'
import { createSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('torrent') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('category_id') as string

    if (!file || !title || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.torrent')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a .torrent file' },
        { status: 400 }
      )
    }

    // Parse torrent file
    let parsedTorrent
    try {
      const buffer = await file.arrayBuffer()
      parsedTorrent = parseTorrentFile(Buffer.from(buffer))
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid torrent file format' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Check if torrent already exists
    const { data: existing } = await supabase
      .from('torrents')
      .select('id')
      .eq('info_hash', parsedTorrent.infoHash)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This torrent already exists on the platform' },
        { status: 409 }
      )
    }

    // Create slug from title
    const slug = createSlug(title)

    // Insert torrent into database
    const { data: torrent, error } = await supabase
      .from('torrents')
      .insert({
        title,
        slug,
        description: description || null,
        category_id: categoryId,
        uploader_id: 'placeholder-user-id', // TODO: Replace with real user ID
        info_hash: parsedTorrent.infoHash,
        file_size: parsedTorrent.totalSize,
        piece_length: parsedTorrent.pieceLength,
        magnet_link: parsedTorrent.magnetLink,
        metadata: {
          files: parsedTorrent.files,
          announce: parsedTorrent.announce,
          comment: parsedTorrent.comment,
          createdBy: parsedTorrent.createdBy,
          creationDate: parsedTorrent.creationDate
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save torrent to database' },
        { status: 500 }
      )
    }

    // Insert individual files
    if (parsedTorrent.files.length > 0) {
      const fileRecords = parsedTorrent.files.map(file => ({
        torrent_id: torrent.id,
        file_path: file.path,
        file_size: file.size,
        file_type: file.path.split('.').pop() || null
      }))

      const { error: filesError } = await supabase
        .from('torrent_files')
        .insert(fileRecords)

      if (filesError) {
        console.error('Files insert error:', filesError)
        // Don't fail the upload for this, just log it
      }
    }

    return NextResponse.json({
      success: true,
      torrent: {
        id: torrent.id,
        title: torrent.title,
        slug: torrent.slug,
        magnet_link: torrent.magnet_link
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
