import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('Test API called')
    
    const supabase = await createServerSupabaseClient()
    console.log('Supabase client created')
    
    // Test database connection
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name')
      .limit(1)
    
    console.log('Categories test:', { categories, error: catError?.message })
    
    // Test storage connection
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    console.log('Storage test:', { buckets: buckets?.map(b => b.name), error: storageError?.message })
    
    return NextResponse.json({
      status: 'API working',
      database: catError ? 'error' : 'connected',
      storage: storageError ? 'error' : 'connected',
      buckets: buckets?.map(b => b.name) || [],
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        error: 'Test API failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
