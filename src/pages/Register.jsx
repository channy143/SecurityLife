import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Mail, CheckCircle, ArrowRight, Eye, EyeOff, UserPlus, AlertTriangle, Loader2 } from 'lucide-react'
import { signUp, resendConfirmationEmail } from '../services/authService'
import { validatePassword } from '../utils/passwordUtils'
import { isSupabaseConfigured } from '../services/supabaseClient'
import Loader from '../components/common/Loader'
import PasswordStrengthBar from '../components/password/PasswordStrengthBar'
import { calculatePasswordStrength } from '../utils/passwordUtils'
import { BackgroundLines } from '../components/ui/BackgroundLines'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [supabaseReady, setSupabaseReady] = useState(true)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [emailConfirmed, setEmailConfirmed] = useState(false)

  const navigate = useNavigate()

  // Check if Supabase is configured
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSupabaseReady(false)
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
    }
  }, [])

  // Calculate password strength for display
  const { score, strength } = calculatePasswordStrength(password)

  // Handle resend confirmation email
  const handleResendConfirmation = async () => {
    setResending(true)
    setResendMessage('')
    
    const { error } = await resendConfirmationEmail(email)
    
    if (error) {
      setResendMessage(`Failed to resend: ${error.message}`)
    } else {
      setResendMessage('Confirmation email resent! Please check your inbox.')
    }
    
    setResending(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }

      // Validate password
      const passwordValidation = validatePassword(password, confirmPassword)
      if (!passwordValidation.isValid) {
        setError(passwordValidation.errors.join('. '))
        setLoading(false)
        return
      }

      // Register with Supabase
      const { data, error: signUpError } = await signUp(email, password)

      if (signUpError) {
        setError(signUpError.message || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      if (data?.user) {
        setSuccess(true)
        // Check if email is already confirmed (confirmation disabled in Supabase)
        const isConfirmed = data.user.email_confirmed_at !== null
        setEmailConfirmed(isConfirmed)
        
        // Redirect faster if email is already confirmed
        const redirectDelay = isConfirmed ? 3000 : 10000
        setTimeout(() => {
          navigate('/login')
        }, redirectDelay)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          <motion.div 
            className="max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-center">
                <motion.div 
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-10 h-10 text-primary-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Account Created</h2>
              </div>
              
              {/* Success Message - Conditional based on email confirmation */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {emailConfirmed ? (
                    // Email already confirmed - show simple success
                    <>
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Ready to Go!
                      </h3>
                      <p className="text-slate-600 mb-6">
                        Your account <strong>{email}</strong> has been created and is ready to use.
                      </p>
                      
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Go to Login
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    // Email not confirmed - show confirmation message
                    <>
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Confirm Your Email
                      </h3>
                      <p className="text-slate-600 mb-6">
                        We've sent a confirmation link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => window.open('https://mail.google.com', '_blank')}
                          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                          Open Gmail
                        </button>
                        
                        <button
                          onClick={() => navigate('/login')}
                          className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-colors"
                        >
                          Go to Login
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {resendMessage && (
                        <p className={`text-sm mt-4 ${resendMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                          {resendMessage}
                        </p>
                      )}
                      
                      <p className="text-sm text-slate-500 mt-6">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button 
                          onClick={handleResendConfirmation}
                          disabled={resending}
                          className="text-primary-600 hover:underline font-medium disabled:opacity-50"
                        >
                          {resending ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            'resend confirmation'
                          )}
                        </button>
                      </p>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
            
            {/* Auto-redirect notice */}
            <motion.p 
              className="text-center text-slate-500 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You will be redirected to login in a few seconds...
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Blue Gradient with Pattern */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <BackgroundLines className="absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-center px-20 xl:px-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <motion.h1 
              className="text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="block">Start Your</span>
              <span className="block mt-2 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                Secure Journey
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg text-primary-100 max-w-md leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Join thousands protecting their digital lives. Free forever, no hidden fees.
            </motion.p>
          </motion.div>
          
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div 
          className="w-full max-w-md py-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SecureLife</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 mb-8 font-light">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors border-b-2 border-primary-200 hover:border-primary-600">
                Sign in
              </Link>
            </p>
          </motion.div>

          {error && (
            <motion.div 
              className={`${!supabaseReady ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-xl mb-6 flex items-start gap-3`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!supabaseReady ? (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
              )}
              <div className="text-sm">
                {error}
                {!supabaseReady && (
                  <p className="mt-2 text-xs opacity-75">
                    To fix this, add your Supabase credentials in your Netlify/Vercel environment variables or .env file.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3.5 border-0 border-b-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-0 transition-colors"
                placeholder="Email address"
              />
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3.5 border-0 border-b-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-0 transition-colors pr-12"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </motion.div>
            
            {password && (
              <motion.div 
                className="px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <PasswordStrengthBar score={score} strength={strength} />
              </motion.div>
            )}

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3.5 border-0 border-b-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-0 transition-colors pr-12"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </motion.div>

            <motion.p 
              className="text-xs text-slate-500 px-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.
            </motion.p>

            <motion.button
              type="submit"
              disabled={loading || !supabaseReady}
              whileHover={{ scale: supabaseReady ? 1.02 : 1 }}
              whileTap={{ scale: supabaseReady ? 0.98 : 1 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-8"
            >
              {loading ? <Loader size="small" /> : (
                <>
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-slate-400 tracking-wide">
              By signing up, you agree to our{' '}
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Privacy</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
