// Main Application Component
// Integrates all systems: UI, audio, state management, and chaos engine

import { useState, useCallback, useEffect } from 'react';
import { TerminalContainer } from './components/TerminalContainer';
import { SanityGauge } from './components/SanityGauge';
import { DashboardLayout } from './components/DashboardLayout';
import { ControlPanel } from './components/ControlPanel';
import { DisplayPanel } from './components/DisplayPanel';
import type { TransmissionMode } from './components/ModeSelector';
import type { VisualMode } from './components/VisualModeSelector';
import type { AudioMode } from './components/AudioModeSelector';
import { GestureIndicator } from './components/GestureIndicator';
import { useSystemIntegrity } from './hooks/useSystemIntegrity';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useSnapGesture } from './hooks/useSnapGesture';
import { textToMorse, MORSE_TIMING } from './utils/morseCode';
import { textToMusicalNotes, NOTE_TIMING } from './utils/musicalNotes';
import { audioSynth } from './utils/audioSynth';
import './App.css';

function App() {
  const [mode, setMode] = useState<TransmissionMode>('visual');
  const [visualMode, setVisualMode] = useState<VisualMode>('grid');
  const [audioMode, setAudioMode] = useState<AudioMode>('morse');
  const [message, setMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMorseLEDActive, setIsMorseLEDActive] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [morsePattern, setMorsePattern] = useState('');
  const [morseIndex, setMorseIndex] = useState(0);
  const [currentMusicalNote, setCurrentMusicalNote] = useState('');
  const [currentMusicalChar, setCurrentMusicalChar] = useState('');
  const [currentFrequency, setCurrentFrequency] = useState(0);

  const { sanity, isPossessed, isRecovering, resetSanity } = useSystemIntegrity();

  // Konami Code Recovery
  useKonamiCode(() => {
    audioSynth.playPowerUp();
    resetSanity();
  });

  // Snap Gesture Recovery (only active when possessed)
  const { isTracking, error: gestureError } = useSnapGesture(
    () => {
      console.log('✌️ Peace sign recovery triggered!');
      audioSynth.playPowerUp();
      resetSanity();
    },
    isPossessed // Only track when possessed
  );

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(async () => {
    if (!audioInitialized) {
      await audioSynth.initialize();
      setAudioInitialized(true);
    }
  }, [audioInitialized]);

  // Play static noise randomly when possessed
  useEffect(() => {
    if (!isPossessed) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        audioSynth.playStaticNoise();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPossessed]);

  // Handle message submission
  const handleSubmit = useCallback(async (text: string) => {
    await initializeAudio();
    setMessage(text);
    setIsPlaying(true);

    // Play audio if in audio mode
    if (mode === 'audio') {
      if (audioMode === 'morse') {
        playMorseAudio(text);
      } else {
        playMusicalAudio(text);
      }
    }
  }, [mode, audioMode, initializeAudio]);

  // Play Morse code audio with LED sync
  const playMorseAudio = async (text: string) => {
    const sequences = textToMorse(text);

    // Build full morse pattern string for display
    const fullPattern = sequences
      .map(seq => seq.morseCode)
      .join(' ');
    setMorsePattern(fullPattern);
    setMorseIndex(0);

    let currentIndex = 0;

    for (const seq of sequences) {
      if (seq.morseCode === '/') {
        // Word gap
        currentIndex++; // Space character
        await sleep(MORSE_TIMING.WORD_GAP);
        continue;
      }

      for (const symbol of seq.morseCode) {
        const isDash = symbol === '-';

        // Update current position
        setMorseIndex(currentIndex);

        // LED on
        setIsMorseLEDActive(true);

        // Play tone
        await audioSynth.playMorseTone(isDash);

        // LED off
        setIsMorseLEDActive(false);

        currentIndex++;

        // Symbol gap
        await sleep(MORSE_TIMING.SYMBOL_GAP);
      }

      // Space between characters
      currentIndex++; // Space

      // Character gap
      await sleep(MORSE_TIMING.CHAR_GAP);
    }

    setMorseIndex(currentIndex); // Mark complete
    setIsPlaying(false);
  };

  // Play musical tones audio
  const playMusicalAudio = async (text: string) => {
    const notes = textToMusicalNotes(text);

    for (const note of notes) {
      setCurrentMusicalChar(note.character);
      setCurrentMusicalNote(note.noteName);
      setCurrentFrequency(note.frequency);

      // Play the note
      await audioSynth.playMusicalNote(note.frequency, NOTE_TIMING.NOTE_DURATION / 1000);

      // Gap between notes
      await sleep(NOTE_TIMING.NOTE_GAP);
    }

    // Clear display
    setCurrentMusicalChar('');
    setCurrentMusicalNote('');
    setCurrentFrequency(0);
    setIsPlaying(false);
  };

  const handleTransmissionComplete = () => {
    setIsPlaying(false);
  };

  return (
    <TerminalContainer isPossessed={isPossessed} isRecovering={isRecovering}>
      <DashboardLayout
        header={
          <>
            <div className="dashboard-header-title terminal-text">
              <span className="blink">█</span> UPSIDE DOWN COMMUNICATOR v1.983
            </div>
            <SanityGauge sanity={sanity} isPossessed={isPossessed} />
          </>
        }
        leftPanel={
          <ControlPanel
            mode={mode}
            visualMode={visualMode}
            audioMode={audioMode}
            onModeChange={setMode}
            onVisualModeChange={setVisualMode}
            onAudioModeChange={setAudioMode}
            onSubmit={handleSubmit}
            isPossessed={isPossessed}
            disabled={isPlaying}
          />
        }
        rightPanel={
          <DisplayPanel
            mode={mode}
            visualMode={visualMode}
            audioMode={audioMode}
            message={message}
            isPlaying={isPlaying}
            onComplete={handleTransmissionComplete}
            isMorseLEDActive={isMorseLEDActive}
            morsePattern={morsePattern}
            morseIndex={morseIndex}
            currentMusicalNote={currentMusicalNote}
            currentMusicalChar={currentMusicalChar}
            currentFrequency={currentFrequency}
          />
        }
        footer={
          <>
            {isPossessed && (
              <div className="terminal-text" style={{
                fontSize: '18px',
                animation: 'flicker-fast 0.15s infinite',
                marginBottom: '10px'
              }}>
                ⚠ SYSTEM CORRUPTED - ENTER RECOVERY SEQUENCE ⚠
              </div>
            )}
            <GestureIndicator
              isTracking={isTracking}
              error={gestureError}
              isPossessed={isPossessed}
            />
          </>
        }
      />
    </TerminalContainer>
  );
}

// Utility sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default App;
