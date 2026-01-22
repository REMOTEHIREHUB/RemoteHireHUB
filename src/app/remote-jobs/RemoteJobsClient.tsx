'use client'

import { useState, useMemo } from 'react'
import { JobList } from '@/components/jobs/JobList'
import { JobFilters, FilterState } from '../admin/jobs/JobFilters'
import { JobSearch } from '../admin/jobs/JobSearch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SlidersHorizontal, Briefcase, TrendingUp } from 'lucide-react'
import type { Job } from '@/types/job'

interface RemoteJobsClientProps {
  initialJobs: Job[]
}

export function RemoteJobsClient({ initialJobs }: RemoteJobsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevels: [],
    locationRestrictions: [],
    salaryMin: 0,
    salaryMax: 200000
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filter jobs on client side
  const filteredJobs = useMemo(() => {
    let result = initialJobs

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      )
    }

    // Job type filter
    if (filters.jobTypes.length > 0) {
      result = result.filter(job => filters.jobTypes.includes(job.job_type))
    }

    // Experience level filter
    if (filters.experienceLevels.length > 0) {
      result = result.filter(job => 
        job.experience_level && filters.experienceLevels.includes(job.experience_level)
      )
    }

    // Location restriction filter
    if (filters.locationRestrictions.length > 0) {
      result = result.filter(job =>
        job.location_restriction && filters.locationRestrictions.includes(job.location_restriction)
      )
    }

    // Salary filter
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

  // Count active filters
  const activeFiltersCount = 
    filters.jobTypes.length + 
    filters.experienceLevels.length + 
    filters.locationRestrictions.length +
    (filters.salaryMin > 0 ? 1 : 0) +
    (filters.salaryMax < 200000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
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
              <span className="font-semibold text-blue-600">{filteredJobs.length}</span>
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

        {/* Search Bar */}
        <div className="mb-8">
          <JobSearch onSearch={setSearchQuery} initialQuery={searchQuery} />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full border-2 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 h-12 rounded-xl"
          >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24">
              <JobFilters 
                onFilterChange={setFilters} 
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Active Search/Filter Summary */}
            {(searchQuery || activeFiltersCount > 0) && (
              <Card className="mb-6 p-5 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Active Search</p>
                    <p className="text-sm text-blue-800">
                      {searchQuery && (
                        <span>Searching for <strong className="font-bold">"{searchQuery}"</strong></span>
                      )}
                      {searchQuery && activeFiltersCount > 0 && <span> with </span>}
                      {activeFiltersCount > 0 && (
                        <span><strong className="font-bold">{activeFiltersCount}</strong> filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Job List */}
            <JobList 
              jobs={filteredJobs} 
              emptyMessage={
                searchQuery || activeFiltersCount > 0
                  ? "No jobs match your search criteria. Try adjusting your filters or search terms."
                  : "No remote jobs available at the moment. Check back soon for new opportunities!"
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}