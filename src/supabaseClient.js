import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const dbOperations = {
  // Submit a score
  async submitScore(nickname, section, guesses, solved, date) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert([
          {
            nickname,
            section,
            guesses,
            solved,
            date
          }
        ])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error submitting score:', error)
      return { data: null, error }
    }
  },

  // Get today's leaderboard (fewest guesses)
  async getDailyLeaderboard() {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('date', today)
        .eq('solved', true)
        .order('guesses', { ascending: true })
        .limit(20)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching daily leaderboard:', error)
      return { data: null, error }
    }
  },

  // Get monthly leaderboard (total guesses)
  async getMonthlyLeaderboard() {
    try {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .gte('date', firstDayOfMonth.toISOString().split('T')[0])
        .lte('date', lastDayOfMonth.toISOString().split('T')[0])
        .eq('solved', true)

      if (error) throw error

      // Group by nickname+section and sum guesses
      const groupedData = data.reduce((acc, score) => {
        const key = `${score.nickname} – ${score.section}`
        if (!acc[key]) {
          acc[key] = { nickname: score.nickname, section: score.section, totalGuesses: 0, gamesPlayed: 0 }
        }
        acc[key].totalGuesses += score.guesses
        acc[key].gamesPlayed += 1
        return acc
      }, {})

      // Convert to array and sort by total guesses
      const sortedData = Object.values(groupedData)
        .sort((a, b) => a.totalGuesses - b.totalGuesses)
        .slice(0, 20)

      return { data: sortedData, error: null }
    } catch (error) {
      console.error('Error fetching monthly leaderboard:', error)
      return { data: null, error }
    }
  },

  // Check if user already submitted today
  async hasSubmittedToday(nickname, date) {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('id')
        .eq('nickname', nickname)
        .eq('date', date)
        .limit(1)

      if (error) throw error
      return { hasSubmitted: data && data.length > 0, error: null }
    } catch (error) {
      console.error('Error checking submission:', error)
      return { hasSubmitted: false, error }
    }
  }
} 