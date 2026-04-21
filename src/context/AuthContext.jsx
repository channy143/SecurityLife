import { createContext, useState, useEffect, useCallback } from 'react'
import { getSession, onAuthStateChange, signOut } from '../services/authService'

// Create the authentication context
export const AuthContext = createContext(null)

/**
 * AuthProvider - Manages global authentication state
 * Provides user session data and authentication methods to all children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mfaVerified, setMfaVerified] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session: currentSession, error } = await getSession()
        
        if (error) {
          console.error('Session check error:', error)
        }
        
        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
          // Restore MFA verified state from sessionStorage
          const mfaState = sessionStorage.getItem('mfa_verified')
          if (mfaState === 'true') {
            setMfaVerified(true)
          }
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth state changes
    const subscription = onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession)
        setUser(newSession.user)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setMfaVerified(false)
      } else if (event === 'USER_UPDATED' && newSession) {
        setSession(newSession)
        setUser(newSession.user)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
      setMfaVerified(false)
      sessionStorage.removeItem('mfa_verified')
      sessionStorage.removeItem('mfa_otp')
      sessionStorage.removeItem('mfa_user_id')
      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { error }
    }
  }, [])

  // MFA verification handler
  const verifyMFA = useCallback(() => {
    setMfaVerified(true)
    sessionStorage.setItem('mfa_verified', 'true')
  }, [])

  // Reset MFA (used when logging out or for testing)
  const resetMFA = useCallback(() => {
    setMfaVerified(false)
  }, [])

  // Check if user is fully authenticated (including MFA)
  const isFullyAuthenticated = Boolean(user && mfaVerified)

  // Context value
  const value = {
    user,
    session,
    loading,
    mfaVerified,
    isFullyAuthenticated,
    logout,
    verifyMFA,
    resetMFA,
    isAuthenticated: Boolean(user),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
