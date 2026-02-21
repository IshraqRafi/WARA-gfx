"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Global audio state
let globalAudioEnabled = false;
let audioCtx: AudioContext | null = null;
let stateListeners: ((enabled: boolean) => void)[] = [];

// Store reference to the ambient loop so we can stop/start it globally
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

const initAudio = () => {
    if (!audioCtx && typeof window !== "undefined") {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContext();
    }
};

const stopAmbient = () => {
    if (ambientGain && audioCtx) {
        ambientGain.gain.setTargetAtTime(0, audioCtx.currentTime, 1); // Fade out
        setTimeout(() => {
            if (ambientOsc1) { ambientOsc1.stop(); ambientOsc1.disconnect(); ambientOsc1 = null; }
            if (ambientOsc2) { ambientOsc2.stop(); ambientOsc2.disconnect(); ambientOsc2 = null; }
        }, 2000);
    }
};

const startAmbient = () => {
    if (!audioCtx) return;
    if (ambientOsc1 || ambientOsc2) stopAmbient(); // Prevent duplicates

    // Deep Cyberpunk Drone
    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc2 = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    // Low, rumbling sub-bass
    ambientOsc1.type = "sine";
    ambientOsc1.frequency.value = 45; // Deep rumble

    // Eerie detuned overtone
    ambientOsc2.type = "sawtooth";
    ambientOsc2.frequency.value = 45.5;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 150; // Muffled, underwater/space feeling

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
    ambientGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 4); // Slow fade IN (very quiet)

    ambientOsc1.start();
    ambientOsc2.start();
};

export function useAudio() {
    const [isEnabled, setIsEnabled] = useState(globalAudioEnabled);

    useEffect(() => {
        setIsEnabled(globalAudioEnabled);
        const listener = (enabled: boolean) => setIsEnabled(enabled);
        stateListeners.push(listener);
        return () => {
            stateListeners = stateListeners.filter(l => l !== listener);
        };
    }, []);

    const toggleAudio = useCallback(() => {
        globalAudioEnabled = !globalAudioEnabled;
        stateListeners.forEach(l => l(globalAudioEnabled));

        if (globalAudioEnabled) {
            initAudio();
            if (audioCtx?.state === 'suspended') audioCtx.resume();
            startAmbient();
        } else {
            stopAmbient();
        }
    }, []);

    const playClick = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;

        // Sharp, high-tech HUD click (like a data lock)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";

        // Rapid pitch drop
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.08);

        // Rapid volume strike
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }, []);

    const playHover = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;

        // Glassy, holographic sweep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";

        // Slight pitch bend up
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.15);

        // Smooth volume swell
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }, []);

    return { isEnabled, toggleAudio, playClick, playHover };
}
