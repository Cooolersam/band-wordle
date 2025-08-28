import { useState, useEffect, useCallback } from 'react'
import { getWordOfTheDay, isValidWord } from '../wordList'

const WordleBoard = ({ onGameComplete, onShowLeaderboard }) => {
  const [wordOfTheDay] = useState(getWordOfTheDay())
  const [guesses, setGuesses] = useState(Array(6).fill(''))
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [message, setMessage] = useState('')
  const [keyStates, setKeyStates] = useState({})

  const maxGuesses = 6
  const wordLength = 5

  // Check if a letter is in the correct position
  const isCorrectPosition = (letter, index) => {
    return wordOfTheDay[index] === letter
  }

  // Check if a letter exists in the word but wrong position
  const isPresent = (letter, index) => {
    if (isCorrectPosition(letter, index)) return false
    
    const letterCount = wordOfTheDay.split('').filter(l => l === letter).length
    const correctPositions = wordOfTheDay.split('').map((l, i) => l === letter && guesses[currentGuessIndex - 1]?.[i] === letter ? 1 : 0).reduce((a, b) => a + b, 0)
    const presentInGuess = guesses[currentGuessIndex - 1]?.split('').map((l, i) => l === letter && !isCorrectPosition(l, i) ? 1 : 0).reduce((a, b) => a + b, 0)
    
    return letterCount > correctPositions + presentInGuess
  }

  // Update key states based on current guess
  const updateKeyStates = useCallback((guess) => {
    const newKeyStates = { ...keyStates }
    
    guess.split('').forEach((letter, index) => {
      if (isCorrectPosition(letter, index)) {
        newKeyStates[letter] = 'correct'
      } else if (isPresent(letter, index) && newKeyStates[letter] !== 'correct') {
        newKeyStates[letter] = 'present'
      } else if (!newKeyStates[letter] || newKeyStates[letter] === 'absent') {
        newKeyStates[letter] = 'absent'
      }
    })
    
    setKeyStates(newKeyStates)
  }, [keyStates])

  // Handle key press
  const handleKeyPress = useCallback((key) => {
    if (gameComplete) return

    if (key === 'Enter') {
      submitGuess()
    } else if (key === 'Backspace') {
      deleteLetter()
    } else if (/^[A-Za-z]$/.test(key)) {
      addLetter(key.toUpperCase())
    }
  }, [gameComplete])

  // Add letter to current guess
  const addLetter = (letter) => {
    if (guesses[currentGuessIndex].length < wordLength) {
      const newGuesses = [...guesses]
      newGuesses[currentGuessIndex] += letter
      setGuesses(newGuesses)
    }
  }

  // Delete letter from current guess
  const deleteLetter = () => {
    if (guesses[currentGuessIndex].length > 0) {
      const newGuesses = [...guesses]
      newGuesses[currentGuessIndex] = newGuesses[currentGuessIndex].slice(0, -1)
      setGuesses(newGuesses)
    }
  }

  // Submit current guess
  const submitGuess = () => {
    const currentGuess = guesses[currentGuessIndex]
    
    if (currentGuess.length !== wordLength) {
      setMessage('Word must be 5 letters long')
      setTimeout(() => setMessage(''), 2000)
      return
    }
    
    if (!isValidWord(currentGuess)) {
      setMessage('Not a valid word')
      setTimeout(() => setMessage(''), 2000)
      return
    }

    // Update key states
    updateKeyStates(currentGuess)

    // Check if won
    if (currentGuess === wordOfTheDay) {
      setGameWon(true)
      setGameComplete(true)
      onGameComplete(true, currentGuessIndex + 1)
    } else if (currentGuessIndex === maxGuesses - 1) {
      // Game over
      setGameComplete(true)
      onGameComplete(false, maxGuesses)
    } else {
      // Move to next guess
      setCurrentGuessIndex(currentGuessIndex + 1)
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyPress(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  // Render a single tile
  const renderTile = (letter, index, guessIndex) => {
    if (guessIndex >= currentGuessIndex) {
      return (
        <div key={index} className="wordle-tile">
          {letter}
        </div>
      )
    }

    let tileClass = 'wordle-tile'
    if (isCorrectPosition(letter, index)) {
      tileClass += ' correct'
    } else if (isPresent(letter, index)) {
      tileClass += ' present'
    } else {
      tileClass += ' absent'
    }

    return (
      <div key={index} className={tileClass}>
        {letter}
      </div>
    )
  }

  // Render keyboard
  const renderKeyboard = () => {
    const keys = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
    ]

    return (
      <div className="mt-8 space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((key) => {
              let keyClass = 'keyboard-key'
              if (keyStates[key]) {
                keyClass += ` ${keyStates[key]}`
              }
              
              if (key === 'Enter' || key === 'Backspace') {
                keyClass += ' px-4'
              }

              return (
                <button
                  key={key}
                  className={keyClass}
                  onClick={() => handleKeyPress(key === 'Enter' ? 'Enter' : key === 'Backspace' ? 'Backspace' : key)}
                >
                  {key === 'Backspace' ? '⌫' : key}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Band Wordle
      </h1>
      
      {message && (
        <div className="text-center mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}

      {/* Game Board */}
      <div className="space-y-2 mb-6">
        {guesses.map((guess, guessIndex) => (
          <div key={guessIndex} className="flex justify-center space-x-1">
            {Array.from({ length: wordLength }, (_, index) => 
              renderTile(guess[index] || '', index, guessIndex)
            )}
          </div>
        ))}
      </div>

      {/* Game Complete Message */}
      {gameComplete && (
        <div className="text-center mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-2">
            {gameWon ? '🎉 Congratulations! 🎉' : '😔 Game Over'}
          </h2>
          <p className="mb-4">
            {gameWon 
              ? `You solved it in ${currentGuessIndex + 1} ${currentGuessIndex === 0 ? 'guess' : 'guesses'}!`
              : `The word was: ${wordOfTheDay}`
            }
          </p>
          <div className="space-x-2">
            <button
              onClick={() => onShowLeaderboard()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      )}

      {/* Keyboard */}
      {!gameComplete && renderKeyboard()}
    </div>
  )
}

export default WordleBoard 