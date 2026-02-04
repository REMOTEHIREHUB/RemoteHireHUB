import { notFound } from 'next/navigation'
import { getJobs, getCategories } from '@/lib/supabase/queries'
import { JobList } from '@/components/jobs/JobList'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params
  
  // Remove '-jobs' suffix if present
  const categorySlug = category.replace(/-jobs$/, '')
  
  // Get categories
  const categories = await getCategories()
  const currentCategory = categories.find(cat => cat.slug === categorySlug)
  
  if (!currentCategory) {
    return notFound()
  }
  
  // Get jobs
  const jobs = await getJobs({ 
    categoryId: currentCategory.id,
    limit: 100 
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6">
          <Button variant="outline" asChild className="border-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Remote {currentCategory.name} Jobs
          </h1>
          {currentCategory.description && (
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
              {currentCategory.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">
              {jobs.length}
            </span>
            <span className="text-gray-600">
              {jobs.length === 1 ? 'job' : 'jobs'} available
            </span>
          </div>
        </div>

        <JobList 
          jobs={jobs}
          emptyMessage={`No ${currentCategory.name.toLowerCase()} jobs found. Check back soon for new opportunities!`}
        />
      </div>
    </div>
  )
}