// Character Scrambler for Possessed Mode
// Applies visual obfuscation to user input

// ROT-13 style scramble map with additional chaos
const SCRAMBLE_MAP: Record<string, string> = {
    'A': 'N', 'B': 'O', 'C': 'P', 'D': 'Q', 'E': 'R', 'F': 'S', 'G': 'T',
    'H': 'U', 'I': 'V', 'J': 'W', 'K': 'X', 'L': 'Y', 'M': 'Z',
    'N': 'A', 'O': 'B', 'P': 'C', 'Q': 'D', 'R': 'E', 'S': 'F', 'T': 'G',
    'U': 'H', 'V': 'I', 'W': 'J', 'X': 'K', 'Y': 'L', 'Z': 'M',
    'a': 'n', 'b': 'o', 'c': 'p', 'd': 'q', 'e': 'r', 'f': 's', 'g': 't',
    'h': 'u', 'i': 'v', 'j': 'w', 'k': 'x', 'l': 'y', 'm': 'z',
    'n': 'a', 'o': 'b', 'p': 'c', 'q': 'd', 'r': 'e', 's': 'f', 't': 'g',
    'u': 'h', 'v': 'i', 'w': 'j', 'x': 'k', 'y': 'l', 'z': 'm',
    '0': '5', '1': '6', '2': '7', '3': '8', '4': '9',
    '5': '0', '6': '1', '7': '2', '8': '3', '9': '4',
};

/**
 * Scrambles a single character when system is possessed
 * @param char - Character to potentially scramble
 * @param isPossessed - Whether scrambling should be applied
 * @returns Scrambled character or original if not possessed
 */
export function scrambleCharacter(char: string, isPossessed: boolean): string {
    if (!isPossessed) return char;
    return SCRAMBLE_MAP[char] || char;
}

/**
 * Scrambles an entire string
 * @param text - Text to scramble
 * @param isPossessed - Whether scrambling should be applied
 * @returns Scrambled text
 */
export function scrambleText(text: string, isPossessed: boolean): string {
    if (!isPossessed) return text;
    return text.split('').map(char => scrambleCharacter(char, true)).join('');
}
