import { Suspense } from 'react'
import { DashboardStats } from '@/components/client/DashboardStats'
import { QuickActions } from '@/components/client/QuickActions'
import { RecentBookings } from '@/components/client/RecentBookings'
import { RecommendedServices } from '@/components/client/RecommendedServices'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your home services today.
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-1">
          <Suspense fallback={<BookingsLoading />}>
            <RecentBookings />
          </Suspense>
        </div>

        {/* Recommended Services */}
        <div className="lg:col-span-1">
          <Suspense fallback={<ServicesLoading />}>
            <RecommendedServices />
          </Suspense>
        </div>
      </div>

      {/* Weather Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🌤️</span>
            Today in Dubai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">28°C</p>
              <p className="text-sm text-muted-foreground">Perfect weather for outdoor services!</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Humidity: 65%</p>
              <p>Wind: 12 km/h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading components
function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BookingsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ServicesLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}