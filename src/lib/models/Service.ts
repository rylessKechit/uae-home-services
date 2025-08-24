import mongoose, { Document, Model, Schema } from 'mongoose'
import { ServicePrice } from '@/types'

// Interface for Service Document
export interface IService extends Document {
  _id: string
  providerId: mongoose.Types.ObjectId
  categoryId: string
  name: string
  nameAr?: string
  description: string
  descriptionAr?: string
  shortDescription: string
  images: string[]
  pricing: {
    type: 'FIXED' | 'HOURLY' | 'CUSTOM'
    amount: number
    currency: string
    minAmount?: number
    maxAmount?: number
    discountPercentage?: number
    discountValidUntil?: Date
  }
  duration: {
    estimated: number // minutes
    minimum: number
    maximum?: number
  }
  requirements: {
    clientPresence: boolean
    specialAccess: boolean
    materials?: string[]
    tools?: string[]
    preparations?: string[]
  }
  availability: {
    emirates: string[]
    cities: string[]
    serviceHours: {
      start: string // HH:MM format
      end: string   // HH:MM format
    }
    blackoutDates?: Date[]
    seasonalAvailability?: {
      season: string
      available: boolean
    }[]
  }
  features: {
    tags: string[]
    highlights: string[]
    addOns?: Array<{
      id: string
      name: string
      nameAr?: string
      description: string
      price: number
      required: boolean
    }>
  }
  policies: {
    cancellation: {
      freeUntilHours: number
      chargePercentage: number
    }
    rescheduling: {
      allowedTimes: number
      freeUntilHours: number
    }
    refund: {
      eligibleReasons: string[]
      processingDays: number
    }
  }
  seo: {
    slug: string
    metaTitle?: string
    metaDescription?: string
    keywords: string[]
  }
  statistics: {
    viewCount: number
    bookingCount: number
    completionCount: number
    averageRating: number
    reviewCount: number
    popularityScore: number
  }
  isActive: boolean
  isFeatured: boolean
  isEmergencyService: boolean
  emergencyFee?: number
  createdAt: Date
  updatedAt: Date
}

