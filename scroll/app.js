/* ═══════════════════════════════════════════════════════════
   KEVLAR CINEMATIC v4 — AAA Cinematic Upgrade
   Three.js r128 + GSAP + ScrollTrigger + Post-Processing
   ═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── CURSOR ─────────────────────────────────────────────── */
const cur = document.getElementById('cur'),
  ring = document.getElementById('cur-ring');
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY });
(function ac() {
  rx += (mx - rx) * .07; ry += (my - ry) * .07;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(ac);
})();

/* ── LOADER ─────────────────────────────────────────────── */
let pct = 0;
const lnum = document.getElementById('lnum'),
  lfill = document.getElementById('lfill'),
  ldr = document.getElementById('ldr');

// Track model loading progress
let modelsToLoad = 4; // kevlar(S2), lab, f1, rocket
let modelsLoaded = 0;
const loadStatusEl = document.getElementById('load-status');
function onModelLoaded(name) {
  modelsLoaded++;
  if (loadStatusEl) loadStatusEl.textContent = '[ SYSTEM KEVLAR CHECK: COMPLETE ] ' + (modelsLoaded + '/' + modelsToLoad);
}

const ldI = setInterval(() => {
  pct += Math.random() * 2 + .4;
  if (pct >= 100) { pct = 100; clearInterval(ldI); setTimeout(boot, 500); }
  lnum.textContent = Math.floor(pct);
  lfill.style.width = pct + '%';
}, 55);

function boot() {
  gsap.to(ldr, { opacity: 0, duration: 1.2, ease: 'expo.inOut', onComplete: () => ldr.style.display = 'none' });
  setTimeout(() => {
    gsap.to('#hero-eye', { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
    gsap.to('#htitle', { opacity: 1, y: 0, duration: 1.2, delay: .2, ease: 'expo.out' });
    gsap.to('#hsub', { opacity: 1, y: 0, duration: 1, delay: .45, ease: 'expo.out' });
    gsap.to('#hstats', { opacity: 1, y: 0, duration: 1, delay: .6, ease: 'expo.out' });
    gsap.to('#hscroll', { opacity: 1, y: 0, duration: 1, delay: .8, ease: 'expo.out' });
  }, 300);
}

/* ── PROGRESS BAR (RGB gradient) ─────────────────────── */
const progEl = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - innerHeight);
  const hue = p * 280;
  progEl.style.width = (p * 100) + '%';
  progEl.style.background = `linear-gradient(90deg,hsl(${hue},100%,60%),hsl(${hue + 60},100%,50%))`;
});

/* ── FLASH ────────────────────────────────────────────── */
function flash(i) { gsap.fromTo('#flash', { opacity: i || .25 }, { opacity: 0, duration: .7, ease: 'expo.in' }) }

/* ── SECTION LABELS ───────────────────────────────────── */
const secMap = {
  s1: { l: 'INTRO — KEVLAR', n: '01 / 07' },
  s2: { l: 'INDUSTRIAL SYNTHESIS', n: '02 / 07' },
  s3: { l: 'BALLISTIC IMPACT', n: '03 / 07' },
  s4: { l: 'VIRTUAL LABORATORY', n: '04 / 07' },
  s5: { l: 'FORMULA 1', n: '05 / 07' },
  s6: { l: 'NASA — ORBITAL', n: '06 / 07' },
  s7: { l: 'FINALE', n: '07 / 07' }
};
const slbl = document.getElementById('slbl'), snum = document.getElementById('snum');
Object.entries(secMap).forEach(([id, m]) => {
  ScrollTrigger.create({
    trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%',
    onEnter: () => { slbl.textContent = m.l; snum.textContent = m.n },
    onEnterBack: () => { slbl.textContent = m.l; snum.textContent = m.n }
  });
});

/* ── ANIMATE IN ───────────────────────────────────────── */
document.querySelectorAll('.ai').forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' }
  });
});
['#s2', '#s3', '#s4', '#s5', '#s6', '#s7'].forEach(id => {
  ScrollTrigger.create({ trigger: id, start: 'top 55%', onEnter: () => flash(.18), once: true });
});

/* ═══════════════════════════════════════════════════════════
   THREE.JS — RENDERER SETUP + POST-PROCESSING
   ═══════════════════════════════════════════════════════════ */
const canvas = document.getElementById('c3d');
const W = () => innerWidth, H = () => innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(W(), H());
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.setClearColor(0x000005, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000008, .002);
const camera = new THREE.PerspectiveCamera(48, W() / H(), .1, 15000);
camera.position.set(0, 0, 22);

/* ── POST-PROCESSING (Bloom) ── */
let composer = null;
try {
  composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(W(), H()), 0.35, 0.6, 0.85
  );
  composer.addPass(bloomPass);
  // Store for per-scene tuning
  window._bloomPass = bloomPass;
  console.log('✓ Post-processing pipeline initialized (Bloom)');
} catch(e) {
  console.warn('Post-processing unavailable, falling back to standard renderer:', e);
}

/* ── AMBIENT SOUND SYSTEM ── */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = false;
const soundOscillators = {};
function createDrone(freq, gain, type) {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  g.gain.value = 0;
  osc.connect(g); g.connect(audioCtx.destination);
  osc.start();
  return { osc, gain: g, targetGain: 0 };
}
soundOscillators.spaceHum = createDrone(55, 0, 'sine');
soundOscillators.spaceSub = createDrone(35, 0, 'sine');

// F1 Engine Sound (User provided)
let f1EngineAudio = null;
try {
  f1EngineAudio = new Audio('f1.mp3');
  f1EngineAudio.loop = true;
  f1EngineAudio.volume = 0;
} catch(e) { console.warn('Audio f1.mp3 not found or blocked'); }

// Rocket Engine Sound
let rocketLaunchAudio = null;
try {
  rocketLaunchAudio = new Audio('rocket.mp3');
  rocketLaunchAudio.loop = true;
  rocketLaunchAudio.volume = 0;
} catch(e) { console.warn('Audio rocket.mp3 not found or blocked'); }

const soundBtn = document.getElementById('sound-toggle');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundBtn.classList.add('active');
      audioCtx.resume();
    } else {
      soundBtn.classList.remove('active');
    }
  });
}
function updateSound(key, target) {
  if (!soundEnabled) target = 0;
  if (key === 'f1Audio') {
    if (f1EngineAudio) {
      if (soundEnabled && target > 0 && f1EngineAudio.paused) f1EngineAudio.play().catch(()=>{});
      gsap.to(f1EngineAudio, { volume: Math.min(target, 0.4), duration: 0.3 });
    }
    return;
  }
  if (key === 'rocketAudio') {
    if (rocketLaunchAudio) {
      if (soundEnabled && target > 0 && rocketLaunchAudio.paused) rocketLaunchAudio.play().catch(()=>{});
      gsap.to(rocketLaunchAudio, { volume: Math.min(target, 0.45), duration: 0.3 });
    }
    return;
  }
  const s = soundOscillators[key];
  if (s) s.gain.gain.linearRampToValueAtTime(Math.min(target, 0.06), audioCtx.currentTime + 0.3);
}

