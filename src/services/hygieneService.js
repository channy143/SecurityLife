import supabase from './supabaseClient'

/**
 * Hygiene Service - Handles saving and retrieving cyber hygiene assessment results
 */

// Save a hygiene assessment result
export const saveHygieneResult = async (userId, score, riskLevel, recommendations) => {
  try {
    const { data, error } = await supabase
      .from('hygiene_results')
      .insert([
        {
          user_id: userId,
          score: score,
          risk_level: riskLevel,
          recommendations: recommendations,
        }
      ])
      .select()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Save hygiene result error:', error.message)
    return { data: null, error }
  }
}

// Get hygiene results for a specific user
export const getHygieneResults = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('hygiene_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get hygiene results error:', error.message)
    return { data: null, error }
  }
}

// Get the latest hygiene result for a user
export const getLatestHygieneResult = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('hygiene_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return { data, error: null }
  } catch (error) {
    console.error('Get latest hygiene result error:', error.message)
    return { data: null, error }
  }
}
