'use client'

import { useState, FormEvent } from 'react'
import { Search, X, Filter, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface JobSearchProps {
  onSearch: (query: string) => void
  initialQuery?: string
  placeholder?: string
}

export function JobSearch({ 
  onSearch, 
  initialQuery = '',
  placeholder = "Search by job title, company, or keyword..."
}: JobSearchProps) {
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar - Modern Style */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-base border-2 focus:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button 
          type="submit"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 h-14 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl"
        >
          <Search className="mr-2 h-5 w-5" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>

      {/* Quick Filter Suggestions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600 font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          Popular:
        </span>
        {['Developer', 'Designer', 'Marketing', 'Support', 'Sales'].map((term) => (
          <button
            key={term}
            onClick={() => {
              setQuery(term)
              onSearch(term)
            }}
            className="text-sm px-3 py-1.5 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}