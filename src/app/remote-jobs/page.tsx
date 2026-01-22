import { getJobs } from '@/lib/supabase/queries'
import { RemoteJobsClient } from './RemoteJobsClient'

export default async function RemoteJobsPage() {
  // Fetch all jobs on the server
  const allJobs = await getJobs({ limit: 1000 })
  
  return <RemoteJobsClient initialJobs={allJobs} />
}