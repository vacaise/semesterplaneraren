
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Common container styles for page content
 */
export const containerStyles = "max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-12"

/**
 * Format a date to a localized string format
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date range as a string (e.g., "Jan 1 - Jan 7, 2023")
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  if (typeof startDate === 'string') {
    startDate = new Date(startDate)
  }
  if (typeof endDate === 'string') {
    endDate = new Date(endDate)
  }
  
  // If same year, only show year once
  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

/**
 * Format a number of days in a readable format (e.g., "5 days" or "1 day")
 */
export function formatDaysCount(count: number): string {
  return count === 1 ? `${count} day` : `${count} days`
}
