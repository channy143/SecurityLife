import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react'
import { resetPassword } from '../services/authService'
import Loader from '../components/common/Loader'
import { BackgroundLines } from '../components/ui/BackgroundLines'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      const { error: resetError } = await resetPassword(email)

      if (resetError) {
        if (resetError.message?.includes('rate limit') || resetError.message?.includes('over email send rate limit')) {
          setError('Too many attempts. Please wait a few minutes before trying again.')
        } else {
          setError(resetError.message || 'Failed to send reset email. Please try again.')
        }
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Forgot password error:', err)
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
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <motion.h1 
                className="text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="block">Check Your</span>
                <span className="block mt-2 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  Email
                </span>
              </motion.h1>
              <motion.p 
                className="text-lg text-primary-100 max-w-md leading-relaxed font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                We've sent a password reset link to your inbox.
              </motion.p>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Sent</h2>
            <p className="text-slate-600 mb-8">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and click the link to reset your password.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.open('https://mail.google.com', '_blank')}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Open Gmail
              </button>
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setSuccess(false)}
                className="text-primary-600 hover:underline font-medium"
              >
                try again
              </button>
            </p>
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
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <motion.h1 
              className="text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="block">Reset Your</span>
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
              Enter your email and we'll send you a link to create a new password.
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
            Forgot Password
          </h2>
          <p className="text-slate-500 mb-8 font-light">
            Enter your email address and we'll send you instructions to reset your password.
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

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-8"
            >
              {loading ? <Loader size="small" /> : (
                <>
                  Send Reset Link
                  <Mail className="w-4 h-4" />
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
            <p className="text-sm text-slate-500">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors border-b-2 border-primary-200 hover:border-primary-600">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword
