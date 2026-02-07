// Visual Mode Selector Component
// Toggle between Grid and Binary visual modes

import React from 'react';
import './VisualModeSelector.css';

export type VisualMode = 'grid' | 'binary';

interface VisualModeSelectorProps {
    mode: VisualMode;
    onChange: (mode: VisualMode) => void;
    disabled: boolean;
}

export const VisualModeSelector: React.FC<VisualModeSelectorProps> = ({ mode, onChange, disabled }) => {
    return (
        <div className="visual-mode-selector">
            <div className="visual-mode-label terminal-text">VISUAL TYPE</div>
            <div className="visual-mode-buttons">
                <button
                    className={`visual-mode-button terminal-text ${mode === 'grid' ? 'active' : ''}`}
                    onClick={() => onChange('grid')}
                    disabled={disabled}
                >
                    A-Z GRID
                </button>
                <button
                    className={`visual-mode-button terminal-text ${mode === 'binary' ? 'active' : ''}`}
                    onClick={() => onChange('binary')}
                    disabled={disabled}
                >
                    BINARY PULSE
                </button>
            </div>
        </div>
    );
};
