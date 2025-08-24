import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserRole } from '@/types'

interface UseAuthReturn {
  // Session data
  user: {
    id: string
    email: string
    name: string
    image?: string
    role: UserRole
    isVerified: boolean
    onboardingCompleted: boolean
  } | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Auth functions
  login: (provider?: string, options?: any) => Promise<void>
  logout: () => Promise<void>
  
  // Role checks
  isClient: boolean
  isProvider: boolean
  isAdmin: boolean
  
  // Verification status
  needsVerification: boolean
  needsOnboarding: boolean
  
  // Actions
  refreshSession: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const user = session?.user || null
  const isAuthenticated = !!session && !!user
  
  // Role checks
  const isClient = user?.role === 'CLIENT'
  const isProvider = user?.role === 'PROVIDER'
  const isAdmin = user?.role === 'ADMIN'
  
  // Status checks
  const needsVerification = isAuthenticated && !user.isVerified
  const needsOnboarding = isAuthenticated && !user.onboardingCompleted
  
  // Login function
  const login = async (provider: string = 'credentials', options: any = {}) => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, {
        redirect: false,
        ...options
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      if (result?.ok) {
        // Redirect after successful login
        const callbackUrl = options.callbackUrl || (
          user?.role === 'ADMIN' ? '/admin' :
          user?.role === 'PROVIDER' ? '/provider' :
          '/client'
        )
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // Logout function
  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // Refresh session
  const refreshSession = async () => {
    try {
      await update()
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }
  
  return {
    user,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated,
    login,
    logout,
    isClient,
    isProvider,
    isAdmin,
    needsVerification,
    needsOnboarding,
    refreshSession
  }
}

// Hook for role-based access control
export function useRoleAccess(allowedRoles: UserRole[]) {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  const hasAccess = isAuthenticated && 
    user && 
    allowedRoles.includes(user.role)
  
  return {
    hasAccess,
    isLoading,
    userRole: user?.role,
    isAuthenticated
  }
}

// Hook for requiring authentication
export function useRequireAuth(redirectTo: string = '/auth/signin') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo)
  }
  
  return { isAuthenticated, isLoading }
}

// Hook for checking permissions
export function usePermissions() {
  const { user, isAuthenticated } = useAuth()
  
  const can = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false
    
    // Admin can do everything
    if (user.role === 'ADMIN') return true
    
    // Define role-based permissions
    const permissions: Record<UserRole, string[]> = {
      CLIENT: [
        'booking.create',
        'booking.view_own',
        'booking.cancel_own',
        'review.create',
        'profile.update_own'
      ],
      PROVIDER: [
        'booking.view_assigned',
        'booking.update_assigned',
        'service.create_own',
        'service.update_own',
        'provider.update_own',
        'earnings.view_own'
      ],
      ADMIN: ['*'] // All permissions
    }
    
    const userPermissions = permissions[user.role] || []
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }
  
  return { can }
}

// Utility functions for auth
export const authUtils = {
  // Check if user can access a route
  canAccessRoute: (userRole: UserRole | null, routePattern: string): boolean => {
    if (!userRole) return false
    
    const routeAccess: Record<string, UserRole[]> = {
      '/admin/*': ['ADMIN'],
      '/provider/*': ['PROVIDER', 'ADMIN'],
      '/client/*': ['CLIENT', 'PROVIDER', 'ADMIN'],
      '/booking/*': ['CLIENT', 'PROVIDER', 'ADMIN']
    }
    
    for (const [pattern, roles] of Object.entries(routeAccess)) {
      const regex = new RegExp(pattern.replace('*', '.*'))
      if (regex.test(routePattern)) {
        return roles.includes(userRole)
      }
    }
    
    return true // Public route
  },
  
  // Get redirect URL based on user role
  getDefaultRedirectUrl: (userRole: UserRole): string => {
    switch (userRole) {
      case 'ADMIN':
        return '/admin/dashboard'
      case 'PROVIDER':
        return '/provider/dashboard'
      case 'CLIENT':
      default:
        return '/client/dashboard'
    }
  },
  
  // Format user display name
  formatUserName: (user: any): string => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }
}