// Hand Gesture Detection Hook
// Uses MediaPipe Hands to detect snap gestures for recovery

import { useEffect, useRef, useCallback, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export function useSnapGesture(onSnap: () => void, enabled: boolean) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const peaceCooldownRef = useRef<boolean>(false);

    const calculateDistance = useCallback((point1: any, point2: any): number => {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = point1.z - point2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }, []);

    const detectPeaceSign = useCallback((landmarks: any) => {
        if (!landmarks || peaceCooldownRef.current) return;

        // Peace sign detection:
        // Index finger (8) and middle finger (12) should be extended (tips far from palm)
        // Ring finger (16) and pinky (20) should be curled (tips close to palm)
        // Thumb can be in any position

        const indexTip = landmarks[8];
        const indexMCP = landmarks[5]; // Knuckle
        const middleTip = landmarks[12];
        const middleMCP = landmarks[9]; // Knuckle
        const ringTip = landmarks[16];
        const ringMCP = landmarks[13]; // Knuckle
        const pinkyTip = landmarks[20];
        const pinkyMCP = landmarks[17]; // Knuckle
        const palmBase = landmarks[0]; // Wrist

        if (!indexTip || !middleTip || !ringTip || !pinkyTip || !palmBase) return;

        // Calculate distances to determine if fingers are extended
        const indexExtended = calculateDistance(indexTip, palmBase) > calculateDistance(indexMCP, palmBase);
        const middleExtended = calculateDistance(middleTip, palmBase) > calculateDistance(middleMCP, palmBase);
        const ringCurled = calculateDistance(ringTip, palmBase) < calculateDistance(ringMCP, palmBase) + 0.05;
        const pinkyCurled = calculateDistance(pinkyTip, palmBase) < calculateDistance(pinkyMCP, palmBase) + 0.05;

        // Peace sign: index and middle extended, ring and pinky curled
        if (indexExtended && middleExtended && ringCurled && pinkyCurled) {
            console.log('✌️ Peace sign detected!');
            onSnap();

            // Cooldown to prevent multiple triggers
            peaceCooldownRef.current = true;
            setTimeout(() => {
                peaceCooldownRef.current = false;
            }, 2000);
        }
    }, [calculateDistance, onSnap]);

    const checkBrowserSupport = useCallback((): { supported: boolean; reason?: string } => {
        // Check for getUserMedia API
        if (!navigator.mediaDevices?.getUserMedia) {
            return { supported: false, reason: 'Camera API not supported by browser' };
        }

        // Check for WebAssembly (required by MediaPipe)
        if (typeof WebAssembly === 'undefined') {
            return { supported: false, reason: 'WebAssembly not supported by browser' };
        }

        // Check for problematic browsers
        const ua = navigator.userAgent.toLowerCase();

        // Safari has known MediaPipe compatibility issues
        if (ua.includes('safari') && !ua.includes('chrome')) {
            return {
                supported: false,
                reason: 'Safari has limited MediaPipe support - Use Chrome or Edge for best results'
            };
        }

        // Very old Firefox versions may have issues
        const firefoxMatch = ua.match(/firefox\/(\d+)/);
        if (firefoxMatch && parseInt(firefoxMatch[1]) < 90) {
            return {
                supported: false,
                reason: 'Firefox version too old - Please update to latest version'
            };
        }

        return { supported: true };
    }, []);

    const startHandTracking = useCallback(async () => {
        if (!enabled) return;

        console.log('[GestureTracking] Starting initialization');
        console.log('[GestureTracking] Browser:', navigator.userAgent);

        // Check browser compatibility first
        const browserCheck = checkBrowserSupport();
        if (!browserCheck.supported) {
            console.warn('[GestureTracking] Browser not supported:', browserCheck.reason);
            setError(browserCheck.reason || 'Browser not supported');
            setIsTracking(false);
            return;
        }

        try {
            console.log('[GestureTracking] Requesting camera access...');

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });

            console.log('[GestureTracking] Camera access granted');

            // Create video element
            const video = document.createElement('video');
            video.srcObject = stream;
            video.setAttribute('playsinline', '');
            await video.play();
            videoRef.current = video;

            console.log('[GestureTracking] Loading MediaPipe...');

            // MediaPipe Hands (now using static imports to avoid base path issues)

            const hands = new Hands({
                locateFile: (file) => {
                    const url = `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
                    console.log('[GestureTracking] Loading MediaPipe file:', file);
                    return url;
                }
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults((results) => {
                if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                    detectPeaceSign(results.multiHandLandmarks[0]);
                }
            });

            const camera = new Camera(video, {
                onFrame: async () => {
                    await hands.send({ image: video });
                },
                width: 640,
                height: 480
            });

            camera.start();

            console.log('[GestureTracking] MediaPipe loaded successfully');
            console.log('[GestureTracking] Hand tracking active');

            setIsTracking(true);
            setError(null);

        } catch (err) {
            console.error('[GestureTracking] Error:', err);

            let errorMessage = 'Hand tracking unavailable';

            // Provide specific error messages based on error type
            if (err instanceof DOMException) {
                switch (err.name) {
                    case 'NotAllowedError':
                        errorMessage = 'Camera permission denied - Click allow in browser prompt';
                        console.error('[GestureTracking] User denied camera permission');
                        break;
                    case 'NotFoundError':
                        errorMessage = 'No camera detected on this device';
                        console.error('[GestureTracking] No camera found');
                        break;
                    case 'NotReadableError':
                        errorMessage = 'Camera in use by another application';
                        console.error('[GestureTracking] Camera already in use');
                        break;
                    case 'OverconstrainedError':
                        errorMessage = 'Camera does not support required settings';
                        console.error('[GestureTracking] Camera constraints not supported');
                        break;
                    case 'SecurityError':
                        errorMessage = 'Camera access blocked by security policy';
                        console.error('[GestureTracking] Security error');
                        break;
                    default:
                        errorMessage = `Camera error: ${err.message}`;
                        console.error('[GestureTracking] Unknown DOMException:', err.name, err.message);
                }
            } else if (err instanceof Error) {
                // MediaPipe loading errors
                if (err.message.includes('fetch') || err.message.includes('network')) {
                    errorMessage = 'Network error loading hand tracking - Check internet connection';
                    console.error('[GestureTracking] Network error loading MediaPipe');
                } else {
                    errorMessage = `Error: ${err.message}`;
                    console.error('[GestureTracking] Error:', err.message);
                }
            }

            setError(errorMessage);
            setIsTracking(false);
        }
    }, [enabled, detectPeaceSign, checkBrowserSupport]);

    const stopHandTracking = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current = null;
        }
        setIsTracking(false);
    }, []);

    useEffect(() => {
        if (enabled) {
            startHandTracking();
        } else {
            stopHandTracking();
        }

        return () => stopHandTracking();
    }, [enabled, startHandTracking, stopHandTracking]);

    return { isTracking, error };
}
