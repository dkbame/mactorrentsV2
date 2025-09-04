import { UploadForm } from '@/components/upload/upload-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Shield, CheckCircle, AlertTriangle } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Upload Torrent
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Share free macOS applications and games with the community. 
            Only upload software that is legally free to distribute.
          </p>
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-apple-green/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-apple-green" />
                </div>
                <CardTitle className="text-base">Allowed Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Open source software</li>
                <li>• Freeware applications</li>
                <li>• Public domain games</li>
                <li>• Demo versions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-apple-red/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-apple-red" />
                </div>
                <CardTitle className="text-base">Prohibited Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Copyrighted software</li>
                <li>• Cracked applications</li>
                <li>• Malware or viruses</li>
                <li>• Illegal content</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-apple-blue/10 rounded-lg">
                  <Shield className="h-5 w-5 text-apple-blue" />
                </div>
                <CardTitle className="text-base">Quality Standards</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Clear descriptions</li>
                <li>• Proper categories</li>
                <li>• Valid torrent files</li>
                <li>• Accurate metadata</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-apple-purple/10 rounded-lg">
                <Upload className="h-5 w-5 text-apple-purple" />
              </div>
              <div>
                <CardTitle>Upload Your Torrent</CardTitle>
                <CardDescription>
                  Fill in the details and upload your .torrent file
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <UploadForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
