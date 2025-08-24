import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign Up | UAE Home Services',
  description: 'Create your UAE Home Services account'
}

export default function SignUpPage() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Join UAE Home Services and get started today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Benefits */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm">What you'll get:</h3>
          <div className="space-y-2">
            {[
              'Access to verified service providers',
              'Secure booking and payment system', 
              'Real-time service tracking',
              'Customer support in English & Arabic'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded" />}>
          <SignUpForm />
        </Suspense>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="text-sm text-primary hover:underline font-medium"
          >
            Sign in instead
          </Link>
        </div>

        {/* Provider Sign Up CTA */}
        <div className="border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs">
              For Service Providers
            </Badge>
            <p className="text-sm text-muted-foreground">
              Are you a professional service provider?
            </p>
            <Link
              href="/provider/signup"
              className="text-sm text-primary hover:underline font-medium"
            >
              Join as a Provider →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}