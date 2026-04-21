import supabase from './supabaseClient'

/**
 * Authentication Service - Handles all authentication operations with Supabase
 */

// Register a new user with email and password
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error.message)
    return { data: null, error }
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
