import mongoose, { Document, Model, Schema } from 'mongoose'
import { BookingStatus, BookingLocation } from '@/types'

// Interface for Booking Document
export interface IBooking extends Document {
  _id: string
  bookingNumber: string
  clientId: mongoose.Types.ObjectId
  providerId: mongoose.Types.ObjectId
  serviceId: mongoose.Types.ObjectId
  status: BookingStatus
  scheduledDate: Date
  scheduledTime: string
  duration: number // minutes
  actualDuration?: number
  location: BookingLocation
  pricing: {
    servicePrice: number
    addOnsPrices: Array<{
      id: string
      name: string
      price: number
    }>
    subtotal: number
    platformFee: number
    commission: number
    emergencyFee?: number
    discount?: {
      type: 'percentage' | 'fixed'
      value: number
      code?: string
      amount: number
    }
    taxes: number
    total: number
    currency: string
  }
  payment: {
    method?: 'CARD' | 'CASH' | 'WALLET'
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND'
    transactionId?: string
    paidAt?: Date
    refundAmount?: number
    refundReason?: string
    refundedAt?: Date
  }
  details: {
    instructions?: string
    specialRequirements?: string[]
    clientNotes?: string
    providerNotes?: string
    selectedAddOns: string[] // Add-on IDs
    materials?: string[]
    equipmentProvided?: boolean
  }
  timeline: Array<{
    status: BookingStatus
    timestamp: Date
    note?: string
    updatedBy: 'CLIENT' | 'PROVIDER' | 'SYSTEM' | 'ADMIN'
    metadata?: any
  }>
  communication: {
    chatId?: string
    lastMessageAt?: Date
    unreadCount: {
      client: number
      provider: number
    }
  }
  completion: {
    completedAt?: Date
    beforePhotos?: string[]
    afterPhotos?: string[]
    workSummary?: string
    clientFeedback?: string
    issuesReported?: string[]
    qualityScore?: number // 1-5
  }
  cancellation?: {
    cancelledAt: Date
    cancelledBy: 'CLIENT' | 'PROVIDER' | 'ADMIN'
    reason: string
    refundAmount?: number
    penaltyAmount?: number
    cancellationFee?: number
  }
  rescheduling: {
    history: Array<{
      originalDate: Date
      originalTime: string
      newDate: Date
      newTime: string
      reason: string
      requestedBy: 'CLIENT' | 'PROVIDER'
      requestedAt: Date
      approvedAt?: Date
    }>
    count: number
    maxAllowed: number
  }
  review?: {
    clientReviewId?: mongoose.Types.ObjectId
    providerReviewId?: mongoose.Types.ObjectId
    reminderSent: boolean
  }
  emergency: {
    isEmergency: boolean
    urgencyLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    requestedAt?: Date
    confirmedAt?: Date
  }
  createdAt: Date
  updatedAt: Date
}

