import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, TrendingUp, DollarSign } from 'lucide-react'
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  // Decode HTML entities and strip tags
  const getCleanDescription = () => {
    if (!job.description) return ''
    
    // Decode HTML entities (like &lt; to <, &amp; to &, etc.)
    const decoded = job.description
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
    
    // Strip HTML tags
    const stripped = decoded.replace(/<[^>]*>/g, ' ')
    
    // Clean up extra whitespace
    const cleaned = stripped.replace(/\s+/g, ' ').trim()
    
    return cleaned
  }
  
  // Fix broken image URLs and add fallback
  const getCompanyLogo = () => {
    if (!job.company_logo_url) return null
    
    // If URL starts with //, add https:
    if (job.company_logo_url.startsWith('//')) {
      return `https:${job.company_logo_url}`
    }
    
    // If URL is relative, skip it
    if (!job.company_logo_url.startsWith('http')) {
      return null
    }
    
    return job.company_logo_url
  }

  const logoUrl = getCompanyLogo()
  
  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null
    
    const currency = job.salary_currency || 'USD'
    const min = job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k` : ''
    const max = job.salary_max ? `$${(job.salary_max / 1000).toFixed(0)}k` : ''
    
    if (min && max) return `${min} - ${max}`
    if (min) return `From ${min}`
    if (max) return `Up to ${max}`
  }

  const salary = formatSalary()

  return (
    <Link
      href={`/remote-job/${job.slug}`}
      className="block group"
    >
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-xl hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
        {/* Header with Logo and Badge */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Company Logo or Placeholder */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${job.company} logo`}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-lg sm:text-xl font-bold text-gray-400">
                  {job.company.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Company Name */}
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                {job.company}
              </p>
              {job.source_platform && (
                <p className="text-[10px] sm:text-xs text-gray-400">
                  via {job.source_platform}
                </p>
              )}
            </div>
          </div>

          {/* Featured/New Badge */}
          {job.is_featured && (
            <span className="flex-shrink-0 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Job Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {job.title}
        </h3>

        {/* Job Details - Icons + Text */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>

          {/* Job Type */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
            <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
            <span>{job.job_type}</span>
          </div>

          {/* Experience Level */}
          {job.experience_level && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
              <span>{job.experience_level}</span>
            </div>
          )}
        </div>

        {/* Salary */}
        {salary && (
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-green-600 mb-3 sm:mb-4">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{salary}</span>
            <span className="text-xs text-gray-500">/ year</span>
          </div>
        )}

        {/* Description Preview - Only on larger screens */}
        <p className="hidden sm:block text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {getCleanDescription().substring(0, 150)}...
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 mt-auto">
          <span className="text-[10px] sm:text-xs text-gray-500">
            {new Date(job.posted_date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}
          </span>
          <span className="text-[10px] sm:text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}