/* ── MOUSE PARALLAX ── */
let mouseParX = 0, mouseParY = 0;
document.addEventListener('mousemove', e => {
  mouseParX = (e.clientX / innerWidth - 0.5) * 2;
  mouseParY = (e.clientY / innerHeight - 0.5) * 2;
});

/* ── GLOBAL LIGHTS ── */
scene.add(new THREE.AmbientLight(0xffffff, .3));
scene.add(new THREE.HemisphereLight(0x8888cc, 0x443322, .35));
const sunL = new THREE.DirectionalLight(0xffd59a, 3.5);
sunL.position.set(8, 14, 10);
sunL.castShadow = true;
scene.add(sunL);
const rimL = new THREE.DirectionalLight(0x3344aa, .8);
rimL.position.set(-12, -6, -10);
scene.add(rimL);
const ptC = new THREE.PointLight(0x00ffee, 8, 70);
scene.add(ptC);
const ptP = new THREE.PointLight(0xcc44ff, 7, 60);
scene.add(ptP);
const ptG = new THREE.PointLight(0xffc844, 6, 55);
scene.add(ptG);

/* ═══════════════════════════════════════════════════════════
   CINEMATIC CAMERA SYSTEM — Upgraded with inertia + parallax
   ═══════════════════════════════════════════════════════════ */
const camTgt = { x: 0, y: 0, z: 22, lx: 0, ly: 0, lz: 0 };
const camCur = { x: 0, y: 0, z: 22, lx: 0, ly: 0, lz: 0 };
const globalCarPos = new THREE.Vector3(0, 0, 0);
let snapCamera = false;
let shakeStr = 0;
const CAM_LERP = .028; // Slower for more cinematic feel
const CAM_LOOK_LERP = .022; // Even slower for look-at (dreamy target shift)
let camMouseX = 0, camMouseY = 0; // Smoothed mouse parallax

/* Per-scene exposure/bloom targets */
const sceneSettings = {
  s1: { exposure: 1.2, bloomStr: 0 },
  s2: { exposure: 1.2, bloomStr: 0 },
  s3: { exposure: 1.2, bloomStr: 0 },
  s4: { exposure: 1.2, bloomStr: 0 },
  s5: { exposure: 2.8, bloomStr: 0 },
  s6: { exposure: 1.2, bloomStr: 0 },
  s7: { exposure: 1.2, bloomStr: 0 }
};

/* ═══════════════════════════════════════════════════════════
   GLB LOADER WITH ERROR HANDLING
   ═══════════════════════════════════════════════════════════ */
const loader = new THREE.GLTFLoader();

function loadGLB(url, onSuccess, onError) {
  loader.load(
    url,
    (gltf) => {
      onModelLoaded(url.replace('.glb', ''));
      onSuccess(gltf);
    },
    (xhr) => {
      if (xhr.total && loadStatusEl) {
        const progress = (xhr.loaded / xhr.total * 100).toFixed(0);
        const cyberLogs = ["INITIALIZING NEURAL LINK", "CALIBRATING KEVLAR MATRIX", "SYNTHESIZING NANO-ARMOR", "ESTABLISHING ORBITAL UPLINK", "TUNING F1 TELEMETRY", "BYPASSING QUANTUM FIREWALL"];
        const log = cyberLogs[modelsLoaded % cyberLogs.length];
        loadStatusEl.textContent = log + ' ... ' + progress + '%';
      }
    },
    (error) => {
      console.error('Failed to load ' + url + ':', error);
      onModelLoaded(url.replace('.glb', '') + ' (FAILED)');
      // Show error toast
      const toast = document.getElementById('model-error-toast');
      if (toast) { toast.textContent = '⚠ Failed to load: ' + url; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 4000); }
      if (onError) onError(error);
    }
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 1: KEVLAR FIBER INTRO (Procedural)
   ═══════════════════════════════════════════════════════════ */
const s1G = new THREE.Group();
const fibM1 = new THREE.MeshStandardMaterial({ color: 0xeebb55, emissive: 0xcc8822, emissiveIntensity: 6, roughness: .08, metalness: .92 });
const fibM2 = new THREE.MeshStandardMaterial({ color: 0xbb9944, emissive: 0x885511, emissiveIntensity: 4, roughness: .15, metalness: .85 });
for (let i = 0; i < 24; i++) {
  const pts = []; const y = (i - 12) * .3, z = (Math.random() - .5) * 1.8;
  for (let j = 0; j <= 60; j++) {
    const t = j / 60;
    pts.push(new THREE.Vector3(-20 + t * 40, y + Math.sin(t * Math.PI * 3 + i) * .2, z + Math.cos(t * Math.PI * 2.5 + i * .6) * .15));
  }
  s1G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 100, .035 + Math.random() * .015, 8), i % 2 ? fibM1 : fibM2));
}
// Gold particles
const s1PC = 4000, s1PG = new THREE.BufferGeometry(), s1PP = new Float32Array(s1PC * 3);
for (let i = 0; i < s1PC; i++) { s1PP[i * 3] = (Math.random() - .5) * 35; s1PP[i * 3 + 1] = (Math.random() - .5) * 14; s1PP[i * 3 + 2] = (Math.random() - .5) * 10 }
s1PG.setAttribute('position', new THREE.BufferAttribute(s1PP, 3));
s1G.add(new THREE.Points(s1PG, new THREE.PointsMaterial({ size: .05, color: 0xc8a84b, transparent: true, opacity: .55, sizeAttenuation: true, blending: THREE.AdditiveBlending })));
// Cyan accent particles
const s1PC2 = 1200, s1P2 = new Float32Array(s1PC2 * 3);
for (let i = 0; i < s1PC2; i++) { s1P2[i * 3] = (Math.random() - .5) * 28; s1P2[i * 3 + 1] = (Math.random() - .5) * 12; s1P2[i * 3 + 2] = (Math.random() - .5) * 8 }
const s1PG2 = new THREE.BufferGeometry(); s1PG2.setAttribute('position', new THREE.BufferAttribute(s1P2, 3));
s1G.add(new THREE.Points(s1PG2, new THREE.PointsMaterial({ size: .035, color: 0x00ffee, transparent: true, opacity: .35, sizeAttenuation: true, blending: THREE.AdditiveBlending })));
scene.add(s1G);

/* ═══════════════════════════════════════════════════════════
   SCENE 2: KEVLAR MOLECULE ONLY — kevlar_model.glb
   ═══════════════════════════════════════════════════════════ */
const s2G = new THREE.Group(); s2G.visible = false;

