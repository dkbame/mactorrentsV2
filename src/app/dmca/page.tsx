import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Mail } from 'lucide-react'

export default function DMCAPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            DMCA Policy
          </h1>
          <p className="text-muted-foreground">
            Digital Millennium Copyright Act Compliance
          </p>
        </div>

        <Card className="glass">
          <CardContent className="pt-6 prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Our Commitment</h2>
                <p className="text-muted-foreground">
                  MacTorrents respects intellectual property rights and complies with the 
                  Digital Millennium Copyright Act (DMCA). We only allow the distribution 
                  of free, legal software.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Reporting Copyright Infringement</h2>
                <p className="text-muted-foreground">
                  If you believe your copyrighted work has been uploaded without permission, 
                  please provide us with the following information:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Your contact information</li>
                  <li>Description of the copyrighted work</li>
                  <li>URL or description of the infringing material</li>
                  <li>Statement of good faith belief that use is not authorized</li>
                  <li>Statement of accuracy and authority to act</li>
                  <li>Your physical or electronic signature</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Takedown Process</h2>
                <p className="text-muted-foreground">
                  Upon receiving a valid DMCA notice:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>We will promptly investigate the claim</li>
                  <li>Remove infringing content if the claim is valid</li>
                  <li>Notify the uploader of the removal</li>
                  <li>Provide opportunity for counter-notification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Contact for DMCA</h2>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-apple-blue" />
                    <span className="font-medium">DMCA Agent</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Email: dmca@mactorrents.com<br />
                    Subject: DMCA Takedown Request
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
