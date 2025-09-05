import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    console.log('Simple upload API called')
    
    const formData = await request.formData()
    const file = formData.get('torrent') as File
    const title = formData.get('title') as string
    const categoryId = formData.get('category_id') as string

    console.log('Received data:', { 
      hasFile: !!file, 
      title: title?.substring(0, 50), 
      categoryId,
      fileName: file?.name 
    })

    if (!file || !title || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Test Supabase connection
    const supabase = await createServerSupabaseClient()
    console.log('Supabase client created')

    // Test storage upload
    const fileName = `test-${Date.now()}.torrent`
    const fileBuffer = await file.arrayBuffer()
    
    console.log('Uploading to storage...')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('torrent-files')
      .upload(fileName, fileBuffer, {
        contentType: 'application/x-bittorrent'
      })

    if (uploadError) {
      console.error('Storage upload failed:', uploadError)
      return NextResponse.json(
        { 
          error: 'Storage upload failed',
          details: uploadError.message
        },
        { status: 500 }
      )
    }

    console.log('Storage upload successful:', uploadData.path)

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('torrent-files')
      .getPublicUrl(fileName)

    console.log('Public URL generated:', publicUrlData.publicUrl)

    return NextResponse.json({
      success: true,
      message: 'Simple upload test successful',
      fileName,
      publicUrl: publicUrlData.publicUrl,
      fileSize: file.size
    })

  } catch (error) {
    console.error('Simple upload error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