// Ambient particles around the molecule
const s2PC = 2500, s2PG = new THREE.BufferGeometry(), s2PP = new Float32Array(s2PC * 3);
for (let i = 0; i < s2PC; i++) {
  s2PP[i * 3] = (Math.random() - .5) * 30;
  s2PP[i * 3 + 1] = (Math.random() - .5) * 16;
  s2PP[i * 3 + 2] = (Math.random() - .5) * 14;
}
s2PG.setAttribute('position', new THREE.BufferAttribute(s2PP, 3));
s2G.add(new THREE.Points(s2PG, new THREE.PointsMaterial({ size: .04, color: 0xc8a84b, transparent: true, opacity: .4, sizeAttenuation: true, blending: THREE.AdditiveBlending })));
// Cyan accent particles
const s2PC2 = 800, s2P2 = new Float32Array(s2PC2 * 3);
for (let i = 0; i < s2PC2; i++) { s2P2[i * 3] = (Math.random() - .5) * 22; s2P2[i * 3 + 1] = (Math.random() - .5) * 12; s2P2[i * 3 + 2] = (Math.random() - .5) * 10 }
const s2PG2 = new THREE.BufferGeometry(); s2PG2.setAttribute('position', new THREE.BufferAttribute(s2P2, 3));
s2G.add(new THREE.Points(s2PG2, new THREE.PointsMaterial({ size: .03, color: 0x00ffee, transparent: true, opacity: .3, sizeAttenuation: true, blending: THREE.AdditiveBlending })));

// Local lighting for molecule
const s2Light1 = new THREE.PointLight(0xc8a84b, 6, 30); s2Light1.position.set(4, 4, 6); s2G.add(s2Light1);
const s2Light2 = new THREE.PointLight(0x00ffee, 4, 25); s2Light2.position.set(-4, -2, 5); s2G.add(s2Light2);
const s2Light3 = new THREE.PointLight(0xcc44ff, 3, 20); s2Light3.position.set(0, 3, -4); s2G.add(s2Light3);

// Load kevlar_model.glb — molecule ONLY, moved RIGHT, rotating around OWN CENTER
let kevlarS2Model = null;
let s2MoleculeWrapper = new THREE.Group();
s2MoleculeWrapper.position.set(4.5, 0, 0); // Move EVEN MORE to the RIGHT
s2G.add(s2MoleculeWrapper);

loadGLB('kevlar_model.glb', (gltf) => {
  kevlarS2Model = gltf.scene;
  const box = new THREE.Box3().setFromObject(kevlarS2Model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 8 / maxDim; // Larger — it's the only element
  kevlarS2Model.scale.setScalar(scale);
  // Center perfectly around local (0,0,0) inside the wrapper
  kevlarS2Model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  kevlarS2Model.traverse(c => {
    if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
  });
  s2MoleculeWrapper.add(kevlarS2Model);
  console.log('✓ kevlar_model.glb loaded for Scene 2 (molecule only)');
});

scene.add(s2G);

// S3: Bullet and Vest (Programmatic geometries)
const s3G = new THREE.Group(); s3G.visible = false;

// Kevlar fabric deformation plane (abstract visual)
const FR = 80;
const fabGeo = new THREE.PlaneGeometry(18, 18, FR, FR);
const fabMat = new THREE.MeshStandardMaterial({ color: 0xc8a84b, emissive: 0x4a2000, emissiveIntensity: 1.5, roughness: .25, metalness: .72, side: THREE.DoubleSide });
s3G.add(new THREE.Mesh(fabGeo, fabMat));
s3G.add(new THREE.Mesh(new THREE.PlaneGeometry(18, 18, FR, FR), new THREE.MeshBasicMaterial({ color: 0xffdd44, wireframe: true, transparent: true, opacity: .12, blending: THREE.AdditiveBlending })));

// Bullet Model (Programmatic representation)
let bulletModel = new THREE.Group();
const bBody = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .6, 16), new THREE.MeshStandardMaterial({ color: 0xcc8833, metalness: .8, roughness: .2 }));
bBody.rotation.x = Math.PI / 2;
const bTip = new THREE.Mesh(new THREE.ConeGeometry(.15, .4, 16), new THREE.MeshStandardMaterial({ color: 0xcc8833, metalness: .8, roughness: .2 }));
bTip.position.z = -.5;
bTip.rotation.x = -Math.PI / 2;
bulletModel.add(bBody, bTip);
bulletModel.scale.setScalar(2);

const bulletGroup = new THREE.Group();
bulletGroup.position.set(0, 0, 10);
bulletGroup.add(bulletModel);
s3G.add(bulletGroup);

// Bullet trail effect
const trlMat = new THREE.MeshBasicMaterial({ color: 0xff8822, transparent: true, opacity: .45, blending: THREE.AdditiveBlending });
const trl = new THREE.Mesh(new THREE.ConeGeometry(.12, 4.5, 8), trlMat);
trl.rotation.x = -Math.PI / 2;
trl.position.set(0, 0, 13);
s3G.add(trl);

// Bullet glow
const bGlw = new THREE.Mesh(
  new THREE.SphereGeometry(.6, 12, 12),
  new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: .2, blending: THREE.AdditiveBlending })
);
bGlw.position.set(0, 0, 10);
s3G.add(bGlw);

// Removed vest block completely to allow clean impact visually directly into the fabric

// Shockwaves
const sws = [];
for (let i = 0; i < 10; i++) {
  const sw = new THREE.Mesh(
    new THREE.TorusGeometry(.1, .035, 8, 80),
    new THREE.MeshBasicMaterial({ color: i % 2 ? 0x00ffee : 0xffaa22, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  );
  sw.visible = false;
  sw.userData = { alive: false, t: 0, spd: 1.2 + i * .22 };
  s3G.add(sw); sws.push(sw);
}

// Debris particles
const ND = 300, dG = new THREE.BufferGeometry(), dP = new Float32Array(ND * 3);
dG.setAttribute('position', new THREE.BufferAttribute(dP, 3));
const dPts = new THREE.Points(dG, new THREE.PointsMaterial({ size: .18, color: 0xffcc44, transparent: true, opacity: 0, sizeAttenuation: true, blending: THREE.AdditiveBlending }));
const dV = Array.from({ length: ND }, () => {
  const s = 3 + Math.random() * 8, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  return { vx: Math.sin(p) * Math.cos(t) * s, vy: Math.sin(p) * Math.sin(t) * s, vz: Math.abs(Math.cos(p)) * s + 2 };
});
let dAlive = false, dT = 0;
s3G.add(dPts);

const impR = new THREE.Mesh(
  new THREE.TorusGeometry(.25, .1, 8, 80),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
);
impR.scale.setScalar(.1);
s3G.add(impR);

s3G.rotation.x = -.1;
scene.add(s3G);

let impStr = 0, impFired = false;
function trigImp() {
  for (let i = 0; i < ND; i++) { dP[i * 3] = 0; dP[i * 3 + 1] = 0; dP[i * 3 + 2] = 0; }
  dG.attributes.position.needsUpdate = true;
  dPts.material.opacity = 1; dAlive = true; dT = 0;
  sws.forEach((sw, i) => setTimeout(() => {
    sw.visible = true; sw.userData.alive = true; sw.userData.t = 0;
    sw.scale.setScalar(.1); sw.material.opacity = .9;
  }, i * 45));
  impR.scale.setScalar(.1); impR.material.opacity = 1;
  gsap.to(impR.scale, { x: 16, y: 16, z: 16, duration: 1.8, ease: 'expo.out' });
  gsap.to(impR.material, { opacity: 0, duration: 1.8, ease: 'power2.in' });
  flash(.55); shakeStr = 1.2;

  // Extremely animated energy bar filling
  const energyFill = document.getElementById('energy-fill');
  const energyPct = document.getElementById('energy-pct');
  if (energyFill && energyPct) {
    energyFill.style.transition = 'none';
    energyFill.style.width = '0%';
    setTimeout(() => {
      energyFill.style.transition = 'width 1.5s cubic-bezier(.22,1,.36,1)';
      energyFill.style.width = '97%';
      gsap.to({ val: 0 }, {
        val: 97,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: function() { energyPct.innerHTML = Math.floor(this.targets()[0].val) + '<span style="color:var(--c)">%</span>'; }
      });
    }, 50);
  }
}

function deformFab() {
  const pos = fabGeo.attributes.position, T = performance.now() * .001;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), d = Math.sqrt(x * x + y * y);
    pos.setZ(i, Math.sin(x * 4.4) * .05 + Math.sin(y * 4.4) * .05 + impStr * Math.exp(-d * .25) * Math.cos(d * 2.4 - T * 5.5) * 1.6);
  }
  pos.needsUpdate = true; fabGeo.computeVertexNormals();
}

