import { NextResponse } from 'next/server'
import { scrapeLever } from '@/lib/scrapers/lever'

export const maxDuration = 300

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
    const isManualCall = authHeader === `Bearer ${process.env.SCRAPER_API_KEY}`

    if (!isVercelCron && !isManualCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Starting Lever scrape (50 companies)...')
    const result = await scrapeLever()

    return NextResponse.json({
      source: 'lever',
      ...result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Lever scrape failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
