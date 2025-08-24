import mongoose, { Document, Schema } from 'mongoose'
import { UserRole } from '@/types'

// Interface for User Document
export interface IUser extends Document {
  _id: string
  email: string
  name: string
  image?: string
  phone?: string
  password?: string
  role: UserRole
  isVerified: boolean
  emailVerified?: Date
  onboardingCompleted: boolean
  preferences: {
    language: 'en' | 'ar'
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  profile?: {
    dateOfBirth?: Date
    gender?: 'male' | 'female' | 'other'
    nationality?: string
    emiratesId?: string
  }
  addresses: Array<{
    id: string
    type: 'home' | 'work' | 'other'
    label: string
    address: string
    emirate: string
    city: string
    area?: string
    buildingNumber?: string
    apartmentNumber?: string
    landmarks?: string
    coordinates?: {
      lat: number
      lng: number
    }
    isDefault: boolean
  }>
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// User Schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  image: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    match: [/^(\+971|0)?[1-9]\d{8}$/, 'Please enter a valid UAE phone number'],
    sparse: true
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['CLIENT', 'PROVIDER', 'ADMIN'],
    default: 'CLIENT'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Date,
    default: null
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'ar'],
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  profile: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    nationality: String,
    emiratesId: {
      type: String,
      match: [/^\d{3}-\d{4}-\d{7}-\d$/, 'Please enter a valid Emirates ID']
    }
  },
  addresses: [{
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    label: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    emirate: {
      type: String,
      required: true,
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']
    },
    city: {
      type: String,
      required: true
    },
    area: String,
    buildingNumber: String,
    apartmentNumber: String,
    landmarks: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  lastLoginAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ 'addresses.emirate': 1 })
userSchema.index({ createdAt: -1 })

// Virtual for user's display name
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0]
})

// Virtual for default address
userSchema.virtual('defaultAddress').get(function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0]
})

// Static method to find by email
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password')
}

// Static method to find providers in area
userSchema.statics.findProvidersInArea = function(emirate: string, city?: string) {
  const query: any = { 
    role: 'PROVIDER', 
    'addresses.emirate': emirate 
  }
  if (city) {
    query['addresses.city'] = city
  }
  return this.find(query)
}

// Create and export the model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User