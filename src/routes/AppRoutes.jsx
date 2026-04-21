import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import OTPVerification from '../pages/OTPVerification'
import PasswordChecker from '../pages/PasswordChecker'
import CyberHygiene from '../pages/CyberHygiene'
import Dashboard from '../pages/Dashboard'

/**
 * AppRoutes - Defines all routes for the application
 * Protected routes require authentication and MFA verification
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OTPVerification />} />
      
      {/* Semi-Public Routes - Available without auth but enhanced with auth */}
      <Route path="/password-checker" element={<PasswordChecker />} />
      <Route path="/cyber-hygiene" element={<CyberHygiene />} />
      
      {/* Protected Routes - Require full authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default AppRoutes
