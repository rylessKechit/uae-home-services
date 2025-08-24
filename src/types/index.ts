// User Types
export interface User {
  id: string
  email: string
  name: string
  image?: string
  phone?: string
  role: UserRole
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN'

// Provider Types
export interface Provider extends User {
  role: 'PROVIDER'
  business: {
    name: string
    description: string
    documents: Document[]
    isVerified: boolean
    verificationStatus: VerificationStatus
  }
  services: Service[]
  availability: Availability[]
  location: Location
  rating: number
  reviewCount: number
  completedJobs: number
}

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'

// Service Types
export interface Service {
  id: string
  providerId: string
  categoryId: string
  name: string
  nameAr?: string
  description: string
  descriptionAr?: string
  price: ServicePrice
  duration: number // minutes
  images: string[]
  isActive: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ServicePrice {
  type: 'FIXED' | 'HOURLY' | 'CUSTOM'
  amount: number
  currency: string
  minAmount?: number
  maxAmount?: number
}

// Booking Types
export interface Booking {
  id: string
  clientId: string
  providerId: string
  serviceId: string
  status: BookingStatus
  scheduledDate: Date
  scheduledTime: string
  duration: number
  location: BookingLocation
  price: {
    subtotal: number
    commission: number
    total: number
    currency: string
  }
  notes?: string
  instructions?: string
  completedAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED'
  | 'NO_SHOW'

export interface BookingLocation {
  address: string
  emirate: string
  city: string
  coordinates?: {
    lat: number
    lng: number
  }
  buildingDetails?: string
  apartmentNumber?: string
}

// Location Types
export interface Location {
  emirate: string
  city: string
  area?: string
  coordinates?: {
    lat: number
    lng: number
  }
  serviceRadius: number // in kilometers
}

// Availability Types
export interface Availability {
  id: string
  providerId: string
  dayOfWeek: number // 0-6 (Sunday to Saturday)
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isActive: boolean
}

export interface TimeSlot {
  date: Date
  startTime: string
  endTime: string
  isAvailable: boolean
  isBlocked?: boolean
}

// Review Types
export interface Review {
  id: string
  bookingId: string
  clientId: string
  providerId: string
  rating: number // 1-5
  comment?: string
  images?: string[]
  response?: {
    text: string
    createdAt: Date
  }
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// Payment Types
export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  transactionId?: string
  gatewayResponse?: any
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type PaymentMethod = 'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'TELR'

// Document Types
export interface Document {
  id: string
  type: DocumentType
  name: string
  url: string
  status: DocumentStatus
  uploadedAt: Date
  verifiedAt?: Date
}

export type DocumentType = 
  | 'EMIRATES_ID' 
  | 'PASSPORT' 
  | 'VISA' 
  | 'LICENSE' 
  | 'INSURANCE'
  | 'CERTIFICATE'

export type DocumentStatus = 'UPLOADED' | 'VERIFIED' | 'REJECTED'

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  titleAr?: string
  message: string
  messageAr?: string
  data?: any
  isRead: boolean
  createdAt: Date
}

export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_REMINDER'
  | 'PAYMENT_SUCCESS'
  | 'REVIEW_RECEIVED'
  | 'PROVIDER_VERIFIED'
  | 'SYSTEM_UPDATE'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Search & Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  emirate?: string
  city?: string
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  availability?: {
    date: Date
    time?: string
  }
  sortBy?: 'rating' | 'price' | 'distance' | 'reviews'
  sortOrder?: 'asc' | 'desc'
}

// Analytics Types
export interface Analytics {
  bookings: {
    total: number
    completed: number
    cancelled: number
    revenue: number
  }
  providers: {
    total: number
    verified: number
    active: number
  }
  clients: {
    total: number
    active: number
  }
  growth: {
    bookings: number
    revenue: number
    providers: number
    clients: number
  }
}