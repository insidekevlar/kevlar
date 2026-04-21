/* ============================================
   HUD RENDERER v4 — NVIDIA RTX Grade
   Hexagonal grid, radar sweep, data streams,
   target brackets, warning diamonds
   ============================================ */

window.HUDRenderer = (function() {
    let canvas, ctx;
    let W, H, cx, cy;
    let time = 0;
    let isActive = false;
    let animId = null;
    let reactivity = 0;
    let sceneColor = { r: 0, g: 212, b: 255 };
    let isSpeaking = false;
    let speakingHue = 0;
    let radarAngle = 0;
    let dataStreamChars = [];

    let lastFrame = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
        initDataStreams();
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
    }

    function initDataStreams() {
        const chars = '0123456789ABCDEF∆Ω∑πΣ';
        for (let i = 0; i < 25; i++) {
            dataStreamChars.push({
                angle: Math.random() * Math.PI * 2,
                speed: 0.002 + Math.random() * 0.005,
                char: chars[Math.floor(Math.random() * chars.length)],
                radius: 0.32 + Math.random() * 0.08,
                alpha: 0.1 + Math.random() * 0.15,
                size: 6 + Math.random() * 4,
            });
        }
    }

    function start() { isActive = true; lastFrame = performance.now(); render(); }
    function stop() { isActive = false; if (animId) cancelAnimationFrame(animId); }
    function setReactivity(v) { reactivity = Math.max(0, Math.min(1, v)); }
    function setSceneColor(r, g, b) { sceneColor = { r, g, b }; }
    function setSpeaking(val) { isSpeaking = val; }

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
            const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p2 = 2 * l - q2;
            r = hue2rgb(p2, q2, h + 1/3);
            g = hue2rgb(p2, q2, h);
            b = hue2rgb(p2, q2, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function rgba(r, g, b, a) { return `rgba(${r},${g},${b},${a})`; }

    function render(now) {
        if (!isActive) return;
        animId = requestAnimationFrame(render);
        if (now && now - lastFrame < frameInterval * 0.9) return;
        lastFrame = now || performance.now();

        time += 0.008;
        if (isSpeaking) speakingHue = (speakingHue + 1.2) % 360;
        radarAngle = (radarAngle + 0.015 + reactivity * 0.01) % (Math.PI * 2);

        ctx.clearRect(0, 0, W, H);

        drawHexGrid();
        drawRadarSweep();
        drawOuterRings();
        drawInnerRings();
        drawTickMarks();
        drawArcSegments();
        drawDataStreams();
        drawTargetBrackets();
        drawCrosshair();
        drawCornerDecorations();
        drawCompassMarkers();

        reactivity *= 0.97;
    }

    function drawHexGrid() {
        const { r, g, b } = sceneColor;
        const hexSize = 40;
        const hexH = hexSize * Math.sqrt(3);
        const alpha = 0.025 + reactivity * 0.015;

        ctx.save();
        ctx.strokeStyle = rgba(r, g, b, alpha);
        ctx.lineWidth = 0.4;

        for (let row = -1; row < H / hexH + 1; row++) {
            for (let col = -1; col < W / (hexSize * 1.5) + 1; col++) {
                const x = col * hexSize * 1.5;
                const y = row * hexH + (col % 2 ? hexH / 2 : 0);

                // Distance from center affects opacity
                const dx = x - cx, dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = Math.min(W, H) * 0.5;
                if (dist > maxDist) continue;

                const distAlpha = 1 - (dist / maxDist) * 0.7;
                ctx.globalAlpha = distAlpha;

                drawHexagon(x, y, hexSize * 0.45);
            }
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function drawHexagon(x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i - Math.PI / 6;
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function drawRadarSweep() {
        const { r, g, b } = sceneColor;
        const baseRadius = Math.min(W, H) * 0.35;
        const sweepColor = isSpeaking ? hslToRgb(speakingHue, 0.9, 0.5) : { r, g, b };

        ctx.save();
        ctx.translate(cx, cy);

        // Sweep gradient
        const grad = ctx.createConicGradient(radarAngle, 0, 0);
        grad.addColorStop(0, `rgba(${sweepColor.r},${sweepColor.g},${sweepColor.b},0.08)`);
        grad.addColorStop(0.05, `rgba(${sweepColor.r},${sweepColor.g},${sweepColor.b},0.04)`);
        grad.addColorStop(0.15, `rgba(${sweepColor.r},${sweepColor.g},${sweepColor.b},0.01)`);
        grad.addColorStop(0.2, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Sweep line
        const lineX = Math.cos(radarAngle) * baseRadius;
        const lineY = Math.sin(radarAngle) * baseRadius;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(lineX, lineY);
        ctx.strokeStyle = rgba(sweepColor.r, sweepColor.g, sweepColor.b, 0.15 + reactivity * 0.1);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

    function drawOuterRings() {
        const ringColor = isSpeaking ? hslToRgb(speakingHue, 0.9, 0.5) : sceneColor;
        const ring2Color = isSpeaking ? hslToRgb((speakingHue + 120) % 360, 0.9, 0.5) : { r: 168, g: 85, b: 247 };
        const ring3Color = isSpeaking ? hslToRgb((speakingHue + 240) % 360, 0.9, 0.5) : { r: 255, g: 215, b: 0 };
        const { r, g, b } = ringColor;
        const baseRadius = Math.min(W, H) * 0.35;
        const speakBoost = isSpeaking ? 0.1 : 0;

        // Ring 1
        ctx.save();
        const jitterX = reactivity > 0.3 ? (Math.random() - 0.5) * reactivity * 8 : 0;
        const jitterY = reactivity > 0.3 ? (Math.random() - 0.5) * reactivity * 8 : 0;
        ctx.translate(cx + jitterX, cy + jitterY);
        ctx.rotate(time * (isSpeaking ? 0.6 : 0.3));
        ctx.strokeStyle = rgba(r, g, b, 0.14 + reactivity * 0.15 + speakBoost);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.strokeStyle = rgba(r, g, b, 0.04);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();

        // Ring 2
        ctx.save();
        ctx.translate(cx - jitterX, cy - jitterY);
        ctx.rotate(-time * 0.5);
        ctx.strokeStyle = rgba(ring2Color.r, ring2Color.g, ring2Color.b, 0.12 + reactivity * 0.12 + speakBoost);
        ctx.lineWidth = 0.8;
        ctx.setLineDash([10, 20]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.85, 0.3, Math.PI * 1.8);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Ring 3
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.8);
        ctx.strokeStyle = rgba(ring3Color.r, ring3Color.g, ring3Color.b, 0.07 + reactivity * 0.1 + speakBoost);
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 15]);
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Ring 4
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-time * 0.15);
        ctx.strokeStyle = rgba(r, g, b, 0.07);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 1.2, 0, Math.PI * 0.6);
        ctx.stroke();
        ctx.restore();
    }

    function drawInnerRings() {
        const { r, g, b } = sceneColor;
        const baseRadius = Math.min(W, H) * 0.15;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-time * 0.6);
        ctx.strokeStyle = rgba(r, g, b, 0.17 + reactivity * 0.2);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0.5, Math.PI * 1.7);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 1.0);
        ctx.strokeStyle = rgba(168, 85, 247, 0.1);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.7, 0, Math.PI * 1.2);
        ctx.stroke();
        ctx.restore();
    }

    function drawTickMarks() {
        const { r, g, b } = sceneColor;
        const baseRadius = Math.min(W, H) * 0.35;

        ctx.save();
        const tickJitter = reactivity > 0.4 ? (Math.random() - 0.5) * reactivity * 4 : 0;
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.3 + tickJitter * 0.1);

        const ticks = 72;
        for (let i = 0; i < ticks; i++) {
            const angle = (i / ticks) * Math.PI * 2;
            const isLong = i % 6 === 0;
            const len = isLong ? 14 : 5;
            const alpha = isLong ? 0.22 + reactivity * 0.15 : 0.06;

            ctx.strokeStyle = rgba(r, g, b, alpha);
            ctx.lineWidth = isLong ? 1.2 : 0.5;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * baseRadius, Math.sin(angle) * baseRadius);
            ctx.lineTo(Math.cos(angle) * (baseRadius + len), Math.sin(angle) * (baseRadius + len));
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawArcSegments() {
        const baseRadius = Math.min(W, H) * 0.35;
        const arcStart = time * 0.4;
        const arcLen = 0.3 + Math.sin(time * 2) * 0.15;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = rgba(255, 215, 0, 0.28 + reactivity * 0.3);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.95, arcStart, arcStart + arcLen);
        ctx.stroke();

        ctx.strokeStyle = rgba(168, 85, 247, 0.22 + reactivity * 0.2);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.95, arcStart + Math.PI, arcStart + Math.PI + arcLen * 0.8);
        ctx.stroke();
        ctx.restore();
    }

    function drawDataStreams() {
        const { r, g, b } = sceneColor;
        const baseRadius = Math.min(W, H) * 0.35;

        ctx.save();
        ctx.font = '8px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.translate(cx, cy);

        for (const d of dataStreamChars) {
            d.angle += d.speed;
            const rad = baseRadius * d.radius;
            const x = Math.cos(d.angle) * rad;
            const y = Math.sin(d.angle) * rad;

            // Randomize char occasionally
            if (Math.random() < 0.005) {
                const chars = '0123456789ABCDEF∆Ω∑πΣ';
                d.char = chars[Math.floor(Math.random() * chars.length)];
            }

            ctx.fillStyle = rgba(r, g, b, d.alpha + reactivity * 0.05);
            ctx.fillText(d.char, x, y);
        }
        ctx.restore();
    }

    function drawTargetBrackets() {
        const { r, g, b } = sceneColor;
        const size = 25 + Math.sin(time * 1.5) * 3;
        const gap = 6;
        const alpha = 0.2 + reactivity * 0.2 + (isSpeaking ? 0.1 : 0);
        const bracketLen = 10;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = rgba(r, g, b, alpha);
        ctx.lineWidth = 1.2;

        // Four corner brackets
        const positions = [
            [-size, -size], [size, -size],
            [-size, size], [size, size]
        ];
        const dirs = [
            [1, 1], [-1, 1],
            [1, -1], [-1, -1]
        ];

        for (let i = 0; i < 4; i++) {
            const [px, py] = positions[i];
            const [dx, dy] = dirs[i];
            ctx.beginPath();
            ctx.moveTo(px + dx * bracketLen, py);
            ctx.lineTo(px, py);
            ctx.lineTo(px, py + dy * bracketLen);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawCrosshair() {
        const { r, g, b } = sceneColor;
        const size = 18 + reactivity * 5;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = rgba(r, g, b, 0.35);
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(-size, 0); ctx.lineTo(-5, 0);
        ctx.moveTo(5, 0); ctx.lineTo(size, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -size); ctx.lineTo(0, -5);
        ctx.moveTo(0, 5); ctx.lineTo(0, size);
        ctx.stroke();

        ctx.fillStyle = rgba(r, g, b, 0.6 + reactivity * 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawCompassMarkers() {
        const { r, g, b } = sceneColor;
        const baseRadius = Math.min(W, H) * 0.35;
        const labels = ['N', 'E', 'S', 'W'];
        const alpha = 0.15 + reactivity * 0.1;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.font = '8px "Orbitron", sans-serif';
        ctx.fillStyle = rgba(r, g, b, alpha);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) - Math.PI / 2;
            const x = Math.cos(angle) * (baseRadius + 22);
            const y = Math.sin(angle) * (baseRadius + 22);
            ctx.fillText(labels[i], x, y);
        }
        ctx.restore();
    }

    function drawCornerDecorations() {
        const { r, g, b } = sceneColor;
        const m = 30;
        const s = 42 + Math.sin(time * 1.5) * 5;

        ctx.save();
        ctx.strokeStyle = rgba(r, g, b, 0.12);
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(m, m + s); ctx.lineTo(m, m); ctx.lineTo(m + s, m);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(W - m - s, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + s);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(m, H - m - s); ctx.lineTo(m, H - m); ctx.lineTo(m + s, H - m);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(W - m, H - m - s); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m - s, H - m);
        ctx.stroke();

        // Corner dots
        ctx.fillStyle = rgba(r, g, b, 0.2 + Math.sin(time * 2) * 0.1);
        const dotSize = 3;
        ctx.beginPath(); ctx.arc(m + 3, m + 3, dotSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(W - m - 3, m + 3, dotSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(m + 3, H - m - 3, dotSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(W - m - 3, H - m - 3, dotSize, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
    }

    function pulse() { reactivity = 1; }
    function flash() {
        reactivity = 1;
        const orig = { ...sceneColor };
        sceneColor = { r: 255, g: 255, b: 255 };
        setTimeout(() => { sceneColor = orig; }, 100);
    }

    return {
        init, start, stop,
        pulse, flash,
        setReactivity, setSceneColor, setSpeaking, resize
    };
})();
