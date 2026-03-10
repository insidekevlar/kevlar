/**
 * KEVLAR 3D SUPREMACY - ELITE EDITION
 * ============================================
 * Features:
 * - Full 3D background with spider web & armor
 * - RGB glowing buttons with spider web click effects
 * - 360° rotatable 3D background (drag with mouse)
 * - 3D camera model in dynamics panel
 * - Ultra-premium animations
 */

// ============================================
// Global State
// ============================================
const state = {
    isLoading: true,
    isAuthenticated: false,
    armorOpen: false,
    gestureMode: false,
    comparisonOpen: false,
    timelineOpen: false,
    mousePos: { x: 0, y: 0 },
    fps: 60,
    lastFrameTime: performance.now(),
    frameCount: 0
};

// ============================================
// Three.js Scene References
// ============================================
let scene, camera, renderer, controls;
let fiberGroup, webGroup, armorGroup, armorLayers = [];
let webParticles, webParticlePositions, webParticleVelocities;
let particles, geometricGroup;
let kevlarScene, kevlarCamera, kevlarRenderer;
let steelScene, steelCamera, steelRenderer;
let kevlarModel, steelModel;
let cameraModelScene, cameraModelCam, cameraModelRenderer, camera3DModel;

// ============================================
// DOM Elements
// ============================================
const elements = {};

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initCustomCursor();
    initKevlarBg();
    initEventListeners();
    initButtonEffects();
    initSpecsHolo();

    // Hide loading screen after everything loads
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        state.isLoading = false;
        animateCounters();
    }, 2500);
});

// ============================================
// Initialize DOM Elements
// ============================================
function initElements() {
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.securityPanel = document.getElementById('security-panel');
    elements.dynamicsPanel = document.getElementById('dynamics-panel');
    elements.gestureNotification = document.getElementById('gesture-notification');
    elements.passwordInput = document.getElementById('password-input');
    elements.unlockBtn = document.getElementById('unlock-btn');
    elements.securityError = document.getElementById('security-error');
    elements.armorToggleBtn = document.getElementById('armor-toggle-btn');
    elements.gestureToggleBtn = document.getElementById('gesture-toggle-btn');
    elements.compareBtn = document.getElementById('compare-btn');
    elements.comparisonSection = document.getElementById('comparison-section');
    elements.closeComparisonBtn = document.getElementById('close-comparison-btn');
    elements.ctaArmorBtn = document.getElementById('cta-armor-btn');
    elements.eliteAccessBtn = document.getElementById('elite-access-btn');
    elements.fullscreenBtn = document.getElementById('fullscreen-btn');
    elements.mainCanvas = document.getElementById('main-canvas');
    elements.kevlarCanvas = document.getElementById('kevlar-canvas');
    elements.steelCanvas = document.getElementById('steel-canvas');
    elements.cameraModelCanvas = document.getElementById('camera-3d-model');
    elements.spiderEffectContainer = document.getElementById('spider-effect-container');
    // Timeline elements
    elements.timelineBtn = document.getElementById('timeline-btn');
    elements.timelineSection = document.getElementById('timeline-section');
    elements.closeTimelineBtn = document.getElementById('close-timeline-btn');
    elements.timelineCanvas = document.getElementById('timeline-canvas');
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        state.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Window resize
    window.addEventListener('resize', handleResize);

    // Button actions
    if (elements.armorToggleBtn) {
        elements.armorToggleBtn.addEventListener('click', toggleArmor);
    }

    if (elements.ctaArmorBtn) {
        elements.ctaArmorBtn.addEventListener('click', toggleArmor);
    }

    if (elements.gestureToggleBtn) {
        elements.gestureToggleBtn.addEventListener('click', toggleGestureMode);
    }

    if (elements.compareBtn) {
        elements.compareBtn.addEventListener('click', toggleComparison);
    }

    if (elements.closeComparisonBtn) {
        elements.closeComparisonBtn.addEventListener('click', toggleComparison);
    }

    if (elements.eliteAccessBtn) {
        elements.eliteAccessBtn.addEventListener('click', showSecurityPanel);
    }

    if (elements.unlockBtn) {
        elements.unlockBtn.addEventListener('click', handlePasswordSubmit);
    }

    if (elements.passwordInput) {
        elements.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handlePasswordSubmit();
        });
    }

    if (elements.fullscreenBtn) {
        elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Timeline button events
    if (elements.timelineBtn) {
        elements.timelineBtn.addEventListener('click', toggleTimeline);
    }

    if (elements.closeTimelineBtn) {
        elements.closeTimelineBtn.addEventListener('click', toggleTimeline);
    }
}

// ============================================
// RGB Button Effects - Spider Web Click
// ============================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.rgb-glow-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            createSpiderWebEffect(e.clientX, e.clientY);
            createParticleExplosion(btn);
        });
    });
}

// ============================================
// 3D Spider Web Click Effect
// ============================================
function createSpiderWebEffect(x, y) {
    const container = elements.spiderEffectContainer;

    const webWrapper = document.createElement('div');
    webWrapper.className = 'spider-web-effect';
    webWrapper.style.left = x + 'px';
    webWrapper.style.top = y + 'px';

    // Create SVG spider web
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');

    // Add Cosmic gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'rgbGradient');
    gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#7b68ee"/>
        <stop offset="25%" style="stop-color:#e8c547"/>
        <stop offset="50%" style="stop-color:#64d2ff"/>
        <stop offset="75%" style="stop-color:#9d7cbf"/>
        <stop offset="100%" style="stop-color:#7b68ee"/>
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Draw radial lines
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '100');
        line.setAttribute('y1', '100');
        line.setAttribute('x2', 100 + Math.cos(angle) * 100);
        line.setAttribute('y2', 100 + Math.sin(angle) * 100);
        line.setAttribute('class', 'web-line');
        svg.appendChild(line);
    }

    // Draw circular lines
    for (let r = 20; r <= 100; r += 20) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', r);
        circle.setAttribute('class', 'web-line');
        svg.appendChild(circle);
    }

    webWrapper.appendChild(svg);
    container.appendChild(webWrapper);

    // Remove after animation
    setTimeout(() => webWrapper.remove(), 800);
}

// ============================================
// Particle Explosion Effect
// ============================================
function createParticleExplosion(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#7b68ee', '#e8c547', '#64d2ff', '#9d7cbf', '#7b68ee'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('span');
        const color = colors[i % colors.length];

        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
        `;
        document.body.appendChild(particle);

        const angle = (i / 30) * Math.PI * 2;
        const velocity = 150 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = centerX;
        let posY = centerY;
        let opacity = 1;
        let scale = 1;

        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016;
            opacity -= 0.025;
            scale -= 0.015;

            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${Math.max(0, scale)})`;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

// ============================================
// Security System
// ============================================
const PASSWORD = '1234';

function showSecurityPanel() {
    elements.securityPanel.classList.remove('hidden');
    elements.passwordInput.focus();
}

function handlePasswordSubmit() {
    const password = elements.passwordInput.value;

    if (password === PASSWORD) {
        state.isAuthenticated = true;
        elements.securityError.classList.add('hidden');

        // Success animation
        elements.securityPanel.style.animation = 'slideOut 0.5s ease-out forwards';
        createParticleExplosion(elements.unlockBtn);

        setTimeout(() => {
            elements.securityPanel.classList.add('hidden');
            elements.dynamicsPanel.classList.remove('hidden');
            initCameraModel();
        }, 500);
    } else {
        elements.securityError.classList.remove('hidden');
        elements.securityError.textContent = 'ACCESS DENIED - INVALID CODE';
        elements.passwordInput.style.animation = 'shake 0.5s';
        elements.passwordInput.style.borderColor = '#ff4444';

        setTimeout(() => {
            elements.passwordInput.style.animation = '';
            elements.passwordInput.style.borderColor = '';
        }, 500);
    }
}

// ============================================
// 3D Camera Model for Dynamics Panel
// ============================================
function initCameraModel() {
    if (!elements.cameraModelCanvas) return;

    const THREE = window.THREE;

    cameraModelScene = new THREE.Scene();
    cameraModelScene.background = new THREE.Color(0x06020e);

    cameraModelCam = new THREE.PerspectiveCamera(50, elements.cameraModelCanvas.offsetWidth / 80, 0.1, 100);
    cameraModelCam.position.z = 4;

    cameraModelRenderer = new THREE.WebGLRenderer({
        canvas: elements.cameraModelCanvas,
        antialias: true
    });
    cameraModelRenderer.setSize(elements.cameraModelCanvas.offsetWidth, 80);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    cameraModelScene.add(ambient);
    const point = new THREE.PointLight(0xffd700, 2, 100);
    point.position.set(5, 5, 5);
    cameraModelScene.add(point);

    // Create camera model
    camera3DModel = new THREE.Group();

    // Camera body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.6);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xffd700,
        emissiveIntensity: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    camera3DModel.add(body);

    // Camera lens
    const lensGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 32);
    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.2
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 1.1;
    camera3DModel.add(lens);

    // Lens glass
    const glassGeometry = new THREE.CircleGeometry(0.3, 32);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.5
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.x = 1.5;
    glass.rotation.y = Math.PI / 2;
    camera3DModel.add(glass);

    // Viewfinder
    const vfGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.2);
    const viewfinder = new THREE.Mesh(vfGeometry, bodyMaterial);
    viewfinder.position.set(-0.3, 0.55, 0);
    camera3DModel.add(viewfinder);

    // Flash
    const flashGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.15);
    const flashMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.set(0.5, 0.5, 0);
    camera3DModel.add(flash);

    cameraModelScene.add(camera3DModel);

    // Animation loop
    function animateCameraModel() {
        requestAnimationFrame(animateCameraModel);
        camera3DModel.rotation.y += 0.02;
        camera3DModel.rotation.x = Math.sin(performance.now() * 0.001) * 0.2;
        cameraModelRenderer.render(cameraModelScene, cameraModelCam);
    }
    animateCameraModel();
}

// ============================================
// Gesture Mode Toggle
// ============================================
function toggleGestureMode() {
    state.gestureMode = !state.gestureMode;

    if (elements.gestureToggleBtn) {
        if (state.gestureMode) {
            elements.gestureToggleBtn.classList.add('active');
            elements.gestureToggleBtn.querySelector('.btn-text').textContent = 'GESTURE: ON';
            if (elements.gestureNotification) elements.gestureNotification.classList.remove('hidden');
            document.getElementById('gesture-status').textContent = 'ON';
            setTimeout(() => {
                if (elements.gestureNotification) elements.gestureNotification.classList.add('hidden');
            }, 3000);
        } else {
            elements.gestureToggleBtn.classList.remove('active');
            elements.gestureToggleBtn.querySelector('.btn-text').textContent = 'FREE GESTURE';
            document.getElementById('gesture-status').textContent = 'OFF';
        }
    }
}

// ============================================
// Armor Toggle
// ============================================
function toggleArmor() {
    state.armorOpen = !state.armorOpen;
    const armorStatus = document.getElementById('armor-status');
    if (armorStatus) armorStatus.textContent = state.armorOpen ? 'OPEN' : 'CLOSED';
}

// ============================================
// Comparison Toggle
// ============================================
function toggleComparison() {
    state.comparisonOpen = !state.comparisonOpen;

    if (state.comparisonOpen) {
        elements.comparisonSection.classList.remove('hidden');
        initComparisonScenes();
        initBallisticSimulation();

        // Smooth scroll to comparison
        setTimeout(() => {
            elements.comparisonSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        elements.comparisonSection.classList.add('hidden');
    }
}

// ============================================
// Timeline Toggle
// ============================================
let timelineScene, timelineCamera, timelineRenderer;
let timelineGroup, timelineYearMarkers = [];

function toggleTimeline() {
    state.timelineOpen = !state.timelineOpen;

    if (state.timelineOpen) {
        elements.timelineSection.classList.remove('timeline-collapsed');
        initTimelineScene();

        // Smooth scroll to timeline
        setTimeout(() => {
            elements.timelineSection.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    } else {
        elements.timelineSection.classList.add('timeline-collapsed');
    }
}

// ============================================
// 3D Timeline Scene
// ============================================
function initTimelineScene() {
    if (timelineScene) return; // Already initialized

    const THREE = window.THREE;
    const canvas = elements.timelineCanvas;
    if (!canvas) return;

    // Scene
    timelineScene = new THREE.Scene();
    timelineScene.background = new THREE.Color(0x06020e);

    // Camera
    timelineCamera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / 300, 0.1, 1000);
    timelineCamera.position.set(0, 5, 25);
    timelineCamera.lookAt(0, 0, 0);

    // Renderer
    timelineRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    timelineRenderer.setSize(canvas.offsetWidth, 300);
    timelineRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffd700, 0.4);
    timelineScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffd700, 2, 100);
    pointLight1.position.set(20, 10, 10);
    timelineScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffcc, 1.5, 100);
    pointLight2.position.set(-20, -10, 10);
    timelineScene.add(pointLight2);

    // Create timeline group
    timelineGroup = new THREE.Group();

    // Timeline years
    const years = [1965, 1971, 1975, 1988, 2026];
    const yearPositions = [-12, -6, 0, 6, 12];

    // Create year markers (spheres with rings) — full RGB per marker
    years.forEach((year, i) => {
        const markerGroup = new THREE.Group();

        // HSL start hue per marker
        const hBase = i * 0.2;
        const startColor = new THREE.Color().setHSL(hBase, 1, 0.6);

        // Main sphere
        const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: startColor,
            metalness: 0.9,
            roughness: 0.1,
            emissive: startColor,
            emissiveIntensity: 0.6
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        markerGroup.add(sphere);

        // Orbital ring around sphere
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 50);
        const ringColor = new THREE.Color().setHSL((hBase + 0.5) % 1, 1, 0.6);
        const ringMaterial = new THREE.MeshPhysicalMaterial({
            color: ringColor,
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.8,
            emissive: ringColor,
            emissiveIntensity: 0.4
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        markerGroup.add(ring);

        // Position marker
        markerGroup.position.x = yearPositions[i];
        markerGroup.userData = { year, baseY: 0, index: i, ring, hBase };

        timelineGroup.add(markerGroup);
        timelineYearMarkers.push(markerGroup);
    });

    // Connecting line between markers
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array([
        yearPositions[0], 0, 0,
        yearPositions[yearPositions.length - 1], 0, 0
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.7,
        vertexColors: false
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.userData = { isTimeline: true };
    timelineGroup.add(line);

    // Add decorative outer rings
    for (let i = 0; i < 3; i++) {
        const bigRingGeometry = new THREE.TorusGeometry(15 + i * 3, 0.03, 16, 100);
        const bigRingMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(i * 0.3, 1, 0.5),
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.3,
            emissive: new THREE.Color().setHSL(i * 0.3, 1, 0.5),
            emissiveIntensity: 0.4
        });
        const bigRing = new THREE.Mesh(bigRingGeometry, bigRingMaterial);
        bigRing.rotation.x = Math.PI / 2 + (i * 0.15);
        bigRing.rotation.z = i * 0.2;
        bigRing.userData = { rotationSpeed: 0.002 * (i + 1) };
        timelineGroup.add(bigRing);
    }

    // Add particles
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 50;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        const color = Math.random() > 0.5 ? new THREE.Color(0xffd700) : new THREE.Color(0x00ffcc);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const timelineParticles = new THREE.Points(particlesGeometry, particleMaterial);
    timelineGroup.add(timelineParticles);

    timelineScene.add(timelineGroup);

    // Animation loop
    function animateTimeline() {
        if (!state.timelineOpen) return;
        requestAnimationFrame(animateTimeline);

        const time = performance.now() * 0.001;

        // Animate year markers — RGB color cycling per marker
        timelineYearMarkers.forEach((marker, i) => {
            marker.position.y = Math.sin(time * 1.5 + i * 0.5) * 0.5;
            marker.rotation.y += 0.01;
            if (marker.userData.ring) {
                marker.userData.ring.rotation.z += 0.02;
                // RGB cycle on ring
                const rh = (marker.userData.hBase + time * 0.08 + i * 0.2) % 1;
                const rc = new THREE.Color().setHSL(rh, 1, 0.6);
                marker.userData.ring.material.color.set(rc);
                marker.userData.ring.material.emissive.set(rc);
            }
            // RGB cycle on sphere
            const sphere = marker.children[0];
            if (sphere && sphere.material) {
                const sh = (marker.userData.hBase + time * 0.1 + i * 0.2) % 1;
                const sc = new THREE.Color().setHSL(sh, 1, 0.6);
                sphere.material.color.set(sc);
                sphere.material.emissive.set(sc);
                sphere.material.emissiveIntensity = 0.6 + Math.sin(time * 3 + i) * 0.2;
            }
        });

        // Animate outer rings + connecting line
        timelineGroup.children.forEach(child => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
                // RGB on outer rings
                const rh = (time * 0.05 + child.userData.rotationSpeed * 20) % 1;
                const rc = new THREE.Color().setHSL(rh, 1, 0.5);
                if (child.material) { child.material.color.set(rc); child.material.emissive.set(rc); }
            }
            if (child.userData && child.userData.isTimeline) {
                const lh = (time * 0.12) % 1;
                if (child.material) child.material.color.setHSL(lh, 1, 0.6);
            }
        });

        // Rotate entire group slightly
        timelineGroup.rotation.y = Math.sin(time * 0.2) * 0.1;

        // Update year display (User requested animated counter back)
        const yearDisplay = document.getElementById('timeline-year-display');
        if (yearDisplay) {
            const progress = (Math.sin(time * 0.5) + 1) * 0.5;
            const currentYear = 1965 + Math.floor(progress * 61.99); // 61.99 ensures it cleanly hits 2026
            yearDisplay.textContent = currentYear;
        }

        timelineRenderer.render(timelineScene, timelineCamera);
    }

    animateTimeline();
}

