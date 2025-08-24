'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Clock,
  MapPin,
  Star,
  MoreHorizontal,
  Calendar,
  Phone,
  MessageCircle
} from 'lucide-react'

// Mock data - will be replaced with real API call
const recentBookings = [
  {
    id: "1",
    service: "Deep House Cleaning",
    provider: {
      name: "Sarah Ahmed",
      image: "https://images.unsplash.com/photo-1494790108755-2616b68a70cd?w=150",
      rating: 4.9,
      verified: true
    },
    date: "Today",
    time: "2:00 PM - 4:00 PM",
    status: "confirmed",
    location: "Downtown Dubai",
    price: 280,
    urgent: false
  },
  {
    id: "2", 
    service: "AC Maintenance",
    provider: {
      name: "Mohammed Ali",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 4.8,
      verified: true
    },
    date: "Tomorrow",
    time: "10:00 AM - 12:00 PM", 
    status: "pending",
    location: "Marina",
    price: 150,
    urgent: true
  },
  {
    id: "3",
    service: "Plumbing Repair",
    provider: {
      name: "Ahmed Hassan",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      rating: 4.7,
      verified: true
    },
    date: "Dec 28",
    time: "9:00 AM - 11:00 AM",
    status: "completed",
    location: "Jumeirah",
    price: 200,
    urgent: false
  }
]

const statusColors = {
  confirmed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200"
}

export function RecentBookings() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
        <Link href="/client/bookings">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBookings.map((booking, index) => (
          <div 
            key={booking.id}
            className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
          >
            {/* Provider Avatar */}
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.provider.image} alt={booking.provider.name} />
              <AvatarFallback>
                {booking.provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Booking Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                    {booking.service}
                    {booking.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{booking.provider.name}</span>
                    {booking.provider.verified && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{booking.provider.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{booking.date} • {booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Price */}
                <div className="text-right space-y-2">
                  <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <div className="text-sm font-medium">
                    AED {booking.price}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {booking.status === 'confirmed' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {booking.status === 'completed' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Button size="sm" variant="outline">
                    <Star className="h-3 w-3 mr-1" />
                    Rate Service
                  </Button>
                  <Button size="sm" variant="outline">
                    Book Again
                  </Button>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Awaiting provider confirmation</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {recentBookings.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No bookings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Book your first home service to get started
            </p>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Find Services
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}