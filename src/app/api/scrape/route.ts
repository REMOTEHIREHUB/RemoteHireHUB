import { NextResponse } from 'next/server'

// This route now acts as an orchestrator that calls individual scraper routes.
// Each scraper runs in its own serverless function with its own timeout.
// For cron jobs, use the individual routes in vercel.json instead.

const SCRAPERS = [
  { key: 'remoteok', label: 'RemoteOK', path: '/api/scrape/remoteok' },
  { key: 'weworkremotely', label: 'We Work Remotely', path: '/api/scrape/weworkremotely' },
  { key: 'remotive', label: 'Remotive', path: '/api/scrape/remotive' },
  { key: 'greenhouse', label: 'Greenhouse', path: '/api/scrape/greenhouse' },
  { key: 'lever', label: 'Lever', path: '/api/scrape/lever' },
]

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    const isVercelCron = authHeader === `Bearer ${cronSecret}`
    const isManualCall = authHeader === `Bearer ${process.env.SCRAPER_API_KEY}`

    if (!isVercelCron && !isManualCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the base URL from the request
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    console.log('🚀 Starting job scraping from 5 sources (individual routes)...')

    const results: Record<string, any> = {}

    // Run each scraper individually via its own route
    for (const scraper of SCRAPERS) {
      try {
        console.log(`🔄 Triggering ${scraper.label}...`)
        const res = await fetch(`${baseUrl}${scraper.path}`, {
          method: 'POST',
          headers: { 'Authorization': authHeader || '' },
        })
        results[scraper.key] = await res.json()
      } catch (error) {
        console.error(`❌ ${scraper.label} failed:`, error)
        results[scraper.key] = {
          success: false,
          jobsScraped: 0,
          jobsInserted: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    const totalScraped = Object.values(results).reduce((sum: number, r: any) => sum + (r.jobsScraped || 0), 0)
    const totalInserted = Object.values(results).reduce((sum: number, r: any) => sum + (r.jobsInserted || 0), 0)

    console.log(`✅ Scraping complete! ${totalInserted}/${totalScraped} jobs inserted from 5 sources`)

    return NextResponse.json({
      success: true,
      totalScraped,
      totalInserted,
      results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Scraping failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
