// Input Console Component
// Command-line style input with character scrambling

import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { scrambleText } from '../utils/characterScrambler';
import { audioSynth } from '../utils/audioSynth';
import './InputConsole.css';

interface InputConsoleProps {
    onSubmit: (message: string) => void;
    isPossessed: boolean;
    disabled: boolean;
}

export const InputConsole: React.FC<InputConsoleProps> = ({
    onSubmit,
    isPossessed,
    disabled
}) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Play keystroke sound
        if (e.key.length === 1) {
            audioSynth.playKeystroke();
        }

        if (e.key === 'Enter' && input.trim()) {
            onSubmit(input.trim());
            setInput('');
        }
    };

    const displayValue = scrambleText(input, isPossessed);

    return (
        <div className="input-console">
            <div className="console-prompt terminal-text">&gt;</div>
            <input
                type="text"
                className="console-input terminal-text"
                value={displayValue}
                onChange={(e) => {
                    // Always store the real typed value
                    // The scrambling is only visual (in displayValue)
                    setInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="ENTER TRANSMISSION..."
                disabled={disabled}
                maxLength={50}
            />
        </div>
    );
};
