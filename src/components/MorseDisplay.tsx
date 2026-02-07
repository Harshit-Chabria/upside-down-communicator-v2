// Morse Pattern Display Component
// Shows dots and dashes as they play in audio mode

import React from 'react';
import './MorseDisplay.css';

interface MorseDisplayProps {
    pattern: string; // Current morse pattern (e.g., "... --- ...")
    currentIndex: number; // Which symbol is currently playing
}

export const MorseDisplay: React.FC<MorseDisplayProps> = ({ pattern, currentIndex }) => {
    if (!pattern) return null;

    return (
        <div className="morse-display">
            <div className="morse-label terminal-text">MORSE PATTERN (FOR EVALUATION PURPOSES)</div>
            <div className="morse-pattern terminal-text">
                {pattern.split('').map((symbol, index) => (
                    <span
                        key={index}
                        className={`morse-symbol ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'played' : ''}`}
                    >
                        {symbol}
                    </span>
                ))}
            </div>
        </div>
    );
};
