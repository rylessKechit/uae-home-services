import mongoose, { Document, Model, Schema } from 'mongoose'
import { VerificationStatus, DocumentType, DocumentStatus } from '@/types'

// Interface for Provider Document
export interface IProvider extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  business: {
    name: string
    nameAr?: string
    description: string
    descriptionAr?: string
    logo?: string
    coverImage?: string
    establishedYear?: number
    licenseNumber?: string
    tradeLicenseExpiry?: Date
  }
  contactInfo: {
    phone: string
    whatsapp?: string
    email?: string
    website?: string
    socialMedia?: {
      instagram?: string
      facebook?: string
      linkedin?: string
    }
  }
  serviceAreas: Array<{
    emirate: string
    cities: string[]
    radius: number // in kilometers
  }>
  categories: string[] // Service category IDs
  verification: {
    status: VerificationStatus
    submittedAt?: Date
    reviewedAt?: Date
    reviewedBy?: mongoose.Types.ObjectId
    notes?: string
    documents: Array<{
      id: string
      type: DocumentType
      name: string
      url: string
      status: DocumentStatus
      uploadedAt: Date
      verifiedAt?: Date
      rejectionReason?: string
    }>
  }
  ratings: {
    average: number
    count: number
    breakdown: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
  availability: {
    workingDays: Array<{
      day: number // 0-6 (Sunday to Saturday)
      isWorking: boolean
      startTime: string // HH:MM format
      endTime: string // HH:MM format
      breakStart?: string
      breakEnd?: string
    }>
    holidays: Date[]
    timeZone: string
    advanceBooking: {
      minHours: number
      maxDays: number
    }
  }
  pricing: {
    currency: string
    commission: number // Platform commission percentage
    baseServiceFee?: number
    emergencyFee?: number
    minimumBooking?: number
  }
  statistics: {
    totalBookings: number
    completedBookings: number
    cancelledBookings: number
    totalRevenue: number
    responseTime: number // Average response time in minutes
    completionRate: number // Percentage
    repeatCustomers: number
  }
  settings: {
    instantBooking: boolean
    autoAcceptBookings: boolean
    requireDeposit: boolean
    cancellationPolicy: string
    termsAndConditions?: string
  }
  bankDetails?: {
    accountHolderName: string
    bankName: string
    iban: string
    accountNumber: string
    isVerified: boolean
  }
  isActive: boolean
  isPremium: boolean
  premiumExpiresAt?: Date
  suspensionReason?: string
  suspendedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Provider Schema
const providerSchema = new Schema<IProvider>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  business: {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters']
    },
    nameAr: {
      type: String,
      trim: true,
      maxlength: [100, 'Arabic business name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Business description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    descriptionAr: {
      type: String,
      trim: true,
      maxlength: [1000, 'Arabic description cannot exceed 1000 characters']
    },
    logo: String,
    coverImage: String,
    establishedYear: {
      type: Number,
      min: [1900, 'Established year cannot be before 1900'],
      max: [new Date().getFullYear(), 'Established year cannot be in the future']
    },
    licenseNumber: String,
    tradeLicenseExpiry: Date
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^(\+971|0)?[1-9]\d{8}$/, 'Please enter a valid UAE phone number']
    },
    whatsapp: {
      type: String,
      match: [/^(\+971|0)?[1-9]\d{8}$/, 'Please enter a valid UAE WhatsApp number']
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      linkedin: String
    }
  },
  serviceAreas: [{
    emirate: {
      type: String,
      required: true,
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']
    },
    cities: [{
      type: String,
      required: true
    }],
    radius: {
      type: Number,
      default: 25,
      min: [1, 'Service radius must be at least 1 km'],
      max: [100, 'Service radius cannot exceed 100 km']
    }
  }],
  categories: [{
    type: String,
    required: true
  }],
  verification: {
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING'
    },
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    documents: [{
      id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
      },
      type: {
        type: String,
        enum: ['EMIRATES_ID', 'PASSPORT', 'VISA', 'LICENSE', 'INSURANCE', 'CERTIFICATE'],
        required: true
      },
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['UPLOADED', 'VERIFIED', 'REJECTED'],
        default: 'UPLOADED'
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      verifiedAt: Date,
      rejectionReason: String
    }]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  availability: {
    workingDays: [{
      day: {
        type: Number,
        min: 0,
        max: 6,
        required: true
      },
      isWorking: {
        type: Boolean,
        default: true
      },
      startTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
        default: '09:00'
      },
      endTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
        default: '18:00'
      },
      breakStart: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      },
      breakEnd: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
      }
    }],
    holidays: [Date],
    timeZone: {
      type: String,
      default: 'Asia/Dubai'
    },
    advanceBooking: {
      minHours: {
        type: Number,
        default: 2,
        min: [1, 'Minimum advance booking must be at least 1 hour']
      },
      maxDays: {
        type: Number,
        default: 30,
        min: [1, 'Maximum advance booking must be at least 1 day'],
        max: [365, 'Maximum advance booking cannot exceed 365 days']
      }
    }
  },
  pricing: {
    currency: {
      type: String,
      default: 'AED',
      enum: ['AED']
    },
    commission: {
      type: Number,
      default: 15,
      min: [0, 'Commission cannot be negative'],
      max: [30, 'Commission cannot exceed 30%']
    },
    baseServiceFee: Number,
    emergencyFee: Number,
    minimumBooking: Number
  },
  statistics: {
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    completionRate: { type: Number, default: 100 },
    repeatCustomers: { type: Number, default: 0 }
  },
  settings: {
    instantBooking: { type: Boolean, default: false },
    autoAcceptBookings: { type: Boolean, default: false },
    requireDeposit: { type: Boolean, default: false },
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 24 hours before the service'
    },
    termsAndConditions: String
  },
  bankDetails: {
    accountHolderName: String,
    bankName: String,
    iban: {
      type: String,
      match: [/^AE\d{21}$/, 'Please enter a valid UAE IBAN']
    },
    accountNumber: String,
    isVerified: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: Date,
  suspensionReason: String,
  suspendedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
providerSchema.index({ userId: 1 })
providerSchema.index({ 'verification.status': 1 })
providerSchema.index({ 'serviceAreas.emirate': 1 })
providerSchema.index({ categories: 1 })
providerSchema.index({ 'ratings.average': -1 })
providerSchema.index({ isActive: 1 })
providerSchema.index({ isPremium: -1 })

// Virtual for verification status display
providerSchema.virtual('isVerified').get(function(this: IProvider) {
  return this.verification.status === 'APPROVED'
})

// Virtual for completion rate calculation
providerSchema.virtual('completionRatePercentage').get(function(this: IProvider) {
  if (this.statistics.totalBookings === 0) return 100
  return Math.round((this.statistics.completedBookings / this.statistics.totalBookings) * 100)
})

// Method to update rating
providerSchema.methods.updateRating = function(newRating: number) {
  const ratings = this.ratings
  
  // Update breakdown
  ratings.breakdown[newRating as keyof typeof ratings.breakdown]++
  ratings.count++
  
  // Calculate new average
  const total = (
    ratings.breakdown[5] * 5 +
    ratings.breakdown[4] * 4 +
    ratings.breakdown[3] * 3 +
    ratings.breakdown[2] * 2 +
    ratings.breakdown[1] * 1
  )
  ratings.average = Number((total / ratings.count).toFixed(1))
  
  return this.save()
}

// Static method to find verified providers
providerSchema.statics.findVerified = function() {
  return this.find({ 
    'verification.status': 'APPROVED',
    isActive: true
  })
}

// Static method to find providers by category
providerSchema.statics.findByCategory = function(category: string) {
  return this.find({ 
    categories: category,
    'verification.status': 'APPROVED',
    isActive: true
  })
}

// Static method to find providers in area
providerSchema.statics.findInArea = function(emirate: string, city?: string) {
  const query: any = {
    'serviceAreas.emirate': emirate,
    'verification.status': 'APPROVED',
    isActive: true
  }
  
  if (city) {
    query['serviceAreas.cities'] = city
  }
  
  return this.find(query)
}

// Pre-save middleware to set default working days
providerSchema.pre('save', function(next) {
  if (this.isNew && this.availability.workingDays.length === 0) {
    // Set default working days (Sunday to Thursday)
    for (let i = 0; i < 7; i++) {
      this.availability.workingDays.push({
        day: i,
        isWorking: i >= 0 && i <= 4, // Sunday (0) to Thursday (4)
        startTime: '09:00',
        endTime: '18:00'
      })
    }
  }
  next()
})

// Prevent re-compilation in development
const Provider: Model<IProvider> = mongoose.models.Provider || mongoose.model<IProvider>('Provider', providerSchema)

export default Provider