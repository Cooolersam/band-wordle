import { useState, useEffect } from 'react'

const Welcome = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('')
  const [instrument, setInstrument] = useState('')
  const [customInstrument, setCustomInstrument] = useState('')
  const [error, setError] = useState('')
  
  // Check if player has existing info
  useEffect(() => {
    const existingPlayer = localStorage.getItem('bandWordlePlayer')
    if (existingPlayer) {
      const player = JSON.parse(existingPlayer)
      setPlayerName(player.name)
      setInstrument(player.instrument)
      if (player.instrument === 'Other' && player.customInstrument) {
        setCustomInstrument(player.customInstrument)
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!playerName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!instrument.trim()) {
      setError('Please select your instrument')
      return
    }
    
    if (instrument === 'Other' && !customInstrument.trim()) {
      setError('Please type your instrument')
      return
    }
    
    // Basic validation for appropriate names
    const name = playerName.trim()
    if (name.length < 2) {
      setError('Name must be at least 2 characters long')
      return
    }
    
    if (name.length > 20) {
      setError('Name must be 20 characters or less')
      return
    }
    
    // Store player info in localStorage for leaderboard
    localStorage.setItem('bandWordlePlayer', JSON.stringify({
      name: name,
      instrument: instrument.trim(),
      customInstrument: instrument === 'Other' ? customInstrument.trim() : null
    }))
    
    onStartGame()
  }

  const instruments = [
    'Flute', 'Clarinet', 'Oboe', 'Bassoon', 'Alto Saxophone',
    'Tenor Sax', 'Bari Sax', 'Bass Clarinet',
    'Trumpet', 'French Horn', 'Trombone', 'Euphonium', 'Tuba',
    'Bass', 'Guitar', 'Percussion', 'Piano', 'Other'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-200">
      <div className="max-w-md w-full bg-blue-100 rounded-2xl shadow-xl p-8 border border-blue-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">
            🎵 Band Wordle 🎵
          </h1>
          <p className="text-gray-600 text-lg font-body">
            {playerName ? 'Welcome back to the band room!' : 'Welcome to the band room!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2 font-body">
              Your Name *
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              placeholder="Enter your name"
              maxLength="20"
            />
            <p className="text-xs text-gray-500 mt-1 font-body">
              This will appear on the leaderboard. If you have the same name as someone else, 
              consider adding your last initial or a nickname to differentiate yourself.
            </p>
          </div>

          <div>
            <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-2 font-body">
              Your Instrument *
            </label>
            <select
              id="instrument"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select your instrument</option>
              {instruments.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
            
            {instrument === 'Other' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customInstrument}
                  onChange={(e) => setCustomInstrument(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Type your instrument"
                  maxLength="20"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg font-body">
              {error}
            </div>
          )}

          <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-body">
              <strong>Note:</strong> Your name and instrument will be displayed on the leaderboard. 
              Please keep your entries appropriate and respectful.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-body"
          >
            {playerName ? 'Continue Playing!' : 'Start Playing!'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 font-body">
            Challenge your bandmates to see who can solve the daily word puzzle!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome 