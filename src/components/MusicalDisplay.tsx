// Musical Notes Display Component
// Shows note names and frequencies as they play

import React from 'react';
import './MusicalDisplay.css';

interface MusicalDisplayProps {
    currentNote: string; // e.g., "A4"
    currentChar: string; // e.g., "A"
    frequency: number;   // e.g., 440
}

export const MusicalDisplay: React.FC<MusicalDisplayProps> = ({
    currentNote,
    currentChar,
    frequency
}) => {
    if (!currentChar) return null;

    return (
        <div className="musical-display">
            <div className="musical-label terminal-text">
                MUSICAL ENCODING (FOR EVALUATION PURPOSES)
            </div>

            <div className="musical-current">
                <div className="musical-char terminal-text">
                    {currentChar}
                </div>
                <div className="musical-arrow terminal-text">→</div>
                <div className="musical-note terminal-text">
                    {currentNote}
                </div>
            </div>

            <div className="musical-freq terminal-text">
                {frequency.toFixed(2)} Hz
            </div>

            <div className="musical-visualizer">
                <div className="frequency-bar" style={{ width: '100%' }}>
                    <div
                        className="frequency-fill"
                        style={{
                            width: `${Math.min((frequency / 4200) * 100, 100)}%`,
                            background: 'var(--phosphor-color)'
                        }}
                    />
                </div>
            </div>

            <div className="musical-info terminal-text">
                EACH LETTER = UNIQUE MUSICAL NOTE | A=440Hz ... Z=2349Hz
            </div>
        </div>
    );
};
