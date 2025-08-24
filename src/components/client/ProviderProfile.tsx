'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share,
  Heart,
  Shield,
  Award,
  Calendar,
  Users,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react'

interface ProviderProfileProps {
  provider: {
    id: string
    name: string
    image: string
    coverImage?: string
    rating: number
    reviewCount: number
    completedJobs: number
    verified: boolean
    responseTime: string
    memberSince: string
    description: string
    location: {
      area: string
      serviceRadius: number
    }
    contact: {
      phone: string
      whatsapp?: string
      email?: string
    }
    languages: string[]
    specialties: string[]
    certifications: string[]
    workingHours: Record<string, { start: string; end: string }>
    stats: {
      totalBookings: number
      repeatCustomers: number
      onTimeRate: number
      responseRate: number
    }
  }
}

export function ProviderProfile({ provider }: ProviderProfileProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatWorkingHours = () => {
    const today = new Date().toLocaleLowerCase().slice(0, 3) + 
                  new Date().toLocaleDateString('en', { weekday: 'long' }).toLowerCase().slice(3)
    const todayHours = provider.workingHours[today]
    
    if (!todayHours || todayHours.start === 'closed') {
      return 'Closed today'
    }
    
    return `Open today: ${todayHours.start} - ${todayHours.end}`
  }

  const isOnlineNow = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const today = Object.keys(provider.workingHours)[now.getDay()]
    const todayHours = provider.workingHours[today]
    
    if (!todayHours || todayHours.start === 'closed') return false
    
    const startHour = parseInt(todayHours.start.split(':')[0])
    const endHour = parseInt(todayHours.end.split(':')[0])
    
    return currentHour >= startHour && currentHour < endHour
  }

  return (
    <Card className="overflow-hidden">
      {/* Cover Image */}
      {provider.coverImage && (
        <div className="relative h-48 bg-gradient-to-r from-primary/20 to-secondary/20">
          <Image
            src={provider.coverImage}
            alt={`${provider.name} cover`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 hover:bg-white"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <CardContent className="p-6">
        {/* Provider Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={provider.image} alt={provider.name} />
              <AvatarFallback className="text-xl">
                {getInitials(provider.name)}
              </AvatarFallback>
            </Avatar>
            {isOnlineNow() && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
                  {provider.name}
                  {provider.verified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating}</span>
                    <span>({provider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{provider.completedJobs} completed jobs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {provider.memberSince}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{provider.location.area}</span>
                    <span className="text-muted-foreground">
                      (serves {provider.location.serviceRadius}km radius)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="text-right space-y-1">
                <div className="text-sm font-medium text-green-600">
                  {isOnlineNow() ? 'Online now' : formatWorkingHours()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Responds in {provider.responseTime}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link href={`?booking=true`}>
                <Button className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Service
                </Button>
              </Link>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{provider.stats.totalBookings}</div>
            <div className="text-xs text-muted-foreground">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{provider.stats.repeatCustomers}</div>
            <div className="text-xs text-muted-foreground">Repeat Clients</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{provider.stats.onTimeRate}%</div>
            <div className="text-xs text-muted-foreground">On Time</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{provider.stats.responseRate}%</div>
            <div className="text-xs text-muted-foreground">Response Rate</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">About</h3>
          <p className={`text-muted-foreground leading-relaxed ${
            !showFullDescription && provider.description.length > 200 ? 'line-clamp-3' : ''
          }`}>
            {provider.description}
          </p>
          {provider.description.length > 200 && (
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>

        {/* Skills & Certifications */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Languages */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Languages
            </h4>
            <div className="flex flex-wrap gap-1">
              {provider.languages.map((lang, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Specialties
            </h4>
            <div className="flex flex-wrap gap-1">
              {provider.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </h4>
            <div className="flex flex-wrap gap-1">
              {provider.certifications.map((cert, index) => (
                <Badge key={index} className="text-xs bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Working Hours
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {Object.entries(provider.workingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between p-2 rounded bg-muted/30">
                <span className="capitalize font-medium">{day.slice(0, 3)}</span>
                <span className="text-muted-foreground">
                  {hours.start === 'closed' ? 'Closed' : `${hours.start}-${hours.end}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}