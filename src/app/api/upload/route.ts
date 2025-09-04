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

    // Upload torrent file to Supabase Storage
    const fileName = `${slug}-${Date.now()}.torrent`
    const fileBuffer = await file.arrayBuffer()
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('torrent-files')
      .upload(fileName, fileBuffer, {
        contentType: 'application/x-bittorrent',
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload torrent file to storage' },
        { status: 500 }
      )
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('torrent-files')
      .getPublicUrl(fileName)

    // Use anonymous user for uploads until authentication is implemented
    const { data: anonymousUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'anonymous')
      .single()
    
    if (!anonymousUser) {
      return NextResponse.json(
        { error: 'System user not found. Please contact administrator.' },
        { status: 500 }
      )
    }

    // Insert torrent into database
    const { data: torrent, error } = await supabase
      .from('torrents')
      .insert({
        title,
        slug,
        description: description || null,
        category_id: categoryId,
        uploader_id: anonymousUser.id,
        info_hash: parsedTorrent.infoHash,
        file_size: parsedTorrent.totalSize,
        piece_length: parsedTorrent.pieceLength,
        magnet_link: parsedTorrent.magnetLink,
        torrent_file_path: publicUrlData.publicUrl,
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
        { 
          error: 'Failed to save torrent to database',
          details: error.message 
        },
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
