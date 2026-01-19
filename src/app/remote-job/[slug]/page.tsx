import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ExternalLink, Briefcase, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JobDetail } from '@/components/jobs/JobDetail'
import { ShareButtons } from '@/components/jobs/ShareButtons'
import { getJobBySlug, getJobs } from '@/lib/supabase/queries'
import type { Metadata } from 'next'
import { formatDistanceToNow } from 'date-fns'

interface JobPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const job = await getJobBySlug(slug)
    
    const salary = job.salary_min && job.salary_max 
      ? `$${(job.salary_min/1000).toFixed(0)}k-$${(job.salary_max/1000).toFixed(0)}k` 
      : ''
    
    return {
      title: `${job.title} at ${job.company} - Remote Job | RemoteHireHub`,
      description: job.meta_description || `${job.title} position at ${job.company}. ${job.location}. ${salary} ${job.job_type}. Apply now on RemoteHireHub.`,
      keywords: [
        'remote job',
        job.title,
        job.company,
        job.job_type,
        job.location,
        job.experience_level || '',
        'work from home',
        'remote work'
      ].filter(Boolean),
      openGraph: {
        title: `${job.title} at ${job.company}`,
        description: job.description.substring(0, 160).replace(/<[^>]*>/g, ''),
        type: 'website',
      },
    }
  } catch {
    return {
      title: 'Job Not Found - RemoteHireHub',
    }
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params
  
  let job
  try {
    job = await getJobBySlug(slug)
  } catch {
    notFound()
  }

  // Get similar jobs (same category or company, excluding current job)
  const allJobs = await getJobs({ limit: 20 })
  const similarJobs = allJobs
    .filter(j => j.id !== job.id)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-6 border-2 hover:border-blue-600 hover:text-blue-600 transition-all duration-300" 
          asChild
        >
          <Link href="/remote-jobs">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <JobDetail job={job} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Job Source Info */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                    Job Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-700 mb-1">
                        <strong className="text-blue-900">Platform:</strong>
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        {job.source_platform}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Posted:</strong>
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      asChild
                    >
                      <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                        View Original Posting
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share Job - Using Client Component */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base">Share This Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShareButtons jobTitle={job.title} jobCompany={job.company} />
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                      Similar Remote Jobs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {similarJobs.map((similarJob) => (
                        <Link
                          key={similarJob.id}
                          href={`/remote-job/${similarJob.slug}`}
                          className="block group"
                        >
                          <div className="p-3 border-2 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-300">
                            <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {similarJob.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">{similarJob.company}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {similarJob.job_type}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(new Date(similarJob.posted_date), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-2 hover:border-blue-600 hover:text-blue-600"
                        asChild
                      >
                        <Link href="/remote-jobs">
                          View All Jobs →
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Job Alert CTA */}
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">🔔</div>
                  <h4 className="font-bold mb-2">Get Job Alerts</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Never miss similar opportunities. Get notified about new remote jobs.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Set Up Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}