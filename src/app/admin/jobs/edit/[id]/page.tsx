'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

interface EditJobPageProps {
  params: Promise<{ id: string }>
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter()
  const [jobId, setJobId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetchingJob, setFetchingJob] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    company_logo_url: '',
    location: 'Remote',
    location_restriction: '',
    timezone_requirement: '',
    job_type: 'Full-time',
    experience_level: 'Mid-level',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    salary_period: 'year',
    source_url: '',
    category_id: '',
    is_remote: true,
    is_featured: false,
    is_active: true,
    has_health_insurance: false,
    has_401k: false,
    offers_visa_sponsorship: false,
    offers_relocation: false,
    home_office_stipend: false,
  })

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params
      setJobId(resolvedParams.id)
      await Promise.all([
        fetchJob(resolvedParams.id),
        fetchCategories()
      ])
    }
    init()
  }, [params])

  const fetchJob = async (id: string) => {
    try {
      setFetchingJob(true)
      const response = await fetch(`/api/admin/jobs/${id}`)
      const data = await response.json()
      
      if (data.success && data.job) {
        const job = data.job
        setFormData({
          title: job.title || '',
          company: job.company || '',
          company_logo_url: job.company_logo_url || '',
          location: job.location || 'Remote',
          location_restriction: job.location_restriction || '',
          timezone_requirement: job.timezone_requirement || '',
          job_type: job.job_type || 'Full-time',
          experience_level: job.experience_level || 'Mid-level',
          description: job.description || '',
          requirements: job.requirements || '',
          responsibilities: job.responsibilities || '',
          benefits: job.benefits || '',
          salary_min: job.salary_min?.toString() || '',
          salary_max: job.salary_max?.toString() || '',
          salary_currency: job.salary_currency || 'USD',
          salary_period: job.salary_period || 'year',
          source_url: job.source_url || '',
          category_id: job.category_id || '',
          is_remote: job.is_remote ?? true,
          is_featured: job.is_featured ?? false,
          is_active: job.is_active ?? true,
          has_health_insurance: job.has_health_insurance ?? false,
          has_401k: job.has_401k ?? false,
          offers_visa_sponsorship: job.offers_visa_sponsorship ?? false,
          offers_relocation: job.offers_relocation ?? false,
          home_office_stipend: job.home_office_stipend ?? false,
        })
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      alert('Error loading job')
    } finally {
      setFetchingJob(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const jobData: any = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        updated_at: new Date().toISOString(),
      }

      // Remove category_id if empty
      if (!formData.category_id || formData.category_id === '') {
        delete jobData.category_id
      }

      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })

      const data = await response.json()

      if (data.success) {
        alert('Job updated successfully!')
        router.push('/admin/jobs')
      } else {
        alert('Failed to update job: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Error updating job')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingJob) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Loading job...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-1">Update job listing details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="company_logo_url"
                  value={formData.company_logo_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Category (Optional) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Job Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Compensation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Min
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Max
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="salary_currency"
                  value={formData.salary_currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Application */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Application Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application/Source URL
              </label>
              <input
                type="url"
                name="source_url"
                value={formData.source_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Restriction
                </label>
                <input
                  type="text"
                  name="location_restriction"
                  value={formData.location_restriction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone Requirement
                </label>
                <input
                  type="text"
                  name="timezone_requirement"
                  value={formData.timezone_requirement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Settings & Benefits</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote Job</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="has_health_insurance"
                  checked={formData.has_health_insurance}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Health Insurance</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="has_401k"
                  checked={formData.has_401k}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">401k</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="offers_visa_sponsorship"
                  checked={formData.offers_visa_sponsorship}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Visa Sponsorship</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="offers_relocation"
                  checked={formData.offers_relocation}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Relocation</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="home_office_stipend"
                  checked={formData.home_office_stipend}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Home Office Stipend</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/jobs">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}