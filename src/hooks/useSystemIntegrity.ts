// System Integrity Hook
// Manages sanity meter, decay timer, and possessed state

import { useState, useEffect, useCallback } from 'react';

export interface SystemIntegrityState {
    sanity: number;
    isPossessed: boolean;
    isRecovering: boolean;
}

export function useSystemIntegrity() {
    const [sanity, setSanity] = useState(100);
    const [isPossessed, setIsPossessed] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);

    // Sanity decay timer - 1% per second
    useEffect(() => {
        const interval = setInterval(() => {
            setSanity(prev => {
                const newSanity = prev - 5; // Decay 5% per second (faster for testing)
                const clampedSanity = Math.max(0, newSanity);

                // Trigger possessed mode when sanity hits 0
                if (clampedSanity === 0 && !isPossessed) {
                    setIsPossessed(true);
                }

                return clampedSanity;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPossessed]);

    // Reset sanity (called by recovery protocol)
    const resetSanity = useCallback(() => {
        setIsRecovering(true);
        setIsPossessed(false);

        // Flash effect duration
        setTimeout(() => {
            setSanity(100);
            setIsRecovering(false);
        }, 500);
    }, []);

    // Manual sanity adjustment (for testing or type-based decay)
    const adjustSanity = useCallback((delta: number) => {
        setSanity(prev => Math.max(0, Math.min(100, prev + delta)));
    }, []);

    return {
        sanity,
        isPossessed,
        isRecovering,
        resetSanity,
        adjustSanity,
    };
}