// Service Schema
const serviceSchema = new Schema<IService>({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: [true, 'Provider ID is required']
  },
  categoryId: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['cleaning', 'maintenance', 'electrical', 'plumbing', 'ac', 'painting', 'gardening', 'pest-control']
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  nameAr: {
    type: String,
    trim: true,
    maxlength: [100, 'Arabic service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  descriptionAr: {
    type: String,
    trim: true,
    maxlength: [2000, 'Arabic description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Image must be a valid URL'
    }
  }],
  pricing: {
    type: {
      type: String,
      enum: ['FIXED', 'HOURLY', 'CUSTOM'],
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Price amount is required'],
      min: [1, 'Price must be greater than 0']
    },
    currency: {
      type: String,
      default: 'AED',
      enum: ['AED']
    },
    minAmount: {
      type: Number,
      validate: {
        validator: function(this: IService, value: number) {
          return !value || value <= this.pricing.amount
        },
        message: 'Minimum amount cannot be greater than base amount'
      }
    },
    maxAmount: {
      type: Number,
      validate: {
        validator: function(this: IService, value: number) {
          return !value || value >= this.pricing.amount
        },
        message: 'Maximum amount cannot be less than base amount'
      }
    },
    discountPercentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%']
    },
    discountValidUntil: Date
  },
  duration: {
    estimated: {
      type: Number,
      required: [true, 'Estimated duration is required'],
      min: [15, 'Duration must be at least 15 minutes']
    },
    minimum: {
      type: Number,
      required: [true, 'Minimum duration is required'],
      min: [15, 'Minimum duration must be at least 15 minutes']
    },
    maximum: {
      type: Number,
      validate: {
        validator: function(this: IService, value: number) {
          return !value || value >= this.duration.minimum
        },
        message: 'Maximum duration cannot be less than minimum duration'
      }
    }
  },
  requirements: {
    clientPresence: {
      type: Boolean,
      default: false
    },
    specialAccess: {
      type: Boolean,
      default: false
    },
    materials: [String],
    tools: [String],
    preparations: [String]
  },
  availability: {
    emirates: [{
      type: String,
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
      required: true
    }],
    cities: [{
      type: String,
      required: true
    }],
    serviceHours: {
      start: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format']
      },
      end: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format']
      }
    },
    blackoutDates: [Date],
    seasonalAvailability: [{
      season: {
        type: String,
        enum: ['spring', 'summer', 'autumn', 'winter']
      },
      available: Boolean
    }]
  },
  features: {
    tags: [{
      type: String,
      trim: true
    }],
    highlights: [{
      type: String,
      trim: true,
      maxlength: [100, 'Highlight cannot exceed 100 characters']
    }],
    addOns: [{
      id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
      },
      name: {
        type: String,
        required: true,
        maxlength: [50, 'Add-on name cannot exceed 50 characters']
      },
      nameAr: {
        type: String,
        maxlength: [50, 'Arabic add-on name cannot exceed 50 characters']
      },
      description: {
        type: String,
        required: true,
        maxlength: [200, 'Add-on description cannot exceed 200 characters']
      },
      price: {
        type: Number,
        required: true,
        min: [0, 'Add-on price cannot be negative']
      },
      required: {
        type: Boolean,
        default: false
      }
    }]
  },
  policies: {
    cancellation: {
      freeUntilHours: {
        type: Number,
        default: 24,
        min: [1, 'Free cancellation must be at least 1 hour before']
      },
      chargePercentage: {
        type: Number,
        default: 50,
        min: [0, 'Cancellation charge cannot be negative'],
        max: [100, 'Cancellation charge cannot exceed 100%']
      }
    },
    rescheduling: {
      allowedTimes: {
        type: Number,
        default: 2,
        min: [1, 'Must allow at least 1 rescheduling']
      },
      freeUntilHours: {
        type: Number,
        default: 12,
        min: [1, 'Free rescheduling must be at least 1 hour before']
      }
    },
    refund: {
      eligibleReasons: [{
        type: String,
        enum: ['service_not_delivered', 'quality_issues', 'provider_no_show', 'technical_issues', 'other']
      }],
      processingDays: {
        type: Number,
        default: 7,
        min: [1, 'Refund processing must be at least 1 day'],
        max: [30, 'Refund processing cannot exceed 30 days']
      }
    }
  },
  seo: {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  statistics: {
    viewCount: { type: Number, default: 0 },
    bookingCount: { type: Number, default: 0 },
    completionCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isEmergencyService: { type: Boolean, default: false },
  emergencyFee: {
    type: Number,
    min: [0, 'Emergency fee cannot be negative'],
    validate: {
      validator: function(this: IService, value: number) {
        return !value || this.isEmergencyService
      },
      message: 'Emergency fee can only be set for emergency services'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
serviceSchema.index({ providerId: 1 })
serviceSchema.index({ categoryId: 1 })
serviceSchema.index({ 'availability.emirates': 1 })
serviceSchema.index({ 'statistics.averageRating': -1 })
serviceSchema.index({ 'statistics.popularityScore': -1 })
serviceSchema.index({ isActive: 1, isFeatured: -1 })
serviceSchema.index({ 'seo.slug': 1 })
serviceSchema.index({ 'features.tags': 1 })

// Virtual for discounted price
serviceSchema.virtual('discountedPrice').get(function(this: IService) {
  if (this.pricing.discountPercentage && (!this.pricing.discountValidUntil || this.pricing.discountValidUntil > new Date())) {
    return Math.round(this.pricing.amount * (1 - this.pricing.discountPercentage / 100))
  }
  return this.pricing.amount
})

// Virtual for completion rate
serviceSchema.virtual('completionRate').get(function(this: IService) {
  if (this.statistics.bookingCount === 0) return 100
  return Math.round((this.statistics.completionCount / this.statistics.bookingCount) * 100)
})

// Pre-save middleware to generate slug
serviceSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

// Method to increment view count
serviceSchema.methods.incrementView = function() {
  this.statistics.viewCount++
  return this.save()
}

// Method to update rating
serviceSchema.methods.updateRating = function(newRating: number) {
  const stats = this.statistics
  const totalRating = stats.averageRating * stats.reviewCount + newRating
  stats.reviewCount++
  stats.averageRating = Number((totalRating / stats.reviewCount).toFixed(1))
  
  // Update popularity score (combination of rating and booking count)
  stats.popularityScore = (stats.averageRating * 0.7) + (Math.log(stats.bookingCount + 1) * 0.3)
  
  return this.save()
}

// Static method to find featured services
serviceSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    isActive: true,
    isFeatured: true
  }).limit(limit).sort({ 'statistics.popularityScore': -1 })
}

// Static method to find services by category
serviceSchema.statics.findByCategory = function(categoryId: string) {
  return this.find({ 
    categoryId,
    isActive: true
  }).sort({ 'statistics.popularityScore': -1 })
}

// Static method to search services
serviceSchema.statics.search = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'features.tags': { $regex: query, $options: 'i' } }
    ]
  }
  
  if (filters.emirate) {
    searchQuery['availability.emirates'] = filters.emirate
  }
  
  if (filters.categoryId) {
    searchQuery.categoryId = filters.categoryId
  }
  
  if (filters.maxPrice) {
    searchQuery['pricing.amount'] = { $lte: filters.maxPrice }
  }
  
  return this.find(searchQuery).sort({ 'statistics.popularityScore': -1 })
}

// Prevent re-compilation in development
const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema)

export default Service