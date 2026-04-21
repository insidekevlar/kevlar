/* ============================================
   VOICE ENGINE v3 — Bulletproof Speech System
   Fixes: Chrome 15s cutoff bug, race conditions,
   overlapping speech, and interrupted sentences.
   ============================================ */

window.VoiceEngine = (function() {
    let audioCtx = null;
    let synth = window.speechSynthesis;
    let selectedVoice = null;
    let isSpeaking = false;
    let analyser = null;
    let analyserData = null;
    let gainNode = null;
    let filterNode = null;

    // Voice queue for sequential speech
    let speechQueue = [];
    let isProcessingQueue = false;

    // Current utterance tracking — prevents race conditions
    let currentUtterance = null;
    let currentCallbacks = { onStart: null, onEnd: null };
    let currentSpeechId = 0; // Monotonically increasing ID to track active speech

    // Chrome bug workaround: resume timer
    let chromeResumeInterval = null;

    function init() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create analyser for visuals
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserData = new Uint8Array(analyser.frequencyBinCount);

        // Create processing chain
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.0;

        // Subtle filter for slightly processed but still human voice
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'peaking';
        filterNode.frequency.value = 3000;
        filterNode.Q.value = 0.8;
        filterNode.gain.value = 2; // Slight presence boost

        // Load best voice — prioritize natural human voices
        loadVoice();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoice;
        }

        // ═══ CHROME BUG FIX ═══
        // Chrome pauses speechSynthesis after ~15 seconds of continuous speech.
        // Workaround: call synth.resume() every 5 seconds while speaking.
        // This is a well-documented Chrome bug (crbug.com/679437).
        chromeResumeInterval = setInterval(() => {
            if (synth.speaking && !synth.paused) {
                synth.resume();
            }
        }, 5000);
    }

    function loadVoice() {
        const voices = synth.getVoices();
        
        // Priority order: most natural-sounding male voices first
        const preferred = [
            // Natural/premium voices (Windows 11 and Edge)
            'Microsoft Guy Online',     // Very natural
            'Microsoft Ryan Online',    // Natural neural voice
            'Google UK English Male',   // Solid quality
            'Microsoft Mark Online',    // Natural
            'Microsoft David Desktop',  // Classic but good
            'Microsoft David',          // Classic
            'Microsoft Mark',
            'Google US English',
            'Daniel',                   // macOS
            'Alex',                     // macOS
            'Microsoft Guy',
            'Microsoft Ryan',
            // Any English male voice as fallback
        ];
        
        for (const name of preferred) {
            const found = voices.find(v => v.name.includes(name));
            if (found) { 
                selectedVoice = found; 
                console.log('[Voice] Selected:', found.name);
                return; 
            }
        }
        
        // Fallback — any English voice, prefer male
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        selectedVoice = englishVoices[0] || voices[0];
        if (selectedVoice) console.log('[Voice] Fallback:', selectedVoice.name);
    }

    /**
     * Split text into safe chunks for TTS.
     * Chrome cuts off utterances longer than ~200-300 chars.
     * We split on sentence boundaries to sound natural.
     */
    function splitIntoChunks(text) {
        if (!text || text.length === 0) return [];

        // If text is short enough, don't split
        if (text.length <= 180) return [text];

        // Split on sentence boundaries (.!?)
        const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
        const chunks = [];
        let current = '';

        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (!trimmed) continue;

            // If adding this sentence would exceed limit, push current and start new
            if (current.length > 0 && (current + ' ' + trimmed).length > 180) {
                chunks.push(current.trim());
                current = trimmed;
            } else {
                current = current ? current + ' ' + trimmed : trimmed;
            }
        }
        if (current.trim()) chunks.push(current.trim());

        return chunks.length > 0 ? chunks : [text];
    }

    function speak(text, callbacks = {}) {
        if (!synth) return;

        if (callbacks.interrupt) {
            // Hard cancel: stop everything immediately
            synth.cancel();
            clearQueue();
            finishCurrentSpeech(false); // Don't fire onEnd for cancelled speech
        } else if (isSpeaking) {
            // If already speaking and not interrupting, queue this text
            speechQueue.push({ text, callbacks });
            if (!isProcessingQueue) {
                // Queue will be processed when current speech ends
            }
            return;
        }

        // Generate a unique ID for this speak call only when we actually start it
        const speechId = ++currentSpeechId;

        // Store callbacks for this speech
        currentCallbacks = {
            onStart: callbacks.onStart || null,
            onEnd: callbacks.onEnd || null
        };

        // Split long text into chunks to avoid Chrome's 15s cutoff
        const chunks = splitIntoChunks(text);
        
        if (chunks.length === 1) {
            // Single chunk — speak directly
            speakSingleChunk(chunks[0], speechId, true, true);
        } else {
            // Multiple chunks — chain them sequentially
            speakChunkedSequence(chunks, speechId);
        }
    }

    /**
     * Speak a single chunk of text.
     * @param {string} text - The text chunk to speak
     * @param {number} speechId - The speech ID to check for cancellation
     * @param {boolean} isFirst - Whether this is the first chunk (fires onStart)
     * @param {boolean} isLast - Whether this is the last chunk (fires onEnd)
     */
    function speakSingleChunk(text, speechId, isFirst, isLast) {
        // Check if this speech was cancelled before we even start
        if (speechId !== currentSpeechId) return;

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        
        // Natural human voice settings
        utterance.rate = 1.12;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        currentUtterance = utterance;

        utterance.onstart = () => {
            // Verify this is still the active speech
            if (speechId !== currentSpeechId) {
                synth.cancel();
                return;
            }
            isSpeaking = true;
            if (isFirst && currentCallbacks.onStart) {
                currentCallbacks.onStart();
            }
        };

        utterance.onend = () => {
            // Verify this is still the active speech
            if (speechId !== currentSpeechId) return;

            if (isLast) {
                finishCurrentSpeech(true);
            }
            // If not last, the chained sequence handler will fire the next chunk
        };

        utterance.onerror = (e) => {
            // 'interrupted' and 'cancelled' are expected when we cancel speech
            if (e.error === 'interrupted' || e.error === 'canceled') return;
            
            console.warn('[Voice] Speech error:', e.error);
            if (speechId !== currentSpeechId) return;
            
            if (isLast) {
                finishCurrentSpeech(true);
            }
        };

        utterance.onboundary = (e) => {
            if (speechId !== currentSpeechId) return;
            if (e.name === 'word') {
                // Stimulate analyser data on word boundaries for visual sync
                if (analyserData) {
                    for (let i = 0; i < analyserData.length; i++) {
                        analyserData[i] = Math.min(255, 100 + Math.random() * 120);
                    }
                }
            }
        };

        synth.speak(utterance);
        startSpeakingSimulation(text);
    }

    /**
     * Speak multiple chunks in sequence, chaining onend handlers.
     * This avoids Chrome's 15-second utterance cutoff bug.
     */
    function speakChunkedSequence(chunks, speechId) {
        let currentIndex = 0;

        function speakNext() {
            // Check if cancelled
            if (speechId !== currentSpeechId || currentIndex >= chunks.length) {
                if (speechId === currentSpeechId && currentIndex >= chunks.length) {
                    finishCurrentSpeech(true);
                }
                return;
            }

            const isFirst = (currentIndex === 0);
            const isLast = (currentIndex === chunks.length - 1);
            const chunk = chunks[currentIndex];
            currentIndex++;

            const utterance = new SpeechSynthesisUtterance(chunk);
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.rate = 1.12;
            utterance.pitch = 1.05;
            utterance.volume = 1.0;

            currentUtterance = utterance;

            utterance.onstart = () => {
                if (speechId !== currentSpeechId) {
                    synth.cancel();
                    return;
                }
                isSpeaking = true;
                if (isFirst && currentCallbacks.onStart) {
                    currentCallbacks.onStart();
                }
            };

            utterance.onend = () => {
                if (speechId !== currentSpeechId) return;
                
                if (isLast) {
                    finishCurrentSpeech(true);
                } else {
                    // Small pause between chunks for natural flow
                    setTimeout(speakNext, 80);
                }
            };

            utterance.onerror = (e) => {
                if (e.error === 'interrupted' || e.error === 'canceled') return;
                if (speechId !== currentSpeechId) return;
                
                // On error, try to continue with next chunk
                if (!isLast) {
                    setTimeout(speakNext, 80);
                } else {
                    finishCurrentSpeech(true);
                }
            };

            utterance.onboundary = (e) => {
                if (speechId !== currentSpeechId) return;
                if (e.name === 'word' && analyserData) {
                    for (let i = 0; i < analyserData.length; i++) {
                        analyserData[i] = Math.min(255, 100 + Math.random() * 120);
                    }
                }
            };

            synth.speak(utterance);
            startSpeakingSimulation(chunk);
        }

        speakNext();
    }

    /**
     * Clean up after speech finishes (naturally or by error).
     * @param {boolean} fireCallback - Whether to fire the onEnd callback
     */
    function finishCurrentSpeech(fireCallback) {
        isSpeaking = false;
        currentUtterance = null;
        if (simInterval) { clearInterval(simInterval); simInterval = null; }
        if (analyserData) analyserData.fill(0);

        const endCallback = currentCallbacks.onEnd;
        currentCallbacks = { onStart: null, onEnd: null };

        if (fireCallback && endCallback) {
            endCallback();
        }

        // Process next item in queue
        processNextInQueue();
    }

    /**
     * Queue speech — for sequential narration
     */
    function queueSpeak(text, delay = 0) {
        speechQueue.push({ text, delay, callbacks: {}, speechId: ++currentSpeechId });
        if (!isProcessingQueue && !isSpeaking) processNextInQueue();
    }

    function processNextInQueue() {
        if (speechQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }
        isProcessingQueue = true;
        const next = speechQueue.shift();
        
        setTimeout(() => {
            speak(next.text, next.callbacks || {});
        }, next.delay || 0);
    }

    function clearQueue() {
        speechQueue = [];
        isProcessingQueue = false;
    }

    /**
     * Countdown narration — dramatic sequential counting
     */
    function speakCountdown(seconds, prefix = '') {
        clearQueue();
        
        if (prefix) {
            speak(prefix, { interrupt: true });
        } else {
            synth.cancel();
        }
        
        for (let i = seconds; i >= 1; i--) {
            queueSpeak(String(i), 150);
        }
    }

    /**
     * Stress test narration sequences - SHARP, REAL-TIME CONCORDANCE
     */
    function speakStressSequence(phase, data = {}) {
        switch (phase) {
            case 'INIT':
                speak("Test initialized. Calibrating load cells. Commencing in 3.", { interrupt: true });
                break;
            case 'LOADING':
                speak("Linear loading active. Neural net monitoring dF/dt anomalies.", { interrupt: true });
                break;
            case 'WARNING':
                speak("Warning. Micro-fracture instability detected. Nostradamus engaged.", { interrupt: true });
                break;
            case 'CRITICAL':
                const time = data.timeRemaining ? data.timeRemaining.toFixed(0) : '3';
                speak(`Critical failure imminent in ${time}.`, { interrupt: true });
                break;
            case 'RUPTURE':
                speak("Rupture detected! All systems parameter complete.", { interrupt: true });
                break;
            case 'VERDICT':
                const force = data.peakForce ? data.peakForce.toFixed(0) : 'unknown';
                speak(`Analysis complete. Peak force: ${force} Newtons. Maximum theoretical integrity confirmed.`, { interrupt: false });
                break;
            case 'ABORT':
                speak("Abort sequence executed. Test terminated safely.", { interrupt: true });
                break;
        }
    }

    // Simulate voice energy for holographic core reaction
    let simInterval = null;
    function startSpeakingSimulation(text) {
        const duration = text.length * 55;
        let elapsed = 0;
        if (simInterval) clearInterval(simInterval);
        simInterval = setInterval(() => {
            elapsed += 25;
            if (elapsed > duration || !isSpeaking) {
                clearInterval(simInterval);
                simInterval = null;
                if (analyserData) analyserData.fill(0);
                return;
            }
            if (analyserData) {
                for (let i = 0; i < analyserData.length; i++) {
                    const base = 90 + Math.sin(elapsed * 0.012 + i * 0.25) * 55;
                    analyserData[i] = Math.max(0, Math.min(255, base + (Math.random() - 0.5) * 35));
                }
            }
        }, 25);
    }

    function stop() {
        currentSpeechId++; // Invalidate any active speech
        synth.cancel();
        clearQueue();
        finishCurrentSpeech(false); // Don't fire callbacks on manual stop
    }

    function getAnalyserData() { return analyserData; }
    function getIsSpeaking() { return isSpeaking; }
    
    function resumeContext() {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function getAudioContext() { return audioCtx; }

    return {
        init,
        speak,
        stop,
        queueSpeak,
        clearQueue,
        speakCountdown,
        speakStressSequence,
        getAnalyserData,
        getIsSpeaking,
        resumeContext,
        getAudioContext
    };
})();
