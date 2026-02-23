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

// 50 remote-friendly companies on Greenhouse
const GREENHOUSE_COMPANIES = [
  'airbnb', 'airtable', 'algolia', 'asana', 'brex',
  'canva', 'clickup', 'cloudflare', 'coinbase', 'contentful',
  'datadog', 'deel', 'digit', 'discord', 'doist',
  'dropbox', 'duolingo', 'elastic', 'figma', 'fivetran',
  'fly', 'framer', 'github', 'gitlab', 'gorgias',
  'hashicorp', 'helpscout', 'hubspot', 'intercom', 'invision',
  'jasper', 'linear', 'loom', 'mercury', 'miro',
  'mixpanel', 'monday', 'netlify', 'notion', 'openai',
  'pagerduty', 'pitch', 'plaid', 'postman', 'remote',
  'retool', 'rippling', 'scale', 'sendgrid', 'stripe'
]

interface GreenhouseJob {
  id: number
  title: string
  updated_at: string
  location: { name: string }
  departments: { name: string }[]
  offices: { name: string }[]
  absolute_url: string
  content: string
  metadata: any[]
}

function isRemoteJob(job: GreenhouseJob): boolean {
  const locationName = job.location?.name?.toLowerCase() || ''
  const title = job.title?.toLowerCase() || ''
  const offices = job.offices?.map(o => o.name?.toLowerCase()).join(' ') || ''
  
  return (
    locationName.includes('remote') ||
    locationName.includes('anywhere') ||
    locationName.includes('worldwide') ||
    offices.includes('remote') ||
    title.includes('remote')
  )
}

export async function scrapeGreenhouse(): Promise<{
  success: boolean
  jobsScraped: number
  jobsInserted: number
  error?: string
}> {
  console.log('🔍 Starting Greenhouse scrape...')

  let jobsScraped = 0
  let jobsInserted = 0

  try {
    for (const company of GREENHOUSE_COMPANIES) {
      try {
        console.log(`🏢 Fetching Greenhouse jobs for: ${company}`)

        const response = await fetch(
          `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`,
          {
            headers: { 'User-Agent': 'RemoteHubHire Job Aggregator' }
          }
        )

        // Company may not use Greenhouse - skip gracefully
        if (!response.ok) {
          console.log(`⏭️  Skipping ${company}: HTTP ${response.status}`)
          continue
        }

        const data = await response.json()
        const jobs: GreenhouseJob[] = data.jobs || []

        // Filter to remote jobs only
        const remoteJobs = jobs.filter(isRemoteJob)
        jobsScraped += remoteJobs.length

        console.log(`📊 ${company}: ${remoteJobs.length} remote jobs out of ${jobs.length} total`)

        for (const job of remoteJobs) {
          try {
            const sourceJobId = job.id.toString()

            // Check if already exists
            const exists = await jobExists(sourceJobId, 'greenhouse')
            if (exists) {
              console.log(`⏭️  Skipping duplicate: ${job.title}`)
              continue
            }

            const slug = generateSlug(job.title, company)
            const description = cleanHtml(job.content || '')
            const salary = parseSalary(job.content || '')
            const experienceLevel = normalizeExperienceLevel(job.title)
            const categoryId = await detectCategory(job.title, job.content || '')

            // Determine location restriction
            const locationName = job.location?.name?.toLowerCase() || ''
            let locationRestriction = 'Worldwide'
            if (locationName.includes('us') || locationName.includes('united states') || locationName.includes('america')) {
              locationRestriction = 'US Only'
            } else if (locationName.includes('europe')) {
              locationRestriction = 'Europe'
            }

            await insertJob({
              job_id: generateJobId(sourceJobId, 'greenhouse'),
              source_job_id: sourceJobId,
              title: job.title,
              company: company.charAt(0).toUpperCase() + company.slice(1),
              location: job.location?.name || 'Remote',
              location_restriction: locationRestriction,
              job_type: 'Full-time',
              experience_level: experienceLevel || undefined,
              category_id: categoryId || undefined,
              salary_min: salary.min || undefined,
              salary_max: salary.max || undefined,
              salary_currency: salary.currency,
              description: description,
              source_platform: 'Greenhouse',
              source_url: job.absolute_url,
              posted_date: new Date(job.updated_at).toISOString(),
              slug: slug
            })

            jobsInserted++
            console.log(`✅ Inserted: ${job.title} at ${company}`)

          } catch (error) {
            console.error(`❌ Error processing Greenhouse job ${job.title}:`, error)
          }
        }

        // Small delay between companies to be respectful
        await new Promise(resolve => setTimeout(resolve, 300))

      } catch (error) {
        console.error(`❌ Error fetching Greenhouse jobs for ${company}:`, error)
      }
    }

    await logScraperRun('Greenhouse', 'success', jobsScraped, jobsInserted)
    console.log(`✨ Greenhouse scrape complete! Inserted ${jobsInserted}/${jobsScraped} jobs`)

    return { success: true, jobsScraped, jobsInserted }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Greenhouse scrape failed:', errorMessage)
    await logScraperRun('Greenhouse', 'error', jobsScraped, jobsInserted, errorMessage)
    return { success: false, jobsScraped, jobsInserted, error: errorMessage }
  }
}