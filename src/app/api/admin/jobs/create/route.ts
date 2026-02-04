import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data: job, error } = await supabase
      .from('jobs')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      job,
      message: 'Job created successfully' 
    })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    )
  }
}