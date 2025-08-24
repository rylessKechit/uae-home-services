import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignInForm } from '@/components/auth/SignInForm'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Sign In | UAE Home Services',
  description: 'Sign in to your UAE Home Services account'
}

export default function SignInPage() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded" />}>
          <SignInForm />
        </Suspense>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Don't have an account?
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/auth/signup"
            className="text-sm text-primary hover:underline font-medium"
          >
            Create an account
          </Link>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <Link href="/auth/forgot-password" className="hover:text-primary">
            Forgot your password?
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}