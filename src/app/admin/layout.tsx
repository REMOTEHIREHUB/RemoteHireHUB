'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const pathname = usePathname()

  // Check if already authenticated in sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple password check (you can change this password in .env.local)
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setAuthError(false)
      // Store authentication in sessionStorage (lasts until browser closes)
      sessionStorage.setItem('admin_authenticated', 'true')
    } else {
      setAuthError(true)
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
    sessionStorage.removeItem('admin_authenticated')
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access Required</CardTitle>
            <p className="text-gray-600 mt-2">
              Enter password to access the admin panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                  autoFocus
                />
              </div>
              
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">❌ Incorrect password. Please try again.</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                <Lock className="mr-2 h-4 w-4" />
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authenticated - show admin content with logout button
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Button - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-2 hover:border-red-600 hover:text-red-600 bg-white shadow-md"
        >
          🚪 Logout
        </Button>
      </div>

      {/* Admin Content */}
      {children}
    </div>
  )
}