/* ═══════════════════════════════════════════════════════════
   SCENE 4: MOLECULAR ANALYSIS — kevlar_model.glb rotated 90° Y
   ═══════════════════════════════════════════════════════════ */
const s4G = new THREE.Group(); s4G.visible = false;

// Holographic UI panels
for (let i = 0; i < 5; i++) {
  const g = new THREE.PlaneGeometry(1.2 + Math.random() * .8, .8 + Math.random() * .5);
  const m = new THREE.MeshBasicMaterial({ color: i % 2 ? 0x00ffee : 0xcc44ff, transparent: true, opacity: .08, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const p = new THREE.Mesh(g, m);
  p.position.set(-4 + i * 2.2, 1 + Math.sin(i) * 1.5, -2 + i * .6);
  p.rotation.y = -.3 + i * .15;
  p.userData.baseY = p.position.y;
  p.userData.idx = i;
  s4G.add(p);
}

// Scanning beam
const scanBeam = new THREE.Mesh(
  new THREE.PlaneGeometry(12, .03),
  new THREE.MeshBasicMaterial({ color: 0x00ffee, transparent: true, opacity: .4, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
);
scanBeam.position.set(0, 0, 1); s4G.add(scanBeam);

// Atmospheric particles
const labPC = 2000, labPG = new THREE.BufferGeometry(), labPP = new Float32Array(labPC * 3);
for (let i = 0; i < labPC; i++) {
  labPP[i * 3] = (Math.random() - .5) * 20;
  labPP[i * 3 + 1] = (Math.random() - .5) * 12;
  labPP[i * 3 + 2] = (Math.random() - .5) * 15;
}
labPG.setAttribute('position', new THREE.BufferAttribute(labPP, 3));
s4G.add(new THREE.Points(labPG, new THREE.PointsMaterial({ size: .04, color: 0x00ffee, transparent: true, opacity: .3, sizeAttenuation: true, blending: THREE.AdditiveBlending })));

// Molecular bond highlight rings
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.5 + i * .8, .02, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0xcc44ff, transparent: true, opacity: .15, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
  );
  ring.position.set(0, 0, 0);
  ring.rotation.x = Math.PI / 2;
  ring.userData.ringIdx = i;
  s4G.add(ring);
}

// Removed kevlar_model.glb from S4 as requested

// Load laboratory environment GLB
let labModel = null;
loadGLB('laboratory_in_the_swamp.glb', (gltf) => {
  labModel = gltf.scene;
  const box = new THREE.Box3().setFromObject(labModel);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 30 / maxDim; // Make the lab big enough to enclose the camera
  labModel.scale.setScalar(scale);
  // Center the lab around the camera (camera is roughly looking at origin)
  // Moved model higher as requested (removed the -5 offset on Y)
  labModel.position.set(-center.x * scale, -center.y * scale, -center.z * scale - 5);
  // User says: Be rotated to 90 degrees to the RIGHT (Y axis)
  labModel.rotation.y = -Math.PI / 2;
  labModel.traverse(c => {
    if (c.isMesh) {
      c.receiveShadow = true; // Use it as a solid background
      // Tone down brightness of lab so molecule is the focal point
      if (c.material) {
        c.material = c.material.clone();
        c.material.roughness = 0.9;
        if (c.material.emissive) c.material.emissive.multiplyScalar(0.4);
      }
    }
  });
  s4G.add(labModel);
  console.log('✓ laboratory_in_the_swamp.glb loaded for Scene 4');
});

// Local lights for molecular scene
const molLight1 = new THREE.PointLight(0xcc44ff, 8, 20);
molLight1.position.set(-3, 4, 5);
s4G.add(molLight1);
const molLight2 = new THREE.PointLight(0x00ffee, 6, 18);
molLight2.position.set(3, -2, 4);
s4G.add(molLight2);

scene.add(s4G);

/* ═══════════════════════════════════════════════════════════
   SCENE 5: F1 GARAGE — GLB model (contains garage + car)
   ═══════════════════════════════════════════════════════════ */
const s5G = new THREE.Group(); s5G.visible = false;

// Soft indoor garage lighting
const garageAmb = new THREE.AmbientLight(0xeeeedd, 3.5);
s5G.add(garageAmb);
const garageHemi = new THREE.HemisphereLight(0xffffff, 0x444444, 3.5);
s5G.add(garageHemi);

// Overhead spots
const ceilSpot1 = new THREE.SpotLight(0xfff8ee, 10.0, 150, Math.PI * 0.45, 0.5, 1.0);
ceilSpot1.castShadow = true;
s5G.add(ceilSpot1);
const ceilSpot2 = new THREE.SpotLight(0xfff8ee, 8.0, 120, Math.PI * 0.4, 0.6, 1.0);
s5G.add(ceilSpot2);
const ceilSpot3 = new THREE.SpotLight(0xfff8ee, 8.0, 120, Math.PI * 0.4, 0.6, 1.0);
s5G.add(ceilSpot3);

// Subtle accent lights
const garAccent1 = new THREE.PointLight(0x00ddbb, 1.2, 50);
s5G.add(garAccent1);
const garAccent2 = new THREE.PointLight(0xffd59a, 1.0, 45);
s5G.add(garAccent2);

scene.add(s5G);

// Load the complete garage+car GLB
let f1Model = null;
const f1ModelCenter = new THREE.Vector3(0, 0, 0);

loadGLB('f1.glb', (gltf) => {
  f1Model = gltf.scene;

  // Exactly as in Blender (no auto-fit)
  f1Model.scale.setScalar(1);
  f1Model.position.set(0, 0, 0);

  // Recalculate center after positioning
  const finalBox = new THREE.Box3().setFromObject(f1Model);
  finalBox.getCenter(f1ModelCenter);

  // Find exactly where the car mesh is
  f1Model.updateMatrixWorld(true);
  f1Model.traverse(c => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
      if (c.name.toLowerCase().includes('expensify') || c.name.toLowerCase().includes('fwing')) {
        c.getWorldPosition(globalCarPos);
      }
    }
  });

  // Reposition all lights dynamically directly above/around the unscaled/un-centered car 
  ceilSpot1.position.set(globalCarPos.x, globalCarPos.y + 15, globalCarPos.z);
  ceilSpot2.position.set(globalCarPos.x - 8, globalCarPos.y + 12, globalCarPos.z - 6);
  ceilSpot3.position.set(globalCarPos.x + 8, globalCarPos.y + 12, globalCarPos.z - 6);
  s5G.add(ceilSpot1.target); s5G.add(ceilSpot2.target); s5G.add(ceilSpot3.target);
  ceilSpot1.target.position.set(globalCarPos.x, globalCarPos.y, globalCarPos.z);
  ceilSpot2.target.position.set(globalCarPos.x - 8, globalCarPos.y, globalCarPos.z - 6);
  ceilSpot3.target.position.set(globalCarPos.x + 8, globalCarPos.y, globalCarPos.z - 6);
  
  garAccent1.position.set(globalCarPos.x + 10, globalCarPos.y + 5, globalCarPos.z - 5);
  garAccent2.position.set(globalCarPos.x - 8, globalCarPos.y + 4, globalCarPos.z + 4);

  s5G.add(f1Model);
  console.log('F1 loaded, Car Pos:', globalCarPos.x, globalCarPos.y, globalCarPos.z);
  window.f1Model = f1Model; // Exposed for debugging
  console.log('✓ F1 garage+car GLB loaded — center:', f1ModelCenter, 'scale:', scale.toFixed(3));
});

