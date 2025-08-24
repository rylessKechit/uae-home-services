'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import {
  Home,
  Search,
  Calendar,
  User,
  Settings,
  HelpCircle,
  Menu,
  X,
  Star,
  Clock,
  MapPin
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/client/dashboard',
    icon: Home,
    description: 'Overview and quick actions'
  },
  {
    name: 'Find Services',
    href: '/client/search',
    icon: Search,
    description: 'Browse and book services'
  },
  {
    name: 'My Bookings',
    href: '/client/bookings',
    icon: Calendar,
    description: 'Track your appointments',
    badge: 'new'
  },
  {
    name: 'Favorites',
    href: '/client/favorites',
    icon: Star,
    description: 'Saved providers'
  },
  {
    name: 'History',
    href: '/client/history',
    icon: Clock,
    description: 'Past services'
  }
]

const bottomNavigation = [
  {
    name: 'Profile',
    href: '/client/profile',
    icon: User
  },
  {
    name: 'Settings',
    href: '/client/settings',
    icon: Settings
  },
  {
    name: 'Help',
    href: '/client/help',
    icon: HelpCircle
  }
]

export function ClientSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">UAE</span>
              </div>
              <span className="font-semibold text-lg">Home Services</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
                {!user?.isVerified && (
                  <Badge variant="destructive" className="text-xs mt-1">
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold">12</div>
                <div className="text-xs text-muted-foreground">Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">4.8</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-2">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t">
            <Button className="w-full mb-3" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Book a Service
            </Button>
            
            <div className="space-y-1">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Location */}
          <div className="p-4 border-t">
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              Dubai, UAE
            </div>
          </div>
        </div>
      </div>
    </>
  )
}