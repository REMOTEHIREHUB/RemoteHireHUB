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
import type { Job } from '@/types/job'

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
      title: `${job.title} at ${job.company} - Remote Job | RemoteHubHire`,
      description: job.meta_description || `${job.title} position at ${job.company}. ${job.location}. ${salary} ${job.job_type}. Apply now on RemoteHubHire.`,
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
      title: 'Job Not Found - RemoteHubHire',
    }
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params

  // Fetch both in parallel for maximum performance
  const [jobResult, allJobsResult] = await Promise.allSettled([
    getJobBySlug(slug),
    getJobs({ limit: 10 }),
  ])

  if (jobResult.status === 'rejected') {
    notFound()
  }

  const job = (jobResult as PromiseFulfilledResult<Job>).value
  const allJobs = allJobsResult.status === 'fulfilled' ? allJobsResult.value : []

  const similarJobs = allJobs
    .filter(j => j.id !== job.id)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white">
      {/* Main container — pb-28 on mobile to clear the sticky apply bar */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 pb-28 lg:pb-8">

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

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 min-w-0">
            <JobDetail job={job} />

            {/* ── Mobile-only: Share + Similar Jobs ── */}
            <div className="lg:hidden mt-5 space-y-5">

              {/* Share compact */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">Share This Job</p>
                <ShareButtons jobTitle={job.title} jobCompany={job.company} />
              </div>

              {/* Similar Jobs — horizontal scroll cards */}
              {similarJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <p className="text-sm font-bold text-gray-900">Similar Remote Jobs</p>
                  </div>
                  <div className="-mx-4 px-4 overflow-x-auto">
                    <div className="flex gap-3 pb-2 w-max">
                      {similarJobs.map((sj) => (
                        <Link key={sj.id} href={`/remote-job/${sj.slug}`} className="flex-shrink-0 w-52 block group">
                          <div className="bg-white border border-gray-200 rounded-xl p-3.5 hover:border-blue-400 transition-all">
                            <p className="text-[11px] font-semibold text-gray-400 mb-1 truncate">{sj.company}</p>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2.5 leading-snug">{sj.title}</h4>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-[10px] rounded-full px-2">{sj.job_type}</Badge>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {formatDistanceToNow(new Date(sj.posted_date), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/remote-jobs" className="block text-center text-sm text-blue-600 font-semibold mt-3 hover:underline">
                    View All Jobs →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-5">

              {/* Job Source Info */}
              <Card className="border-2 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                    Job Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Platform</p>
                      <p className="text-sm font-bold text-blue-700">{job.source_platform}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Posted</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl"
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

              {/* Share Job */}
              <Card className="border-2 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Share This Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShareButtons jobTitle={job.title} jobCompany={job.company} />
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card className="border-2 shadow-sm">
                  <CardHeader className="pb-3">
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
                          <div className="p-3 border-2 rounded-xl hover:border-blue-400 hover:shadow-md hover:bg-blue-50/30 transition-all duration-200">
                            <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {similarJob.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 font-medium">{similarJob.company}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs rounded-full">
                                {similarJob.job_type}
                              </Badge>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(similarJob.posted_date), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full border-2 hover:border-blue-600 hover:text-blue-600 rounded-xl"
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
              <Card className="border-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">🔔</div>
                  <h4 className="font-bold mb-2 text-gray-900">Get Job Alerts</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Never miss similar opportunities. Get notified about new remote jobs.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    Set Up Alerts
                  </Button>
                </CardContent>
              </Card>

            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile Sticky Apply Button ── */}
      {/* Only visible on screens smaller than lg breakpoint */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50">
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.10)] px-4 py-3">
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shimmer flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-[15px] shadow-lg active:scale-95 transition-transform duration-150"
          >
            <span>Apply Now</span>
            <span className="text-blue-200 mx-0.5">·</span>
            <span className="text-blue-100 font-medium text-sm">{job.source_platform}</span>
            <ExternalLink className="h-4 w-4 ml-1 opacity-75" />
          </a>
        </div>
      </div>
    </div>
  )
}