/* ═══════════════════════════════════════════════════════════
   SCENE 6: SPACE + ROCKET — ULTRA REALISTIC COSMIC ENV
   ═══════════════════════════════════════════════════════════ */
const s6G = new THREE.Group(); s6G.visible = false;

// ── PARALLAX STAR LAYER 1: Far background (tiny, slow) ──
const st1C = 8000, st1G = new THREE.BufferGeometry(), st1P = new Float32Array(st1C * 3);
for (let i = 0; i < st1C; i++) {
  const r = 120 + Math.random() * 200, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  st1P[i * 3] = r * Math.sin(p) * Math.cos(t);
  st1P[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
  st1P[i * 3 + 2] = r * Math.cos(p);
}
st1G.setAttribute('position', new THREE.BufferAttribute(st1P, 3));
const starLayer1 = new THREE.Points(st1G, new THREE.PointsMaterial({ size: .06, color: 0xccccff, transparent: true, opacity: .5, sizeAttenuation: true }));
s6G.add(starLayer1);

// ── PARALLAX STAR LAYER 2: Mid-field (medium) ──
const st2C = 5000, st2G = new THREE.BufferGeometry(), st2P = new Float32Array(st2C * 3);
for (let i = 0; i < st2C; i++) {
  const r = 50 + Math.random() * 120, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  st2P[i * 3] = r * Math.sin(p) * Math.cos(t);
  st2P[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
  st2P[i * 3 + 2] = r * Math.cos(p);
}
st2G.setAttribute('position', new THREE.BufferAttribute(st2P, 3));
const starLayer2 = new THREE.Points(st2G, new THREE.PointsMaterial({ size: .1, color: 0xeeeeff, transparent: true, opacity: .65, sizeAttenuation: true }));
s6G.add(starLayer2);

// ── PARALLAX STAR LAYER 3: Near foreground (bright, fast parallax) ──
const st3C = 2500, st3G = new THREE.BufferGeometry(), st3P = new Float32Array(st3C * 3);
for (let i = 0; i < st3C; i++) {
  const r = 25 + Math.random() * 60, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  st3P[i * 3] = r * Math.sin(p) * Math.cos(t);
  st3P[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
  st3P[i * 3 + 2] = r * Math.cos(p);
}
st3G.setAttribute('position', new THREE.BufferAttribute(st3P, 3));
const starLayer3 = new THREE.Points(st3G, new THREE.PointsMaterial({ size: .18, color: 0xffffff, transparent: true, opacity: .85, sizeAttenuation: true, blending: THREE.AdditiveBlending }));
s6G.add(starLayer3);

// ── NEBULA LAYERS (procedural gradient planes at varying depths) ──
function createNebula(color, pos, scale, rot, opacity) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, color);
  grd.addColorStop(0.4, color.replace(')', ',0.3)').replace('rgb', 'rgba'));
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, 256, 256);
  // Add noise/variation
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256, y = Math.random() * 256;
    const d = Math.sqrt((x-128)**2 + (y-128)**2);
    if (d < 120) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(scale, scale),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
  );
  m.position.set(pos.x, pos.y, pos.z);
  if (rot) { m.rotation.x = rot.x || 0; m.rotation.y = rot.y || 0; m.rotation.z = rot.z || 0; }
  return m;
}
const nebula1 = createNebula('rgb(40,10,80)', {x: -35, y: 15, z: -80}, 90, {x: 0.2, y: 0.3}, 0.12);
const nebula2 = createNebula('rgb(10,20,60)', {x: 30, y: -10, z: -100}, 110, {x: -0.1, y: -0.2}, 0.09);
const nebula3 = createNebula('rgb(60,5,40)', {x: 0, y: 25, z: -60}, 70, {x: 0.4, z: 0.1}, 0.07);
const nebula4 = createNebula('rgb(5,15,50)', {x: -20, y: -20, z: -90}, 85, {y: 0.5}, 0.1);
s6G.add(nebula1, nebula2, nebula3, nebula4);

// ── COSMIC DUST (fine particles drifting slowly) ──
const dustC = 3000, dustG = new THREE.BufferGeometry(), dustP = new Float32Array(dustC * 3);
for (let i = 0; i < dustC; i++) {
  dustP[i * 3] = (Math.random() - .5) * 80;
  dustP[i * 3 + 1] = (Math.random() - .5) * 50;
  dustP[i * 3 + 2] = (Math.random() - .5) * 80;
}
dustG.setAttribute('position', new THREE.BufferAttribute(dustP, 3));
const cosmicDust = new THREE.Points(dustG, new THREE.PointsMaterial({ size: .03, color: 0x8888cc, transparent: true, opacity: .25, sizeAttenuation: true, blending: THREE.AdditiveBlending }));
s6G.add(cosmicDust);

// ── STAR CLUSTERS (concentrated bright regions) ──
for (let c = 0; c < 3; c++) {
  const cx = (Math.random() - .5) * 100, cy = (Math.random() - .5) * 60, cz = -40 - Math.random() * 80;
  const clC = 400, clG = new THREE.BufferGeometry(), clP = new Float32Array(clC * 3);
  for (let i = 0; i < clC; i++) {
    clP[i * 3] = cx + (Math.random() - .5) * 15;
    clP[i * 3 + 1] = cy + (Math.random() - .5) * 15;
    clP[i * 3 + 2] = cz + (Math.random() - .5) * 10;
  }
  clG.setAttribute('position', new THREE.BufferAttribute(clP, 3));
  s6G.add(new THREE.Points(clG, new THREE.PointsMaterial({ size: .08, color: 0xddeeff, transparent: true, opacity: .6, sizeAttenuation: true, blending: THREE.AdditiveBlending })));
}

