import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RemoteHireHub - Find Remote Jobs Worldwide',
  description: 'Discover remote job opportunities from top companies. Software, marketing, design, customer support & more. Work from anywhere.',
  keywords: ['remote jobs', 'work from home', 'remote work', 'online jobs', 'telecommute', 'remote careers'],
  
  // Open Graph / Social Media
  openGraph: {
    title: 'RemoteHireHub - Find Remote Jobs Worldwide',
    description: 'Discover remote job opportunities from top companies worldwide.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RemoteHireHub',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'RemoteHireHub - Find Remote Jobs Worldwide',
    description: 'Discover remote job opportunities from top companies worldwide.',
  },
  
  // Favicon and Icons
  icons: {
    icon: [
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/images/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/images/android-chrome-512x512.png',
      },
    ],
  },
  
  // Additional metadata
  manifest: '/manifest.json',
  // themeColor moved to viewport.ts (Next.js 14+ requirement)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags if needed */}
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}