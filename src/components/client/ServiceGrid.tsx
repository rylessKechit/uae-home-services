'use client'

import { useState, useEffect } from 'react'
import { ServiceCard } from './ServiceCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Grid3X3,
  List,
  SlidersHorizontal,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react'

interface ServiceGridProps {
  query?: string
  category?: string
  location?: string
}

// Mock data - will be replaced with real API calls
const mockServices = [
  {
    id: "1",
    name: "Premium House Cleaning",
    provider: {
      id: "p1",
      name: "Sarah Ahmed",
      image: "https://images.unsplash.com/photo-1494790108755-2616b68a70cd?w=150",
      rating: 4.9,
      reviewCount: 234,
      verified: true,
      responseTime: "< 1 hour"
    },
    category: "cleaning",
    description: "Deep cleaning service for your entire home with eco-friendly products",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    price: {
      from: 180,
      to: 350,
      currency: "AED",
      type: "fixed"
    },
    duration: "3-5 hours",
    location: "Dubai",
    distance: 2.5,
    availability: "Available today",
    features: ["Eco-friendly", "Same day", "Insured"],
    discount: 15,
    popular: true,
    emergency: false
  },
  {
    id: "2",
    name: "AC Repair & Maintenance",
    provider: {
      id: "p2", 
      name: "Mohammed Ali",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 4.8,
      reviewCount: 189,
      verified: true,
      responseTime: "< 2 hours"
    },
    category: "ac",
    description: "Professional AC repair and maintenance for all brands",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"],
    price: {
      from: 120,
      to: 300,
      currency: "AED",
      type: "hourly"
    },
    duration: "1-3 hours",
    location: "Dubai",
    distance: 1.8,
    availability: "Available tomorrow",
    features: ["24/7 Emergency", "Warranty", "All brands"],
    emergency: true,
    popular: false
  },
  {
    id: "3",
    name: "Expert Plumbing Services",
    provider: {
      id: "p3",
      name: "Ahmed Hassan", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      rating: 4.7,
      reviewCount: 156,
      verified: true,
      responseTime: "< 30 min"
    },
    category: "plumbing",
    description: "Quick fixes for leaks, clogs, and installations",
    images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400"],
    price: {
      from: 100,
      to: 400,
      currency: "AED", 
      type: "custom"
    },
    duration: "1-4 hours",
    location: "Dubai",
    distance: 3.2,
    availability: "Available now",
    features: ["Emergency", "Licensed", "Guaranteed"],
    emergency: true,
    popular: false
  },
  {
    id: "4",
    name: "Professional Painting",
    provider: {
      id: "p4",
      name: "Omar Khalil",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150", 
      rating: 4.6,
      reviewCount: 98,
      verified: true,
      responseTime: "< 4 hours"
    },
    category: "painting",
    description: "Interior and exterior painting with premium quality paints",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400"],
    price: {
      from: 300,
      to: 800,
      currency: "AED",
      type: "fixed"
    },
    duration: "4-8 hours",
    location: "Dubai",
    distance: 4.1,
    availability: "Available next week",
    features: ["Premium paints", "Clean finish", "Insured"],
    popular: false,
    emergency: false
  }
]

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "distance", label: "Nearest First" },
  { value: "availability", label: "Available First" }
]

export function ServiceGrid({ query, category, location }: ServiceGridProps) {
  const [services, setServices] = useState(mockServices)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('recommended')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter services based on search parameters
  const filteredServices = services.filter(service => {
    if (query && !service.name.toLowerCase().includes(query.toLowerCase()) &&
        !service.description.toLowerCase().includes(query.toLowerCase())) {
      return false
    }
    if (category && service.category !== category) {
      return false
    }
    if (location && service.location !== location) {
      return false
    }
    return true
  })

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.provider.rating - a.provider.rating
      case 'price-low':
        return a.price.from - b.price.from
      case 'price-high':
        return b.price.from - a.price.from
      case 'distance':
        return a.distance - b.distance
      case 'availability':
        return a.availability === "Available now" ? -1 : 1
      default:
        return 0
    }
  })

  const resultsCount = sortedServices.length

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {resultsCount} services found
            </span>
            {query && (
              <Badge variant="secondary">
                for "{query}"
              </Badge>
            )}
            {category && (
              <Badge variant="outline">
                in {category}
              </Badge>
            )}
            {location && (
              <Badge variant="outline">
                📍 {location}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="hidden md:flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filters */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Services Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading services...</p>
        </div>
      ) : sortedServices.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
            : "space-y-4"
        }>
          {sortedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No services found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse all services
          </p>
          <Button>
            Browse All Services
          </Button>
        </div>
      )}

      {/* Load More */}
      {sortedServices.length > 0 && sortedServices.length >= 8 && (
        <div className="text-center pt-6">
          <Button variant="outline" size="lg">
            Load More Services
          </Button>
        </div>
      )}
    </div>
  )
}