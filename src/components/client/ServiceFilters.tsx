'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { 
  Star,
  Clock,
  Shield,
  Zap,
  Award,
  X,
  Filter
} from 'lucide-react'
import { SERVICE_CATEGORIES } from '@/lib/utils'

const availabilityOptions = [
  { id: 'today', label: 'Available Today', count: 45 },
  { id: 'tomorrow', label: 'Available Tomorrow', count: 78 },
  { id: 'week', label: 'This Week', count: 156 },
  { id: 'emergency', label: '24/7 Emergency', count: 23, icon: Zap }
]

const providerFeatures = [
  { id: 'verified', label: 'Verified Provider', count: 89, icon: Shield },
  { id: 'top-rated', label: 'Top Rated (4.5+)', count: 67, icon: Star },
  { id: 'experienced', label: 'Experienced (5+ years)', count: 54, icon: Award },
  { id: 'instant', label: 'Instant Booking', count: 43, icon: Clock }
]

const priceRanges = [
  { id: '0-100', label: 'Under AED 100', count: 34 },
  { id: '100-300', label: 'AED 100 - 300', count: 78 },
  { id: '300-500', label: 'AED 300 - 500', count: 45 },
  { id: '500+', label: 'AED 500+', count: 23 }
]

export function ServiceFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState([4])

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedAvailability.length + 
    selectedFeatures.length + 
    selectedPriceRanges.length +
    (minRating[0] > 4 ? 1 : 0)

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleAvailability = (availId: string) => {
    setSelectedAvailability(prev => 
      prev.includes(availId) 
        ? prev.filter(id => id !== availId)
        : [...prev, availId]
    )
  }

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeId) 
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedAvailability([])
    setSelectedFeatures([])
    setSelectedPriceRanges([])
    setPriceRange([0, 1000])
    setMinRating([4])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Categories */}
        <div>
          <h3 className="font-medium text-sm mb-3">Service Categories</h3>
          <div className="space-y-2">
            {SERVICE_CATEGORIES.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range Slider */}
        <div>
          <h3 className="font-medium text-sm mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={0}
              step={50}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>AED {priceRange[0]}</span>
              <span>AED {priceRange[1]}</span>
            </div>
          </div>
          
          {/* Quick Price Ranges */}
          <div className="space-y-2 mt-4">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.id}`}
                  checked={selectedPriceRanges.includes(range.id)}
                  onCheckedChange={() => togglePriceRange(range.id)}
                />
                <label
                  htmlFor={`price-${range.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between flex-1 cursor-pointer"
                >
                  <span>{range.label}</span>
                  <span className="text-muted-foreground text-xs">({range.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <h3 className="font-medium text-sm mb-3">Minimum Rating</h3>
          <div className="px-2">
            <Slider
              value={minRating}
              onValueChange={setMinRating}
              max={5}
              min={0}
              step={0.5}
              className="mb-4"
            />
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(minRating[0]) 
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {minRating[0].toFixed(1)}+ stars
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div>
          <h3 className="font-medium text-sm mb-3">Availability</h3>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`avail-${option.id}`}
                  checked={selectedAvailability.includes(option.id)}
                  onCheckedChange={() => toggleAvailability(option.id)}
                />
                <label
                  htmlFor={`avail-${option.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between flex-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {option.icon && <option.icon className="h-3 w-3" />}
                    {option.label}
                  </span>
                  <span className="text-muted-foreground text-xs">({option.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Provider Features */}
        <div>
          <h3 className="font-medium text-sm mb-3">Provider Features</h3>
          <div className="space-y-2">
            {providerFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                />
                <label
                  htmlFor={`feature-${feature.id}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between flex-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <feature.icon className="h-3 w-3" />
                    {feature.label}
                  </span>
                  <span className="text-muted-foreground text-xs">({feature.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button className="w-full">
          Apply Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}