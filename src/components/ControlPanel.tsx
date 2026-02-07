// Control Panel Component
// Left sidebar dashboard panel containing all controls

import React from 'react';
import { DashboardCard } from './DashboardCard';
import { ModeSelector } from './ModeSelector';
import type { TransmissionMode } from './ModeSelector';
import { VisualModeSelector } from './VisualModeSelector';
import type { VisualMode } from './VisualModeSelector';
import { AudioModeSelector } from './AudioModeSelector';
import type { AudioMode } from './AudioModeSelector';
import { InputConsole } from './InputConsole';

interface ControlPanelProps {
    mode: TransmissionMode;
    visualMode: VisualMode;
    audioMode: AudioMode;
    onModeChange: (mode: TransmissionMode) => void;
    onVisualModeChange: (mode: VisualMode) => void;
    onAudioModeChange: (mode: AudioMode) => void;
    onSubmit: (text: string) => void;
    isPossessed: boolean;
    disabled: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    mode,
    visualMode,
    audioMode,
    onModeChange,
    onVisualModeChange,
    onAudioModeChange,
    onSubmit,
    isPossessed,
    disabled
}) => {
    return (
        <div>
            <DashboardCard title="Transmission Mode">
                <ModeSelector
                    mode={mode}
                    onChange={onModeChange}
                    disabled={disabled}
                />
            </DashboardCard>

            {mode === 'visual' && (
                <DashboardCard title="Visual Mode">
                    <VisualModeSelector
                        mode={visualMode}
                        onChange={onVisualModeChange}
                        disabled={disabled}
                    />
                </DashboardCard>
            )}

            {mode === 'audio' && (
                <DashboardCard title="Audio Mode">
                    <AudioModeSelector
                        mode={audioMode}
                        onChange={onAudioModeChange}
                        disabled={disabled}
                    />
                </DashboardCard>
            )}

            <DashboardCard title="Message Input">
                <InputConsole
                    onSubmit={onSubmit}
                    isPossessed={isPossessed}
                    disabled={disabled}
                />
            </DashboardCard>
        </div>
    );
};
