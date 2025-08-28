import { useState } from 'react'
import WordleBoard from './components/WordleBoard'
import Leaderboard from './components/Leaderboard'

function App() {
  const [currentView, setCurrentView] = useState('game')
  const [gameResult, setGameResult] = useState(null)

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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'game' ? (
        <WordleBoard 
          onGameComplete={handleGameComplete}
          onShowLeaderboard={handleShowLeaderboard}
        />
      ) : (
        <Leaderboard 
          gameResult={gameResult}
          onBackToGame={handleBackToGame}
        />
      )}
    </div>
  )
}

export default App
