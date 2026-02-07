// Light Grid Component
// A-Z character grid for visual transmission mode

import React, { useEffect, useState } from 'react';
import './LightGrid.css';

interface LightGridProps {
    message: string;
    isPlaying: boolean;
    onComplete: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LightGrid: React.FC<LightGridProps> = ({ message, isPlaying, onComplete }) => {
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isPlaying || !message) {
            setActiveLetter(null);
            setCurrentIndex(0);
            return;
        }

        const upperMessage = message.toUpperCase();

        if (currentIndex >= upperMessage.length) {
            onComplete();
            return;
        }

        const char = upperMessage[currentIndex];

        // Skip spaces and non-alpha characters
        if (char === ' ' || !ALPHABET.includes(char)) {
            setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
            return;
        }

        setActiveLetter(char);

        const timer = setTimeout(() => {
            setActiveLetter(null);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        }, 500);

        return () => clearTimeout(timer);
    }, [isPlaying, message, currentIndex, onComplete]);

    return (
        <div className="light-grid">
            {ALPHABET.map(letter => (
                <div
                    key={letter}
                    className={`grid-letter terminal-text ${activeLetter === letter ? 'lit' : ''}`}
                >
                    {letter}
                </div>
            ))}
        </div>
    );
};
