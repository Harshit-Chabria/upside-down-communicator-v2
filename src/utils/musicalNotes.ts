// Musical Tone Encoder
// Maps each letter to a unique musical frequency

// Musical note frequencies (A4 = 440Hz chromatic scale)
const NOTE_FREQUENCIES: Record<string, number> = {
    'A': 440.00,  // A4
    'B': 493.88,  // B4
    'C': 523.25,  // C5
    'D': 587.33,  // D5
    'E': 659.25,  // E5
    'F': 698.46,  // F5
    'G': 783.99,  // G5
    'H': 880.00,  // A5
    'I': 987.77,  // B5
    'J': 1046.50, // C6
    'K': 1174.66, // D6
    'L': 1318.51, // E6
    'M': 1396.91, // F6
    'N': 1567.98, // G6
    'O': 1760.00, // A6
    'P': 1975.53, // B6
    'Q': 2093.00, // C7
    'R': 2349.32, // D7
    'S': 2637.02, // E7
    'T': 2793.83, // F7
    'U': 3135.96, // G7
    'V': 3520.00, // A7
    'W': 3951.07, // B7
    'X': 4186.01, // C8
    'Y': 2093.00, // C7 (repeat)
    'Z': 2349.32, // D7 (repeat)
};

const NOTE_NAMES: Record<string, string> = {
    'A': 'A4', 'B': 'B4', 'C': 'C5', 'D': 'D5', 'E': 'E5', 'F': 'F5', 'G': 'G5',
    'H': 'A5', 'I': 'B5', 'J': 'C6', 'K': 'D6', 'L': 'E6', 'M': 'F6', 'N': 'G6',
    'O': 'A6', 'P': 'B6', 'Q': 'C7', 'R': 'D7', 'S': 'E7', 'T': 'F7', 'U': 'G7',
    'V': 'A7', 'W': 'B7', 'X': 'C8', 'Y': 'C7', 'Z': 'D7',
};

export interface MusicalNote {
    character: string;
    frequency: number;
    noteName: string;
}

/**
 * Converts text to musical note sequence
 */
export function textToMusicalNotes(text: string): MusicalNote[] {
    const normalized = text.toUpperCase();
    const notes: MusicalNote[] = [];

    for (const char of normalized) {
        if (char === ' ') continue; // Skip spaces
        const freq = NOTE_FREQUENCIES[char];
        const noteName = NOTE_NAMES[char];
        if (freq && noteName) {
            notes.push({
                character: char,
                frequency: freq,
                noteName: noteName
            });
        }
    }

    return notes;
}

export const NOTE_TIMING = {
    NOTE_DURATION: 400, // Each note plays for 400ms
    NOTE_GAP: 100,      // 100ms gap between notes
} as const;
