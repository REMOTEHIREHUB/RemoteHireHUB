import { NextResponse } from 'next/server'
import { scrapeRemoteOK } from '@/lib/scrapers/remoteok'

export const maxDuration = 30

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
    const isManualCall = authHeader === `Bearer ${process.env.SCRAPER_API_KEY}`

    if (!isVercelCron && !isManualCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Starting RemoteOK scrape...')
    const result = await scrapeRemoteOK()

    return NextResponse.json({
      source: 'remoteok',
      ...result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ RemoteOK scrape failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
