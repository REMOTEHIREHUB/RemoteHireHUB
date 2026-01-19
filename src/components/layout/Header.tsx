'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, Bell, User, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo with improved hover effect */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-90 transition-all duration-300 group"
          >
            <div className="relative">
              <Image
                src="/images/icon.png"
                alt="RemoteHireHub"
                width={280}
                height={280}
                priority
                className="h-16 w-auto md:h-20 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden lg:inline">
              RemoteHireHub
            </span>
          </Link>

          {/* Desktop Navigation with Dropdown */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <div className="relative group">
              <Link 
                href="/remote-jobs" 
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] py-2 group"
              >
                Find Jobs
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-3">
                  <Link href="/remote-software-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">Software Dev</Link>
                  <Link href="/remote-design-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">Design</Link>
                  <Link href="/remote-marketing-jobs" className="block px-3 py-2 rounded hover:bg-gray-50">Marketing</Link>
                  <Link href="/remote-jobs" className="block px-3 py-2 rounded hover:bg-gray-50 text-blue-600 font-medium">View All →</Link>
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
              href="/remote-companies" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] hover:underline decoration-2 underline-offset-4"
            >
              Companies
            </Link>
            <Link 
              href="/salary-guide" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 text-[15px] hover:underline decoration-2 underline-offset-4"
            >
              Salary Guide
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language/Region Selector */}
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">Global</span>
            </button>
            
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Search Jobs Button with Modal Trigger */}
            <Button onClick={() => window.location.href = '/'} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
            
            {/* User Profile/Login */}
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </header>
  )
}