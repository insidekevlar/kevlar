/* ============================================================================
   WEBSOCKET BRIDGE v3.0 — Pi Communication + Scientific Simulation
   
   Simulation is NOT random. It replicates:
   ├─ Elastic regime (linear, σ = E·ε)
   ├─ Yield point (strain onset ~2.5%)
   ├─ Plastic / post-yield deformation
   ├─ Micro-fracture noise (Poisson events)
   └─ Catastrophic failure (force collapse)
   
   Noise model: F_sim = F_true + Gaussian_noise + Poisson_micro_cracks
   ============================================================================ */

window.WebSocketBridge = (function() {
    'use strict';

    let ws = null;
    let isConnected = false;
    let reconnectTimer = null;
    let heartbeatTimer = null;
    let simulationMode = true;
    let simulationTimer = null;
    let piAddress = 'ws://192.168.1.100:8765';

    // Callbacks
    let onTelemetry = null;
    let onStatusChange = null;
    let onMessage = null;

    // Last telemetry packet
    let lastTelemetry = {
        force: 0, strain: 0, timestamp: 0,
        motorPWM: 0, temperature: 22.5, ledMode: 'standby'
    };

    // ═══════════════════════════════════════════════════
    //  SCIENTIFIC SIMULATION ENGINE
    // ═══════════════════════════════════════════════════

    // Material parameters (Kevlar-49)
    const MAT = {
        E: 112e3,              // Elastic modulus (MPa) → used as N per unit strain in sim
        yieldStrain: 0.025,    // 2.5% yield onset
        breakStrain: 0.036,    // 3.6% elongation at break
        hardening_k: 8500,     // Post-yield hardening coefficient
        hardening_n: 0.45,     // Hardening exponent
        crossSection: 1.13e-7, // m² (bundle)
        breakForce: 850,       // Expected break force (N) for bundle
    };

    // Simulation state
    let sim = {
        running: false,
        time: 0,
        phase: 'IDLE',        // IDLE, CALIBRATING, ELASTIC, YIELD, PLASTIC, CRITICAL, RUPTURE, POST
        strain: 0,            // Current strain
        strainRate: 0,        // Strain rate (per second)
        force: 0,             // Current force (N)
        trueForce: 0,         // Underlying true force (no noise)
        breakTime: 0,         // Expected time of rupture
        microCrackCount: 0,   // Accumulated micro-cracks
        temperature: 22.5,    // Simulated temperature
    };

    // ═══════════════════════════════════════════════════
    //  INITIALIZATION & CONNECTION
    // ═══════════════════════════════════════════════════

    function init(callbacks = {}) {
        onTelemetry = callbacks.onTelemetry || null;
        onStatusChange = callbacks.onStatusChange || null;
        onMessage = callbacks.onMessage || null;

        const saved = localStorage.getItem('kevin_pi_address');
        if (saved) piAddress = saved;
    }

    function connect(address) {
        if (address) {
            piAddress = address;
            localStorage.setItem('kevin_pi_address', address);
        }

        try {
            ws = new WebSocket(piAddress);

            ws.onopen = () => {
                isConnected = true;
                simulationMode = false;
                if (onStatusChange) onStatusChange('CONNECTED', piAddress);
                startHeartbeat();
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                } catch (e) {
                    console.warn('[WS] Invalid message:', event.data);
                }
            };

            ws.onclose = () => {
                isConnected = false;
                if (onStatusChange) onStatusChange('DISCONNECTED');
                stopHeartbeat();
                scheduleReconnect();
            };

            ws.onerror = () => {
                isConnected = false;
                simulationMode = true;
                if (onStatusChange) onStatusChange('SIMULATION');
            };
        } catch (e) {
            simulationMode = true;
            if (onStatusChange) onStatusChange('SIMULATION');
        }
    }

    function disconnect() {
        if (ws) ws.close();
        stopHeartbeat();
        if (reconnectTimer) clearTimeout(reconnectTimer);
    }

    function handleMessage(data) {
        switch (data.type) {
            case 'telemetry':
                lastTelemetry = {
                    force: data.force || 0,
                    strain: data.strain || 0,
                    timestamp: data.timestamp || Date.now(),
                    motorPWM: data.pwm || 0,
                    temperature: data.temp || 22.5,
                    ledMode: data.led || 'standby'
                };
                if (onTelemetry) onTelemetry(lastTelemetry);
                break;
            case 'event':
                if (onMessage) onMessage(data);
                break;
            case 'pong':
                break;
        }
    }

    function sendCommand(command, params = {}) {
        const msg = JSON.stringify({ type: 'command', command, ...params, timestamp: Date.now() });

        if (isConnected && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(msg);
        } else if (simulationMode) {
            handleSimulatedCommand(command, params);
        }
    }

    // Heartbeat
    function startHeartbeat() {
        heartbeatTimer = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 5000);
    }
    function stopHeartbeat() { if (heartbeatTimer) clearInterval(heartbeatTimer); }
    function scheduleReconnect() {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => { if (!isConnected) connect(); }, 5000);
    }

    // ═══════════════════════════════════════════════════
    //  SIMULATION: COMMANDS
    // ═══════════════════════════════════════════════════

    function handleSimulatedCommand(command, params) {
        switch (command) {
            case 'START_TEST': startSimulation(); break;
            case 'ABORT': abortSimulation(); break;
            case 'SET_SPEED': /* future */ break;
        }
    }

    function startSimulation() {
        sim = {
            running: true,
            time: 0,
            phase: 'CALIBRATING',
            strain: 0,
            strainRate: 0.0015,      // Strain rate per second (~constant motor speed)
            force: 0,
            trueForce: 0,
            breakTime: 18 + Math.random() * 8, // 18-26 seconds
            microCrackCount: 0,
            temperature: 22.5,
        };

        if (onStatusChange) onStatusChange('SIMULATION_ACTIVE');
        if (simulationTimer) clearInterval(simulationTimer);
        simulationTimer = setInterval(simulationTick, 100); // 10 Hz
    }

    function abortSimulation() {
        sim.running = false;
        sim.phase = 'IDLE';
        sim.force = 0;
        sim.strain = 0;
        if (simulationTimer) { clearInterval(simulationTimer); simulationTimer = null; }
        if (onStatusChange) onStatusChange('SIMULATION');

        const tel = { force: 0, strain: 0, timestamp: Date.now(), motorPWM: 0, temperature: 22.5, ledMode: 'standby' };
        if (onTelemetry) onTelemetry(tel);
    }

    // ═══════════════════════════════════════════════════
    //  SIMULATION: PHYSICS TICK (10 Hz)
    //  F_sim = F_true + Gaussian_noise + Poisson_micro_cracks
    // ═══════════════════════════════════════════════════

    function simulationTick() {
        if (!sim.running) return;
        sim.time += 0.1;

        let ledMode = 'standby';
        let motorPWM = 0;

        switch (sim.phase) {
            case 'CALIBRATING':
                // 0-3s: sensor baseline calibration
                sim.force = gaussianNoise(0, 0.3);
                sim.strain = 0;
                if (sim.time >= 3) {
                    sim.phase = 'ELASTIC';
                }
                ledMode = 'calibrating';
                break;

            case 'ELASTIC': {
                // Elastic regime: F = E · A · ε (linear)
                sim.strain += sim.strainRate * 0.1;
                const elasticForce = MAT.E * MAT.crossSection * sim.strain * 1e6;
                sim.trueForce = elasticForce;

                // Noise model: F_sim = F_true + Gaussian
                sim.force = sim.trueForce + gaussianNoise(0, 1.5);

                motorPWM = Math.min(100, (sim.strain / MAT.breakStrain) * 100);
                ledMode = sim.strain / MAT.breakStrain < 0.5 ? 'tensioning' : 'warning';

                // Transition to yield
                if (sim.strain >= MAT.yieldStrain) {
                    sim.phase = 'YIELD';
                }
                break;
            }

            case 'YIELD': {
                // Yield point: slope change, slight force plateau
                sim.strain += sim.strainRate * 0.1;
                const ey = MAT.yieldStrain;
                const elasticPart = MAT.E * MAT.crossSection * ey * 1e6;
                const plasticPart = MAT.hardening_k * Math.pow(sim.strain - ey, MAT.hardening_n);
                sim.trueForce = elasticPart + plasticPart;

                // Add Gaussian noise + occasional micro-crack Poisson events
                let noise = gaussianNoise(0, 2.5);
                if (poissonEvent(0.08)) {
                    // Micro-crack: sudden small force dip
                    noise -= 5 + Math.random() * 10;
                    sim.microCrackCount++;
                }
                sim.force = sim.trueForce + noise;

                motorPWM = Math.min(100, (sim.strain / MAT.breakStrain) * 100);
                ledMode = 'warning';

                // Transition to plastic
                if (sim.strain >= MAT.yieldStrain + 0.003) {
                    sim.phase = 'PLASTIC';
                }
                break;
            }

            case 'PLASTIC': {
                // Post-yield plastic deformation with increasing micro-cracks
                sim.strain += sim.strainRate * 0.1;
                const ey = MAT.yieldStrain;
                const elasticPart = MAT.E * MAT.crossSection * ey * 1e6;
                const plasticPart = MAT.hardening_k * Math.pow(sim.strain - ey, MAT.hardening_n);
                sim.trueForce = elasticPart + plasticPart;

                // Increasing micro-crack frequency as strain increases
                const crackProb = 0.1 + (sim.strain / MAT.breakStrain) * 0.3;
                let noise = gaussianNoise(0, 3);
                if (poissonEvent(crackProb)) {
                    noise -= 8 + Math.random() * 20;
                    sim.microCrackCount++;
                }
                sim.force = sim.trueForce + noise;

                motorPWM = Math.min(100, (sim.strain / MAT.breakStrain) * 100);
                ledMode = 'critical';

                // Temperature rises slightly from deformation energy
                sim.temperature = 22.5 + sim.strain * 200;

                // Transition to critical
                if (sim.strain >= MAT.breakStrain * 0.92) {
                    sim.phase = 'CRITICAL';
                }
                break;
            }

            case 'CRITICAL': {
                // Imminent failure: heavy micro-cracking, force flattens/drops
                sim.strain += sim.strainRate * 0.1 * 0.6; // Strain rate decreases (fibers locking)
                const ey = MAT.yieldStrain;
                const elasticPart = MAT.E * MAT.crossSection * ey * 1e6;
                const plasticPart = MAT.hardening_k * Math.pow(sim.strain - ey, MAT.hardening_n);
                sim.trueForce = elasticPart + plasticPart;

                // Intense micro-cracking
                let noise = gaussianNoise(0, 5);
                if (poissonEvent(0.45)) {
                    noise -= 12 + Math.random() * 30;
                    sim.microCrackCount++;
                }
                sim.force = sim.trueForce + noise;

                motorPWM = 95 + Math.random() * 5;
                ledMode = 'critical';
                sim.temperature = 22.5 + sim.strain * 300;

                // Rupture condition
                if (sim.strain >= MAT.breakStrain || sim.time >= sim.breakTime) {
                    sim.phase = 'RUPTURE';
                }
                break;
            }

            case 'RUPTURE':
                // Catastrophic failure — force collapses exponentially
                sim.force = Math.max(0, sim.force * 0.25);
                if (sim.force < 3) {
                    sim.force = gaussianNoise(0, 0.5);
                    sim.phase = 'POST';
                    motorPWM = 0;
                    ledMode = 'rupture';
                }
                break;

            case 'POST':
                // Post-failure noise floor
                sim.force = Math.abs(gaussianNoise(0, 0.3));
                motorPWM = 0;
                ledMode = 'post';
                if (sim.time > sim.breakTime + 5) {
                    abortSimulation();
                    return;
                }
                break;
        }

        const telemetry = {
            force: Math.max(0, sim.force),
            strain: sim.strain * 100, // As percentage
            timestamp: Date.now(),
            motorPWM: motorPWM,
            temperature: sim.temperature,
            ledMode: ledMode,
            simPhase: sim.phase,
            microCracks: sim.microCrackCount,
        };

        lastTelemetry = telemetry;
        if (onTelemetry) onTelemetry(telemetry);
    }

    // ═══════════════════════════════════════════════════
    //  NOISE MODELS
    // ═══════════════════════════════════════════════════

    /**
     * Gaussian noise using Box-Muller transform
     * @param {number} mean - Mean of distribution
     * @param {number} stddev - Standard deviation
     */
    function gaussianNoise(mean, stddev) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + z * stddev;
    }

    /**
     * Poisson event — returns true with probability p (per tick)
     * Models discrete micro-crack events
     * @param {number} p - Probability per tick [0, 1]
     */
    function poissonEvent(p) {
        return Math.random() < p;
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════

    function getStatus() {
        if (isConnected) return 'CONNECTED';
        if (simulationMode && sim.running) return 'SIMULATION_ACTIVE';
        if (simulationMode) return 'SIMULATION';
        return 'DISCONNECTED';
    }

    function getLastTelemetry() { return lastTelemetry; }
    function isSimulation() { return simulationMode; }
    function getIsConnected() { return isConnected; }
    function getSimPhase() { return sim.phase; }
    function getPiAddress() { return piAddress; }
    function getSimState() { return { ...sim }; }

    function setPiAddress(addr) {
        piAddress = addr;
        localStorage.setItem('kevin_pi_address', addr);
    }

    function enableSimulation() {
        simulationMode = true;
        if (onStatusChange) onStatusChange('SIMULATION');
    }

    return {
        init, connect, disconnect, sendCommand,
        getStatus, getLastTelemetry, isSimulation,
        getIsConnected, getSimPhase, getPiAddress, getSimState,
        setPiAddress, startSimulation, abortSimulation, enableSimulation,
    };
})();
