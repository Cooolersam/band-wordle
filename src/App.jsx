import { useState, useEffect } from 'react'
import WordleBoard from './components/WordleBoard'
import Leaderboard from './components/Leaderboard'
import AdminPanel from './components/AdminPanel'
import PasswordScreen from './components/PasswordScreen'

function App() {
  const [currentView, setCurrentView] = useState('game')
  const [gameResult, setGameResult] = useState(null)
  const [adminMode, setAdminMode] = useState(false)
  const [showPasswordScreen, setShowPasswordScreen] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      {showPasswordScreen ? (
        <PasswordScreen 
          onPasswordCorrect={handlePasswordCorrect}
          onCancel={handlePasswordCancel}
        />
      ) : currentView === 'game' ? (
        <WordleBoard 
          onGameComplete={handleGameComplete}
          onShowLeaderboard={handleShowLeaderboard}
        />
      ) : currentView === 'leaderboard' ? (
        <Leaderboard 
          gameResult={gameResult}
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
