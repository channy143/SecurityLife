import supabase, { isSupabaseConfigured } from './supabaseClient'

/**
 * Authentication Service - Handles all authentication operations with Supabase
 */

// Register a new user with email and password
export const signUp = async (email, password) => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: {
          message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
        }
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })

    if (error) throw error

    // Log whether email confirmation was sent
    if (data?.user?.identities?.length === 0) {
      console.log('User exists but not confirmed - email confirmation may have been resent')
    } else if (data?.user?.email_confirmed_at) {
      console.log('User created and email already confirmed')
    } else {
      console.log('User created, confirmation email should be sent')
    }

    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error.message)
    return { data: null, error }
  }
}

// Resend confirmation email
export const resendConfirmationEmail = async (email) => {
  try {
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: 'Supabase is not configured.'
        }
      }
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Resend confirmation error:', error.message)
    return { error }
  }
}

// Sign in existing user with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Sign in error:', error.message)
    return { data: null, error }
  }
}

// Sign out the current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error.message)
    return { error }
  }
}

// Get the current session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    return { session, error: null }
  } catch (error) {
    console.error('Get session error:', error.message)
    return { session: null, error }
  }
}

// Get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error

    return { user, error: null }
  } catch (error) {
    console.error('Get user error:', error.message)
    return { user: null, error }
  }
}

// Listen for auth state changes
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

// Send password reset email
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Reset password error:', error.message)
    return { data: null, error }
  }
}

// Update user password (used after reset)
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Update password error:', error.message)
    return { data: null, error }
  }
}
