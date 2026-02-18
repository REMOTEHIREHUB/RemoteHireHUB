'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, PlayCircle, CheckCircle, XCircle, Lock, Clock } from 'lucide-react'

const SOURCE_CONFIG = [
  { key: 'remoteok',       label: 'RemoteOK',         path: '/api/scrape/remoteok',        dot: 'bg-blue-600',   border: 'border-blue-200'   },
  { key: 'weworkremotely', label: 'We Work Remotely',  path: '/api/scrape/weworkremotely',   dot: 'bg-purple-600', border: 'border-purple-200' },
  { key: 'remotive',       label: 'Remotive',          path: '/api/scrape/remotive',         dot: 'bg-orange-600', border: 'border-orange-200' },
  { key: 'greenhouse',     label: 'Greenhouse',        path: '/api/scrape/greenhouse',       dot: 'bg-green-600',  border: 'border-green-200'  },
  { key: 'lever',          label: 'Lever',             path: '/api/scrape/lever',            dot: 'bg-rose-600',   border: 'border-rose-200'   },
]

type ScraperStatus = 'pending' | 'running' | 'success' | 'error'

interface ScraperResult {
  status: ScraperStatus
  jobsScraped?: number
  jobsInserted?: number
  error?: string
}

export default function AdminScraperPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)

  const [loading, setLoading] = useState(false)
  const [currentScraper, setCurrentScraper] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, ScraperResult>>({})
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
      setPassword('')
    }
  }

  const runAllScrapers = async () => {
    if (!apiKey) {
      setError('Please enter API key')
      return
    }

    setLoading(true)
    setError(null)
    setResults({})

    // Initialize all as pending
    const initial: Record<string, ScraperResult> = {}
    SOURCE_CONFIG.forEach(s => { initial[s.key] = { status: 'pending' } })
    setResults(initial)

    // Run each scraper one by one so each gets its own serverless function timeout
    for (const scraper of SOURCE_CONFIG) {
      setCurrentScraper(scraper.key)
      setResults(prev => ({
        ...prev,
        [scraper.key]: { status: 'running' }
      }))

      try {
        const response = await fetch(scraper.path, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}` }
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setResults(prev => ({
            ...prev,
            [scraper.key]: {
              status: 'success',
              jobsScraped: data.jobsScraped || 0,
              jobsInserted: data.jobsInserted || 0,
            }
          }))
        } else {
          setResults(prev => ({
            ...prev,
            [scraper.key]: {
              status: 'error',
              jobsScraped: data.jobsScraped || 0,
              jobsInserted: data.jobsInserted || 0,
              error: data.error || 'Failed',
            }
          }))
        }
      } catch (err) {
        setResults(prev => ({
          ...prev,
          [scraper.key]: {
            status: 'error',
            error: err instanceof Error ? err.message : 'Network error',
          }
        }))
      }
    }

    setCurrentScraper(null)
    setLoading(false)
  }

  const runSingleScraper = async (scraperKey: string) => {
    if (!apiKey) {
      setError('Please enter API key')
      return
    }

    const scraper = SOURCE_CONFIG.find(s => s.key === scraperKey)
    if (!scraper) return

    setError(null)
    setCurrentScraper(scraperKey)
    setResults(prev => ({
      ...prev,
      [scraperKey]: { status: 'running' }
    }))

    try {
      const response = await fetch(scraper.path, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResults(prev => ({
          ...prev,
          [scraperKey]: {
            status: 'success',
            jobsScraped: data.jobsScraped || 0,
            jobsInserted: data.jobsInserted || 0,
          }
        }))
      } else {
        setResults(prev => ({
          ...prev,
          [scraperKey]: {
            status: 'error',
            jobsScraped: data.jobsScraped || 0,
            jobsInserted: data.jobsInserted || 0,
            error: data.error || 'Failed',
          }
        }))
      }
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [scraperKey]: {
          status: 'error',
          error: err instanceof Error ? err.message : 'Network error',
        }
      }))
    }

    setCurrentScraper(null)
  }

  const totalScraped = Object.values(results).reduce((sum, r) => sum + (r.jobsScraped || 0), 0)
  const totalInserted = Object.values(results).reduce((sum, r) => sum + (r.jobsInserted || 0), 0)
  const completedCount = Object.values(results).filter(r => r.status === 'success' || r.status === 'error').length
  const hasResults = completedCount > 0

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
            <p className="text-gray-600 mt-2">Enter password to access the scraper admin panel</p>
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
                  <p className="text-red-700 text-sm">Incorrect password. Please try again.</p>
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

  // Main Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Logout */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAuthenticated(false)
              setPassword('')
              setResults({})
              setApiKey('')
            }}
            className="border-2 hover:border-red-600 hover:text-red-600"
          >
            Logout
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Job Scraper Admin
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Run scrapers individually or all at once. Each scraper runs in its own request to avoid timeouts.
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

            {/* Run All Button */}
            <Button
              onClick={runAllScrapers}
              disabled={loading || !apiKey}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Running Scrapers ({completedCount}/5 done)...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Run All Scrapers
                </>
              )}
            </Button>

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

            {/* Total Stats */}
            {hasResults && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Total Jobs Found</p>
                  <p className="text-3xl font-bold text-blue-600">{totalScraped}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">New Jobs Added</p>
                  <p className="text-3xl font-bold text-green-600">{totalInserted}</p>
                </div>
              </div>
            )}

            {/* Individual Scraper Cards */}
            <div className="space-y-3">
              <p className="font-semibold text-gray-800 text-lg">Scrapers:</p>
              {SOURCE_CONFIG.map(({ key, label, dot, border }) => {
                const result = results[key]
                const isRunning = currentScraper === key
                const isDone = result?.status === 'success' || result?.status === 'error'

                return (
                  <div key={key} className={`bg-white rounded-lg p-4 border-2 ${border}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${dot}`}></div>
                        <p className="font-semibold text-gray-800">{label}</p>
                        {(key === 'greenhouse' || key === 'lever') && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">50 companies</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Status badge */}
                        {isRunning && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            <Loader2 className="h-3 w-3 animate-spin" /> Running...
                          </span>
                        )}
                        {result?.status === 'success' && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3" /> Done
                          </span>
                        )}
                        {result?.status === 'error' && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="h-3 w-3" /> Failed
                          </span>
                        )}
                        {result?.status === 'pending' && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500">
                            <Clock className="h-3 w-3" /> Waiting
                          </span>
                        )}
                        {/* Run individual button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runSingleScraper(key)}
                          disabled={loading || isRunning || !apiKey}
                          className="text-xs h-7"
                        >
                          {isRunning ? <Loader2 className="h-3 w-3 animate-spin" /> : <PlayCircle className="h-3 w-3 mr-1" />}
                          {isRunning ? '' : 'Run'}
                        </Button>
                      </div>
                    </div>

                    {/* Results row */}
                    {isDone && (
                      <div className="grid grid-cols-3 gap-3 text-sm mt-2 pt-2 border-t">
                        <div>
                          <p className="text-gray-600">Scraped</p>
                          <p className="font-bold text-lg">{result?.jobsScraped || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Inserted</p>
                          <p className="font-bold text-lg text-green-600">{result?.jobsInserted || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duplicates</p>
                          <p className="font-bold text-lg text-gray-500">
                            {(result?.jobsScraped || 0) - (result?.jobsInserted || 0)}
                          </p>
                        </div>
                      </div>
                    )}
                    {result?.error && (
                      <p className="text-red-600 text-xs mt-2">{result.error}</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* View Jobs Button */}
            {hasResults && (
              <Button
                variant="outline"
                asChild
                className="w-full border-2 hover:border-green-600 hover:text-green-600 h-12"
              >
                <a href="/remote-jobs">View All Jobs</a>
              </Button>
            )}

            {/* Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-semibold mb-2">How it works:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Each scraper runs in its own request (no more timeouts)</li>
                <li>You can run all at once or trigger individual scrapers</li>
                <li>Greenhouse and Lever each loop through 50 companies</li>
                <li>Automatically detects job categories</li>
                <li>Skips duplicates already in the database</li>
                <li>Vercel cron runs each scraper daily at staggered times (2:00-2:25 AM UTC)</li>
              </ul>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
