'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Info,
  ChevronRight
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: {
    from: number
    to?: number
    currency: string
  }
  duration: string
  images: string[]
  popular?: boolean
}

interface ProviderServicesProps {
  services: Service[]
  providerId: string
}

export function ProviderServices({ services, providerId }: ProviderServicesProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const formatPrice = (price: Service['price']) => {
    const { from, to, currency } = price
    if (to && to !== from) {
      return `${currency} ${from} - ${to}`
    }
    return `From ${currency} ${from}`
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              No services available at the moment
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Services Offered ({services.length})</span>
          <Badge variant="secondary" className="text-xs">
            All services insured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service, index) => (
          <div 
            key={service.id}
            className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedService === service.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
            onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
          >
            <div className="flex items-start gap-4">
              {/* Service Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {service.images[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">
                    🛠️
                  </div>
                )}
                
                {/* Popular Badge */}
                {service.popular && (
                  <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs">
                    <TrendingUp className="h-2 w-2 mr-1" />
                    Hot
                  </Badge>
                )}
              </div>

              {/* Service Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                      {service.name}
                      {service.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Most Popular
                        </Badge>
                      )}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration}</span>
                      </div>
                      {index === 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.9 (12 reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="text-right space-y-2 flex-shrink-0">
                    <div className="text-lg font-bold">
                      {formatPrice(service.price)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Show service details modal
                        }}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      
                      <Link href={`?booking=true&service=${service.id}`}>
                        <Button 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedService === service.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">What's included:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Complete {service.name.toLowerCase()}</li>
                        <li>• Professional equipment and supplies</li>
                        <li>• Quality guarantee</li>
                        <li>• Post-service cleanup</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Service process:</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">1. Assessment</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">2. Service</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">3. Quality Check</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        ✅ Satisfaction guaranteed or money back
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Same day available
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Eco-friendly
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expansion Indicator */}
            <div className="absolute bottom-2 right-2">
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                selectedService === service.id ? 'rotate-90' : ''
              }`} />
            </div>
          </div>
        ))}

        {/* Add-on Services */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Popular add-ons:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Inside oven cleaning", price: "AED 50" },
              { name: "Inside fridge cleaning", price: "AED 30" },
              { name: "Balcony cleaning", price: "AED 40" }
            ].map((addon, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <span>{addon.name}</span>
                <span className="font-medium">+{addon.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Area Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Info className="h-4 w-4" />
            <span className="font-medium">Service Area Information</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Free service within 10km. Additional AED 20 travel fee for locations beyond 10km.
            Emergency services available 24/7 with surcharge.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}