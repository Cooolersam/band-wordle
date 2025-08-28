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
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false)

  const { won, guesses } = gameResult || {}

  useEffect(() => {
    loadLeaderboards()
  }, [])

  // Check submission status when gameResult changes
  useEffect(() => {
    if (gameResult && formData.nickname) {
      checkSubmissionStatus()
    }
  }, [gameResult, formData.nickname])

  const checkSubmissionStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { hasSubmitted } = await dbOperations.hasSubmittedToday(
        formData.nickname.trim(),
        today
      )
      setHasSubmittedToday(hasSubmitted)
    } catch (error) {
      console.error('Error checking submission status:', error)
    }
  }

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

      // Check if current user has already submitted today
      if (gameResult && formData.nickname) {
        const today = new Date().toISOString().split('T')[0]
        const { hasSubmitted } = await dbOperations.hasSubmittedToday(
          formData.nickname.trim(),
          today
        )
        setHasSubmittedToday(hasSubmitted)
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

    // Additional safety check to prevent double submission
    if (hasSubmittedToday) {
      setMessage('You have already submitted a score today.')
      setShowScoreForm(false)
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
      setHasSubmittedToday(true) // Prevent further submissions
      
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
        monthlyLeaderboard.map((score, index) => (
          <div key={index} className="score-card">
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
                <div className="font-bold text-2xl text-blue-600">{score.totalGuesses}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {score.gamesPlayed} {score.gamesPlayed === 1 ? 'game' : 'games'}
                </div>
              </div>
            </div>
          </div>
        ))
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
          <button
            onClick={onBackToGame}
            className="btn-secondary"
          >
            ← Back to Game
          </button>
        </div>

        {/* Score Submission Form */}
        {gameResult && !showScoreForm && !hasSubmittedToday && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Submit Your Score</h2>
            <p className="mb-4 text-gray-700">
              {won 
                ? `Great job! You solved it in ${guesses} ${guesses === 1 ? 'guess' : 'guesses'}!`
                : `You used ${guesses} guesses. Submit your score to compete!`
              }
            </p>
            <button
              onClick={() => setShowScoreForm(true)}
              className="btn-primary"
            >
              Submit Score
            </button>
          </div>
        )}

        {/* Already Submitted Message */}
        {gameResult && hasSubmittedToday && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Score Already Submitted</h2>
            <p className="mb-4 text-gray-700">
              You've already submitted your score for today. Come back tomorrow for another game!
            </p>
            <div className="text-sm text-emerald-600">
              Your score: {guesses} {guesses === 1 ? 'guess' : 'guesses'} - {won ? 'Solved!' : 'Not solved'}
            </div>
          </div>
        )}

        {showScoreForm && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Your Details</h2>
            <form onSubmit={handleSubmitScore} className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your nickname"
                  required
                />
              </div>
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Trumpet, Drums, Guitar"
                  required
                />
              </div>
              {message && (
                <div className={`p-4 rounded-xl text-sm ${
                  message.includes('successfully') 
                    ? 'message-success' 
                    : 'message-error'
                }`}>
                  {message}
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Score'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowScoreForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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