'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function HomeSearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/remote-jobs?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/remote-jobs')
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0">
      <Input
        placeholder="Job title, keyword, or company..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="h-12 sm:h-14 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 bg-white shadow-lg"
      />
      <Button
        size="lg"
        onClick={handleSearch}
        className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg text-sm sm:text-base"
      >
        <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Search Jobs
      </Button>
    </div>
  )
}
