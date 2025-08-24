import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentication | UAE Home Services',
  description: 'Sign in or create an account to access UAE Home Services platform'
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">UAE</span>
              </div>
              <span className="font-semibold text-lg">Home Services</span>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-primary">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
            </p>
            <p>© 2024 UAE Home Services. Made with ❤️ for the UAE community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}