// ── VOLUMETRIC ROCKET GLOW ──
const rocketGlow1 = new THREE.Mesh(
  new THREE.SphereGeometry(3, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: .06, blending: THREE.AdditiveBlending })
);
s6G.add(rocketGlow1);
const rocketGlow2 = new THREE.Mesh(
  new THREE.SphereGeometry(5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0x4422aa, transparent: true, opacity: .035, blending: THREE.AdditiveBlending })
);
s6G.add(rocketGlow2);

// Earth glow (enhanced)
const earthGlow = new THREE.Mesh(
  new THREE.SphereGeometry(25, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x0a2266, transparent: true, opacity: .1, blending: THREE.AdditiveBlending })
);
earthGlow.position.set(-30, -20, -40);
s6G.add(earthGlow);

// Moon (Kept small and isolated as before)
const moonGeo = new THREE.SphereGeometry(6, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 1.0, metalness: 0.1 });
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(18, 14, -28);
moon.receiveShadow = true; moon.castShadow = true;
s6G.add(moon);


const moonGlow = new THREE.Mesh(
  new THREE.SphereGeometry(6.4, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffee, transparent: true, opacity: .06, blending: THREE.AdditiveBlending })
);
moonGlow.position.set(18, 14, -28);
s6G.add(moonGlow);

// Cinematic lighting
const spaceDirLight = new THREE.DirectionalLight(0xddeeff, 4);
spaceDirLight.position.set(5, 5, 10); spaceDirLight.castShadow = true;
s6G.add(spaceDirLight);
const spaceAmb = new THREE.AmbientLight(0x1a1a3a, 1.5);
s6G.add(spaceAmb);
const spaceHemi = new THREE.HemisphereLight(0x4455aa, 0x110022, 1.0);
s6G.add(spaceHemi);
const spaceKv = new THREE.PointLight(0xc8a84b, 10, 50);
spaceKv.position.set(0, 2, 10);
s6G.add(spaceKv);
const spaceFill = new THREE.PointLight(0x8899dd, 6, 45);
spaceFill.position.set(-4, 0, 12);
s6G.add(spaceFill);
const spaceRim = new THREE.PointLight(0x00ffee, 5, 35);
spaceRim.position.set(3, -2, -5);
s6G.add(spaceRim);
const spaceSpot = new THREE.SpotLight(0xddeeff, 5, 50, Math.PI * .4, .5, 1);
spaceSpot.position.set(0, 5, 15);
s6G.add(spaceSpot);

scene.add(s6G);

// Load rocket GLB — Restored per user request with robust fallback properties
let rocketModel = null;
let s6RocketWrapper = new THREE.Group();
s6RocketWrapper.position.set(0, 0, 0);
s6RocketWrapper.frustumCulled = false;
s6G.add(s6RocketWrapper);

loadGLB('rocket.glb', (gltf) => {
  rocketModel = gltf.scene;
  console.log('✓ ROCKET GLB RAW SCENE ADDED:', rocketModel);

  // Auto-fit: compute bounding box safely
  const box = new THREE.Box3().setFromObject(rocketModel);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  let maxDim = Math.max(size.x, size.y, size.z);

  console.log('ROCKET DIMENSIONS COMPUTED:', size, 'center:', center, 'maxDim:', maxDim);

  if (!maxDim || maxDim === 0 || !isFinite(maxDim)) {
    console.warn('ROCKET: Invalid maxDim. Falling back to default scale.');
    maxDim = 1;
  }

  // Scale set back exactly to original safe value of 8 
  const scale = 8 / maxDim;
  rocketModel.scale.setScalar(scale);

  // Tilt the rocket slightly (diagonal orientation)
  rocketModel.rotation.z = -Math.PI / 6;
  rocketModel.rotation.x = -Math.PI / 12;

  // REVERTED to exact original mathematically centered position with NO offsets
  // PUSHED slightly to the RIGHT (+4 on X axis) per user request
  rocketModel.position.set(-center.x * scale + 4, -center.y * scale, -center.z * scale);

  // Force ALL meshes visible with solid materials
  let meshCount = 0;
  rocketModel.traverse(c => {
    c.visible = true;
    c.frustumCulled = false; // Prevent culling
    if (c.isMesh) {
      meshCount++;
      c.castShadow = true;
      c.receiveShadow = true;
      if (c.material) {
        c.material = c.material.clone();
        c.material.transparent = false;
        c.material.opacity = 1;
        c.material.depthWrite = true;
        c.material.visible = true;
        c.material.side = THREE.DoubleSide; // Show both sides
        if (c.material.roughness !== undefined) c.material.roughness = Math.max(c.material.roughness, .2);
        if (c.material.metalness !== undefined) c.material.metalness = Math.min(c.material.metalness, .8);
        c.material.needsUpdate = true;
      }
    }
  });

  // Ensure model is officially added
  s6RocketWrapper.add(rocketModel);
  console.log('✓ ROCKET GLB SUCCESSFULLY RENDERED. Meshes:', meshCount, 'Scale applied:', scale.toFixed(3));

}, (error) => {
  console.error('❌ ROCKET LOAD FAILED:', error);
});

/* ═══════════════════════════════════════════════════════════
   SCENE 7: OUTRO — Pulsating Network
   ═══════════════════════════════════════════════════════════ */
const s7G = new THREE.Group(); s7G.visible = false;
const oPC = 6000, oG = new THREE.BufferGeometry(), oP = new Float32Array(oPC * 3);
for (let i = 0; i < oPC; i++) {
  const r = 5 + Math.random() * 35, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  oP[i * 3] = r * Math.sin(p) * Math.cos(t);
  oP[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
  oP[i * 3 + 2] = r * Math.cos(p);
}
oG.setAttribute('position', new THREE.BufferAttribute(oP, 3));
s7G.add(new THREE.Points(oG, new THREE.PointsMaterial({ size: .07, color: 0xc8a84b, transparent: true, opacity: .6, sizeAttenuation: true, blending: THREE.AdditiveBlending })));

const tkMat = new THREE.MeshStandardMaterial({ color: 0xc8a84b, emissive: 0x6a3200, emissiveIntensity: 2.5, roughness: .15, metalness: .82, transparent: true, opacity: .4 });
const tk = new THREE.Mesh(new THREE.TorusKnotGeometry(4.5, 1, 160, 16), tkMat);
s7G.add(tk);
s7G.add(new THREE.Mesh(
  new THREE.TorusKnotGeometry(4.65, 1.05, 160, 16),
  new THREE.MeshBasicMaterial({ color: 0xc8a84b, wireframe: true, transparent: true, opacity: .06, blending: THREE.AdditiveBlending })
));

const iP = new Float32Array(2000 * 3);
for (let i = 0; i < 2000; i++) {
  iP[i * 3] = (Math.random() - .5) * 20;
  iP[i * 3 + 1] = (Math.random() - .5) * 20;
  iP[i * 3 + 2] = (Math.random() - .5) * 20;
}
const iPG = new THREE.BufferGeometry(); iPG.setAttribute('position', new THREE.BufferAttribute(iP, 3));
s7G.add(new THREE.Points(iPG, new THREE.PointsMaterial({ size: .04, color: 0x00ffee, transparent: true, opacity: .35, sizeAttenuation: true, blending: THREE.AdditiveBlending })));
scene.add(s7G);

/* ═══════════════════════════════════════════════════════════
   SCROLL → CINEMATIC SCENE MANAGER
   ═══════════════════════════════════════════════════════════ */
let activeScene = 's1';
function setScene(n) {
  if (activeScene === n) return;
  activeScene = n;
  snapCamera = true; // Instantly cut camera between completely disconnected sets
  s1G.visible = n === 's1';
  s2G.visible = n === 's2';
  s3G.visible = n === 's3';
  s4G.visible = n === 's4';
  s5G.visible = n === 's5';
  s6G.visible = n === 's6';
  s7G.visible = n === 's7';

  // Only show the sound toggle if we are on the F1 (s5) or Rocket (s6) scenes
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    if (n === 's5' || n === 's6') {
      soundBtn.style.opacity = '1';
      soundBtn.style.pointerEvents = 'auto';
      soundBtn.style.transform = 'scale(1)';
    } else {
      soundBtn.style.opacity = '0';
      soundBtn.style.pointerEvents = 'none';
      soundBtn.style.transform = 'scale(0.5)';
    }
  }
}
function frac(el) {
  const r = el.getBoundingClientRect();
  return 1 - Math.min(1, Math.max(0, r.bottom / (innerHeight + el.offsetHeight)));
}
function inV(el) {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight * .65 && r.bottom > 0;
}

