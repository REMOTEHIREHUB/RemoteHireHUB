import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { getJobs } from '@/lib/supabase/queries'
import { RemoteJobsClient } from './RemoteJobsClient'

// Cache the full jobs list for 2 minutes so repeat visitors don't hit Supabase every time
const getCachedJobs = unstable_cache(
  () => getJobs(),
  ['all-remote-jobs'],
  { revalidate: 120 }
)

export default async function RemoteJobsPage() {
  const allJobs = await getCachedJobs()

  return (
    <Suspense fallback={null}>
      <RemoteJobsClient initialJobs={allJobs} />
    </Suspense>
  )
}
