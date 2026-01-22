import { 
  generateSlug, 
  generateJobId, 
  cleanHtml,
  parseSalary,
  jobExists,
  normalizeJobType,
  normalizeExperienceLevel,
  detectCategory,
  insertJob,
  logScraperRun
} from './utils'

interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  company_logo?: string
  category: string
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary?: string
  description: string
}

export async function scrapeRemotive(): Promise<{
  success: boolean
  jobsScraped: number
  jobsInserted: number
  error?: string
}> {
  console.log('🔍 Starting Remotive scrape...')
  
  let jobsScraped = 0
  let jobsInserted = 0
  
  try {
    // Remotive has a public JSON API
    const response = await fetch('https://remotive.com/api/remote-jobs', {
      headers: {
        'User-Agent': 'RemoteHireHub Job Aggregator'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const jobs: RemotiveJob[] = data.jobs || []
    
    jobsScraped = jobs.length
    
    console.log(`📊 Found ${jobsScraped} jobs from Remotive`)
    
    // Process each job
    for (const job of jobs) {
      try {
        // Check if already exists
        const exists = await jobExists(job.id.toString(), 'remotive')
        if (exists) {
          console.log(`⏭️  Skipping duplicate: ${job.title}`)
          continue
        }
        
        // Generate slug
        const slug = generateSlug(job.title, job.company_name)
        
        // Parse salary if available
        const salary = job.salary ? parseSalary(job.salary) : { min: null, max: null, currency: 'USD', period: 'year' }
        
        // Normalize job type
        const jobType = normalizeJobType(job.job_type || 'Full-time')
        
        // Detect experience level
        const experienceLevel = normalizeExperienceLevel(job.title)
        
        // Detect category
        const categoryId = await detectCategory(job.title, job.description)
        
        // Determine location restriction
        let locationRestriction = 'Worldwide'
        const location = job.candidate_required_location.toLowerCase()
        
        if (location.includes('usa') || location.includes('united states')) {
          locationRestriction = 'US Only'
        } else if (location.includes('europe') || location.includes('eu')) {
          locationRestriction = 'Europe'
        } else if (location.includes('americas')) {
          locationRestriction = 'Americas'
        } else if (location.includes('asia') || location.includes('apac')) {
          locationRestriction = 'APAC'
        }
        
        // Clean description
        const description = cleanHtml(job.description)
        
        // Insert job
        await insertJob({
          job_id: generateJobId(job.id.toString(), 'remotive'),
          source_job_id: job.id.toString(),
          title: job.title,
          company: job.company_name,
          company_logo_url: job.company_logo || undefined,
          location: job.candidate_required_location || 'Remote',
          location_restriction: locationRestriction,
          job_type: jobType,
          experience_level: experienceLevel || undefined,
          category_id: categoryId || undefined,
          salary_min: salary.min || undefined,
          salary_max: salary.max || undefined,
          salary_currency: salary.currency,
          description: description,
          source_platform: 'Remotive',
          source_url: job.url,
          posted_date: new Date(job.publication_date).toISOString(),
          slug: slug
        })
        
        jobsInserted++
        console.log(`✅ Inserted: ${job.title} at ${job.company_name}`)
        
      } catch (error) {
        console.error(`❌ Error processing job ${job.title}:`, error)
        // Continue with next job
      }
    }
    
    // Log success
    await logScraperRun('Remotive', 'success', jobsScraped, jobsInserted)
    
    console.log(`✨ Remotive scrape complete! Inserted ${jobsInserted}/${jobsScraped} jobs`)
    
    return {
      success: true,
      jobsScraped,
      jobsInserted
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Remotive scrape failed:', errorMessage)
    
    // Log failure
    await logScraperRun('Remotive', 'error', jobsScraped, jobsInserted, errorMessage)
    
    return {
      success: false,
      jobsScraped,
      jobsInserted,
      error: errorMessage
    }
  }
}