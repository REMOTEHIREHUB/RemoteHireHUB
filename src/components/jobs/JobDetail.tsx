import { MapPin, Clock, DollarSign, Building2, Globe, Calendar, ExternalLink, Briefcase, Award, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/types/job'
import { formatDistanceToNow, format } from 'date-fns'

interface JobDetailProps {
  job: Job
}

export function JobDetail({ job }: JobDetailProps) {
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null
    
    const min = job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k` : ''
    const max = job.salary_max ? `$${(job.salary_max / 1000).toFixed(0)}k` : ''
    
    if (min && max) return `${min} - ${max}`
    if (min) return `From ${min}`
    if (max) return `Up to ${max}`
  }

  return (
    <div className="space-y-8">
      {/* Header Card - Modern Design */}
      <Card className="border-2 hover:shadow-xl transition-all duration-300">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="mb-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                🌍 Remote
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {job.title}
              </h1>
              <div className="flex items-center text-xl text-gray-700 mb-4">
                <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                <span className="font-semibold">{job.company}</span>
              </div>
            </div>
          </div>

          {/* Key Info Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Location</p>
                <p className="text-sm font-semibold text-gray-900">{job.location}</p>
              </div>
            </div>
            
            {formatSalary() && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Salary</p>
                  <p className="text-sm font-semibold text-gray-900">{formatSalary()} / year</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Job Type</p>
                <p className="text-sm font-semibold text-gray-900">{job.job_type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Posted</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}
                </p>
              </div>
            </div>

            {job.timezone_requirement && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Timezone</p>
                  <p className="text-sm font-semibold text-gray-900">{job.timezone_requirement}</p>
                </div>
              </div>
            )}

            {job.experience_level && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Award className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Experience</p>
                  <p className="text-sm font-semibold text-gray-900">{job.experience_level}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Badge variant="secondary" className="font-medium">{job.job_type}</Badge>
            {job.experience_level && (
              <Badge variant="outline" className="font-medium">{job.experience_level}</Badge>
            )}
            {job.location_restriction && (
              <Badge variant="outline" className="font-medium">📍 {job.location_restriction}</Badge>
            )}
          </div>

          {/* Apply Button */}
          <Button 
            size="lg" 
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95" 
            asChild
          >
            <a href={job.source_url} target="_blank" rel="noopener noreferrer">
              Apply on {job.source_platform}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
      </Card>

      {/* Job Description */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Users className="h-6 w-6 mr-2 text-blue-600" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
          </CardContent>
        </Card>
      )}

      {/* Responsibilities */}
      {job.responsibilities && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
              Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
          </CardContent>
        </Card>
      )}

      {/* Benefits & Perks */}
      {(job.benefits || job.has_health_insurance || job.has_401k || job.home_office_stipend || job.offers_visa_sponsorship) && (
        <Card className="border-2 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              🎁 Benefits & Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {job.benefits && (
              <div className="prose prose-lg max-w-none mb-4">
                <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {job.has_health_insurance && (
                <Badge className="bg-green-600 hover:bg-green-700 text-white">
                  ✓ Health Insurance
                </Badge>
              )}
              {job.has_401k && (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                  ✓ 401k / Pension
                </Badge>
              )}
              {job.offers_visa_sponsorship && (
                <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
                  ✓ Visa Sponsorship
                </Badge>
              )}
              {job.home_office_stipend && (
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white">
                  ✓ Home Office Stipend
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Location */}
      {job.location_restriction && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <MapPin className="h-6 w-6 mr-2 text-blue-600" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-700 mb-2">
                <strong className="text-blue-900">Geographic Restriction:</strong> {job.location_restriction}
              </p>
              {job.timezone_requirement && (
                <p className="text-gray-700">
                  <strong className="text-blue-900">Timezone Requirement:</strong> {job.timezone_requirement}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Apply Button */}
      <Card className="border-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Apply?</h3>
            <p className="text-blue-100">
              This job is hosted on {job.source_platform}. Click below to apply directly.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              asChild
            >
              <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                Apply Now on {job.source_platform}
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}