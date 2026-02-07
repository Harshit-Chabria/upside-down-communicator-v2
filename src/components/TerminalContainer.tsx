// Terminal Container Component
// Main CRT wrapper with scanline overlay and possessed state effects

import React from 'react';
import type { ReactNode } from 'react';
import './TerminalContainer.css';

interface TerminalContainerProps {
    children: ReactNode;
    isPossessed: boolean;
    isRecovering: boolean;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({
    children,
    isPossessed,
    isRecovering
}) => {
    return (
        <div className={`crt-screen ${isPossessed ? 'possessed' : ''} ${isRecovering ? 'recovering' : ''}`}>
            <div className="crt-overlay" />
            <div className="terminal-container">
                <div className="terminal-header terminal-text">
                    <span className="blink">█</span> UPSIDE DOWN COMMUNICATOR v1.983
                </div>
                {children}
            </div>
        </div>
    );
};
