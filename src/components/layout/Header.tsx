'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { 
  User, 
  Settings, 
  LogOut, 
  Home, 
  Search,
  Calendar,
  Menu,
  X,
  Shield,
  Briefcase
} from 'lucide-react'

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show header on auth pages
  if (pathname?.startsWith('/auth')) {
    return null
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Search },
    { name: 'How it works', href: '/how-it-works', icon: Calendar }
  ]

  const userNavigation = {
    CLIENT: [
      { name: 'Dashboard', href: '/client/dashboard', icon: Home },
      { name: 'My Bookings', href: '/client/bookings', icon: Calendar },
      { name: 'Profile', href: '/client/profile', icon: User }
    ],
    PROVIDER: [
      { name: 'Dashboard', href: '/provider/dashboard', icon: Home },
      { name: 'My Services', href: '/provider/services', icon: Briefcase },
      { name: 'Calendar', href: '/provider/calendar', icon: Calendar },
      { name: 'Profile', href: '/provider/profile', icon: User }
    ],
    ADMIN: [
      { name: 'Admin Panel', href: '/admin/dashboard', icon: Shield },
      { name: 'Users', href: '/admin/users', icon: User },
      { name: 'Services', href: '/admin/services', icon: Briefcase }
    ]
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">UAE</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">Home Services</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Role Badge */}
                {user.role !== 'CLIENT' && (
                  <Badge variant="secondary" className="hidden sm:flex">
                    {user.role === 'PROVIDER' ? 'Provider' : 'Admin'}
                  </Badge>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || ''} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {!user.isVerified && (
                          <Badge variant="destructive" className="text-xs mt-1 w-fit">
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Role-based Navigation */}
                    {userNavigation[user.role]?.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary hover:bg-muted rounded-md ${
                    pathname === item.href
                      ? 'text-primary bg-muted'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-3 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}