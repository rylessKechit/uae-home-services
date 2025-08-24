import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import type { UserRole } from '@/types'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: UserRole
      isVerified: boolean
      onboardingCompleted: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: UserRole
    isVerified: boolean
    onboardingCompleted: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    isVerified: boolean
    onboardingCompleted: boolean
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your-email@example.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password')
        }

        try {
          await connectDB()
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password')
          if (!user) {
            throw new Error('No user found with this email')
          }

          // Check if user has a password (might be OAuth only)
          if (!user.password) {
            throw new Error('Please sign in with Google or reset your password')
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          // Update last login
          user.lastLoginAt = new Date()
          await user.save()

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            isVerified: user.isVerified,
            onboardingCompleted: user.onboardingCompleted
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB()

        if (account?.provider === 'google') {
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email!.toLowerCase() })
          
          if (!existingUser) {
            // Create new user from Google profile
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'CLIENT',
              isVerified: true,
              emailVerified: new Date(),
              preferences: {
                language: 'en',
                notifications: {
                  email: true,
                  sms: false,
                  push: true
                }
              }
            })
            
            await newUser.save()
            console.log('✅ New Google user created:', newUser.email)
            
            // Update user object for JWT
            user.id = newUser._id.toString()
            user.role = newUser.role
            user.isVerified = newUser.isVerified
            user.onboardingCompleted = newUser.onboardingCompleted
          } else {
            // Update existing user's info from Google
            existingUser.name = user.name || existingUser.name
            existingUser.image = user.image || existingUser.image
            existingUser.lastLoginAt = new Date()
            
            if (!existingUser.isVerified) {
              existingUser.isVerified = true
              existingUser.emailVerified = new Date()
            }
            
            await existingUser.save()
            
            // Update user object for JWT
            user.id = existingUser._id.toString()
            user.role = existingUser.role
            user.isVerified = existingUser.isVerified
            user.onboardingCompleted = existingUser.onboardingCompleted
          }
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },

    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isVerified = user.isVerified
        token.onboardingCompleted = user.onboardingCompleted
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isVerified = token.isVerified
        session.user.onboardingCompleted = token.onboardingCompleted
      }

      return session
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`✅ User signed in: ${user.email} via ${account?.provider}`)
      
      if (isNewUser) {
        console.log(`🎉 New user registered: ${user.email}`)
      }
    }
  },
  debug: process.env.NODE_ENV === 'development'
}

// Helper functions
export async function getUserById(id: string) {
  try {
    await connectDB()
    const user = await User.findById(id).select('-password')
    return user
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  }
}

export async function updateUserProfile(id: string, updates: any) {
  try {
    await connectDB()
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password')
    
    return user
  } catch (error) {
    console.error('Update user profile error:', error)
    throw error
  }
}