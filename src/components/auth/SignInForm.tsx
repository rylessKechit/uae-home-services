'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/ui/icons'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

// Form validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const callbackUrl = searchParams?.get('callbackUrl') || '/client/dashboard'
  const errorParam = searchParams?.get('error')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Handle email/password sign in
  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin' 
            ? 'Invalid email or password' 
            : result.error
        )
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError('')

    try {
      await signIn('google', { 
        callbackUrl,
        redirect: true 
      })
    } catch (err) {
      setError('Google sign in failed. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  // Display error from URL params
  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error occurred during sign in. Please try again.'
      case 'OAuthCallback':
        return 'Error occurred during sign in callback. Please try again.'
      case 'OAuthCreateAccount':
        return 'Could not create account. Please try again.'
      case 'EmailCreateAccount':
        return 'Could not create account. Please try again.'
      case 'Callback':
        return 'Error occurred during callback. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'Account already exists with different provider. Please use the correct sign in method.'
      case 'EmailSignin':
        return 'Check your email for sign in link.'
      case 'CredentialsSignin':
        return 'Invalid credentials. Please check your email and password.'
      case 'unauthorized':
        return 'You are not authorized to access this resource.'
      default:
        return 'An error occurred during sign in. Please try again.'
    }
  }

  return (
    <div className="space-y-4">
      {/* Display URL error */}
      {errorParam && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getErrorMessage(errorParam)}</AlertDescription>
        </Alert>
      )}

      {/* Display form error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your-email@example.com"
            autoComplete="email"
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register('password')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </div>
  )
}