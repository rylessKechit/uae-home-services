import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'AED'): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date, locale = 'en-AE'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date, locale = 'en-AE'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneUAE(phone: string): boolean {
  const phoneRegex = /^(\+971|0)?[1-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(date)
}

export const UAE_EMIRATES = [
  { code: 'DU', name: 'Dubai', nameAr: 'دبي' },
  { code: 'AD', name: 'Abu Dhabi', nameAr: 'أبوظبي' },
  { code: 'SH', name: 'Sharjah', nameAr: 'الشارقة' },
  { code: 'AJ', name: 'Ajman', nameAr: 'عجمان' },
  { code: 'UQ', name: 'Umm Al Quwain', nameAr: 'أم القيوين' },
  { code: 'RK', name: 'Ras Al Khaimah', nameAr: 'رأس الخيمة' },
  { code: 'FJ', name: 'Fujairah', nameAr: 'الفجيرة' },
] as const

export const SERVICE_CATEGORIES = [
  { id: 'cleaning', name: 'Cleaning', nameAr: 'تنظيف', icon: '🧹' },
  { id: 'maintenance', name: 'Maintenance', nameAr: 'صيانة', icon: '🔧' },
  { id: 'electrical', name: 'Electrical', nameAr: 'كهرباء', icon: '⚡' },
  { id: 'plumbing', name: 'Plumbing', nameAr: 'سباكة', icon: '🚿' },
  { id: 'ac', name: 'AC Services', nameAr: 'خدمات التكييف', icon: '❄️' },
  { id: 'painting', name: 'Painting', nameAr: 'دهان', icon: '🎨' },
  { id: 'gardening', name: 'Gardening', nameAr: 'بستنة', icon: '🌱' },
  { id: 'pest-control', name: 'Pest Control', nameAr: 'مكافحة الآفات', icon: '🐛' },
] as const