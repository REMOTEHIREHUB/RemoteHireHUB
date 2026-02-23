'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { JobList } from '@/components/jobs/JobList'
import { JobFilters, FilterState } from '../admin/jobs/JobFilters'
import { JobSearch } from '../admin/jobs/JobSearch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SlidersHorizontal, Briefcase, TrendingUp, X, Search } from 'lucide-react'
import type { Job } from '@/types/job'

interface RemoteJobsClientProps {
  initialJobs: Job[]
}

export function RemoteJobsClient({ initialJobs }: RemoteJobsClientProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevels: [],
    locationRestrictions: [],
    salaryMin: 0,
    salaryMax: 200000
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredJobs = useMemo(() => {
    let result = initialJobs

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      )
    }

    if (filters.jobTypes.length > 0) {
      result = result.filter(job => filters.jobTypes.includes(job.job_type))
    }

    if (filters.experienceLevels.length > 0) {
      result = result.filter(job =>
        job.experience_level && filters.experienceLevels.includes(job.experience_level)
      )
    }

    if (filters.locationRestrictions.length > 0) {
      result = result.filter(job =>
        job.location_restriction && filters.locationRestrictions.includes(job.location_restriction)
      )
    }

    if (filters.salaryMin > 0) {
      result = result.filter(job =>
        job.salary_min && job.salary_min >= filters.salaryMin
      )
    }

    if (filters.salaryMax < 200000) {
      result = result.filter(job =>
        job.salary_max && job.salary_max <= filters.salaryMax
      )
    }

    return result
  }, [initialJobs, searchQuery, filters])

  const activeFiltersCount =
    filters.jobTypes.length +
    filters.experienceLevels.length +
    filters.locationRestrictions.length +
    (filters.salaryMin > 0 ? 1 : 0) +
    (filters.salaryMax < 200000 ? 1 : 0)

  return (
    // overflow-x-hidden is the key fix — prevents any child from blowing out the viewport
    <div className="min-h-screen bg-gray-50 overflow-x-hidden w-full">

      {/* ── Mobile: Gradient Hero Banner ── */}
      <div className="lg:hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full">
        <div className="px-4 pt-6 pb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <Briefcase className="h-5 w-5 text-blue-200 flex-shrink-0" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Remote Jobs</h1>
          </div>
          <p className="text-blue-200 text-sm mb-4">
            <span className="text-white font-bold">{filteredJobs.length.toLocaleString()}</span>
            {' '}positions available worldwide
          </p>
          {/* Inline search inside hero */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Title, company, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile: Sticky Filter + Active Chips Bar ── */}
      {/* top-20 = 80px (h-20 header on mobile), sm:top-24 = 96px (h-24 header on sm+) */}
      <div className="lg:hidden sticky top-20 sm:top-24 z-30 bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="px-4 py-2.5 flex items-center gap-3">
          <button
            onClick={() => setShowFilters(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
              activeFiltersCount > 0
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded-full leading-none font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Active filter chips — horizontal scroll, NO negative margins */}
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            {activeFiltersCount > 0 ? (
              <div className="flex gap-1.5 w-max">
                {filters.jobTypes.map(type => (
                  <span key={type} className="inline-flex items-center text-[11px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">{type}</span>
                ))}
                {filters.experienceLevels.map(level => (
                  <span key={level} className="inline-flex items-center text-[11px] bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">{level}</span>
                ))}
                {filters.locationRestrictions.map(loc => (
                  <span key={loc} className="inline-flex items-center text-[11px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">{loc}</span>
                ))}
                {filters.salaryMin > 0 && (
                  <span className="inline-flex items-center text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">Min ${(filters.salaryMin / 1000).toFixed(0)}k</span>
                )}
                {filters.salaryMax < 200000 && (
                  <span className="inline-flex items-center text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">Max ${(filters.salaryMax / 1000).toFixed(0)}k</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 whitespace-nowrap">
                <span className="font-bold text-gray-800">{filteredJobs.length.toLocaleString()}</span> jobs found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop: Header ── */}
      <div className="hidden lg:block container mx-auto px-4 pt-8 pb-0">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Remote Jobs
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-600 text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-semibold text-blue-600">{filteredJobs.length.toLocaleString()}</span>
              <span className="ml-1">remote job{filteredJobs.length !== 1 ? 's' : ''} found</span>
            </p>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                </span>
              </div>
            )}
          </div>
        </div>
        <JobSearch onSearch={setSearchQuery} initialQuery={searchParams.get('q') ?? ''} />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 py-4 lg:py-8">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Filters Sidebar — desktop only */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <JobFilters
                onFilterChange={setFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3 min-w-0">
            {/* Active Search/Filter Summary */}
            {(searchQuery || activeFiltersCount > 0) && (
              <Card className="mb-4 p-4 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-600 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-blue-800">
                    {searchQuery && (
                      <span>Searching <strong className="text-blue-900">"{searchQuery}"</strong></span>
                    )}
                    {searchQuery && activeFiltersCount > 0 && <span className="mx-1">·</span>}
                    {activeFiltersCount > 0 && (
                      <span><strong className="text-blue-900">{activeFiltersCount}</strong> filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
                    )}
                  </p>
                </div>
              </Card>
            )}

            <JobList
              jobs={filteredJobs}
              emptyMessage={
                searchQuery || activeFiltersCount > 0
                  ? "No jobs match your search. Try adjusting filters or search terms."
                  : "No remote jobs available at the moment. Check back soon!"
              }
            />
          </div>
        </div>
      </div>

      {/* ── Mobile: Filter Bottom Sheet Drawer ── */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          {/* Drawer — use inset-x-0 not left/right to avoid overflow issues */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl lg:hidden flex flex-col shadow-2xl"
            style={{ maxHeight: '88dvh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="font-bold text-base text-gray-900">Filter Jobs</h3>
                {activeFiltersCount > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{activeFiltersCount} active</p>
                )}
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <JobFilters
                onFilterChange={setFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>

            {/* Show results CTA */}
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-base rounded-xl shadow-lg"
                onClick={() => setShowFilters(false)}
              >
                Show {filteredJobs.length.toLocaleString()} Result{filteredJobs.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}