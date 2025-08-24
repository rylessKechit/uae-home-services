'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star,
  Clock,
  TrendingUp,
  Zap,
  Sparkles
} from 'lucide-react'

// Mock data - will be replaced with real API call
const recommendedServices = [
  {
    id: "1",
    name: "Deep House Cleaning",
    category: "Cleaning",
    icon: "🧹",
    price: {
      from: 150,
      to: 300,
      currency: "AED"
    },
    rating: 4.8,
    reviewCount: 234,
    providers: 45,
    duration: "2-4 hours",
    popular: true,
    discount: 15,
    description: "Professional deep cleaning for your entire home"
  },
  {
    id: "2", 
    name: "AC Maintenance",
    category: "HVAC",
    icon: "❄️",
    price: {
      from: 120,
      to: 250,
      currency: "AED"
    },
    rating: 4.9,
    reviewCount: 189,
    providers: 32,
    duration: "1-2 hours",
    trending: true,
    description: "Keep your AC running efficiently year-round"
  },
  {
    id: "3",
    name: "Plumbing Repair",
    category: "Maintenance",
    icon: "🔧",
    price: {
      from: 100,
      to: 400,
      currency: "AED"
    },
    rating: 4.7,
    reviewCount: 156,
    providers: 28,
    duration: "1-3 hours",
    emergency: true,
    description: "Quick fixes for leaks, clogs, and more"
  },
  {
    id: "4",
    name: "Home Painting",
    category: "Renovation",
    icon: "🎨",
    price: {
      from: 300,
      to: 800,
      currency: "AED"
    },
    rating: 4.6,
    reviewCount: 98,
    providers: 18,
    duration: "4-8 hours",
    premium: true,
    description: "Transform your space with professional painting"
  }
]

const reasons = [
  "Based on your location",
  "Popular in Dubai",
  "Highly rated providers",
  "Recently booked by others"
]

export function RecommendedServices() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-600" />
          Recommended for You
        </CardTitle>
        <Link href="/client/search">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedServices.map((service, index) => (
          <div 
            key={service.id}
            className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            {/* Service Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                {service.icon}
              </div>
            </div>

            {/* Service Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
                    {service.name}
                    
                    {service.popular && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    
                    {service.trending && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    
                    {service.emergency && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <Zap className="h-3 w-3 mr-1" />
                        24/7
                      </Badge>
                    )}
                    
                    {service.premium && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        ✨ Premium
                      </Badge>
                    )}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                      <span>({service.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration}</span>
                    </div>
                    <div>
                      <span>{service.providers} providers</span>
                    </div>
                  </div>
                </div>

                {/* Price & Discount */}
                <div className="text-right space-y-1">
                  {service.discount && (
                    <Badge variant="destructive" className="text-xs">
                      -{service.discount}%
                    </Badge>
                  )}
                  <div className="text-sm font-medium">
                    From {service.price.currency} {service.price.from}
                  </div>
                  {service.discount && (
                    <div className="text-xs text-muted-foreground line-through">
                      {service.price.currency} {Math.round(service.price.from * (1 + service.discount / 100))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  {reasons[index]}
                </div>
                <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Browse More */}
        <div className="text-center pt-4 border-t">
          <Link href="/client/search">
            <Button variant="outline" className="w-full">
              Browse All Services
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}