// ============================================
// Fullscreen Toggle
// ============================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ============================================
// Handle Window Resize
// ============================================
function handleResize() {
    if (bgCamera && bgRenderer) {
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        if (bgComposer) bgComposer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ============================================
// SPIDER WEB PURPLE BACKGROUND ENGINE
// ============================================
let bgScene, bgCamera, bgRenderer, bgComposer, bgClock, bgT = 0;
const bgMouse = { x: 0, y: 0, tx: 0, ty: 0 };
let bgFpsFrames = 0, bgFpsLast = performance.now(), bgCurrentFps = 0;
let bgPanelOpen = false;
// webGroup declared at top with fiberGroup

function initKevlarBg() {
    const THREE = window.THREE;
    const canvas = document.getElementById('cvs');
    if (!canvas || !THREE) return;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    bgScene = new THREE.Scene();
    bgScene.fog = new THREE.FogExp2(0x06020e, 0.016);

    bgCamera = new THREE.PerspectiveCamera(65, W() / H(), 0.1, 500);
    bgCamera.position.set(0, 0, 28);

    bgRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    bgRenderer.setSize(W(), H());
    bgRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    bgRenderer.setClearColor(0x06020e);
    bgRenderer.outputEncoding = THREE.sRGBEncoding;
    bgRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    bgRenderer.toneMappingExposure = 0.9;

    try {
        bgComposer = new THREE.EffectComposer(bgRenderer);
        bgComposer.addPass(new THREE.RenderPass(bgScene, bgCamera));
        bgComposer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(W(), H()), 1.8, 0.6, 0.1));
    } catch (e) { bgComposer = null; }

    bgClock = new THREE.Clock();
    bgScene.add(new THREE.AmbientLight(0x100418, 0.5));

    window.addEventListener('mousemove', e => {
        bgMouse.tx = (e.clientX / W() - 0.5) * 2;
        bgMouse.ty = -(e.clientY / H() - 0.5) * 2;
    });

    // ── Build Spider Web ──
    webGroup = new THREE.Group();

    const WEB_LAYERS = 3; // multiple webs at different depths
    const RADIALS = 16;   // radial strands per web
    const RINGS = 7;      // concentric rings per web

    const webColors = [
        { strand: 0xaa44ff, ring: 0x8822dd },
        { strand: 0x9933ee, ring: 0x6611bb },
        { strand: 0xcc66ff, ring: 0xaa33ee }
    ];

    for (let layer = 0; layer < WEB_LAYERS; layer++) {
        const col = webColors[layer];
        const scale = 1 - layer * 0.22;
        const depth = -layer * 8;
        const layerGroup = new THREE.Group();
        layerGroup.position.z = depth;
        layerGroup.rotation.z = (layer * Math.PI) / WEB_LAYERS;

        const strandMat = new THREE.LineBasicMaterial({
            color: col.strand, transparent: true,
            opacity: 0.55 - layer * 0.12,
            blending: THREE.AdditiveBlending
        });
        const ringMat = new THREE.LineBasicMaterial({
            color: col.ring, transparent: true,
            opacity: 0.45 - layer * 0.1,
            blending: THREE.AdditiveBlending
        });

        const webRadius = 22 * scale;

        // Radial strands
        for (let r = 0; r < RADIALS; r++) {
            const angle = (r / RADIALS) * Math.PI * 2;
            const pts = [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(Math.cos(angle) * webRadius, Math.sin(angle) * webRadius, 0)
            ];
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            layerGroup.add(new THREE.Line(geo, strandMat));
        }

        // Concentric rings (slightly irregular for organic feel)
        for (let ring = 1; ring <= RINGS; ring++) {
            const rr = (ring / RINGS) * webRadius;
            const ringPts = [];
            const RING_SEGS = RADIALS;
            for (let s = 0; s <= RING_SEGS; s++) {
                const angle = (s / RING_SEGS) * Math.PI * 2;
                // Slight organic wobble
                const wobble = 1 + (Math.sin(angle * 3 + layer) * 0.04);
                ringPts.push(new THREE.Vector3(
                    Math.cos(angle) * rr * wobble,
                    Math.sin(angle) * rr * wobble,
                    0
                ));
            }
            const geo = new THREE.BufferGeometry().setFromPoints(ringPts);
            layerGroup.add(new THREE.Line(geo, ringMat));
        }

        // Dew drops (glowing spheres at intersections)
        const dewGeo = new THREE.SphereGeometry(0.09, 8, 8);
        for (let ring = 1; ring <= RINGS; ring += 2) {
            const rr = (ring / RINGS) * webRadius;
            for (let r = 0; r < RADIALS; r += 2) {
                const angle = (r / RADIALS) * Math.PI * 2;
                const dewMat = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    emissive: new THREE.Color(col.strand),
                    emissiveIntensity: 2.5 + Math.random() * 1.5,
                    metalness: 0.9, roughness: 0.05,
                    transparent: true, opacity: 0.8
                });
                const dew = new THREE.Mesh(dewGeo, dewMat);
                dew.position.set(Math.cos(angle) * rr, Math.sin(angle) * rr, 0.1);
                dew.userData.baseIntensity = 2.5 + Math.random() * 1.5;
                dew.userData.phase = Math.random() * Math.PI * 2;
                layerGroup.add(dew);
            }
        }

        // Center hub
        const hubGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const hubMat = new THREE.MeshStandardMaterial({
            color: 0x000000, emissive: new THREE.Color(col.strand),
            emissiveIntensity: 4, metalness: 0.9, roughness: 0.05
        });
        layerGroup.add(new THREE.Mesh(hubGeo, hubMat));

        webGroup.add(layerGroup);
    }

    bgScene.add(webGroup);

    // ── Purple Particles ──
    const PT_N = 6000;
    const ptPos = new Float32Array(PT_N * 3);
    const ptVel = new Float32Array(PT_N * 3);
    const ptSz = new Float32Array(PT_N);
    for (let i = 0; i < PT_N; i++) {
        ptPos[i * 3] = (Math.random() - .5) * 120;
        ptPos[i * 3 + 1] = (Math.random() - .5) * 80;
        ptPos[i * 3 + 2] = (Math.random() - .5) * 80 - 15;
        ptVel[i * 3] = (Math.random() - .5) * .006;
        ptVel[i * 3 + 1] = (Math.random() - .5) * .004;
        ptVel[i * 3 + 2] = (Math.random() - .5) * .003;
        ptSz[i] = .4 + Math.random() * 2;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
    ptGeo.setAttribute('aSize', new THREE.BufferAttribute(ptSz, 1));
    const ptMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
            attribute float aSize; uniform float uTime; varying float vH;
            void main(){
                vH = fract(position.x*.008 + position.y*.011 + uTime*.025);
                vec4 mv = modelViewMatrix * vec4(position, 1.);
                gl_PointSize = aSize * (260. / -mv.z);
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: `
            varying float vH;
            void main(){
                float d = length(gl_PointCoord - .5) * 2.;
                float a = (1. - smoothstep(.0, .85, d)) * .7;
                if(a < .01) discard;
                // Purple/violet hue range 0.7–0.85
                float h = 0.70 + vH * 0.15;
                float s = 1.0; float l = 0.58;
                float c=(1.-abs(2.*l-1.))*s, x=c*(1.-abs(mod(h*6.,2.)-1.)), m=l-c*.5;
                vec3 rgb;
                if(h<.833) rgb=vec3(x,0,c)+m; else rgb=vec3(c,0,x)+m;
                gl_FragColor = vec4(rgb, a);
            }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });
    webParticles = new THREE.Points(ptGeo, ptMat);
    webParticlePositions = ptPos;
    webParticleVelocities = ptVel;
    bgScene.add(webParticles);

    // ── Stars ──
    {
        const N = 2000, sp = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            sp[i * 3] = (Math.random() - .5) * 600;
            sp[i * 3 + 1] = (Math.random() - .5) * 500;
            sp[i * 3 + 2] = (Math.random() - .5) * 300 - 100;
        }
        const sg = new THREE.BufferGeometry();
        sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
        bgScene.add(new THREE.Points(sg, new THREE.PointsMaterial({
            color: 0xddaaff, size: 0.18, transparent: true, opacity: 0.5,
            blending: THREE.AdditiveBlending, depthWrite: false
        })));
    }

    function bgAnimate() {
        requestAnimationFrame(bgAnimate);
        const dt = Math.min(bgClock.getDelta(), .04);
        bgT += dt;

        bgMouse.x += (bgMouse.tx - bgMouse.x) * .04;
        bgMouse.y += (bgMouse.ty - bgMouse.y) * .04;

        // Camera drift
        const cx = Math.sin(bgT * .03) * 2 + bgMouse.x * 3;
        const cy = Math.sin(bgT * .02) * 1.2 + bgMouse.y * 2;
        const cz = 28 + Math.sin(bgT * .015) * 2;
        bgCamera.position.x += (cx - bgCamera.position.x) * .025;
        bgCamera.position.y += (cy - bgCamera.position.y) * .025;
        bgCamera.position.z += (cz - bgCamera.position.z) * .015;
        bgCamera.lookAt(0, 0, -5);

        // Slowly rotate web layers
        if (webGroup) {
            webGroup.children.forEach((layer, i) => {
                layer.rotation.z += 0.0008 * (i % 2 === 0 ? 1 : -1);
                // Pulse dew drops
                layer.children.forEach(child => {
                    if (child.userData.baseIntensity !== undefined && child.material) {
                        child.material.emissiveIntensity = child.userData.baseIntensity
                            + Math.sin(bgT * 2.5 + child.userData.phase) * 1.2;
                    }
                });
            });
        }

        // Update particles
        const PT_N2 = webParticlePositions.length / 3;
        for (let i = 0; i < PT_N2; i++) {
            webParticlePositions[i * 3] += webParticleVelocities[i * 3];
            webParticlePositions[i * 3 + 1] += webParticleVelocities[i * 3 + 1];
            webParticlePositions[i * 3 + 2] += webParticleVelocities[i * 3 + 2];
            if (Math.abs(webParticlePositions[i * 3]) > 60) webParticleVelocities[i * 3] *= -1;
            if (Math.abs(webParticlePositions[i * 3 + 1]) > 40) webParticleVelocities[i * 3 + 1] *= -1;
            if (Math.abs(webParticlePositions[i * 3 + 2] + 15) > 40) webParticleVelocities[i * 3 + 2] *= -1;
        }
        ptGeo.attributes.position.needsUpdate = true;
        ptMat.uniforms.uTime.value = bgT;

        // FPS
        bgFpsFrames++;
        const now = performance.now();
        if (now - bgFpsLast >= 600) {
            bgCurrentFps = Math.round(bgFpsFrames / ((now - bgFpsLast) / 1000));
            bgFpsFrames = 0; bgFpsLast = now;
            const fpsBadge = document.getElementById('fps-num');
            if (fpsBadge) fpsBadge.textContent = bgCurrentFps;
        }

        // HUD — always update for live animations
        {
            const $ = id => document.getElementById(id);
            const cx = bgCamera.position.x, cy = bgCamera.position.y, cz = bgCamera.position.z;
            const hcx = $('hcx'); if (hcx) hcx.textContent = cx.toFixed(3);
            const hcy = $('hcy'); if (hcy) hcy.textContent = cy.toFixed(3);
            const hcz = $('hcz'); if (hcz) hcz.textContent = cz.toFixed(3);
            const fps = bgCurrentFps || 60;
            const hfps = $('hfps'); if (hfps) hfps.textContent = fps;
            const fpsArc = $('fps-arc');
            if (fpsArc) { const off = Math.max(0, 157 - (fps / 75) * 157); fpsArc.setAttribute('stroke-dashoffset', off.toFixed(1)); }
            const fi = (99.1 + Math.sin(bgT * .7) * .9);
            const hfi = $('hfi'); if (hfi) hfi.textContent = fi.toFixed(0) + '%';
            const ptCount = 6000 + Math.floor(Math.sin(bgT * .4) * 200 + 200);
            const hpt = $('hpt'); if (hpt) hpt.textContent = (ptCount / 1000).toFixed(1) + 'K';
            const hbar = $('hbar'); if (hbar) hbar.style.width = (84 + Math.sin(bgT * .35) * 9).toFixed(1) + '%';
            const ss = Math.floor(bgT);
            const hts = $('hts'); if (hts) hts.textContent = '00:' + String(Math.floor(ss / 60)).padStart(2, '0') + ':' + String(ss % 60).padStart(2, '0');
        }

        if (bgComposer) bgComposer.render();
        else bgRenderer.render(bgScene, bgCamera);
    }
    bgAnimate();

    window.addEventListener('resize', () => {
        bgCamera.aspect = W() / H();
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(W(), H());
        if (bgComposer) bgComposer.setSize(W(), H());
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const outer = document.createElement('div');
    outer.className = 'cursor-outer';
    outer.id = 'cursor-outer';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    inner.className = 'cursor-inner';
    inner.id = 'cursor-inner';
    document.body.appendChild(inner);

    // Trail elements
    const trails = [];
    for (let i = 0; i < 4; i++) {
        const t = document.createElement('div');
        t.className = 'cursor-trail';
        t.style.opacity = (1 - i / 6) * 0.6;
        t.style.width = (5 - i * 0.6) + 'px';
        t.style.height = (5 - i * 0.6) + 'px';
        document.body.appendChild(t);
        trails.push({ el: t, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    const trailHistory = Array(5).fill({ x: 0, y: 0 });

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        inner.style.left = mouseX + 'px';
        inner.style.top = mouseY + 'px';
        trailHistory.unshift({ x: mouseX, y: mouseY });
        trailHistory.pop();
    });

    // Cursor expand on hover over buttons/links
    document.addEventListener('mouseover', e => {
        if (e.target.closest('button, a, .rgb-glow-btn, .spec-category, .module-card')) {
            outer.style.width = '52px';
            outer.style.height = '52px';
            outer.style.borderColor = 'rgba(232, 197, 71, 0.9)';
            outer.style.boxShadow = '0 0 20px rgba(232, 197, 71, 0.7)';
        }
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest('button, a, .rgb-glow-btn, .spec-category, .module-card')) {
            outer.style.width = '';
            outer.style.height = '';
            outer.style.borderColor = '';
            outer.style.boxShadow = '';
        }
    });

    function animateCursor() {
        outerX += (mouseX - outerX) * 0.12;
        outerY += (mouseY - outerY) * 0.12;
        outer.style.left = outerX + 'px';
        outer.style.top = outerY + 'px';

        trails.forEach((t, i) => {
            const lag = i + 1;
            const h = trailHistory[Math.min(lag * 1, trailHistory.length - 1)];
            if (h) {
                t.x += (h.x - t.x) * 0.2;
                t.y += (h.y - t.y) * 0.2;
                t.el.style.left = t.x + 'px';
                t.el.style.top = t.y + 'px';
            }
        });
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// ============================================
// SHOCKWAVE CLICK EFFECT (replaces spider web)
// ============================================
function createSpiderWebEffect(x, y) {
    // Now creates a cinematic shockwave instead
    const colors = ['#c084fc', '#9333ea', '#e8c547', '#7b68ee'];
    const RINGS = 4;

    for (let r = 0; r < RINGS; r++) {
        const ring = document.createElement('div');
        const delay = r * 60;
        const size = 40 + r * 30;
        const color = colors[r % colors.length];

        ring.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid ${color};
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 12px ${color}, inset 0 0 8px ${color};
            animation: shockwaveRing 0.7s ${delay}ms cubic-bezier(0, 0.5, 0.5, 1) forwards;
        `;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 800 + delay);
    }

    // Central burst flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 20px #c084fc, 0 0 40px #7b68ee;
        animation: flashBurst 0.4s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);

    // Energy sparks
    for (let s = 0; s < 10; s++) {
        const spark = document.createElement('div');
        const angle = (s / 10) * Math.PI * 2;
        const len = 20 + Math.random() * 30;
        spark.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 2px;
            height: ${len}px;
            background: linear-gradient(to bottom, #c084fc, transparent);
            transform: translate(-50%, -100%) rotate(${angle}rad);
            transform-origin: bottom center;
            pointer-events: none;
            z-index: 9997;
            animation: sparkFly 0.5s ease-out forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 500);
    }
}

