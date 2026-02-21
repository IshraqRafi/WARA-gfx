"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Global audio state to persist across components
let globalAudioEnabled = false;
let audioCtx: AudioContext | null = null;
let stateListeners: ((enabled: boolean) => void)[] = [];

const initAudio = () => {
    if (!audioCtx && typeof window !== "undefined") {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContext();
    }
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
            if (audioCtx?.state === 'suspended') {
                audioCtx.resume();
            }
        }
    }, []);

    const playClick = useCallback(() => {
        if (!globalAudioEnabled) return;
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }, []);

    const playHover = useCallback(() => {
        if (!globalAudioEnabled) return;
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(450, audioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }, []);

    const playHum = useCallback(() => {
        if (!globalAudioEnabled) return;
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(40, audioCtx.currentTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(200, audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.0);
    }, []);

    return { isEnabled, toggleAudio, playClick, playHover, playHum };
}
