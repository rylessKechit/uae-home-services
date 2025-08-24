import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local')
}

const MONGODB_URI: string = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use global to maintain a cached connection across hot reloads in development
declare global {
  var mongoose: MongooseCache | undefined
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas')
      return mongoose
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    console.error('❌ MongoDB connection error:', e)
    throw e
  }

  return cached!.conn
}

export default connectDB

// Helper function to check connection status
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1
}

// Helper function to disconnect (useful for testing)
export const disconnect = async (): Promise<void> => {
  if (cached?.conn) {
    await mongoose.disconnect()
    cached.conn = null
    cached.promise = null
    console.log('🔌 Disconnected from MongoDB')
  }
}