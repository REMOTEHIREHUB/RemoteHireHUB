import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('remote_categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      categories: categories || [] 
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}