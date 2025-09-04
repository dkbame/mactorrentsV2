import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">About MacTorrents</h3>
            <p className="text-sm text-muted-foreground">
              A platform for distributing free macOS applications and games through BitTorrent.
            </p>
          </div>

          {/* Browse */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Browse</h3>
            <div className="space-y-2">
              <Link href="/categories" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="/top" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Top Downloads
              </Link>
              <Link href="/recent" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recent Uploads
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <div className="space-y-2">
              <Link href="/upload" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Upload Torrent
              </Link>
              <Link href="/guidelines" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Guidelines
              </Link>
              <Link href="/support" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/dmca" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                DMCA Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 MacTorrents. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Free macOS apps and games distribution platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
