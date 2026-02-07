// Gesture Tracking Indicator Component
// Shows status of hand gesture detection

import React from 'react';
import './GestureIndicator.css';

interface GestureIndicatorProps {
    isTracking: boolean;
    error: string | null;
    isPossessed: boolean;
}

export const GestureIndicator: React.FC<GestureIndicatorProps> = ({
    isTracking,
    error,
    isPossessed
}) => {
    if (!isPossessed) return null;

    return (
        <div className="gesture-indicator">
            <div className="gesture-status terminal-text">
                {error ? (
                    <span className="gesture-error">⚠ {error}</span>
                ) : isTracking ? (
                    <span className="gesture-active">
                        ✌️ HAND TRACKING ACTIVE | PEACE SIGN TO RECOVER
                    </span>
                ) : (
                    <span className="gesture-loading">⏳ INITIALIZING HAND TRACKING...</span>
                )}
            </div>
        </div>
    );
};
