import { JobCard } from './JobCard'
import type { Job } from '@/types/job'
import { Search } from 'lucide-react'

interface JobListProps {
  jobs: Job[]
  emptyMessage?: string
}

export function JobList({ jobs, emptyMessage }: JobListProps) {
  const jobsArray = Array.isArray(jobs) ? jobs : []

  if (jobsArray.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
        <p className="text-gray-500">
          {emptyMessage || 'No remote jobs available at the moment. Check back soon!'}
        </p>
      </div>
    )
  }

  return (
    // Single column on mobile, 2 cols on sm, 3 on lg (matches parent col-span-3)
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {jobsArray.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}