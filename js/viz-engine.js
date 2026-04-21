/* ============================================================================
   CINEMATIC 3D STORYTELLING ENGINE v4.0 — ICYS GOLD MEDAL
   
   THREE.JS GLB Model Loading + Cinematic Camera + Particle Systems
   ├─ Loads real .glb models (F1 car, lab, bullet, kevlar fiber)
   ├─ Auto-rotating camera with cinematic zoom
   ├─ Neon edge glow + environment lighting
   ├─ Animated stat counters + typewriter text + bar charts
   ├─ YouTube video embeds
   └─ Canvas particle overlay
   ============================================================================ */
window.VizEngine = (function() {
    'use strict';

    let container, canvasWrap, infoEl;
    let isActive = false, currentViz = null;
    let particleCanvas, particleCtx, particleAnim;
    let particles = [];
    let phaseTimers = []; // Track all phase timers so we can cancel them

    // Three.js scene
    let scene3d, camera3d, renderer3d, controls3d;
    let composer3d;
    let currentModel = null;
    let animFrame3d = null;
    let clock3d = new THREE.Clock();

    // GLB model paths
    const MODELS = {
        f1car: 'models/f1_car.glb',
        bullet: 'models/bullet.glb',
        lab: 'models/lab.glb',
        kevlar: 'models/kevlar.glb',
        kevlar_v2: 'models/kevlar_v2.glb',
        steel: 'models/steel.glb',
        nylon: 'models/nylon.glb',
    };

    // Fallback hero images (Unsplash) for stories WITHOUT glb models
    const IMAGES = {
        molecule: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=90',
        chemistry: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=90',
        vest: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1200&q=90',
        space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=90',
        fiber: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=90',
    };

    // ══════════════════ STORY LIBRARY ══════════════════
    const STORIES = {
        f1car: {
            title: 'HISTORY & APPLICATIONS — KEVLAR IN MOTORSPORT',
            subtitle: 'Interactive Scroll Experience',
            model: null,
            iframeMode: true,
            iframeSrc: 'scroll/',
            color: '#ff3344',
            accentColor: '#00d4ff',
            phases: []
        },
        molecule: {
            title: '3D MOLECULAR ARCHITECTURE — PPTA',
            subtitle: 'Poly-Paraphenylene Terephthalamide',
            model: null,
            iframeMode: true,
            iframeSrc: 'kevlar_rgb_final.html',
            color: '#00d4ff',
            accentColor: '#ff6600',
            phases: []
        },
        barChart: {
            title: 'MATERIAL COMPARISON — TENSILE STRENGTH',
            subtitle: 'Kevlar vs Steel vs Aluminum vs Spider Silk',
            model: null,
            iframeMode: true,
            iframeSrc: 'comparison-3d.html',
            color: '#ffd700',
            accentColor: '#00d4ff',
            phases: []
        },
        ballistic: {
            title: 'BALLISTIC IMPACT SIMULATION',
            subtitle: '.44 Magnum vs Kevlar IIIA+ Body Armor',
            model: null,
            iframeMode: true,
            iframeSrc: 'kevlar-ultra-cinematic.html',
            color: '#ff3344',
            accentColor: '#ff6600',
            phases: []
        },
        vest: {
            title: 'NIJ LEVEL IIIA+ BODY ARMOR',
            subtitle: 'Multi-Layer Kevlar Protection System',
            model: null,
            heroImage: IMAGES.vest,
            color: '#00d4ff',
            accentColor: '#00ff88',
            phases: [
                { type: 'hero', text: 'BODY ARMOR TECHNOLOGY', delay: 0 },
                { type: 'stat', label: 'NIJ LEVEL', value: 0, unit: '', suffix: 'IIIA+ — highest soft armor', color: '#00d4ff', delay: 1000, isText: true },
                { type: 'stat', label: 'LAYERS', value: 40, unit: '', suffix: 'Kevlar fabric sheets', color: '#ff6600', delay: 1800 },
                { type: 'stat', label: 'WEIGHT', value: 2.8, unit: 'kg', suffix: 'vs 25 kg steel equivalent', color: '#ffd700', delay: 2600 },
                { type: 'stat', label: 'LIVES SAVED', value: 3100, unit: '+', suffix: 'documented since 1975', color: '#00ff88', delay: 3400 },
                { type: 'text', text: "First Kevlar vest saved a life on December 23, 1975 — Officer Richard Davis survived a shooting in Detroit. Since then, over 3,100 documented lives saved.", delay: 5000 },
                { type: 'youtube', searchQuery: 'how+bulletproof+vest+works+kevlar+NIJ+test', label: '🎬 Watch: How Bulletproof Vests Work', delay: 8000 },
            ]
        },
        spaceStation: {
            title: 'NASA — ORBITAL DEBRIS SHIELDING',
            subtitle: 'Kevlar in Space: ISS & Mars Missions',
            model: null,
            heroImage: IMAGES.space,
            color: '#4488ff',
            accentColor: '#00d4ff',
            phases: [
                { type: 'hero', text: 'SPACE DEFENSE TECHNOLOGY', delay: 0 },
                { type: 'stat', label: 'DEBRIS SPEED', value: 7800, unit: 'm/s', suffix: 'orbital velocity', color: '#ff6600', delay: 1000 },
                { type: 'stat', label: 'MARS AIRBAGS', value: 24, unit: '', suffix: 'layers of Kevlar', color: '#ffd700', delay: 1800 },
                { type: 'stat', label: 'IMPACT', value: 26, unit: 'm/s', suffix: 'Pathfinder landing', color: '#00ff88', delay: 2600 },
                { type: 'text', text: "NASA first used Kevlar in the Space Shuttle program (1983) for micrometeorite shielding. The ISS uses Kevlar Whipple shields — multi-layer barriers that fragment incoming debris.", delay: 4000 },
                { type: 'youtube', searchQuery: 'NASA+mars+landing+airbag+kevlar+pathfinder', label: '🎬 Watch: Mars Landing Technology', delay: 7000 },
            ]
        },
        crystalLattice: {
            title: 'RESEARCH DATABASE',
            subtitle: 'Crystallographic & Material Science Data',
            model: null,
            iframeMode: true,
            iframeSrc: 'research-database.html',
            color: '#ffd700',
            accentColor: '#00d4ff',
            phases: []
        },
        synthesis: {
            title: 'VIRTUAL SYNTHESIS LAB',
            subtitle: 'PPD + TCl → PPTA + HCl',
            model: null,
            heroImage: 'assets/synthesis_final.webp',
            fullImage: true,
            color: '#00ff88',
            accentColor: '#00d4ff',
            phases: []
        }
    };

    // ══════════════════ INITIALIZATION ══════════════════
    function init() {
        container = document.getElementById('viz-viewport');
        if (!container) { console.warn('VizEngine: No viz-viewport found!'); return; }
        canvasWrap = document.getElementById('viz-canvas-wrap');
        infoEl = document.getElementById('viz-info-cards');
    }

    // ══════════════════ SHOW VISUALIZATION ══════════════════
    function show(vizType, opts) {
        const story = STORIES[vizType];
        if (!story) { console.warn('VizEngine: Unknown viz type:', vizType); return; }
        
        // Clean up previous
        hide();
        
        currentViz = vizType;
        isActive = true;

        container.classList.remove('hidden');
        container.classList.add('active');

        // ALWAYS go fullscreen
        container.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;max-width:none;left:0;top:0;transform:none;z-index:900;border-radius:0;';

        const titleEl = document.getElementById('viz-title');
        if (titleEl) titleEl.textContent = story.title;

        // Build visualization
        canvasWrap.innerHTML = '';
        if (infoEl) infoEl.innerHTML = '';

        // Iframe mode (History, Ballistic, Research)
        if (story.iframeMode) {
            buildIframeView(story);
            return;
        }

        if (story.model && MODELS[story.model]) {
            // THREE.JS 3D MODEL MODE — Split Layout
            build3DScene(story);
        } else {
            // Cinematic image mode
            buildCinematicView(story);
        }

        if (!story.fullImage) {
            startParticles(story.color);
        }
    }

    function hide() {
        isActive = false;
        // Cancel all pending phase timers
        phaseTimers.forEach(tid => clearTimeout(tid));
        phaseTimers = [];
        // Stop any speech in progress
        VoiceEngine.stop();
        if (container) {
            container.classList.remove('active');
            container.classList.add('hidden');
            // Reset any fullscreen iframe styles
            container.style.cssText = '';
        }
        cleanup3D();
        if (canvasWrap) canvasWrap.innerHTML = '';
        if (infoEl) infoEl.innerHTML = '';
        stopParticles();
        currentViz = null;
    }

    // ══════════════════ THREE.JS 3D SCENE ══════════════════
    function build3DScene(story) {
        const wrap = canvasWrap;
        const rect = wrap.getBoundingClientRect();
        const w = rect.width || 800;
        const h = rect.height || 500;

        // Renderer — OPTIMIZED for RTX 3050
        renderer3d = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
        renderer3d.setSize(w, h);
        renderer3d.setPixelRatio(1); // Force 1x for performance
        renderer3d.outputEncoding = THREE.sRGBEncoding;
        renderer3d.toneMapping = THREE.ACESFilmicToneMapping;
        renderer3d.toneMappingExposure = 1.2;
        renderer3d.shadowMap.enabled = false; // Disabled for performance
        renderer3d.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;';
        wrap.appendChild(renderer3d.domElement);

        // Scene
        scene3d = new THREE.Scene();
        scene3d.background = new THREE.Color(0x000a14);
        scene3d.fog = new THREE.FogExp2(0x000a14, 0.02);

        // CSS background layer
        const bgLayer = document.createElement('div');
        bgLayer.className = 'scene-dynamic-bg';
        bgLayer.style.cssText = 'position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(ellipse at center, rgba(0,20,40,1) 0%, rgba(0,5,10,1) 100%);';
        wrap.appendChild(bgLayer);

        // Camera
        const cp = story.cameraPos || { x: 3, y: 2, z: 4 };
        camera3d = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
        camera3d.position.set(cp.x, cp.y, cp.z);

        // Controls
        controls3d = new THREE.OrbitControls(camera3d, renderer3d.domElement);
        controls3d.enableDamping = true;
        controls3d.dampingFactor = 0.05;
        controls3d.autoRotate = true;
        controls3d.autoRotateSpeed = 1.5;
        controls3d.maxPolarAngle = Math.PI * 0.85;

        // Lighting — simplified for performance (3 lights max)
        const ambient = new THREE.AmbientLight(0x607080, 0.6);
        scene3d.add(ambient);

        const key = new THREE.DirectionalLight(0xffffff, 1.5);
        key.position.set(5, 8, 5);
        scene3d.add(key);

        const rim = new THREE.DirectionalLight(new THREE.Color(story.color || '#00d4ff'), 2.0);
        rim.position.set(-3, 3, -5);
        scene3d.add(rim);

        // Grid floor — simplified
        const gridHelper = new THREE.GridHelper(20, 20, new THREE.Color(story.color || '#00d4ff'), 0x001122);
        gridHelper.position.y = -0.01;
        gridHelper.material.opacity = 0.12;
        gridHelper.material.transparent = true;
        scene3d.add(gridHelper);

        // NO bloom post-processing — direct render for performance
        composer3d = null;

        // Loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'viz-loading';
        loadingDiv.innerHTML = '<div class="viz-loading-spinner"></div><div class="viz-loading-text">LOADING 3D MODEL...</div>';
        wrap.appendChild(loadingDiv);

        // Load GLB model
        const loader = new THREE.GLTFLoader();
        const modelPath = MODELS[story.model];

        loader.load(modelPath, (gltf) => {
            if (!isActive) return;
            loadingDiv.remove();
            
            currentModel = gltf.scene;
            
            // Center and scale model
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = (story.modelScale || 1) * (3 / maxDim);
            
            currentModel.scale.set(scale, scale, scale);
            currentModel.position.sub(center.multiplyScalar(scale));
            currentModel.position.y = 0;

            // Enable shadows
            currentModel.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.envMapIntensity = 1.5;
                    }
                }
            });

            scene3d.add(currentModel);
            controls3d.target.set(0, size.y * scale * 0.3, 0);

            // Start cinematic entrance
            camera3d.position.set(cp.x * 2, cp.y * 2, cp.z * 2);
            animateCameraEntrance(cp);

        }, (progress) => {
            const pct = progress.total ? Math.round(progress.loaded / progress.total * 100) : '...';
            const lt = loadingDiv.querySelector('.viz-loading-text');
            if (lt) lt.textContent = `LOADING 3D MODEL... ${pct}%`;
        }, (error) => {
            console.error('GLB load error:', error);
            loadingDiv.querySelector('.viz-loading-text').textContent = 'MODEL LOAD FAILED — Switching to cinematic mode';
            setTimeout(() => {
                loadingDiv.remove();
                cleanup3D();
                buildCinematicView(story);
            }, 1500);
        });

        // Start render loop
        animate3D();

        // Content panels — LEFT SIDE PANEL (no overlap with model)
        const content = document.createElement('div');
        content.className = 'cinema-content viz-3d-overlay viz-side-panel';
        content.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:360px;z-index:10;padding:20px 24px;overflow-y:auto;background:linear-gradient(90deg, rgba(0,5,15,0.95) 0%, rgba(0,5,15,0.85) 70%, rgba(0,5,15,0.0) 100%);display:flex;flex-direction:column;gap:10px;box-sizing:border-box;';
        wrap.appendChild(content);

        // Particle canvas on top
        particleCanvas = document.createElement('canvas');
        particleCanvas.style.cssText = 'position:absolute;inset:0;z-index:5;pointer-events:none;';
        wrap.appendChild(particleCanvas);

        // Cancel previous speech & queue narration
        VoiceEngine.stop();

        // Execute phases sequentially with cancelable timers
        phaseTimers = [];
        story.phases.forEach(phase => {
            const tid = setTimeout(() => {
                if (!isActive) return;
                renderPhase(phase, content, story);
            }, phase.delay);
            phaseTimers.push(tid);
        });
    }

    function animateCameraEntrance(target) {
        const start = { x: camera3d.position.x, y: camera3d.position.y, z: camera3d.position.z };
        const startTime = performance.now();
        const duration = 2000;

        function step(now) {
            if (!isActive) return;
            const t = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            camera3d.position.x = start.x + (target.x - start.x) * ease;
            camera3d.position.y = start.y + (target.y - start.y) * ease;
            camera3d.position.z = start.z + (target.z - start.z) * ease;
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function animate3D() {
        if (!isActive || !renderer3d) return;
        animFrame3d = requestAnimationFrame(animate3D);

        const delta = clock3d.getDelta();
        if (controls3d) controls3d.update();

        // Subtle model bob
        if (currentModel) {
            currentModel.position.y = Math.sin(Date.now() * 0.001) * 0.05;
        }

        if (composer3d) {
            composer3d.render();
        } else if (renderer3d && scene3d && camera3d) {
            renderer3d.render(scene3d, camera3d);
        }
    }

    function cleanup3D() {
        if (animFrame3d) cancelAnimationFrame(animFrame3d);
        animFrame3d = null;
        if (currentModel && scene3d) scene3d.remove(currentModel);
        currentModel = null;
        if (renderer3d) {
            renderer3d.dispose();
            renderer3d = null;
        }
        if (composer3d) composer3d = null;
        scene3d = null;
        camera3d = null;
        controls3d = null;
    }

    // ══════════════════ IFRAME VIEW (for scroll/HTML experiences) ══════════════════
    function buildIframeView(story) {
        const wrap = canvasWrap;
        wrap.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = story.iframeSrc;
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;z-index:1;background:#000;';
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
    }

    // ══════════════════ CINEMATIC IMAGE BUILDER ══════════════════
    function buildCinematicView(story) {
        const wrap = canvasWrap;
        wrap.style.position = 'relative';
        wrap.style.overflow = 'hidden';

        // Hero image — fullImage mode shows the image bigger & brighter
        if (story.heroImage) {
            const heroWrap = document.createElement('div');
            heroWrap.className = 'cinema-hero';
            heroWrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;';
            const img = document.createElement('img');
            img.src = story.heroImage;
            img.className = 'cinema-hero-img';
            if (story.fullImage) {
                // Full image mode — show it bright and clear, almost no darkening, no zoom
                img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;
                    filter:brightness(1.0) contrast(1.1) saturate(1.2);
                    animation: cinemaFadeIn 1.5s ease 0.3s forwards;`;
            } else {
                img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;
                    filter:brightness(0.35) contrast(1.2) saturate(1.3);
                    animation: cinemaKenBurns 20s ease infinite alternate, cinemaFadeIn 1.5s ease 0.3s forwards;`;
            }
            heroWrap.appendChild(img);
            wrap.appendChild(heroWrap);
        }

        // Dark gradient overlay — lighter for fullImage mode
        const grad = document.createElement('div');
        if (story.fullImage) {
            grad.style.cssText = `position:absolute;inset:0;z-index:2;
                background:transparent;
                pointer-events:none;`;
        } else {
            grad.style.cssText = `position:absolute;inset:0;z-index:2;
                background:linear-gradient(180deg, rgba(0,5,15,0.7) 0%, rgba(0,5,15,0.3) 40%, rgba(0,5,15,0.8) 100%);
                pointer-events:none;`;
        }
        wrap.appendChild(grad);

        // Scanline overlay
        const scan = document.createElement('div');
        scan.style.cssText = `position:absolute;inset:0;z-index:3;opacity:0.03;pointer-events:none;
            background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px);`;
        wrap.appendChild(scan);

        // Particle canvas (skip for fullImage mode)
        if (!story.fullImage) {
            particleCanvas = document.createElement('canvas');
            particleCanvas.style.cssText = 'position:absolute;inset:0;z-index:4;pointer-events:none;';
            wrap.appendChild(particleCanvas);
        }

        // Content container — bottom area with transparent background for fullImage
        const content = document.createElement('div');
        content.className = 'cinema-content';
        if (story.fullImage) {
            content.style.cssText = `position:absolute;left:0;right:0;bottom:0;z-index:5;padding:16px 30px;
                display:flex;flex-direction:column;justify-content:flex-end;gap:0;overflow-y:auto;max-height:40%;
                background:transparent;`;
        } else {
            content.style.cssText = `position:absolute;inset:0;z-index:5;padding:30px 40px;
                display:flex;flex-direction:column;justify-content:flex-end;gap:0;overflow-y:auto;`;
        }
        wrap.appendChild(content);

        // Cancel previous speech
        VoiceEngine.stop();

        // Execute phases with cancelable timers
        phaseTimers = [];
        story.phases.forEach(phase => {
            const tid = setTimeout(() => {
                if (!isActive) return;
                renderPhase(phase, content, story);
            }, phase.delay);
            phaseTimers.push(tid);
        });
    }

    // ══════════════════ PHASE RENDERERS ══════════════════
    function renderPhase(phase, container, story) {
        switch(phase.type) {
            case 'hero': renderHeroTitle(phase, container, story); break;
            case 'stat': renderStat(phase, container); break;
            case 'bar': renderBar(phase, container); break;
            case 'text': renderText(phase, container); break;
            case 'youtube': renderYouTube(phase, container); break;
        }
        container.scrollTop = container.scrollHeight;
    }

    function renderHeroTitle(phase, container, story) {
        const el = document.createElement('div');
        el.className = 'cinema-phase cinema-hero-title data-overlay-box';
        el.style.cssText = 'position:relative;width:100%;max-width:100%;margin-bottom:12px;box-sizing:border-box;border-left:4px solid ' + story.color + ';';

        el.innerHTML = `
            <div class="data-box-title" style="color:${story.color};font-size:0.5rem;">${phase.text}</div>
            <div class="cinema-main-title" style="font-size:1rem; font-weight:900; letter-spacing:2px; text-transform:uppercase; text-shadow:0 0 8px ${story.color}; margin-top:4px; word-wrap:break-word;">${story.title}</div>
            <div class="cinema-subtitle" style="color:${story.accentColor}; font-size:0.65rem; margin-top:6px;">${story.subtitle}</div>
            <div style="margin-top:6px; height:2px; background:linear-gradient(90deg, transparent, ${story.color}, transparent)"></div>
        `;
        container.appendChild(el);
    }

    function renderStat(phase, container) {
        const el = document.createElement('div');
        el.className = 'cinema-phase cinema-stat data-overlay-box';
        el.style.position = 'relative';
        el.style.width = '100%';
        el.style.maxWidth = '300px';
        el.style.marginBottom = '10px';
        el.style.borderLeft = `3px solid ${phase.color}`;

        const labelEl = document.createElement('div');
        labelEl.className = 'data-box-title';
        labelEl.style.color = phase.color;
        labelEl.textContent = phase.label;
        el.appendChild(labelEl);

        const valueWrap = document.createElement('div');
        valueWrap.className = 'data-box-value';

        if (phase.isText) {
            valueWrap.innerHTML = `<span class="decode-text"></span>`;
            el.appendChild(valueWrap);
            container.appendChild(el);
            hackText(valueWrap.querySelector('.decode-text'), phase.suffix, 600);
            return;
        } else {
            const numEl = document.createElement('span');
            numEl.textContent = '0';
            valueWrap.appendChild(numEl);

            const unitEl = document.createElement('span');
            unitEl.style.fontSize = '0.5em';
            unitEl.style.marginLeft = '5px';
            unitEl.textContent = phase.unit;
            valueWrap.appendChild(unitEl);

            if (phase.suffix) {
                const suf = document.createElement('span');
                suf.style.fontSize = '0.4em';
                suf.style.display = 'block';
                suf.style.opacity = '0.5';
                suf.textContent = phase.suffix;
                valueWrap.appendChild(suf);
            }
            animateCounter(numEl, 0, phase.value, 1200);
        }

        el.appendChild(valueWrap);
        container.appendChild(el);
    }

    function renderBar(phase, container) {
        const el = document.createElement('div');
        el.className = 'cinema-phase cinema-bar-wrap data-overlay-box';
        el.style.position = 'relative';
        el.style.width = '100%';
        el.style.marginBottom = '10px';
        
        const uid = 'bar-' + phase.label.replace(/\s/g, '') + '-' + Date.now();

        const topRow = document.createElement('div');
        topRow.style.cssText = 'display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;';
        topRow.innerHTML = `
            <span class="data-box-title" style="color:${phase.color}; border:none; margin:0; padding:0;">${phase.label}</span>
            <span class="data-box-value" style="font-size:1.2rem;" id="${uid}">0 MPa</span>
        `;
        el.appendChild(topRow);

        const track = document.createElement('div');
        track.className = 'complex-bar';
        const fill = document.createElement('div');
        fill.className = 'complex-bar-fill';
        fill.style.background = `linear-gradient(90deg, transparent, ${phase.color})`;
        fill.style.boxShadow = `0 0 15px ${phase.color}66`;
        fill.style.width = '0%';
        track.appendChild(fill);
        el.appendChild(track);
        container.appendChild(el);

        const targetWidth = (phase.value / phase.max) * 100;
        const valEl = el.querySelector(`#${uid}`);
        let startTime = null;
        function step(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / 1500, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            fill.style.width = (targetWidth * ease) + '%';
            if (valEl) valEl.textContent = Math.round(phase.value * ease).toLocaleString() + ' MPa';
            if (progress < 1 && isActive) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function renderText(phase, container) {
        const el = document.createElement('div');
        el.className = 'cinema-phase cinema-text';
        container.appendChild(el);
        typeWriter(el, phase.text, 18);
    }

    function renderYouTube(phase, container) {
        const el = document.createElement('div');
        el.className = 'cinema-phase cinema-youtube';
        // Use YouTube search URL instead of specific video IDs (which can go dead)
        const ytUrl = phase.searchQuery 
            ? `https://www.youtube.com/results?search_query=${phase.searchQuery}`
            : `https://www.youtube.com/watch?v=${phase.videoId}`;
        el.innerHTML = `
            <a href="${ytUrl}" target="_blank" rel="noopener" class="cinema-yt-link">
                <div class="cinema-yt-thumb">
                    <div class="cinema-yt-play">▶</div>
                </div>
                <div class="cinema-yt-label">${phase.label}</div>
            </a>
        `;
        container.appendChild(el);
    }

    // ══════════════════ ANIMATION HELPERS ══════════════════
    function animateCounter(el, from, to, duration) {
        const start = performance.now();
        const isFloat = to % 1 !== 0;
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * ease;
            el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
            if (progress < 1 && isActive) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    function typeWriter(el, text, speed) {
        el.className = 'data-overlay-box decode-text';
        el.style.width = '100%';
        el.style.maxWidth = '300px';
        hackText(el, text, 1500);
    }

    // New hacking effect
    function hackText(el, finalStr, duration) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>';
        const start = performance.now();
        const interval = setInterval(() => {
            if (!isActive) return clearInterval(interval);
            const now = performance.now();
            const progress = Math.min((now - start) / duration, 1);
            let str = '';
            for (let i = 0; i < finalStr.length; i++) {
                if (i < finalStr.length * progress) {
                    str += finalStr[i];
                } else if (finalStr[i] === ' ') {
                    str += ' ';
                } else {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            el.textContent = str;
            if (progress >= 1) {
                clearInterval(interval);
                el.classList.add('done');
            }
        }, 30);
    }

    // ══════════════════ PARTICLES ══════════════════
    function startParticles(color) {
        if (!particleCanvas) return;
        const parent = particleCanvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        particleCanvas.width = rect.width;
        particleCanvas.height = rect.height;
        particleCtx = particleCanvas.getContext('2d');
        particles = [];

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -Math.random() * 0.6 - 0.1,
                size: Math.random() * 2.5 + 0.3,
                alpha: Math.random() * 0.5 + 0.1,
                hue: Math.random() * 60
            });
        }
        animateParticles();
    }

    function animateParticles() {
        if (!isActive || !particleCtx) return;
        const w = particleCanvas.width, h = particleCanvas.height;
        particleCtx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
            if (p.x < 0 || p.x > w) p.vx *= -1;
            particleCtx.fillStyle = `hsla(${190 + p.hue}, 100%, 70%, ${p.alpha})`;
            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            particleCtx.fill();
        });
        particleAnim = requestAnimationFrame(animateParticles);
    }

    function stopParticles() {
        if (particleAnim) cancelAnimationFrame(particleAnim);
        particles = [];
    }

    // ══════════════════ PUBLIC API ══════════════════
    function highlightAtom() {}
    function highlightGroup() {}
    function clearHighlights() {}
    function moveCameraTo() {}

    return {
        init, show, hide,
        highlightAtom, highlightGroup, clearHighlights, moveCameraTo,
        isVisible: () => isActive,
        getCurrentViz: () => currentViz,
        STORIES
    };
})();
