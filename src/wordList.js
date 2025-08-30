// We'll use a comprehensive English word list instead of the problematic check-word library
import { sixLetterWords } from './completeSixLetterWords.js'

// Game configuration constant
export const WORD_LENGTH = 6

// Band Wordle - Music and Band Related 6-Letter Words (for daily rotation only)
export const wordList = [
  'MUSIEL', 'GUITAR', 'GIBSON', 'BALLET', 'STAFFS', 'TREBLE', 'CHORUS', 'LEGATO',
  'RHYTHM', 'MELODY', 'BRIDGE', 'ACCENT', 'OCTAVE', 'ENCORE', 'PHRASE', 'MANUAL', 'FUSSEL',
  'REGGAE', 'TECHNO', 'COUNTRY', 'OPERA', 'BALLET', 'FLUTES',
  'SONATA', 'TUNING', 'UNISON', 'VOLUME', 'DECAPO', 'STUDIO', 'BALLAD', 'ANTHEM'
];

// Get the word of the day based on the current date
export function getWordOfTheDay() {
  const today = new Date();
  const startDate = new Date('2025-08-28'); // Start date adjusted so today shows MUSIEL
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const wordIndex = daysSinceStart % wordList.length;
  
  // No debug logging to avoid console spam
  
  return wordList[wordIndex];
}

// Check if a word is valid (correct length and exists in English dictionary)
export function isValidWord(word, answer = null) {
  // First check if it's exactly the right length
  if (word.length !== WORD_LENGTH) {
    return false;
  }
  
  // If an answer is provided, check if the word matches it first
  // This prevents false rejection of correct guesses that might be names or specific terms
  if (answer && word.toUpperCase() === answer.toUpperCase()) {
    return true;
  }
  
  // Check if the word exists in our comprehensive list of 6-letter words
  // This allows more niche/obscure words to be accepted
  return sixLetterWords.includes(word.toLowerCase());
} 