import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Jobs API endpoint - Coming Soon',
    jobs: []
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'Create job endpoint - Coming Soon'
  })
}
