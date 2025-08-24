'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star,
  Clock,
  MapPin,
  Heart,
  Share,
  Zap,
  Shield,
  TrendingUp,
  Calendar,
  Phone,
  MessageCircle
} from 'lucide-react'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    provider: {
      id: string
      name: string
      image: string
      rating: number
      reviewCount: number
      verified: boolean
      responseTime: string
    }
    category: string
    description: string
    images: string[]
    price: {
      from: number
      to?: number
      currency: string
      type: string
    }
    duration: string
    location: string
    distance: number
    availability: string
    features: string[]
    discount?: number
    popular?: boolean
    emergency?: boolean
  }
  viewMode?: 'grid' | 'list'
}

export function ServiceCard({ service, viewMode = 'grid' }: ServiceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatPrice = () => {
    const { from, to, currency } = service.price
    if (to && to !== from) {
      return `${currency} ${from} - ${to}`
    }
    return `From ${currency} ${from}`
  }

  const getAvailabilityColor = () => {
    if (service.availability.includes('now')) return 'bg-green-100 text-green-800'
    if (service.availability.includes('today')) return 'bg-blue-100 text-blue-800' 
    if (service.availability.includes('tomorrow')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Service Image */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              {service.images[0] && (
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  fill
                  className="object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              {!imageLoaded && (
                <div className="flex items-center justify-center h-full text-2xl">
                  🏠
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                    {service.name}
                    {service.popular && (
                      <Badge className="bg-orange-100 text-orange-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {service.emergency && (
                      <Badge className="bg-red-100 text-red-800">
                        <Zap className="h-3 w-3 mr-1" />
                        24/7
                      </Badge>
                    )}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Provider Info */}
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={service.provider.image} alt={service.provider.name} />
                      <AvatarFallback className="text-xs">
                        {service.provider.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{service.provider.name}</span>
                    {service.provider.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.provider.rating}</span>
                      <span>({service.provider.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{service.distance}km away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="text-right space-y-2 flex-shrink-0">
                  {service.discount && (
                    <Badge variant="destructive" className="text-xs">
                      -{service.discount}% OFF
                    </Badge>
                  )}
                  <div className="text-lg font-bold">
                    {formatPrice()}
                  </div>
                  <Badge className={getAvailabilityColor()}>
                    {service.availability}
                  </Badge>
                  
                  <div className="flex gap-1 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Link href={`/client/providers/${service.provider.id}`}>
                    <Button className="w-full">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
      <div className="relative">
        {/* Service Image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {service.images[0] && (
            <Image
              src={service.images[0]}
              alt={service.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onLoad={() => setImageLoaded(true)}
            />
          )}
          {!imageLoaded && (
            <div className="flex items-center justify-center h-full text-4xl">
              🏠
            </div>
          )}
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {service.popular && (
              <Badge className="bg-orange-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            {service.emergency && (
              <Badge className="bg-red-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Emergency
              </Badge>
            )}
            {service.discount && (
              <Badge variant="destructive">
                -{service.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2"
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Availability Badge */}
          <Badge className={`absolute bottom-3 left-3 ${getAvailabilityColor()}`}>
            <Calendar className="h-3 w-3 mr-1" />
            {service.availability}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Service Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {service.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {service.description}
          </p>

          {/* Provider Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={service.provider.image} alt={service.provider.name} />
              <AvatarFallback className="text-xs">
                {service.provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {service.provider.name}
                </span>
                {service.provider.verified && (
                  <Shield className="h-3 w-3 text-green-600" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Responds in {service.provider.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{service.provider.rating}</span>
                <span>({service.provider.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{service.distance}km</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{service.duration}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {service.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {service.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{service.features.length - 3}
              </Badge>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">
                {formatPrice()}
              </div>
              {service.discount && (
                <div className="text-xs text-muted-foreground line-through">
                  AED {Math.round(service.price.from * (1 + service.discount / 100))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Link href={`/client/providers/${service.provider.id}`}>
                <Button size="sm">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}