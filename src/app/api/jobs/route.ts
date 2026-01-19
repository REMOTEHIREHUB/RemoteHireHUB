import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Get search parameters
  const search = searchParams.get('search')
  const jobTypes = searchParams.get('jobTypes')?.split(',').filter(Boolean)
  const experienceLevels = searchParams.get('experienceLevels')?.split(',').filter(Boolean)
  const locationRestrictions = searchParams.get('locationRestrictions')?.split(',').filter(Boolean)
  const salaryMin = searchParams.get('salaryMin')
  const salaryMax = searchParams.get('salaryMax')

  const supabase = createServerClient()
  
  // Start building query
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('posted_date', { ascending: false })

  // Apply search filter (title search)
  if (search) {
    query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Apply job type filters
  if (jobTypes && jobTypes.length > 0) {
    query = query.in('job_type', jobTypes)
  }

  // Apply experience level filters
  if (experienceLevels && experienceLevels.length > 0) {
    query = query.in('experience_level', experienceLevels)
  }

  // Apply location restriction filters
  if (locationRestrictions && locationRestrictions.length > 0) {
    query = query.in('location_restriction', locationRestrictions)
  }

  // Apply salary filters
  if (salaryMin) {
    const minSalary = parseInt(salaryMin)
    query = query.gte('salary_min', minSalary)
  }

  if (salaryMax) {
    const maxSalary = parseInt(salaryMax)
    query = query.lte('salary_max', maxSalary)
  }

  // Execute query
  const { data, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}