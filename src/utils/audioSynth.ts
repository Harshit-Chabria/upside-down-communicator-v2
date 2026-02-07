// Web Audio API Synthesizer
// Generates oscillator-based tones for Morse code and UI feedback

export class AudioSynthesizer {
    private context: AudioContext | null = null;
    private initialized = false;

    /**
     * Initialize the audio context (must be called after user interaction)
     */
    public async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            this.context = new AudioContext();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
        }
    }

    /**
     * Play a Morse code tone
     * @param isDash - true for dash (300ms), false for dot (100ms)
     */
    public playMorseTone(isDash: boolean): Promise<void> {
        return new Promise((resolve) => {
            if (!this.context) {
                resolve();
                return;
            }

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            // 800Hz sine wave for clean retro sound
            oscillator.type = 'sine';
            oscillator.frequency.value = 800;

            // Envelope to prevent clicks
            const now = this.context.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Attack

            const duration = isDash ? 0.3 : 0.1;
            gainNode.gain.setValueAtTime(0.3, now + duration - 0.01);
            gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

            oscillator.start(now);
            oscillator.stop(now + duration);

            oscillator.onended = () => resolve();
        });
    }

    /**
     * Play a keystroke click sound
     */
    public playKeystroke(): void {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Brief high-pitched click
        oscillator.type = 'square';
        oscillator.frequency.value = 1200;

        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

        oscillator.start(now);
        oscillator.stop(now + 0.03);
    }

    /**
     * Play static noise for possessed mode
     */
    public playStaticNoise(): void {
        if (!this.context) return;

        const bufferSize = this.context.sampleRate * 0.2; // 200ms burst
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        gainNode.gain.value = 0.15;

        source.start();
    }

    /**
     * Play a power-up success sound
     */
    public playPowerUp(): void {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Ascending frequency sweep
        oscillator.type = 'sawtooth';
        const now = this.context.currentTime;
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.3);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    /**
     * Play a musical note at a specific frequency
     * @param frequency - Frequency in Hz
     * @param duration - Duration in seconds
     */
    public playMusicalNote(frequency: number, duration: number): Promise<void> {
        return new Promise((resolve) => {
            if (!this.context) {
                resolve();
                return;
            }

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            // Sine wave for pure musical tone
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;

            // Envelope to prevent clicks
            const now = this.context.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02); // Attack

            gainNode.gain.setValueAtTime(0.3, now + duration - 0.02);
            gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

            oscillator.start(now);
            oscillator.stop(now + duration);

            oscillator.onended = () => resolve();
        });
    }
}

// Singleton instance
export const audioSynth = new AudioSynthesizer();
