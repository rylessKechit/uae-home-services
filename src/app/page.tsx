import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Shield, Clock, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-6 px-3 py-1">
            🇦🇪 Serving All 7 Emirates
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            <span className="text-gradient">UAE Home Services</span>
            <br />
            <span className="text-foreground">at Your Doorstep</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with trusted, verified professionals for all your home service needs. 
            From cleaning to repairs, we've got the UAE covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3">
              Find Services
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Become a Provider
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Verified Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Services Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Emirates Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional services for every need, available across all Emirates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'House Cleaning',
                description: 'Professional deep cleaning and regular maintenance',
                icon: '🧹',
                price: 'From AED 150',
                popular: true
              },
              {
                title: 'AC Maintenance',
                description: 'Installation, repair, and servicing of air conditioners',
                icon: '❄️',
                price: 'From AED 200',
                popular: false
              },
              {
                title: 'Plumbing',
                description: 'Emergency repairs and installations',
                icon: '🔧',
                price: 'From AED 100',
                popular: false
              },
              {
                title: 'Electrical Work',
                description: 'Safe and certified electrical services',
                icon: '⚡',
                price: 'From AED 120',
                popular: true
              },
              {
                title: 'Painting',
                description: 'Interior and exterior painting services',
                icon: '🎨',
                price: 'From AED 300',
                popular: false
              },
              {
                title: 'Gardening',
                description: 'Landscaping and garden maintenance',
                icon: '🌱',
                price: 'From AED 180',
                popular: false
              }
            ].map((service, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                {service.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-lg font-semibold text-primary mb-4">
                    {service.price}
                  </div>
                  <Button variant="outline" className="w-full">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose UAE Home Services?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make home services simple, safe, and reliable across all Emirates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Verified Providers',
                description: 'All service providers are background-checked and verified'
              },
              {
                icon: Star,
                title: 'Quality Guaranteed',
                description: 'Rate and review every service to ensure quality standards'
              },
              {
                icon: Clock,
                title: 'Fast Booking',
                description: 'Book services in minutes with instant confirmation'
              },
              {
                icon: MapPin,
                title: 'UAE-Wide Coverage',
                description: 'Available across all 7 Emirates with local expertise'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers across the UAE. 
            Book your first service today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Browse Services
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">UAE Home Services</h3>
            <p className="text-muted-foreground mb-4">
              Professional home services across all 7 Emirates
            </p>
            <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 UAE Home Services</span>
              <span>•</span>
              <span>Made with ❤️ for the UAE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}