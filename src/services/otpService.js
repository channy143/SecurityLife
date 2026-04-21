import supabase from './supabaseClient'
import { sendOTPEmail, isEmailServiceAvailable } from './emailService'

/**
 * OTP Service - Handles OTP generation, validation, and logging
 */

// Store OTP temporarily (in-memory storage for simulation when email fails)
const otpStorage = new Map()
let smtpAvailable = null

// Check SMTP availability on first use
const checkSmtpAvailability = async () => {
  if (smtpAvailable === null) {
    smtpAvailable = await isEmailServiceAvailable()
  }
  return smtpAvailable
}

// Generate and store OTP for a user
export const generateOTP = async (userId, userEmail = '', userName = '') => {
  // Generate a 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Store OTP with expiration (5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000
  otpStorage.set(userId, { otp, expiresAt, email: userEmail })
  
  // Try to send email via SMTP
  if (userEmail) {
    const smtpReady = await checkSmtpAvailability()
    if (smtpReady) {
      const result = await sendOTPEmail(userEmail, otp, userName)
      if (!result.success) {
        console.warn('SMTP failed, OTP available in simulation mode:', result.error?.message)
      }
      return { otp, sentViaEmail: result.success }
    }
  }
  
  return { otp, sentViaEmail: false }
}

// Check if SMTP email is available
export const isUsingRealEmail = async () => {
  return await checkSmtpAvailability()
}

// Validate OTP for a user
export const validateOTP = (userId, inputOTP) => {
  const storedData = otpStorage.get(userId)
  
  if (!storedData) {
    return { valid: false, message: 'OTP expired or not generated' }
  }
  
  const { otp, expiresAt } = storedData
  
  // Check if OTP has expired
  if (Date.now() > expiresAt) {
    otpStorage.delete(userId)
    return { valid: false, message: 'OTP has expired' }
  }
  
  // Validate OTP
  if (otp === inputOTP) {
    otpStorage.delete(userId) // Clear OTP after successful validation
    return { valid: true, message: 'OTP validated successfully' }
  }
  
  return { valid: false, message: 'Invalid OTP' }
}

// Clear OTP for a user
export const clearOTP = (userId) => {
  otpStorage.delete(userId)
}

// Log MFA attempt to database
export const logMFAttempt = async (userId, status) => {
  try {
    const { data, error } = await supabase
      .from('mfa_logs')
      .insert([
        {
          user_id: userId,
          status: status,
        }
      ])
      .select()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Log MFA attempt error:', error.message)
    return { data: null, error }
  }
}

// Get MFA logs for a specific user
export const getMFALogs = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('mfa_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get MFA logs error:', error.message)
    return { data: null, error }
  }
}

// Get the latest MFA log for a user
export const getLatestMFALog = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('mfa_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get latest MFA log error:', error.message)
    return { data: null, error }
  }
}
