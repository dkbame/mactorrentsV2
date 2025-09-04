import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="glass">
          <CardContent className="pt-6 prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect minimal information to provide our service:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Account information (email, username) when you register</li>
                  <li>Torrent metadata when you upload files</li>
                  <li>Basic analytics to improve our service</li>
                  <li>IP addresses for tracker functionality (temporarily)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">How We Use Information</h2>
                <p className="text-muted-foreground">
                  Your information is used to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Provide and maintain the MacTorrents service</li>
                  <li>Enable BitTorrent tracking and peer coordination</li>
                  <li>Moderate content and prevent abuse</li>
                  <li>Communicate important service updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Data Protection</h2>
                <p className="text-muted-foreground">
                  We take your privacy seriously:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>We use industry-standard encryption</li>
                  <li>We never sell your personal information</li>
                  <li>IP addresses are only stored temporarily for tracker functionality</li>
                  <li>You can request deletion of your account and data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Cookies</h2>
                <p className="text-muted-foreground">
                  We use minimal cookies for:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Authentication and session management</li>
                  <li>Remembering your preferences</li>
                  <li>Basic analytics to improve our service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Contact</h2>
                <p className="text-muted-foreground">
                  For privacy-related questions, please contact us through our support page.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
