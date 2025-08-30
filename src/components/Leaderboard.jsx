import { useState, useEffect } from 'react'
import { dbOperations } from '../supabaseClient'

const Leaderboard = ({ onBackToGame }) => {
  const [dailyLeaderboard, setDailyLeaderboard] = useState([])
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('daily')

  useEffect(() => {
    loadLeaderboards()
  }, [])

  const loadLeaderboards = async () => {
    setLoading(true)
    try {
      const [dailyResult, monthlyResult] = await Promise.all([
        dbOperations.getDailyLeaderboard(),
        dbOperations.getMonthlyLeaderboard()
      ])

      if (dailyResult.error) {
        console.error('Error loading daily leaderboard:', dailyResult.error)
      } else {
        setDailyLeaderboard(dailyResult.data || [])
      }

      if (monthlyResult.error) {
        console.error('Error loading monthly leaderboard:', monthlyResult.error)
      } else {
        setMonthlyLeaderboard(monthlyResult.data || [])
      }
    } catch (error) {
      console.error('Error loading leaderboards:', error)
    } finally {
      setLoading(false)
    }
  }



  const renderDailyLeaderboard = () => (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Today's Best Scores</h3>
      {dailyLeaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No scores yet today!</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to play!</p>
        </div>
      ) : (
        dailyLeaderboard.map((score, index) => (
          <div key={score.id} className="score-card">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className={`rank-badge ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                  {index + 1}
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-800">{score.nickname}</div>
                  <div className="text-sm text-gray-600">{score.section}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl text-green-600">{score.guesses}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">guesses</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderMonthlyLeaderboard = () => (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Monthly Rankings</h3>
      {monthlyLeaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No monthly data yet!</p>
          <p className="text-gray-400 text-sm mt-2">Play more games to see rankings!</p>
        </div>
      ) : (
        monthlyLeaderboard.map((score, index) => {
          // Determine medal class based on rank
          let medalClass = 'medal-regular'
          if (index === 0) medalClass = 'medal-gold'
          else if (index === 1) medalClass = 'medal-silver'
          else if (index === 2) medalClass = 'medal-bronze'
          
          return (
            <div key={index} className={`score-card ${medalClass}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className={`rank-badge ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-lg">{score.nickname}</div>
                    <div className="text-sm opacity-80">{score.section}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl">{score.totalGuesses}</div>
                  <div className="text-xs opacity-80 uppercase tracking-wide">
                    {score.gamesPlayed} {score.gamesPlayed === 1 ? 'game' : 'games'}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div className="min-h-screen p-6">
      <div className="leaderboard-container max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={loadLeaderboards}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? 'Loading...' : '🔄 Refresh'}
            </button>
            <button
              onClick={onBackToGame}
              className="btn-secondary"
            >
              ← Back to Game
            </button>
          </div>
        </div>





        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('daily')}
            className={`tab-button ${activeTab === 'daily' ? 'active' : 'inactive'}`}
          >
            Daily Rankings
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`tab-button ${activeTab === 'monthly' ? 'active' : 'inactive'}`}
          >
            Monthly Rankings
          </button>
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading leaderboards...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'daily' ? renderDailyLeaderboard() : renderMonthlyLeaderboard()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard 