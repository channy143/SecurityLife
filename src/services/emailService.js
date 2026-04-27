/**
 * Email Service - Sends OTP emails via Netlify Functions
 * 
 * SETUP:
 * 1. Add SMTP credentials to Netlify Environment Variables:
 *    - SMTP_HOST (default: smtp.gmail.com)
 *    - SMTP_PORT (default: 587)
 *    - SMTP_USER (your email)
 *    - SMTP_PASS (your app password)
 * 2. Deploy to Netlify - functions are auto-deployed
 * 3. Frontend will automatically use real email instead of simulation
 * 
 * For local development with separate SMTP server:
 * Set VITE_SMTP_API_URL=http://localhost:3001 in .env
 */

// SMTP Backend API URL - Netlify Functions or custom SMTP server
const SMTP_API_URL = import.meta.env.VITE_SMTP_API_URL || ''

// Determine the base URL for API calls
const getBaseUrl = () => {
  // If custom SMTP server URL is set, use it
  if (SMTP_API_URL) return SMTP_API_URL
  
  // Otherwise use Netlify Functions (same origin)
  return ''
}

/**
 * Send OTP code to user's email via SMTP backend
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - The OTP code to send
 * @param {string} userName - User's name (optional)
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const sendOTPEmail = async (toEmail, otpCode, userName = '') => {
  try {
    console.log('Sending OTP via SMTP backend...')
    
    const response = await fetch(`${getBaseUrl()}/.netlify/functions/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toEmail,
        otpCode,
        userName
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    console.log('OTP email sent successfully via SMTP')
    return { success: true, error: null }
  } catch (error) {
    console.error('Failed to send OTP via SMTP:', error)
    return { success: false, error }
  }
}

/**
 * Check if SMTP backend is available
 * @returns {Promise<boolean>}
 */
export const isEmailServiceAvailable = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/.netlify/functions/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    })
    const data = await response.json()
    return data.smtpConfigured === true
  } catch {
    return false
  }
}

// For backward compatibility - check synchronously (will try SMTP, fall back if fails)
export const checkEmailServiceSync = () => {
  // Always return true to attempt SMTP first
  // Will fall back to simulation if SMTP fails
  return true
}

export default {
  sendOTPEmail,
  isEmailServiceAvailable,
  checkEmailServiceSync
}
