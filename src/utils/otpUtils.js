/**
 * OTP Utilities - One-Time Password generation and validation helpers
 */

// Generate a random 6-digit OTP
export const generateRandomOTP = (length = 6) => {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return Math.floor(min + Math.random() * (max - min + 1)).toString()
}

// Generate alphanumeric OTP (more secure)
export const generateAlphanumericOTP = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return otp
}

// Format OTP with spaces for readability (e.g., "123 456")
export const formatOTPForDisplay = (otp) => {
  if (!otp || otp.length !== 6) return otp
  return `${otp.slice(0, 3)} ${otp.slice(3)}`
}

// Validate OTP format (should be numeric and correct length)
export const isValidOTPFormat = (otp, length = 6) => {
  if (!otp || typeof otp !== 'string') return false
  const regex = new RegExp(`^\\d{${length}}$`)
  return regex.test(otp)
}

// Check if OTP is expired
export const isOTPExpired = (generatedAt, expiryMinutes = 5) => {
  const expiryTime = generatedAt + (expiryMinutes * 60 * 1000)
  return Date.now() > expiryTime
}

// Get remaining time for OTP in seconds
export const getOTPRemainingTime = (generatedAt, expiryMinutes = 5) => {
  const expiryTime = generatedAt + (expiryMinutes * 60 * 1000)
  const remainingMs = expiryTime - Date.now()
  return Math.max(0, Math.ceil(remainingMs / 1000))
}

// Format remaining time as mm:ss
export const formatRemainingTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
