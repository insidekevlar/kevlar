/* ============================================
   CHAT ENGINE v3 — Local KevlarBrain Intelligence
   No API needed, instant responses, fully offline
   ============================================ */

window.ChatEngine = (function() {
    let messagesEl, inputEl, sendBtn, micBtn, simBtn;
    let currentScene = 'standby';
    let isTyping = false;
    let isBusy = false;
    let onResponse = null;
    let onEvent = null;
    let currentTypeInterval = null;

    function init(callbacks = {}) {
        messagesEl = document.getElementById('chat-messages');
        inputEl = document.getElementById('chat-input');
        sendBtn = document.getElementById('send-btn');
        micBtn = document.getElementById('mic-btn');
        simBtn = document.getElementById('sim-btn');
        onResponse = callbacks.onResponse || null;
        onEvent = callbacks.onEvent || null;

        sendBtn.addEventListener('click', handleSend);
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        // Global key capture: Type anywhere to chat instantly
        document.addEventListener('keydown', (e) => {
            // Do not steal focus if user is already in another text input
            if (document.activeElement && 
               (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA')) return;
                
            // If they press a printable char or backspace without modifiers, focus the chat box
            if (!e.ctrlKey && !e.altKey && !e.metaKey && (e.key.length === 1 || e.key === 'Backspace')) {
                inputEl.focus();
            }
        });

        // Scene selector
        document.querySelectorAll('.scene-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (isBusy) return;
                document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                changeScene(btn.dataset.scene);
            });
        });

        // Microphone
        if (micBtn) micBtn.addEventListener('click', toggleMic);

        // Simulation button
        if (simBtn) {
            simBtn.addEventListener('click', () => {
                handleSend_internal('Kevin, start the stress test');
            });
        }

        startIdleTimer();
    }

    function handleSend() {
        const text = inputEl.value.trim();
        if (!text || isBusy) return;
        inputEl.value = '';
        handleSend_internal(text);
    }

    function handleSend_internal(text) {
        cancelCurrentResponse();
        addMessage(text, 'user');

        // Check for yes/da confirmation for pending site generation
        const lower = text.toLowerCase().trim();
        if ((lower === 'yes' || lower === 'da' || lower === 'yeah' || lower === 'sure' || lower === 'do it' || lower === 'generate' || lower === 'go') && window._pendingGeneration) {
            const data = window._pendingGeneration;
            window._pendingGeneration = null;
            if (onEvent) onEvent({ command: 'GENERATE_VIZ', vizData: data });
            return;
        }
        window._pendingGeneration = null; // Clear if user says something else

        // Process through KevlarBrain
        const result = KevlarBrain.processMessage(text, currentScene);

        // Check if it returned an event (command)
        if (result.event) {
            switch (result.event.type) {
                case 'DEEP_EXPLAIN':
                    // ── CINEMATIC MODE: instant print, no typewriter ──
                    // The AI takes control — one punchy line, then navigate
                    addCinematicMessage(result.text);
                    setTimeout(() => {
                        if (onEvent) onEvent({ 
                            hudAction: 'flash', 
                            sfxAction: 'scan',
                            command: 'DEEP_EXPLAIN',
                            contextId: result.event.contextId
                        });
                    }, 800); // Snappy — don't wait for speech
                    // Short spoken acknowledgment
                    if (window.VoiceEngine) {
                        window.VoiceEngine.speak(result.text, {
                            onStart: () => { if (onResponse) onResponse(result.text, 'speak-start'); },
                            onEnd: () => { if (onResponse) onResponse(result.text, 'speak-end'); }
                        });
                    }
                    break;

                case 'EXPLAIN_NO_CONTEXT':
                    processResponse(result.text);
                    if (onEvent) onEvent({ hudAction: 'pulse', sfxAction: 'scan' });
                    break;

                case 'START_TEST':
                    processResponse(result.text);
                    setTimeout(() => {
                        if (onEvent) onEvent({ 
                            hudAction: 'flash', 
                            sfxAction: 'alert',
                            command: 'START_TEST'
                        });
                    }, 1000);
                    break;
                
                case 'ABORT':
                    processResponse(result.text);
                    if (onEvent) onEvent({ 
                        hudAction: 'flash', 
                        sfxAction: 'alert',
                        command: 'ABORT'
                    });
                    break;
                
                case 'ANALYZE':
                    processResponse(result.text);
                    setTimeout(() => {
                        if (onEvent) onEvent({ hudAction: 'wow', sfxAction: 'wow' });
                    }, 2000);
                    break;
                
                case 'STATUS':
                case 'HELP':
                    processResponse(result.text);
                    if (onEvent) onEvent({ 
                        hudAction: result.event.hudAction, 
                        sfxAction: result.event.sfxAction 
                    });
                    break;
                
                case 'GENERATE_VIZ':
                    processResponse(result.text);
                    setTimeout(() => {
                        if (onEvent) onEvent({ 
                            command: 'GENERATE_VIZ', 
                            vizData: result.event.vizData,
                            hudAction: result.event.hudAction,
                            sfxAction: result.event.sfxAction
                        });
                    }, 1500); // Wait for KEVIN to speak, then trigger visualization
                    break;
                
                default:
                    processResponse(result.text);
            }
        } else {
            processResponse(result.text);
        }

        // If the brain response includes autonomous actions (viz sequences), fire them
        if (result.actions && result.actions.length > 0) {
            if (onEvent) onEvent({ 
                hudAction: 'pulse', 
                sfxAction: 'scan',
                actions: result.actions 
            });
        }
    }

    function cancelCurrentResponse() {
        if (currentTypeInterval) {
            clearInterval(currentTypeInterval);
            currentTypeInterval = null;
        }
        if (window.VoiceEngine) window.VoiceEngine.stop();
        isTyping = false;
        isBusy = false;
    }

    function processResponse(text) {
        cancelCurrentResponse();
        isBusy = true;
        isTyping = true;
        resetIdleTimer();

        if (onResponse) onResponse(text, 'pre');

        const msgEl = addMessage('', 'ai');
        const contentEl = msgEl.querySelector('.message-content');

        let i = 0;
        const words = text.split(' ');
        let displayed = '';

        currentTypeInterval = setInterval(() => {
            if (i >= words.length) {
                clearInterval(currentTypeInterval);
                currentTypeInterval = null;
                isTyping = false;
                isBusy = false;
                if (onResponse) onResponse(text, 'complete');
                resetIdleTimer();
                return;
            }

            displayed += (i > 0 ? ' ' : '') + words[i];
            contentEl.textContent = displayed;
            messagesEl.scrollTop = messagesEl.scrollHeight;

            if (onResponse) onResponse(words[i], 'word');
            i++;
        }, 45); // Slightly faster typing for snappier feel

        // Speak
        if (window.VoiceEngine) {
            window.VoiceEngine.speak(text, {
                onStart: () => { if (onResponse) onResponse(text, 'speak-start'); },
                onEnd: () => { if (onResponse) onResponse(text, 'speak-end'); }
            });
        }
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}-msg`;

        const label = document.createElement('div');
        label.className = `message-label ${type}`;
        label.textContent = type === 'user' ? '◈ OPERATOR' : '◇ K.E.V.I.N. AI';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;

        msg.appendChild(label);
        msg.appendChild(content);
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        while (messagesEl.children.length > 25) {
            messagesEl.removeChild(messagesEl.firstChild);
        }

        return msg;
    }

    /**
     * CINEMATIC MESSAGE — Instant print with no typewriter.
     * Used when KEVIN takes autonomous control (DEEP_EXPLAIN, navigation).
     * The message appears instantly with a special visual style.
     */
    function addCinematicMessage(text) {
        cancelCurrentResponse();

        const msg = document.createElement('div');
        msg.className = 'message ai-msg cinematic-msg';

        const label = document.createElement('div');
        label.className = 'message-label ai';
        label.textContent = '◆ K.E.V.I.N. AI — AUTONOMOUS';

        const content = document.createElement('div');
        content.className = 'message-content cinematic-content';
        content.textContent = text;

        msg.appendChild(label);
        msg.appendChild(content);
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        while (messagesEl.children.length > 25) {
            messagesEl.removeChild(messagesEl.firstChild);
        }

        // Brief flash effect on the message
        msg.style.borderLeft = '2px solid #ffd700';
        msg.style.background = 'rgba(255, 215, 0, 0.06)';
        setTimeout(() => {
            msg.style.borderLeft = '2px solid rgba(0,212,255,0.3)';
            msg.style.background = '';
        }, 1500);

        if (onResponse) onResponse(text, 'pre');
        if (onResponse) onResponse(text, 'complete');
    }

    function changeScene(scene) {
        cancelCurrentResponse();
        currentScene = scene;
        KevlarBrain.setScene(scene);

        const labelEl = document.getElementById('scene-label');
        const ctxEl = document.getElementById('context-display');
        if (labelEl) labelEl.textContent = getSceneTitle(scene);
        if (ctxEl) ctxEl.textContent = scene.toUpperCase();

        const greeting = KevlarBrain.getSceneGreeting(scene);
        processResponse(greeting);

        if (onEvent) onEvent({ hudAction: 'pulse', sfxAction: 'scan' });
    }

    function getSceneTitle(scene) {
        const titles = {
            standby: 'K.E.V.I.N. AI — DEFENSE SYSTEMS',
            fiber: 'FIBER ANALYSIS — MOLECULAR STRUCTURE',
            bullet: 'BALLISTIC IMPACT — TRAJECTORY ANALYSIS',
            armor: 'ARMOR LAYERS — HEXAGONAL GEOMETRY',
            molecular: 'MOLECULAR ARCHITECTURE — DEEP SCAN'
        };
        return titles[scene] || scene.toUpperCase();
    }

    // Idle timer
    let idleTimer = null;
    let idleFired = false;
    function startIdleTimer() { resetIdleTimer(); }

    function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleFired = false;
        idleTimer = setTimeout(() => {
            if (!isBusy && !isTyping && !idleFired) {
                idleFired = true;
                const phrases = [
                    "All systems nominal. Awaiting your command, operator.",
                    "Sensors green across the board. Say 'help' for available commands.",
                    "K.E.V.I.N. AI standing by. The Kevlar Autonomous Testing Ecosystem is ready.",
                ];
                processResponse(phrases[Math.floor(Math.random() * phrases.length)]);
            }
        }, 120000); // 2 minutes
    }

    // Microphone
    let recognition = null;
    let isRecording = false;
    function toggleMic() {
        if (isRecording) {
            if (recognition) recognition.stop();
            isRecording = false;
            micBtn.classList.remove('recording');
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;

        recognition = new SR();
        recognition.lang = 'en-US'; // Will also understand Romanian commands
        recognition.interimResults = false;
        recognition.continuous = false;
        
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            inputEl.value = transcript;
            handleSend();
        };
        recognition.onerror = () => { isRecording = false; micBtn.classList.remove('recording'); };
        recognition.onend = () => { isRecording = false; micBtn.classList.remove('recording'); };
        recognition.start();
        isRecording = true;
        micBtn.classList.add('recording');
    }

    // External trigger for stress test narration
    function narrate(text) {
        processResponse(text);
    }

    function getCurrentScene() { return currentScene; }
    function getIsBusy() { return isBusy; }

    function addSystemMessage(text) {
        addMessage(text, 'ai');
    }

    return {
        init,
        changeScene,
        getCurrentScene,
        getIsBusy,
        narrate,
        processResponse,
        cancelCurrentResponse,
        addSystemMessage
    };
})();
