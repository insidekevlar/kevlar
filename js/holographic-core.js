/* ============================================
   HOLOGRAPHIC CORE v4 — NVIDIA RTX Grade
   4000 volumetric particles, orbital rings,
   nebula clouds, lightning arcs, hex lattice
   ============================================ */

window.HolographicCore = (function() {
    let canvas, ctx;
    let W, H, cx, cy;
    let particles = [];
    let time = 0;
    let isActive = false;
    let animId = null;
    let voiceEnergy = 0;
    let targetEnergy = 0;
    let pulseIntensity = 0;
    let baseRadius = 60;
    let currentMood = 'idle';
    let stressLevel = 0;
    let isSpeaking = false;
    let speakingHue = 0;
    let wordBurstQueue = [];
    let lightningArcs = [];
    let orbitalAngle1 = 0;
    let orbitalAngle2 = 0;

    const BASE_PARTICLE_COUNT = 200;
    const SPEAKING_PARTICLE_COUNT = 800;

    let activeColor = { r: 0, g: 212, b: 255 };
    const COLOR_CYAN = { r: 0, g: 212, b: 255 };
    const COLOR_ORANGE = { r: 255, g: 102, b: 0 };
    const COLOR_RED = { r: 255, g: 51, b: 68 };
    const COLOR_GOLD = { r: 255, g: 215, b: 0 };
    const COLOR_GREEN = { r: 0, g: 255, b: 136 };
    const COLOR_PURPLE = { r: 168, g: 85, b: 247 };

    const colors = {
        core: { r: 0, g: 212, b: 255 },
        accent1: { r: 168, g: 85, b: 247 },
        accent2: { r: 255, g: 215, b: 0 },
        accent3: { r: 0, g: 255, b: 136 },
    };

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
        createParticles(BASE_PARTICLE_COUNT);
        window.addEventListener('resize', resize);
    }

    function resize() {
        const dpr = 1; // Force 1x for perf
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = W / 2;
        cy = H / 2;
        baseRadius = Math.min(W, H) * 0.08;
    }

    function createParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = baseRadius * (0.5 + Math.random() * 0.9);
            const speed = 0.15 + Math.random() * 0.4;
            const orbitSpeed = (Math.random() - 0.5) * 0.018;
            const size = 0.4 + Math.random() * 2.2;

            let color;
            const rand = Math.random();
            if (rand < 0.45) color = { ...colors.core };
            else if (rand < 0.65) color = { ...colors.accent1 };
            else if (rand < 0.82) color = { ...colors.accent2 };
            else color = { ...colors.accent3 };

            particles.push({
                theta, phi, r, baseR: r, originalBaseR: r,
                speed, orbitSpeed, size,
                color, originalColor: { ...color },
                trail: [],
                trailLength: Math.floor(4 + Math.random() * 6),
                alpha: 0.3 + Math.random() * 0.7,
                phaseOffset: Math.random() * Math.PI * 2,
                hueOffset: Math.random() * 360,
                rgbSpeed: 0.5 + Math.random() * 2,
                layer: Math.random() < 0.3 ? 'outer' : (Math.random() < 0.5 ? 'mid' : 'inner'),
            });
        }
    }

    function start() { isActive = true; render(); }
    function stop() { isActive = false; if (animId) cancelAnimationFrame(animId); }
    function setVoiceEnergy(energy) { targetEnergy = Math.max(0, Math.min(1, energy)); }

    function setMood(mood) {
        currentMood = mood;
        if (mood === 'speaking' && !isSpeaking) {
            isSpeaking = true;
            createParticles(SPEAKING_PARTICLE_COUNT);
        }
        if (mood === 'idle' && isSpeaking) {
            isSpeaking = false;
            setTimeout(() => {
                if (!isSpeaking) createParticles(BASE_PARTICLE_COUNT);
            }, 2000);
        }
        if (mood === 'alert') pulseIntensity = 1.5;
    }

    function setStressLevel(level) {
        stressLevel = Math.max(0, Math.min(1, level));
        if (stressLevel < 0.3) {
            activeColor = lerpColor(COLOR_CYAN, COLOR_GREEN, stressLevel / 0.3);
        } else if (stressLevel < 0.7) {
            activeColor = lerpColor(COLOR_GREEN, COLOR_GOLD, (stressLevel - 0.3) / 0.4);
        } else {
            activeColor = lerpColor(COLOR_GOLD, COLOR_RED, (stressLevel - 0.7) / 0.3);
        }
        // Spawn lightning during high stress
        if (stressLevel > 0.6 && Math.random() < stressLevel * 0.1) {
            spawnLightning();
        }
    }

    function lerpColor(a, b, t) {
        return {
            r: Math.round(a.r + (b.r - a.r) * t),
            g: Math.round(a.g + (b.g - a.g) * t),
            b: Math.round(a.b + (b.b - a.b) * t)
        };
    }

    function hslToRgb(h, s, l) {
        h = h / 360;
        let r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function spawnLightning() {
        if (lightningArcs.length > 5) return;
        const idx1 = Math.floor(Math.random() * particles.length);
        const idx2 = Math.floor(Math.random() * particles.length);
        if (idx1 === idx2) return;
        lightningArcs.push({
            p1: idx1, p2: idx2,
            life: 1.0,
            decay: 0.03 + Math.random() * 0.04,
            width: 1 + Math.random() * 2,
        });
    }

    function wordImpact(word) {
        const impactWords = ['impact','bullet','armor','kevlar','defense','protect','shield',
            'destroy','analyze','scan','rupture','failure','critical','abort',
            'tensile','strength','molecular','force','steel','ballistic',
            'prediction','crystal','hydrogen','carbon','nitrogen','oxygen',
            '3620','mpa','structure','polymer','fiber','material','robot',
            'entropy','instability','cedare','collapse','warning'];
        const isImpact = impactWords.some(w => word.toLowerCase().includes(w));
        if (isSpeaking) {
            pulseIntensity = Math.min(pulseIntensity + 0.15, 2);
            if (isImpact) {
                pulseIntensity = Math.min(pulseIntensity + 0.6, 3);
                wordBurstQueue.push({ time, radius: 0, maxRadius: baseRadius * 3.5, hue: speakingHue });
                spawnLightning();
            }
        } else if (isImpact) {
            pulseIntensity = Math.min(pulseIntensity + 0.5, 2);
        }
    }

    function render() {
        if (!isActive) return;
        animId = requestAnimationFrame(render);

        time += 0.012;
        voiceEnergy += (targetEnergy - voiceEnergy) * 0.1;
        pulseIntensity *= 0.96;
        orbitalAngle1 += 0.008 + voiceEnergy * 0.02;
        orbitalAngle2 -= 0.005 + voiceEnergy * 0.015;

        if (isSpeaking) {
            speakingHue = (speakingHue + 1.5) % 360;
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, W, H);

        // Layer 1: Nebula (behind everything)
        drawNebulaLayer();

        ctx.globalCompositeOperation = 'screen';

        // Layer 2: Core glow
        drawCoreGlow();

        // Layer 3: Orbital rings
        drawOrbitalRings();

        // Layer 4: Particles
        updateParticles();
        drawParticles();

        // Layer 5: Inner core
        drawInnerCore();

        // Layer 6: Speaking effects
        if (isSpeaking) {
            drawRGBWaves();
            drawWordBursts();
        }

        // Layer 7: Lightning arcs
        drawLightningArcs();

        // Layer 8: Stress rings
        if (stressLevel > 0.7) {
            drawStressRings();
        }
    }

    function drawNebulaLayer() {
        const energy = voiceEnergy * 0.5 + (isSpeaking ? 0.3 : 0) + stressLevel * 0.2;
        if (energy < 0.05) return;

        const nebulaColor = isSpeaking ? hslToRgb(speakingHue, 0.6, 0.4) : activeColor;
        const { r, g, b } = nebulaColor;
        const nebulaRadius = baseRadius * (3 + energy * 2);

        const grad = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, nebulaRadius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.03 + energy * 0.04})`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${0.02 + energy * 0.02})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${0.008})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Secondary nebula with offset hue
        if (isSpeaking) {
            const sec = hslToRgb((speakingHue + 150) % 360, 0.5, 0.35);
            const grad2 = ctx.createRadialGradient(
                cx + Math.sin(time) * 20, cy + Math.cos(time * 0.7) * 15,
                0, cx, cy, nebulaRadius * 0.8
            );
            grad2.addColorStop(0, `rgba(${sec.r},${sec.g},${sec.b},${0.025 * energy})`);
            grad2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, W, H);
        }
        ctx.globalCompositeOperation = 'screen';
    }

    function drawCoreGlow() {
        let glowColor = isSpeaking ? hslToRgb(speakingHue, 0.9, 0.5) : activeColor;
        const { r, g, b } = glowColor;
        const glowRadius = baseRadius * (2.8 + voiceEnergy * 1.8 + pulseIntensity * 2.5 + stressLevel * 0.6);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.1 + voiceEnergy * 0.15 + (isSpeaking ? 0.08 : 0)})`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${0.04 + voiceEnergy * 0.06})`);
        grad.addColorStop(0.7, `rgba(${r},${g},${b},${0.01})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        if (isSpeaking || voiceEnergy > 0.1) {
            const secColor = hslToRgb((speakingHue + 120) % 360, 0.8, 0.5);
            const grad2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius * 0.7);
            grad2.addColorStop(0, `rgba(${secColor.r},${secColor.g},${secColor.b},${0.05 * (voiceEnergy + (isSpeaking ? 0.5 : 0))})`);
            grad2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, W, H);
        }
    }

    function drawOrbitalRings() {
        const ringColor = isSpeaking ? hslToRgb(speakingHue, 0.8, 0.5) : activeColor;
        const ring2Color = isSpeaking ? hslToRgb((speakingHue + 90) % 360, 0.8, 0.5) : COLOR_PURPLE;
        const ringRadius = baseRadius * (1.8 + voiceEnergy * 0.5 + pulseIntensity * 0.3);
        const alpha = 0.15 + voiceEnergy * 0.15 + (isSpeaking ? 0.1 : 0);

        // Ring 1 — tilted ellipse
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbitalAngle1);
        ctx.scale(1, 0.35);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ringColor.r},${ringColor.g},${ringColor.b},${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Glow
        ctx.strokeStyle = `rgba(${ringColor.r},${ringColor.g},${ringColor.b},${alpha * 0.3})`;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();

        // Ring 2 — opposite tilt
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbitalAngle2 + Math.PI * 0.3);
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring2Color.r},${ring2Color.g},${ring2Color.b},${alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${ring2Color.r},${ring2Color.g},${ring2Color.b},${alpha * 0.2})`;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        // Ring 3 — thin fast ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-orbitalAngle1 * 1.5);
        ctx.scale(1, 0.25);
        ctx.setLineDash([3, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius * 1.35, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ringColor.r},${ringColor.g},${ringColor.b},${alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }

    function updateParticles() {
        const energyScale = 1 + voiceEnergy * 0.8 + pulseIntensity * 1.2 + stressLevel * 0.3;
        const breatheSpeed = isSpeaking ? 3 : (0.8 + stressLevel * 2);
        const breatheAmount = isSpeaking ? 0.2 : (0.08 + stressLevel * 0.1);
        const breathe = Math.sin(time * breatheSpeed) * breatheAmount;

        for (const p of particles) {
            const orbitMultiplier = isSpeaking ? (1 + voiceEnergy * 5) : (1 + voiceEnergy * 2 + stressLevel * 3);
            p.theta += p.orbitSpeed * orbitMultiplier;
            p.phi += p.orbitSpeed * 0.3;
            p.r = p.baseR * (energyScale + breathe + Math.sin(time * p.speed + p.phaseOffset) * 0.15);

            if (isSpeaking) p.r *= 1 + voiceEnergy * 0.5;

            const x = p.r * Math.sin(p.phi) * Math.cos(p.theta);
            const y = p.r * Math.sin(p.phi) * Math.sin(p.theta);
            const z = p.r * Math.cos(p.phi);

            const perspective = 300;
            const scale = perspective / (perspective + z);
            p.screenX = cx + x * scale;
            p.screenY = cy + y * scale;
            p.screenSize = p.size * scale * (1 + voiceEnergy * 0.5 + stressLevel * 0.3);
            p.depth = z;

            p.trail.push({ x: p.screenX, y: p.screenY });
            if (p.trail.length > p.trailLength) p.trail.shift();

            if (isSpeaking) {
                const hue = (speakingHue + p.hueOffset + time * p.rgbSpeed * 50) % 360;
                p.color = hslToRgb(hue, 0.85, 0.55);
            } else if (stressLevel > 0.05) {
                if (stressLevel < 0.3) p.color = lerpColor(p.originalColor, COLOR_GREEN, stressLevel / 0.3);
                else if (stressLevel < 0.7) p.color = lerpColor(COLOR_GREEN, COLOR_GOLD, (stressLevel - 0.3) / 0.4);
                else p.color = lerpColor(COLOR_GOLD, COLOR_RED, (stressLevel - 0.7) / 0.3);
            } else {
                p.color = { ...p.originalColor };
            }
        }
        particles.sort((a, b) => a.depth - b.depth);
    }

    function drawParticles() {
        for (const p of particles) {
            const { r, g, b } = p.color;
            const depthAlpha = 0.3 + (p.depth + baseRadius) / (baseRadius * 2) * 0.7;
            const speakBoost = isSpeaking ? 0.3 : 0;
            const alpha = p.alpha * depthAlpha * (0.7 + voiceEnergy * 0.3 + stressLevel * 0.2 + speakBoost);

            // Trails
            if (p.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y);
                ctx.strokeStyle = `rgba(${r},${g},${b},${(isSpeaking ? 0.4 : 0.2) * alpha})`;
                ctx.lineWidth = p.screenSize * (isSpeaking ? 0.8 : 0.5);
                ctx.stroke();
            }

            // Dot
            ctx.beginPath();
            ctx.arc(p.screenX, p.screenY, p.screenSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.fill();

            // Glow
            if (p.screenSize > 1.2 || isSpeaking) {
                const gs = isSpeaking ? p.screenSize * 4.5 : p.screenSize * 2.5;
                ctx.beginPath();
                ctx.arc(p.screenX, p.screenY, gs, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${(isSpeaking ? 0.18 : 0.1) * alpha})`;
                ctx.fill();
            }
        }
    }

    function drawInnerCore() {
        const coreSize = baseRadius * 0.28 * (1 + voiceEnergy * 0.6 + pulseIntensity * 0.8 + stressLevel * 0.3);
        const coreColor = isSpeaking ? hslToRgb(speakingHue, 1, 0.6) : activeColor;
        const { r, g, b } = coreColor;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize);
        grad.addColorStop(0, `rgba(255,255,255,${0.5 + voiceEnergy * 0.3 + (isSpeaking ? 0.2 : 0)})`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${0.4 + voiceEnergy * 0.2})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, coreSize * (isSpeaking ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core ring
        if (isSpeaking) {
            ctx.beginPath();
            ctx.arc(cx, cy, coreSize * 1.6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.18 + voiceEnergy * 0.15})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Secondary core ring (always visible)
        ctx.beginPath();
        ctx.arc(cx, cy, coreSize * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.06 + pulseIntensity * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    function drawRGBWaves() {
        const numWaves = 5;
        for (let i = 0; i < numWaves; i++) {
            const waveTime = (time * 2 + i * 0.4) % 3;
            const waveRadius = baseRadius * (0.5 + waveTime * 2.8);
            const waveAlpha = Math.max(0, 0.35 - waveTime * 0.12) * voiceEnergy;
            if (waveAlpha <= 0) continue;
            const hue = (speakingHue + i * 72) % 360;
            const { r, g, b } = hslToRgb(hue, 0.9, 0.5);
            ctx.beginPath();
            ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${waveAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${waveAlpha * 0.25})`;
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }

    function drawWordBursts() {
        wordBurstQueue = wordBurstQueue.filter(burst => {
            const age = time - burst.time;
            burst.radius = age * 220;
            const alpha = Math.max(0, 0.55 - age * 0.5);
            if (alpha <= 0) return false;
            const { r, g, b } = hslToRgb(burst.hue, 0.9, 0.6);
            ctx.beginPath();
            ctx.arc(cx, cy, burst.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, burst.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.12})`;
            ctx.lineWidth = 18;
            ctx.stroke();
            return true;
        });
    }

    function drawLightningArcs() {
        lightningArcs = lightningArcs.filter(arc => {
            arc.life -= arc.decay;
            if (arc.life <= 0) return false;
            const p1 = particles[arc.p1];
            const p2 = particles[arc.p2];
            if (!p1 || !p2) return false;

            const points = generateLightningPath(p1.screenX, p1.screenY, p2.screenX, p2.screenY, 5);
            const color = stressLevel > 0.7 ? COLOR_RED : (isSpeaking ? hslToRgb(speakingHue, 0.9, 0.7) : COLOR_CYAN);

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${arc.life * 0.6})`;
            ctx.lineWidth = arc.width;
            ctx.stroke();

            // Glow
            ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${arc.life * 0.15})`;
            ctx.lineWidth = arc.width * 4;
            ctx.stroke();
            return true;
        });
    }

    function generateLightningPath(x1, y1, x2, y2, segments) {
        const pts = [{ x: x1, y: y1 }];
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            pts.push({
                x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30,
                y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30,
            });
        }
        pts.push({ x: x2, y: y2 });
        return pts;
    }

    function drawStressRings() {
        const { r, g, b } = COLOR_RED;
        const alpha = (stressLevel - 0.7) * 3.3;
        for (let i = 0; i < 4; i++) {
            const ringRadius = baseRadius * (1.5 + i * 0.35) + Math.sin(time * 3.5 + i) * 6;
            ctx.beginPath();
            ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.18 * (1 - i * 0.2)})`;
            ctx.lineWidth = 1.5 - i * 0.3;
            ctx.stroke();
        }
    }

    function pulse() { pulseIntensity = 1.2; }
    function explode() {
        pulseIntensity = 3.5;
        for (const p of particles) p.baseR = p.originalBaseR * 2.8;
        setTimeout(() => { for (const p of particles) p.baseR = p.originalBaseR; }, 2000);
    }
    function shockwave() {
        pulseIntensity = 6;
        for (const p of particles) { p.baseR = p.originalBaseR * 4.5; p.orbitSpeed *= 5; }
        // Spawn many lightning arcs
        for (let i = 0; i < 8; i++) spawnLightning();
        setTimeout(() => {
            for (const p of particles) { p.baseR = p.originalBaseR; p.orbitSpeed /= 5; }
        }, 3000);
    }
    function resetStress() {
        stressLevel = 0;
        activeColor = { ...COLOR_CYAN };
        lightningArcs = [];
        for (const p of particles) { p.color = { ...p.originalColor }; p.baseR = p.originalBaseR; }
    }

    return {
        init, start, stop,
        setVoiceEnergy, setMood,
        setStressLevel, resetStress,
        pulse, explode, shockwave,
        wordImpact, resize
    };
})();
