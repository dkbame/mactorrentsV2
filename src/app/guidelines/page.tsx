import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertTriangle, Upload, Users } from 'lucide-react'

export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Community Guidelines
          </h1>
          <p className="text-muted-foreground text-lg">
            Help us maintain a quality platform for free macOS software distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-apple-green">
                <CheckCircle className="h-5 w-5" />
                <span>Encouraged Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Open source applications with clear licenses</li>
                <li>• Freeware explicitly marked as free to distribute</li>
                <li>• Educational software and tools</li>
                <li>• Independent games released as freeware</li>
                <li>• Development tools and utilities</li>
                <li>• Creative software with permissive licenses</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-apple-red">
                <AlertTriangle className="h-5 w-5" />
                <span>Prohibited Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Commercial software without authorization</li>
                <li>• Cracked or pirated applications</li>
                <li>• Software with unclear licensing</li>
                <li>• Malware or potentially harmful files</li>
                <li>• Adult or inappropriate content</li>
                <li>• Anything that violates copyright law</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-apple-blue" />
              <span>Upload Best Practices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Quality Standards</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use clear, descriptive titles</li>
                  <li>• Choose the correct category</li>
                  <li>• Write detailed descriptions</li>
                  <li>• Include version information</li>
                  <li>• Mention system requirements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Requirements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Valid .torrent files only</li>
                  <li>• Include our tracker in announce list</li>
                  <li>• Ensure files are properly seeded</li>
                  <li>• Test downloads before uploading</li>
                  <li>• Use reasonable piece sizes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-apple-purple" />
              <span>Community Standards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Be Helpful:</strong> Write clear descriptions, respond to questions, 
                and help other users when possible.
              </p>
              <p>
                <strong>Be Respectful:</strong> Treat all community members with respect. 
                No harassment, spam, or abusive behavior.
              </p>
              <p>
                <strong>Be Honest:</strong> Only upload software you have the right to share. 
                Provide accurate information about the software.
              </p>
              <p>
                <strong>Be Responsible:</strong> Keep seeding your uploads when possible to 
                ensure availability for other users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
