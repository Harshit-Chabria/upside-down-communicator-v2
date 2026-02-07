// Binary Light Pattern Component
// Shows each character as a 5-bit binary light sequence

import React, { useEffect, useState } from 'react';
import './BinaryPattern.css';

interface BinaryPatternProps {
    message: string;
    isPlaying: boolean;
    onComplete: () => void;
}

// Convert character to 5-bit binary (A=00001, B=00010, etc.)
const charToBinary = (char: string): string => {
    const code = char.toUpperCase().charCodeAt(0) - 64; // A=1, B=2, etc.
    if (code < 1 || code > 26) return '00000'; // Non-alpha
    return code.toString(2).padStart(5, '0');
};

export const BinaryPattern: React.FC<BinaryPatternProps> = ({ message, isPlaying, onComplete }) => {
    const [currentChar, setCurrentChar] = useState('');
    const [currentBinary, setCurrentBinary] = useState('00000');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isPlaying || !message) {
            setCurrentChar('');
            setCurrentBinary('00000');
            setCurrentIndex(0);
            return;
        }

        const upperMessage = message.toUpperCase();

        if (currentIndex >= upperMessage.length) {
            onComplete();
            return;
        }

        const char = upperMessage[currentIndex];

        // Skip spaces
        if (char === ' ') {
            setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
            return;
        }

        setCurrentChar(char);
        setCurrentBinary(charToBinary(char));

        const timer = setTimeout(() => {
            setCurrentChar('');
            setCurrentBinary('00000');
            setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
        }, 800);

        return () => clearTimeout(timer);
    }, [isPlaying, message, currentIndex, onComplete]);

    return (
        <div className="binary-pattern">
            <div className="binary-label terminal-text">
                BINARY TRANSMISSION (FOR EVALUATION PURPOSES)
            </div>

            {currentChar && (
                <div className="binary-current-char terminal-text">
                    TRANSMITTING: {currentChar}
                </div>
            )}

            <div className="binary-lights">
                {currentBinary.split('').map((bit, index) => (
                    <div
                        key={index}
                        className={`binary-light ${bit === '1' ? 'on' : 'off'}`}
                    >
                        <div className="light-bulb" />
                        <div className="light-label terminal-text">{bit}</div>
                    </div>
                ))}
            </div>

            <div className="binary-info terminal-text">
                5-BIT ENCODING | 0 = OFF | 1 = ON | A=00001 ... Z=11010
            </div>
        </div>
    );
};
