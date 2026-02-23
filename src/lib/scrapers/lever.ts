import { 
  generateSlug, 
  generateJobId, 
  cleanHtml,
  parseSalary,
  jobExists,
  normalizeExperienceLevel,
  detectCategory,
  insertJob,
  logScraperRun
} from './utils'

// 50 remote-friendly companies on Lever
const LEVER_COMPANIES = [
  'acquia', 'adhoc', 'amplitude', 'angi', 'axios',
  'benchling', 'betterment', 'bigcommerce', 'carta', 'clearbit',
  'clubhouse', 'convoy', 'degreed', 'descript', 'easypost',
  'flatiron', 'flexport', 'fountain', 'gem', 'gong',
  'grammarly', 'guide', 'heap', 'hopin', 'illumio',
  'ironclad', 'iterable', 'kaltura', 'khan-academy', 'kiva',
  'lattice', 'launchdarkly', 'lob', 'lyft', 'marqeta',
  'messagebird', 'modernhealth', 'netlify', 'new-relic', 'nylas',
  'okta', 'olo', 'outreach', 'papaya-global', 'persona',
  'productboard', 'qualified', 'quizlet', 'readme', 'redfin'
]

interface LeverJob {
  id: string
  text: string
  createdAt: number
  updatedAt?: number
  hostedUrl: string
  applyUrl: string
  categories: {
    commitment?: string
    department?: string
    location?: string
    team?: string
  }
  description: string
  descriptionPlain: string
  lists: { text: string; content: string }[]
  additional?: string
  additionalPlain?: string
}

function isRemoteJob(job: LeverJob): boolean {
  const location = job.categories?.location?.toLowerCase() || ''
  const title = job.text?.toLowerCase() || ''
  const commitment = job.categories?.commitment?.toLowerCase() || ''

  return (
    location.includes('remote') ||
    location.includes('anywhere') ||
    location.includes('worldwide') ||
    title.includes('remote') ||
    commitment.includes('remote')
  )
}

function buildFullDescription(job: LeverJob): string {
  let fullContent = job.description || ''

  // Append structured lists (requirements, responsibilities, etc.)
  if (job.lists && job.lists.length > 0) {
    for (const list of job.lists) {
      if (list.text && list.content) {
        fullContent += `<h3>${list.text}</h3>${list.content}`
      }
    }
  }

  if (job.additional) {
    fullContent += job.additional
  }

  return cleanHtml(fullContent)
}

export async function scrapeLever(): Promise<{
  success: boolean
  jobsScraped: number
  jobsInserted: number
  error?: string
}> {
  console.log('🔍 Starting Lever scrape...')

  let jobsScraped = 0
  let jobsInserted = 0

  try {
    for (const company of LEVER_COMPANIES) {
      try {
        console.log(`🏢 Fetching Lever jobs for: ${company}`)

        const response = await fetch(
          `https://api.lever.co/v0/postings/${company}?mode=json`,
          {
            headers: { 'User-Agent': 'RemoteHubHire Job Aggregator' }
          }
        )

        // Company may not use Lever - skip gracefully
        if (!response.ok) {
          console.log(`⏭️  Skipping ${company}: HTTP ${response.status}`)
          continue
        }

        const jobs: LeverJob[] = await response.json()

        // Filter to remote jobs only
        const remoteJobs = jobs.filter(isRemoteJob)
        jobsScraped += remoteJobs.length

        console.log(`📊 ${company}: ${remoteJobs.length} remote jobs out of ${jobs.length} total`)

        for (const job of remoteJobs) {
          try {
            const sourceJobId = job.id

            // Check if already exists
            const exists = await jobExists(sourceJobId, 'lever')
            if (exists) {
              console.log(`⏭️  Skipping duplicate: ${job.text}`)
              continue
            }

            const slug = generateSlug(job.text, company)
            const description = buildFullDescription(job)
            const salary = parseSalary(job.descriptionPlain || '')
            const experienceLevel = normalizeExperienceLevel(job.text)
            const categoryId = await detectCategory(job.text, job.descriptionPlain || '')

            // Determine job type from Lever commitment field
            const commitment = job.categories?.commitment || 'Full-time'
            const jobType = commitment.toLowerCase().includes('part') ? 'Part-time'
              : commitment.toLowerCase().includes('contract') ? 'Contract'
              : commitment.toLowerCase().includes('freelance') ? 'Freelance'
              : 'Full-time'

            // Determine location restriction
            const location = job.categories?.location?.toLowerCase() || ''
            let locationRestriction = 'Worldwide'
            if (location.includes('us') || location.includes('united states') || location.includes('america')) {
              locationRestriction = 'US Only'
            } else if (location.includes('europe')) {
              locationRestriction = 'Europe'
            }

            // Format company name nicely
            const companyName = company
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')

            await insertJob({
              job_id: generateJobId(sourceJobId, 'lever'),
              source_job_id: sourceJobId,
              title: job.text,
              company: companyName,
              location: job.categories?.location || 'Remote',
              location_restriction: locationRestriction,
              job_type: jobType,
              experience_level: experienceLevel || undefined,
              category_id: categoryId || undefined,
              salary_min: salary.min || undefined,
              salary_max: salary.max || undefined,
              salary_currency: salary.currency,
              description: description,
              source_platform: 'Lever',
              source_url: job.hostedUrl,
              posted_date: new Date(job.createdAt).toISOString(),
              slug: slug
            })

            jobsInserted++
            console.log(`✅ Inserted: ${job.text} at ${company}`)

          } catch (error) {
            console.error(`❌ Error processing Lever job ${job.text}:`, error)
          }
        }

        // Small delay between companies to be respectful
        await new Promise(resolve => setTimeout(resolve, 300))

      } catch (error) {
        console.error(`❌ Error fetching Lever jobs for ${company}:`, error)
      }
    }

    await logScraperRun('Lever', 'success', jobsScraped, jobsInserted)
    console.log(`✨ Lever scrape complete! Inserted ${jobsInserted}/${jobsScraped} jobs`)

    return { success: true, jobsScraped, jobsInserted }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Lever scrape failed:', errorMessage)
    await logScraperRun('Lever', 'error', jobsScraped, jobsInserted, errorMessage)
    return { success: false, jobsScraped, jobsInserted, error: errorMessage }
  }
}