// ============================================
// SPECS SECTION — NVIDIA CEO LEVEL
// ============================================
// Spec value fill percentages (for mini bars)
const SPEC_FILLS = {
    '1.44 g/cm³': 60, '3,620 MPa': 98, '112 GPa': 94,
    '3.6%': 36, '427°C': 85, 'IIIA+': 99, '490 m/s': 96,
    '.44 Magnum': 88, '<44mm': 72, '6+ rounds': 90,
    '✓': 100
};

function getDataStream(idx) {
    const streams = [
        'SIG:0xA4F2 // DENSITY:1440 // MODULE:ELASTIC // STATE:NOMINAL',
        'NIJ:IIIA // V50:490 // MULTI-HIT:6+ // CERT:ACTIVE',
        'APP:BALLISTIC // MIL-SPEC:YES // NASA:APPROVED // CLASS:ELITE'
    ];
    return streams[idx % streams.length];
}

function initSpecsHolo() {
    document.querySelectorAll('.spec-category').forEach((card, idx) => {
        // Canvas for particle field
        const canvas = document.createElement('canvas');
        canvas.className = 'spec-particle-canvas';
        canvas.id = `spec-canvas-${idx}`;
        card.insertBefore(canvas, card.firstChild);

        // Scan line
        const scan = document.createElement('div');
        scan.className = 'spec-scanline';
        scan.style.animationDelay = `${idx * 1.1}s`;
        card.appendChild(scan);

        // Corner brackets
        ['tl', 'tr', 'bl', 'br'].forEach(pos => {
            const corner = document.createElement('div');
            corner.className = `spec-corner ${pos}`;
            corner.style.animationDelay = `${idx * 0.3 + (pos === 'tr' ? 0.2 : pos === 'bl' ? 0.4 : pos === 'br' ? 0.6 : 0)}s`;
            card.appendChild(corner);
        });

        // Data stream at bottom
        const ds = document.createElement('div');
        ds.className = 'spec-data-stream';
        ds.textContent = getDataStream(idx);
        card.appendChild(ds);

        // Wrap spec values in val-wrap + add mini bars
        card.querySelectorAll('.spec-item').forEach((item, i) => {
            const valEl = item.querySelector('.spec-value');
            if (!valEl) return;

            const wrap = document.createElement('div');
            wrap.className = 'spec-val-wrap';

            const minibar = document.createElement('div');
            minibar.className = 'spec-minibar';
            const fill = document.createElement('div');
            fill.className = 'spec-minibar-fill';
            const pct = SPEC_FILLS[valEl.textContent.trim()] || (50 + Math.random() * 40);
            fill.style.width = pct + '%';
            fill.style.animationDelay = `${idx * 0.3 + i * 0.1 + 0.5}s`;
            minibar.appendChild(fill);

            item.removeChild(valEl);
            wrap.appendChild(valEl);
            wrap.appendChild(minibar);
            item.appendChild(wrap);
        });

        // Init particle canvas
        initSpecCanvas(canvas, idx);
    });

    // 3D Tilt on hover
    document.querySelectorAll('.spec-category').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
            card.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(16px) scale(1.02)`;
            card.style.boxShadow = `0 0 40px rgba(192, 132, 252, 0.25), ${x * -8}px ${y * -8}px 30px rgba(123, 104, 238, 0.15)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease';
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    // Stagger entrance
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.spec-category').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotateX(10deg)';
        card.style.transition = `opacity 0.8s ${i * 0.2}s ease, transform 0.8s ${i * 0.2}s cubic-bezier(0.16,1,0.3,1)`;
        observer.observe(card);
    });

    // Value flicker
    function flickerValues() {
        const values = document.querySelectorAll('.spec-value');
        if (!values.length) return;
        const target = values[Math.floor(Math.random() * values.length)];
        const original = target.textContent;
        const chars = '0123456789ABCDEF.×';
        let ticks = 0;
        const tick = () => {
            if (ticks < 6) {
                target.textContent = original.split('').map(c =>
                    /[0-9A-Za-z]/.test(c) ? chars[Math.floor(Math.random() * chars.length)] : c
                ).join('');
                target.classList.add('glitch-active');
                ticks++;
                setTimeout(tick, 50);
            } else {
                target.textContent = original;
                target.classList.remove('glitch-active');
            }
        };
        tick();
    }
    setInterval(flickerValues, 1600);

    // Hover particles on values
    document.querySelectorAll('.spec-value').forEach(val => {
        val.addEventListener('mouseenter', () => emitValueParticles(val));
    });
}

function initSpecCanvas(canvas, idx) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 300;

    const hues = [270, 290, 260]; // purple range
    const hue = hues[idx % hues.length];

    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
            phase: Math.random() * Math.PI * 2
        });
    }

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.016;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            const a = (p.alpha + Math.sin(t * 2 + p.phase) * 0.15);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue + Math.sin(t + p.phase) * 20}, 100%, 70%, ${a})`;
            ctx.fill();
        });

        // Connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 60) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${(1 - dist / 60) * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
}

// ============================================
// Update Dynamics Panel
// ============================================
function updateDynamicsPanel() {
    if (!state.isAuthenticated) return;

    const camX = document.getElementById('cam-x');
    const camY = document.getElementById('cam-y');
    const camZ = document.getElementById('cam-z');
    const camFov = document.getElementById('cam-fov');
    const camRot = document.getElementById('cam-rot');
    const fpsCounter = document.getElementById('fps-counter');
    const particleCount = document.getElementById('particle-count');
    const fiberCount = document.getElementById('fiber-count');

    if (bgCamera) {
        if (camX) camX.textContent = bgCamera.position.x.toFixed(3);
        if (camY) camY.textContent = bgCamera.position.y.toFixed(3);
        if (camZ) camZ.textContent = bgCamera.position.z.toFixed(3);
        if (camFov) camFov.textContent = bgCamera.fov.toFixed(0) + '°';
        if (camRot) camRot.textContent = bgCamera.rotation.y.toFixed(3);
    }
    if (fpsCounter) fpsCounter.textContent = bgCurrentFps || state.fps;
    if (particleCount) particleCount.textContent = '8000';
    if (fiberCount) fiberCount.textContent = '7';

    // Update hero section data
    const mouseX = document.getElementById('mouse-x');
    const mouseY = document.getElementById('mouse-y');
    if (mouseX) mouseX.textContent = state.mousePos.x.toFixed(2);
    if (mouseY) mouseY.textContent = state.mousePos.y.toFixed(2);
}

// ============================================
// Animate Counters
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ============================================
// Comparison Scenes (Kevlar vs Steel)
// ============================================
function initComparisonScenes() {
    if (kevlarScene) return;

    const THREE = window.THREE;

    // Kevlar Scene
    kevlarScene = new THREE.Scene();
    kevlarScene.background = new THREE.Color(0x06020e);

    kevlarCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    kevlarCamera.position.z = 6;

    kevlarRenderer = new THREE.WebGLRenderer({
        canvas: elements.kevlarCanvas,
        antialias: true
    });
    kevlarRenderer.setSize(elements.kevlarCanvas.offsetWidth, 250);

    // Add lighting to Kevlar scene
    const kevlarAmbient = new THREE.AmbientLight(0xffd700, 0.5);
    kevlarScene.add(kevlarAmbient);
    const kevlarPoint = new THREE.PointLight(0xffd700, 2, 50);
    kevlarPoint.position.set(5, 5, 5);
    kevlarScene.add(kevlarPoint);

    // Create Kevlar model - woven fiber structure
    kevlarModel = new THREE.Group();

    const kevlarFiberMat = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 0.85,
        roughness: 0.15,
        emissive: 0xffd700,
        emissiveIntensity: 0.3
    });

    // Create woven pattern
    for (let x = -3; x <= 3; x++) {
        for (let y = -3; y <= 3; y++) {
            const isHorizontal = (x + y) % 2 === 0;
            const fiberGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
            const fiber = new THREE.Mesh(fiberGeometry, kevlarFiberMat.clone());

            if (isHorizontal) {
                fiber.rotation.z = Math.PI / 2;
                fiber.position.set(x * 0.4, y * 0.4, Math.sin(x) * 0.1);
            } else {
                fiber.position.set(x * 0.4, y * 0.4, Math.cos(y) * 0.1);
            }

            fiber.userData = { x, y };
            kevlarModel.add(fiber);
        }
    }

    kevlarScene.add(kevlarModel);

    // Steel Scene
    steelScene = new THREE.Scene();
    steelScene.background = new THREE.Color(0x06020e);

    steelCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    steelCamera.position.z = 6;

    steelRenderer = new THREE.WebGLRenderer({
        canvas: elements.steelCanvas,
        antialias: true
    });
    steelRenderer.setSize(elements.steelCanvas.offsetWidth, 250);

    // Add lighting to Steel scene
    const steelAmbient = new THREE.AmbientLight(0x666666, 0.5);
    steelScene.add(steelAmbient);
    const steelPoint = new THREE.PointLight(0xaaaaaa, 1.5, 50);
    steelPoint.position.set(5, 5, 5);
    steelScene.add(steelPoint);

    // Create Steel model - solid heavy block
    steelModel = new THREE.Group();

    const steelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x555555,
        metalness: 0.95,
        roughness: 0.25,
        emissive: 0x333333,
        emissiveIntensity: 0.1
    });

    // Main steel block
    const blockGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.8);
    const block = new THREE.Mesh(blockGeometry, steelMaterial);
    steelModel.add(block);

    // Add rivets
    const rivetGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12);
    const rivetMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x444444,
        metalness: 1,
        roughness: 0.3
    });

    const rivetPositions = [[-0.9, -0.9], [-0.9, 0.9], [0.9, -0.9], [0.9, 0.9]];
    rivetPositions.forEach(pos => {
        const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
        rivet.rotation.x = Math.PI / 2;
        rivet.position.set(pos[0], pos[1], 0.45);
        steelModel.add(rivet);
    });

    // Add scratch marks
    const scratchMaterial = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 5; i++) {
        const points = [
            new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, 0.41),
            new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, 0.41)
        ];
        const scratchGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const scratch = new THREE.Line(scratchGeometry, scratchMaterial);
        steelModel.add(scratch);
    }

    steelScene.add(steelModel);

    // Animation loop for comparison
    function animateComparison() {
        requestAnimationFrame(animateComparison);

        if (kevlarModel) {
            kevlarModel.rotation.y += 0.01;
            kevlarModel.rotation.x = Math.sin(performance.now() * 0.001) * 0.15;
        }

        if (steelModel) {
            steelModel.rotation.y += 0.008;
            steelModel.rotation.x = Math.sin(performance.now() * 0.001 + 1) * 0.1;
        }

        kevlarRenderer.render(kevlarScene, kevlarCamera);
        steelRenderer.render(steelScene, steelCamera);
    }

    animateComparison();
}


// ============================================
// ████  BALLISTIC SIMULATION INTERACTIVE  ████
// ============================================
let ballisticInited = false;
let ballisticAnimating = false;
let bKevlarCtx, bSteelCtx;

function initBallisticSimulation() {
    if (ballisticInited) return;

    const kCan = document.getElementById('kevlar-impact-canvas');
    const sCan = document.getElementById('steel-impact-canvas');
    if (!kCan || !sCan) return;

    kCan.width = 260; kCan.height = 260;
    sCan.width = 260; sCan.height = 260;
    bKevlarCtx = kCan.getContext('2d');
    bSteelCtx = sCan.getContext('2d');

    drawKevlarIdle(bKevlarCtx);
    drawSteelIdle(bSteelCtx);

    const btn = document.getElementById('test-impact-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!ballisticAnimating) launchBallisticTest();
        });
    }

    ballisticInited = true;
}

// ─────────────────── IDLE STATES ───────────────────

function drawKevlarIdle(ctx) {
    const W = 260, H = 260;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#010d07';
    ctx.fillRect(0, 0, W, H);
    drawKevlarGrid(ctx, 0, 130, 130, 0);   // undisturbed
    // "ready" label
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(0,255,150,0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('AWAITING IMPACT TEST', W / 2, H - 12);
}

function drawSteelIdle(ctx) {
    const W = 260, H = 260;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#12121c');
    bg.addColorStop(1, '#080808');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    drawSteelPlate(ctx, W / 2, H / 2, 0);
    ctx.font = '10px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(180,180,180,0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('AWAITING IMPACT TEST', W / 2, H - 12);
}

// ─────────────────── KEVLAR GRID ───────────────────

function drawKevlarGrid(ctx, t_impact, cx, cy, impactAge) {
    const W = 260, H = 260;
    const sp = 16;

    for (let x = 0; x <= W; x += sp) {
        ctx.beginPath();
        for (let yy = 0; yy <= H; yy += 3) {
            const [dx, dy] = fiberDisplace(x, yy, cx, cy, impactAge);
            const bright = fiberBright(x, yy, cx, cy, impactAge);
            ctx.strokeStyle = `rgba(0,255,140,${bright})`;
            ctx.lineWidth = 0.9;
            if (yy === 0) ctx.moveTo(x + dx, yy + dy);
            else ctx.lineTo(x + dx, yy + dy);
        }
        ctx.stroke();
    }

    for (let y = 0; y <= H; y += sp) {
        ctx.beginPath();
        for (let xx = 0; xx <= W; xx += 3) {
            const [dx, dy] = fiberDisplace(xx, y, cx, cy, impactAge);
            const bright = fiberBright(xx, y, cx, cy, impactAge);
            ctx.strokeStyle = `rgba(0,255,140,${bright})`;
            ctx.lineWidth = 0.9;
            if (xx === 0) ctx.moveTo(xx + dx, y + dy);
            else ctx.lineTo(xx + dx, y + dy);
        }
        ctx.stroke();
    }

    // diagonal secondary threads
    const dsp = sp * 2;
    for (let i = -H; i <= W + H; i += dsp) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,210,0,0.08)`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(i, 0);
        ctx.lineTo(i + H, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i, H);
        ctx.lineTo(i + H, 0);
        ctx.stroke();
    }
}

function fiberDisplace(x, y, cx, cy, age) {
    if (age <= 0) return [0, 0];
    const dist = Math.hypot(x - cx, y - cy);
    const wave = Math.sin(dist * 0.18 - age * 4) * Math.exp(-age * 0.5) * 7;
    const deform = Math.exp(-dist * 0.045) * Math.min(age * 8, 10);
    const nx = (x - cx) / (dist || 1);
    const ny = (y - cy) / (dist || 1);
    return [nx * (wave + deform * 0.3), ny * (wave + deform * 0.3)];
}

function fiberBright(x, y, cx, cy, age) {
    const dist = Math.hypot(x - cx, y - cy);
    if (age <= 0) return 0.28;
    const pulse = Math.exp(-dist * 0.06) * Math.exp(-age * 0.4) * 0.7;
    return Math.min(1, 0.25 + pulse);
}

// ─────────────────── STEEL PLATE ───────────────────

