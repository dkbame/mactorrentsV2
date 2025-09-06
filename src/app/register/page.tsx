'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Apple } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Registration failed')
        return
      }

      setSuccess(true)
      setError('')
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-apple-blue/10 to-apple-purple/10 p-4">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Apple className="h-12 w-12 text-apple-blue" />
          </div>
          <CardTitle className="text-2xl">Join MacTorrents</CardTitle>
          <CardDescription>
            Create your account and get your private tracker passkey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background/50"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm">Account created successfully! Redirecting to login...</div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-apple-blue text-white hover:bg-apple-blue/90"
              disabled={loading || success}
            >
              {loading ? 'Creating account...' : success ? 'Account Created!' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-apple-blue hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
