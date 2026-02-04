import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// DELETE job
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      message: 'Job deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}

// GET single job
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      job 
    })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// UPDATE job
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: job, error } = await supabase
      .from('jobs')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      job 
    })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    )
  }
}