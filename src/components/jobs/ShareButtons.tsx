'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface ShareButtonsProps {
  jobTitle: string
  jobCompany: string
}

export function ShareButtons({ jobTitle, jobCompany }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareText = encodeURIComponent(`${jobTitle} at ${jobCompany}`)
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1"
        onClick={handleCopyLink}
      >
        {copied ? (
          <>
            <Check className="mr-1 h-3 w-3" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-1 h-3 w-3" />
            Copy Link
          </>
        )}
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1"
        asChild
      >
        <a 
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </a>
      </Button>
    </div>
  )
}