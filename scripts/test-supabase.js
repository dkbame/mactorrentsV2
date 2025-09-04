#!/usr/bin/env node

// Simple script to test Supabase connection
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.log('Please update your .env.local file with:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔄 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('categories').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database error:', error.message)
      return
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database is ready for MacTorrents')
    
    // Test categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name')
      .limit(5)
    
    if (!catError && categories && categories.length > 0) {
      console.log('📂 Sample categories found:')
      categories.forEach(cat => console.log(`   - ${cat.name}`))
    } else {
      console.log('⚠️  No categories found - you may need to run the seed script')
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
  }
}

testConnection()
