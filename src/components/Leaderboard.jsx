import { useState, useEffect } from 'react'
import { dbOperations } from '../supabaseClient'

const Leaderboard = ({ gameResult, onBackToGame }) => {
  const [dailyLeaderboard, setDailyLeaderboard] = useState([])
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showScoreForm, setShowScoreForm] = useState(false)
  const [formData, setFormData] = useState({ nickname: '', section: '' })
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('daily')

  const { won, guesses } = gameResult || {}

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

  const handleSubmitScore = async (e) => {
    e.preventDefault()
    
    if (!formData.nickname.trim() || !formData.section.trim()) {
      setMessage('Please fill in both nickname and section')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Check if user already submitted today
      const { hasSubmitted, error: checkError } = await dbOperations.hasSubmittedToday(
        formData.nickname.trim(),
        today
      )

      if (checkError) {
        setMessage('Error checking submission. Please try again.')
        return
      }

      if (hasSubmitted) {
        setMessage('You have already submitted a score today with this nickname.')
        return
      }

      // Submit score
      const { error: submitError } = await dbOperations.submitScore(
        formData.nickname.trim(),
        formData.section.trim(),
        guesses,
        won,
        today
      )

      if (submitError) {
        setMessage('Error submitting score. Please try again.')
        return
      }

      setMessage('Score submitted successfully!')
      setShowScoreForm(false)
      
      // Reload leaderboards
      setTimeout(() => {
        loadLeaderboards()
      }, 1000)

    } catch (error) {
      setMessage('Error submitting score. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const renderDailyLeaderboard = () => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-center mb-4">Today's Best Scores</h3>
      {dailyLeaderboard.length === 0 ? (
        <p className="text-center text-gray-500">No scores yet today!</p>
      ) : (
        dailyLeaderboard.map((score, index) => (
          <div key={score.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
              <div>
                <div className="font-semibold">{score.nickname}</div>
                <div className="text-sm text-gray-600">{score.section}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600">{score.guesses}</div>
              <div className="text-xs text-gray-500">guesses</div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderMonthlyLeaderboard = () => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-center mb-4">Monthly Rankings</h3>
      {monthlyLeaderboard.length === 0 ? (
        <p className="text-center text-gray-500">No monthly data yet!</p>
      ) : (
        monthlyLeaderboard.map((score, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
              <div>
                <div className="font-semibold">{score.nickname}</div>
                <div className="text-sm text-gray-600">{score.section}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">{score.totalGuesses}</div>
              <div className="text-xs text-gray-500">
                {score.gamesPlayed} {score.gamesPlayed === 1 ? 'game' : 'games'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
        <button
          onClick={onBackToGame}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Game
        </button>
      </div>

      {/* Score Submission Form */}
      {gameResult && !showScoreForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Submit Your Score</h2>
          <p className="mb-3">
            {won 
              ? `Great job! You solved it in ${guesses} ${guesses === 1 ? 'guess' : 'guesses'}!`
              : `You used ${guesses} guesses. Submit your score to compete!`
            }
          </p>
          <button
            onClick={() => setShowScoreForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Score
          </button>
        </div>
      )}

      {showScoreForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Enter Your Details</h2>
          <form onSubmit={handleSubmitScore} className="space-y-3">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your nickname"
                required
              />
            </div>
            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <input
                type="text"
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Trumpet, Drums, Guitar"
                required
              />
            </div>
            {message && (
              <div className={`p-2 rounded text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Score'}
              </button>
              <button
                type="button"
                onClick={() => setShowScoreForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'daily'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Daily Rankings
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'monthly'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Monthly Rankings
        </button>
      </div>

      {/* Leaderboard Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading leaderboards...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'daily' ? renderDailyLeaderboard() : renderMonthlyLeaderboard()}
        </div>
      )}
    </div>
  )
}

export default Leaderboard 