// Audio Mode Selector Component
// Toggle between Morse and Musical audio modes

import React from 'react';
import './AudioModeSelector.css';

export type AudioMode = 'morse' | 'musical';

interface AudioModeSelectorProps {
    mode: AudioMode;
    onChange: (mode: AudioMode) => void;
    disabled: boolean;
}

export const AudioModeSelector: React.FC<AudioModeSelectorProps> = ({ mode, onChange, disabled }) => {
    return (
        <div className="audio-mode-selector">
            <div className="audio-mode-label terminal-text">AUDIO TYPE</div>
            <div className="audio-mode-buttons">
                <button
                    className={`audio-mode-button terminal-text ${mode === 'morse' ? 'active' : ''}`}
                    onClick={() => onChange('morse')}
                    disabled={disabled}
                >
                    MORSE CODE
                </button>
                <button
                    className={`audio-mode-button terminal-text ${mode === 'musical' ? 'active' : ''}`}
                    onClick={() => onChange('musical')}
                    disabled={disabled}
                >
                    MUSICAL TONES
                </button>
            </div>
        </div>
    );
};