// Booking Schema
const bookingSchema = new Schema<IBooking>({
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client ID is required']
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: [true, 'Provider ID is required']
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service ID is required']
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
    default: 'PENDING'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    validate: {
      validator: function(value: Date) {
        return value >= new Date()
      },
      message: 'Scheduled date cannot be in the past'
    }
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  actualDuration: {
    type: Number,
    min: [1, 'Actual duration must be positive']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    emirate: {
      type: String,
      required: [true, 'Emirate is required'],
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    area: String,
    buildingDetails: String,
    apartmentNumber: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    accessInstructions: String,
    parkingAvailable: Boolean,
    securityRequirements: String
  },
  pricing: {
    servicePrice: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Service price cannot be negative']
    },
    addOnsPrices: [{
      id: String,
      name: String,
      price: {
        type: Number,
        min: [0, 'Add-on price cannot be negative']
      }
    }],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    platformFee: {
      type: Number,
      default: 0,
      min: [0, 'Platform fee cannot be negative']
    },
    commission: {
      type: Number,
      required: [true, 'Commission is required'],
      min: [0, 'Commission cannot be negative']
    },
    emergencyFee: {
      type: Number,
      min: [0, 'Emergency fee cannot be negative']
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed']
      },
      value: Number,
      code: String,
      amount: {
        type: Number,
        min: [0, 'Discount amount cannot be negative']
      }
    },
    taxes: {
      type: Number,
      default: 0,
      min: [0, 'Taxes cannot be negative']
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative']
    },
    currency: {
      type: String,
      default: 'AED',
      enum: ['AED']
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['CARD', 'CASH', 'WALLET']
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND'],
      default: 'PENDING'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative']
    },
    refundReason: String,
    refundedAt: Date
  },
  details: {
    instructions: {
      type: String,
      maxlength: [1000, 'Instructions cannot exceed 1000 characters']
    },
    specialRequirements: [String],
    clientNotes: {
      type: String,
      maxlength: [500, 'Client notes cannot exceed 500 characters']
    },
    providerNotes: {
      type: String,
      maxlength: [500, 'Provider notes cannot exceed 500 characters']
    },
    selectedAddOns: [String],
    materials: [String],
    equipmentProvided: {
      type: Boolean,
      default: true
    }
  },
  timeline: [{
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: String,
      enum: ['CLIENT', 'PROVIDER', 'SYSTEM', 'ADMIN'],
      required: true
    },
    metadata: Schema.Types.Mixed
  }],
  communication: {
    chatId: String,
    lastMessageAt: Date,
    unreadCount: {
      client: { type: Number, default: 0 },
      provider: { type: Number, default: 0 }
    }
  },
  completion: {
    completedAt: Date,
    beforePhotos: [String],
    afterPhotos: [String],
    workSummary: {
      type: String,
      maxlength: [1000, 'Work summary cannot exceed 1000 characters']
    },
    clientFeedback: {
      type: String,
      maxlength: [500, 'Client feedback cannot exceed 500 characters']
    },
    issuesReported: [String],
    qualityScore: {
      type: Number,
      min: [1, 'Quality score must be between 1 and 5'],
      max: [5, 'Quality score must be between 1 and 5']
    }
  },
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['CLIENT', 'PROVIDER', 'ADMIN']
    },
    reason: String,
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative']
    },
    penaltyAmount: {
      type: Number,
      min: [0, 'Penalty amount cannot be negative']
    },
    cancellationFee: {
      type: Number,
      min: [0, 'Cancellation fee cannot be negative']
    }
  },
  rescheduling: {
    history: [{
      originalDate: { type: Date, required: true },
      originalTime: { type: String, required: true },
      newDate: { type: Date, required: true },
      newTime: { type: String, required: true },
      reason: { type: String, required: true },
      requestedBy: {
        type: String,
        enum: ['CLIENT', 'PROVIDER'],
        required: true
      },
      requestedAt: { type: Date, default: Date.now },
      approvedAt: Date
    }],
    count: { type: Number, default: 0 },
    maxAllowed: { type: Number, default: 2 }
  },
  review: {
    clientReviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    },
    providerReviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    },
    reminderSent: { type: Boolean, default: false }
  },
  emergency: {
    isEmergency: { type: Boolean, default: false },
    urgencyLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    },
    requestedAt: Date,
    confirmedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
bookingSchema.index({ bookingNumber: 1 })
bookingSchema.index({ clientId: 1, createdAt: -1 })
bookingSchema.index({ providerId: 1, createdAt: -1 })
bookingSchema.index({ serviceId: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ scheduledDate: 1 })
bookingSchema.index({ 'location.emirate': 1 })

// Virtual for formatted booking number
bookingSchema.virtual('formattedBookingNumber').get(function(this: IBooking) {
  return `UAE-${this.bookingNumber}`
})

