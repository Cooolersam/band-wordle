import { useState, useEffect } from 'react'
import WordleBoard from './components/WordleBoard'
import Leaderboard from './components/Leaderboard'
import AdminPanel from './components/AdminPanel'

function App() {
  const [currentView, setCurrentView] = useState('game')
  const [gameResult, setGameResult] = useState(null)
  const [adminMode, setAdminMode] = useState(false)

  // Hidden admin access: Press Ctrl+Shift+A to access admin panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setAdminMode(true)
        setCurrentView('admin')
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'game' ? (
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
