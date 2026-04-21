import supabase from './supabaseClient'

/**
 * Password Service - Handles saving and retrieving password analysis logs
 */

// Save a password strength analysis result
export const savePasswordLog = async (userId, passwordScore, strength) => {
  try {
    const { data, error } = await supabase
      .from('password_logs')
      .insert([
        {
          user_id: userId,
          password_score: passwordScore,
          strength: strength,
        }
      ])
      .select()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Save password log error:', error.message)
    return { data: null, error }
  }
}

// Get password logs for a specific user
export const getPasswordLogs = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('password_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get password logs error:', error.message)
    return { data: null, error }
  }
}

// Get the latest password log for a user
export const getLatestPasswordLog = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('password_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

    return { data, error: null }
  } catch (error) {
    console.error('Get latest password log error:', error.message)
    return { data: null, error }
  }
}
