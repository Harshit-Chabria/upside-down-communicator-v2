// Sanity Gauge Component
// Visual progress bar showing system integrity

import React from 'react';
import './SanityGauge.css';

interface SanityGaugeProps {
    sanity: number;
    isPossessed: boolean;
}

export const SanityGauge: React.FC<SanityGaugeProps> = ({ sanity, isPossessed }) => {
    // Determine color based on sanity level
    const getColor = () => {
        if (sanity > 50) return 'var(--phosphor-green)';
        if (sanity > 25) return 'var(--warning-yellow)';
        return 'var(--danger-red)';
    };

    // Flicker effect when critical
    const shouldFlicker = sanity < 10 && !isPossessed;

    return (
        <div className="sanity-gauge">
            <div className="gauge-label terminal-text">SYSTEM INTEGRITY</div>
            <div className="gauge-container">
                <div
                    className={`gauge-fill ${shouldFlicker ? 'flicker-critical' : ''}`}
                    style={{
                        width: `${sanity}%`,
                        backgroundColor: getColor(),
                        boxShadow: `0 0 10px ${getColor()}`
                    }}
                />
            </div>
            <div className="gauge-percentage terminal-text">
                {sanity.toFixed(0)}%
            </div>
        </div>
    );
};
