import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateOTP, logMFAttempt } from '../services/otpService'
import { useAuth } from '../hooks/useAuth'
import OTPInput from '../components/mfa/OTPInput'
import Loader from '../components/common/Loader'
import { formatRemainingTime, getOTPRemainingTime } from '../utils/otpUtils'

const OTPVerification = () => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const [generatedAt] = useState(Date.now())
  const [displayedOTP, setDisplayedOTP] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [usingRealEmail, setUsingRealEmail] = useState(false)
  
  const navigate = useNavigate()
  const { user, verifyMFA } = useAuth()

  // Get stored OTP and check if email was sent via SMTP
  useEffect(() => {
    const storedOTP = sessionStorage.getItem('mfa_otp')
    const storedEmail = sessionStorage.getItem('mfa_user_email')
    const sentViaEmail = sessionStorage.getItem('mfa_sent_via_email')
    
    if (storedOTP) {
      setDisplayedOTP(storedOTP)
    }
    if (storedEmail) {
      setUserEmail(storedEmail)
    }
    setUsingRealEmail(sentViaEmail === 'true')
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getOTPRemainingTime(generatedAt, 5)
      setCountdown(remaining)
      
      if (remaining === 0) {
        clearInterval(timer)
        setError('OTP has expired. Please login again.')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [generatedAt])

  // Handle OTP completion
  const handleOTPComplete = useCallback(async (enteredOTP) => {
    setOtp(enteredOTP)
    setError('')
    setLoading(true)

    try {
      const userId = user?.id || sessionStorage.getItem('mfa_user_id')
      
      if (!userId) {
        setError('Session expired. Please login again.')
        setLoading(false)
        return
      }

      // Validate the OTP
      const result = validateOTP(userId, enteredOTP)

      if (result.valid) {
        // Log successful MFA
        await logMFAttempt(userId, 'success')
        
        // Clear session storage
        sessionStorage.removeItem('mfa_otp')
        sessionStorage.removeItem('mfa_user_id')
        
        // Mark MFA as verified in context
        verifyMFA()
        
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        // Log failed MFA
        await logMFAttempt(userId, 'failed')
        setError(result.message || 'Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('OTP verification error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, verifyMFA, navigate])

  // Handle manual submit (in case user clicks a button instead of auto-submit)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.length === 6) {
      handleOTPComplete(otp)
    } else {
      setError('Please enter a complete 6-digit code')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit verification code to complete your login.
          </p>
        </div>

        {/* OTP Notice - Real Email or Simulation */}
        {usingRealEmail ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Check your email!</span> We've sent a 6-digit 
              verification code to <span className="font-medium">{userEmail || 'your email'}</span>.
              Please enter it below.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Simulation Mode:</span> Email service not configured. 
              For production, add EmailJS credentials to your .env file. Your test OTP is:
            </p>
            <p className="text-2xl font-bold text-center text-yellow-700 mt-2 font-mono tracking-wider">
              {displayedOTP || '------'}
            </p>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Code expires in: <span className="font-mono font-semibold text-primary-600">{formatRemainingTime(countdown)}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <OTPInput 
            length={6} 
            onComplete={handleOTPComplete} 
            disabled={loading || countdown === 0}
          />

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || otp.length !== 6 || countdown === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size="small" /> : 'Verify Code'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
