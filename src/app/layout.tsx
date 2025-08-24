import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'UAE Home Services - Professional Services at Your Doorstep',
    template: '%s | UAE Home Services'
  },
  description: 'Connect with trusted home service providers across the UAE. Book cleaning, maintenance, repairs and more with verified professionals in Dubai, Abu Dhabi, Sharjah and all Emirates.',
  keywords: [
    'UAE home services',
    'Dubai cleaning services', 
    'Abu Dhabi maintenance',
    'home repairs UAE',
    'professional services',
    'trusted providers',
    'Emirates services'
  ],
  authors: [{ name: 'UAE Home Services Team' }],
  creator: 'UAE Home Services',
  publisher: 'UAE Home Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://uae-homeservices.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ar-AE': '/ar',
    },
  },
  openGraph: {
    title: 'UAE Home Services - Professional Services at Your Doorstep',
    description: 'Connect with trusted home service providers across the UAE',
    url: 'https://uae-homeservices.vercel.app',
    siteName: 'UAE Home Services',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UAE Home Services - Professional home services across the Emirates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAE Home Services - Professional Services at Your Doorstep',
    description: 'Connect with trusted home service providers across the UAE',
    creator: '@uae_homeservices',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={cn(
        inter.className, 
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}