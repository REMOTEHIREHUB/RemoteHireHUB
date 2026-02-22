import { Suspense } from 'react'
import { getJobs } from '@/lib/supabase/queries'
import { RemoteJobsClient } from './RemoteJobsClient'

export const dynamic = 'force-dynamic'

export default async function RemoteJobsPage() {
  const allJobs = await getJobs()

  return (
    <Suspense fallback={null}>
      <RemoteJobsClient initialJobs={allJobs} />
    </Suspense>
  )
}