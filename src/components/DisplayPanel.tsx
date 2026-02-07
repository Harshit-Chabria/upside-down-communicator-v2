// Display Panel Component
// Right panel for displaying transmissions

import React from 'react';
import { DashboardCard } from './DashboardCard';
import { LightGrid } from './LightGrid';
import { BinaryPattern } from './BinaryPattern';
import { MorseLED } from './MorseLED';
import { MorseDisplay } from './MorseDisplay';
import { MusicalDisplay } from './MusicalDisplay';
import type { TransmissionMode } from './ModeSelector';
import type { VisualMode } from './VisualModeSelector';
import type { AudioMode } from './AudioModeSelector';

interface DisplayPanelProps {
    mode: TransmissionMode;
    visualMode: VisualMode;
    audioMode: AudioMode;
    message: string;
    isPlaying: boolean;
    onComplete: () => void;
    // Morse-specific props
    isMorseLEDActive?: boolean;
    morsePattern?: string;
    morseIndex?: number;
    // Musical-specific props
    currentMusicalNote?: string;
    currentMusicalChar?: string;
    currentFrequency?: number;
}

export const DisplayPanel: React.FC<DisplayPanelProps> = ({
    mode,
    visualMode,
    audioMode,
    message,
    isPlaying,
    onComplete,
    isMorseLEDActive = false,
    morsePattern = '',
    morseIndex = 0,
    currentMusicalNote = '',
    currentMusicalChar = '',
    currentFrequency = 0
}) => {
    if (!message) {
        return (
            <DashboardCard title="Transmission Display">
                <div className="terminal-text" style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    opacity: 0.6,
                    fontSize: '18px'
                }}>
                    █ AWAITING MESSAGE INPUT █
                </div>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title={mode === 'visual' ? `Visual: ${visualMode.toUpperCase()}` : `Audio: ${audioMode.toUpperCase()}`}>
            {mode === 'visual' ? (
                visualMode === 'grid' ? (
                    <LightGrid
                        message={message}
                        isPlaying={isPlaying}
                        onComplete={onComplete}
                    />
                ) : (
                    <BinaryPattern
                        message={message}
                        isPlaying={isPlaying}
                        onComplete={onComplete}
                    />
                )
            ) : (
                audioMode === 'morse' ? (
                    <>
                        <MorseLED isActive={isMorseLEDActive} />
                        <MorseDisplay pattern={morsePattern} currentIndex={morseIndex} />
                    </>
                ) : (
                    <MusicalDisplay
                        currentNote={currentMusicalNote}
                        currentChar={currentMusicalChar}
                        frequency={currentFrequency}
                    />
                )
            )}
        </DashboardCard>
    );
};
