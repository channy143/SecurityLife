/**
 * Email Service - Sends OTP emails via SMTP backend
 * 
 * SETUP:
 * 1. cd server && npm install
 * 2. Create server/.env with your SMTP credentials
 * 3. npm start (starts SMTP server on port 3001)
 * 4. Frontend will automatically use SMTP instead of simulation
 */

// SMTP Backend API URL
const SMTP_API_URL = import.meta.env.VITE_SMTP_API_URL || 'http://localhost:3001'

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
    
    const response = await fetch(`${SMTP_API_URL}/api/send-otp`, {
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
    const response = await fetch(`${SMTP_API_URL}/api/health`, {
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
