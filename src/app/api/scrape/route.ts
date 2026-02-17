import { NextResponse } from 'next/server'
import { scrapeRemoteOK } from '@/lib/scrapers/remoteok'
import { scrapeWeWorkRemotely } from '@/lib/scrapers/weworkremotely'
import { scrapeRemotive } from '@/lib/scrapers/remotive'
import { scrapeGreenhouse } from '@/lib/scrapers/greenhouse'
import { scrapeLever } from '@/lib/scrapers/lever'

// This API route works with Vercel Cron
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    const isVercelCron = authHeader === `Bearer ${cronSecret}`
    const isManualCall = authHeader === `Bearer ${process.env.SCRAPER_API_KEY}`
    
    if (!isVercelCron && !isManualCall) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.log('🚀 Starting job scraping from 5 sources...')
    
    // Run fast scrapers in parallel first
    const [remoteoKResult, wwrResult, remotiveResult] = await Promise.all([
      scrapeRemoteOK(),
      scrapeWeWorkRemotely(),
      scrapeRemotive()
    ])

    // Run Greenhouse and Lever sequentially after 
    // (they loop through many companies - running in parallel would be too aggressive)
    const greenhouseResult = await scrapeGreenhouse()
    const leverResult = await scrapeLever()
    
    const results = {
      remoteok: remoteoKResult,
      weworkremotely: wwrResult,
      remotive: remotiveResult,
      greenhouse: greenhouseResult,
      lever: leverResult,
    }
    
    const totalScraped = Object.values(results).reduce((sum, r) => sum + r.jobsScraped, 0)
    const totalInserted = Object.values(results).reduce((sum, r) => sum + r.jobsInserted, 0)
    
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
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}