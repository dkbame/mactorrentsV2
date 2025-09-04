'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { parseTorrentFile, TorrentMetadata } from '@/lib/torrent'
import { createSlug } from '@/lib/utils'

interface UploadFormData {
  title: string
  description: string
  category_id: string
  torrentFile: File | null
  parsedTorrent: TorrentMetadata | null
}

export function UploadForm() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category_id: '',
    torrentFile: null,
    parsedTorrent: null
  })
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.torrent')) {
      setStatusMessage('Please select a valid .torrent file')
      setUploadStatus('error')
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const parsedTorrent = parseTorrentFile(Buffer.from(buffer))
      
      setFormData(prev => ({
        ...prev,
        torrentFile: file,
        parsedTorrent,
        title: prev.title || parsedTorrent.name
      }))
      
      setUploadStatus('idle')
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Invalid torrent file')
      setUploadStatus('error')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const torrentFile = files.find(file => file.name.endsWith('.torrent'))
    
    if (torrentFile) {
      handleFileSelect(torrentFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.torrentFile || !formData.parsedTorrent || !formData.category_id) {
      setStatusMessage('Please fill in all required fields')
      setUploadStatus('error')
      return
    }

    setIsUploading(true)
    setUploadStatus('idle')

    try {
      const supabase = createClient()
      
      // For now, we'll skip authentication check and use a placeholder user
      // In a real app, you'd check if user is authenticated
      
      const torrentData = {
        title: formData.title,
        slug: createSlug(formData.title),
        description: formData.description,
        category_id: formData.category_id,
        info_hash: formData.parsedTorrent.infoHash,
        file_size: formData.parsedTorrent.totalSize,
        piece_length: formData.parsedTorrent.pieceLength,
        magnet_link: formData.parsedTorrent.magnetLink,
        uploader_id: 'placeholder-user-id', // TODO: Replace with real user ID
        metadata: {
          files: formData.parsedTorrent.files,
          announce: formData.parsedTorrent.announce,
          comment: formData.parsedTorrent.comment,
          createdBy: formData.parsedTorrent.createdBy,
          creationDate: formData.parsedTorrent.creationDate
        }
      }

      // Create FormData for file upload
      const uploadFormData = new FormData()
      uploadFormData.append('torrent', formData.torrentFile)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('category_id', formData.category_id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Failed to upload torrent')
      }

      setUploadStatus('success')
      setStatusMessage('Torrent uploaded successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        torrentFile: null,
        parsedTorrent: null
      })
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      setUploadStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragging ? 'border-apple-blue bg-apple-blue/5' : 'border-border'}
          ${formData.torrentFile ? 'border-apple-green bg-apple-green/5' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
      >
        {formData.torrentFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-apple-green/10 rounded-full">
                <CheckCircle className="h-8 w-8 text-apple-green" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{formData.torrentFile.name}</h3>
              {formData.parsedTorrent && (
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Files: {formData.parsedTorrent.files.length}</p>
                  <p>Size: {(formData.parsedTorrent.totalSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p>Info Hash: {formData.parsedTorrent.infoHash.slice(0, 16)}...</p>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData(prev => ({ ...prev, torrentFile: null, parsedTorrent: null }))
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-apple-blue/10 rounded-full">
                <Upload className="h-8 w-8 text-apple-blue" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Drop your .torrent file here</h3>
              <p className="text-muted-foreground">or click to browse files</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <File className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".torrent"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter torrent title..."
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full h-10 rounded-lg border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the software, its features, and any important notes..."
            rows={6}
            className="w-full rounded-lg border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
          />
        </div>
      </div>

      {/* File Details */}
      {formData.parsedTorrent && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Torrent Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Size:</span>
                <p className="text-muted-foreground">
                  {(formData.parsedTorrent.totalSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <div>
                <span className="font-medium">Files:</span>
                <p className="text-muted-foreground">
                  {formData.parsedTorrent.files.length} file(s)
                </p>
              </div>
              <div>
                <span className="font-medium">Piece Length:</span>
                <p className="text-muted-foreground">
                  {(formData.parsedTorrent.pieceLength / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            
            {formData.parsedTorrent.files.length <= 10 && (
              <div>
                <span className="font-medium text-sm">Files in torrent:</span>
                <div className="mt-2 space-y-1">
                  {formData.parsedTorrent.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
                      <span className="truncate">{file.path}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className={`
          p-4 rounded-lg flex items-center space-x-2
          ${uploadStatus === 'success' ? 'bg-apple-green/10 text-apple-green' : ''}
          ${uploadStatus === 'error' ? 'bg-apple-red/10 text-apple-red' : ''}
        `}>
          {uploadStatus === 'success' && <CheckCircle className="h-5 w-5" />}
          {uploadStatus === 'error' && <AlertCircle className="h-5 w-5" />}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              category_id: '',
              torrentFile: null,
              parsedTorrent: null
            })
            if (fileInputRef.current) fileInputRef.current.value = ''
            setUploadStatus('idle')
            setStatusMessage('')
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={!formData.torrentFile || !formData.title || !formData.category_id || isUploading}
          className="bg-apple-blue text-white hover:bg-apple-blue/90"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Torrent
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
