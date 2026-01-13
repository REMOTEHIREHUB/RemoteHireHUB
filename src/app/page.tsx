import Link from 'next/link'
import { Search, TrendingUp, Globe, Zap, ArrowRight, Sparkles, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { JobList } from '@/components/jobs/JobList'
import { getJobs, getCategories } from '@/lib/supabase/queries'
import type { Category } from '@/types/category'

export default async function HomePage() {
  // Fetch latest jobs and categories
  const [latestJobs, categories] = await Promise.all([
    getJobs({ limit: 6 }),
    getCategories()
  ])

  return (
    <div>
      {/* Hero Section - Modern Gradient */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>500+ Remote Jobs Added Daily</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Find Your Dream Remote Job
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Discover remote opportunities from <span className="font-semibold text-gray-800">100+ companies worldwide</span>. Work from anywhere. 🌍
            </p>
            
            {/* Search Bar - More Prominent */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-16 shadow-xl">
              <Input 
                placeholder="Job title, keyword, or company..." 
                className="h-14 text-base flex-1 border-2 border-gray-200 focus:border-blue-500 bg-white"
              />
              <Button size="lg" asChild className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg">
                <Link href="/remote-jobs">
                  <Search className="mr-2 h-5 w-5" />
                  Search Jobs
                </Link>
              </Button>
            </div>

            {/* Quick Stats - Better Design */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">500+</p>
                <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">New Jobs Daily</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">100%</p>
                <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">Remote Positions</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">10+</p>
                <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">Trusted Sources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories - Modern Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find remote jobs in your field
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/remote-${category.slug}-jobs`}
                className="block group"
              >
                <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center h-full border-2 hover:border-blue-500 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <CardTitle className="text-sm md:text-base leading-tight font-semibold">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs md:text-sm text-blue-600 font-semibold">
                      {category.job_count} jobs
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs - Better Styling */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">Latest Remote Jobs</h2>
              <p className="text-lg text-gray-600">Fresh opportunities updated daily</p>
            </div>
            <Button variant="outline" size="lg" asChild className="border-2 hover:border-blue-600 hover:text-blue-600 font-medium">
              <Link href="/remote-jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <JobList jobs={latestJobs} />
        </div>
      </section>

      {/* Why Choose Us - Modern Design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why RemoteHireHub?
            </h2>
            <p className="text-xl text-gray-600">
              The best platform for finding remote work
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-2 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <Globe className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-3">Global Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base leading-relaxed">
                  Access remote jobs from companies worldwide. No geographic limitations. Work from anywhere you want.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 hover:border-green-500 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-3">Always Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base leading-relaxed">
                  Fresh jobs added daily from 10+ trusted sources. Never miss an opportunity with real-time updates.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-3">Easy & Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base leading-relaxed">
                  No registration required. Advanced filters. Direct application links. Start applying in seconds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>Trusted by thousands of remote workers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Remote Work Revolution
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Thousands of professionals have found their dream remote jobs through RemoteHireHub. You could be next!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg h-14 px-8">
                <Link href="/remote-jobs">
                  Browse All Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 hover:border-blue-600 hover:text-blue-600 font-medium h-14 px-8">
                <Link href="/blog">
                  Read Success Stories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Bold and Modern */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Remote Job?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl mx-auto">
            Join thousands of remote workers who found their dream jobs with us
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            asChild 
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl h-14 px-10 text-lg"
          >
            <Link href="/remote-jobs">
              Start Your Job Search Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}