import Link from 'next/link'
import { Job } from '@/types/job'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/remote-job/${job.slug}`}
      className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Company Logo */}
          {job.company_logo_url && (
            <img
              src={job.company_logo_url}
              alt={`${job.company} logo`}
              className="w-12 h-12 object-contain mb-3"
            />
          )}

          {/* Job Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>

          {/* Company Name */}
          <p className="text-lg text-gray-700 mb-2">{job.company}</p>

          {/* Job Details */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              📍 {job.location}
            </span>
            <span className="flex items-center">
              💼 {job.job_type}
            </span>
            {job.experience_level && (
              <span className="flex items-center">
                🎯 {job.experience_level}
              </span>
            )}
          </div>

          {/* Salary Range */}
          {job.salary_min && job.salary_max && (
            <p className="text-sm font-medium text-green-600 mb-3">
              {job.salary_currency || 'USD'} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
            </p>
          )}

          {/* Description Preview */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {job.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
        </div>

        {/* Featured Badge */}
        {job.is_featured && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Featured
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
        <span>{job.source_platform}</span>
        <span>{new Date(job.posted_date).toLocaleDateString()}</span>
      </div>
    </Link>
  )
}
