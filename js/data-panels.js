/* ============================================
   DATA PANELS v2 — Waveform, radar, telemetry
   Force graph, gauges, and prediction display
   ============================================ */

window.DataPanels = (function() {
    let waveCanvas, waveCtx;
    let radarCanvas, radarCtx;
    let forceGraphCanvas, forceGraphCtx;
    let forceGaugeCanvas, forceGaugeCtx;
    let time = 0;
    let isActive = false;
    let animId = null;
    let voiceData = null;
    let feedEl = null;

    // Telemetry data
    let forceHistory = []; // For graph rendering
    const MAX_GRAPH_POINTS = 200;
    let currentForce = 0;
    let peakForce = 0;
    let currentStrain = 0;
    let currentDfdt = 0;
    let currentPwm = 0;

    const feedMessages = [
        'K.E.V.I.N._AI_CORE_ONLINE // DEFENSE_PROTOCOL_V4.0 // AUTONOMOUS TESTING ECOSYSTEM',
        'KEVLAR_MATRIX: POLY-PARAPHENYLENE TEREPHTHALAMIDE // TENSILE: 3620MPa // DENSITY: 1.44g/cm³',
        'MOLECULAR_SCAN: ACTIVE // HYDROGEN_BONDS: STABLE // CRYSTALLINITY: 92.4% // MODULUS: 112GPa',
        'NEURAL_CORE: LOCAL_AI // VOICE_ENGINE: NATURAL // HUD_RENDER: 60FPS // PREDICTION: STANDBY',
        'ARMOR_LAYERS: 5 // HEXAGONAL_GEOMETRY: ACTIVE // SPIDER_WEB_MATRIX: DEPLOYED // NIJ: IIIA+',
        'BALLISTIC: .44MAG@490m/s // BACKFACE: <44mm // MULTI_HIT: 6+ // STATUS: PROTECTED',
        'KEVLAR-REX: HEXAPOD // SERVOS: 18×MG996R // PCA9685: READY // HX711: CALIBRATED // ESP32-CAM: ×2',
        'WEBSOCKET_BRIDGE: MONITORING // PREDICTION_ENGINE: dF/dt ANALYSIS // NOSTRADAMUS: READY',
    ];

    function init() {
        waveCanvas = document.getElementById('waveform-canvas');
        radarCanvas = document.getElementById('radar-canvas');
        forceGraphCanvas = document.getElementById('force-graph-canvas');
        forceGaugeCanvas = document.getElementById('force-gauge-canvas');
        feedEl = document.getElementById('feed-scroll');

        setupCanvas(waveCanvas, 'wave');
        setupCanvas(radarCanvas, 'radar');
        setupCanvas(forceGraphCanvas, 'forceGraph');
        setupCanvas(forceGaugeCanvas, 'forceGauge');

        populateFeed();
    }

    function setupCanvas(canvas, type) {
        if (!canvas) return;
        const r = canvas.getBoundingClientRect();
        const dpr = 2;
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        switch(type) {
            case 'wave': waveCtx = ctx; break;
            case 'radar': radarCtx = ctx; break;
            case 'forceGraph': forceGraphCtx = ctx; break;
            case 'forceGauge': forceGaugeCtx = ctx; break;
        }
    }

    function populateFeed() {
        if (!feedEl) return;
        // Double the messages for continuous scrolling
        const doubled = [...feedMessages, ...feedMessages];
        feedEl.innerHTML = doubled.map(m => `<span>${m}</span>`).join('');
    }

    function start() { isActive = true; render(); }
    function stop() { isActive = false; if (animId) cancelAnimationFrame(animId); }
    function setVoiceData(data) { voiceData = data; }

    /**
     * Update telemetry data from WebSocket bridge
     */
    function updateTelemetry(data) {
        currentForce = data.force || 0;
        currentStrain = data.strain || 0;
        currentPwm = data.motorPWM || 0;
        
        if (currentForce > peakForce) peakForce = currentForce;
        
        // Record for graph
        forceHistory.push(currentForce);
        if (forceHistory.length > MAX_GRAPH_POINTS) forceHistory.shift();

        // Update text displays
        const forceEl = document.getElementById('force-value');
        const peakEl = document.getElementById('peak-value');
        const strainEl = document.getElementById('strain-value');
        const pwmEl = document.getElementById('pwm-value');
        
        if (forceEl) forceEl.textContent = currentForce.toFixed(1) + ' N';
        if (peakEl) peakEl.textContent = peakForce.toFixed(1) + ' N';
        if (strainEl) strainEl.textContent = currentStrain.toFixed(2) + '%';
        if (pwmEl) pwmEl.textContent = Math.round(currentPwm) + '%';

        // Color the force value based on stress
        if (forceEl) {
            const ratio = currentForce / 900; // Approximate max
            if (ratio < 0.5) forceEl.style.color = '#00d4ff';
            else if (ratio < 0.8) forceEl.style.color = '#ff6600';
            else forceEl.style.color = '#ff3344';
        }
    }

    function updateDerivative(dfdt) {
        currentDfdt = dfdt;
        const dfdtEl = document.getElementById('dfdt-value');
        if (dfdtEl) {
            dfdtEl.textContent = dfdt.toFixed(2);
            if (dfdt < -5) dfdtEl.style.color = '#ff3344';
            else if (dfdt > 20) dfdtEl.style.color = '#ff6600';
            else dfdtEl.style.color = '#00d4ff';
        }
    }

    function updatePrediction(confidence, state) {
        const predBar = document.getElementById('pred-bar');
        const predVal = document.getElementById('pred-val');
        
        if (predBar) predBar.style.width = (confidence * 100) + '%';
        if (predVal) {
            if (state === 'COUNTDOWN') {
                predVal.textContent = 'ACTIVE!';
                predVal.style.color = '#ff3344';
            } else if (state === 'ANOMALY_DETECTED') {
                predVal.textContent = Math.round(confidence * 100) + '%';
                predVal.style.color = '#ff6600';
            } else if (state === 'MONITORING') {
                predVal.textContent = 'WATCH';
                predVal.style.color = '#ffd700';
            } else {
                predVal.textContent = 'STANDBY';
                predVal.style.color = '';
            }
        }
    }

    function resetTelemetry() {
        forceHistory = [];
        currentForce = 0;
        peakForce = 0;
        currentStrain = 0;
        currentDfdt = 0;
        currentPwm = 0;
    }

    function render() {
        if (!isActive) return;
        animId = requestAnimationFrame(render);
        time += 0.02;

        drawWaveform();
        drawRadar();
        drawForceGraph();
        drawForceGauge();
    }

    function drawWaveform() {
        if (!waveCtx || !waveCanvas) return;
        const w = waveCanvas.width / 2;
        const h = waveCanvas.height / 2;

        waveCtx.clearRect(0, 0, w, h);
        waveCtx.fillStyle = 'rgba(0,5,15,0.3)';
        waveCtx.fillRect(0, 0, w, h);

        const mid = h / 2;
        const bars = 32;
        const barW = w / bars;

        for (let i = 0; i < bars; i++) {
            let val;
            if (voiceData && voiceData[i]) {
                val = voiceData[i] / 255;
            } else {
                val = 0.05 + Math.sin(time * 2 + i * 0.4) * 0.03 + Math.sin(time * 5 + i * 0.8) * 0.02;
            }

            const barH = val * h * 0.8;
            const x = i * barW + 1;

            const gradient = waveCtx.createLinearGradient(x, mid - barH / 2, x, mid + barH / 2);
            gradient.addColorStop(0, `rgba(0,212,255,${0.6 + val * 0.4})`);
            gradient.addColorStop(0.5, `rgba(255,102,0,${0.3 + val * 0.3})`);
            gradient.addColorStop(1, `rgba(0,212,255,${0.6 + val * 0.4})`);

            waveCtx.fillStyle = gradient;
            waveCtx.fillRect(x, mid - barH / 2, barW - 2, barH);
        }

        waveCtx.strokeStyle = 'rgba(0,212,255,0.15)';
        waveCtx.lineWidth = 0.5;
        waveCtx.beginPath();
        waveCtx.moveTo(0, mid);
        waveCtx.lineTo(w, mid);
        waveCtx.stroke();
    }

    function drawRadar() {
        if (!radarCtx || !radarCanvas) return;
        const w = radarCanvas.width / 2;
        const h = radarCanvas.height / 2;
        const rcx = w / 2;
        const rcy = h / 2;
        const radius = Math.min(w, h) * 0.4;

        radarCtx.clearRect(0, 0, w, h);
        radarCtx.fillStyle = 'rgba(0,5,15,0.3)';
        radarCtx.fillRect(0, 0, w, h);

        for (let i = 1; i <= 3; i++) {
            radarCtx.strokeStyle = 'rgba(0,212,255,0.08)';
            radarCtx.lineWidth = 0.5;
            radarCtx.beginPath();
            radarCtx.arc(rcx, rcy, radius * i / 3, 0, Math.PI * 2);
            radarCtx.stroke();
        }

        radarCtx.strokeStyle = 'rgba(0,212,255,0.05)';
        radarCtx.beginPath();
        radarCtx.moveTo(rcx - radius, rcy);
        radarCtx.lineTo(rcx + radius, rcy);
        radarCtx.moveTo(rcx, rcy - radius);
        radarCtx.lineTo(rcx, rcy + radius);
        radarCtx.stroke();

        const sweepAngle = time * 0.8;
        radarCtx.save();
        radarCtx.translate(rcx, rcy);

        radarCtx.strokeStyle = 'rgba(0,255,136,0.6)';
        radarCtx.lineWidth = 1;
        radarCtx.beginPath();
        radarCtx.moveTo(0, 0);
        radarCtx.lineTo(Math.cos(sweepAngle) * radius, Math.sin(sweepAngle) * radius);
        radarCtx.stroke();

        for (let i = 0; i < 20; i++) {
            const a = sweepAngle - i * 0.05;
            radarCtx.strokeStyle = `rgba(0,255,136,${0.03 * (1 - i / 20)})`;
            radarCtx.beginPath();
            radarCtx.moveTo(0, 0);
            radarCtx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
            radarCtx.stroke();
        }

        const blips = [
            { angle: 0.8, dist: 0.6 }, { angle: 2.1, dist: 0.3 },
            { angle: 4.5, dist: 0.8 }, { angle: 5.2, dist: 0.45 },
        ];
        for (const blip of blips) {
            const angleDiff = ((sweepAngle - blip.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            if (angleDiff < 1.0) {
                const alpha = 1 - angleDiff;
                const bx = Math.cos(blip.angle) * radius * blip.dist;
                const by = Math.sin(blip.angle) * radius * blip.dist;
                radarCtx.fillStyle = `rgba(0,255,136,${alpha * 0.8})`;
                radarCtx.beginPath();
                radarCtx.arc(bx, by, 2, 0, Math.PI * 2);
                radarCtx.fill();
                radarCtx.fillStyle = `rgba(0,255,136,${alpha * 0.2})`;
                radarCtx.beginPath();
                radarCtx.arc(bx, by, 6, 0, Math.PI * 2);
                radarCtx.fill();
            }
        }
        radarCtx.restore();
    }

    function drawForceGraph() {
        if (!forceGraphCtx || !forceGraphCanvas) return;
        const w = forceGraphCanvas.width / 2;
        const h = forceGraphCanvas.height / 2;

        forceGraphCtx.clearRect(0, 0, w, h);
        forceGraphCtx.fillStyle = 'rgba(0,5,15,0.5)';
        forceGraphCtx.fillRect(0, 0, w, h);

        if (forceHistory.length < 2) {
            // Draw idle line
            forceGraphCtx.strokeStyle = 'rgba(0,212,255,0.1)';
            forceGraphCtx.lineWidth = 0.5;
            forceGraphCtx.beginPath();
            forceGraphCtx.moveTo(0, h - 5);
            forceGraphCtx.lineTo(w, h - 5);
            forceGraphCtx.stroke();
            
            // Label
            forceGraphCtx.fillStyle = 'rgba(0,212,255,0.2)';
            forceGraphCtx.font = '8px Share Tech Mono';
            forceGraphCtx.fillText('AWAITING DATA', 10, h / 2);
            return;
        }

        // Draw grid
        forceGraphCtx.strokeStyle = 'rgba(0,212,255,0.04)';
        forceGraphCtx.lineWidth = 0.5;
        for (let i = 1; i < 4; i++) {
            forceGraphCtx.beginPath();
            forceGraphCtx.moveTo(0, h * i / 4);
            forceGraphCtx.lineTo(w, h * i / 4);
            forceGraphCtx.stroke();
        }

        // Determine max for scaling
        const maxVal = Math.max(peakForce * 1.2, 100);
        const padding = 5;
        
        // Draw force line
        forceGraphCtx.beginPath();
        forceGraphCtx.strokeStyle = '#00d4ff';
        forceGraphCtx.lineWidth = 1.5;

        for (let i = 0; i < forceHistory.length; i++) {
            const x = (i / MAX_GRAPH_POINTS) * w;
            const y = h - padding - (forceHistory[i] / maxVal) * (h - padding * 2);
            if (i === 0) forceGraphCtx.moveTo(x, y);
            else forceGraphCtx.lineTo(x, y);
        }
        forceGraphCtx.stroke();

        // Fill below
        const lastX = ((forceHistory.length - 1) / MAX_GRAPH_POINTS) * w;
        forceGraphCtx.lineTo(lastX, h);
        forceGraphCtx.lineTo(0, h);
        forceGraphCtx.closePath();
        const grad = forceGraphCtx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0,212,255,0.15)');
        grad.addColorStop(1, 'rgba(0,212,255,0)');
        forceGraphCtx.fillStyle = grad;
        forceGraphCtx.fill();

        // Y-axis label
        forceGraphCtx.fillStyle = 'rgba(0,212,255,0.3)';
        forceGraphCtx.font = '7px Share Tech Mono';
        forceGraphCtx.fillText(Math.round(maxVal) + 'N', 2, 10);
        forceGraphCtx.fillText('0N', 2, h - 2);
    }

    function drawForceGauge() {
        if (!forceGaugeCtx || !forceGaugeCanvas) return;
        const w = forceGaugeCanvas.width / 2;
        const h = forceGaugeCanvas.height / 2;

        forceGaugeCtx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h - 5;
        const radius = Math.min(w / 2 - 10, h - 15);
        const startAngle = Math.PI;
        const endAngle = Math.PI * 2;
        
        // Background arc
        forceGaugeCtx.beginPath();
        forceGaugeCtx.arc(cx, cy, radius, startAngle, endAngle);
        forceGaugeCtx.strokeStyle = 'rgba(0,212,255,0.08)';
        forceGaugeCtx.lineWidth = 4;
        forceGaugeCtx.stroke();

        // Value arc
        const maxForce = 1000;
        const ratio = Math.min(currentForce / maxForce, 1);
        const valueAngle = startAngle + ratio * Math.PI;
        
        // Color based on stress level
        let arcColor;
        if (ratio < 0.5) arcColor = '#00d4ff';
        else if (ratio < 0.8) arcColor = '#ff6600';
        else arcColor = '#ff3344';

        forceGaugeCtx.beginPath();
        forceGaugeCtx.arc(cx, cy, radius, startAngle, valueAngle);
        forceGaugeCtx.strokeStyle = arcColor;
        forceGaugeCtx.lineWidth = 4;
        forceGaugeCtx.lineCap = 'round';
        forceGaugeCtx.stroke();

        // Glow
        forceGaugeCtx.beginPath();
        forceGaugeCtx.arc(cx, cy, radius, startAngle, valueAngle);
        forceGaugeCtx.strokeStyle = arcColor.replace(')', ',0.2)').replace('rgb', 'rgba');
        forceGaugeCtx.lineWidth = 10;
        forceGaugeCtx.stroke();

        // Tick marks
        forceGaugeCtx.strokeStyle = 'rgba(0,212,255,0.15)';
        forceGaugeCtx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const angle = startAngle + (i / 10) * Math.PI;
            const len = i % 5 === 0 ? 8 : 4;
            forceGaugeCtx.beginPath();
            forceGaugeCtx.moveTo(
                cx + Math.cos(angle) * (radius - len),
                cy + Math.sin(angle) * (radius - len)
            );
            forceGaugeCtx.lineTo(
                cx + Math.cos(angle) * (radius + 2),
                cy + Math.sin(angle) * (radius + 2)
            );
            forceGaugeCtx.stroke();
        }
    }

    /**
     * Update LED indicators based on mode
     */
    function updateLEDs(mode) {
        const segments = document.querySelectorAll('.led-segment');
        const modeText = document.getElementById('led-mode-text');
        
        segments.forEach(seg => {
            seg.className = 'led-segment';
        });

        switch(mode) {
            case 'standby':
            case 'calibrating':
                // Breathing cyan
                const breathe = Math.sin(time * 2) * 0.5 + 0.5;
                const count = Math.round(breathe * 8);
                segments.forEach((seg, i) => {
                    if (i < count) seg.classList.add('cyan');
                });
                if (modeText) {
                    modeText.textContent = mode === 'calibrating' ? 'CALIBRATING' : 'STANDBY';
                    modeText.style.color = '#00d4ff';
                }
                break;
            
            case 'tensioning':
                // Orange, filling up
                const fillLevel = Math.round((currentForce / 500) * 8);
                segments.forEach((seg, i) => {
                    if (i < fillLevel) seg.classList.add('orange');
                    else seg.classList.add('cyan');
                });
                if (modeText) {
                    modeText.textContent = 'TENSIONING';
                    modeText.style.color = '#ff6600';
                }
                break;
            
            case 'warning':
                segments.forEach(seg => seg.classList.add('orange'));
                if (modeText) {
                    modeText.textContent = 'WARNING';
                    modeText.style.color = '#ff6600';
                }
                break;
            
            case 'critical':
            case 'rupture':
                segments.forEach(seg => seg.classList.add('red'));
                if (modeText) {
                    modeText.textContent = mode === 'rupture' ? 'RUPTURE!' : 'CRITICAL';
                    modeText.style.color = '#ff3344';
                }
                break;
            
            case 'post':
                const flash = Math.sin(time * 10) > 0;
                segments.forEach(seg => {
                    seg.classList.add(flash ? 'cyan' : 'orange');
                });
                if (modeText) {
                    modeText.textContent = 'ANALYZING';
                    modeText.style.color = '#ffd700';
                }
                break;
        }
    }

    // Digital twin overlay (model force history for dual-line graph)
    let twinForceHistory = [];

    function updateTwinForce(modelForce, realForce) {
        twinForceHistory.push({ model: modelForce, real: realForce, time: Date.now() });
        if (twinForceHistory.length > MAX_GRAPH_POINTS) twinForceHistory.shift();
    }

    return {
        init, start, stop,
        setVoiceData,
        updateTelemetry,
        updateDerivative,
        updatePrediction,
        updateLEDs,
        resetTelemetry,
        updateTwinForce
    };
})();
