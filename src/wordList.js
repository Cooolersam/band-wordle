// Band Wordle - Music and Band Related 5-Letter Words
export const wordList = [
  // Instruments
  'PIANO', 'GUITAR', 'DRUMS', 'BASS', 'FLUTE', 'TRUMPET', 'VIOLA', 'CELLO', 'HARP', 'ORGAN',
  'SAX', 'CLARINET', 'OBOE', 'TUBA', 'BANJO', 'MANDOLIN', 'UKULELE', 'ACCORDION', 'XYLOPHONE', 'TAMBOURINE',
  
  // Music Terms
  'TEMPO', 'BEATS', 'RHYTHM', 'MELODY', 'HARMONY', 'CHORD', 'SCALE', 'NOTES', 'SHARP', 'FLAT',
  'MINOR', 'MAJOR', 'SONG', 'TUNE', 'LYRIC', 'CHORUS', 'VERSE', 'BRIDGE', 'SOLO', 'DUET',
  
  // Band/Music Genres
  'ROCK', 'JAZZ', 'BLUES', 'FOLK', 'PUNK', 'METAL', 'POP', 'RAP', 'SOUL', 'FUNK',
  'REGG', 'DISCO', 'TECHNO', 'COUNTRY', 'CLASSICAL', 'OPERA', 'BALLET', 'MARCH', 'WALTZ', 'TANGO',
  
  // Band Related
  'STAGE', 'MIC', 'AMP', 'CAB', 'PEDAL', 'CASE', 'STAND', 'MUSIC', 'SHEET', 'SCORE',
  'BAND', 'GROUP', 'QUARTET', 'TRIO', 'DUO', 'CHOIR', 'ORCHESTRA', 'ENSEMBLE', 'SYMPHONY', 'CONCERT'
];

// Get the word of the day based on the current date
export function getWordOfTheDay() {
  const today = new Date();
  const startDate = new Date('2024-01-01'); // Start date for consistent word rotation
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const wordIndex = daysSinceStart % wordList.length;
  return wordList[wordIndex];
}

// Check if a word is valid (in our word list)
export function isValidWord(word) {
  return wordList.includes(word.toUpperCase());
} 