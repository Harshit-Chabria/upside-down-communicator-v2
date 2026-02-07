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

    const startHandTracking = useCallback(async () => {
        if (!enabled) return;

        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });

            // Create video element
            const video = document.createElement('video');
            video.srcObject = stream;
            video.setAttribute('playsinline', '');
            await video.play();
            videoRef.current = video;

            // MediaPipe Hands (now using static imports to avoid base path issues)

            const hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
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
            setIsTracking(true);
            setError(null);

        } catch (err) {
            console.error('Hand tracking error:', err);
            setError('Camera access denied or not available');
            setIsTracking(false);
        }
    }, [enabled, detectPeaceSign]);

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
