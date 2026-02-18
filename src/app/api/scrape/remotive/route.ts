import { NextResponse } from 'next/server'
import { scrapeRemotive } from '@/lib/scrapers/remotive'

export const maxDuration = 30

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
    const isManualCall = authHeader === `Bearer ${process.env.SCRAPER_API_KEY}`

    if (!isVercelCron && !isManualCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Starting Remotive scrape...')
    const result = await scrapeRemotive()

    return NextResponse.json({
      source: 'remotive',
      ...result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Remotive scrape failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
