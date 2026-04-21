/* ============================================
   APP.JS v3 — Master Coordinator
   Wires all 9 modules into a unified system:
   Brain, WebSocket, Prediction, Voice, Audio,
   HUD, Holographic Core, Data Panels, Chat
   ============================================ */

(function() {
    'use strict';

    let audioInitialized = false;
    let booted = false;
    let fpsFrames = 0;
    let fpsTime = 0;
    let currentFps = 60;
    let actionTimers = []; // Active action sequence timers

    // Stress test state machine
    let testState = 'IDLE'; // IDLE, RUNNING, CRITICAL, COUNTDOWN, RUPTURED, POST
    let testStartTime = 0;

    // ═══════════════════════════════════════════
    // BOOT SEQUENCE
    // ═══════════════════════════════════════════
    function boot() {
        const bootScreen = document.getElementById('boot-screen');
        const bootStatus = document.getElementById('boot-status');
        const bootBar = document.querySelector('.boot-progress-bar');

        const steps = [
            { msg: 'INITIALIZING NEURAL CORE...', pct: 8 },
            { msg: 'LOADING KEVLAR KNOWLEDGE BASE...', pct: 18 },
            { msg: 'DEPLOYING LOCAL AI ENGINE...', pct: 30 },
            { msg: 'CALIBRATING HUD RENDERER...', pct: 42 },
            { msg: 'CONSTRUCTING HOLOGRAPHIC MATRIX...', pct: 54 },
            { msg: 'SYNTHESIZING VOICE ENGINE...', pct: 64 },
            { msg: 'CONFIGURING PREDICTION ALGORITHMS...', pct: 74 },
            { msg: 'ESTABLISHING WEBSOCKET BRIDGE...', pct: 84 },
            { msg: 'ACTIVATING TELEMETRY SYSTEMS...', pct: 92 },
            { msg: 'ALL SYSTEMS NOMINAL — K.E.V.I.N. AI ONLINE', pct: 100 },
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= steps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        showAudioPrompt();
                    }, 1000);
                }, 500);
                return;
            }
            bootStatus.textContent = steps[i].msg;
            bootBar.style.width = steps[i].pct + '%';
            i++;
        }, 280);
    }

    // ═══════════════════════════════════════════
    // AUDIO ACTIVATION
    // ═══════════════════════════════════════════
    function showAudioPrompt() {
        const prompt = document.getElementById('audio-init');
        prompt.classList.remove('hidden');

        const handler = () => {
            prompt.classList.add('hidden');
            setTimeout(() => { prompt.style.display = 'none'; }, 500);
            initializeAll();
            prompt.removeEventListener('click', handler);
        };
        prompt.addEventListener('click', handler);
    }

    // ═══════════════════════════════════════════
    // MASTER INITIALIZATION
    // ═══════════════════════════════════════════
    function initializeAll() {
        audioInitialized = true;

        // 1. Voice Engine (creates AudioContext)
        VoiceEngine.init();
        VoiceEngine.resumeContext();

        // 2. Audio SFX / Physical Data Sonification (shares AudioContext)
        AudioSFX.init(VoiceEngine.getAudioContext());
        AudioSFX.playTransition();
        setTimeout(() => AudioSFX.startAmbient(), 2500);

        // 3. HUD Renderer
        HUDRenderer.init(document.getElementById('hud-canvas'));
        HUDRenderer.start();

        // 4. Holographic Core
        HolographicCore.init(document.getElementById('core-canvas'));
        HolographicCore.start();

        // 5. Data Panels
        DataPanels.init();
        DataPanels.start();

        // 6. WebSocket Bridge (with simulation support)
        WebSocketBridge.init({
            onTelemetry: handleTelemetry,
            onStatusChange: handleWsStatus,
            onMessage: handleWsMessage
        });
        WebSocketBridge.enableSimulation(); // Start in simulation mode

        // 7. Prediction Engine v3 (Scientific Core)
        PredictionEngine.init({
            onPrediction: handlePrediction,
            onStateChange: handlePredictionState,
            onCountdown: handleCountdown,
            onIndicatorUpdate: handleIndicatorUpdate,
            onExplain: handleExplainability,
            onTwinUpdate: handleTwinUpdate,
        });

        // 8. Show UI
        const hudOverlay = document.getElementById('hud-overlay');
        hudOverlay.classList.remove('hidden');
        document.getElementById('chat-container').classList.remove('hidden');

        // 8.5 Cinematic Parallax Effect (Disabled per user request)
        // document.addEventListener('mousemove', (e) => {
        //     const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px shift
        //     const y = (e.clientY / window.innerHeight - 0.5) * 20;
        //     
        //     // Only apply to the overlay content, not the canvases
        //     hudOverlay.style.transform = `translate(${-x}px, ${-y}px) scale(1.02)`;
        // });

        // 9. Chat Engine (wired to Brain)
        ChatEngine.init({
            onResponse: handleAIResponse,
            onEvent: handleEvent
        });

        // 10. Kill Switch
        const killSwitch = document.getElementById('kill-switch');
        if (killSwitch) {
            killSwitch.addEventListener('click', () => {
                executeAbort();
            });
        }

        // 11. VizEngine (Three.js 3D)
        VizEngine.init();

        // 11.5 Ambient Cinematic Effects
        if (window.AmbientEffects) {
            AmbientEffects.init();
            AmbientEffects.start();
        }

        // 12. Viz close button
        const vizClose = document.getElementById('viz-close-btn');
        if (vizClose) {
            vizClose.addEventListener('click', () => {
                VizEngine.hide();
                cancelActionSequence();
            });
        }

        // 13. Site Bridge (click-to-generate)
        SiteBridge.init({
            onSectionClick: handleSiteSection,
            onGenerateRequest: handleSiteGenerate
        });

        // 14. Context Engine (context-aware AI navigation)
        if (window.ContextEngine) {
            ContextEngine.init({
                onContextChange: handleContextChange,
                onExplanationTrigger: handleDeepExplanation
            });
        }

        // Start system loops
        startFPSCounter();
        updateClock();
        setInterval(updateClock, 1000);
        requestAnimationFrame(masterLoop);

        // Welcome message after 1.5s
        setTimeout(() => {
            ChatEngine.changeScene('standby');
        }, 1500);

        booted = true;
    }

    // ═══════════════════════════════════════════
    // SITE SECTION HANDLERS
    // ═══════════════════════════════════════════
    let pendingGeneration = null;

    function handleSiteSection(data) {
        // Cancel any ongoing speech/narration before starting a new section
        cancelActionSequence();
        VoiceEngine.stop();
        ChatEngine.cancelCurrentResponse();

        // KEVIN asks if user wants generation
        pendingGeneration = data;
        window._pendingGeneration = data; // For ChatEngine yes/da detection
        HUDRenderer.pulse();
        HolographicCore.pulse();
        AudioSFX.playClick();

        // Add the prompt to chat
        ChatEngine.addSystemMessage(
            `Section detected: ${data.sectionName}. ${data.prompt} Say "yes" or "da" to generate.`
        );

        // Speak the prompt
        VoiceEngine.speak(`I see you selected ${data.sectionName}. ${data.prompt}`, {
            onStart: () => { HolographicCore.setMood('speaking'); HUDRenderer.setSpeaking(true); },
            onEnd: () => { HolographicCore.setMood('idle'); HUDRenderer.setSpeaking(false); }
        });
    }

    function handleSiteGenerate(data) {
        generateVizForSection(data);
    }

    function generateVizForSection(data) {
        // Cancel any previous narration/speech before starting new viz
        cancelActionSequence();
        VoiceEngine.stop();
        ChatEngine.cancelCurrentResponse();

        // Show the 3D viz
        VizEngine.show(data.viz);
        HUDRenderer.flash();
        AudioSFX.playTransition();

        // Speak the response
        VoiceEngine.speak(data.response, {
            onStart: () => { HolographicCore.setMood('speaking'); HUDRenderer.setSpeaking(true); },
            onEnd: () => { HolographicCore.setMood('idle'); HUDRenderer.setSpeaking(false); }
        });

        // Fire physical websocket command for True Cyber-Physical Sync
        if (window.WebSocketBridge) {
            WebSocketBridge.sendCommand('VIZ_SYNC', { section: data.viz });
        }

        // Execute narration sequence
        if (data.narration) {
            const actions = data.narration.map(n => ({ type: 'NARRATE', text: n.text, delay: n.delay }));
            executeActionSequence(actions);
        }

        ChatEngine.addSystemMessage(data.response);
        pendingGeneration = null;
    }

    // ═══════════════════════════════════════════
    // MASTER ANIMATION LOOP
    // ═══════════════════════════════════════════
    function masterLoop() {
        requestAnimationFrame(masterLoop);

        // Voice data → visuals
        const data = VoiceEngine.getAnalyserData();
        if (data) {
            DataPanels.setVoiceData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i];
            const avg = sum / data.length / 255;
            HolographicCore.setVoiceEnergy(avg);
        }

        // Update LED indicators + sonification
        const tel = WebSocketBridge.getLastTelemetry();
        if (tel) {
            DataPanels.updateLEDs(tel.ledMode || 'standby');
        }

        // Update sonification from telemetry
        const predState = PredictionEngine.getState();
        const indic = PredictionEngine.getIndicators();
        AudioSFX.updateSonification({
            force: tel ? tel.force : 0,
            state: predState,
            EFI: indic.EFI,
            IGI: indic.IGI,
            P_failure: indic.P_failure,
            peakForce: PredictionEngine.getPeakForce(),
        });

        // Update PiP timestamp
        const pipTs = document.getElementById('pip-timestamp');
        if (pipTs) {
            const now = new Date();
            pipTs.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
        }
    }

    // ═══════════════════════════════════════════
    // TELEMETRY HANDLER (from WebSocket/Simulation)
    // ═══════════════════════════════════════════
    function handleTelemetry(data) {
        // Update data panels
        DataPanels.updateTelemetry(data);

        // Feed prediction engine v3
        PredictionEngine.feedData(data.force, data.timestamp);

        // Update derivative display
        DataPanels.updateDerivative(PredictionEngine.getLastDerivative());

        // Stress-reactive visuals
        const maxForce = 900;
        const stressRatio = Math.min(data.force / maxForce, 1);

        HolographicCore.setStressLevel(stressRatio);
        HUDRenderer.setReactivity(stressRatio * 0.5);
        if (window.AmbientEffects) AmbientEffects.setStress(stressRatio);

        // Update HUD status indicators based on simulation phase
        if (data.simPhase) {
            updateSystemStatus(data.simPhase);
        }
    }

    // ═══════════════════════════════════════════
    // SCIENTIFIC INDICATOR HANDLERS (NEW v3)
    // ═══════════════════════════════════════════
    function handleIndicatorUpdate(data) {
        // Update scientific dashboard panels if visible
        const efiEl = document.getElementById('sci-efi-value');
        const igiEl = document.getElementById('sci-igi-value');
        const dtdEl = document.getElementById('sci-dtd-value');
        const probEl = document.getElementById('sci-prob-value');
        const probBar = document.getElementById('sci-prob-bar');
        const stateEl = document.getElementById('sci-state-value');

        if (efiEl) efiEl.textContent = data.EFI.toFixed(4);
        if (igiEl) igiEl.textContent = data.IGI.toFixed(4);
        if (dtdEl) dtdEl.textContent = data.DTD.toFixed(4);
        if (probEl) probEl.textContent = (data.P_failure * 100).toFixed(1) + '%';
        if (probBar) probBar.style.width = (data.P_failure * 100) + '%';
        if (stateEl) {
            stateEl.textContent = data.state;
            stateEl.className = 'sci-state-badge state-' + data.state.toLowerCase();
        }

        // Update the dF/dt and d²F/dt² displays
        const dfEl = document.getElementById('sci-dfdt-value');
        const d2fEl = document.getElementById('sci-d2fdt2-value');
        if (dfEl) dfEl.textContent = (data.dFdt || 0).toFixed(2);
        if (d2fEl) d2fEl.textContent = (data.d2Fdt2 || 0).toFixed(2);
    }

    function handleExplainability(entry) {
        // Append to explainability log panel
        const logPanel = document.getElementById('sci-explain-log');
        if (!logPanel) return;

        const div = document.createElement('div');
        div.className = 'explain-entry';
        div.innerHTML = entry.steps.map(s =>
            `<div class="explain-step"><span class="explain-label">${s.label}</span> ${s.text}</div>`
        ).join('');
        logPanel.appendChild(div);
        logPanel.scrollTop = logPanel.scrollHeight;

        // Keep only last 20 entries
        while (logPanel.children.length > 20) logPanel.removeChild(logPanel.firstChild);
    }

    function handleTwinUpdate(data) {
        // Update digital twin calibration display
        const eModEl = document.getElementById('sci-twin-e');
        const kEl = document.getElementById('sci-twin-k');
        const stepEl = document.getElementById('sci-twin-steps');
        const residEl = document.getElementById('sci-twin-residual');

        if (eModEl) eModEl.textContent = data.E.toFixed(0);
        if (kEl) kEl.textContent = data.k.toFixed(0);
        if (stepEl) stepEl.textContent = data.calibSteps;
        if (residEl) residEl.textContent = data.residual.toFixed(2);

        // Update force graph with both real and model
        DataPanels.updateTwinForce(data.F_model, data.F_real);
    }

    // ═══════════════════════════════════════════
    // PREDICTION HANDLERS
    // ═══════════════════════════════════════════
    function handlePrediction(prediction) {
        DataPanels.updatePrediction(
            prediction.confidence,
            PredictionEngine.getState()
        );
    }

    function handlePredictionState(newState, data) {
        switch (newState) {
            case 'MONITORING':
                break;

            case 'WARNING': {
                AudioSFX.playAlert('warning');
                HUDRenderer.flash();
                VoiceEngine.speakStressSequence('WARNING');

                const warning = document.getElementById('stress-warning');
                if (warning) {
                    warning.textContent = `INSTABILITY DETECTED — EFI: ${(data.indicators.EFI * 100).toFixed(1)}%`;
                    warning.classList.add('active');
                }
                document.getElementById('stress-overlay').classList.remove('hidden');
                break;
            }

            case 'CRITICAL': {
                AudioSFX.playAlert('critical');
                HUDRenderer.flash();
                const warn2 = document.getElementById('stress-warning');
                if (warn2) {
                    warn2.textContent = `CRITICAL — P(failure): ${(data.indicators.P_failure * 100).toFixed(0)}% | EFI: ${(data.indicators.EFI * 100).toFixed(1)}%`;
                }
                break;
            }

            case 'COUNTDOWN': {
                const cdEl = document.getElementById('stress-countdown');
                if (cdEl) cdEl.classList.add('active');
                const predStats = PredictionEngine.getStats();
                VoiceEngine.speakStressSequence('CRITICAL', {
                    timeRemaining: predStats.countdownValue
                });
                break;
            }

            case 'RUPTURED':
                handleRupture(data);
                break;
        }
    }

    function handleCountdown(value) {
        const cdEl = document.getElementById('stress-countdown');
        if (cdEl) {
            cdEl.textContent = value;
            cdEl.classList.add('active');
        }
        
        AudioSFX.playCountdownBeep(value);
        
        if (value <= 0) {
            if (cdEl) cdEl.textContent = '';
        }
    }

    // ═══════════════════════════════════════════
    // RUPTURE HANDLER — The WOW Moment
    // ═══════════════════════════════════════════
    function handleRupture(data) {
        testState = 'RUPTURED';

        // Audio: failure sonification (noise burst → silence)
        AudioSFX.updateSonification({ force: 0, state: 'RUPTURED', EFI: 1, IGI: 1, P_failure: 1, peakForce: data ? data.peakForce : 0 });
        
        // Visual: shockwave
        HolographicCore.shockwave();
        HUDRenderer.flash();
        
        // Add screen shake class to HUD overlay
        const hudOverlay = document.getElementById('hud-overlay');
        if (hudOverlay) {
            hudOverlay.style.animation = 'screenShake 0.5s ease-in-out infinite';
            hudOverlay.style.filter = 'drop-shadow(0 0 20px rgba(255,51,68,0.5))';
        }

        // Update overlays
        const warning = document.getElementById('stress-warning');
        if (warning) {
            warning.textContent = 'CATASTROPHIC FAILURE DETECTED';
        }
        
        const cdEl = document.getElementById('stress-countdown');
        if (cdEl) {
            cdEl.classList.remove('active');
            cdEl.textContent = '';
        }

        // Narrate
        VoiceEngine.speakStressSequence('RUPTURE');

        // Show verdict after 3 seconds
        setTimeout(() => {
            showVerdict(data);
        }, 4000);
    }

    function showVerdict(data) {
        const verdict = document.getElementById('stress-verdict');
        const warning = document.getElementById('stress-warning');
        
        if (warning) {
            warning.textContent = 'TEST COMPLETE — ANALYZING RESULTS';
            warning.classList.remove('active');
        }

        if (verdict) {
            verdict.textContent = 'VERDICT: ULTIMATE DEFENSE MATERIAL';
            verdict.classList.add('active');
        }

        // Victory sounds and narration
        AudioSFX.playTransition();
        VoiceEngine.speakStressSequence('VERDICT', {
            peakForce: data ? data.peakForce : PredictionEngine.getPeakForce()
        });

        // Reset visuals after verdict
        setTimeout(() => {
            resetStressTest();
        }, 12000);
    }

    function resetStressTest() {
        testState = 'IDLE';
        
        // Hide overlays
        document.getElementById('stress-overlay').classList.add('hidden');
        const cdEl = document.getElementById('stress-countdown');
        const warning = document.getElementById('stress-warning');
        const verdict = document.getElementById('stress-verdict');
        
        if (cdEl) { cdEl.classList.remove('active'); cdEl.textContent = ''; }
        if (warning) { warning.classList.remove('active'); warning.textContent = ''; }
        if (verdict) { verdict.classList.remove('active'); verdict.textContent = ''; }

        // Hide kill switch
        document.getElementById('kill-switch').classList.add('hidden');
        
        // Remove screen shake
        const hudOverlay = document.getElementById('hud-overlay');
        if (hudOverlay) {
            hudOverlay.style.animation = '';
            hudOverlay.style.filter = '';
        }

        // Reset all systems
        HolographicCore.resetStress();
        AudioSFX.setStressLevel(0);
        PredictionEngine.reset();
        DataPanels.resetTelemetry();
        DataPanels.updatePrediction(0, 'IDLE');
        KevlarBrain.setTestState('IDLE');
        
        updateSystemStatus('IDLE');
    }

    // ═══════════════════════════════════════════
    // AI RESPONSE HANDLER (from ChatEngine)
    // ═══════════════════════════════════════════
    function handleAIResponse(data, phase) {
        switch (phase) {
            case 'pre':
                HUDRenderer.pulse();
                HolographicCore.pulse();
                AudioSFX.playClick();
                break;
            case 'word':
                HolographicCore.wordImpact(data);
                break;
            case 'speak-start':
                HolographicCore.setMood('speaking');
                HUDRenderer.setSpeaking(true);
                break;
            case 'speak-end':
                HolographicCore.setMood('idle');
                HUDRenderer.setSpeaking(false);
                break;
            case 'complete':
                break;
        }
    }

    // ═══════════════════════════════════════════
    // EVENT HANDLER (commands from ChatEngine)
    // ═══════════════════════════════════════════
    function handleEvent(event) {
        if (!event) return;

        // HUD actions
        if (event.hudAction === 'pulse') {
            HUDRenderer.pulse();
            HolographicCore.pulse();
        }
        if (event.hudAction === 'flash') {
            HUDRenderer.flash();
            HolographicCore.pulse();
            document.getElementById('hud-overlay').classList.add('hud-flash');
            setTimeout(() => document.getElementById('hud-overlay').classList.remove('hud-flash'), 500);
        }
        if (event.hudAction === 'wow') {
            triggerWowMoment();
        }

        // SFX actions
        if (event.sfxAction === 'scan') AudioSFX.playClick();
        if (event.sfxAction === 'alert') AudioSFX.playAlert('warning');
        if (event.sfxAction === 'wow') AudioSFX.playTransition();

        // Command routing
        if (event.type === 'START_TEST' || event.command === 'START_TEST') {
            executeStartTest();
        }
        if (event.type === 'ABORT' || event.command === 'ABORT') {
            executeAbort();
        }
        if ((event.type === 'GENERATE_VIZ' || event.command === 'GENERATE_VIZ') && event.vizData) {
            generateVizForSection(event.vizData);
        }
        if ((event.type === 'DEEP_EXPLAIN' || event.command === 'DEEP_EXPLAIN') && event.contextId) {
            handleDeepExplanation(event.contextId);
        }

        // Action sequences (autonomous 3D viz)
        if (event.actions && event.actions.length > 0) {
            executeActionSequence(event.actions);
        }

        // Update scene color
        const scene = ChatEngine.getCurrentScene();
        updateSceneColor(scene);
    }
    
    // Expose to window so ChatEngine can trigger it
    window.handleEvent = handleEvent;

    // ═══════════════════════════════════════════
    // CONTEXT-AWARE AI NAVIGATION SYSTEM
    // ═══════════════════════════════════════════

    /**
     * Handle context changes (user hovering over different elements)
     */
    function handleContextChange(data) {
        // Subtle HUD feedback when context changes
        if (data.context !== data.previous) {
            // Mini pulse on holographic core
            HolographicCore.pulse();
            
            // Update context display with animation
            const ctxEl = document.getElementById('context-display');
            if (ctxEl) {
                ctxEl.textContent = data.context.toUpperCase().replace(/-/g, ' ');
                ctxEl.style.color = '#ffd700';
            }
        }
    }

    /**
     * Trigger the full Deep Explanation flow — THE GOLD FEATURE
     * This is where the magic happens:
     * 0. SCANNING animation (LEDs + HUD feedback) — 400ms
     * 1. Kevin speaks acknowledgment (already done by chat-engine)
     * 2. Cinematic blur-fade transition
     * 3. Fullscreen explanation section opens
     * 4. 3D model loads with cinematic camera entrance
     * 5. Explanation text types in progressively
     * 6. Key points animate in with stagger
     * 7. Kevin narrates the explanation
     */
    function handleDeepExplanation(contextId) {
        if (!window.ContextEngine) return;
        const explanation = ContextEngine.getExplanation(contextId);
        if (!explanation) {
            console.warn('[App] No explanation found for context:', contextId);
            return;
        }

        // ── PHASE 0: SCANNING ANIMATION (400ms) ──
        // Visual feedback that KEVIN is "acquiring" the target
        AudioSFX.playClick(); // Scan click sound
        HUDRenderer.pulse();

        // Flash the scanning label gold briefly
        const scanLabel = document.getElementById('kevin-scan-label');
        if (scanLabel) {
            scanLabel.textContent = `◉ ACQUIRING: ${contextId.toUpperCase().replace(/-/g, ' ')}`;
            scanLabel.style.color = '#ffd700';
            scanLabel.style.textShadow = '0 0 20px rgba(255,215,0,0.8)';
        }

        // LED scanning effect
        DataPanels.updateLEDs('warning');

        // ── PHASE 1: CINEMATIC TRANSITION (after 400ms scan) ──
        setTimeout(() => {
            // Restore scan label
            if (scanLabel) {
                scanLabel.textContent = `◉ DEEP ANALYSIS: ${contextId.toUpperCase().replace(/-/g, ' ')}`;
                scanLabel.style.color = '#00d4ff';
                scanLabel.style.textShadow = '0 0 12px rgba(0,212,255,0.6)';
            }

            // Audio: transition sound
            AudioSFX.playTransition();
            HUDRenderer.flash();
            if (HolographicCore.explode) HolographicCore.explode();

            // Navigate to explanation (cinematic transition → section opens)
            ContextEngine.navigateToExplanation(contextId, {
                onReady: (exp) => {
                    // After the explanation section opens, Kevin narrates
                    setTimeout(() => {
                        // Narrate the summary
                        VoiceEngine.speak(
                            `${exp.title}. ${exp.summary}`,
                            {
                                onStart: () => {
                                    HolographicCore.setMood('speaking');
                                    HUDRenderer.setSpeaking(true);
                                },
                                onEnd: () => {
                                    HolographicCore.setMood('idle');
                                    HUDRenderer.setSpeaking(false);
                                    
                                    // Narrate deeper after a pause
                                    setTimeout(() => {
                                        // Pick key points to narrate (first 3)
                                        const kpText = exp.key_points.slice(0, 3).join('. ');
                                        VoiceEngine.speak(
                                            `Key findings: ${kpText}.`,
                                            {
                                                onStart: () => {
                                                    HolographicCore.setMood('speaking');
                                                    HUDRenderer.setSpeaking(true);
                                                },
                                                onEnd: () => {
                                                    HolographicCore.setMood('idle');
                                                    HUDRenderer.setSpeaking(false);
                                                    // Reset LEDs after narration
                                                    DataPanels.updateLEDs('standby');
                                                }
                                            }
                                        );
                                    }, 1500);
                                }
                            }
                        );
                    }, 800); // Tighter — don't wait too long for visuals
                }
            });
        }, 400); // Brief scan animation before transition
    }

    // ═══════════════════════════════════════════
    // ACTION EXECUTOR — Processes viz sequences
    // ═══════════════════════════════════════════
    function executeActionSequence(actions) {
        if (!actions || actions.length === 0) return;
        
        cancelActionSequence(); // Clear any previous sequence

        for (const action of actions) {
            const timer = setTimeout(() => {
                switch(action.type) {
                    case 'VIZ':
                        VizEngine.show(action.viz, action.options || {});
                        AudioSFX.playClick();
                        break;
                    case 'HIGHLIGHT':
                        VizEngine.highlightAtom(action.target);
                        break;
                    case 'CAMERA':
                        VizEngine.moveCameraTo(action.target);
                        break;
                    case 'NARRATE':
                        VoiceEngine.speak(action.text, {
                            onStart: () => {
                                HolographicCore.setMood('speaking');
                                HUDRenderer.setSpeaking(true);
                            },
                            onEnd: () => {
                                HolographicCore.setMood('idle');
                                HUDRenderer.setSpeaking(false);
                            }
                        });
                        break;
                    case 'CLEAR_HIGHLIGHTS':
                        VizEngine.clearHighlights();
                        break;
                    case 'LABEL':
                        // Labels are handled by viz-engine directly
                        break;
                }
            }, action.delay);
            actionTimers.push(timer);
        }
    }

    function cancelActionSequence() {
        actionTimers.forEach(t => clearTimeout(t));
        actionTimers = [];
    }

    // ═══════════════════════════════════════════
    // TEST EXECUTION
    // ═══════════════════════════════════════════
    function executeStartTest() {
        if (testState !== 'IDLE') return;
        
        testState = 'RUNNING';
        testStartTime = Date.now();
        KevlarBrain.setTestState('RUNNING');

        // Show kill switch
        document.getElementById('kill-switch').classList.remove('hidden');

        // Start simulation/real test
        WebSocketBridge.sendCommand('START_TEST');

        updateSystemStatus('RUNNING');
    }

    function executeAbort() {
        testState = 'IDLE';
        KevlarBrain.setTestState('IDLE');

        // Send abort command
        WebSocketBridge.sendCommand('ABORT');
        WebSocketBridge.abortSimulation();

        // Voice narration
        VoiceEngine.speakStressSequence('ABORT');
        AudioSFX.playAlert();
        HUDRenderer.flash();

        // Reset UI state and stay on the page
        setTimeout(() => {
            resetStressTest();
        }, 3000);
    }

    // ═══════════════════════════════════════════
    // WEBSOCKET STATUS
    // ═══════════════════════════════════════════
    function handleWsStatus(status, address) {
        const wsEl = document.getElementById('ws-status');
        const wsDot = document.getElementById('ws-dot');
        const wsText = document.getElementById('ws-status-text');
        
        // PiP camera elements for pairing sequence
        const noSignal = document.getElementById('pip-no-signal');
        const pairing = document.getElementById('pip-pairing');
        const signalBars = document.getElementById('signal-bars');

        if (!wsEl) return;

        wsEl.className = 'ws-status';
        if (signalBars) signalBars.className = 'signal-bars';
        
        switch (status) {
            case 'CONNECTED':
                wsEl.classList.add('connected');
                if (wsText) wsText.textContent = 'Pi ONLINE';
                KevlarBrain.setWsConnected(true);
                triggerPairingSequence('connected');
                break;
            case 'DISCONNECTED':
                if (wsText) wsText.textContent = 'OFFLINE';
                KevlarBrain.setWsConnected(false);
                if (noSignal) noSignal.classList.remove('hidden');
                if (pairing) pairing.classList.add('hidden');
                break;
            case 'SIMULATION':
                if (wsText) wsText.textContent = 'SIMULATION';
                triggerPairingSequence('sim');
                break;
            case 'SIMULATION_ACTIVE':
                if (wsText) wsText.textContent = 'SIM ACTIVE';
                if (signalBars) signalBars.classList.add('sim');
                if (noSignal) noSignal.classList.add('hidden');
                if (pairing) pairing.classList.add('hidden');
                break;
        }
    }

    function triggerPairingSequence(mode) {
        const noSignal = document.getElementById('pip-no-signal');
        const pairing = document.getElementById('pip-pairing');
        const signalBars = document.getElementById('signal-bars');
        
        if (noSignal && pairing && signalBars) {
            // Hide no signal, show pairing
            noSignal.classList.add('hidden');
            pairing.classList.remove('hidden');
            
            // Play a transitioning sound
            if (window.AudioSFX) AudioSFX.playClick();
            
            // Simulate handshake delay
            setTimeout(() => {
                pairing.classList.add('hidden');
                signalBars.classList.add(mode); // 'connected' or 'sim'
                if (window.AudioSFX) AudioSFX.playTransition();
            }, 1500);
        }
    }

    function handleWsMessage(data) {
        // Handle custom Pi messages
        console.log('[WS] Message:', data);
    }

    // ═══════════════════════════════════════════
    // SYSTEM STATUS UPDATES
    // ═══════════════════════════════════════════
    function updateSystemStatus(phase) {
        const dot = document.getElementById('system-dot');
        const text = document.getElementById('system-status-text');
        
        if (!dot || !text) return;

        dot.className = 'hud-dot';
        
        switch (phase) {
            case 'IDLE':
                dot.classList.add('online');
                text.textContent = 'ONLINE';
                text.style.color = '#00ff88';
                break;
            case 'CALIBRATING':
                dot.classList.add('online');
                text.textContent = 'CALIBRATING';
                text.style.color = '#00d4ff';
                break;
            case 'RUNNING':
            case 'LOADING':
                dot.classList.add('warning');
                text.textContent = 'TEST ACTIVE';
                text.style.color = '#ff6600';
                break;
            case 'CRITICAL':
                dot.classList.add('danger');
                text.textContent = 'CRITICAL';
                text.style.color = '#ff3344';
                break;
            case 'RUPTURE':
                dot.classList.add('danger');
                text.textContent = 'RUPTURE!';
                text.style.color = '#ff3344';
                break;
            case 'POST':
                text.textContent = 'ANALYZING';
                text.style.color = '#ffd700';
                break;
        }
    }

    // ═══════════════════════════════════════════
    // SCENE COLOR
    // ═══════════════════════════════════════════
    function updateSceneColor(scene) {
        const colors = {
            standby: [0, 212, 255],
            fiber: [0, 255, 136],
            bullet: [255, 51, 68],
            armor: [255, 102, 0],
            molecular: [255, 215, 0]
        };
        const c = colors[scene] || colors.standby;
        HUDRenderer.setSceneColor(c[0], c[1], c[2]);
    }

    // ═══════════════════════════════════════════
    // WOW MOMENT (Cinematic Analysis)
    // ═══════════════════════════════════════════
    function triggerWowMoment() {
        const overlay = document.getElementById('wow-overlay');
        const wowCanvas = document.getElementById('wow-canvas');
        const wowText = document.getElementById('wow-text');
        overlay.classList.remove('hidden');

        AudioSFX.playTransition();
        HolographicCore.explode();

        const ctx = wowCanvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = window.innerWidth;
        const H = window.innerHeight;
        wowCanvas.width = W * dpr;
        wowCanvas.height = H * dpr;
        wowCanvas.style.width = W + 'px';
        wowCanvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const explosionParticles = [];
        for (let i = 0; i < 500; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 8;
            const colors = ['#00d4ff', '#ff6600', '#ffd700', '#00ff88', '#ff3344'];
            explosionParticles.push({
                x: W / 2, y: H / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.005 + Math.random() * 0.01,
                size: 1 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        let wowFrame = 0;
        function animateWow() {
            wowFrame++;
            ctx.fillStyle = 'rgba(0,5,15,0.08)';
            ctx.fillRect(0, 0, W, H);

            for (const p of explosionParticles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.99;
                p.vy *= 0.99;
                p.life -= p.decay;
                if (p.life <= 0) continue;

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = p.life * 0.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            if (wowFrame < 300) requestAnimationFrame(animateWow);
        }
        animateWow();

        // WOW text sequence
        const wowSequence = [
            { delay: 500, text: '<span class="highlight">KEVLAR ANALYSIS INITIATED</span>' },
            { delay: 1500, text: '<span class="highlight">KEVLAR ANALYSIS INITIATED</span><br>Molecular Structure: POLY-PARAPHENYLENE TEREPHTHALAMIDE' },
            { delay: 2500, text: '<span class="highlight">KEVLAR ANALYSIS INITIATED</span><br>Molecular Structure: POLY-PARAPHENYLENE TEREPHTHALAMIDE<br>Tensile Strength: 3,620 MPa — <span style="color:#ff6600">850% STRONGER THAN STEEL</span>' },
            { delay: 3500, text: '<span class="highlight">KEVLAR ANALYSIS INITIATED</span><br>Molecular Structure: POLY-PARAPHENYLENE TEREPHTHALAMIDE<br>Tensile Strength: 3,620 MPa — <span style="color:#ff6600">850% STRONGER THAN STEEL</span><br>Ballistic Rating: NIJ IIIA+ — Stops .44 Magnum at 490 m/s' },
            { delay: 4500, text: '<span class="highlight">KEVLAR ANALYSIS INITIATED</span><br>Molecular Structure: POLY-PARAPHENYLENE TEREPHTHALAMIDE<br>Tensile Strength: 3,620 MPa — <span style="color:#ff6600">850% STRONGER THAN STEEL</span><br>Ballistic Rating: NIJ IIIA+ — Stops .44 Magnum at 490 m/s<br><br><span class="highlight" style="color:#ffd700">VERDICT: ULTIMATE DEFENSE MATERIAL</span>' },
        ];

        for (const step of wowSequence) {
            setTimeout(() => { wowText.innerHTML = step.text; }, step.delay);
        }

        VoiceEngine.speak("Kevlar analysis initiated. Molecular structure: poly-paraphenylene terephthalamide. Tensile strength: 3,620 megapascals. 850 percent stronger than steel. Ballistic rating: NIJ level 3A plus. Stops .44 Magnum at 490 meters per second. Verdict: ultimate defense material.", {
            onStart: () => HolographicCore.setMood('speaking'),
            onEnd: () => HolographicCore.setMood('idle')
        });

        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.style.opacity = '';
                overlay.style.transition = '';
                ctx.clearRect(0, 0, W, H);
            }, 1500);
        }, 8000);
    }

    // ═══════════════════════════════════════════
    // FPS & CLOCK
    // ═══════════════════════════════════════════
    function startFPSCounter() {
        const fpsEl = document.getElementById('hud-fps');
        setInterval(() => { fpsEl.textContent = currentFps + ' FPS'; }, 500);

        function countFrame() {
            fpsFrames++;
            const now = performance.now();
            if (now - fpsTime >= 1000) {
                currentFps = fpsFrames;
                fpsFrames = 0;
                fpsTime = now;
            }
            requestAnimationFrame(countFrame);
        }
        fpsTime = performance.now();
        requestAnimationFrame(countFrame);
    }

    function updateClock() {
        document.getElementById('hud-clock').textContent = 
            new Date().toLocaleTimeString('en-GB', { hour12: false });
    }

    // ═══════════════════════════════════════════
    // UI INTERACTIONS
    // ═══════════════════════════════════════════
    document.addEventListener('click', (e) => {
        if (!audioInitialized) return;
        if (e.target.closest('.scene-btn') || e.target.closest('.send-btn') || e.target.closest('.mic-btn')) {
            AudioSFX.playClick();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!booted) return;
        if (testState !== 'IDLE') return; // Don't override test reactivity
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        HUDRenderer.setReactivity(Math.sqrt(dx * dx + dy * dy) * 0.3);
    });

    // ═══════════════════════════════════════════
    // START
    // ═══════════════════════════════════════════
    window.addEventListener('DOMContentLoaded', boot);

    // Expose app controls to global namespace (for ChatEngine backups)
    window.app = {
        executeStartTest,
        executeAbort
    };

})();
