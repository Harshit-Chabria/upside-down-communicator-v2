// Konami Code Detection Hook
// Listens for the classic cheat code sequence

import { useEffect, useCallback, useRef } from 'react';

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

export function useKonamiCode(onActivate: () => void) {
    const keySequence = useRef<string[]>([]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Add key to sequence buffer
        keySequence.current.push(event.key);

        // Keep only last N keys (length of Konami code)
        if (keySequence.current.length > KONAMI_CODE.length) {
            keySequence.current.shift();
        }

        // Check if the last N keys match the Konami code
        // Only check when we have enough keys
        if (keySequence.current.length === KONAMI_CODE.length) {
            const matches = KONAMI_CODE.every(
                (key, index) => key === keySequence.current[index]
            );

            if (matches) {
                console.log('🎮 Konami Code Activated!');
                onActivate();
                keySequence.current = []; // Reset to prevent double-trigger
            }
        }
    }, [onActivate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
