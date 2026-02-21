"use client";

import { useState, useEffect, useCallback } from "react";

// Global audio state
let globalAudioEnabled = false;
let audioCtx: AudioContext | null = null;
let stateListeners: ((enabled: boolean) => void)[] = [];

// Store references to ambient nodes
let ambientNodes: any[] = [];

const initAudio = () => {
    if (!audioCtx && typeof window !== "undefined") {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        // Optimization: Standardize sample rate if possible, else use default
        audioCtx = new AudioContext({ latencyHint: 'interactive' });
    }
};

const createNoiseBuffer = () => {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
};

const stopAmbient = () => {
    if (audioCtx && ambientNodes.length > 0) {
        ambientNodes.forEach(node => {
            if (node.gain) {
                node.gain.gain.setTargetAtTime(0, audioCtx!.currentTime, 1.5); // Smooth 1.5s fade out
            }
            if (node.osc) {
                setTimeout(() => {
                    try { node.osc.stop(); node.osc.disconnect(); } catch (e) { }
                }, 2000);
            }
        });
        ambientNodes = [];
    }
};

const startAmbient = () => {
    if (!audioCtx) return;
    stopAmbient(); // Prevent duplicates

    const now = audioCtx.currentTime;

    // 1. Low Frequency Soft Hum (Sub-bass pad)
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.value = 55; // Deep calm rumble
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.setTargetAtTime(0.04, now, 3); // Max volume 4%
    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);
    subOsc.start(now);

    // 2. Light Atmospheric Air Texture (Filtered Noise)
    const noiseBuffer = createNoiseBuffer();
    if (noiseBuffer) {
        const noiseSrc = audioCtx.createBufferSource();
        const noiseFilter = audioCtx.createBiquadFilter();
        const noiseGain = audioCtx.createGain();

        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        noiseFilter.type = "bandpass";
        noiseFilter.frequency.value = 400; // Low-mid warmth
        noiseFilter.Q.value = 0.5; // Very wide band

        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.setTargetAtTime(0.015, now, 5); // Max volume 1.5%, very subtle

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseSrc.start(now);

        ambientNodes.push({ osc: noiseSrc, gain: noiseGain });
    }

    ambientNodes.push({ osc: subOsc, gain: subGain });
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
            playHeroLoad(); // Play the activation sound when turning on
        } else {
            stopAmbient();
        }
    }, []);

    // 1. Hero Section Load: Soft low "whoom" rise + subtle click
    const playHeroLoad = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        // "Whoom" rise
        const riseOsc = audioCtx.createOscillator();
        const riseGain = audioCtx.createGain();
        riseOsc.type = "sine";
        riseOsc.frequency.setValueAtTime(30, now);
        riseOsc.frequency.exponentialRampToValueAtTime(80, now + 1.2);

        riseGain.gain.setValueAtTime(0, now);
        riseGain.gain.linearRampToValueAtTime(0.08, now + 0.8);
        riseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        riseOsc.connect(riseGain);
        riseGain.connect(audioCtx.destination);
        riseOsc.start(now);
        riseOsc.stop(now + 1.5);

        // Subtle Click Settle
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = "sine";
        clickOsc.frequency.setValueAtTime(2000, now + 1.1);
        clickOsc.frequency.exponentialRampToValueAtTime(500, now + 1.15);

        clickGain.gain.setValueAtTime(0, now + 1.1);
        clickGain.gain.setValueAtTime(0.05, now + 1.1);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

        clickOsc.connect(clickGain);
        clickGain.connect(audioCtx.destination);
        clickOsc.start(now + 1.1);
        clickOsc.stop(now + 1.2);
    }, []);

    // 2. Button Hover: Tiny digital tick / soft glass tap (<100ms)
    const playHover = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // High frequency, extremely short sine drop (Glass tap feel)
        osc.type = "sine";
        osc.frequency.setValueAtTime(3000, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.03);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.005); // Barely audible
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }, []);

    // 3. Button Click: Soft deep "thud" layered with a subtle high-frequency click
    const playClick = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        // Thud layer
        const thudOsc = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thudOsc.type = "sine";
        thudOsc.frequency.setValueAtTime(150, now);
        thudOsc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

        thudGain.gain.setValueAtTime(0, now);
        thudGain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        thudOsc.connect(thudGain);
        thudGain.connect(audioCtx.destination);
        thudOsc.start(now);
        thudOsc.stop(now + 0.2);

        // Click layer
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = "sine";
        clickOsc.frequency.setValueAtTime(4000, now);
        clickOsc.frequency.exponentialRampToValueAtTime(1000, now + 0.02);

        clickGain.gain.setValueAtTime(0, now);
        clickGain.gain.linearRampToValueAtTime(0.04, now + 0.005);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        clickOsc.connect(clickGain);
        clickGain.connect(audioCtx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.05);
    }, []);

    // 4. Portfolio Hover: Soft airy sweep
    const playProjectHover = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        const noiseBuffer = createNoiseBuffer();
        if (!noiseBuffer) return;

        const noiseSrc = audioCtx.createBufferSource();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        noiseSrc.buffer = noiseBuffer;

        // Bandpass sweep mimicking physical air movement
        filter.type = "bandpass";
        filter.Q.value = 1.0;
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.2);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);

        noiseSrc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.6);
    }, []);

    // 5. Scroll Reveal: Subtle shimmer
    const playReveal = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(3000, now);
        osc.frequency.linearRampToValueAtTime(3100, now + 0.4); // Very slight shimmer up

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.015, now + 0.2);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    }, []);

    // 6. Review Star Scatter: Multiple light glassy pings scattered over short duration
    const playStarScatter = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        // Create a fast sweeping glassy texture
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(3000, now + 0.15); // Sweep up rapidly

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }, []);

    // 7. Review Star Return: Distinct impact tick
    const playStarReturn = useCallback(() => {
        if (!globalAudioEnabled || !audioCtx) return;
        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Sharp descending click, like an expensive switch snapping into place
        osc.type = "square";
        osc.frequency.setValueAtTime(2500, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }, []);

    return {
        isEnabled,
        toggleAudio,
        playClick,
        playHover,
        playHeroLoad,
        playProjectHover,
        playReveal,
        playStarScatter,
        playStarReturn
    };
}