function drawSteelPlate(ctx, cx, cy, holeR) {
    const pW = 220, pH = 60;
    const px = cx - pW / 2, py = cy - pH / 2;

    const pg = ctx.createLinearGradient(px, py, px + pW, py + pH);
    pg.addColorStop(0, '#484848');
    pg.addColorStop(0.25, '#9e9e9e');
    pg.addColorStop(0.5, '#c0c0c0');
    pg.addColorStop(0.75, '#909090');
    pg.addColorStop(1, '#404040');
    ctx.fillStyle = pg;
    ctx.fillRect(px, py, pW, pH);

    // Grain lines
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.03 + i * 0.008})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(px, py + i * (pH / 10));
        ctx.lineTo(px + pW, py + i * (pH / 10));
        ctx.stroke();
    }

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pW, pH);

    // Punch hole
    if (holeR > 0) {
        // Torn metal glow
        const rg = ctx.createRadialGradient(cx, cy, holeR * 0.6, cx, cy, holeR + 14);
        rg.addColorStop(0, 'rgba(255,120,0,0.85)');
        rg.addColorStop(0.5, 'rgba(200,60,0,0.4)');
        rg.addColorStop(1, 'rgba(80,20,0,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(cx, cy, holeR + 14, 0, Math.PI * 2);
        ctx.fill();

        // Crack rays
        const nCracks = 10;
        for (let i = 0; i < nCracks; i++) {
            const ang = (i / nCracks) * Math.PI * 2;
            const cLen = Math.min(50, holeR * 2.2);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,80,0,${0.6 - cLen / 120})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(cx + Math.cos(ang) * holeR, cy + Math.sin(ang) * holeR);
            ctx.lineTo(cx + Math.cos(ang) * (holeR + cLen), cy + Math.sin(ang) * (holeR + cLen));
            ctx.stroke();
        }

        // Black hole centre
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // Rim
        ctx.beginPath();
        ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,150,50,0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// ─────────────────── BULLET DRAW ───────────────────

function drawBullet(ctx, x, y, glowing) {
    ctx.save();
    ctx.translate(x, y);

    if (glowing) {
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
        g.addColorStop(0, 'rgba(255,140,0,0.6)');
        g.addColorStop(1, 'rgba(255,50,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
    }

    // casing
    ctx.fillStyle = '#c8a900';
    ctx.beginPath();
    ctx.ellipse(0, 4, 5, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // tip
    ctx.fillStyle = '#ffe040';
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, -14);
    ctx.closePath();
    ctx.fill();

    // highlight
    ctx.fillStyle = 'rgba(255,255,200,0.4)';
    ctx.beginPath();
    ctx.ellipse(-1.5, -2, 1.5, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ─────────────────── SPARK SYSTEM ───────────────────

function spawnSparks(n, cx, cy) {
    const sparks = [];
    for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 140;
        sparks.push({
            x: cx, y: cy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 60,
            life: 1,
            size: 1.5 + Math.random() * 2
        });
    }
    return sparks;
}

function tickSparks(sparks, dt) {
    sparks.forEach(s => {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 250 * dt;      // gravity
        s.life -= dt * 0.6;
    });
    return sparks.filter(s => s.life > 0);
}

function drawSparks(ctx, sparks) {
    sparks.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${Math.floor(180 * s.life)},0,${s.life})`;
        ctx.fill();
    });
}

// ─────────────────── RIPPLE SYSTEM ───────────────────

function spawnRipples() {
    const ripples = [];
    const W = 260;
    for (let i = 0; i < 6; i++) {
        ripples.push({
            r: 0,
            maxR: 30 + i * 28,
            spd: 85 + i * 22,
            color: i % 2 === 0 ? '0,255,160' : '255,210,0'
        });
    }
    return ripples;
}

function tickRipples(ripples, age, dt) {
    ripples.forEach(rip => {
        rip.r = Math.min(rip.maxR, age * rip.spd);
    });
    return ripples;
}

function drawRipples(ctx, ripples, cx, cy) {
    ripples.forEach(rip => {
        if (rip.r <= 0) return;
        const alpha = Math.max(0, 1 - rip.r / rip.maxR) * 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rip.color},${alpha})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
    });
}

// ─────────────────── PHASE LABELS ───────────────────

function setPhaseLabel(text, cls) {
    const el = document.getElementById('impact-phase-label');
    if (!el) return;
    el.textContent = text;
    el.className = 'impact-phase-label ' + (cls || '');
}

// ─────────────────── MAIN TEST LOOP ───────────────────

function launchBallisticTest() {
    ballisticAnimating = true;

    // Reset UI
    ['kevlar-impact-result', 'steel-impact-result'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.className = 'ballistic-result'; el.textContent = ''; }
    });

    const kBar = document.getElementById('kinetic-bar');
    const kVal = document.getElementById('kinetic-value');
    if (kBar) kBar.style.width = '100%';

    const W = 260, H = 260;
    const cx = W / 2, cy = H / 2;
    const IMPACT_T = 1.2;    // seconds when bullet reaches target (was 0.38)
    const TOTAL_T = 9.0;    // total animation duration (was 4.2)

    // Shared mutable state
    const kState = { ripples: [], impactAge: 0, bulletY: -20, bulletDone: false, phaseShown: '' };
    const sState = { sparks: [], holeR: 0, bulletY: -20, bulletDone: false };
    let kDoneShown = false, sDoneShown = false;

    let prev = null;

    function frame(now) {
        if (!prev) prev = now;
        const dt = Math.min((now - prev) / 1000, 0.04);
        prev = now;
        const t = (now - startTime) / 1000;

        // ── kinetic energy display
        const energy = Math.max(0, 1800 * (1 - Math.min(t / 5.0, 1)));
        if (kBar) kBar.style.width = (energy / 1800 * 100) + '%';
        if (kVal) kVal.textContent = Math.round(energy) + ' J';

        // ── Phase labels
        if (t < IMPACT_T) {
            setPhaseLabel('→ TRAIECTORIE', 'active');
        } else if (t < IMPACT_T + 0.2) {
            setPhaseLabel('💥 IMPACT', 'impact');
        } else if (t < 2.5) {
            setPhaseLabel('〜 DISIPARE ENERGIE', 'active');
        } else {
            setPhaseLabel('✓ TEST COMPLET', 'done');
        }

        // ────────── KEVLAR CANVAS ──────────
        bKevlarCtx.clearRect(0, 0, W, H);
        bKevlarCtx.fillStyle = '#010d07';
        bKevlarCtx.fillRect(0, 0, W, H);

        const kHit = t >= IMPACT_T;
        if (kHit) {
            if (kState.ripples.length === 0) kState.ripples = spawnRipples();
            kState.impactAge += dt;
        }

        // draw grid
        drawKevlarGrid(bKevlarCtx, t, cx, cy, kHit ? kState.impactAge : 0);

        // ripples
        if (kHit) {
            tickRipples(kState.ripples, kState.impactAge, dt);
            drawRipples(bKevlarCtx, kState.ripples, cx, cy);
        }

        // bullet
        if (!kState.bulletDone) {
            if (!kHit) {
                kState.bulletY = -20 + (cy + 20) * (t / IMPACT_T);
            } else {
                // decelerate and embed
                const slowT = Math.min(kState.impactAge / 1.1, 1);
                kState.bulletY = cy - (1 - slowT) * 20;
                if (kState.impactAge > 1.5) kState.bulletDone = true;
            }
            drawBullet(bKevlarCtx, cx, kState.bulletY, kHit);
        }

        // energy absorption glow on impact
        if (kHit && kState.impactAge < 3.0) {
            const gl = Math.exp(-kState.impactAge * 0.7) * 0.6;
            const rg = bKevlarCtx.createRadialGradient(cx, cy, 0, cx, cy, 50);
            rg.addColorStop(0, `rgba(0,255,150,${gl})`);
            rg.addColorStop(1, 'rgba(0,255,150,0)');
            bKevlarCtx.fillStyle = rg;
            bKevlarCtx.beginPath();
            bKevlarCtx.arc(cx, cy, 50, 0, Math.PI * 2);
            bKevlarCtx.fill();
        }

        // status text on canvas
        let kLabel = '→ BULLET IN TRAJECTORY';
        if (kHit && kState.impactAge < 0.4) kLabel = '⚡ IMPACT DETECTAT';
        else if (kHit && !kState.bulletDone) kLabel = '〜 DISIPARE ENERGIE';
        else if (kState.bulletDone) kLabel = '✓ THREAT STOPPED';
        bKevlarCtx.font = '9px "Share Tech Mono", monospace';
        bKevlarCtx.fillStyle = kState.bulletDone ? '#00ffcc' : '#ffd700';
        bKevlarCtx.textAlign = 'center';
        bKevlarCtx.fillText(kLabel, W / 2, H - 8);

        // ────────── STEEL CANVAS ──────────
        bSteelCtx.clearRect(0, 0, W, H);
        const sbg = bSteelCtx.createLinearGradient(0, 0, W, H);
        sbg.addColorStop(0, '#12121c');
        sbg.addColorStop(1, '#080808');
        bSteelCtx.fillStyle = sbg;
        bSteelCtx.fillRect(0, 0, W, H);

        const sHit = t >= IMPACT_T;

        // hole growth
        if (sHit) {
            sState.holeR = Math.min(20, (t - IMPACT_T) * 14);
        }
        drawSteelPlate(bSteelCtx, cx, cy, sState.holeR);

        // sparks
        if (sHit) {
            if (sState.sparks.length === 0 && sState.holeR > 0) {
                sState.sparks = spawnSparks(32, cx, cy);
            }
            sState.sparks = tickSparks(sState.sparks, dt);
            drawSparks(bSteelCtx, sState.sparks);
        }

        // bullet piercing
        if (!sState.bulletDone) {
            if (!sHit) {
                sState.bulletY = -20 + (cy + 20) * (t / IMPACT_T);
            } else {
                sState.bulletY = cy + (t - IMPACT_T) * 80;
                if (sState.bulletY > H + 20) sState.bulletDone = true;
            }
            if (sState.bulletY < H + 20) {
                drawBullet(bSteelCtx, cx, sState.bulletY, sHit);
            }
        }

        let sLabel = '→ BULLET IN TRAJECTORY';
        if (sHit && sState.holeR < 15) sLabel = '💥 PERFORATION IN PROGRESS';
        else if (sHit && !sState.bulletDone) sLabel = '☠ STEEL FAILED';
        else if (sState.bulletDone) sLabel = '☠ FULL PENETRATION';
        bSteelCtx.font = '9px "Share Tech Mono", monospace';
        bSteelCtx.fillStyle = sHit ? '#ff4444' : '#aaa';
        bSteelCtx.textAlign = 'center';
        bSteelCtx.fillText(sLabel, W / 2, H - 8);

        // ── result badges ──────────────────────
        if (!kDoneShown && kState.bulletDone) {
            kDoneShown = true;
            const el = document.getElementById('kevlar-impact-result');
            if (el) {
                el.textContent = '✅ ENERGY ABSORBED — THREAT NEUTRALIZED';
                el.className = 'ballistic-result show-kevlar';
            }
        }

        if (!sDoneShown && sState.bulletDone) {
            sDoneShown = true;
            const el = document.getElementById('steel-impact-result');
            if (el) {
                el.textContent = '❌ MATERIAL PERFORATED — LETHAL PENETRATION';
                el.className = 'ballistic-result show-steel';
            }
        }

        if (t < TOTAL_T) {
            requestAnimationFrame(frame);
        } else {
            ballisticAnimating = false;
            setPhaseLabel('TEST COMPLETE — PRESS AGAIN', 'done');
        }
    }

    const startTime = performance.now();
    requestAnimationFrame(frame);
}
// ============================================
// BREAK THE KEVLAR — MINI GAME
// ============================================
(function initBreakGame() {
    const canvas = document.getElementById('break-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let integrity = 100;
    let broken = false;
    let fibers = [];
    const FIBER_COUNT = 80;

    function resize() {
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = 300;
        buildFibers();
    }

    function buildFibers() {
        fibers = [];
        for (let i = 0; i < FIBER_COUNT; i++) {
            fibers.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                angle: Math.random() * Math.PI,
                len: 20 + Math.random() * 40,
                alive: true,
                opacity: 0.6 + Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function getParams() {
        const force = parseFloat(document.getElementById('break-force')?.value || 0);
        const temp = parseFloat(document.getElementById('break-temp')?.value || 20);
        const ph = parseFloat(document.getElementById('break-ph')?.value || 7);
        const uv = parseFloat(document.getElementById('break-uv')?.value || 0);
        return { force, temp, ph, uv };
    }

    function calcDamage(p) {
        // Force damage: Kevlar withstands up to 3620 MPa = 3.62 GPa
        // Slider 0-100 maps to 0-5 GPa
        const forceDmg = Math.max(0, (p.force / 100 * 5 - 3.62) / 1.38 * 60);
        // Temp damage: stable up to 427°C
        const tempDmg = p.temp > 427 ? Math.min(100, (p.temp - 427) / 173 * 50) : 0;
        // pH damage: stable at neutral, damaged by strong acids/bases (< 2 or > 12)
        const phDist = Math.max(0, Math.max(2 - p.ph, p.ph - 12));
        const phDmg = Math.min(100, phDist / 2 * 30);
        // UV damage
        const uvDmg = Math.min(100, p.uv / 10000 * 40);

        return { forceDmg, tempDmg, phDmg, uvDmg };
    }

    function updateUI(p, dmg) {
        document.getElementById('force-val').textContent = (p.force / 100 * 5).toFixed(2) + ' GPa';
        document.getElementById('temp-val').textContent = p.temp + '°C';
        document.getElementById('ph-val').textContent = 'pH ' + parseFloat(p.ph).toFixed(1);
        document.getElementById('uv-val').textContent = p.uv + 'h';
        document.getElementById('bsv-force').textContent = Math.round(dmg.forceDmg) + '%';
        document.getElementById('bsv-temp').textContent = Math.round(dmg.tempDmg) + '%';
        document.getElementById('bsv-chem').textContent = Math.round(dmg.phDmg) + '%';
        document.getElementById('bsv-uv').textContent = Math.round(dmg.uvDmg) + '%';

        const totalDmg = Math.min(100, dmg.forceDmg + dmg.tempDmg + dmg.phDmg + dmg.uvDmg);
        integrity = Math.max(0, 100 - totalDmg);

        const fill = document.getElementById('break-fill');
        const label = document.getElementById('break-label');
        const status = document.getElementById('break-status');
        if (fill) {
            fill.style.width = integrity + '%';
            const r = Math.round(255 * (1 - integrity / 100));
            const g = Math.round(255 * (integrity / 100));
            fill.style.background = `linear-gradient(90deg, rgb(${r},${g},50), rgb(${r * 0.5},${g},100))`;
        }
        if (label) label.textContent = Math.round(integrity) + '%';
        if (status) {
            if (integrity <= 0) {
                status.textContent = '⚠ MATERIAL RUPT!';
                status.className = 'break-status broken';
                broken = true;
            } else if (integrity < 30) {
                status.textContent = '⚠ CRITICAL DEGRADATION';
                status.className = 'break-status danger';
            } else if (integrity < 60) {
                status.textContent = '⚠ PARTIAL DEGRADATION';
                status.className = 'break-status danger';
            } else {
                status.textContent = 'STRUCTURE INTACT';
                status.className = 'break-status';
                broken = false;
            }
        }
    }

    let t = 0;
    function draw() {
        requestAnimationFrame(draw);
        t += 0.02;
        const p = getParams();
        const dmg = calcDamage(p);
        updateUI(p, dmg);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw fiber network
        const brokenCount = Math.floor((1 - integrity / 100) * FIBER_COUNT);
        fibers.forEach((f, i) => {
            if (!f.alive) return;
            if (i < brokenCount) { f.alive = false; return; }
            const wave = Math.sin(t * 2 + f.phase) * (broken ? 15 : 3) * (1 - integrity / 100 + 0.1);
            const cx = f.x + wave;
            const cy = f.y + wave * 0.5;
            const alpha = f.opacity * (integrity / 100);
            const hue = 120 + (1 - integrity / 100) * (-120);
            ctx.beginPath();
            ctx.moveTo(cx - Math.cos(f.angle) * f.len / 2, cy - Math.sin(f.angle) * f.len / 2);
            ctx.lineTo(cx + Math.cos(f.angle) * f.len / 2, cy + Math.sin(f.angle) * f.len / 2);
            ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = integrity < 60 ? 8 : 4;
            ctx.shadowColor = `hsla(${hue}, 90%, 65%, 0.5)`;
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // Draw stress fracture lines
        if (integrity < 70) {
            const fracCount = Math.floor((1 - integrity / 70) * 8);
            ctx.save();
            for (let k = 0; k < fracCount; k++) {
                const fx = (k / fracCount) * canvas.width + Math.sin(t + k) * 10;
                const fy = (k % 3) * (canvas.height / 3) + Math.cos(t * 0.7 + k) * 20;
                ctx.beginPath();
                ctx.moveTo(fx, fy);
                ctx.lineTo(fx + 30 + Math.sin(t + k * 2) * 20, fy + 15 + Math.cos(t + k) * 10);
                ctx.strokeStyle = `rgba(255, 50, 0, ${(1 - integrity / 70) * 0.7})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    document.getElementById('break-reset')?.addEventListener('click', () => {
        ['break-force', 'break-temp', 'break-ph', 'break-uv'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = id === 'break-temp' ? 20 : id === 'break-ph' ? 7 : 0;
        });
        integrity = 100;
        broken = false;
        buildFibers();
    });
})();