const E = {};
['s1', 's2', 's2b', 's3', 's3b', 's4', 's4b', 's5', 's5b', 's6', 's7'].forEach(id => { E[id] = document.getElementById(id) });

window.addEventListener('scroll', () => {
  if (inV(E.s7)) {
    setScene('s7');
    camTgt.x = 0; camTgt.y = 0; camTgt.z = 16;
    camTgt.lx = 0; camTgt.ly = 0; camTgt.lz = 0;
  } else if (inV(E.s6)) {
    setScene('s6');
    const t = frac(E.s6);
    // Reverted exactly to the original safe camera vectors
    const orbitAngle = t * Math.PI * .3;
    camTgt.x = Math.sin(orbitAngle) * 22;
    camTgt.y = 3 + t * 2;
    camTgt.z = Math.cos(orbitAngle) * 22;
    // Look exactly at origin
    camTgt.lx = 0; camTgt.ly = 0; camTgt.lz = 0;
  } else if (inV(E.s5b) || inV(E.s5)) {
    setScene('s5');
    let t = 0;
    if (E.s5b && inV(E.s5b)) t = .4 + frac(E.s5b) * .6;
    else t = frac(E.s5) * .4;
    // GARAGE CINEMATIC ZOOM: inside garage view → close-up on car
    const easeT = t * t * (3 - 2 * t); // smoothstep easing
    
    // Blender Camera: Loc(416.63, 1061.1, 194.78), Rot(69, 0, 35.9)
    // Converted to Three.js space
    const baseCamX = 416.63;
    const baseCamY = 194.78;
    const baseCamZ = -1061.1;
    
    // Look direction derived from Blender Euler angles (Rot X=69, Y=0, Z=35.9)
    const dirX = -0.5474;
    const dirY = -0.35836;
    const dirZ = -0.7562;
    
    // Very subtle zoom (12 units) as requested
    const zoomDist = easeT * 12;
    
    camTgt.x = baseCamX + dirX * zoomDist;
    camTgt.y = baseCamY + dirY * zoomDist;
    camTgt.z = baseCamZ + dirZ * zoomDist;
    
    // Maintain perfectly static orientation by shifting the focus point equally
    camTgt.lx = baseCamX + dirX * 10000;
    camTgt.ly = baseCamY + dirY * 10000;
    camTgt.lz = baseCamZ + dirZ * 10000;
  } else if (E.s4b && inV(E.s4b) || inV(E.s4)) {
    setScene('s4');
    const t = inV(E.s4) ? frac(E.s4) : (E.s4b ? frac(E.s4b) : 0);
    // ZOOM in and LOWER camera for lab scene
    camTgt.x = -3 + t * 6; camTgt.y = 0.2 + t * 0.5; camTgt.z = 10 - t * 6;
    camTgt.lx = 0; camTgt.ly = 0; camTgt.lz = 0;
  } else if (inV(E.s3b) || inV(E.s3)) {
    setScene('s3');
    const t = inV(E.s3) ? frac(E.s3) : (E.s3b ? frac(E.s3b) : 0);
    const a = t * Math.PI * .3;
    camTgt.x = Math.sin(a) * 13; camTgt.y = 3 - t * 4; camTgt.z = Math.cos(a) * 13;
    // Move models to the LEFT by using a positive look-at target offset for the camera
    camTgt.lx = 3.5; camTgt.ly = 0; camTgt.lz = 0;
    impStr = Math.max(0, t * 3 - 1.1);

    // Animate bullet group position to impact the vest precisely at z=0 
    bulletGroup.position.z = 10 - t * 10;
    trl.position.z = bulletGroup.position.z + 3.5;
    trl.material.opacity = Math.max(0, .45 - t * .4);
    bGlw.position.z = bulletGroup.position.z;
    if (t > .48 && !impFired) { impFired = true; trigImp(); }
  } else if (inV(E.s2b) || inV(E.s2)) {
    setScene('s2');
    const t = inV(E.s2) ? frac(E.s2) : (E.s2b ? frac(E.s2b) : 0);
    camTgt.x = -3 + t * 5; camTgt.y = t * 2.5; camTgt.z = 16 - t * 7;
    camTgt.lx = 0; camTgt.ly = 0; camTgt.lz = 0;
  } else {
    setScene('s1');
    const t = frac(E.s1);
    camTgt.x = 0; camTgt.y = 0; camTgt.z = 22 - t * 12;
    camTgt.lx = 0; camTgt.ly = 0; camTgt.lz = 0;
  }
  if (activeScene !== 's3') {
    impFired = false; impStr = 0;
    bulletGroup.position.z = 10;
    trl.position.z = 13.5;
  }
});

/* ═══════════════════════════════════════════════════════════
   RENDER LOOP — AAA Cinematic
   ═══════════════════════════════════════════════════════════ */
