import { useState, useEffect } from 'react'
import Welcome from './components/Welcome'
import WordleBoard from './components/WordleBoard'
import Leaderboard from './components/Leaderboard'
import AdminPanel from './components/AdminPanel'
import PasswordScreen from './components/PasswordScreen'

function App() {
  const [currentView, setCurrentView] = useState('welcome')
  const [gameResult, setGameResult] = useState(null)
  const [adminMode, setAdminMode] = useState(false)
  const [showPasswordScreen, setShowPasswordScreen] = useState(false)
  const [playerInfo, setPlayerInfo] = useState(null)

  // Check if player has already completed welcome screen
  useEffect(() => {
    const storedPlayer = localStorage.getItem('bandWordlePlayer')
    if (storedPlayer) {
      setPlayerInfo(JSON.parse(storedPlayer))
      setCurrentView('game')
    }
  }, [])

  // Hidden admin access: Press Ctrl+Shift+A to access admin panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowPasswordScreen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleStartGame = () => {
    // Get player info from localStorage
    const storedPlayer = localStorage.getItem('bandWordlePlayer')
    if (storedPlayer) {
      const player = JSON.parse(storedPlayer)
      // Handle custom instrument display
      if (player.instrument === 'Other' && player.customInstrument) {
        player.displayInstrument = player.customInstrument
      } else {
        player.displayInstrument = player.instrument
      }
      setPlayerInfo(player)
    }
    setCurrentView('game')
  }

  const handleGameComplete = (won, guesses) => {
    setGameResult({ won, guesses })
    // Don't automatically switch to leaderboard, let user choose
  }

  const handleShowLeaderboard = () => {
    setCurrentView('leaderboard')
  }

  const handleBackToGame = () => {
    setCurrentView('game')
    setGameResult(null)
    setAdminMode(false)
    setShowPasswordScreen(false)
  }

  const handlePasswordCorrect = () => {
    setShowPasswordScreen(false)
    setAdminMode(true)
    setCurrentView('admin')
  }

  const handlePasswordCancel = () => {
    setShowPasswordScreen(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 font-body">
      {showPasswordScreen ? (
        <PasswordScreen 
          onPasswordCorrect={handlePasswordCorrect}
          onCancel={handlePasswordCancel}
        />
      ) : currentView === 'welcome' ? (
        <Welcome onStartGame={handleStartGame} />
      ) : currentView === 'game' ? (
        <WordleBoard 
          playerInfo={playerInfo}
          onGameComplete={handleGameComplete}
          onShowLeaderboard={handleShowLeaderboard}
        />
      ) : currentView === 'leaderboard' ? (
        <Leaderboard 
          onBackToGame={handleBackToGame}
        />
      ) : currentView === 'admin' ? (
        <AdminPanel 
          onBackToGame={handleBackToGame}
        />
      ) : null}
    </div>
  )
}

export default App