// ============================================
// BALLISTIC SCORE CALCULATOR
// ============================================
(function initCalc() {
    const calcBtn = document.getElementById('calc-btn');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', () => {
        const layers = parseFloat(document.getElementById('c-layers')?.value || 20);
        const angle = parseFloat(document.getElementById('c-angle')?.value || 0);
        const speed = parseFloat(document.getElementById('c-speed')?.value || 440);
        const mass = parseFloat(document.getElementById('c-mass')?.value || 12) / 1000; // kg

        // Kinetic energy (J)
        const KE = 0.5 * mass * speed * speed;

        // Kevlar resistance per layer (J) - empirical model
        // Standard: 1 layer absorbs ~30J at optimal orientation
        const angleRad = angle * Math.PI / 180;
        const orientFactor = Math.cos(angleRad) * Math.cos(angleRad) * 0.8 + 0.2;
        const resistPerLayer = 30 * orientFactor; // J per layer
        const totalRes = layers * resistPerLayer;

        // Penetration probability
        let penProb = 0;
        if (KE <= totalRes * 0.6) penProb = 0;
        else if (KE >= totalRes * 1.3) penProb = 100;
        else penProb = Math.round(((KE - totalRes * 0.6) / (totalRes * 0.7)) * 100);
        penProb = Math.max(0, Math.min(100, penProb));

        // Backface deformation (mm)
        const bfd = Math.max(0, Math.min(44, (KE / totalRes) * 20));

        // Update UI
        document.getElementById('cr-prob').textContent = penProb + '%';
        document.getElementById('cr-prob').style.color = penProb < 20 ? '#00ff88' : penProb < 60 ? '#ffaa00' : '#ff4444';

        const keNorm = Math.min(100, KE / 2000 * 100);
        const resNorm = Math.min(100, totalRes / 2000 * 100);
        const bfdNorm = Math.min(100, bfd / 44 * 100);

        document.getElementById('crb-ke').style.setProperty('--w', keNorm + '%');
        document.getElementById('crb-res').style.setProperty('--w', resNorm + '%');
        document.getElementById('crb-bfd').style.setProperty('--w', bfdNorm + '%');
        document.getElementById('crv-ke').textContent = Math.round(KE) + ' J';
        document.getElementById('crv-res').textContent = Math.round(totalRes) + ' J';
        document.getElementById('crv-bfd').textContent = bfd.toFixed(1) + ' mm';

        const verdict = document.getElementById('calc-verdict');
        if (penProb < 10) {
            verdict.textContent = '✅ FULL PROTECTION — NIJ IIIA COMPLIANT';
            verdict.className = 'calc-verdict safe';
        } else if (penProb < 50) {
            verdict.textContent = '⚠ PARTIAL PROTECTION — MODERATE RISK';
            verdict.className = 'calc-verdict warning';
        } else {
            verdict.textContent = '❌ PROBABLE PENETRATION — INSUFFICIENT PROTECTION';
            verdict.className = 'calc-verdict danger';
        }

        document.getElementById('cf-eq').textContent =
            `E_k = ½mv² = ½×${(mass * 1000).toFixed(1)}g×${speed}²m/s = ${Math.round(KE)}J\n` +
            `R_total = N_layers × R_layer × cos²(θ) = ${layers} × 30 × ${orientFactor.toFixed(2)} = ${Math.round(totalRes)}J\n` +
            `P(penetrare) = f(E_k / R_total) × 100 = ${penProb}%\n` +
            `BFD = (E_k/R_total) × 20mm = ${bfd.toFixed(1)}mm (max NIJ: 44mm)`;
    });
})();

// ============================================
// RESEARCH — REACTION CANVAS
// ============================================
(function initReactionCanvas() {
    const canvas = document.getElementById('reaction-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let running = false;
    let progress = 0;
    let particles = [];
    let chains = [];
    let t = 0;
    let animId = null;

    function resize() {
        canvas.width = canvas.offsetWidth || 900;
        canvas.height = 200;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle(type) {
        return {
            x: type === 'ppd' ? Math.random() * canvas.width * 0.45 : canvas.width * 0.55 + Math.random() * canvas.width * 0.45,
            y: 20 + Math.random() * (canvas.height - 40),
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            type: type,
            r: 6,
            reacted: false
        };
    }

    // Init particles
    for (let i = 0; i < 18; i++) particles.push(createParticle('ppd'));
    for (let i = 0; i < 18; i++) particles.push(createParticle('tcl'));

    function drawFrame() {
        t += 0.018;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // BG grid
        ctx.strokeStyle = 'rgba(100,210,255,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

        // Draw chains (products)
        chains.forEach(chain => {
            ctx.beginPath();
            chain.nodes.forEach((n, i) => i === 0 ? ctx.moveTo(n.x, n.y) : ctx.lineTo(n.x, n.y));
            ctx.strokeStyle = `rgba(0,255,136,${0.5 + 0.3 * Math.sin(t + chain.phase)})`;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
            ctx.stroke(); ctx.shadowBlur = 0;
            chain.nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 10 || n.x > canvas.width - 10) n.vx *= -1; if (n.y < 10 || n.y > canvas.height - 10) n.vy *= -1; });
        });

        // Draw particles
        particles.forEach(p => {
            if (!running || p.reacted) return;
            p.x += p.vx; p.y += p.vy;
            if (p.x < 8 || p.x > canvas.width - 8) p.vx *= -1;
            if (p.y < 8 || p.y > canvas.height - 8) p.vy *= -1;

            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            const col = p.type === 'ppd' ? '#64d2ff' : '#e8c547';
            ctx.fillStyle = col;
            ctx.shadowBlur = 12; ctx.shadowColor = col; ctx.fill(); ctx.shadowBlur = 0;

            // Label
            ctx.font = '7px Share Tech Mono, monospace';
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
            ctx.fillText(p.type === 'ppd' ? 'PPD' : 'TCl', p.x, p.y + 2);
        });

        // Reaction: find close PPD+TCl pairs
        if (running && progress < 100 && Math.random() > 0.97) {
            let ppds = particles.filter(p => p.type === 'ppd' && !p.reacted);
            let tcls = particles.filter(p => p.type === 'tcl' && !p.reacted);
            if (ppds.length && tcls.length) {
                let p1 = ppds[Math.floor(Math.random() * ppds.length)];
                let p2 = tcls[Math.floor(Math.random() * tcls.length)];
                p1.reacted = p2.reacted = true;
                // Form chain node
                const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
                if (chains.length === 0) {
                    chains.push({ nodes: [{ x: cx, y: cy, vx: 0.3, vy: 0.2 }], phase: Math.random() * Math.PI });
                } else {
                    const last = chains[chains.length - 1];
                    last.nodes.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
                }
                progress = Math.min(100, (18 - ppds.length + 1) / 18 * 100);

                // Update stats
                const mwEl = document.getElementById('rs-mw');
                const convEl = document.getElementById('rs-conv');
                const hclEl = document.getElementById('rs-hcl');
                const tempEl = document.getElementById('rs-temp');
                const reacted = 18 - ppds.length + 1;
                if (mwEl) mwEl.textContent = Math.round(reacted * 2780) + ' g/mol';
                if (convEl) convEl.textContent = Math.round(progress) + '%';
                if (hclEl) hclEl.textContent = (reacted * 2).toFixed(0) + ' mol';
                if (tempEl) tempEl.textContent = progress < 30 ? '-10°C' : progress < 70 ? '40°C' : '80°C';

                if (progress >= 100) {
                    running = false;
                    document.getElementById('rs-start').textContent = '✅ COMPLET';
                }
            }
        }

        animId = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    document.getElementById('rs-start')?.addEventListener('click', () => {
        running = true;
        document.getElementById('rs-start').textContent = '⏸ PAUZA';
    });
    document.getElementById('rs-reset')?.addEventListener('click', () => {
        running = false; progress = 0; chains = []; t = 0;
        particles = [];
        for (let i = 0; i < 18; i++) particles.push(createParticle('ppd'));
        for (let i = 0; i < 18; i++) particles.push(createParticle('tcl'));
        ['rs-mw', 'rs-conv', 'rs-hcl'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = id === 'rs-mw' ? '0' : id === 'rs-conv' ? '0%' : '0 mol'; });
        document.getElementById('rs-temp').textContent = '-10°C';
        document.getElementById('rs-start').textContent = '▶ START';
    });
})();

