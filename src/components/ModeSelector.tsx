// Mode Selector Component
// Toggle between Visual (Light Grid) and Audio (Morse) modes

import React from 'react';
import './ModeSelector.css';

export type TransmissionMode = 'visual' | 'audio';

interface ModeSelectorProps {
    mode: TransmissionMode;
    onChange: (mode: TransmissionMode) => void;
    disabled: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange, disabled }) => {
    return (
        <div className="mode-selector">
            <div className="mode-label terminal-text">TRANSMISSION MODE</div>
            <div className="mode-buttons">
                <button
                    className={`mode-button terminal-text ${mode === 'visual' ? 'active' : ''}`}
                    onClick={() => onChange('visual')}
                    disabled={disabled}
                >
                    VISUAL
                </button>
                <button
                    className={`mode-button terminal-text ${mode === 'audio' ? 'active' : ''}`}
                    onClick={() => onChange('audio')}
                    disabled={disabled}
                >
                    AUDIO
                </button>
            </div>
        </div>
    );
};
