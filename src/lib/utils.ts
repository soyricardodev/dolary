import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(num: number, locale = "es-VE", digits = 2): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(num)
}

// Function to get Venezuela time
export function getVenezuelaTime(): Date {
  const now = new Date()
  // Venezuela is UTC-4
  return new Date(now.getTime() - 4 * 60 * 60 * 1000)
}

// Function to check if we should refetch based on Venezuela time
export function shouldRefetch(): boolean {
  const venezuelaTime = getVenezuelaTime()
  const day = venezuelaTime.getDay()
  const hour = venezuelaTime.getHours()

  // Only refetch on weekdays (Monday-Friday)
  if (day === 0 || day === 6) return false

  // BCV updates around 3-4pm
  const isBcvUpdateTime = hour >= 15 && hour < 16

  // Paralelo updates around 9am and 1pm
  const isParaleloMorningUpdateTime = hour >= 9 && hour < 10
  const isParaleloAfternoonUpdateTime = hour >= 13 && hour < 14

  return isBcvUpdateTime || isParaleloMorningUpdateTime || isParaleloAfternoonUpdateTime
}