// ============================================
// FORMULA HOLO CANVASES
// ============================================
(function initFormulaHolos() {
    const modes = ['tensile', 'kinetic', 'thermal', 'crystal'];
    modes.forEach((mode, idx) => {
        const canvas = document.getElementById('fhc-' + idx);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let t = idx * 1.3;

        function resize() { canvas.width = canvas.offsetWidth || 280; canvas.height = canvas.offsetHeight || 260; }
        resize();
        window.addEventListener('resize', resize);

        function draw() {
            t += 0.012;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isGold = idx % 2 === 0;
            const col = isGold ? [232, 197, 71] : [100, 210, 255];

            if (mode === 'tensile') {
                // Stress-strain curve
                ctx.beginPath(); ctx.moveTo(20, canvas.height - 20);
                for (let x = 0; x < canvas.width - 40; x += 2) {
                    const strain = x / (canvas.width - 40);
                    const stress = strain < 0.036 ? strain / 0.036 : 1 - (strain - 0.036) * 8;
                    const y = canvas.height - 20 - Math.max(0, stress) * (canvas.height - 40);
                    x === 0 ? ctx.moveTo(x + 20, y) : ctx.lineTo(x + 20, y);
                }
                ctx.strokeStyle = `rgba(${col},0.6)`; ctx.lineWidth = 1.5; ctx.stroke();
                // Moving point
                const px = ((Math.sin(t * 0.5) * 0.5 + 0.5) * 0.9);
                const py = px < 0.036 ? px / 0.036 : 1 - (px - 0.036) * 8;
                ctx.beginPath(); ctx.arc(px * (canvas.width - 40) + 20, canvas.height - 20 - Math.max(0, py) * (canvas.height - 40), 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${col},0.9)`; ctx.shadowBlur = 10; ctx.shadowColor = `rgb(${col})`; ctx.fill(); ctx.shadowBlur = 0;
            } else if (mode === 'kinetic') {
                // Bullet trajectory + impact waves
                const bx = ((t * 0.3) % 1.2 - 0.1) * canvas.width;
                ctx.beginPath(); ctx.arc(bx, canvas.height / 2, 5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${col},0.8)`; ctx.shadowBlur = 15; ctx.shadowColor = `rgb(${col})`; ctx.fill(); ctx.shadowBlur = 0;
                // Impact rings when near center
                if (bx > canvas.width * 0.4 && bx < canvas.width * 0.6) {
                    const age = Math.abs(bx - canvas.width / 2) / (canvas.width * 0.1);
                    for (let r = 1; r <= 3; r++) {
                        ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, r * 20 * (1 - age) + age * 5, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(${col},${0.5 * (1 - age / r)})`; ctx.lineWidth = 1; ctx.stroke();
                    }
                }
            } else if (mode === 'thermal') {
                // Heat waves / fire
                for (let i = 0; i < 8; i++) {
                    const x = 20 + i * (canvas.width - 40) / 7;
                    for (let h = 5; h < 30; h++) {
                        const heat = Math.sin(t * 1.5 + i * 0.7 + h * 0.4) * 0.5 + 0.5;
                        const hh = h * (canvas.height - 40) / 30;
                        ctx.beginPath(); ctx.arc(x, canvas.height - 10 - hh, 2, 0, Math.PI * 2);
                        const r2 = Math.floor(255 * heat), g2 = Math.floor(150 * (1 - heat)), b2 = 0;
                        ctx.fillStyle = `rgba(${r2},${g2},${b2},${heat * 0.5})`; ctx.fill();
                    }
                }
            } else {
                // Crystal lattice
                const spacing = 28;
                for (let row = 0; row < Math.ceil(canvas.height / spacing) + 1; row++) {
                    for (let col2 = 0; col2 < Math.ceil(canvas.width / spacing) + 1; col2++) {
                        const px2 = col2 * spacing + (row % 2) * 14 + Math.sin(t + row * 0.3) * 2;
                        const py2 = row * spacing * 0.866 + Math.cos(t + col2 * 0.3) * 2;
                        const glow = Math.sin(t * 1.5 + row * 0.5 + col2 * 0.7) * 0.5 + 0.5;
                        ctx.beginPath(); ctx.arc(px2, py2, 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${col},${0.3 + glow * 0.4})`; ctx.fill();
                        // H-bond lines
                        if (col2 > 0) {
                            ctx.beginPath(); ctx.moveTo(px2 - spacing, py2); ctx.lineTo(px2, py2);
                            ctx.strokeStyle = `rgba(${col},${0.1 + glow * 0.2})`; ctx.lineWidth = 0.8; ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    });
})();

// ============================================
// MEGA VIRTUAL LAB
// ============================================
(function initVirtualLab() {
    const canvas = document.getElementById('lab-main-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let currentStep = 0;
    let stepProgress = [0, 0, 0, 0];
    let animRunning = false;
    let currentAnimId = null;
    let viewMode = 'mol';
    let t = 0;
    let particles = [];
    let chainData = [];
    let fiberData = [];
    let chartHistory = [];
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let fps = 60;

    const stepMessages = [
        ['[00:00] System initialized. Standby.'],
        ['[S1] Adding PPD + TCl monomers in NMP...', '[S1] Temperature lowered to -10°C...', '[S1] Mixing anisotropic solution...', '[S1] Monomers uniformly distributed. ✓'],
        ['[S2] Initiating polycondensation at 80°C...', '[S2] HCl elimination: 2n mol detected...', '[S2] Mw growth observed: → 50,000 g/mol', '[S2] Polymerization complete. PPTA formed. ✓'],
        ['[S3] Pumping solution through spinneret...', '[S3] Coagulation in H₂SO₄ 100%...', '[S3] Axial orientation: 95% alignment...', '[S3] Kevlar fiber extruded. ✓'],
        ['[S4] Mounting fiber in Zwick-Roell apparatus...', '[S4] Force applied: 0 → 3,620 MPa...', '[S4] BFD measured: 12mm (NIJ limit: 44mm)', '[S4] NIJ IIIA CERTIFICATE GRANTED! ✓']
    ];

    function resize() {
        canvas.width = canvas.offsetWidth || 700;
        canvas.height = canvas.offsetHeight || 450;
    }
    resize();
    window.addEventListener('resize', resize);

    // Gauge drawing
    function drawGauge(id, value, max, color, label) {
        const c = document.getElementById(id);
        if (!c) return;
        c.width = 80; c.height = 80; // ensure consistent size
        const cx2 = c.getContext('2d');
        const w = c.width, h = c.height;
        cx2.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2, r = w * 0.33; // reduced radius to stay inside
        // BG arc
        cx2.beginPath(); cx2.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
        cx2.strokeStyle = 'rgba(255,255,255,0.06)'; cx2.lineWidth = 5; cx2.stroke();
        // Value arc
        const angle = Math.PI * 0.75 + (value / max) * Math.PI * 1.5;
        cx2.beginPath(); cx2.arc(cx, cy, r, Math.PI * 0.75, angle);
        cx2.strokeStyle = color; cx2.lineWidth = 5;
        cx2.shadowBlur = 6; cx2.shadowColor = color;
        cx2.stroke(); cx2.shadowBlur = 0;
        // Center dot
        cx2.beginPath(); cx2.arc(cx, cy, 3, 0, Math.PI * 2);
        cx2.fillStyle = color; cx2.fill();
    }

    function updateGauges() {
        const tempVal = currentStep === 0 ? 0 : currentStep === 1 ? 0.15 : currentStep === 2 ? 0.7 : currentStep === 3 ? 0.3 : 0.3;
        const pressVal = currentStep === 0 ? 0.1 : currentStep === 1 ? 0.2 : currentStep === 2 ? 0.4 : currentStep === 3 ? 0.8 : 0.5;
        const phVal = currentStep === 0 ? 0.5 : currentStep === 1 ? 0.3 : currentStep === 2 ? 0.15 : currentStep === 3 ? 0.02 : 0.5;
        drawGauge('gc-temp', tempVal, 1, '#e8c547', 'T');
        drawGauge('gc-press', pressVal, 1, '#64d2ff', 'P');
        drawGauge('gc-ph', phVal, 1, '#00ff88', 'pH');
        const temps = ['20°C', '-10°C', '80°C', '25°C', '25°C'];
        const press = ['1.0 atm', '1.2 atm', '1.8 atm', '3.2 atm', '1.5 atm'];
        const phs = ['7.0', '4.2', '2.8', '0.1', '7.0'];
        const el1 = document.getElementById('gv-temp'); if (el1) el1.textContent = temps[currentStep] || '—';
        const el2 = document.getElementById('gv-press'); if (el2) el2.textContent = press[currentStep] || '—';
        const el3 = document.getElementById('gv-ph'); if (el3) el3.textContent = phs[currentStep] || '—';
    }
    updateGauges();

    function addTerminalLine(txt) {
        const lines = document.getElementById('lt-lines');
        if (!lines) return;
        const now = new Date();
        const time = `[${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        const div = document.createElement('div');
        div.className = 'lt-line';
        div.innerHTML = `<span class="lt-t">${time}</span> ${txt}`;
        lines.appendChild(div);
        lines.scrollTop = lines.scrollHeight;
    }

    function updateStats(step, progress) {
        const monomers = step === 0 ? 0 : step === 1 ? Math.round(progress * 0.48) : 96;
        const chains2 = step === 1 ? Math.round(progress * 0.12) : step >= 2 ? 12 : 0;
        const mw = step < 2 ? '—' : Math.round(progress / 100 * 50000) + ' g/mol';
        const conv = step < 1 ? '0%' : Math.round(progress) + '%';
        const hcl = step < 2 ? '0 mol' : Math.round(progress / 100 * 24) + ' mol';
        const str = step < 4 ? '—' : Math.round(progress / 100 * 3620) + ' MPa';

        const els = {
            'ldp-monomers': monomers, 'ldp-chains': chains2, 'ldp-mw': mw,
            'ldp-conv': conv, 'ldp-hcl': hcl, 'ldp-str': str
        };
        Object.entries(els).forEach(([id, val]) => {
            const el = document.getElementById(id); if (el) el.textContent = val;
        });

        // Update ring progress
        const ring = document.getElementById('lab-ring-progress');
        if (ring) {
            const total = (currentStep - 1) / 4 + progress / 400;
            const circumf = 213.6;
            ring.style.strokeDashoffset = circumf * (1 - Math.min(1, total));
        }

        // Chart
        chartHistory.push(progress);
        if (chartHistory.length > 60) chartHistory.shift();
        drawMiniChart();

        // Step info
        const si = document.getElementById('lmd-step-info');
        if (si) si.textContent = `PAS ${Math.max(1, currentStep)} / 4`;
    }

    function drawMiniChart() {
        const c = document.getElementById('lab-chart');
        if (!c) return;
        const cx2 = c.getContext('2d');
        cx2.clearRect(0, 0, c.width, c.height);
        cx2.fillStyle = 'rgba(0,0,0,0.3)';
        cx2.fillRect(0, 0, c.width, c.height);
        if (chartHistory.length < 2) return;
        cx2.beginPath();
        chartHistory.forEach((v, i) => {
            const x2 = (i / 59) * c.width;
            const y2 = c.height - (v / 100) * c.height;
            i === 0 ? cx2.moveTo(x2, y2) : cx2.lineTo(x2, y2);
        });
        cx2.strokeStyle = '#00ff88'; cx2.lineWidth = 1.5;
        cx2.shadowBlur = 4; cx2.shadowColor = '#00ff88';
        cx2.stroke(); cx2.shadowBlur = 0;
    }

    // ── Main canvas draw modes ──
    function drawMolecular(progress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Grid
        ctx.strokeStyle = 'rgba(0,255,136,0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y < canvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

        const step = currentStep;
        if (step === 0) {
            ctx.font = '13px Orbitron, monospace'; ctx.fillStyle = 'rgba(0,255,136,0.25)';
            ctx.textAlign = 'center'; ctx.fillText('AWAITING COMMAND...', canvas.width / 2, canvas.height / 2);
        } else if (step === 1) {
            // Monomer mixing
            particles.forEach(p => {
                p.x += p.vx + Math.sin(t * 0.8 + p.phase) * 0.5;
                p.y += p.vy + Math.cos(t * 0.8 + p.phase) * 0.5;
                if (p.x < 10 || p.x > canvas.width - 10) p.vx *= -1;
                if (p.y < 10 || p.y > canvas.height - 10) p.vy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.col; ctx.shadowBlur = 8; ctx.shadowColor = p.col;
                ctx.fill(); ctx.shadowBlur = 0;
                // Bond lines
                ctx.font = '7px Share Tech Mono'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
                ctx.fillText(p.label, p.x, p.y + 3);
                // Ring structure
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2);
                ctx.strokeStyle = p.col.replace('1)', '0.2)'); ctx.lineWidth = 1; ctx.stroke();
            });
        } else if (step === 2) {
            // Polymerization - growing LINEAR rigid chains (rod-like, para-linked)
            const numChains = Math.floor(progress / 14) + 1;
            for (let c2 = 0; c2 < Math.min(numChains, 7); c2++) {
                const y = 28 + c2 * (canvas.height - 56) / 6;
                const chainLen = Math.floor(progress / 100 * (canvas.width - 80));
                const unitSpacing = 20;

                // Backbone — very slight zigzag (rod-like, NOT flexible)
                ctx.beginPath(); ctx.moveTo(40, y);
                for (let x = 0; x < chainLen; x += 4) {
                    // amplitude max 3px — rigid rod
                    ctx.lineTo(40 + x, y + Math.sin(x * 0.32 + c2 * 1.1) * 3);
                }
                const hue2 = 160 + c2 * 15;
                ctx.strokeStyle = `hsla(${hue2},80%,60%,0.75)`;
                ctx.lineWidth = 1.8; ctx.shadowBlur = 5; ctx.shadowColor = `hsla(${hue2},80%,60%,0.5)`;
                ctx.stroke(); ctx.shadowBlur = 0;

                // Alternating A/B monomer nodes — hexagonal
                for (let x = 0; x < chainLen; x += unitSpacing) {
                    const nx = 40 + x;
                    const ny = y + Math.sin(x * 0.32 + c2 * 1.1) * 3;
                    const isA = Math.floor(x / unitSpacing) % 2 === 0;
                    const col = isA ? '#64d2ff' : '#e8c547';

                    ctx.beginPath();
                    for (let s = 0; s < 6; s++) {
                        const a = s * Math.PI / 3;
                        const hx = nx + Math.cos(a) * 4;
                        const hy = ny + Math.sin(a) * 4;
                        s === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                    ctx.fillStyle = isA ? 'rgba(100,210,255,0.2)' : 'rgba(232,197,71,0.2)';
                    ctx.strokeStyle = col; ctx.lineWidth = 1.2;
                    ctx.shadowBlur = 6; ctx.shadowColor = col;
                    ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
                }
            }
            // Label
            ctx.font = '9px Share Tech Mono, monospace';
            ctx.fillStyle = 'rgba(0,255,136,0.45)';
            ctx.textAlign = 'center';
            ctx.fillText('RIGID LINEAR PPTA CHAINS — PPD(cyan) + TCl(gold)', canvas.width / 2, canvas.height - 8);
        } else if (step === 3) {
            // Fiber extrusion - helical fibers flowing down
            const numFibers = Math.floor(progress / 12) + 1;
            for (let f = 0; f < Math.min(numFibers, 8); f++) {
                const xBase = 30 + f * (canvas.width - 60) / 7;
                ctx.beginPath();
                for (let y = 0; y < canvas.height; y += 3) {
                    const x = xBase + Math.sin(y * 0.08 + t * 1.2 + f * 0.8) * 12;
                    y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                const alpha = 0.4 + (f / 8) * 0.5;
                ctx.strokeStyle = `rgba(232,197,71,${alpha})`;
                ctx.lineWidth = 1.8; ctx.shadowBlur = progress > 50 ? 10 : 4;
                ctx.shadowColor = '#e8c547'; ctx.stroke(); ctx.shadowBlur = 0;
            }
        } else if (step === 4) {
            // Tensile test — fibers being pulled
            const stretch = progress / 100;
            const numFibers = 16;
            for (let f = 0; f < numFibers; f++) {
                const x = 40 + f * (canvas.width - 80) / (numFibers - 1);
                const topY = 20 - stretch * 30;
                const botY = canvas.height - 20 + stretch * 30;
                // Fiber strain visualization
                const tension = stretch;
                ctx.beginPath(); ctx.moveTo(x, topY); ctx.lineTo(x, botY);
                const r3 = Math.floor(255 * tension), g3 = Math.floor(255 * (1 - tension));
                ctx.strokeStyle = `rgba(${r3},${g3},71,0.7)`;
                ctx.lineWidth = 1.5 - stretch * 0.5; ctx.stroke();
                // Strain markers
                if (progress > 70 && f % 3 === 0) {
                    ctx.beginPath();
                    ctx.arc(x, canvas.height / 2, 3, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,68,68,0.8)'; ctx.fill();
                }
            }
            // Clamps
            [20, canvas.height - 20].forEach(clampY => {
                ctx.fillStyle = '#e8c547';
                ctx.fillRect(20, clampY - 8 + (clampY < 100 ? -stretch * 30 : stretch * 30), canvas.width - 40, 16);
            });
        }
    }

    function drawChainMode(progress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;

        // How many monomer units are visible (grows with progress)
        const maxUnits = 28;
        const nodeCount = Math.max(2, Math.floor(progress / 100 * maxUnits));

        // Layout: chain grows left → right across center of canvas
        // Very slight zig-zag (±8px), NOT a curve, NOT a circle
        const unitSpacing = Math.min(38, (W - 80) / Math.max(nodeCount - 1, 1));
        const startX = Math.max(40, W / 2 - ((nodeCount - 1) * unitSpacing) / 2);
        const baseY = H / 2;
        const zigHeight = 9; // very small — rod-like, not flexible

        // Pre-compute node positions (strict zigzag line)
        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: startX + i * unitSpacing,
                y: baseY + (i % 2 === 0 ? -zigHeight : zigHeight),
                isA: i % 2 === 0   // A = PPD (cyan), B = TCl (gold)
            });
        }

        // ── Draw hydrogen-bond hint lines (vertical dashes between chains) ──
        if (progress > 40) {
            const alpha = Math.min(1, (progress - 40) / 40) * 0.25;
            for (let i = 0; i < nodeCount; i += 2) {
                const nx = nodes[i].x, ny = nodes[i].y;
                ctx.setLineDash([3, 4]);
                ctx.strokeStyle = `rgba(255,215,100,${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(nx, ny - 28); ctx.lineTo(nx, ny + 28); ctx.stroke();
            }
            ctx.setLineDash([]);
        }

        // ── Draw backbone bonds ──
        for (let i = 1; i < nodeCount; i++) {
            const prev = nodes[i - 1], curr = nodes[i];
            // Amide bond: thick glowing line A→B
            const col = i % 2 === 0 ? 'rgba(0,255,136,0.6)' : 'rgba(0,255,136,0.6)';
            ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(curr.x, curr.y);
            ctx.strokeStyle = col;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
            ctx.stroke(); ctx.shadowBlur = 0;

            // Bond label (CO−NH) halfway between nodes
            if (unitSpacing > 24) {
                const mx = (prev.x + curr.x) / 2;
                const my = (prev.y + curr.y) / 2 - 13;
                ctx.font = 'bold 9px Share Tech Mono, monospace';
                ctx.fillStyle = '#00ff88';
                ctx.shadowBlur = 4; ctx.shadowColor = '#00ff88';
                ctx.textAlign = 'center';
                ctx.fillText('CO−NH', mx, my);
                ctx.shadowBlur = 0;
            }
        }

        // ── Draw monomer nodes ──
        nodes.forEach((node, i) => {
            const isA = node.isA;
            const col = isA ? '#64d2ff' : '#e8c547';
            const colFade = isA ? 'rgba(100,210,255,0.15)' : 'rgba(232,197,71,0.15)';
            const r = 11;

            // Outer glow
            const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.2);
            grd.addColorStop(0, col.replace(')', ',0.35)').replace('rgb', 'rgba'));
            grd.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = grd; ctx.fill();

            // Benzene ring shape (hexagon) for visual accuracy
            ctx.beginPath();
            for (let s = 0; s < 6; s++) {
                const a = s * Math.PI / 3 - Math.PI / 6;
                const px = node.x + Math.cos(a) * r;
                const py = node.y + Math.sin(a) * r;
                s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = colFade;
            ctx.strokeStyle = col;
            ctx.lineWidth = 1.8;
            ctx.shadowBlur = 10; ctx.shadowColor = col;
            ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

            // Monomer label inside
            ctx.font = 'bold 9px Share Tech Mono, monospace';
            ctx.fillStyle = col;
            ctx.shadowBlur = 6; ctx.shadowColor = col;
            ctx.textAlign = 'center';
            ctx.fillText(isA ? 'PPD' : 'TCl', node.x, node.y + 3);
            ctx.shadowBlur = 0;

            // Index number above
            if (unitSpacing > 22) {
                ctx.font = 'bold 9px Share Tech Mono, monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.75)';
                ctx.shadowBlur = 3; ctx.shadowColor = col;
                ctx.fillText(i + 1, node.x, node.y - r - 6);
                ctx.shadowBlur = 0;
            }
        });

        // ── Growing tip flash (last node) ──
        if (nodeCount < maxUnits && progress > 0) {
            const tip = nodes[nodes.length - 1];
            const pulse = 0.5 + 0.5 * Math.sin(t * 6);
            ctx.beginPath(); ctx.arc(tip.x, tip.y, 16 + pulse * 6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,255,136,${0.5 * pulse})`;
            ctx.lineWidth = 1.5; ctx.stroke();
        }

        // ── End caps — indicate chain is open (not closed!) ──
        if (nodeCount >= 2) {
            ['left', 'right'].forEach(side => {
                const node = side === 'left' ? nodes[0] : nodes[nodes.length - 1];
                const dir = side === 'left' ? -1 : 1;
                ctx.beginPath();
                ctx.moveTo(node.x + dir * 14, node.y);
                ctx.lineTo(node.x + dir * 22, node.y - 5);
                ctx.moveTo(node.x + dir * 14, node.y);
                ctx.lineTo(node.x + dir * 22, node.y + 5);
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 1.5; ctx.stroke();
                // "NH₂" / "COCl" end group label
                ctx.font = 'bold 10px Share Tech Mono, monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(200,200,255,0.8)';
                ctx.textAlign = side === 'left' ? 'right' : 'left';
                ctx.fillText(side === 'left' ? 'H₂N—' : '—COCl', node.x + dir * 24, node.y + 4);
                ctx.shadowBlur = 0;
            });
        }

        // ── Info text ──
        const unitLabel = nodeCount % 2 === 0 ? `(${nodeCount / 2} PPTA units)` : `(${Math.floor(nodeCount / 2)} units + 1 monomer)`;
        ctx.font = 'bold 11px Orbitron, monospace';
        ctx.fillStyle = '#00ff88';
        ctx.shadowBlur = 6; ctx.shadowColor = '#00ff88';
        ctx.textAlign = 'center';
        ctx.fillText(`LANȚ LINIAR RIGID — ${nodeCount} MONOMERI ${unitLabel}`, W / 2, H - 14);
        ctx.shadowBlur = 0;

        // ── Scale bar ──
        const barW = Math.min(100, nodeCount * 4);
        const barX = W / 2 - barW / 2;
        const barY = H - 34;
        ctx.beginPath(); ctx.moveTo(barX, barY); ctx.lineTo(barX + barW, barY);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.font = 'bold 9px Share Tech Mono, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(`~${Math.round(nodeCount * 1.27)} nm`, W / 2, barY - 4);
    }

    function drawFiberMode(progress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const count = Math.min(40, Math.floor(progress / 2.5) + 1);
        for (let f = 0; f < count; f++) {
            const x = (f / count) * canvas.width;
            ctx.beginPath();
            for (let y = 0; y < canvas.height; y += 4) {
                const wx = x + Math.sin(y * 0.06 + t + f * 0.3) * 8;
                y === 0 ? ctx.moveTo(wx, y) : ctx.lineTo(wx, y);
            }
            const alpha = 0.2 + (f / count) * 0.6;
            ctx.strokeStyle = `rgba(232,197,71,${alpha})`;
            ctx.lineWidth = 1.2; ctx.shadowBlur = 5; ctx.shadowColor = '#e8c547'; ctx.stroke(); ctx.shadowBlur = 0;
        }
        ctx.font = '10px Orbitron'; ctx.fillStyle = 'rgba(232,197,71,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(`${count} FIBRE KEVLAR — Ø 12 μm`, canvas.width / 2, canvas.height - 15);
    }

    function drawStressMode(progress) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const intensity = progress / 100;
        const W = canvas.width, H = canvas.height;
        // Stress field
        for (let x = 0; x < W; x += 20) {
            for (let y = 0; y < H; y += 20) {
                const d = Math.sqrt((x - W / 2) ** 2 + (y - H / 2) ** 2) / (W / 2);
                const stress = Math.max(0, (1 - d) * intensity);
                const r2 = Math.floor(255 * stress), g2 = Math.floor(200 * (1 - stress));
                ctx.fillStyle = `rgba(${r2},${g2},71,${stress * 0.7})`;
                ctx.fillRect(x, y, 18, 18);
            }
        }
        // Vector arrows
        for (let i = 0; i < 12; i++) {
            const angle = i / 12 * Math.PI * 2;
            const r = 60 + intensity * 80;
            const x = W / 2 + Math.cos(angle) * r;
            const y = H / 2 + Math.sin(angle) * r;
            ctx.beginPath(); ctx.moveTo(W / 2, H / 2); ctx.lineTo(x, y);
            ctx.strokeStyle = `rgba(232,197,71,${0.3 + intensity * 0.4})`; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.font = '12px Orbitron'; ctx.fillStyle = 'rgba(232,197,71,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(`STRESS: ${Math.round(intensity * 3620)} MPa`, W / 2, H - 20);
    }

    function renderFrame() {
        t += 0.016;
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime > 1000) {
            fps = Math.round(frameCount * 1000 / (now - lastFpsTime));
            frameCount = 0; lastFpsTime = now;
            const fpsEl = document.getElementById('lmd-fps'); if (fpsEl) fpsEl.textContent = fps + ' FPS';
        }
        const prog = stepProgress[currentStep - 1] || 0;
        if (viewMode === 'mol') drawMolecular(prog);
        else if (viewMode === 'chain') drawChainMode(prog);
        else if (viewMode === 'fiber') drawFiberMode(prog);
        else if (viewMode === 'stress') drawStressMode(prog);
        updateGauges();
        currentAnimId = requestAnimationFrame(renderFrame);
    }
    renderFrame();

    // Step runner
    function runStep(stepNum) {
        const btn = document.getElementById('lsc-' + stepNum);
        if (!btn || btn.disabled) return;
        btn.disabled = true; btn.textContent = '⏳';
        currentStep = stepNum;
        const stepEl = document.getElementById('sc-step-' + stepNum);
        if (stepEl) stepEl.classList.add('active');

        // Power indicator
        const pw = document.getElementById('lcp-power'); if (pw) pw.textContent = '● RUNNING';
        const title = document.getElementById('lmd-title');
        const titles = ['', 'MIX MONOMERI — -10°C', 'POLIMERIZARE — 80°C', 'FILARE FIBRA — H₂SO₄', 'TEST TENSIL — 3620 MPa'];
        if (title) title.textContent = titles[stepNum] || '';

        // Init particles for step 1
        if (stepNum === 1) {
            particles = [];
            for (let i = 0; i < 24; i++) {
                particles.push({ x: 40 + Math.random() * (canvas.width - 80), y: 20 + Math.random() * (canvas.height - 40), vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, r: 7, col: i < 12 ? 'rgba(100,210,255,0.9)' : 'rgba(232,197,71,0.9)', label: i < 12 ? 'PPD' : 'TCl', phase: Math.random() * Math.PI * 2 });
            }
        }

        // Terminal messages
        const msgs = stepMessages[stepNum] || [];
        msgs.forEach((msg, i) => setTimeout(() => addTerminalLine(msg), i * 700));

        let progress = 0;
        const progressEl = document.getElementById('lscp-' + stepNum);
        const interval = setInterval(() => {
            progress += 0.35 + Math.random() * 0.3;
            stepProgress[stepNum - 1] = progress;
            if (progressEl) progressEl.style.width = Math.min(100, progress) + '%';
            updateStats(stepNum, Math.min(100, progress));

            if (progress >= 100) {
                clearInterval(interval);
                stepProgress[stepNum - 1] = 100;
                if (progressEl) progressEl.style.width = '100%';
                if (stepEl) { stepEl.classList.remove('active'); stepEl.classList.add('completed'); }
                if (btn) btn.textContent = '✅';
                if (pw) pw.textContent = stepNum < 4 ? '● STANDBY' : '● FINALIZAT';

                if (stepNum < 4) {
                    const nextBtn = document.getElementById('lsc-' + (stepNum + 1));
                    const nextStep = document.getElementById('sc-step-' + (stepNum + 1));
                    if (nextStep) nextStep.classList.remove('locked');
                    if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = '▶ RUN'; }
                    addTerminalLine(`[OK] Pas ${stepNum} finalizat. Pas ${stepNum + 1} deblocat.`);
                } else {
                    addTerminalLine('[✓] SYNTHESIS COMPLETE! KEVLAR PPTA certified NIJ IIIA');
                    const si = document.getElementById('lmd-step-info'); if (si) si.textContent = 'COMPLET ✅';
                    const molInfo = document.getElementById('ldp-mol-info');
                    if (molInfo) molInfo.querySelector('.ldpmi-content').textContent = '🏆 KEVLAR SINTETIZAT! σ = 3,620 MPa | Mw = 52,400 g/mol | NIJ IIIA CERTIFICAT | Randament: 97.3%';
                }
            }
        }, 50);
    }

    for (let i = 1; i <= 4; i++) {
        document.getElementById('lsc-' + i)?.addEventListener('click', () => runStep(i));
    }

    // View mode
    document.querySelectorAll('.lvm-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lvm-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            viewMode = btn.dataset.mode;
        });
    });

    // Reset
    document.getElementById('lab-full-reset')?.addEventListener('click', () => {
        currentStep = 0; stepProgress = [0, 0, 0, 0]; particles = []; chainData = []; fiberData = []; chartHistory = [];
        for (let i = 1; i <= 4; i++) {
            const b = document.getElementById('lsc-' + i);
            const s = document.getElementById('sc-step-' + i);
            if (b) { b.textContent = i === 1 ? '▶ RUN' : '🔒'; b.disabled = i !== 1; }
            if (s) { s.classList.remove('active', 'completed'); if (i > 1) s.classList.add('locked'); else s.classList.remove('locked'); }
            const p = document.getElementById('lscp-' + i); if (p) p.style.width = '0%';
        }
        const ring = document.getElementById('lab-ring-progress'); if (ring) ring.style.strokeDashoffset = '213.6';
        const pw = document.getElementById('lcp-power'); if (pw) pw.textContent = '● STANDBY';
        const title = document.getElementById('lmd-title'); if (title) title.textContent = 'MOLECULAR VIEW — STANDBY';
        const ltLines = document.getElementById('lt-lines');
        if (ltLines) { ltLines.innerHTML = '<div class="lt-line"><span class="lt-t">[00:00]</span> Sistem resetat. Standby.</div>'; }
        ['ldp-monomers', 'ldp-chains', 'ldp-mw', 'ldp-conv', 'ldp-hcl', 'ldp-str'].forEach(id => {
            const el = document.getElementById(id); if (el) el.textContent = id.includes('conv') ? '0%' : id.includes('mw') || id.includes('str') ? '—' : '0';
        });
        updateGauges(); drawMiniChart();
    });
})();

// ================================================================
// RGB CADRAN RING — timeline year display
// ================================================================
(function initCadranRing() {
    function tryInit() {
        const canvas = document.getElementById('cadran-ring-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = 160, H = 160;
        canvas.width = W; canvas.height = H;
        let hue = 0;
        let tick = 0;

        function draw() {
            ctx.clearRect(0, 0, W, H);
            const cx = W / 2, cy = H / 2;

            // Outer RGB spinning arc
            for (let seg = 0; seg < 60; seg++) {
                const startA = (tick * 0.03) + (seg / 60) * Math.PI * 2;
                const endA = startA + Math.PI * 2 / 60;
                const h = (hue + seg * 6) % 360;
                ctx.beginPath();
                ctx.arc(cx, cy, 72, startA, endA + 0.01);
                ctx.strokeStyle = `hsl(${h},100%,60%)`;
                ctx.lineWidth = 5;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsl(${h},100%,60%)`;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Inner static ring
            ctx.beginPath();
            ctx.arc(cx, cy, 62, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Outer dot ring
            for (let i = 0; i < 12; i++) {
                const a = (tick * 0.02) + i * Math.PI / 6;
                const dx = cx + Math.cos(a) * 76;
                const dy = cy + Math.sin(a) * 76;
                const dh = (hue + i * 30) % 360;
                ctx.beginPath();
                ctx.arc(dx, dy, i % 3 === 0 ? 2.5 : 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${dh},100%,65%)`;
                ctx.shadowBlur = 6; ctx.shadowColor = `hsl(${dh},100%,65%)`;
                ctx.fill(); ctx.shadowBlur = 0;
            }

            tick++;
            hue = (hue + 0.5) % 360;
            requestAnimationFrame(draw);
        }
        draw();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 100);
    }
})();

// ================================================================
// CADRAN BG CANVAS — particle web background for nav buttons
// ================================================================
(function initCadranBg() {
    function tryInit() {
        const canvas = document.getElementById('cadran-bg-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        let W, H;
        const pts = [];
        let hue = 0;

        function resize() {
            W = parent.offsetWidth; H = parent.offsetHeight;
            canvas.width = W; canvas.height = H;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 40; i++) {
            pts.push({
                x: Math.random() * 1000,
                y: Math.random() * 300,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                h: Math.random() * 360
            });
        }

        function draw() {
            if (!parent.offsetParent && parent.offsetWidth === 0) { requestAnimationFrame(draw); return; }
            if (W !== parent.offsetWidth) resize();
            ctx.clearRect(0, 0, W, H);

            // Draw connections
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x * W / 1000, pts[i].y * H / 300);
                        ctx.lineTo(pts[j].x * W / 1000, pts[j].y * H / 300);
                        const h = (pts[i].h + hue) % 360;
                        ctx.strokeStyle = `hsla(${h},90%,60%,${(1 - dist / 120) * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > 1000) p.vx *= -1;
                if (p.y < 0 || p.y > 300) p.vy *= -1;
                const px = p.x * W / 1000, py = p.y * H / 300;
                const h = (p.h + hue) % 360;
                ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${h},100%,65%)`;
                ctx.shadowBlur = 4; ctx.shadowColor = `hsl(${h},100%,65%)`;
                ctx.fill(); ctx.shadowBlur = 0;
            });

            hue = (hue + 0.2) % 360;
            requestAnimationFrame(draw);
        }
        draw();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 50);
    }
})();

// ================================================================
// PPTA Mw vs Conversion — animated chart (screenshot 3 replica)
// ================================================================
(function initPPTAChart() {
    function tryInit() {
        const canvas = document.getElementById('ppta-mw-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animProgress = 0; // 0 → 1 drive the draw animation
        let running = false;
        let rafId = null;

        const MW_TARGET = 50040;
        const PAD = { top: 60, right: 60, bottom: 60, left: 80 };

        function resize() {
            canvas.width = canvas.offsetWidth || 900;
            canvas.height = canvas.offsetHeight || 340;
        }
        resize();
        window.addEventListener('resize', () => { resize(); draw(); });

        // Carothers equation: Mw = M0 / (1 - p) where p = conversion/100
        function mwAtConv(conv) {
            const p = Math.min(conv / 100, 0.9998);
            const M0 = 239.27; // PPTA repeat unit
            return M0 / (1 - p);
        }

        function draw() {
            const W = canvas.width, H = canvas.height;
            const chartW = W - PAD.left - PAD.right;
            const chartH = H - PAD.top - PAD.bottom;
            const maxMw = 65000;
            const maxConv = 100;
            const t = animProgress; // 0-1 controls how much of the curve is drawn

            ctx.clearRect(0, 0, W, H);

            // Background
            ctx.fillStyle = '#0d1117';
            ctx.fillRect(0, 0, W, H);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            const yTicks = [0, 10000, 20000, 30000, 40000, 50000, 60000];
            const xTicks = [0, 20, 40, 60, 80, 100];

            yTicks.forEach(val => {
                const y = PAD.top + chartH - (val / maxMw) * chartH;
                ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + chartW, y); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.45)';
                ctx.font = '11px Share Tech Mono, monospace';
                ctx.textAlign = 'right';
                ctx.fillText(val.toLocaleString(), PAD.left - 6, y + 4);
            });

            xTicks.forEach(val => {
                const x = PAD.left + (val / maxConv) * chartW;
                ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + chartH); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.45)';
                ctx.font = '11px Share Tech Mono, monospace';
                ctx.textAlign = 'center';
                ctx.fillText(val, x, PAD.top + chartH + 16);
            });

            // Axes
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(PAD.left, PAD.top); ctx.lineTo(PAD.left, PAD.top + chartH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(PAD.left, PAD.top + chartH); ctx.lineTo(PAD.left + chartW, PAD.top + chartH); ctx.stroke();

            // Target dashed line at MW_TARGET
            const targetY = PAD.top + chartH - (MW_TARGET / maxMw) * chartH;
            ctx.strokeStyle = '#e8c547';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 5]);
            ctx.beginPath(); ctx.moveTo(PAD.left, targetY); ctx.lineTo(PAD.left + chartW, targetY); ctx.stroke();
            ctx.setLineDash([]);

            // Target label
            ctx.fillStyle = '#e8c547';
            ctx.font = '10px Share Tech Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText('50,000', PAD.left + 4, targetY - 5);

            // Main curve — draw up to animProgress
            const steps = 400;
            const drawUpTo = Math.floor(t * steps);

            ctx.beginPath();
            let startX, startY;
            for (let i = 0; i <= drawUpTo; i++) {
                const conv = (i / steps) * 100;
                const mw = mwAtConv(conv);
                const x = PAD.left + (conv / maxConv) * chartW;
                const y = PAD.top + chartH - Math.min(mw / maxMw, 1) * chartH;
                if (i === 0) { ctx.moveTo(x, y); startX = x; startY = y; }
                else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = '#00ffcc';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 10; ctx.shadowColor = '#00ffcc';
            ctx.stroke(); ctx.shadowBlur = 0;

            // Glow trail at tip
            if (drawUpTo > 0) {
                const tipConv = (drawUpTo / steps) * 100;
                const tipMw = mwAtConv(tipConv);
                const tipX = PAD.left + (tipConv / maxConv) * chartW;
                const tipY = PAD.top + chartH - Math.min(tipMw / maxMw, 1) * chartH;

                const grad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 14);
                grad.addColorStop(0, 'rgba(0,255,204,0.9)');
                grad.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
                ctx.fillStyle = grad; ctx.fill();

                ctx.beginPath(); ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff'; ctx.fill();
            }

            // Intersection red dot (at ~99.9% conversion)
            if (t > 0.99) {
                const intX = PAD.left + (99.9 / maxConv) * chartW;
                const intY = targetY;
                ctx.beginPath(); ctx.arc(intX, intY, 7, 0, Math.PI * 2);
                ctx.fillStyle = '#ff3333'; ctx.shadowBlur = 12; ctx.shadowColor = '#ff3333';
                ctx.fill(); ctx.shadowBlur = 0;
            }

            // Vertical dashed line at ~99.9%
            const vtX = PAD.left + (99.9 / maxConv) * chartW;
            ctx.strokeStyle = 'rgba(232,197,71,0.5)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(vtX, PAD.top); ctx.lineTo(vtX, PAD.top + chartH); ctx.stroke();
            ctx.setLineDash([]);
        }

        // Animate on scroll into view
        let animated = false;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && !animated) {
                    animated = true;
                    running = true;
                    startAnim();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(canvas);

        function startAnim() {
            animProgress = 0;
            function step() {
                if (!running) return;
                animProgress = Math.min(animProgress + 0.003, 1);

                // Update stats
                const conv = animProgress * 100;
                const mw = mwAtConv(conv);
                const rsConv = document.getElementById('rs-conv');
                const rsMw = document.getElementById('rs-mw');
                const rsTemp = document.getElementById('rs-temp');
                const rsHcl = document.getElementById('rs-hcl');
                if (rsConv) rsConv.textContent = conv.toFixed(1) + '%';
                if (rsMw) rsMw.textContent = Math.round(mw).toLocaleString() + ' g/mol';
                if (rsTemp) rsTemp.textContent = conv < 30 ? '-10°C' : conv < 70 ? '40°C' : '80°C';
                if (rsHcl) rsHcl.textContent = (conv * 0.36).toFixed(1) + ' mol';

                draw();
                if (animProgress < 1) rafId = requestAnimationFrame(step);
                else {
                    const startBtn = document.getElementById('rs-start');
                    if (startBtn) startBtn.textContent = '✅ COMPLET';
                }
            }
            step();
        }

        // Button controls still work
        document.getElementById('rs-start')?.addEventListener('click', () => {
            running = true;
            animated = true;
            if (animProgress >= 1) animProgress = 0;
            startAnim();
        });
        document.getElementById('rs-reset')?.addEventListener('click', () => {
            running = false; animated = false;
            animProgress = 0;
            if (rafId) cancelAnimationFrame(rafId);
            ['rs-mw', 'rs-conv', 'rs-hcl'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = id === 'rs-conv' ? '0%' : id === 'rs-hcl' ? '0 mol' : '0';
            });
            const rsTemp = document.getElementById('rs-temp');
            if (rsTemp) rsTemp.textContent = '-10°C';
            const startBtn = document.getElementById('rs-start');
            if (startBtn) startBtn.textContent = '▶ START';
            draw();
        });

        draw();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 200);
    }
})();

// ================================================================
// GAUGE FIX — redraw at smaller radius to stay in cadran
// ================================================================
(function patchGaugeSize() {
    const orig = window._origDrawGauge;
    // Patch the canvas width/height attr on init
    document.addEventListener('DOMContentLoaded', () => {
        ['gc-temp', 'gc-press', 'gc-ph'].forEach(id => {
            const c = document.getElementById(id);
            if (c) { c.width = 80; c.height = 80; c.style.width = '80px'; c.style.height = '80px'; }
        });
    });
})();


// ================================================================
// TBTN → HUD PANEL TOGGLE (bottom-right technical data button)
// ================================================================
(function initTbtnToggle() {
    function tryInit() {
        const tbtn = document.getElementById('tbtn');
        const hud = document.getElementById('hud');
        const hcl = document.getElementById('hcl');
        if (!tbtn || !hud) return;

        tbtn.addEventListener('click', () => {
            hud.classList.toggle('on');
        });
        if (hcl) {
            hcl.addEventListener('click', () => {
                hud.classList.remove('on');
            });
        }

        // Update HUD data every frame
        let lastT = performance.now();
        let frameCount = 0;
        let fps = 0;

        function hudUpdate() {
            frameCount++;
            const now = performance.now();
            if (now - lastT >= 500) {
                fps = Math.round(frameCount / ((now - lastT) / 1000));
                frameCount = 0;
                lastT = now;

                // Update FPS displays
                const hfps = document.getElementById('hfps');
                const fpsNum = document.getElementById('fps-num');
                const fpsCounter = document.getElementById('fps-counter');
                if (hfps) hfps.textContent = fps;
                if (fpsNum) fpsNum.textContent = fps;
                if (fpsCounter) fpsCounter.textContent = fps;

                // FPS arc (157 = full circle dash)
                const fpsArc = document.getElementById('fps-arc');
                if (fpsArc) {
                    const pct = Math.min(fps / 60, 1);
                    fpsArc.setAttribute('stroke-dashoffset', 157 * (1 - pct));
                    fpsArc.setAttribute('stroke', fps > 45 ? '#00ffcc' : fps > 30 ? '#ffcc00' : '#ff4444');
                }

                // Badge
                const fpsBadge = document.getElementById('fps-badge');
                if (fpsBadge) {
                    fpsBadge.style.display = 'flex';
                }
            }

            // Camera position — read from existing display or simulate
            const camX = parseFloat(document.getElementById('cam-x')?.textContent || '0');
            const camY = parseFloat(document.getElementById('cam-y')?.textContent || '0');
            const camZ = parseFloat(document.getElementById('cam-z')?.textContent || '22');

            const hcx = document.getElementById('hcx');
            const hcy = document.getElementById('hcy');
            const hcz = document.getElementById('hcz');
            if (hcx) hcx.textContent = camX.toFixed(3);
            if (hcy) hcy.textContent = camY.toFixed(3);
            if (hcz) hcz.textContent = camZ.toFixed(3);

            // Axis fill bars
            const axX = document.getElementById('hax-fill');
            const axY = document.getElementById('hay-fill');
            const axZ = document.getElementById('haz-fill');
            if (axX) axX.style.width = Math.abs(camX / 20) * 100 + '%';
            if (axY) axY.style.width = Math.abs(camY / 20) * 100 + '%';
            if (axZ) axZ.style.width = Math.abs(camZ / 30) * 100 + '%';

            // Uptime clock
            const hts = document.getElementById('hts');
            if (hts) {
                const elapsed = Math.floor(performance.now() / 1000);
                const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
                const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
                const s = String(elapsed % 60).padStart(2, '0');
                hts.textContent = `${h}:${m}:${s}`;
            }

            requestAnimationFrame(hudUpdate);
        }
        hudUpdate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 300);
    }
})();

// ================================================================
// TBTN — RGB particle orbit canvas
// ================================================================
(function initTbtnCanvas() {
    function tryInit() {
        const canvas = document.getElementById('tbtn-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const SIZE = 104; // 88 + 2*8
        canvas.width = SIZE; canvas.height = SIZE;
        const cx = SIZE / 2, cy = SIZE / 2;
        let hue = 0, tick = 0;

        // Orbital particles
        const particles = [];
        for (let i = 0; i < 14; i++) {
            particles.push({
                angle: (i / 14) * Math.PI * 2,
                radius: 44 + (i % 3) * 4,
                speed: 0.018 + (i % 4) * 0.006,
                size: 1.5 + (i % 3) * 0.8,
                hOffset: i * 26
            });
        }

        function draw() {
            ctx.clearRect(0, 0, SIZE, SIZE);

            particles.forEach(p => {
                p.angle += p.speed;
                const x = cx + Math.cos(p.angle) * p.radius;
                const y = cy + Math.sin(p.angle) * p.radius;
                const h = (hue + p.hOffset) % 360;

                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${h},100%,65%)`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsl(${h},100%,65%)`;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Trail
                for (let t = 1; t <= 3; t++) {
                    const ta = p.angle - p.speed * t * 2.5;
                    const tx2 = cx + Math.cos(ta) * p.radius;
                    const ty2 = cy + Math.sin(ta) * p.radius;
                    ctx.beginPath();
                    ctx.arc(tx2, ty2, p.size * (1 - t * 0.25), 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${h},100%,65%,${0.3 - t * 0.08})`;
                    ctx.fill();
                }
            });

            hue = (hue + 0.4) % 360;
            tick++;
            requestAnimationFrame(draw);
        }
        draw();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 100);
    }
})();

// ================================================================
// HUD DASHBOARD — LIVE DATA ANIMATION (v2 — Gemini fixes)
// ================================================================
(function initHudDashboard() {
    function tryInit() {

        // ── Environmental mode state ──
        let envMode = 'dry'; // 'dry' | 'wet'

        // ── Stress/strain mini canvas ──
        const ssCanvas = document.getElementById('hud-stress-canvas');
        if (ssCanvas) {
            const sCtx = ssCanvas.getContext('2d');
            let stTick = 0;
            // Bigger padding for clear axis labels
            const PAD_L = 72, PAD_B = 40, PAD_T = 20, PAD_R = 24;

            function drawStressStrain() {
                const W = ssCanvas.width, H = ssCanvas.height;
                const cW = W - PAD_L - PAD_R, cH = H - PAD_T - PAD_B;
                sCtx.clearRect(0, 0, W, H);

                // Dark background for chart area
                sCtx.fillStyle = 'rgba(0,6,5,0.85)';
                sCtx.fillRect(0, 0, W, H);
                sCtx.fillStyle = 'rgba(0,255,180,0.03)';
                sCtx.fillRect(PAD_L, PAD_T, cW, cH);

                // Wet mode: fracture at 2.2%, dry at 2.4%
                const fracturePct = envMode === 'wet' ? 0.022 : 0.024;
                const lineColor = envMode === 'wet' ? '#44aaff' : '#00ffcc';

                // Fracture point in canvas space
                const fracX = PAD_L + (fracturePct / 0.030) * cW;
                const fracY = PAD_T;   // top = 3620 MPa

                // ── GRID (dashed) ──
                sCtx.setLineDash([2, 5]);
                sCtx.lineWidth = 0.8;
                // Vertical
                for (let i = 0; i <= 4; i++) {
                    const x = PAD_L + (i / 4) * cW;
                    sCtx.strokeStyle = i === Math.round((fracturePct / 0.030) * 4)
                        ? 'rgba(255,80,80,0.15)' : 'rgba(0,255,200,0.08)';
                    sCtx.beginPath(); sCtx.moveTo(x, PAD_T); sCtx.lineTo(x, PAD_T + cH); sCtx.stroke();
                }
                // Horizontal
                for (let i = 0; i <= 3; i++) {
                    const y = PAD_T + (i / 3) * cH;
                    sCtx.strokeStyle = 'rgba(0,255,200,0.08)';
                    sCtx.beginPath(); sCtx.moveTo(PAD_L, y); sCtx.lineTo(PAD_L + cW, y); sCtx.stroke();
                }
                sCtx.setLineDash([]);

                // ── AXES ──
                sCtx.strokeStyle = 'rgba(255,255,255,0.4)';
                sCtx.lineWidth = 1.2;
                // Y axis
                sCtx.beginPath(); sCtx.moveTo(PAD_L, PAD_T); sCtx.lineTo(PAD_L, PAD_T + cH); sCtx.stroke();
                // X axis
                sCtx.beginPath(); sCtx.moveTo(PAD_L, PAD_T + cH); sCtx.lineTo(PAD_L + cW, PAD_T + cH); sCtx.stroke();

                // ── FILL UNDER CURVE (energy stored) ──
                sCtx.beginPath();
                sCtx.moveTo(PAD_L, PAD_T + cH);
                sCtx.lineTo(fracX, fracY);
                sCtx.lineTo(fracX, PAD_T + cH);
                sCtx.closePath();
                const fillGrad = sCtx.createLinearGradient(PAD_L, 0, fracX, 0);
                fillGrad.addColorStop(0, envMode === 'wet' ? 'rgba(68,170,255,0.06)' : 'rgba(0,255,200,0.06)');
                fillGrad.addColorStop(1, 'rgba(255,68,68,0.12)');
                sCtx.fillStyle = fillGrad;
                sCtx.fill();

                // ── SEGMENT 1: pure straight diagonal (0,0) → fracture ──
                // This is the scientifically correct Kevlar curve: purely linear-elastic, no plateau
                const diagGrad = sCtx.createLinearGradient(PAD_L, PAD_T + cH, fracX, fracY);
                diagGrad.addColorStop(0, envMode === 'wet' ? 'rgba(68,170,255,0.9)' : 'rgba(0,255,200,0.9)');
                diagGrad.addColorStop(0.65, envMode === 'wet' ? '#88ccff' : '#c8f047');
                diagGrad.addColorStop(1, '#ff5533');

                sCtx.beginPath();
                sCtx.moveTo(PAD_L, PAD_T + cH);   // origin
                sCtx.lineTo(fracX, fracY);          // fracture point — top
                sCtx.strokeStyle = diagGrad;
                sCtx.lineWidth = 4;
                sCtx.shadowBlur = 16; sCtx.shadowColor = lineColor;
                sCtx.stroke(); sCtx.shadowBlur = 0;

                // ── SEGMENT 2: instant vertical drop (brittle fracture) ──
                sCtx.beginPath();
                sCtx.moveTo(fracX, fracY);
                sCtx.lineTo(fracX, PAD_T + cH);
                sCtx.strokeStyle = 'rgba(255,55,55,0.95)';
                sCtx.lineWidth = 3.5;
                sCtx.shadowBlur = 14; sCtx.shadowColor = '#ff3322';
                sCtx.stroke(); sCtx.shadowBlur = 0;

                // ── FRACTURE DOT ──
                const pulse = 0.5 + 0.5 * Math.sin(stTick * 0.09);
                // Outer glow ring
                sCtx.beginPath(); sCtx.arc(fracX, fracY, 12 + pulse * 6, 0, Math.PI * 2);
                sCtx.strokeStyle = `rgba(255,50,50,${0.25 + pulse * 0.25})`;
                sCtx.lineWidth = 1.5; sCtx.stroke();
                // Inner dot
                sCtx.beginPath(); sCtx.arc(fracX, fracY, 7, 0, Math.PI * 2);
                sCtx.fillStyle = '#ff3333';
                sCtx.shadowBlur = 14; sCtx.shadowColor = '#ff0000';
                sCtx.fill(); sCtx.shadowBlur = 0;

                // ── AXIS LABELS — clear and bigger ──
                sCtx.font = 'bold 14px Share Tech Mono, monospace';

                // Y axis rotated label
                sCtx.save();
                sCtx.translate(16, PAD_T + cH / 2);
                sCtx.rotate(-Math.PI / 2);
                sCtx.fillStyle = 'rgba(255,255,255,0.65)';
                sCtx.textAlign = 'center';
                sCtx.fillText('Stress (MPa)', 0, 0);
                sCtx.restore();

                // Y tick values
                sCtx.font = '12px Share Tech Mono, monospace';
                sCtx.fillStyle = 'rgba(255,255,255,0.55)';
                sCtx.textAlign = 'right';
                [['3620', 0], ['2413', 1 / 3], ['1207', 2 / 3], ['0', 1]].forEach(([v, f]) => {
                    sCtx.fillText(v, PAD_L - 3, PAD_T + f * cH + 4);
                });

                // X axis label
                sCtx.font = 'bold 14px Share Tech Mono, monospace';
                sCtx.fillStyle = 'rgba(255,255,255,0.65)';
                sCtx.textAlign = 'center';
                sCtx.fillText('Strain (%)', PAD_L + cW / 2, H - 1);

                // X tick values
                sCtx.font = '12px Share Tech Mono, monospace';
                sCtx.fillStyle = 'rgba(255,255,255,0.55)';
                ['0', '0.75', '1.5', '2.25', '3.0'].forEach((v, i) => {
                    sCtx.textAlign = 'center';
                    sCtx.fillText(v, PAD_L + (i / 4) * cW, PAD_T + cH + 18);
                });

                // Fracture % label on X axis (highlighted)
                sCtx.font = 'bold 13px Share Tech Mono, monospace';
                sCtx.fillStyle = '#ff6644';
                sCtx.textAlign = 'center';
                sCtx.shadowBlur = 4; sCtx.shadowColor = '#ff3300';
                sCtx.fillText(`${(fracturePct * 100).toFixed(1)}%`, fracX, PAD_T + cH + 18);
                sCtx.shadowBlur = 0;

                // Top-right: max stress annotation
                sCtx.font = '12px Share Tech Mono, monospace';
                sCtx.fillStyle = 'rgba(255,220,80,0.85)';
                sCtx.textAlign = 'right';
                sCtx.fillText('3620 MPa ▲', PAD_L + cW - 4, PAD_T + 16);

                // Wet mode badge
                if (envMode === 'wet') {
                    sCtx.font = 'bold 12px Share Tech Mono, monospace';
                    sCtx.fillStyle = 'rgba(68,170,255,0.9)';
                    sCtx.textAlign = 'left';
                    sCtx.fillText('💧 WET', PAD_L + 3, PAD_T + 8);
                }

                stTick++;
                requestAnimationFrame(drawStressStrain);
            }
            drawStressStrain();
        }

        // ── Live data ──
        let uvHours = 0;
        let thermalSim = 25;
        let integrityVal = 100;
        let bfdSim = 44;

        function updateHudData() {
            const t = performance.now() * 0.001;
            const isWet = envMode === 'wet';

            // Thermal
            thermalSim = 25 + Math.abs(Math.sin(t * 0.08)) * 55;
            const thermalPct = (thermalSim / 450) * 100;
            const tBar = document.getElementById('h-thermal-bar');
            const tVal = document.getElementById('h-temp-val');
            if (tBar) tBar.style.width = thermalPct + '%';
            if (tVal) tVal.textContent = `${Math.round(thermalSim)}°C / 450°C`;

            // UV — color: green (low) → orange → red (high = dangerous)
            uvHours = Math.min(1000, (t * 0.5) % 1000);
            const uvPct = (uvHours / 1000) * 100;
            const uvBar = document.getElementById('h-uv-bar');
            const uvVal = document.getElementById('h-uv-val');
            if (uvBar) {
                uvBar.style.width = uvPct + '%';
                // Correct color logic: green safe → yellow caution → red danger
                const uvColor = uvPct < 30
                    ? `rgba(0,255,136,0.85)`
                    : uvPct < 65
                        ? `rgba(255,200,0,0.85)`
                        : `rgba(255,60,60,0.9)`;
                uvBar.style.background = uvColor;
                uvBar.style.boxShadow = `0 0 6px ${uvColor}`;
            }
            if (uvVal) uvVal.textContent = `${Math.round(uvHours)} h / 1000 h`;

            // Integrity
            integrityVal = Math.max(80, 100 - uvPct * 0.2);
            const intArc = document.getElementById('integrity-arc');
            const intEl = document.getElementById('h-integrity');
            if (intArc) {
                intArc.setAttribute('stroke-dashoffset', 157 * (1 - integrityVal / 100));
                intArc.setAttribute('stroke', integrityVal > 95 ? '#00ff88' : integrityVal > 88 ? '#ffcc00' : '#ff4444');
            }
            if (intEl) intEl.textContent = Math.round(integrityVal) + '%';

            // V50 — wet reduces it by ~6%
            const v50Base = isWet ? 414 : 440;
            const v50El = document.getElementById('h-v50');
            if (v50El) {
                const liveV50 = v50Base + Math.round(Math.sin(t * 0.3) * 3);
                v50El.textContent = liveV50 + ' m/s';
                v50El.style.color = isWet ? '#ff9900' : '#00ffcc';
            }

            // BFD — wet increases slightly
            const bfdBase = isWet ? 47 : 44;
            bfdSim = bfdBase - Math.abs(Math.sin(t * 0.15)) * 3;
            const bfdEl = document.getElementById('h-bfd');
            const bfdBar = document.getElementById('h-bfd-bar');
            if (bfdEl) {
                bfdEl.textContent = bfdSim.toFixed(1) + ' mm';
                bfdEl.style.color = isWet ? '#ff4444' : '#ff9900';
            }
            if (bfdBar) bfdBar.style.width = (bfdSim / 100 * 100) + '%';

            // Elongation — wet slightly higher
            const elongEl = document.getElementById('h-elong');
            if (elongEl) elongEl.textContent = isWet ? '2.6%' : '2.4%';

            // Ammo cycling
            const ammos = ['.44 MAG', '9mm FMJ', '.357 SIG', '10mm AUTO'];
            const ammoEl = document.getElementById('h-ammo');
            if (ammoEl) ammoEl.textContent = ammos[Math.floor(t / 8) % ammos.length];

            setTimeout(updateHudData, 200);
        }
        updateHudData();

        // ── Environmental toggle button click ──
        document.addEventListener('click', function (e) {
            if (e.target.closest('#env-toggle-btn')) {
                envMode = envMode === 'dry' ? 'wet' : 'dry';
                const btn = document.getElementById('env-toggle-btn');
                const badge = document.getElementById('env-mode-badge');
                const indicator = document.getElementById('env-indicator');
                if (btn) {
                    btn.style.borderColor = envMode === 'wet' ? '#44aaff' : '#00ff88';
                    btn.style.color = envMode === 'wet' ? '#44aaff' : '#00ff88';
                }
                if (badge) badge.textContent = envMode === 'wet' ? '💧 WET / HUMID' : '☀ DRY / NOMINAL';
                if (indicator) {
                    indicator.textContent = envMode === 'wet'
                        ? '⚠ V50 −6% | BFD +7% | Elongation +0.2%'
                        : '✓ ALL VALUES NOMINAL';
                    indicator.style.color = envMode === 'wet' ? '#ff9900' : '#00ff88';
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 400);
    }
})();