import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    message: 'Job scraper endpoint - Coming Soon',
    status: 'not_implemented'
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'Get scraper status endpoint - Coming Soon',
    scrapers: []
  })
}
