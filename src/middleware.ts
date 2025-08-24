import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isPublicPage = ['/'].includes(req.nextUrl.pathname) || 
                        req.nextUrl.pathname.startsWith('/api/auth')
    
    // Allow access to auth pages when not logged in
    if (isAuthPage && !token) {
      return NextResponse.next()
    }
    
    // Redirect logged-in users away from auth pages
    if (isAuthPage && token) {
      const redirectUrl = new URL('/', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Allow access to public pages
    if (isPublicPage) {
      return NextResponse.next()
    }
    
    // Check if user needs onboarding
    if (token && !token.onboardingCompleted) {
      const onboardingPaths = ['/onboarding', '/api/user']
      if (!onboardingPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
        const onboardingUrl = new URL('/onboarding', req.url)
        return NextResponse.redirect(onboardingUrl)
      }
    }
    
    // Role-based access control
    const pathname = req.nextUrl.pathname
    
    // Admin routes - only admins
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        const unauthorizedUrl = new URL('/auth/signin?error=unauthorized', req.url)
        return NextResponse.redirect(unauthorizedUrl)
      }
    }
    
    // Provider routes - only providers and admins
    if (pathname.startsWith('/provider')) {
      if (!token || !['PROVIDER', 'ADMIN'].includes(token.role)) {
        const unauthorizedUrl = new URL('/auth/signin?error=unauthorized', req.url)
        return NextResponse.redirect(unauthorizedUrl)
      }
    }
    
    // Client routes - authenticated users only
    if (pathname.startsWith('/client') || pathname.startsWith('/booking')) {
      if (!token) {
        const signinUrl = new URL('/auth/signin', req.url)
        signinUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(signinUrl)
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isPublicRoute = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/api/auth',
          '/api/health'
        ].some(route => req.nextUrl.pathname.startsWith(route))
        
        // Allow access to public routes
        if (isPublicRoute) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|icons).*)',
  ],
}