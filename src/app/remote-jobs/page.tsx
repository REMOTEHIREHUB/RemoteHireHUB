import { getJobs } from '@/lib/supabase/queries'
import { RemoteJobsClient } from './RemoteJobsClient'

export const dynamic = 'force-dynamic'

export default async function RemoteJobsPage() {
  // Fetch all jobs on the server
  const allJobs = await getJobs()
  
  return <RemoteJobsClient initialJobs={allJobs} />
}