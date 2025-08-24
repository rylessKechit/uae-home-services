'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Calendar,
  Star,
  User,
  Clock,
  MapPin,
  Zap,
  Repeat
} from 'lucide-react'

const quickActions = [
  {
    title: "Find Services",
    description: "Browse and book new services",
    icon: Search,
    href: "/client/search",
    color: "bg-blue-500",
    popular: true
  },
  {
    title: "My Bookings",
    description: "View upcoming appointments",
    icon: Calendar,
    href: "/client/bookings",
    color: "bg-green-500",
    badge: "3 pending"
  },
  {
    title: "Favorite Providers",
    description: "Quick access to trusted providers",
    icon: Star,
    href: "/client/favorites",
    color: "bg-yellow-500"
  },
  {
    title: "Book Again",
    description: "Repeat your last service",
    icon: Repeat,
    href: "/client/book-again",
    color: "bg-purple-500"
  }
]

const emergencyServices = [
  {
    name: "Emergency Plumber",
    icon: "🔧",
    available: true
  },
  {
    name: "Emergency Electrician", 
    icon: "⚡",
    available: true
  },
  {
    name: "Emergency Locksmith",
    icon: "🔑",
    available: false
  }
]

export function QuickActions() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className={`p-2 rounded-md ${action.color} text-white`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{action.title}</span>
                      {action.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {action.badge && (
                        <Badge variant="outline" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Emergency Services & Location */}
      <div className="space-y-6">
        {/* Emergency Services */}
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyServices.map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-background border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{service.icon}</span>
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <Badge 
                  variant={service.available ? "default" : "secondary"}
                  className="text-xs"
                >
                  {service.available ? "Available 24/7" : "Unavailable"}
                </Badge>
              </div>
            ))}
            
            <Button className="w-full mt-4" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Call Emergency Line
            </Button>
          </CardContent>
        </Card>

        {/* Current Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Service Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Location</span>
                <Badge variant="outline">Dubai, UAE</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                📍 Downtown Dubai, Business Bay area
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Available Providers</span>
                <span className="font-medium text-green-600">847 nearby</span>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Change Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}