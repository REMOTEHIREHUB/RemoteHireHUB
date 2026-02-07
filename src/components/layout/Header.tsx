'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 sm:h-24 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-1 sm:gap-2 hover:opacity-90 transition-all duration-300 group flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <Image
                src="/images/icon.png"
                alt="RemoteHireHub"
                width={320}
                height={320}
                priority
                className="h-16 w-auto sm:h-20 md:h-24 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold hidden sm:inline">
              <span className="text-blue-600">RemoteHire</span>
              <span className="text-green-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link 
              href="/remote-jobs" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] hover:underline decoration-2 underline-offset-4"
            >
              Find Jobs
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] py-2">
                Categories
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-3">
                  <Link href="/software-development-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">💻 Software Dev</Link>
                  <Link href="/design-creative-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">🎨 Design</Link>
                  <Link href="/marketing-growth-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">📊 Marketing</Link>
                  <Link href="/customer-support-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">🎧 Support</Link>
                  <Link href="/writing-content-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">📝 Writing</Link>
                  <Link href="/remote-jobs" className="block px-3 py-2 rounded hover:bg-gray-50 text-blue-600 font-medium mt-2 border-t">View All →</Link>
                </div>
              </div>
            </div>

            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] hover:underline decoration-2 underline-offset-4"
            >
              Blog
            </Link>

            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] hover:underline decoration-2 underline-offset-4"
            >
              Home
            </Link>
          </nav>

          {/* Desktop Search Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Link href="/remote-jobs">
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </Link>
            </Button>
          </div>

          {/* Mobile: Search + Menu Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              size="sm"
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-9 px-3"
            >
              <Link href="/remote-jobs">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/remote-jobs" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔍 Find Jobs
              </Link>

              <Link 
                href="/blog" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                📝 Blog
              </Link>
              
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-semibold text-gray-500 px-3 mb-2">CATEGORIES</p>
                <Link 
                  href="/software-development-jobs" 
                  className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💻 Software Development
                </Link>
                <Link 
                  href="/design-creative-jobs" 
                  className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎨 Design & Creative
                </Link>
                <Link 
                  href="/marketing-growth-jobs" 
                  className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Marketing & Growth
                </Link>
                <Link 
                  href="/customer-support-jobs" 
                  className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🎧 Customer Support
                </Link>
                <Link 
                  href="/writing-content-jobs" 
                  className="text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📝 Writing & Content
                </Link>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏠 Home
                </Link>
              </div>

              <div className="pt-3">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12"
                >
                  <Link href="/remote-jobs" onClick={() => setMobileMenuOpen(false)}>
                    <Search className="mr-2 h-4 w-4" />
                    Search All Jobs
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}