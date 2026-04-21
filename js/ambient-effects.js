/* ============================================
   AMBIENT EFFECTS — Cinematic Film Layer
   Floating dust, lens flare, chromatic aberration,
   anamorphic streaks
   ============================================ */

window.AmbientEffects = (function() {
    let canvas, ctx;
    let W, H;
    let isActive = false;
    let animId = null;
    let time = 0;
    let dustParticles = [];
    let stressLevel = 0;

    const DUST_COUNT = 15;

    function init() {
        canvas = document.createElement('canvas');
        canvas.id = 'ambient-canvas';
        canvas.style.cssText = 'position:fixed;inset:0;z-index:9988;pointer-events:none;';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resize();
        createDust();
        window.addEventListener('resize', resize);
    }

    function resize() {
        const dpr = 1; // Force 1x for performance
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createDust() {
        dustParticles = [];
        for (let i = 0; i < DUST_COUNT; i++) {
            dustParticles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                size: 0.5 + Math.random() * 1.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: -0.1 - Math.random() * 0.3,
                alpha: 0.05 + Math.random() * 0.1,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.01 + Math.random() * 0.02,
            });
        }
    }

    function start() { isActive = true; render(); }
    function stop() { isActive = false; if (animId) cancelAnimationFrame(animId); }
    function setStress(level) { stressLevel = Math.max(0, Math.min(1, level)); }

    function render() {
        if (!isActive) return;
        animId = requestAnimationFrame(render);
        time += 0.016;

        ctx.clearRect(0, 0, W, H);
        drawDust();
        
        if (stressLevel > 0.5) {
            drawChromaticAberration();
        }
        
        drawAnamorphicStreaks();
    }

    function drawDust() {
        for (const p of dustParticles) {
            p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * 0.15;
            p.y += p.speedY;

            // Wrap around
            if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,220,235,${p.alpha})`;
            ctx.fill();
        }
    }

    function drawChromaticAberration() {
        const intensity = (stressLevel - 0.5) * 2; // 0 to 1
        const offset = intensity * 3;
        
        // Edge zones only
        const edgeSize = 80;
        ctx.save();
        
        // Top edge
        ctx.fillStyle = `rgba(255,0,0,${intensity * 0.03})`;
        ctx.fillRect(0, 0, W, edgeSize);
        
        // Bottom edge
        ctx.fillStyle = `rgba(0,255,255,${intensity * 0.03})`;
        ctx.fillRect(0, H - edgeSize, W, edgeSize);
        
        // Left edge
        ctx.fillStyle = `rgba(255,0,255,${intensity * 0.02})`;
        ctx.fillRect(0, 0, edgeSize, H);
        
        // Right edge
        ctx.fillStyle = `rgba(0,255,0,${intensity * 0.02})`;
        ctx.fillRect(W - edgeSize, 0, edgeSize, H);
        
        ctx.restore();
    }

    function drawAnamorphicStreaks() {
        // Subtle horizontal light streaks across center
        const centerY = H * 0.5;
        const streakH = 1;
        const alpha = 0.015 + stressLevel * 0.01;
        
        for (let i = 0; i < 2; i++) {
            const y = centerY + (i - 1) * 30 + Math.sin(time * 0.5 + i) * 10;
            const grad = ctx.createLinearGradient(0, y, W, y);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.3, `rgba(0,212,255,${alpha})`);
            grad.addColorStop(0.5, `rgba(168,85,247,${alpha * 0.8})`);
            grad.addColorStop(0.7, `rgba(0,212,255,${alpha})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, y - streakH, W, streakH * 2);
        }
    }

    return {
        init, start, stop,
        setStress, resize
    };
})();
