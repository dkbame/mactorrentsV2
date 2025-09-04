import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="glass">
          <CardContent className="pt-6 prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptable Use</h2>
                <p className="text-muted-foreground">
                  MacTorrents is intended for the distribution of free, legal macOS software only. 
                  Users may only upload and share:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Open source software with appropriate licenses</li>
                  <li>Freeware applications explicitly marked as free for distribution</li>
                  <li>Public domain software and games</li>
                  <li>Demo versions and trial software</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Prohibited Content</h2>
                <p className="text-muted-foreground">
                  The following content is strictly prohibited:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Copyrighted software without proper authorization</li>
                  <li>Cracked, pirated, or illegally modified applications</li>
                  <li>Malware, viruses, or malicious software</li>
                  <li>Content that violates any applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                <p className="text-muted-foreground">
                  By using MacTorrents, you agree to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Only upload content you have the legal right to distribute</li>
                  <li>Provide accurate descriptions and categorization</li>
                  <li>Respect intellectual property rights</li>
                  <li>Report any violations you encounter</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Platform Rules</h2>
                <p className="text-muted-foreground">
                  To maintain a quality platform:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>All uploads are subject to moderation</li>
                  <li>We reserve the right to remove any content</li>
                  <li>Repeated violations may result in account suspension</li>
                  <li>We cooperate with takedown requests when legally required</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms or to report violations, please contact us 
                  through our support page.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
