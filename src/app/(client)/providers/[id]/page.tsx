import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProviderProfile } from '@/components/client/ProviderProfile'
import { ProviderServices } from '@/components/client/ProviderServices'
import { ProviderReviews } from '@/components/client/ProviderReviews'
import { BookingModal } from '@/components/client/BookingModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ProviderPageProps {
  params: {
    id: string
  }
  searchParams: {
    service?: string
    booking?: string
  }
}

// Mock provider data - will be replaced with real API call
const mockProvider = {
  id: "p1",
  name: "Sarah Ahmed",
  image: "https://images.unsplash.com/photo-1494790108755-2616b68a70cd?w=400",
  coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  rating: 4.9,
  reviewCount: 234,
  completedJobs: 187,
  verified: true,
  responseTime: "< 1 hour",
  memberSince: "2020",
  description: "Professional cleaning specialist with 8+ years of experience. I provide premium house cleaning services using eco-friendly products. Your satisfaction is my priority!",
  location: {
    area: "Downtown Dubai",
    serviceRadius: 15
  },
  contact: {
    phone: "+971 50 123 4567",
    whatsapp: "+971 50 123 4567",
    email: "sarah.ahmed@example.com"
  },
  languages: ["English", "Arabic"],
  specialties: ["Deep Cleaning", "Eco-friendly Products", "Same Day Service"],
  certifications: ["Licensed Cleaner", "Insured", "Background Checked"],
  workingHours: {
    monday: { start: "08:00", end: "18:00" },
    tuesday: { start: "08:00", end: "18:00" },
    wednesday: { start: "08:00", end: "18:00" },
    thursday: { start: "08:00", end: "18:00" },
    friday: { start: "08:00", end: "16:00" },
    saturday: { start: "09:00", end: "17:00" },
    sunday: { start: "closed", end: "closed" }
  },
  services: [
    {
      id: "s1",
      name: "Premium House Cleaning",
      description: "Deep cleaning service for your entire home",
      price: { from: 180, to: 350, currency: "AED" },
      duration: "3-5 hours",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
      popular: true
    },
    {
      id: "s2", 
      name: "Office Cleaning",
      description: "Professional office cleaning services",
      price: { from: 150, to: 280, currency: "AED" },
      duration: "2-4 hours",
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"]
    }
  ],
  reviews: [
    {
      id: "r1",
      client: {
        name: "Ahmed Al-Rashid",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      rating: 5,
      comment: "Excellent service! Sarah was very professional and thorough. My house has never been cleaner!",
      date: "2024-01-15",
      service: "Premium House Cleaning",
      images: []
    }
  ],
  stats: {
    totalBookings: 187,
    repeatCustomers: 89,
    onTimeRate: 98,
    responseRate: 100
  }
}

async function getProvider(id: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (id === mockProvider.id) {
    return mockProvider
  }
  return null
}

export default async function ProviderPage({ params, searchParams }: ProviderPageProps) {
  const provider = await getProvider(params.id)

  if (!provider) {
    notFound()
  }

  const showBookingModal = searchParams.booking === 'true'
  const selectedServiceId = searchParams.service

  return (
    <div className="space-y-6">
      {/* Provider Profile */}
      <Suspense fallback={<ProfileLoading />}>
        <ProviderProfile provider={provider} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Services */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ServicesLoading />}>
            <ProviderServices 
              services={provider.services}
              providerId={provider.id}
            />
          </Suspense>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-1">
          <Suspense fallback={<ReviewsLoading />}>
            <ProviderReviews 
              reviews={provider.reviews}
              rating={provider.rating}
              reviewCount={provider.reviewCount}
            />
          </Suspense>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          provider={provider}
          serviceId={selectedServiceId}
          onClose={() => {
            // Remove booking param from URL
            const url = new URL(window.location.href)
            url.searchParams.delete('booking')
            url.searchParams.delete('service')
            window.history.pushState({}, '', url.toString())
          }}
        />
      )}
    </div>
  )
}

// Loading components
function ProfileLoading() {
  return (
    <Card>
      <div className="relative h-48 bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ServicesLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ReviewsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}