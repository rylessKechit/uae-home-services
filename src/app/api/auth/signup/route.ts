import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'

// Validation schema
const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { name, email, password } = signUpSchema.parse(body)

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'CLIENT',
      isVerified: false,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    })

    await user.save()

    // Return success response (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: userResponse
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}