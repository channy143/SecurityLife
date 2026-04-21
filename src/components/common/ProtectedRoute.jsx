import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from './Loader'

/**
 * ProtectedRoute - Wraps routes that require authentication and MFA verification
 * Redirects to login if not authenticated, or to OTP if MFA not completed
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isFullyAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen />
  }

  // Not authenticated at all - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Authenticated but MFA not verified - redirect to OTP
  if (!isFullyAuthenticated) {
    return <Navigate to="/otp" state={{ from: location }} replace />
  }

  // Fully authenticated - render the protected content
  return children
}

export default ProtectedRoute
