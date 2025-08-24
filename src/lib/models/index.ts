// Export all models
export { default as User, type IUser } from './User'
export { default as Provider, type IProvider } from './Provider'
export { default as Service, type IService } from './Service'
export { default as Booking, type IBooking } from './Booking'

// Re-export types for convenience
export type {
  UserRole,
  VerificationStatus,
  DocumentType,
  DocumentStatus,
  BookingStatus,
  BookingLocation,
  ServicePrice
} from '@/types'

// Helper functions for model operations
import connectDB from '@/lib/db'
import User from './User'
import Provider from './Provider'
import Service from './Service'
import Booking from './Booking'

// Initialize all models (useful for ensuring indexes are created)
export async function initializeModels() {
  await connectDB()
  
  // This will ensure all indexes are created
  await User.init()
  await Provider.init()
  await Service.init()
  await Booking.init()
  
  console.log('✅ All models initialized')
}

// Database health check
export async function checkDatabaseHealth() {
  try {
    await connectDB()
    
    // Test basic operations on each model
    const userCount = await User.countDocuments()
    const providerCount = await Provider.countDocuments()
    const serviceCount = await Service.countDocuments()
    const bookingCount = await Booking.countDocuments()
    
    return {
      connected: true,
      collections: {
        users: userCount,
        providers: providerCount,
        services: serviceCount,
        bookings: bookingCount
      },
      timestamp: new Date()
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }
  }
}