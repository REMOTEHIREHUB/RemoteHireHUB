'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, DollarSign, Briefcase, Award, MapPin } from 'lucide-react'

export interface FilterState {
  jobTypes: string[]
  experienceLevels: string[]
  locationRestrictions: string[]
  salaryMin: number
  salaryMax: number
}

interface JobFiltersProps {
  onFilterChange: (filters: FilterState) => void
  activeFiltersCount?: number
}

export function JobFilters({ onFilterChange, activeFiltersCount = 0 }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experienceLevels: [],
    locationRestrictions: [],
    salaryMin: 0,
    salaryMax: 200000
  })

  const updateFilters = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleFilter = (
    key: 'jobTypes' | 'experienceLevels' | 'locationRestrictions', 
    value: string
  ) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilters(key, updated)
  }

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      jobTypes: [],
      experienceLevels: [],
      locationRestrictions: [],
      salaryMin: 0,
      salaryMax: 200000
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = activeFiltersCount > 0

  return (
    <div className="space-y-6">
      {/* Clear Filters Button - Modern Style */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          onClick={clearAllFilters}
          className="w-full border-2 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}

      {/* Job Type - Matching Header Style */}
      <Card className="border-2 hover:border-blue-200 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
            Job Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
            <div key={type} className="flex items-center space-x-2 group">
              <Checkbox
                id={`type-${type}`}
                checked={filters.jobTypes.includes(type)}
                onCheckedChange={() => toggleFilter('jobTypes', type)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label 
                htmlFor={`type-${type}`} 
                className="cursor-pointer text-sm font-normal group-hover:text-blue-600 transition-colors"
              >
                {type}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience Level - Matching Header Style */}
      <Card className="border-2 hover:border-blue-200 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <Award className="h-4 w-4 mr-2 text-blue-600" />
            Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Entry', 'Mid', 'Senior', 'Lead'].map((level) => (
            <div key={level} className="flex items-center space-x-2 group">
              <Checkbox
                id={`level-${level}`}
                checked={filters.experienceLevels.includes(level)}
                onCheckedChange={() => toggleFilter('experienceLevels', level)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label 
                htmlFor={`level-${level}`} 
                className="cursor-pointer text-sm font-normal group-hover:text-blue-600 transition-colors"
              >
                {level}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location Flexibility - Matching Header Style */}
      <Card className="border-2 hover:border-blue-200 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            Location Flexibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: 'Worldwide', label: '🌍 Worldwide' },
            { value: 'US Only', label: '🇺🇸 US Only' },
            { value: 'Europe', label: '🇪🇺 Europe' },
            { value: 'Americas', label: '🌎 Americas' },
            { value: 'APAC', label: '🌏 APAC' }
          ].map((loc) => (
            <div key={loc.value} className="flex items-center space-x-2 group">
              <Checkbox
                id={`loc-${loc.value}`}
                checked={filters.locationRestrictions.includes(loc.value)}
                onCheckedChange={() => toggleFilter('locationRestrictions', loc.value)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label 
                htmlFor={`loc-${loc.value}`} 
                className="cursor-pointer text-sm font-normal group-hover:text-blue-600 transition-colors"
              >
                {loc.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Salary Range - Modern Design */}
      <Card className="border-2 hover:border-blue-200 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
            Salary Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Minimum Salary */}
            <div>
              <Label htmlFor="salary-min" className="text-sm font-medium mb-2 block">
                Minimum: <span className="text-blue-600 font-bold">${filters.salaryMin.toLocaleString()}</span>
              </Label>
              <input
                id="salary-min"
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={filters.salaryMin}
                onChange={(e) => updateFilters('salaryMin', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(filters.salaryMin / 200000) * 100}%, #e5e7eb ${(filters.salaryMin / 200000) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* Maximum Salary */}
            <div>
              <Label htmlFor="salary-max" className="text-sm font-medium mb-2 block">
                Maximum: <span className="text-blue-600 font-bold">${filters.salaryMax.toLocaleString()}{filters.salaryMax >= 200000 ? '+' : ''}</span>
              </Label>
              <input
                id="salary-max"
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={filters.salaryMax}
                onChange={(e) => updateFilters('salaryMax', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(filters.salaryMax / 200000) * 100}%, #e5e7eb ${(filters.salaryMax / 200000) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* Range Display */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-center text-blue-800 font-medium">
                ${filters.salaryMin.toLocaleString()} - ${filters.salaryMax.toLocaleString()}{filters.salaryMax >= 200000 ? '+' : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}