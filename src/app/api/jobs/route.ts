import { NextResponse } from 'next/server'
import { scrapeRemoteOK } from '@/lib/scrapers/remoteok'

// This API route works with Vercel Cron
export async function GET(request: Request) {
  try {
    // Vercel Cron sends a special header
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Check if it's from Vercel Cron OR manual call with API key
    const isVercelCron = authHeader === `Bearer ${cronSecret}`
    const isManualCall = authHeader === `Bearer ${process.env.SCRAPER_API_KEY}`
    
    if (!isVercelCron && !isManualCall) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.log('🚀 Starting job scraping...')
    
    // Run scrapers
    const results = {
      remoteok: await scrapeRemoteOK(),
    }
    
    // Calculate totals
    const totalScraped = Object.values(results).reduce((sum, r) => sum + r.jobsScraped, 0)
    const totalInserted = Object.values(results).reduce((sum, r) => sum + r.jobsInserted, 0)
    
    console.log(`✅ Scraping complete! ${totalInserted}/${totalScraped} jobs inserted`)
    
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
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

// Keep POST for backward compatibility
export async function POST(request: Request) {
  return GET(request)
}