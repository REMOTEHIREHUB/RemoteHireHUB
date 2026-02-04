'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, 
  FileText, 
  Settings, 
  Plus,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/jobs')
      const data = await response.json()
      if (data.success) {
        const jobs = data.jobs || []
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter((j: any) => j.is_active).length,
          inactiveJobs: jobs.filter((j: any) => !j.is_active).length,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your remote job board</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
            <p className="text-sm text-gray-600 mt-1">Total Jobs</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
            <p className="text-sm text-gray-600 mt-1">Active Jobs</p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Eye className="h-6 w-6 text-gray-600" />
              </div>
              <span className="text-sm text-gray-500">Inactive</span>
            </div>
            <p className="text-3xl font-bold text-gray-600">{stats.inactiveJobs}</p>
            <p className="text-sm text-gray-600 mt-1">Inactive Jobs</p>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Jobs Management */}
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-100 rounded-lg">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Management</h2>
            <p className="text-gray-600 mb-6">
              Create, edit, and manage all job listings
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Manage Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/jobs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Job
                </Link>
              </Button>
            </div>
          </div>

          {/* Blog Management */}
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-purple-100 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h2>
            <p className="text-gray-600 mb-6">
              Write and publish blog posts
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/admin/blog">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Blog
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/blog/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Write New Post
                </Link>
              </Button>
            </div>
          </div>

          {/* Scraper */}
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-green-100 rounded-lg">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Scraper</h2>
            <p className="text-gray-600 mb-6">
              Automatically fetch jobs from remote job boards
            </p>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/admin/scrapers">
                <Settings className="mr-2 h-4 w-4" />
                Run Scraper
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              View Homepage
            </Link>
            <Link 
              href="/remote-jobs" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Browse Jobs
            </Link>
            <Link 
              href="/blog" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              View Blog
            </Link>
            <Link 
              href="/admin/jobs" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              All Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}