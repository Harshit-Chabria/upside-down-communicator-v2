// Morse LED Component
// Single LED indicator that syncs with Morse audio playback

import React from 'react';
import './MorseLED.css';

interface MorseLEDProps {
    isActive: boolean;
}

export const MorseLED: React.FC<MorseLEDProps> = ({ isActive }) => {
    return (
        <div className="morse-led-container">
            <div className="led-label terminal-text">SIGNAL</div>
            <div className={`morse-led ${isActive ? 'led-active' : ''}`} />
        </div>
    );
};
