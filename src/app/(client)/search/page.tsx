import { Suspense } from 'react'
import { SearchForm } from '@/components/client/SearchForm'
import { ServiceFilters } from '@/components/client/ServiceFilters'
import { ServiceGrid } from '@/components/client/ServiceGrid'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = searchParams.q as string || ''
  const category = searchParams.category as string || ''
  const location = searchParams.location as string || ''

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Services</h1>
        <p className="text-muted-foreground">
          Discover trusted home service providers in your area
        </p>
      </div>

      {/* Search Form */}
      <SearchForm 
        initialQuery={query}
        initialCategory={category}
        initialLocation={location}
      />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <ServiceFilters />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<SearchResultsLoading />}>
            <ServiceGrid 
              query={query}
              category={category}
              location={location}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function SearchResultsLoading() {
  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}