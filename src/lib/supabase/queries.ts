import { createClient } from '@supabase/supabase-js'
import type { Job, Category, BlogPost } from '@/types'

// Create a simple server-side client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================================================
// JOB QUERIES
// =====================================================

export async function getJobs(filters?: {
  category?: string
  search?: string
  jobType?: string
  experienceLevel?: string
  locationRestriction?: string
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('posted_date', { ascending: false })

  // Apply filters
  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.jobType) {
    query = query.eq('job_type', filters.jobType)
  }

  if (filters?.experienceLevel) {
    query = query.eq('experience_level', filters.experienceLevel)
  }

  if (filters?.locationRestriction) {
    query = query.eq('location_restriction', filters.locationRestriction)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset, 
      filters.offset + (filters.limit || 10) - 1
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }

  return data as Job[]
}

export async function getJobBySlug(slug: string) {
  console.log('🔍 Looking for job with slug:', slug)
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('❌ Error fetching job by slug:', error)
    throw error
  }

  if (!data) {
    console.error('❌ No job found with slug:', slug)
    throw new Error('Job not found')
  }

  console.log('✅ Found job:', data.title)
  return data as Job
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching job by id:', error)
    throw error
  }

  return data as Job
}

// =====================================================
// CATEGORY QUERIES
// =====================================================

export async function getCategories() {
  const { data, error } = await supabase
    .from('remote_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('remote_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category by slug:', error)
    throw error
  }

  return data as Category
}

// =====================================================
// BLOG QUERIES
// =====================================================

export async function getBlogPosts(limit?: number) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data as BlogPost[]
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching blog post by slug:', error)
    throw error
  }

  return data as BlogPost
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post by id:', error)
    throw error
  }

  return data as BlogPost
}

// =====================================================
// STATS QUERIES (for admin dashboard)
// =====================================================

export async function getJobStats() {
  const { count: totalJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  const { count: activeJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return {
    totalJobs: totalJobs || 0,
    activeJobs: activeJobs || 0,
  }
}

export async function getBlogStats() {
  const { count: totalPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })

  const { count: publishedPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
  }
}