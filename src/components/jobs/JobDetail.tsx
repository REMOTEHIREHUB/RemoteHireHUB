import type { ComponentType } from 'react'
import {
  MapPin, Clock, DollarSign, Building2, Globe,
  Calendar, ExternalLink, Briefcase, Award, CheckCircle,
  Zap, Shield, Heart, Home, Plane, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Job } from '@/types/job'
import { formatDistanceToNow } from 'date-fns'

interface JobDetailProps {
  job: Job
}

function decodeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

export function JobDetail({ job }: JobDetailProps) {
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null
    const min = job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k` : ''
    const max = job.salary_max ? `$${(job.salary_max / 1000).toFixed(0)}k` : ''
    if (min && max) return `${min} – ${max}`
    if (min) return `From ${min}`
    if (max) return `Up to ${max}`
  }

  // Derive company initial for avatar
  const companyInitial = job.company?.charAt(0)?.toUpperCase() ?? '?'

  const infoItems = [
    { icon: MapPin,   label: 'Location',   value: job.location,            bg: 'bg-blue-50',   iconColor: 'text-blue-600',   iconBg: 'bg-blue-100' },
    formatSalary() ? { icon: DollarSign, label: 'Salary', value: `${formatSalary()} / yr`, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' } : null,
    { icon: Briefcase, label: 'Job Type',  value: job.job_type,            bg: 'bg-purple-50', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
    { icon: Calendar,  label: 'Posted',    value: formatDistanceToNow(new Date(job.posted_date), { addSuffix: true }), bg: 'bg-orange-50', iconColor: 'text-orange-500', iconBg: 'bg-orange-100' },
    job.experience_level ? { icon: Award,  label: 'Experience', value: job.experience_level,   bg: 'bg-indigo-50', iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' } : null,
    job.timezone_requirement ? { icon: Globe, label: 'Timezone', value: job.timezone_requirement, bg: 'bg-cyan-50', iconColor: 'text-cyan-600', iconBg: 'bg-cyan-100' } : null,
  ].filter(Boolean) as {
    icon: ComponentType<{ className?: string }>; label: string; value: string;
    bg: string; iconColor: string; iconBg: string
  }[]

  return (
    <div className="space-y-5">

      {/* ── Hero Header Card ── */}
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* Colorful top accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <CardContent className="p-5 sm:p-7 space-y-5">

          {/* Company avatar + badges + title */}
          <div className="flex items-start gap-4">
            {/* Company initial avatar */}
            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-2xl sm:text-3xl leading-none select-none">
                {companyInitial}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Remote + featured badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  🌍 100% Remote
                </Badge>
                {job.is_featured && (
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              {/* Job title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 mb-1.5">
                <span className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  {job.title}
                </span>
              </h1>

              {/* Company name */}
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-base text-gray-800">{job.company}</span>
              </div>
            </div>
          </div>

          {/* Quick-scan info chips — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:-mx-7 sm:px-7 scrollbar-hide">
            {[
              { label: job.location,           icon: '📍' },
              formatSalary() ? { label: formatSalary()!, icon: '💰' } : null,
              { label: job.job_type,            icon: '💼' },
              job.experience_level ? { label: job.experience_level, icon: '🏆' } : null,
              job.location_restriction ? { label: job.location_restriction, icon: '🗺️' } : null,
            ].filter(Boolean).map((chip, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 whitespace-nowrap"
              >
                <span className="text-xs">{chip!.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{chip!.label}</span>
              </div>
            ))}
          </div>

          {/* Info cards grid — 2 columns on mobile, 3 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {infoItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl ${item.bg} transition-colors`}
              >
                <div className={`p-2 ${item.iconBg} rounded-lg flex-shrink-0`}>
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-bold text-gray-900 leading-tight truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags row — scrollable on mobile */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            <Badge variant="secondary" className="rounded-full font-semibold">{job.job_type}</Badge>
            {job.experience_level && (
              <Badge variant="outline" className="rounded-full font-semibold">{job.experience_level}</Badge>
            )}
            {job.location_restriction && (
              <Badge variant="outline" className="rounded-full font-semibold">📍 {job.location_restriction}</Badge>
            )}
          </div>

          {/* Apply CTA — full width on mobile */}
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 rounded-xl shimmer"
            asChild
          >
            <a href={job.source_url} target="_blank" rel="noopener noreferrer">
              Apply on {job.source_platform}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* ── Job Description ── */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-1 bg-blue-500" />
        <CardHeader className="pb-2 pt-5 px-5 sm:px-7">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <span className="border-l-4 border-blue-500 pl-3">About the Role</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 sm:px-7 pb-6">
          <div
            className="prose prose-sm sm:prose-base max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-li:text-gray-700 prose-li:leading-relaxed
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-ul:space-y-1 prose-ol:space-y-1"
            dangerouslySetInnerHTML={{ __html: decodeHtml(job.description) }}
          />
        </CardContent>
      </Card>

      {/* ── Requirements ── */}
      {job.requirements && (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <CardHeader className="pb-2 pt-5 px-5 sm:px-7">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="border-l-4 border-emerald-500 pl-3">Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 sm:px-7 pb-6">
            <div
              className="prose prose-sm sm:prose-base max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-li:text-gray-700 prose-li:leading-relaxed
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:space-y-1 prose-ol:space-y-1"
              dangerouslySetInnerHTML={{ __html: decodeHtml(job.requirements) }}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Responsibilities ── */}
      {job.responsibilities && (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-1 bg-purple-500" />
          <CardHeader className="pb-2 pt-5 px-5 sm:px-7">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <span className="border-l-4 border-purple-500 pl-3">Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 sm:px-7 pb-6">
            <div
              className="prose prose-sm sm:prose-base max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-li:text-gray-700 prose-li:leading-relaxed
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:space-y-1 prose-ol:space-y-1"
              dangerouslySetInnerHTML={{ __html: decodeHtml(job.responsibilities) }}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Benefits & Perks ── */}
      {(job.benefits || job.has_health_insurance || job.has_401k || job.home_office_stipend || job.offers_visa_sponsorship) && (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <CardHeader className="pb-2 pt-5 px-5 sm:px-7">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Heart className="h-5 w-5 text-amber-600" />
              </div>
              <span className="border-l-4 border-amber-400 pl-3">Benefits & Perks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 sm:px-7 pb-6 space-y-5">
            {/* Benefit perk pills */}
            {(job.has_health_insurance || job.has_401k || job.home_office_stipend || job.offers_visa_sponsorship) && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {job.has_health_insurance && (
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 text-center">
                    <Shield className="h-6 w-6 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800 leading-tight">Health Insurance</span>
                  </div>
                )}
                {job.has_401k && (
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <span className="text-xs font-bold text-blue-800 leading-tight">401k / Pension</span>
                  </div>
                )}
                {job.offers_visa_sponsorship && (
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 text-center">
                    <Plane className="h-6 w-6 text-purple-600" />
                    <span className="text-xs font-bold text-purple-800 leading-tight">Visa Sponsorship</span>
                  </div>
                )}
                {job.home_office_stipend && (
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 text-center">
                    <Home className="h-6 w-6 text-orange-600" />
                    <span className="text-xs font-bold text-orange-800 leading-tight">Home Office Stipend</span>
                  </div>
                )}
              </div>
            )}

            {/* Benefits prose */}
            {job.benefits && (
              <div
                className="prose prose-sm sm:prose-base max-w-none
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-li:text-gray-700 prose-li:leading-relaxed
                  prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: decodeHtml(job.benefits) }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Location Details ── */}
      {job.location_restriction && (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-1 bg-cyan-500" />
          <CardHeader className="pb-2 pt-5 px-5 sm:px-7">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <MapPin className="h-5 w-5 text-cyan-600" />
              </div>
              <span className="border-l-4 border-cyan-500 pl-3">Location Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 sm:px-7 pb-6">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                <p className="text-xs text-cyan-600 font-semibold uppercase tracking-wide mb-1">Geographic Restriction</p>
                <p className="text-sm font-bold text-gray-800">{job.location_restriction}</p>
              </div>
              {job.timezone_requirement && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Timezone Requirement</p>
                  <p className="text-sm font-bold text-gray-800">{job.timezone_requirement}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Bottom Apply CTA ── */}
      <Card className="border-0 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-1">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">
                Posted {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Apply?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              This position is listed on <strong className="text-white">{job.source_platform}</strong>.
              Click below to view the full application and apply directly.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 px-8 py-3 rounded-xl text-base"
              asChild
            >
              <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                Apply Now on {job.source_platform}
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

    </div>
  )
}
