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
                    <div>
                        <span className="gesture-error">⚠ {error}</span>
                        {error.includes('permission') && error.includes('denied') && (
                            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
                                💡 Look for camera icon in browser address bar and click "Allow"
                            </div>
                        )}
                        {error.includes('Safari') && (
                            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
                                💡 Recommended: Use Google Chrome or Microsoft Edge
                            </div>
                        )}
                        {error.includes('Network') && (
                            <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
                                💡 Check your internet connection and try reloading the page
                            </div>
                        )}
                        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                            Alternative: Use Konami Code (↑↑↓↓←→←→BA) to recover
                        </div>
                    </div>
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