const clk = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop);
  const dt = clk.getDelta(), T = clk.getElapsedTime();

  // ── Cinematic camera: dual-lerp (position slower, look-at even slower) + mouse parallax ──
  camMouseX += (mouseParX - camMouseX) * 0.03;
  camMouseY += (mouseParY - camMouseY) * 0.03;
  const parStr = 0.4; // Mouse parallax strength

  if (snapCamera) {
    camCur.x = camTgt.x;
    camCur.y = camTgt.y;
    camCur.z = camTgt.z;
    camCur.lx = camTgt.lx;
    camCur.ly = camTgt.ly;
    camCur.lz = camTgt.lz;
    snapCamera = false;
  } else {
    camCur.x += (camTgt.x - camCur.x) * CAM_LERP;
    camCur.y += (camTgt.y - camCur.y) * CAM_LERP;
    camCur.z += (camTgt.z - camCur.z) * CAM_LERP;
    camCur.lx += (camTgt.lx - camCur.lx) * CAM_LOOK_LERP;
    camCur.ly += (camTgt.ly - camCur.ly) * CAM_LOOK_LERP;
    camCur.lz += (camTgt.lz - camCur.lz) * CAM_LOOK_LERP;
  }
  
  shakeStr *= .86;
  const microShake = .012;
  const sx = (Math.random() - .5) * (shakeStr + microShake);
  const sy = (Math.random() - .5) * (shakeStr + microShake);
  camera.position.set(
    camCur.x + sx + camMouseX * parStr,
    camCur.y + sy + camMouseY * parStr * 0.6,
    camCur.z
  );
  camera.lookAt(camCur.lx, camCur.ly, camCur.lz);

  // ── Per-scene exposure, bloom & fog tuning ──
  const ss = sceneSettings[activeScene] || sceneSettings.s1;
  renderer.toneMappingExposure += (ss.exposure - renderer.toneMappingExposure) * 0.02;
  if (window._bloomPass) {
    window._bloomPass.strength += (ss.bloomStr - window._bloomPass.strength) * 0.02;
  }
  scene.fog.density += ((activeScene === 's5' ? 0 : 0.002) - scene.fog.density) * 0.05;

  // ── Ambient sound per scene ──
  updateSound('spaceHum', activeScene === 's6' ? 0.04 : 0);
  updateSound('spaceSub', activeScene === 's6' ? 0.025 : 0);
  updateSound('f1Audio', activeScene === 's5' ? 0.35 : 0);
  updateSound('rocketAudio', activeScene === 's6' ? 0.45 : 0);

  // Animate global point lights cinematically
  ptC.position.set(Math.sin(T * .6) * 15, Math.sin(T * .45) * 6, 9);
  ptP.position.set(Math.cos(T * .5) * 13, Math.sin(T * .38) * 7, -5);
  ptG.position.set(Math.sin(T * .45 + 2) * 11, Math.cos(T * .3) * 5, 5);

  // S1: Fiber intro
  if (s1G.visible) {
    s1G.position.y = Math.sin(T * .3) * .1;
    ptC.intensity = 6 + Math.sin(T * 1.2) * 2;
  }

  // S2: Kevlar molecule only
  if (s2G.visible) {
    if (s2MoleculeWrapper) { /* Rotation stopped */ }
    s2Light1.intensity = 5 + Math.sin(T * 1.2) * 1.5;
    s2Light2.intensity = 3 + Math.sin(T * .9 + 1) * 1;
  }

  // S3: Ballistic — bullet + vest
  if (s3G.visible) {
    deformFab();
    sunL.intensity = 3 + Math.sin(T * 3) * .4;
    sws.forEach(sw => {
      if (!sw.userData.alive) return;
      sw.userData.t += dt * sw.userData.spd;
      sw.scale.setScalar(.1 + sw.userData.t * 11);
      sw.material.opacity = Math.max(0, .9 - sw.userData.t * .65);
      if (sw.material.opacity <= 0) { sw.visible = false; sw.userData.alive = false; }
    });
    if (dAlive) {
      dT += dt;
      dPts.material.opacity = Math.max(0, 1 - dT * .4);
      if (dT > 3) { dAlive = false; dPts.material.opacity = 0; }
      else {
        for (let i = 0; i < ND; i++) {
          dP[i * 3] += dV[i].vx * dt; dP[i * 3 + 1] += dV[i].vy * dt; dP[i * 3 + 2] += dV[i].vz * dt;
          dV[i].vy -= dt * 5;
        }
        dG.attributes.position.needsUpdate = true;
      }
    }
    if (bulletModel) bulletGroup.rotation.z += dt * .3;
  }

  // S4: Molecular Analysis — Lab only
  if (s4G.visible) {
    scanBeam.position.y = Math.sin(T * .8) * 4;
    scanBeam.material.opacity = .3 + Math.sin(T * 2) * .15;
    s4G.children.forEach(c => {
      if (c.userData.baseY !== undefined) {
        c.position.y = c.userData.baseY + Math.sin(T * .5 + c.userData.idx) * .2;
        c.material.opacity = .06 + Math.sin(T + c.userData.idx) * .03;
      }
      if (c.userData.ringIdx !== undefined) {
        c.rotation.z = T * .3 + c.userData.ringIdx * Math.PI / 3;
        c.material.opacity = .1 + Math.sin(T * .8 + c.userData.ringIdx) * .08;
      }
    });
    molLight1.intensity = 6 + Math.sin(T * 1.5) * 3;
    molLight2.intensity = 4 + Math.cos(T * 1.2) * 2;
  }

  // S5: F1 Garage — cinematic drift
  if (s5G.visible) {
    ceilSpot1.intensity = 2.3 + Math.sin(T * 0.8) * 0.2;
    garAccent1.intensity = 0.5 + Math.sin(T * 1.2) * 0.15;
  }

  // S6: Space — parallax stars, cosmic dust drift, volumetric glow
  if (s6G.visible) {
    // Parallax star rotation at different speeds
    starLayer1.rotation.y += dt * 0.002;
    starLayer1.rotation.x += dt * 0.001;
    starLayer2.rotation.y += dt * 0.005;
    starLayer2.rotation.x += dt * 0.002;
    starLayer3.rotation.y += dt * 0.01;
    starLayer3.rotation.x += dt * 0.004;

    // Cosmic dust slow drift
    cosmicDust.rotation.y += dt * 0.003;
    cosmicDust.rotation.z += dt * 0.001;

    // Nebula subtle breathing
    nebula1.material.opacity = 0.1 + Math.sin(T * 0.15) * 0.03;
    nebula2.material.opacity = 0.08 + Math.sin(T * 0.12 + 1) * 0.02;
    nebula3.material.opacity = 0.06 + Math.sin(T * 0.18 + 2) * 0.02;

    // Volumetric glow pulsing around rocket
    rocketGlow1.material.opacity = 0.05 + Math.sin(T * 0.8) * 0.02;
    rocketGlow2.material.opacity = 0.03 + Math.sin(T * 0.6 + 1) * 0.015;

    // Cinematic lighting pulse
    spaceKv.intensity = 8 + Math.sin(T * 1.2) * 1.5;
    spaceFill.intensity = 5 + Math.sin(T * .8) * 1;
  }

  // S7: Outro
  if (s7G.visible) {
    s7G.rotation.y += dt * .018;
    tk.rotation.y += dt * .12; tk.rotation.z += dt * .06;
    tkMat.emissiveIntensity = 1.8 + Math.sin(T * .6) * .9;
    s7G.children[0].material.opacity = .5 + Math.sin(T * .45) * .12;
  }

  // Render purely with renderer (removes all unwanted bloom/fog/exposure layers)
  renderer.render(scene, camera);
})();

/* ── RESPONSIVE RESIZE (includes composer) ── */
window.addEventListener('resize', () => {
  renderer.setSize(W(), H());
  camera.aspect = W() / H();
  camera.updateProjectionMatrix();
  if (composer) composer.setSize(W(), H());
});

