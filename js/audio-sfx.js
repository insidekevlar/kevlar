/* ============================================================================
   PHYSICAL DATA SONIFICATION ENGINE v3.0
   Sound is NOT aesthetic — it is DATA ENCODING
   
   Maps physical state to audio parameters:
   ├─ Stable   → 220 Hz pure sine (elastic regime)
   ├─ Loading   → Linear pitch increase f(t) = 220 + (F/F_max) × 880
   ├─ Warning  → FM modulation (EFI instability)
   ├─ Critical → Harmonic distortion (IGI spike)
   └─ Failure  → Noise burst → silence (entropy collapse)
   
   Formula: f(t) = 220 + (F / F_max) × 880
   This makes physics AUDIBLE.
   ============================================================================ */

window.AudioSFX = (function() {
    'use strict';

    let ctx = null;
    let masterGain = null;
    let isActive = false;

    // Sonification nodes
    let dataOsc = null;       // Primary data oscillator
    let dataGain = null;      // Data oscillator gain
    let fmOsc = null;         // FM modulation oscillator (for Warning)
    let fmGain = null;        // FM depth
    let distortion = null;    // Waveshaper for Critical
    let noiseNode = null;     // Noise source for Failure
    let noiseGain = null;     // Noise gain
    let analyser = null;      // For visualization

    // State
    let currentState = 'IDLE';
    let targetFreq = 220;
    let currentForce = 0;
    let maxForce = 850;       // Will be updated dynamically

    // UI sound nodes
    let uiGain = null;

    // ═══════════════════════════════════════════════════
    //  INITIALIZATION
    // ═══════════════════════════════════════════════════

    function init(audioCtx) {
        ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();

        masterGain = ctx.createGain();
        masterGain.gain.value = 0.25;
        masterGain.connect(ctx.destination);

        // Analyser for potential visualization
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        masterGain.connect(analyser);

        // UI sound channel
        uiGain = ctx.createGain();
        uiGain.gain.value = 0.15;
        uiGain.connect(masterGain);

        setupSonification();
    }

    function getCtx() {
        if (!ctx) init();
        return ctx;
    }

    // ═══════════════════════════════════════════════════
    //  SONIFICATION CHAIN SETUP
    // ═══════════════════════════════════════════════════

    function setupSonification() {
        const c = getCtx();

        // ── Primary Data Oscillator ──
        // Represents the current force as pitch
        dataGain = c.createGain();
        dataGain.gain.value = 0;
        dataGain.connect(masterGain);

        dataOsc = c.createOscillator();
        dataOsc.type = 'sine';
        dataOsc.frequency.value = 220;

        // ── FM Modulation (for WARNING state) ──
        // EFI instability → frequency modulation
        fmGain = c.createGain();
        fmGain.gain.value = 0; // FM depth = 0 initially
        fmGain.connect(dataOsc.frequency);

        fmOsc = c.createOscillator();
        fmOsc.type = 'sine';
        fmOsc.frequency.value = 4; // 4 Hz modulation
        fmOsc.connect(fmGain);

        // ── Waveshaper Distortion (for CRITICAL state) ──
        distortion = c.createWaveShaper();
        distortion.curve = makeDistortionCurve(0); // Clean initially
        distortion.oversample = '4x';

        // Chain: dataOsc → distortion → dataGain → master
        dataOsc.connect(distortion);
        distortion.connect(dataGain);

        // ── Noise Generator (for FAILURE state) ──
        noiseGain = c.createGain();
        noiseGain.gain.value = 0;
        noiseGain.connect(masterGain);

        // Start oscillators
        dataOsc.start();
        fmOsc.start();
    }

    /**
     * Create waveshaper distortion curve
     * amount: 0 = clean, 100 = extreme distortion
     */
    function makeDistortionCurve(amount) {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < n_samples; i++) {
            const x = (i * 2) / n_samples - 1;
            if (k === 0) {
                curve[i] = x;
            } else {
                curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
            }
        }
        return curve;
    }

    // ═══════════════════════════════════════════════════
    //  CORE SONIFICATION: Update from Physics Data
    // ═══════════════════════════════════════════════════

    /**
     * Called at 10 Hz from the telemetry pipeline
     * Maps physical state to audio parameters
     * 
     * @param {Object} data - { force, state, EFI, IGI, P_failure, peakForce }
     */
    function updateSonification(data) {
        if (!ctx || !dataOsc) return;

        currentForce = data.force || 0;
        if (data.peakForce > maxForce) maxForce = data.peakForce;
        const forceRatio = Math.min(1, currentForce / (maxForce || 1));

        const newState = data.state || 'IDLE';
        const EFI = data.EFI || 0;
        const IGI = data.IGI || 0;

        // ── PITCH: f(t) = 220 + (F / F_max) × 880 ──
        // Force directly controls frequency — makes physics audible
        targetFreq = 220 + forceRatio * 880;

        // Smooth frequency transition (avoid clicks)
        const now = ctx.currentTime;
        dataOsc.frequency.setTargetAtTime(targetFreq, now, 0.05);

        // ── STATE-SPECIFIC PROCESSING ──
        switch (newState) {
            case 'IDLE':
                setIdle();
                break;

            case 'MONITORING':
                setStable(forceRatio);
                break;

            case 'WARNING':
                setWarning(forceRatio, EFI);
                break;

            case 'CRITICAL':
            case 'COUNTDOWN':
                setCritical(forceRatio, IGI);
                break;

            case 'RUPTURED':
                if (currentState !== 'RUPTURED') triggerFailure();
                break;
        }

        currentState = newState;
    }

    // ── State Processors ──

    function setIdle() {
        if (!dataGain) return;
        dataGain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
        fmGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        distortion.curve = makeDistortionCurve(0);
    }

    /**
     * STABLE: Pure sine tone at 220 Hz — elastic regime
     * Gain proportional to force (louder = more force)
     */
    function setStable(forceRatio) {
        const now = ctx.currentTime;
        // Sine wave, gentle volume increase
        dataOsc.type = 'sine';
        dataGain.gain.setTargetAtTime(0.03 + forceRatio * 0.05, now, 0.1);
        // No FM modulation
        fmGain.gain.setTargetAtTime(0, now, 0.1);
        // Clean signal (no distortion)
        distortion.curve = makeDistortionCurve(0);
    }

    /**
     * WARNING: FM modulation — EFI instability → frequency wobble
     * FM depth ∝ EFI value
     * FM rate increases with force
     */
    function setWarning(forceRatio, EFI) {
        const now = ctx.currentTime;
        dataOsc.type = 'sine';
        dataGain.gain.setTargetAtTime(0.06 + forceRatio * 0.06, now, 0.1);

        // FM: frequency modulation depth proportional to EFI
        const fmDepth = EFI * 80; // Up to ±80 Hz wobble
        fmGain.gain.setTargetAtTime(fmDepth, now, 0.1);

        // FM rate increases with force (4-12 Hz)
        fmOsc.frequency.setTargetAtTime(4 + forceRatio * 8, now, 0.1);

        // Slight distortion
        distortion.curve = makeDistortionCurve(EFI * 20);
    }

    /**
     * CRITICAL: Harmonic distortion — IGI spike → harsh harmonics
     * Distortion amount ∝ IGI
     * FM at maximum
     * Oscillator type switches to sawtooth for additional harmonics
     */
    function setCritical(forceRatio, IGI) {
        const now = ctx.currentTime;
        dataOsc.type = 'sawtooth'; // Rich harmonics
        dataGain.gain.setTargetAtTime(0.08 + forceRatio * 0.07, now, 0.1);

        // Maximum FM
        fmGain.gain.setTargetAtTime(60 + IGI * 120, now, 0.05);
        fmOsc.frequency.setTargetAtTime(8 + IGI * 15, now, 0.1);

        // Heavy distortion proportional to IGI
        distortion.curve = makeDistortionCurve(30 + IGI * 70);
    }

    /**
     * FAILURE: Noise burst → exponential decay → silence
     * Represents entropy collapse — signal death
     */
    function triggerFailure() {
        const now = ctx.currentTime;

        // Kill data oscillator
        dataGain.gain.setTargetAtTime(0, now, 0.5);
        fmGain.gain.setTargetAtTime(0, now, 0.1);

        // White noise burst
        const c = getCtx();
        const bufferSize = c.sampleRate * 2;
        const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Noise with exponential decay
            const decay = Math.exp(-i / (c.sampleRate * 0.3));
            data[i] = (Math.random() * 2 - 1) * decay;
        }

        noiseNode = c.createBufferSource();
        noiseNode.buffer = buffer;

        const noiseFilter = c.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 800;
        noiseFilter.Q.value = 0.5;

        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseNode.start(now);
    }

    // ═══════════════════════════════════════════════════
    //  UI SOUNDS (clicks, transitions, alerts)
    // ═══════════════════════════════════════════════════

    function playClick() {
        const c = getCtx();
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1200;
        g.gain.setValueAtTime(0.08, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
        osc.connect(g); g.connect(uiGain);
        osc.start(); osc.stop(c.currentTime + 0.05);
    }

    function playTransition() {
        const c = getCtx();
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.15);
        g.gain.setValueAtTime(0.06, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
        osc.connect(g); g.connect(uiGain);
        osc.start(); osc.stop(c.currentTime + 0.2);
    }

    function playAlert(level) {
        const c = getCtx();
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = level === 'critical' ? 'square' : 'sine';
        const freq = level === 'critical' ? 880 : 660;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.1, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        osc.connect(g); g.connect(uiGain);
        osc.start(); osc.stop(c.currentTime + 0.3);
    }

    function playCountdownBeep(count) {
        const c = getCtx();
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = count === 0 ? 1320 : 880;
        const dur = count === 0 ? 0.5 : 0.15;
        g.gain.setValueAtTime(count === 0 ? 0.15 : 0.1, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
        osc.connect(g); g.connect(uiGain);
        osc.start(); osc.stop(c.currentTime + dur);
    }

    // ── Ambient (kept for backward compat) ──
    function startAmbient() { /* Replaced by data sonification */ }
    function stopAmbient() { setIdle(); }
    function setStressLevel(level) {
        // Backward compat: map 0-1 stress to sonification
        updateSonification({
            force: level * maxForce,
            state: level > 0.8 ? 'CRITICAL' : level > 0.5 ? 'WARNING' : 'MONITORING',
            EFI: level * 0.6,
            IGI: level * level,
            peakForce: maxForce
        });
    }

    function getAnalyser() { return analyser; }

    return {
        init, getCtx,
        updateSonification,
        startAmbient, stopAmbient, setStressLevel,
        playClick, playTransition, playAlert, playCountdownBeep,
        getAnalyser,
    };
})();
