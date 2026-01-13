import { JobCard } from './JobCard'
import type { Job } from '@/types/job'

interface JobListProps {
  jobs: Job[]
  emptyMessage?: string
}

export function JobList({ jobs, emptyMessage = "No jobs found matching your criteria." }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg 
            className="mx-auto h-12 w-12" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}