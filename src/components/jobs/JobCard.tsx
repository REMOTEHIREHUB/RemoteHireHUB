import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, TrendingUp, DollarSign, Clock } from 'lucide-react'
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getCleanDescription = () => {
    if (!job.description) return ''
    const decoded = job.description
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    return decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  const getCompanyLogo = () => {
    if (!job.company_logo_url) return null
    if (job.company_logo_url.startsWith('//')) return `https:${job.company_logo_url}`
    if (!job.company_logo_url.startsWith('http')) return null
    return job.company_logo_url
  }

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null
    const min = job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k` : ''
    const max = job.salary_max ? `$${(job.salary_max / 1000).toFixed(0)}k` : ''
    if (min && max) return `${min} – ${max}`
    if (min) return `From ${min}`
    if (max) return `Up to ${max}`
  }

  const getPostedLabel = () => {
    const posted = new Date(job.posted_date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const logoUrl = getCompanyLogo()
  const salary = formatSalary()
  const companyInitial = job.company.charAt(0).toUpperCase()

  return (
    <Link href={`/remote-job/${job.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all duration-250 h-full flex">

        {/* Left accent strip */}
        <div className="w-1 flex-shrink-0 bg-gradient-to-b from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-250" />

        {/* Card content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col min-w-0">

          {/* Top: Logo + Company + Featured badge */}
          <div className="flex items-start gap-3 mb-3">
            {/* Company logo / initial avatar */}
            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${job.company} logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <span className="text-sm font-bold text-gray-500">{companyInitial}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate leading-tight">{job.company}</p>
              {job.source_platform && (
                <p className="text-[10px] text-gray-400 truncate">via {job.source_platform}</p>
              )}
            </div>

            {job.is_featured && (
              <span className="flex-shrink-0 text-[10px] sm:text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Job title */}
          <h3 className="text-sm sm:text-base md:text-[15px] font-bold text-gray-900 mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {job.title}
          </h3>

          {/* Tags row — chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate max-w-[100px]">{job.location || 'Remote'}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              <Briefcase className="h-2.5 w-2.5 flex-shrink-0" />
              {job.job_type}
            </span>
            {job.experience_level && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-2.5 w-2.5 flex-shrink-0" />
                {job.experience_level}
              </span>
            )}
          </div>

          {/* Salary */}
          {salary && (
            <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 mb-3">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{salary}</span>
              <span className="text-[10px] text-gray-400 font-normal ml-0.5">/ yr</span>
            </div>
          )}

          {/* Description — desktop only */}
          <p className="hidden md:block text-xs text-gray-500 line-clamp-2 mb-3 flex-1 leading-relaxed">
            {getCleanDescription().substring(0, 120)}...
          </p>

          {/* Spacer on mobile so footer sticks to bottom */}
          <div className="flex-1 md:hidden" />

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {getPostedLabel()}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform duration-200">
              View Job →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
