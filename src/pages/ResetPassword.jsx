import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle, Lock, AlertTriangle } from 'lucide-react'
import { validatePassword } from '../utils/passwordUtils'
import Loader from '../components/common/Loader'
import PasswordStrengthBar from '../components/password/PasswordStrengthBar'
import { calculatePasswordStrength } from '../utils/passwordUtils'
import { BackgroundLines } from '../components/ui/BackgroundLines'
import supabase from '../services/supabaseClient'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [hasRecoveryToken, setHasRecoveryToken] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)
  
  const navigate = useNavigate()

  const { score, strength } = calculatePasswordStrength(password)

  // Process recovery token from URL hash on mount
  useEffect(() => {
    // Listen for auth state changes - Supabase will emit SIGNED_IN when it parses the recovery token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? 'has session' : 'no session')
      
      if (event === 'SIGNED_IN' && session) {
        console.log('Recovery session established via auth state change')
        setHasRecoveryToken(true)
        setCheckingToken(false)
      } else if (event === 'INITIAL_SESSION') {
        // Check if we have a session
        if (session) {
          console.log('Initial session found')
          setHasRecoveryToken(true)
        }
        setCheckingToken(false)
      }
    })

    // Also check for hash and try to get session immediately
    const hash = window.location.hash
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
      console.log('Found recovery hash in URL')
      // Force Supabase to parse the hash by calling getSession
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error)
          setError('Invalid or expired reset link. Please request a new password reset.')
          setHasRecoveryToken(false)
        } else if (session) {
          console.log('Session found via getSession')
          setHasRecoveryToken(true)
        }
        setCheckingToken(false)
      })
    } else {
      console.log('No recovery hash found')
      setCheckingToken(false)
      setHasRecoveryToken(false)
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    const validation = validatePassword(password)
    if (!validation.isValid) {
      setError(validation.message)
      return
    }

    setLoading(true)

    try {
      // Directly call supabase.auth.updateUser
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error('Update password error:', updateError)
        setError(updateError.message || 'Failed to update password. Please try again.')
        setLoading(false)
        return
      }

      console.log('Password updated successfully:', data)
      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      console.error('Reset password exception:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex">
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <motion.h1 
                className="text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="block">Password</span>
                <span className="block mt-2 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  Updated
                </span>
              </motion.h1>
            </motion.div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-white">
          <motion.div 
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Password Reset Complete</h2>
            <p className="text-slate-600 mb-8">
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Go to Login
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
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
              <Lock className="w-8 h-8 text-white" />
            </div>
            <motion.h1 
              className="text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="block">Create New</span>
              <span className="block mt-2 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                Password
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg text-primary-100 max-w-md leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Enter your new password below.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-white">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SecureLife</span>
          </div>

          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Set New Password
          </h2>
          <p className="text-slate-500 mb-8 font-light">
            Create a strong password for your account.
          </p>

          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </motion.div>
          )}

          {!checkingToken && !hasRecoveryToken && (
            <motion.div 
              className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 flex items-start gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Invalid or Expired Link</p>
                <p className="text-sm mt-1">
                  This reset link may have expired or is invalid. Please{' '}
                  <Link to="/forgot-password" className="underline font-semibold hover:text-amber-900">
                    request a new one
                  </Link>.
                </p>
              </div>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
                placeholder="New password"
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
                transition={{ delay: 0.45 }}
              >
                <PasswordStrengthBar score={score} strength={strength} />
              </motion.div>
            )}

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
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
                placeholder="Confirm new password"
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
              transition={{ delay: 0.55 }}
            >
              Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.
            </motion.p>

            <motion.button
              type="submit"
              disabled={loading || checkingToken || !hasRecoveryToken}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-8"
            >
              {loading ? <Loader size="small" /> : (
                <>
                  Update Password
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPassword
