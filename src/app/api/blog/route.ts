import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Blog API endpoint - Coming Soon',
    posts: []
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'Create blog post endpoint - Coming Soon'
  })
}
