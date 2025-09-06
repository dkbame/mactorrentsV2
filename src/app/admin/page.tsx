import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Trash2, RefreshCw, Database } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  
  // Get all users
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  // Get torrent count
  const { count: torrentCount } = await supabase
    .from('torrents')
    .select('*', { count: 'exact', head: true })

  // Get peer count
  const { count: peerCount } = await supabase
    .from('peers')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-apple-blue/5 to-apple-purple/5 p-8">
        <div className="container mx-auto">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-red-500">Database Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Error loading admin data: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-apple-blue/5 to-apple-purple/5 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, torrents, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Torrents</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{torrentCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Peers</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{peerCount || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users && users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{user.username}</span>
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {user.is_verified && (
                            <Badge variant="success">Verified</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Passkey: {user.passkey?.substring(0, 8)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="glass mt-6">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>
              System management and testing tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                className="justify-start text-red-500 hover:text-red-700"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
                    // This would need to be implemented as an API endpoint
                    alert('Clear data functionality would be implemented here')
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
