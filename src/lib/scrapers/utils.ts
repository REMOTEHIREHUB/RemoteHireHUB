import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate URL-friendly slug from title and company
export function generateSlug(title: string, company: string): string {
  const combined = `${title}-${company}`
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100) // Limit length
}

// Generate unique job ID
export function generateJobId(sourceId: string, platform: string): string {
  return `${platform.toLowerCase()}-${sourceId}`
}

// Clean HTML content
export function cleanHtml(html: string): string {
  if (!html) return ''
  
  // Remove script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove style tags
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Keep basic formatting tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a']
  
  return html.trim()
}

// Strip HTML to plain text
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Parse salary from text
export function parseSalary(text: string): {
  min: number | null
  max: number | null
  currency: string
  period: string
} {
  if (!text) return { min: null, max: null, currency: 'USD', period: 'year' }
  
  // Extract numbers (handles 100k, 100000, $100,000 formats)
  const numbers = text.match(/\d+[k]?/gi)
  if (!numbers || numbers.length === 0) {
    return { min: null, max: null, currency: 'USD', period: 'year' }
  }
  
  // Convert to actual numbers
  const amounts = numbers.map(n => {
    const num = parseFloat(n.replace(/[k,]/gi, ''))
    return n.toLowerCase().includes('k') ? num * 1000 : num
  })
  
  // Determine currency
  const currency = text.match(/USD|EUR|GBP|\$/i)?.[0] || 'USD'
  
  // Determine period
  const period = text.match(/hour|day|month|year/i)?.[0].toLowerCase() || 'year'
  
  return {
    min: amounts.length > 0 ? Math.min(...amounts) : null,
    max: amounts.length > 1 ? Math.max(...amounts) : null,
    currency: currency.replace('$', 'USD'),
    period
  }
}

// Check if job already exists in database
export async function jobExists(sourceJobId: string, platform: string): Promise<boolean> {
  const jobId = generateJobId(sourceJobId, platform)
  
  const { data, error } = await supabase
    .from('jobs')
    .select('id')
    .eq('job_id', jobId)
    .single()
  
  return !error && !!data
}

// Map job type to standard format
export function normalizeJobType(type: string): string {
  const t = type.toLowerCase()
  
  if (t.includes('full') || t.includes('fulltime') || t.includes('full-time')) {
    return 'Full-time'
  }
  if (t.includes('part') || t.includes('parttime') || t.includes('part-time')) {
    return 'Part-time'
  }
  if (t.includes('contract')) {
    return 'Contract'
  }
  if (t.includes('freelance') || t.includes('consultant')) {
    return 'Freelance'
  }
  
  return 'Full-time' // Default
}

// Map experience level to standard format
export function normalizeExperienceLevel(text: string): string | null {
  const t = text.toLowerCase()
  
  if (t.includes('senior') || t.includes('sr.') || t.includes('lead')) {
    return 'Senior'
  }
  if (t.includes('junior') || t.includes('jr.') || t.includes('entry')) {
    return 'Entry'
  }
  if (t.includes('mid') || t.includes('intermediate')) {
    return 'Mid'
  }
  if (t.includes('lead') || t.includes('principal') || t.includes('staff')) {
    return 'Lead'
  }
  
  return null
}

// Detect category from job title/description
export async function detectCategory(title: string, description: string): Promise<string | null> {
  const text = `${title} ${description}`.toLowerCase()
  
  // Get all categories
  const { data: categories } = await supabase
    .from('remote_categories')
    .select('id, name, slug')
    .eq('is_active', true)
  
  if (!categories) return null
  
  // Keywords for each category
  const categoryKeywords: Record<string, string[]> = {
    'software-development': ['developer', 'engineer', 'programming', 'software', 'backend', 'frontend', 'fullstack', 'full-stack', 'devops', 'react', 'node', 'python', 'java', 'javascript'],
    'customer-support': ['support', 'customer', 'service', 'help desk', 'success', 'care'],
    'marketing-growth': ['marketing', 'growth', 'seo', 'content marketing', 'digital marketing', 'social media', 'brand'],
    'design-creative': ['designer', 'design', 'ui', 'ux', 'graphic', 'creative', 'visual'],
    'writing-content': ['writer', 'content', 'copywriter', 'editor', 'blog', 'technical writing'],
    'sales-business': ['sales', 'business development', 'account executive', 'bdr', 'sdr'],
    'project-management': ['project manager', 'product manager', 'scrum', 'agile', 'pm'],
    'data-analytics': ['data', 'analyst', 'analytics', 'scientist', 'bi', 'business intelligence'],
    'finance-accounting': ['finance', 'accounting', 'accountant', 'financial', 'cpa'],
    'hr-recruiting': ['hr', 'human resources', 'recruiter', 'recruiting', 'talent']
  }
  
  // Score each category
  let bestMatch: string | null = null
  let bestScore = 0
  
  for (const category of categories) {
    const keywords = categoryKeywords[category.slug] || []
    const score = keywords.filter(keyword => text.includes(keyword)).length
    
    if (score > bestScore) {
      bestScore = score
      bestMatch = category.id
    }
  }
  
  return bestMatch
}

// Insert job into database
export async function insertJob(job: {
  job_id: string
  source_job_id: string
  title: string
  company: string
  company_logo_url?: string
  location: string
  location_restriction?: string
  timezone_requirement?: string
  job_type: string
  experience_level?: string
  category_id?: string
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  description: string
  requirements?: string
  responsibilities?: string
  benefits?: string
  source_platform: string
  source_url: string
  posted_date: string
  slug: string
}) {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      ...job,
      is_remote: true,
      is_active: true,
      is_featured: false,
      scraped_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error inserting job:', error)
    throw error
  }
  
  return data
}

// Log scraper activity
export async function logScraperRun(
  platform: string,
  status: 'success' | 'error',
  jobsScraped: number,
  jobsInserted: number,
  errorMessage?: string
) {
  await supabase
    .from('scraper_logs')
    .insert({
      platform,
      status,
      jobs_scraped: jobsScraped,
      jobs_inserted: jobsInserted,
      error_message: errorMessage,
      scraped_at: new Date().toISOString()
    })
}