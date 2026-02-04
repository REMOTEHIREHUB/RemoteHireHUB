/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'remoteok.com',
      },
      {
        protocol: 'https',
        hostname: 'remoteok.io',
      },
      {
        protocol: 'https',
        hostname: 'remotive.com',
      },
      {
        protocol: 'https',
        hostname: 'remotive.io',
      },
      {
        protocol: 'https',
        hostname: 'weworkremotely.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      // Allow any CDN (common for company logos)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig