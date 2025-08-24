'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search,
  MapPin,
  Filter,
  SlidersHorizontal
} from 'lucide-react'
import { SERVICE_CATEGORIES, UAE_EMIRATES } from '@/lib/utils'

interface SearchFormProps {
  initialQuery?: string
  initialCategory?: string
  initialLocation?: string
}

const quickSearches = [
  "House Cleaning",
  "AC Repair",
  "Plumber",
  "Electrician",
  "Painter",
  "Gardening"
]

export function SearchForm({ 
  initialQuery = '',
  initialCategory = '',
  initialLocation = ''
}: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [location, setLocation] = useState(initialLocation)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const searchParams = new URLSearchParams()
    if (query) searchParams.set('q', query)
    if (category) searchParams.set('category', category)
    if (location) searchParams.set('location', location)
    
    const searchString = searchParams.toString()
    router.push(`/client/search${searchString ? `?${searchString}` : ''}`)
  }

  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    const searchParams = new URLSearchParams()
    searchParams.set('q', searchQuery)
    if (category) searchParams.set('category', category)
    if (location) searchParams.set('location', location)
    
    router.push(`/client/search?${searchParams.toString()}`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="What service do you need?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-48 pl-10">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Areas</SelectItem>
                    {UAE_EMIRATES.map((emirate) => (
                      <SelectItem key={emirate.code} value={emirate.name}>
                        {emirate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="px-6">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            {cat.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Price</SelectItem>
                      <SelectItem value="0-100">Under AED 100</SelectItem>
                      <SelectItem value="100-300">AED 100 - 300</SelectItem>
                      <SelectItem value="300-500">AED 300 - 500</SelectItem>
                      <SelectItem value="500+">AED 500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Time</SelectItem>
                      <SelectItem value="today">Available Today</SelectItem>
                      <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="emergency">24/7 Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">
          Popular:
        </span>
        {quickSearches.map((searchTerm) => (
          <Button
            key={searchTerm}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => handleQuickSearch(searchTerm)}
          >
            {searchTerm}
          </Button>
        ))}
      </div>
    </div>
  )
}