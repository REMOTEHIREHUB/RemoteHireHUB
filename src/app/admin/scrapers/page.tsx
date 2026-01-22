'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, PlayCircle, CheckCircle, XCircle, Lock } from 'lucide-react'

export default function AdminScraperPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')

  // Handle password login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple password check (you can change this password in .env.local)
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
      setPassword('')
    }
  }

  const runScraper = async () => {
    if (!apiKey) {
      setError('Please enter API key')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to run scraper')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
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
              Enter password to access the scraper admin panel
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

  // Main Admin Panel (only shown after authentication)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAuthenticated(false)
              setPassword('')
              setResult(null)
              setApiKey('')
            }}
            className="border-2 hover:border-red-600 hover:text-red-600"
          >
            🚪 Logout
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              🔧 Job Scraper Admin
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Manually trigger the job scraper to fetch latest remote jobs from 3 sources
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Key Input */}
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your SCRAPER_API_KEY"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the SCRAPER_API_KEY from your environment variables
              </p>
            </div>

            {/* Run Button */}
            <Button
              onClick={runScraper}
              disabled={loading || !apiKey}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scraping Jobs from 3 Sources...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Run Scraper Now
                </>
              )}
            </Button>

            {/* Loading State */}
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  ⏳ Fetching jobs from RemoteOK, We Work Remotely, and Remotive... This may take 2-3 minutes
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">Error</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800 text-lg">Scraper Completed!</p>
                    <p className="text-green-700 text-sm mt-1">
                      Scraped from 3 sources simultaneously
                    </p>
                  </div>
                </div>
                
                {/* Total Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Total Jobs Found</p>
                    <p className="text-3xl font-bold text-green-600">{result.totalScraped}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">New Jobs Added</p>
                    <p className="text-3xl font-bold text-green-600">{result.totalInserted}</p>
                  </div>
                </div>

                {/* Individual Source Results */}
                <div className="space-y-4">
                  <p className="font-semibold text-gray-800 text-lg mb-3">📊 Source Breakdown:</p>
                  
                  {/* RemoteOK */}
                  {result.results?.remoteok && (
                    <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <p className="font-semibold text-gray-800">RemoteOK</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.results.remoteok.success 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.results.remoteok.success ? '✓ Success' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Scraped</p>
                          <p className="font-bold text-lg">{result.results.remoteok.jobsScraped}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Inserted</p>
                          <p className="font-bold text-lg text-green-600">{result.results.remoteok.jobsInserted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duplicates</p>
                          <p className="font-bold text-lg text-gray-500">
                            {result.results.remoteok.jobsScraped - result.results.remoteok.jobsInserted}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* We Work Remotely */}
                  {result.results?.weworkremotely && (
                    <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                          <p className="font-semibold text-gray-800">We Work Remotely</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.results.weworkremotely.success 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.results.weworkremotely.success ? '✓ Success' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Scraped</p>
                          <p className="font-bold text-lg">{result.results.weworkremotely.jobsScraped}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Inserted</p>
                          <p className="font-bold text-lg text-green-600">{result.results.weworkremotely.jobsInserted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duplicates</p>
                          <p className="font-bold text-lg text-gray-500">
                            {result.results.weworkremotely.jobsScraped - result.results.weworkremotely.jobsInserted}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remotive */}
                  {result.results?.remotive && (
                    <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                          <p className="font-semibold text-gray-800">Remotive</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.results.remotive.success 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {result.results.remotive.success ? '✓ Success' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Scraped</p>
                          <p className="font-bold text-lg">{result.results.remotive.jobsScraped}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Inserted</p>
                          <p className="font-bold text-lg text-green-600">{result.results.remotive.jobsInserted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duplicates</p>
                          <p className="font-bold text-lg text-gray-500">
                            {result.results.remotive.jobsScraped - result.results.remotive.jobsInserted}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* View Jobs Button */}
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full border-2 hover:border-green-600 hover:text-green-600 h-12"
                  >
                    <a href="/remote-jobs">
                      View All Jobs →
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-semibold mb-2">ℹ️ How it works:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Fetches latest jobs from 3 sources simultaneously</li>
                <li>RemoteOK: ~90 jobs</li>
                <li>We Work Remotely: ~50-75 jobs</li>
                <li>Remotive: ~40-60 jobs</li>
                <li>Automatically detects categories</li>
                <li>Skips duplicates (already in database)</li>
                <li>Vercel cron also runs daily at 2:00 AM UTC</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}