// Virtual for total duration (including rescheduling)
bookingSchema.virtual('totalReschedulingCount').get(function(this: IBooking) {
  return this.rescheduling.count
})

// Virtual for can be cancelled
bookingSchema.virtual('canBeCancelled').get(function(this: IBooking) {
  const now = new Date()
  const scheduledDateTime = new Date(`${this.scheduledDate.toDateString()} ${this.scheduledTime}`)
  const hoursDifference = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  return ['PENDING', 'CONFIRMED'].includes(this.status) && hoursDifference > 2
})

// Virtual for can be rescheduled
bookingSchema.virtual('canBeRescheduled').get(function(this: IBooking) {
  return ['PENDING', 'CONFIRMED'].includes(this.status) && 
         this.rescheduling.count < this.rescheduling.maxAllowed
})

// Pre-save middleware to generate booking number
bookingSchema.pre('save', function(next) {
  if (this.isNew && !this.bookingNumber) {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    
    this.bookingNumber = `${year}${month}${day}${random}`
  }
  next()
})

// Pre-save middleware to add timeline entry on status change
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: 'SYSTEM'
    })
  }
  next()
})

// Method to update status
bookingSchema.methods.updateStatus = function(
  newStatus: BookingStatus, 
  updatedBy: 'CLIENT' | 'PROVIDER' | 'SYSTEM' | 'ADMIN',
  note?: string
) {
  this.status = newStatus
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy,
    note
  })
  return this.save()
}

// Method to add rescheduling
bookingSchema.methods.addRescheduling = function(
  newDate: Date,
  newTime: string,
  reason: string,
  requestedBy: 'CLIENT' | 'PROVIDER'
) {
  if (this.rescheduling.count >= this.rescheduling.maxAllowed) {
    throw new Error('Maximum reschedule limit reached')
  }
  
  this.rescheduling.history.push({
    originalDate: this.scheduledDate,
    originalTime: this.scheduledTime,
    newDate,
    newTime,
    reason,
    requestedBy,
    requestedAt: new Date()
  })
  
  this.scheduledDate = newDate
  this.scheduledTime = newTime
  this.rescheduling.count++
  
  return this.save()
}

// Method to calculate refund amount
bookingSchema.methods.calculateRefundAmount = function(cancellationHours: number) {
  const { total } = this.pricing
  
  // Free cancellation if more than 24 hours
  if (cancellationHours >= 24) {
    return total
  }
  
  // 50% refund if 2-24 hours
  if (cancellationHours >= 2) {
    return Math.round(total * 0.5)
  }
  
  // No refund if less than 2 hours
  return 0
}

// Static method to find by booking number
bookingSchema.statics.findByBookingNumber = function(bookingNumber: string) {
  return this.findOne({ bookingNumber })
}

// Static method to find upcoming bookings
bookingSchema.statics.findUpcoming = function(userId: string, userType: 'client' | 'provider') {
  const field = userType === 'client' ? 'clientId' : 'providerId'
  const query = {
    [field]: userId,
    status: { $in: ['PENDING', 'CONFIRMED'] },
    scheduledDate: { $gte: new Date() }
  }
  
  return this.find(query).sort({ scheduledDate: 1 })
}

// Static method to find bookings by date range
bookingSchema.statics.findByDateRange = function(
  startDate: Date,
  endDate: Date,
  filters: any = {}
) {
  const query = {
    scheduledDate: {
      $gte: startDate,
      $lte: endDate
    },
    ...filters
  }
  
  return this.find(query).sort({ scheduledDate: 1 })
}

// Static method for analytics
bookingSchema.statics.getAnalytics = function(filters: any = {}) {
  const matchStage = { $match: filters }
  
  return this.aggregate([
    matchStage,
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] }
        },
        totalRevenue: { $sum: '$pricing.total' },
        averageBookingValue: { $avg: '$pricing.total' }
      }
    }
  ])
}

// Prevent re-compilation in development
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema)

export default Booking