import { 
  generateSlug, 
  generateJobId, 
  cleanHtml,
  jobExists,
  normalizeJobType,
  normalizeExperienceLevel,
  detectCategory,
  insertJob,
  logScraperRun
} from './utils'

interface WWRJob {
  title: string
  link: string
  pubDate: string
  description: string
  category?: string
  company?: string
}

export async function scrapeWeWorkRemotely(): Promise<{
  success: boolean
  jobsScraped: number
  jobsInserted: number
  error?: string
}> {
  console.log('🔍 Starting We Work Remotely scrape...')
  
  let jobsScraped = 0
  let jobsInserted = 0
  
  try {
    // We Work Remotely has an RSS feed
    const response = await fetch('https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss', {
      headers: {
        'User-Agent': 'RemoteHireHub Job Aggregator'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const xmlText = await response.text()
    
    // Parse RSS feed (simple parsing)
    const jobs = parseRSS(xmlText)
    jobsScraped = jobs.length
    
    console.log(`📊 Found ${jobsScraped} jobs from We Work Remotely`)
    
    // Process each job
    for (const job of jobs) {
      try {
        // Extract job ID from URL
        const urlParts = job.link.split('/')
        const jobId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
        
        // Check if already exists
        const exists = await jobExists(jobId, 'weworkremotely')
        if (exists) {
          console.log(`⏭️  Skipping duplicate: ${job.title}`)
          continue
        }
        
        // Extract company from title (format: "Company: Job Title")
        const titleParts = job.title.split(':')
        const company = titleParts.length > 1 ? titleParts[0].trim() : 'Company'
        const title = titleParts.length > 1 ? titleParts.slice(1).join(':').trim() : job.title
        
        // Generate slug
        const slug = generateSlug(title, company)
        
        // Detect job type
        const jobType = normalizeJobType(job.description)
        
        // Detect experience level
        const experienceLevel = normalizeExperienceLevel(title)
        
        // Detect category
        const categoryId = await detectCategory(title, job.description)
        
        // Clean description
        const description = cleanHtml(job.description)
        
        // Insert job
        await insertJob({
          job_id: generateJobId(jobId, 'weworkremotely'),
          source_job_id: jobId,
          title: title,
          company: company,
          location: 'Remote',
          location_restriction: 'Worldwide',
          job_type: jobType,
          experience_level: experienceLevel || undefined,
          category_id: categoryId || undefined,
          description: description,
          source_platform: 'We Work Remotely',
          source_url: job.link,
          posted_date: new Date(job.pubDate).toISOString(),
          slug: slug
        })
        
        jobsInserted++
        console.log(`✅ Inserted: ${title} at ${company}`)
        
      } catch (error) {
        console.error(`❌ Error processing job ${job.title}:`, error)
        // Continue with next job
      }
    }
    
    // Log success
    await logScraperRun('We Work Remotely', 'success', jobsScraped, jobsInserted)
    
    console.log(`✨ We Work Remotely scrape complete! Inserted ${jobsInserted}/${jobsScraped} jobs`)
    
    return {
      success: true,
      jobsScraped,
      jobsInserted
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ We Work Remotely scrape failed:', errorMessage)
    
    // Log failure
    await logScraperRun('We Work Remotely', 'error', jobsScraped, jobsInserted, errorMessage)
    
    return {
      success: false,
      jobsScraped,
      jobsInserted,
      error: errorMessage
    }
  }
}

// Simple RSS parser (extracts items)
function parseRSS(xml: string): WWRJob[] {
  const jobs: WWRJob[] = []
  
  // Extract all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const items = xml.match(itemRegex) || []
  
  for (const item of items) {
    try {
      const title = extractTag(item, 'title')
      const link = extractTag(item, 'link')
      const pubDate = extractTag(item, 'pubDate')
      const description = extractTag(item, 'description')
      
      if (title && link) {
        jobs.push({
          title: cleanCDATA(title),
          link: cleanCDATA(link),
          pubDate: cleanCDATA(pubDate),
          description: cleanCDATA(description)
        })
      }
    } catch (error) {
      console.error('Error parsing RSS item:', error)
    }
  }
  
  return jobs
}

// Extract tag content
function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

// Clean CDATA wrapper
function cleanCDATA(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .trim()
}