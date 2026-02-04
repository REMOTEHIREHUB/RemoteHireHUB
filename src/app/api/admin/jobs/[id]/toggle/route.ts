import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// PATCH - Toggle job active status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { is_active } = await request.json()

    const { data: job, error } = await supabase
      .from('jobs')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      job 
    })
  } catch (error) {
    console.error('Error toggling job status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle job status' },
      { status: 500 }
    )
  }
}