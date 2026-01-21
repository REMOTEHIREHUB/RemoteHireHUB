import { NextResponse } from 'next/server'
import { scrapeRemoteOK } from '@/lib/scrapers/remoteok'

// This API route can be called manually or via cron
export async function POST(request: Request) {
  try {
    // Optional: Add authentication
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SCRAPER_API_KEY || 'your-secret-key'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.log('🚀 Starting job scraping...')
    
    // Run scrapers
    const results = {
      remoteok: await scrapeRemoteOK(),
      // Add more scrapers here later:
      // weworkremotely: await scrapeWeWorkRemotely(),
      // remotive: await scrapeRemotive(),
    }
    
    // Calculate totals
    const totalScraped = Object.values(results).reduce((sum, r) => sum + r.jobsScraped, 0)
    const totalInserted = Object.values(results).reduce((sum, r) => sum + r.jobsInserted, 0)
    
    console.log(`✅ Scraping complete! ${totalInserted}/${totalScraped} jobs inserted`)
    
    return NextResponse.json({
      success: true,
      totalScraped,
      totalInserted,
      results
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

// GET endpoint for testing (remove in production)
export async function GET() {
  return NextResponse.json({
    message: 'Job scraper API. Use POST with authorization header to run scraper.',
    example: 'curl -X POST http://localhost:3000/api/scrape -H "Authorization: Bearer your-secret-key"'
  })
}