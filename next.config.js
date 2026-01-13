/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Supabase storage and other sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'ggkbzkxlnnkibthcthri.supabase.co',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression
  compress: true,
  // Remove X-Powered-By header for security
  poweredByHeader: false,
}

module.exports = nextConfig