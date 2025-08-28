import { useState, useEffect } from 'react'
import { getWordOfTheDay, isValidWord, WORD_LENGTH } from '../wordList'

const WordleBoard = ({ onGameComplete, onShowLeaderboard }) => {
  // Game configuration constants
  const MAX_GUESSES = 6
  
  const [wordOfTheDay] = useState(getWordOfTheDay())
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill().map(() => Array(WORD_LENGTH).fill('')))
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [message, setMessage] = useState('')
  const [keyStates, setKeyStates] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Check if a letter is in the correct position
  const isCorrectPosition = (letter, index) => {
    return wordOfTheDay[index] === letter
  }

  // Check if a letter exists in the word but wrong position
  const isPresent = (letter, index) => {
    if (isCorrectPosition(letter, index)) return false
    
    const letterCount = wordOfTheDay.split('').filter(l => l === letter).length
    const correctPositions = wordOfTheDay.split('').map((l, i) => l === letter && guesses[currentGuessIndex - 1]?.[i] === letter ? 1 : 0).reduce((a, b) => a + b, 0)
    const presentInGuess = guesses[currentGuessIndex - 1]?.filter(l => l === letter).length || 0
    
    return letterCount > correctPositions + presentInGuess
  }

  // Update key states based on current guess
  const updateKeyStates = (guess) => {
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
  }

  // Handle key press
  const handleKeyPress = (key) => {
    if (gameComplete || isProcessing) return

    if (key === 'Enter') {
      submitGuess()
    } else if (key === 'Backspace') {
      deleteLetter()
    } else if (/^[A-Za-z]$/.test(key)) {
      addLetter(key.toUpperCase())
    }
  }

  // Add letter to current guess
  const addLetter = (letter) => {
    const currentGuess = guesses[currentGuessIndex]
    // Find the first empty slot
    const emptyIndex = currentGuess.findIndex(char => char === '')
    if (emptyIndex !== -1) {
      const newGuesses = [...guesses]
      newGuesses[currentGuessIndex] = [...currentGuess]
      newGuesses[currentGuessIndex][emptyIndex] = letter
      setGuesses(newGuesses)
    }
  }

  // Delete letter from current guess
  const deleteLetter = () => {
    const currentGuess = guesses[currentGuessIndex]
    // Find the last filled slot
    const lastFilledIndex = currentGuess.map((char, index) => char !== '' ? index : -1).filter(index => index !== -1).pop()
    if (lastFilledIndex !== undefined) {
      const newGuesses = [...guesses]
      newGuesses[currentGuessIndex] = [...currentGuess]
      newGuesses[currentGuessIndex][lastFilledIndex] = ''
      setGuesses(newGuesses)
    }
  }

  // Submit current guess
  const submitGuess = () => {
    const currentGuess = guesses[currentGuessIndex]
    const currentGuessString = currentGuess.join('')
    
    console.log('Submitting guess:', currentGuessString)
    
    if (currentGuessString.length !== WORD_LENGTH) {
      setMessage(`Word must be ${WORD_LENGTH} letters long`)
      setTimeout(() => setMessage(''), 2000)
      return
    }
    
    // Show immediate feedback that we're processing
    setIsProcessing(true)
    setMessage('Checking word...')
    
    // Validate the word
    const isValid = isValidWord(currentGuessString, wordOfTheDay)
    console.log('Word validation result:', isValid, 'for word:', currentGuessString)
    
    // Add a small delay to simulate processing and show feedback
    setTimeout(() => {
      if (!isValid) {
        setIsProcessing(false)
        setMessage('Not a valid word')
        setTimeout(() => setMessage(''), 2000)
        return
      }
      
      // Clear processing state
      setIsProcessing(false)
      setMessage('')
      
      // Update key states
      updateKeyStates(currentGuessString)

      // Check if won
      if (currentGuessString === wordOfTheDay) {
        setGameWon(true)
        setGameComplete(true)
        onGameComplete(true, currentGuessIndex + 1)
      } else if (currentGuessIndex === MAX_GUESSES - 1) {
        // Game over
        setGameComplete(true)
        onGameComplete(false, MAX_GUESSES)
      } else {
        // Move to next guess
        setCurrentGuessIndex(currentGuessIndex + 1)
      }
        }, 100)
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyPress(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [guesses, currentGuessIndex])

  // Render a single tile
  const renderTile = (letter, index, guessIndex) => {
    // Show uncolored tiles for future guesses and current input row
    if (guessIndex >= currentGuessIndex) {
      return (
        <div key={index} className="wordle-tile">
          {letter || ''}
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
              
              // Add specific sizing classes
              if (key === 'Enter' || key === 'Backspace') {
                keyClass += ' special-key'
              } else {
                keyClass += ' letter-key'
              }
              
              // Add state-based styling
              if (keyStates[key]) {
                keyClass += ` ${keyStates[key]}`
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
    <div className="min-h-screen p-6">
      <div className="game-container max-w-lg mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          🎵 Band Wordle
        </h1>
        
        {message && (
          <div className={`text-center mb-6 p-4 rounded-xl ${
            isProcessing 
              ? 'message-info' 
              : 'message-error'
          }`}>
            {isProcessing && <span className="mr-2">⏳</span>}
            {message}
          </div>
        )}

        {/* Game Board */}
        <div className="space-y-3 mb-8">
          {guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="flex justify-center space-x-2">
              {Array.from({ length: WORD_LENGTH }, (_, index) => 
                renderTile(guess[index] || '', index, guessIndex)
              )}
            </div>
          ))}
        </div>

        {/* Game Complete Message */}
        {gameComplete && (
          <div className="text-center mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold mb-3">
              {gameWon ? '🎉 Congratulations! 🎉' : '😔 Game Over'}
            </h2>
            <p className="mb-6 text-gray-700">
              {gameWon 
                ? `You solved it in ${currentGuessIndex + 1} ${currentGuessIndex === 0 ? 'guess' : 'guesses'}!`
                : `The word was: ${wordOfTheDay}`
              }
            </p>
            <div className="space-x-3">
              <button
                onClick={() => onShowLeaderboard()}
                className="btn-primary"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        )}

        {/* Keyboard */}
        {!gameComplete && renderKeyboard()}
      </div>
    </div>
  )
}

export default WordleBoard
