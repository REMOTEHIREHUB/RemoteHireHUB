'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  ExternalLink,
  CheckCircle,
  XCircle 
} from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  is_active: boolean
  posted_date: string
  slug: string
  source_platform: string
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/jobs')
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== id))
        alert('Job deleted successfully!')
      } else {
        alert('Failed to delete job')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/jobs/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (response.ok) {
        setJobs(jobs.map(job => 
          job.id === id ? { ...job, is_active: !currentStatus } : job
        ))
      }
    } catch (error) {
      console.error('Error toggling job status:', error)
    }
  }

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = 
        filterActive === 'all' ||
        (filterActive === 'active' && job.is_active) ||
        (filterActive === 'inactive' && !job.is_active)
      
      return matchesSearch && matchesFilter
    })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
              <p className="text-gray-600 mt-1">Manage all job listings</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/jobs/create">
                <Plus className="mr-2 h-4 w-4" />
                Add New Job
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-green-600">
                {jobs.filter(j => j.is_active).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm text-gray-600">Inactive Jobs</p>
              <p className="text-2xl font-bold text-gray-600">
                {jobs.filter(j => !j.is_active).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filterActive === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterActive('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterActive === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterActive('active')}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filterActive === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setFilterActive('inactive')}
                  size="sm"
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No jobs found</p>
            <Button asChild>
              <Link href="/admin/jobs/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Job
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.job_type}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(job.id, job.is_active)}
                        className="flex items-center gap-1"
                      >
                        {job.is_active ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 font-medium text-sm">
                            <XCircle className="h-4 w-4" />
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.source_platform || 'Manual'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/remote-job/${job.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/jobs/edit/${job.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}