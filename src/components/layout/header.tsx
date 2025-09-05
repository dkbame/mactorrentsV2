'use client'

import Link from 'next/link'
import { Search, User, Download, Upload, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { getClientSupabase } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getClientSupabase()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Fallback timeout in case auth never loads
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout - showing login buttons')
        setLoading(false)
      }
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [loading])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-apple-blue to-apple-purple">
            <span className="text-white font-bold text-sm">MT</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-apple-blue to-apple-purple bg-clip-text text-transparent">
            MacTorrents
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/browse" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link 
            href="/categories" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Categories
          </Link>
          <Link 
            href="/top" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Top Downloads
          </Link>
          <Link 
            href="/recent" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Recent
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search macOS apps and games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link href="/upload">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Upload className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Download className="h-4 w-4" />
            </Button>
          </Link>
          
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 animate-pulse bg-muted rounded" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-apple-blue text-white hover:bg-apple-blue/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
