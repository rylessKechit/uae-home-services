import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import { User } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Connect to database
    await connectDB()

    // Get user profile
    const user = await User.findById(session.user.id).select('-password')
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const updates = await request.json()
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates._id
    delete updates.email
    delete updates.password
    delete updates.role
    delete updates.isVerified
    delete updates.createdAt
    delete updates.updatedAt

    // Connect to database
    await connectDB()

    // Update user profile
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Update user profile error:', error)
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation error', errors: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}