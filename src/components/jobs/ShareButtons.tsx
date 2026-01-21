'use client'

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'

interface ShareButtonsProps {
  jobTitle: string
  jobCompany: string
}

export function ShareButtons({ jobTitle, jobCompany }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  // Only get URL on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareText = encodeURIComponent(`${jobTitle} at ${jobCompany}`)
  const shareUrl = encodeURIComponent(currentUrl)

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1"
        onClick={handleCopyLink}
        disabled={!currentUrl}
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
          href={currentUrl ? `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </a>
      </Button>
    </div>
  )
}