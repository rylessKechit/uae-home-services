'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

// Form validation schema
const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  const password = watch('password')

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password || '')

  // Handle email/password sign up
  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Create account via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account')
      }

      // Account created successfully, now sign in
      setSuccess('Account created successfully! Signing you in...')
      
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error('Account created but sign in failed. Please try signing in manually.')
      }

      if (signInResult?.ok) {
        router.push('/client/onboarding')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setError('')

    try {
      await signIn('google', { 
        callbackUrl: '/client/onboarding',
        redirect: true 
      })
    } catch (err) {
      setError('Google sign up failed. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Display errors */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Display success */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
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
            Or create account with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={isLoading}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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
              placeholder="Create a strong password"
              autoComplete="new-password"
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
            </Button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-full rounded-full transition-colors ${
                      passwordStrength >= level
                        ? passwordStrength <= 2
                          ? 'bg-red-500'
                          : passwordStrength <= 4
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: {
                  passwordStrength <= 2 ? 'Weak' :
                  passwordStrength <= 4 ? 'Medium' : 'Strong'
                }
              </p>
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('confirmPassword')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={watch('agreeToTerms')}
            onCheckedChange={(checked) => setValue('agreeToTerms', !!checked)}
            disabled={isLoading}
          />
          <Label 
            htmlFor="agreeToTerms" 
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{' '}
            <a href="/terms" className="underline hover:text-primary" target="_blank">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-primary" target="_blank">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </div>
  )
}