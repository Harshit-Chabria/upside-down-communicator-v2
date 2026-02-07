// Morse Code Dictionary and Encoder
// Maps A-Z to International Morse Code sequences

export const MORSE_CODE: Record<string, string> = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',
  'E': '.',     'F': '..-.',  'G': '--.',   'H': '....',
  'I': '..',    'J': '.---',  'K': '-.-',   'L': '.-..',
  'M': '--',    'N': '-.',    'O': '---',   'P': '.--.',
  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',
  'Y': '-.--',  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  ' ': '/' // Word separator
};

export interface MorseSequence {
  character: string;
  morseCode: string;
}

/**
 * Converts text to an array of Morse code sequences
 * @param text - Input text to convert
 * @returns Array of character-morse pairs
 */
export function textToMorse(text: string): MorseSequence[] {
  const normalized = text.toUpperCase();
  const sequences: MorseSequence[] = [];

  for (const char of normalized) {
    const morse = MORSE_CODE[char];
    if (morse) {
      sequences.push({ character: char, morseCode: morse });
    }
  }

  return sequences;
}

/**
 * Gets the timing in milliseconds for a morse symbol
 * Dot: 100ms, Dash: 300ms, Character gap: 200ms, Word gap: 400ms
 */
export const MORSE_TIMING = {
  DOT: 100,
  DASH: 300,
  SYMBOL_GAP: 50,
  CHAR_GAP: 200,
  WORD_GAP: 400,
} as const;
