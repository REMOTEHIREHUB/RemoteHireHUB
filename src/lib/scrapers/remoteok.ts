import { 
  generateSlug, 
  generateJobId, 
  cleanHtml,
  stripHtml,
  parseSalary,
  jobExists,
  normalizeJobType,
  normalizeExperienceLevel,
  detectCategory,
  insertJob,
  logScraperRun
} from './utils'

interface RemoteOKJob {
  id: string
  slug: string
  company: string
  company_logo: string
  position: string
  tags: string[]
  description: string
  url: string
  date: string
  location?: string
  salary_min?: number
  salary_max?: number
}

export async function scrapeRemoteOK(): Promise<{
  success: boolean
  jobsScraped: number
  jobsInserted: number
  error?: string
}> {
  console.log('🔍 Starting RemoteOK scrape...')
  
  let jobsScraped = 0
  let jobsInserted = 0
  
  try {
    // RemoteOK has a public JSON API
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'RemoteHireHub Job Aggregator'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data: RemoteOKJob[] = await response.json()
    
    // First item is metadata, skip it
    const jobs = data.slice(1)
    jobsScraped = jobs.length
    
    console.log(`📊 Found ${jobsScraped} jobs from RemoteOK`)
    
    // Process each job
    for (const job of jobs) {
      try {
        // Check if already exists
        const exists = await jobExists(job.id, 'remoteok')
        if (exists) {
          console.log(`⏭️  Skipping duplicate: ${job.position}`)
          continue
        }
        
        // Generate slug
        const slug = generateSlug(job.position, job.company)
        
        // Parse salary if available
        const salary = parseSalary(job.description)
        
        // Detect job type from tags
        let jobType = 'Full-time'
        if (job.tags?.some(t => t.toLowerCase().includes('contract'))) {
          jobType = 'Contract'
        }
        
        // Detect experience level from title
        const experienceLevel = normalizeExperienceLevel(job.position)
        
        // Detect category
        const categoryId = await detectCategory(job.position, job.description)
        
        // Determine location restriction
        let locationRestriction = 'Worldwide'
        if (job.tags?.some(t => t.toLowerCase() === 'usa')) {
          locationRestriction = 'US Only'
        } else if (job.tags?.some(t => t.toLowerCase() === 'europe')) {
          locationRestriction = 'Europe'
        }
        
        // Clean description
        const description = cleanHtml(job.description)
        
        // Insert job
        await insertJob({
          job_id: generateJobId(job.id, 'remoteok'),
          source_job_id: job.id,
          title: job.position,
          company: job.company,
          company_logo_url: job.company_logo || undefined,
          location: 'Remote',
          location_restriction: locationRestriction,
          job_type: jobType,
          experience_level: experienceLevel || undefined,
          category_id: categoryId || undefined,
          salary_min: salary.min || undefined,
          salary_max: salary.max || undefined,
          salary_currency: salary.currency,
          description: description,
          source_platform: 'RemoteOK',
          source_url: `https://remoteok.com${job.url}`,
          posted_date: new Date(job.date).toISOString(),
          slug: slug
        })
        
        jobsInserted++
        console.log(`✅ Inserted: ${job.position} at ${job.company}`)
        
      } catch (error) {
        console.error(`❌ Error processing job ${job.position}:`, error)
        // Continue with next job
      }
    }
    
    // Log success
    await logScraperRun('RemoteOK', 'success', jobsScraped, jobsInserted)
    
    console.log(`✨ RemoteOK scrape complete! Inserted ${jobsInserted}/${jobsScraped} jobs`)
    
    return {
      success: true,
      jobsScraped,
      jobsInserted
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ RemoteOK scrape failed:', errorMessage)
    
    // Log failure
    await logScraperRun('RemoteOK', 'error', jobsScraped, jobsInserted, errorMessage)
    
    return {
      success: false,
      jobsScraped,
      jobsInserted,
      error: errorMessage
    }
  }
}