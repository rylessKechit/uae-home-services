/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  // Enable compression
  compress: true,
  // Enable powered by header removal for security
  poweredByHeader: false,
  // Generate robots.txt and sitemap
  async generateBuildId() {
    return 'uae-home-services-v1.0.0'
  }
}

export default nextConfig