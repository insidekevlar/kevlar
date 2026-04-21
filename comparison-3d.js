import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { KevinOS } from './kevin-os.js';

let scene,camera,renderer,controls,composer,clock=new THREE.Clock();
let models={},particles=[],energyBases=[];
let monitorGroup,monCtx,monTex,monCanvas;
let fsCtx,fsTex,fsCanvas; // fullscreen monitor
let raycaster,mouse;
let currentMat='idle',monitorOpen=false;
let kevinOSInstance=null;
let targetCamPos=null,targetCtrlTgt=null;
const baseCam=new THREE.Vector3(0,8,22),baseTgt=new THREE.Vector3(0,5,-5);
const SX=-16,KX=0,AX=16,CX=0,CZ=-22;
const MW=1024,MH=576;
let dustParticles=null;
let rgbDeskEdges=[];



function init(){
const c=document.getElementById('main-canvas');
scene=new THREE.Scene();scene.background=new THREE.Color(0x0a0a18);
scene.fog=new THREE.FogExp2(0x0a0a18,0.0015);
camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,0.1,800);
camera.position.copy(baseCam);
renderer=new THREE.WebGLRenderer({canvas:c,antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1));
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=2.2;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
controls=new OrbitControls(camera,c);controls.enableDamping=true;controls.dampingFactor=0.06;
controls.minDistance=15;controls.maxDistance=60;controls.maxPolarAngle=Math.PI/2.1;controls.minPolarAngle=0.2;
controls.target.copy(baseTgt);controls.autoRotate=true;controls.autoRotateSpeed=0.08;
raycaster=new THREE.Raycaster();mouse=new THREE.Vector2();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);if(composer)composer.setSize(innerWidth,innerHeight);});
}

function lights(){
scene.add(new THREE.AmbientLight(0x3a4565,3.0));
const mk=(c,x,i)=>{const s=new THREE.SpotLight(c,i,55,Math.PI/4,0.6,0.9);s.position.set(x,20,14);s.castShadow=true;
s.shadow.mapSize.set(512,512);const t=new THREE.Object3D();t.position.set(x,0,0);scene.add(s,t);s.target=t;};
mk(0x42a5f5,SX,8);mk(0xffaa00,KX,8);mk(0x00e5ff,AX,8);
scene.add(new THREE.PointLight(0x2244ff,3,40)).position.set(CX,10,CZ);
const rim=new THREE.DirectionalLight(0x332266,2.0);rim.position.set(0,15,-30);scene.add(rim);
scene.add(new THREE.PointLight(0x00bfff,1.2,25)).position.set(-25,8,5);
scene.add(new THREE.PointLight(0xff4400,0.8,25)).position.set(25,8,5);
// Lab ceiling lights
for(let i=-2;i<=2;i++){const pl=new THREE.PointLight(0x445577,1.5,22);pl.position.set(i*12,18,0);scene.add(pl);}
}

function bloom(){
try{composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),0.7,0.3,0.6));}catch(e){composer=null;}
}

function cosmos(){
[{n:500,s:0.08,sp:350},{n:250,s:0.15,sp:250}].forEach(cfg=>{
const g=new THREE.BufferGeometry(),p=new Float32Array(cfg.n*3),c=new Float32Array(cfg.n*3);
for(let i=0;i<cfg.n;i++){p[i*3]=(Math.random()-.5)*cfg.sp;p[i*3+1]=Math.random()*120+20;p[i*3+2]=(Math.random()-.5)*cfg.sp;
c[i*3]=.5+Math.random()*.5;c[i*3+1]=.5+Math.random()*.5;c[i*3+2]=1;}
g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(c,3));
scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:cfg.s,vertexColors:true,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false})));
});
}

// ═══ SCI-FI LAB ENVIRONMENT ═══
const LEDs=[],FANs=[];
const M = {
  rackShell:   new THREE.MeshStandardMaterial({ color: 0x080c10, roughness: 0.55, metalness: 0.95 }),
  rackInner:   new THREE.MeshStandardMaterial({ color: 0x04080c, roughness: 0.4,  metalness: 0.98 }),
  rackRail:    new THREE.MeshStandardMaterial({ color: 0x101820, roughness: 0.35, metalness: 1.0 }),
  rackBezel:   new THREE.MeshStandardMaterial({ color: 0x0b1016, roughness: 0.3,  metalness: 0.97 }),
  serverBody:  new THREE.MeshStandardMaterial({ color: 0x0d1218, roughness: 0.45, metalness: 0.92 }),
  serverFace:  new THREE.MeshStandardMaterial({ color: 0x090d12, roughness: 0.25, metalness: 0.99 }),
  driveTray:   new THREE.MeshStandardMaterial({ color: 0x0c1016, roughness: 0.3,  metalness: 0.95 }),
  driveFace:   new THREE.MeshStandardMaterial({ color: 0x111820, roughness: 0.2,  metalness: 1.0 }),
  driveSlot:   new THREE.MeshStandardMaterial({ color: 0x020406, roughness: 0.6,  metalness: 0.3 }),
  fanHub:      new THREE.MeshStandardMaterial({ color: 0x0a1018, roughness: 0.4,  metalness: 0.9 }),
  fanBlade:    new THREE.MeshStandardMaterial({ color: 0x141e28, roughness: 0.3,  metalness: 0.85 }),
  switchBody:  new THREE.MeshStandardMaterial({ color: 0x06090d, roughness: 0.4,  metalness: 0.97 }),
  patchPort:   new THREE.MeshStandardMaterial({ color: 0x03050a, roughness: 0.2,  metalness: 0.1 }),
  pduBody:     new THREE.MeshStandardMaterial({ color: 0x080c10, roughness: 0.5,  metalness: 0.9 }),
  blank:       new THREE.MeshStandardMaterial({ color: 0x0a0e14, roughness: 0.6,  metalness: 0.8 }),
  glassPanel:  new THREE.MeshStandardMaterial({ color: 0x001122, roughness: 0.02, metalness: 0.9, transparent: true, opacity: 0.28 }),
  floor:       new THREE.MeshStandardMaterial({ color: 0x090c12, roughness: 0.12, metalness: 0.75 }),
  floorSeam:   new THREE.MeshStandardMaterial({ color: 0x020408, roughness: 0.8,  metalness: 0.1 }),
  ceiling:     new THREE.MeshStandardMaterial({ color: 0x050809, roughness: 0.85, metalness: 0.4 }),
  beam:        new THREE.MeshStandardMaterial({ color: 0x0a1218, roughness: 0.7,  metalness: 0.85 }),
  wall:        new THREE.MeshStandardMaterial({ color: 0x04070b, roughness: 0.85, metalness: 0.25 }),
  cooler:      new THREE.MeshStandardMaterial({ color: 0x0b1318, roughness: 0.4,  metalness: 0.92 }),
  cableBlk:    new THREE.MeshStandardMaterial({ color: 0x03050a, roughness: 0.95, metalness: 0.05 }),
  cableCyan:   new THREE.MeshStandardMaterial({ color: 0x002233, roughness: 0.9,  metalness: 0.0, emissive: 0x003355, emissiveIntensity: 0.25 }),
  cableAmber:  new THREE.MeshStandardMaterial({ color: 0x281400, roughness: 0.9,  metalness: 0.0, emissive: 0x442200, emissiveIntensity: 0.2 }),
  cableGray:   new THREE.MeshStandardMaterial({ color: 0x0c121a, roughness: 0.9,  metalness: 0.05 }),
  cableRed:    new THREE.MeshStandardMaterial({ color: 0x200004, roughness: 0.9,  metalness: 0.0, emissive: 0x330005, emissiveIntensity: 0.15 }),
  // LEDs
  ledG:  new THREE.MeshStandardMaterial({ color: 0x00ff55, emissive: 0x00ff55, emissiveIntensity: 3.5, roughness: 1, metalness: 0 }),
  ledA:  new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 3.5, roughness: 1, metalness: 0 }),
  ledR:  new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 3.5, roughness: 1, metalness: 0 }),
  ledB:  new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 4.0, roughness: 1, metalness: 0 }),
  ledC:  new THREE.MeshStandardMaterial({ color: 0x00ffee, emissive: 0x00ffee, emissiveIntensity: 2.5, roughness: 1, metalness: 0 }),
  ledW:  new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0, roughness: 1, metalness: 0 }),
  ledDimG: new THREE.MeshStandardMaterial({ color: 0x003311, emissive: 0x002208, emissiveIntensity: 0.5, roughness: 1, metalness: 0 }),
  screen:  new THREE.MeshStandardMaterial({ color: 0x001133, emissive: 0x002266, emissiveIntensity: 1.4, roughness: 1, metalness: 0 }),
  screenA: new THREE.MeshStandardMaterial({ color: 0x002200, emissive: 0x003300, emissiveIntensity: 1.2, roughness: 1, metalness: 0 }),
  ventGlow:new THREE.MeshStandardMaterial({ color: 0x0055aa, roughness: 1, metalness: 0, emissive: 0x0044aa, emissiveIntensity: 0.5 }),
  floorTile:   new THREE.MeshStandardMaterial({ color: 0x06080e, roughness: 0.12, metalness: 0.85 }),
  floorStrip:  new THREE.MeshStandardMaterial({ color: 0x00eeff, roughness: 1, metalness: 0, emissive: 0x00bbff, emissiveIntensity: 6.0 }),
  wallStripe: new THREE.MeshStandardMaterial({ color: 0x001528, emissive: 0x001528, emissiveIntensity: 0.45, roughness: 1, metalness: 0 }),
};

// ── GEOMETRY CACHE ────────────────────────────────────────────────────────────
const GEO = {
  box: (w,h,d) => new THREE.BoxGeometry(w,h,d),
  cyl: (r,h,s=8) => new THREE.CylinderGeometry(r,r,h,s),
  torus: (r,t,rs=6,ts=16) => new THREE.TorusGeometry(r,t,rs,ts),
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function mk(geo, mat, x=0, y=0, z=0, rx=0, ry=0, rz=0, parent=scene) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x,y,z);
  m.rotation.set(rx,ry,rz);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m); return m;
}
function box(w,h,d,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0,p=scene) {
  return mk(GEO.box(w,h,d), mat, x,y,z, rx,ry,rz, p);
}
function grp(px=0, py=0, pz=0, ry=0, parent=scene) {
  const g = new THREE.Group();
  g.position.set(px,py,pz); g.rotation.y = ry;
  parent.add(g); return g;
}

// ── FLOOR / CEILING / WALLS / LIGHTS / PARTICLES ──────────────────────────────
// All moved into buildLabEnvironment() to ensure scene is initialized first
function buildLabEnvironment() {
  // ── LAB FLOOR (dark epoxy with tile grid) ──────────────────────────────────
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0e1018, metalness: 0.7, roughness: 0.2 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01; floor.receiveShadow = true;
  scene.add(floor);
  // Floor tile grid
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x111118, transparent: true, opacity: 0.18 });
  for (let i = -38; i <= 38; i += 2) {
    const h = new THREE.Mesh(new THREE.PlaneGeometry(76, 0.015), gridMat);
    h.rotation.x = -Math.PI / 2; h.position.set(0, 0.003, i); scene.add(h);
    const v = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 76), gridMat);
    v.rotation.x = -Math.PI / 2; v.position.set(i, 0.003, 0); scene.add(v);
  }
  // Floor edge accent lines
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x003355, transparent: true, opacity: 0.15 });
  for (const x of [-36, 36]) {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 70), edgeMat);
    edge.rotation.x = -Math.PI / 2; edge.position.set(x, 0.005, -5); scene.add(edge);
  }

  // ── WALLS WITH PANELS (detailed lab) ──────────────────────────────────────
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a2040, roughness: 0.7, metalness: 0.15 });
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x202844, roughness: 0.6, metalness: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x303860, roughness: 0.45, metalness: 0.4 });
  // Back wall with panels
  const bw = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), wallMat);
  bw.position.set(0, 10, -40); scene.add(bw);
  for (let xi = -35; xi <= 35; xi += 5) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(4.5, 17, 0.12), panelMat);
    panel.position.set(xi, 9, -39.8); scene.add(panel);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.05, 17, 0.14), trimMat);
    trim.position.set(xi + 2.25, 9, -39.7); scene.add(trim);
  }
  for (const y of [1, 17.5]) {
    const ht = new THREE.Mesh(new THREE.BoxGeometry(76, 0.04, 0.14), trimMat);
    ht.position.set(0, y, -39.7); scene.add(ht);
  }
  // Side walls with panels + baseboards
  for (const s of [-1, 1]) {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), wallMat);
    sw.position.set(s * 38, 10, -2); sw.rotation.y = s * Math.PI / 2; scene.add(sw);
    for (let zi = -35; zi <= 25; zi += 5) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 17, 4.5), panelMat);
      panel.position.set(s * 37.8, 9, zi); scene.add(panel);
    }
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 76),
      new THREE.MeshStandardMaterial({ color: 0x0e0e18, metalness: 0.3, roughness: 0.6 }));
    baseboard.position.set(s * 37.85, 0.18, -2); scene.add(baseboard);
  }
  // Front wall
  const fw = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), wallMat);
  fw.position.set(0, 10, 36); fw.rotation.y = Math.PI; scene.add(fw);

  // ── CEILING WITH TILE GRID ────────────────────────────────────────────────
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0x101420, roughness: 0.8, metalness: 0.15 });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), ceilMat);
  ceil.rotation.x = Math.PI / 2; ceil.position.y = 20; scene.add(ceil);
  // Ceiling grid lines
  const ceilTrim = new THREE.MeshBasicMaterial({ color: 0x0d0d16, transparent: true, opacity: 0.25 });
  for (let i = -36; i <= 36; i += 4) {
    const ch = new THREE.Mesh(new THREE.BoxGeometry(72, 0.04, 0.04), ceilTrim);
    ch.position.set(0, 19.95, i); scene.add(ch);
    const cv2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 72), ceilTrim);
    cv2.position.set(i, 19.95, 0); scene.add(cv2);
  }
  // Recessed ceiling light panels
  const ceilLight = new THREE.MeshBasicMaterial({ color: 0x223355, transparent: true, opacity: 0.35 });
  for (let xi = -20; xi <= 20; xi += 10) {
    for (let zi = -28; zi <= 20; zi += 10) {
      const lp = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), ceilLight);
      lp.rotation.x = Math.PI / 2; lp.position.set(xi, 19.9, zi); scene.add(lp);
    }
  }

  // ── AMBIENT DUST PARTICLES ───────────────────────────────────────────────
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = [];
  const dustSizes = [];
  for(let i=0; i<1500; i++) {
    dustPos.push((Math.random()-0.5)*80, Math.random()*25, (Math.random()-0.5)*80);
    dustSizes.push(Math.random()*0.15 + 0.05);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('size', new THREE.Float32BufferAttribute(dustSizes, 1));
  
  // Custom shader for glowing dust
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0x88ccff) } },
    vertexShader: `
      attribute float size;
      uniform float time;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.y += sin(time * 0.2 + pos.x) * 2.0;
        pos.x += cos(time * 0.15 + pos.y) * 1.5;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (150.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = clamp(sin(time*0.5 + pos.x*0.1 + pos.z*0.1)*0.5+0.5, 0.1, 0.8);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float glow = exp(-d * 3.0);
        gl_FragColor = vec4(color, glow * vAlpha * 0.6);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  dustParticles = new THREE.Points(dustGeo, dustMat);
  scene.add(dustParticles);

  scene.add(new THREE.AmbientLight(0xffffff, 0.2)); // Extra boost

  // ── LAB WORKBENCHES ──────────────────────────────────────────────────────
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x0e1020, metalness: 0.4, roughness: 0.5 });
  const benchTop = new THREE.MeshStandardMaterial({ color: 0x151525, metalness: 0.6, roughness: 0.3 });
  
  // RGB edge material
  const rgbLineMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
  
  for (const s of [-1, 1]) {
    const baseGeo = new THREE.BoxGeometry(1.8, 2.8, 16);
    const base = new THREE.Mesh(baseGeo, benchMat);
    base.position.set(s * 34, 1.4, 0); scene.add(base);
    
    // Add RGB contour/edge to the legs
    const baseEdges = new THREE.EdgesGeometry(baseGeo);
    const baseLine = new THREE.LineSegments(baseEdges, rgbLineMat);
    baseLine.position.copy(base.position);
    scene.add(baseLine);
    rgbDeskEdges.push(baseLine);
    
    const topGeo = new THREE.BoxGeometry(2.2, 0.1, 16.4);
    const top = new THREE.Mesh(topGeo, benchTop);
    top.position.set(s * 34, 2.85, 0); scene.add(top);
    
    // Add RGB contour/edge to the top table surface
    const edges = new THREE.EdgesGeometry(topGeo);
    const line = new THREE.LineSegments(edges, rgbLineMat);
    line.position.copy(top.position);
    scene.add(line);
    rgbDeskEdges.push(line);
  }

  // ── CABLE TRAYS (ceiling) ────────────────────────────────────────────────
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x0a0a15, metalness: 0.5, roughness: 0.4 });
  for (const x of [-14, 0, 14]) {
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 55), cableMat);
    tray.position.set(x, 19.6, -5); scene.add(tray);
  }

  // ── AMBIENT PARTICLES ────────────────────────────────────────────────────
  const pCount = 150;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 55;
    pPos[i * 3 + 1] = Math.random() * 18;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 55;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x1a2a40, size: 0.04, transparent: true, opacity: 0.18
  })));
}

function buildLab() {
 buildLabEnvironment();
 // Clean RTX demo room — no datacenter racks (performance optimization)
}

// ── SERVER RACK BUILDER ───────────────────────────────────────────────────────
// Server types: 1U blade, 2U storage, 4U GPU, switch (1U flat)
// We'll define slot height mappings
const U = 0.0445; // 1U = 44.5mm in meters
const RU = 0.046; // slightly scaled for visibility

function addLed(mat, x, y, z, p, s, ph) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.018,0.018,0.012), mat);
  m.position.set(x,y,z); p.add(m);
  LEDs.push({mesh:m, mat:m.material, phase:ph??Math.random()*Math.PI*2, speed:s??1.5+Math.random()*3});
  return m;
}

// 1U Server blade (hyperscale style - Dell/HP/Supermicro aesthetic)
function build1U(g, slotY, config={}) {
  const h = RU * 1;
  const faceMat = config.face ?? M.serverFace;
  const bodyMat = config.body ?? M.serverBody;

  // Body
  const body = new THREE.Mesh(GEO.box(0.74, h*0.88, 0.94), bodyMat);
  body.position.set(0, slotY, 0.03); g.add(body);

  // Front bezel
  const bezel = new THREE.Mesh(GEO.box(0.74, h*0.88, 0.04), faceMat);
  bezel.position.set(0, slotY, 0.515); g.add(bezel);

  // Power button (left side)
  const pwrRing = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.004, 6, 12), M.rackRail);
  pwrRing.position.set(-0.31, slotY, 0.537); pwrRing.rotation.x = Math.PI/2; g.add(pwrRing);
  const pwrBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.004, 8), config.powered===false?M.ledDimG:M.ledG);
  pwrBtn.position.set(-0.31, slotY, 0.538); pwrBtn.rotation.x = Math.PI/2; g.add(pwrBtn);
  if(config.powered!==false) LEDs.push({mesh:pwrBtn, mat:pwrBtn.material, phase:Math.random()*6, speed:0.3+Math.random()*0.3});

  // Activity LED bar
  const actBar = new THREE.Mesh(GEO.box(0.003, h*0.55, 0.006), M.ledB);
  actBar.position.set(-0.26, slotY, 0.538); g.add(actBar);
  LEDs.push({mesh:actBar, mat:actBar.material, phase:Math.random()*6, speed:2+Math.random()*6});

  // Drive bays (NVMe/SSD style — front-loading) 
  const numDrives = config.drives ?? 4;
  const driveW = 0.13;
  const driveStart = -0.21;
  for (let d = 0; d < numDrives; d++) {
    const dx = driveStart + d * (driveW + 0.006);
    // drive tray surround
    const tray = new THREE.Mesh(GEO.box(driveW, h*0.72, 0.035), M.driveTray);
    tray.position.set(dx, slotY, 0.517); g.add(tray);
    // drive face
    const face = new THREE.Mesh(GEO.box(driveW-0.012, h*0.56, 0.006), M.driveFace);
    face.position.set(dx, slotY, 0.536); g.add(face);
    // drive activity LED
    const dled = new THREE.Mesh(GEO.box(0.005, 0.005, 0.005), Math.random()>0.15?M.ledG:M.ledA);
    dled.position.set(dx - driveW*0.35, slotY - h*0.22, 0.54); g.add(dled);
    LEDs.push({mesh:dled, mat:dled.material, phase:Math.random()*6, speed:3+Math.random()*8});
    // latch
    const latch = new THREE.Mesh(GEO.box(0.008, h*0.15, 0.012), M.rackRail);
    latch.position.set(dx + driveW*0.4, slotY + h*0.25, 0.538); g.add(latch);
  }

  // NIC port cluster
  for (let n = 0; n < 2; n++) {
    const nic = new THREE.Mesh(GEO.box(0.028, 0.018, 0.015), M.patchPort);
    nic.position.set(0.24 + n*0.038, slotY, 0.538); g.add(nic);
    // link LED
    const ll = new THREE.Mesh(GEO.box(0.005, 0.005, 0.006), Math.random()>0.2?M.ledG:M.ledDimG);
    ll.position.set(0.24 + n*0.038, slotY + 0.012, 0.541); g.add(ll);
    LEDs.push({mesh:ll, mat:ll.material, phase:Math.random()*6, speed:4+Math.random()*10});
    // activity LED
    const al = new THREE.Mesh(GEO.box(0.005, 0.005, 0.006), Math.random()>0.3?M.ledA:M.ledDimG);
    al.position.set(0.24 + n*0.038, slotY - 0.012, 0.541); g.add(al);
    LEDs.push({mesh:al, mat:al.material, phase:Math.random()*6, speed:6+Math.random()*15});
  }

  // USB port
  const usb = new THREE.Mesh(GEO.box(0.016, 0.01, 0.012), M.patchPort);
  usb.position.set(0.32, slotY, 0.537); g.add(usb);

  // Management port (iDRAC/iLO style - blue port)
  const mgmt = new THREE.Mesh(GEO.box(0.022, 0.014, 0.012), M.patchPort);
  mgmt.position.set(0.35, slotY, 0.537); g.add(mgmt);

  // Fan exhaust vents (right side of bezel)
  for (let fv = 0; fv < 3; fv++) {
    const slot = new THREE.Mesh(GEO.box(0.006, h*0.55, 0.012), M.driveSlot);
    slot.position.set(0.37 + fv*0.01, slotY, 0.534); g.add(slot);
  }

  // Ejector lever (right)
  const lev = new THREE.Mesh(GEO.box(0.015, h*0.65, 0.022), M.rackRail);
  lev.position.set(0.355, slotY, 0.533); g.add(lev);

  return body;
}

// 2U Storage server
function build2U(g, slotY) {
  const h = RU * 2;
  const body = new THREE.Mesh(GEO.box(0.74, h*0.9, 0.94), M.serverBody);
  body.position.set(0, slotY, 0.03); g.add(body);
  const bezel = new THREE.Mesh(GEO.box(0.74, h*0.9, 0.04), M.serverFace);
  bezel.position.set(0, slotY, 0.515); g.add(bezel);

  // 12 LFF drive bays (3x4 grid)
  const dW = 0.14, dH = h*0.38;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const dx = -0.32 + col*(dW+0.004);
      const dy = slotY + (row===0 ? h*0.2 : -h*0.2);
      const tray = new THREE.Mesh(GEO.box(dW, dH, 0.04), M.driveTray);
      tray.position.set(dx, dy, 0.514); g.add(tray);
      const face = new THREE.Mesh(GEO.box(dW-0.016, dH-0.01, 0.006), M.driveFace);
      face.position.set(dx, dy, 0.537); g.add(face);
      // notch / label area
      const notch = new THREE.Mesh(GEO.box(dW-0.02, 0.006, 0.004), M.driveSlot);
      notch.position.set(dx, dy+dH*0.45, 0.54); g.add(notch);
      const dled = new THREE.Mesh(GEO.box(0.005, 0.006, 0.005), Math.random()>0.1?M.ledG:M.ledA);
      dled.position.set(dx-dW*0.4, dy-dH*0.4, 0.542); g.add(dled);
      LEDs.push({mesh:dled, mat:dled.material, phase:Math.random()*6, speed:2+Math.random()*8});
    }
  }

  // Power button
  const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.005, 10), M.ledG);
  pb.position.set(0.33, slotY, 0.539); pb.rotation.x=Math.PI/2; g.add(pb);
  LEDs.push({mesh:pb, mat:pb.material, phase:Math.random()*6, speed:0.4});

  // NIC ports (4)
  for (let n=0;n<4;n++) {
    const nic = new THREE.Mesh(GEO.box(0.024, 0.016, 0.014), M.patchPort);
    nic.position.set(0.31, slotY-0.012+n*0.02, 0.537); g.add(nic);
  }

  // LCD panel
  const lcd = new THREE.Mesh(GEO.box(0.055, h*0.28, 0.006), M.screen);
  lcd.position.set(-0.28, slotY+h*0.22, 0.538); g.add(lcd);
  // LCD scanlines
  for (let li=0;li<4;li++) {
    const ln = new THREE.Mesh(GEO.box(0.05, 0.003, 0.002), M.ledC);
    ln.position.set(-0.28, slotY+h*0.1+li*0.012, 0.542); g.add(ln);
  }
}

// 4U GPU server
function build4U(g, slotY) {
  const h = RU * 4;
  const body = new THREE.Mesh(GEO.box(0.74, h*0.92, 0.94), M.serverBody);
  body.position.set(0, slotY, 0.03); g.add(body);
  const bezel = new THREE.Mesh(GEO.box(0.74, h*0.92, 0.04), M.rackBezel);
  bezel.position.set(0, slotY, 0.515); g.add(bezel);

  // GPU brackets visible (PCIe slots)
  for (let gp=0;gp<4;gp++) {
    const gpuBracket = new THREE.Mesh(GEO.box(0.128, h*0.75, 0.03), M.rackRail);
    gpuBracket.position.set(-0.26+gp*0.14, slotY, 0.518); g.add(gpuBracket);
    // GPU LED bar
    const gpuLed = new THREE.Mesh(GEO.box(0.1, 0.007, 0.008), M.ledG);
    gpuLed.position.set(-0.26+gp*0.14, slotY+h*0.32, 0.537); g.add(gpuLed);
    LEDs.push({mesh:gpuLed, mat:gpuLed.material, phase:Math.random()*6, speed:0.8+Math.random()});
    // Fan vent holes
    for (let fh=0;fh<8;fh++) {
      const fslot = new THREE.Mesh(GEO.box(0.1, 0.004, 0.008), M.driveSlot);
      fslot.position.set(-0.26+gp*0.14, slotY-h*0.3+fh*0.026, 0.528); g.add(fslot);
    }
  }

  // Power button
  const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.006, 10), M.ledW);
  pb.position.set(0.34, slotY+h*0.3, 0.539); pb.rotation.x=Math.PI/2; g.add(pb);
  LEDs.push({mesh:pb, mat:pb.material, phase:Math.random()*6, speed:0.4});

  // USB-C / ports
  const usbC = new THREE.Mesh(GEO.box(0.016, 0.01, 0.012), M.patchPort);
  usbC.position.set(0.34, slotY, 0.537); g.add(usbC);

  // NVMe drives top row
  for (let d=0;d<4;d++) {
    const nf = new THREE.Mesh(GEO.box(0.05, 0.018, 0.025), M.driveFace);
    nf.position.set(0.2-d*0.058, slotY+h*0.32, 0.535); g.add(nf);
    const nled = new THREE.Mesh(GEO.box(0.005, 0.005, 0.006), M.ledG);
    nled.position.set(0.2-d*0.058, slotY+h*0.32-0.012, 0.542); g.add(nled);
    LEDs.push({mesh:nled, mat:nled.material, phase:Math.random()*6, speed:3+Math.random()*10});
  }
}

// 1U Network switch (48 ports)
function buildSwitch(g, slotY) {
  const h = RU * 1.2;
  const body = new THREE.Mesh(GEO.box(0.74, h*0.85, 0.94), M.switchBody);
  body.position.set(0, slotY, 0.03); g.add(body);
  const bezel = new THREE.Mesh(GEO.box(0.74, h*0.85, 0.035), M.rackBezel);
  bezel.position.set(0, slotY, 0.515); g.add(bezel);

  // 48 port grid (4 rows × 12 cols)
  for (let row=0;row<2;row++) {
    for (let col=0;col<24;col++) {
      const px = -0.34 + col*(0.55/24);
      const py = slotY + (row===0? h*0.15 : -h*0.15);
      const port = new THREE.Mesh(GEO.box(0.016, 0.011, 0.012), M.patchPort);
      port.position.set(px, py, 0.534); g.add(port);
      const linkLed = new THREE.Mesh(GEO.box(0.005, 0.004, 0.005), Math.random()>0.15?M.ledG:M.ledDimG);
      linkLed.position.set(px, py+0.009, 0.539); g.add(linkLed);
      LEDs.push({mesh:linkLed, mat:linkLed.material, phase:Math.random()*6, speed:3+Math.random()*12});
    }
  }

  // Uplink SFP+ (right)
  for (let u=0;u<4;u++) {
    const sfp = new THREE.Mesh(GEO.box(0.024, 0.013, 0.02), M.patchPort);
    sfp.position.set(0.31, slotY+(u-1.5)*0.014, 0.533); g.add(sfp);
    const sl = new THREE.Mesh(GEO.box(0.006, 0.005, 0.006), Math.random()>0.3?M.ledC:M.ledDimG);
    sl.position.set(0.31, slotY+(u-1.5)*0.014+0.01, 0.539); g.add(sl);
    LEDs.push({mesh:sl, mat:sl.material, phase:Math.random()*6, speed:2+Math.random()*5});
  }

  // Status LEDs left
  for (let s=0;s<3;s++) {
    const sl = new THREE.Mesh(GEO.box(0.009, 0.009, 0.008), [M.ledG,M.ledG,M.ledA][s]);
    sl.position.set(-0.35, slotY+(s-1)*0.015, 0.539); g.add(sl);
    LEDs.push({mesh:sl, mat:sl.material, phase:Math.random()*6, speed:0.8+s*0.4});
  }
}

// 1U Patch panel
function buildPatch(g, slotY) {
  const h = RU;
  const body = new THREE.Mesh(GEO.box(0.74, h*0.8, 0.15), M.switchBody);
  body.position.set(0, slotY, 0.47); g.add(body);
  // 24 keystone jacks per row, 2 rows
  for (let row=0;row<2;row++) {
    for (let col=0;col<24;col++) {
      const px = -0.33 + col*(0.64/24);
      const py = slotY + (row===0? h*0.12 : -h*0.12);
      const jack = new THREE.Mesh(GEO.box(0.018, 0.014, 0.018), M.patchPort);
      jack.position.set(px, py, 0.535); g.add(jack);
      // keystones have a slight indent
      const inner = new THREE.Mesh(GEO.box(0.012, 0.009, 0.006), M.driveSlot);
      inner.position.set(px, py, 0.542); g.add(inner);
    }
  }
  // label strip
  const lstrip = new THREE.Mesh(GEO.box(0.68, h*0.12, 0.006), M.blank);
  lstrip.position.set(0, slotY+h*0.38, 0.536); g.add(lstrip);
}

// 1U KVM drawer
function buildKVM(g, slotY) {
  const h = RU*2;
  const body = new THREE.Mesh(GEO.box(0.74, h*0.85, 0.5), M.serverBody);
  body.position.set(0, slotY, 0.27); g.add(body);
  const face = new THREE.Mesh(GEO.box(0.74, h*0.85, 0.04), M.rackBezel);
  face.position.set(0, slotY, 0.515); g.add(face);
  // LCD strip
  const lcd = new THREE.Mesh(GEO.box(0.5, h*0.45, 0.008), M.screen);
  lcd.position.set(0, slotY, 0.538); g.add(lcd);
  for (let li=0;li<5;li++) {
    const ln = new THREE.Mesh(GEO.box(0.46, 0.004, 0.003), M.ledC);
    ln.position.set(0, slotY-h*0.15+li*h*0.09, 0.543); g.add(ln);
  }
  // handle
  const hand = new THREE.Mesh(GEO.box(0.12, h*0.2, 0.025), M.rackRail);
  hand.position.set(0.28, slotY, 0.536); g.add(hand);
}

// Blanking panel
function buildBlank(g, slotY, units=1) {
  const h = RU * units;
  const blank = new THREE.Mesh(GEO.box(0.74, h*0.9, 0.025), M.blank);
  blank.position.set(0, slotY, 0.527); g.add(blank);
  // texture slots
  for (let s=0;s<6;s++) {
    const sl = new THREE.Mesh(GEO.box(0.1, h*0.3, 0.005), M.driveSlot);
    sl.position.set(-0.3+s*0.12, slotY, 0.532); g.add(sl);
  }
}

// PDU strip (vertical, on side of rack)
function buildPDU(g, side) {
  const pduG = new THREE.Group();
  g.add(pduG);
  const sx = side * 0.43;
  const pduBody = new THREE.Mesh(GEO.box(0.055, 7, 0.055), M.pduBody);
  pduBody.position.set(sx, 3.5, -0.35); pduG.add(pduBody);
  // outlet sockets
  for (let i=0;i<18;i++) {
    const sock = new THREE.Mesh(GEO.box(0.04, 0.04, 0.02), M.driveSlot);
    sock.position.set(sx, 0.6+i*0.35, -0.31); pduG.add(sock);
  }
  // status LED bar on PDU
  const pLed = new THREE.Mesh(GEO.box(0.008, 6.5, 0.008), M.ledG);
  pLed.position.set(sx+(side*0.02), 3.5, -0.32); pduG.add(pLed);
  LEDs.push({mesh:pLed, mat:pLed.material, phase:Math.random()*6, speed:0.6});
}

// Cable Management Arm (back)
function buildCMA(g, slotY) {
  const arm1 = new THREE.Mesh(GEO.box(0.55, 0.012, 0.015), M.rackRail);
  arm1.position.set(0, slotY, -0.45); g.add(arm1);
  const arm2 = new THREE.Mesh(GEO.box(0.4, 0.012, 0.015), M.rackRail);
  arm2.position.set(0.08, slotY, -0.55); g.add(arm2);
  // cable bundle on CMA
  const cBundle = new THREE.Mesh(GEO.box(0.06, 0.06, 0.4), M.cableBlk);
  cBundle.position.set(0.1, slotY, -0.52); g.add(cBundle);
}

// ── FULL RACK ──────────────────────────────────────────────────────────────────
function buildRack(wx, wz, ry=0) {
  const g = grp(wx, 0, wz, ry);

  // Outer chassis
  const chassis = new THREE.Mesh(GEO.box(0.88, 7.1, 1.18), M.rackShell);
  chassis.position.y = 3.55; chassis.castShadow=true; chassis.receiveShadow=true; g.add(chassis);

  // Inner cavity (dark void)
  const inner = new THREE.Mesh(GEO.box(0.76, 6.8, 1.08), M.rackInner);
  inner.position.set(0, 3.55, 0.02); g.add(inner);

  // Vertical rails (4 mounting rails)
  for (let rx2 of [-0.355, 0.355]) {
    for (let rz2 of [-0.44, 0.38]) {
      const rail = new THREE.Mesh(GEO.box(0.025, 7.1, 0.022), M.rackRail);
      rail.position.set(rx2, 3.55, rz2); g.add(rail);
      // mounting holes on rail
      for (let rh=0; rh<38; rh++) {
        const hole = new THREE.Mesh(GEO.box(0.012, 0.007, 0.025), M.driveSlot);
        hole.position.set(rx2, 0.4+rh*0.18, rz2); g.add(hole);
      }
    }
  }

  // Top status panel
  const topPanel = new THREE.Mesh(GEO.box(0.84, 0.08, 1.15), M.rackBezel);
  topPanel.position.set(0, 7.14, 0); g.add(topPanel);
  // top LED strip
  const topLed = new THREE.Mesh(GEO.box(0.7, 0.014, 0.01), M.ledB);
  topLed.position.set(0, 7.19, 0.42); g.add(topLed);
  LEDs.push({mesh:topLed, mat:topLed.material, phase:Math.random()*6, speed:1.2});

  // Glass front door (hinged panel aesthetic)
  const glass = new THREE.Mesh(GEO.box(0.76, 6.85, 0.016), M.glassPanel);
  glass.position.set(0, 3.55, 0.55); g.add(glass);
  // Door frame
  const doorFrameT = new THREE.Mesh(GEO.box(0.86, 0.04, 0.06), M.rackShell);
  doorFrameT.position.set(0, 7.1, 0.54); g.add(doorFrameT);
  const doorFrameB = new THREE.Mesh(GEO.box(0.86, 0.04, 0.06), M.rackShell);
  doorFrameB.position.set(0, 0.1, 0.54); g.add(doorFrameB);
  for (let ds of [-0.41, 0.41]) {
    const doorFrameS = new THREE.Mesh(GEO.box(0.04, 7, 0.06), M.rackShell);
    doorFrameS.position.set(ds, 3.55, 0.54); g.add(doorFrameS);
  }

  // Door handle
  const handle = new THREE.Mesh(GEO.box(0.016, 0.14, 0.035), M.rackRail);
  handle.position.set(0.39, 3.55, 0.576); g.add(handle);

  // Bottom pedestal
  const ped = new THREE.Mesh(GEO.box(0.92, 0.12, 1.22), M.rackRail);
  ped.position.set(0, 0.06, 0); g.add(ped);
  // leveling feet
  for (let fx of [-0.35, 0.35]) {
    for (let fz2 of [-0.48, 0.48]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.07, 8), M.rackShell);
      foot.position.set(fx, -0.015, fz2); g.add(foot);
    }
  }

  // Front vertical glow strip
  const glowStrip = new THREE.Mesh(GEO.box(0.008, 7.0, 0.01), M.ledC);
  glowStrip.position.set(-0.42, 3.55, 0.562); g.add(glowStrip);
  LEDs.push({mesh:glowStrip, mat:glowStrip.material, phase:Math.random()*6, speed:0.5+Math.random()*0.3});

  // PDU strips
  buildPDU(g, -1);
  buildPDU(g, 1);

  // Back cable cluster
  for (let ci=0; ci<10; ci++) {
    const cMat = [M.cableCyan, M.cableAmber, M.cableBlk, M.cableGray, M.cableRed][ci%5];
    const cH = 3 + Math.random()*3;
    const cable = new THREE.Mesh(GEO.box(0.025, cH, 0.025), cMat);
    cable.position.set(-0.35+ci*0.07, 4+cH*0.5, -0.52);
    cable.rotation.z = (Math.random()-0.5)*0.15;
    g.add(cable);
  }

  // ── SLOT LAYOUT ────────────────────────────────────────────────────────────
  // Total: 42U rack. We'll lay out different server types
  let currentU = 0.5 * RU; // bottom margin
  const totalU = 42;
  let uUsed = 0;

  // Randomize a realistic layout for this rack
  const layout = [];
  // Always start with patch panel
  layout.push('patch');
  layout.push('patch');
  layout.push('switch');
  layout.push('switch');
  // mix of servers
  const serverTypes = ['1u','1u','1u','1u','1u','1u','2u','4u','kvm','blank'];
  while (uUsed < 32) {
    const pick = serverTypes[Math.floor(Math.random()*serverTypes.length)];
    layout.push(pick);
    uUsed += pick==='4u'?4:pick==='2u'?2:1;
    if (uUsed > 32) break;
  }
  // pad with blanks
  while (layout.length < 40) layout.push('blank');

  let slotY = 0.25;
  for (const type of layout) {
    if (type==='1u') {
      build1U(g, slotY, {drives: 2+Math.floor(Math.random()*3)});
      buildCMA(g, slotY);
      slotY += RU * 1.08;
    } else if (type==='2u') {
      build2U(g, slotY + RU);
      buildCMA(g, slotY + RU);
      slotY += RU * 2.1;
    } else if (type==='4u') {
      build4U(g, slotY + RU*2);
      slotY += RU * 4.2;
    } else if (type==='switch') {
      buildSwitch(g, slotY);
      slotY += RU * 1.25;
    } else if (type==='patch') {
      buildPatch(g, slotY);
      slotY += RU * 1.05;
    } else if (type==='kvm') {
      buildKVM(g, slotY+RU);
      slotY += RU * 2.1;
    } else {
      buildBlank(g, slotY);
      slotY += RU * 1.05;
    }
    if (slotY > 6.8) break;
  }

  return g;
}

// ── COOLING CRAC UNITS ─────────────────────────────────────────────────────────
function buildCRAC(x, z, ry=0) {
  const g = grp(x, 0, z, ry);

  // Body
  const body = new THREE.Mesh(GEO.box(1.5, 5.5, 0.85), M.cooler);
  body.position.y=2.75; body.castShadow=true; g.add(body);

  // Front panel
  const face = new THREE.Mesh(GEO.box(1.5, 5.5, 0.06), M.rackBezel);
  face.position.set(0, 2.75, 0.455); g.add(face);

  // Manufacturer badge area (top panel inset)
  const badge = new THREE.Mesh(GEO.box(1.0, 0.08, 0.04), M.rackShell);
  badge.position.set(0, 5.42, 0.475); g.add(badge);

  // 3 large fans with blades
  for (let fi=0; fi<3; fi++) {
    const fy = 0.75 + fi*1.55;
    // Fan shroud ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.045, 10, 32), M.rackShell);
    ring.position.set(0, fy, 0.46); ring.rotation.x=Math.PI/2; g.add(ring);
    // Fan grille (hex pattern using grid)
    for (let gx=-2;gx<=2;gx++) {
      for (let gy=-2;gy<=2;gy++) {
        if (Math.sqrt(gx*gx+gy*gy)>2.2) continue;
        const gh = new THREE.Mesh(GEO.box(0.08, 0.012, 0.005), M.rackInner);
        gh.position.set(gx*0.11, fy+gy*0.09, 0.48); g.add(gh);
        const gv = new THREE.Mesh(GEO.box(0.012, 0.08, 0.005), M.rackInner);
        gv.position.set(gx*0.11, fy+gy*0.09, 0.48); g.add(gv);
      }
    }
    // Fan hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), M.fanHub);
    hub.position.set(0, fy, 0.47); hub.rotation.x=Math.PI/2; g.add(hub);
    // Fan blades (spinning group)
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, fy, 0.47);
    fanGroup.rotation.x = Math.PI/2;
    for (let b=0;b<7;b++) {
      const angle = (b/7)*Math.PI*2;
      const blade = new THREE.Mesh(GEO.box(0.22, 0.055, 0.012), M.fanBlade);
      blade.position.set(Math.cos(angle)*0.16, Math.sin(angle)*0.16, 0);
      blade.rotation.z = angle + 0.4;
      fanGroup.add(blade);
    }
    g.add(fanGroup);
    FANs.push(fanGroup);
    // Blue center glow
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 8), M.ledB);
    glow.position.set(0, fy, 0.488); glow.rotation.x=Math.PI/2; g.add(glow);
  }

  // Horizontal grille slats (lower half)
  for (let si=0;si<22;si++) {
    const slat = new THREE.Mesh(GEO.box(1.38, 0.025, 0.03), M.rackRail);
    slat.position.set(0, 0.3+si*0.2, 0.46); g.add(slat);
  }

  // Status LED strip
  const ledBar = new THREE.Mesh(GEO.box(0.012, 5.0, 0.01), M.ledC);
  ledBar.position.set(0.71, 2.75, 0.45); g.add(ledBar);
  LEDs.push({mesh:ledBar, mat:ledBar.material, phase:Math.random()*6, speed:0.7});

  // Control panel (small touchscreen)
  const ctrl = new THREE.Mesh(GEO.box(0.35, 0.22, 0.01), M.screen);
  ctrl.position.set(-0.45, 4.8, 0.461); g.add(ctrl);
  for (let li=0;li<5;li++) {
    const cl = new THREE.Mesh(GEO.box(0.3, 0.006, 0.003), M.ledC);
    cl.position.set(-0.45, 4.68+li*0.03, 0.468); g.add(cl);
  }

  // Pipe connections top
  const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 10), M.rackShell);
  pipe1.position.set(-0.45, 5.8, 0); pipe1.rotation.z=Math.PI/2; g.add(pipe1);
  const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.55, 10), M.cableCyan);
  pipe2.position.set(0.45, 5.8, 0); pipe2.rotation.z=Math.PI/2; g.add(pipe2);

  // Point light — cold air exhaust glow
  const ptL = new THREE.PointLight(0x0066aa, 1.2, 7);
  ptL.position.set(0, 1.5, 1.2); g.add(ptL);

  return g;
}

// ── UPS UNIT ───────────────────────────────────────────────────────────────────
function buildUPS(x, z) {
  const g = grp(x, 0, z);
  const body = new THREE.Mesh(GEO.box(1.2, 1.6, 0.8), M.rackShell);
  body.position.y=0.8; body.castShadow=true; g.add(body);
  const face = new THREE.Mesh(GEO.box(1.2, 1.6, 0.06), M.rackBezel);
  face.position.set(0, 0.8, 0.43); g.add(face);
  // display
  const disp = new THREE.Mesh(GEO.box(0.45, 0.22, 0.01), M.screenA);
  disp.position.set(-0.2, 1.05, 0.462); g.add(disp);
  for (let li=0;li<4;li++) {
    const dl = new THREE.Mesh(GEO.box(0.4, 0.008, 0.004), M.ledG);
    dl.position.set(-0.2, 0.95+li*0.025, 0.469); g.add(dl);
    LEDs.push({mesh:dl, mat:dl.material, phase:Math.random()*6, speed:0.5});
  }
  // outlets
  for (let oi=0;oi<6;oi++) {
    const out = new THREE.Mesh(GEO.box(0.055, 0.045, 0.015), M.driveSlot);
    out.position.set(0.25+(oi%3)*0.095, 0.7+(Math.floor(oi/3))*0.08, 0.464); g.add(out);
  }
  // status LEDs
  for (let sl=0;sl<3;sl++) {
    const sled = new THREE.Mesh(GEO.box(0.014, 0.014, 0.01), [M.ledG,M.ledA,M.ledG][sl]);
    sled.position.set(-0.45, 0.65+sl*0.04, 0.464); g.add(sled);
    LEDs.push({mesh:sled, mat:sled.material, phase:Math.random()*6, speed:0.4+sl*0.2});
  }
}

// ── HOLOGRAPHIC PILLAR ─────────────────────────────────────────────────────────
function buildPillar(x, z) {
  const g = grp(x, 0, z);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.14, 8), M.rackShell);
  base.position.y=0.07; g.add(base);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.6, 10), M.rackBezel);
  shaft.position.y=1.9; g.add(shaft);
  for (let ri=0;ri<6;ri++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 8, 28), M.ledC);
    ring.position.y=0.4+ri*0.55; ring.rotation.x=Math.PI/2; g.add(ring);
    LEDs.push({mesh:ring, mat:ring.material, phase:ri*0.8, speed:0.4+Math.random()*0.3});
  }
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), M.ledB);
  cap.position.y=3.85; g.add(cap);
  LEDs.push({mesh:cap, mat:cap.material, phase:0, speed:0.6});
  const ptL = new THREE.PointLight(0x0066cc, 1.8, 7);
  ptL.position.y=3.85; g.add(ptL);
}

// ═══ ANIMATED ENERGY PLATFORMS ═══
function buildEnergyPlatforms(){
[{x:SX,c:0x42a5f5,c2:0x2244aa},{x:KX,c:0xffaa00,c2:0xcc6600},{x:AX,c:0x00e5ff,c2:0x0088aa}].forEach((cfg,idx)=>{
const base=new THREE.Group();
// Central energy disc
const discMat=new THREE.MeshBasicMaterial({color:cfg.c,transparent:true,opacity:0.12,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
const disc=new THREE.Mesh(new THREE.CircleGeometry(5,64),discMat);disc.rotation.x=-Math.PI/2;disc.position.y=0.05;base.add(disc);
// Multiple rotating rings
for(let i=0;i<3;i++){
const ringGeo=new THREE.TorusGeometry(3+i*1.2,0.03,8,64);
const ringMat=new THREE.MeshBasicMaterial({color:cfg.c,transparent:true,opacity:0.5-i*0.12,blending:THREE.AdditiveBlending});
const ring=new THREE.Mesh(ringGeo,ringMat);ring.rotation.x=-Math.PI/2;ring.position.y=0.1+i*0.15;
base.add(ring);models['ring_'+idx+'_'+i]=ring;
}
// Particle vortex
const vGeo=new THREE.BufferGeometry(),vPos=new Float32Array(300*3);
for(let i=0;i<300;i++){const a=Math.random()*Math.PI*2,r=1+Math.random()*4;
vPos[i*3]=Math.cos(a)*r;vPos[i*3+1]=Math.random()*3;vPos[i*3+2]=Math.sin(a)*r;}
vGeo.setAttribute('position',new THREE.BufferAttribute(vPos,3));
const vPts=new THREE.Points(vGeo,new THREE.PointsMaterial({color:cfg.c,size:0.08,transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false}));
base.add(vPts);models['vortex_'+idx]=vPts;
// Holographic pillars
for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2;
const pillar=new THREE.Mesh(new THREE.BoxGeometry(0.06,2,0.06),new THREE.MeshBasicMaterial({color:cfg.c,transparent:true,opacity:0.25,blending:THREE.AdditiveBlending}));
pillar.position.set(Math.cos(a)*4.5,1,Math.sin(a)*4.5);base.add(pillar);
}
// Energy beams connecting to center
for(let i=0;i<3;i++){const a=(i/3)*Math.PI*2;
const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,4.5,4),new THREE.MeshBasicMaterial({color:cfg.c,transparent:true,opacity:0.15,blending:THREE.AdditiveBlending}));
beam.rotation.z=Math.PI/2;beam.rotation.y=a;beam.position.y=0.3;base.add(beam);
}
base.position.set(cfg.x,0,0);scene.add(base);
energyBases.push({group:base,color:cfg.c,idx});
});
}

// ═══ ULTRA MONITOR ═══
function buildMonitor(){
monitorGroup=new THREE.Group();
monCanvas=document.createElement('canvas');monCanvas.width=MW;monCanvas.height=MH;
monCtx=monCanvas.getContext('2d');monTex=new THREE.CanvasTexture(monCanvas);monTex.minFilter=THREE.LinearFilter;
// Sleek ultrawide frame
const frameMat=new THREE.MeshPhysicalMaterial({color:0x0a0a0a,metalness:0.95,roughness:0.03,clearcoat:1});
// Main body with beveled edges
const body=new THREE.Mesh(new THREE.BoxGeometry(26,14,0.5),frameMat);body.position.set(0,9,0);
// Thin bezel
const bz=0.2;
monitorGroup.add(body);
[{s:[26.6,bz,0.7],p:[0,16.05,0]},{s:[26.6,bz,0.7],p:[0,1.95,0]},{s:[bz,14.3,0.7],p:[-13.2,9,0]},{s:[bz,14.3,0.7],p:[13.2,9,0]}].forEach(b=>{
const m=new THREE.Mesh(new THREE.BoxGeometry(...b.s),frameMat);m.position.set(...b.p);monitorGroup.add(m);});
// Screen
const screenMat=new THREE.MeshBasicMaterial({map:monTex});
const screen=new THREE.Mesh(new THREE.PlaneGeometry(25.8,13.8),screenMat);screen.position.set(0,9,0.26);monitorGroup.add(screen);
// RGB LED strip behind monitor
const ledStrip=new THREE.Mesh(new THREE.PlaneGeometry(24,12),new THREE.MeshBasicMaterial({color:0x0044ff,transparent:true,opacity:0.15,blending:THREE.AdditiveBlending}));
ledStrip.position.set(0,9,-0.5);monitorGroup.add(ledStrip);models.monLed=ledStrip;
// Stand - premium V-shape
const standArm=new THREE.Mesh(new THREE.BoxGeometry(1.5,4,0.8),frameMat);standArm.position.set(0,0.5,0);monitorGroup.add(standArm);
const standBase=new THREE.Mesh(new THREE.CylinderGeometry(4,4,0.25,6),frameMat);standBase.position.set(0,-1.3,0.5);monitorGroup.add(standBase);
// KEVIN AI logo on stand
const logoPl=new THREE.Mesh(new THREE.PlaneGeometry(3,0.5),new THREE.MeshBasicMaterial({color:0x00bfff,transparent:true,opacity:0.5}));
logoPl.position.set(0,2.8,0.45);logoPl.rotation.x=-0.1;monitorGroup.add(logoPl);
// Click target
const ct=new THREE.Mesh(new THREE.BoxGeometry(28,16,4),new THREE.MeshBasicMaterial({visible:false}));
ct.position.set(0,9,0);ct.userData={isMonitor:true};monitorGroup.add(ct);
monitorGroup.position.set(CX,0.5,CZ);scene.add(monitorGroup);models.monitorGroup=ct;
// Setup fullscreen canvas
fsCanvas=document.getElementById('monitor-fs-canvas');
if(fsCanvas){fsCanvas.width=1920;fsCanvas.height=1080;fsCtx=fsCanvas.getContext('2d');}
}

// ═══ MONITOR DRAWING (shared) ═══
function drawScreen(ctx,w,h,t,mode){
const bg=ctx.createLinearGradient(0,0,0,h);
if(mode==='steel'){bg.addColorStop(0,'#180800');bg.addColorStop(1,'#0a0300');}
else if(mode==='kevlar'){bg.addColorStop(0,'#181000');bg.addColorStop(1,'#0a0600');}
else if(mode==='aluminum'){bg.addColorStop(0,'#001218');bg.addColorStop(1,'#000810');}
else{bg.addColorStop(0,'#040810');bg.addColorStop(1,'#080c18');}
ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
// Scanlines
ctx.strokeStyle='rgba(100,200,255,0.02)';for(let y=0;y<h;y+=2){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
const sc=w/1024; // scale factor
// Taskbar
ctx.fillStyle='#080c16';ctx.fillRect(0,h-28*sc,w,28*sc);
ctx.fillStyle='rgba(0,229,255,0.12)';ctx.fillRect(0,h-28*sc,w,1);
ctx.fillStyle='#00e5ff';ctx.font=`${11*sc}px Orbitron`;ctx.textAlign='left';ctx.fillText('⬡ KEVIN OS',10*sc,h-9*sc);
ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font=`${10*sc}px Share Tech Mono`;ctx.textAlign='right';
ctx.fillText(new Date().toLocaleTimeString(),w-10*sc,h-9*sc);ctx.textAlign='left';
// Desktop icons
const icons=['📊 Analysis','🔬 Scanner','⚙ Config','📁 Data','🧠 AI Core','🛡 Shield','📈 Monitor','💎 Assets'];
icons.forEach((ic,i)=>{const ix=15*sc+(i%2)*80*sc,iy=20*sc+Math.floor(i/2)*55*sc;
ctx.fillStyle='rgba(0,229,255,0.05)';ctx.fillRect(ix-3*sc,iy-3*sc,70*sc,45*sc);
ctx.fillStyle='rgba(0,229,255,0.6)';ctx.font=`${20*sc}px serif`;ctx.fillText(ic.split(' ')[0],ix+18*sc,iy+20*sc);
ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font=`${8*sc}px Share Tech Mono`;ctx.fillText(ic.split(' ')[1],ix+5*sc,iy+35*sc);});

// Main app window
const wx=180*sc,wy=10*sc,ww=w-200*sc,wh=h-50*sc;
ctx.fillStyle='#0a1020';ctx.fillRect(wx,wy,ww,wh);
ctx.fillStyle='#0e1830';ctx.fillRect(wx,wy,ww,22*sc);
const titles={steel:'⚠ THERMAL STRESS ANALYZER',kevlar:'🛡 BALLISTIC IMPACT SIMULATOR',aluminum:'🔷 STRUCTURAL INTEGRITY CHECK',idle:'MATERIAL ANALYSIS SYSTEM v3.2'};
const colors={steel:'#ff4020',kevlar:'#ffaa00',aluminum:'#00e5ff',idle:'#00e5ff'};
ctx.fillStyle=colors[mode]||'#00e5ff';ctx.font=`${10*sc}px Orbitron`;ctx.fillText(titles[mode]||titles.idle,wx+8*sc,wy+15*sc);
// Window buttons
['#ff4040','#ffaa00','#00cc44'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(wx+ww-(15+i*15)*sc,wy+11*sc,4*sc,0,Math.PI*2);ctx.fill();});

const cx_=wx+12*sc,cy_=wy+35*sc,cw=ww-24*sc;
if(mode==='steel'){
ctx.fillStyle='#ff4020';ctx.font=`bold ${14*sc}px Orbitron`;ctx.fillText('STRESS THRESHOLD MONITORING',cx_,cy_);
ctx.fillStyle='rgba(255,80,30,0.6)';ctx.font=`${9*sc}px Share Tech Mono`;
['THERMAL SCAN ACTIVE','STRAIN GAUGE: RECORDING','FAILURE PREDICTION: RUNNING'].forEach((m,i)=>{ctx.fillText('> '+m,cx_,cy_+18*sc+i*14*sc);});
// Heatmap
const hy=cy_+70*sc,hh=wh*0.35;
for(let x=0;x<cw;x+=3*sc)for(let y=0;y<hh;y+=3*sc){const v=Math.sin(x*0.02/sc+t)*Math.cos(y*0.03/sc+t*.7)+Math.sin((x+y)*0.01/sc+t*2)*.5;
ctx.fillStyle=`rgb(${150+v*80|0},${30+v*30|0},${10+v*10|0})`;ctx.fillRect(cx_+x,hy+y,3*sc,3*sc);}
// Warning
if(Math.sin(t*4)>0){ctx.fillStyle='#ff2200';ctx.font=`bold ${13*sc}px Orbitron`;ctx.fillText('⚠ STRESS THRESHOLD EXCEEDED',cx_,hy+hh+25*sc);
ctx.fillStyle='rgba(255,50,0,0.5)';ctx.font=`${10*sc}px Share Tech Mono`;ctx.fillText('STRUCTURAL FAILURE IMMINENT',cx_,hy+hh+42*sc);}
}else if(mode==='kevlar'){
ctx.fillStyle='#ffaa00';ctx.font=`bold ${14*sc}px Orbitron`;ctx.fillText('BALLISTIC RESISTANCE ANALYSIS',cx_,cy_);
ctx.fillStyle='rgba(255,200,60,0.6)';ctx.font=`${9*sc}px Share Tech Mono`;
['KINETIC ENERGY DISPERSION ACTIVE','FIBER INTEGRITY: 98.7%','PENETRATION DEPTH: 0.0mm'].forEach((m,i)=>{ctx.fillText('> '+m,cx_,cy_+18*sc+i*14*sc);});
// Ripple impact
const ry=cy_+75*sc,rcx_=cx_+cw/2,rcy=ry+wh*0.15;
for(let i=0;i<8;i++){const r=(15+i*25)*sc+Math.sin(t*3)*5*sc;ctx.strokeStyle=`rgba(255,170,0,${.4-i*.04})`;ctx.lineWidth=2*sc;ctx.beginPath();ctx.arc(rcx_,rcy,r,0,Math.PI*2);ctx.stroke();}
ctx.fillStyle='#ffcc00';ctx.beginPath();ctx.arc(rcx_,rcy,4*sc+Math.sin(t*6)*2*sc,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#ffcc00';ctx.font=`bold ${13*sc}px Orbitron`;ctx.fillText('BALLISTIC RESISTANCE: HIGH',cx_,rcy+wh*0.2);
}else if(mode==='aluminum'){
ctx.fillStyle='#00e5ff';ctx.font=`bold ${14*sc}px Orbitron`;ctx.fillText('LIGHTWEIGHT OPTIMIZATION',cx_,cy_);
ctx.fillStyle='rgba(100,240,255,0.6)';ctx.font=`${9*sc}px Share Tech Mono`;
['STRUCTURE OPTIMIZED','WEIGHT RATIO: 0.35','CORROSION RESISTANCE: EXCELLENT'].forEach((m,i)=>{ctx.fillText('> '+m,cx_,cy_+18*sc+i*14*sc);});
// Mesh visualization
const my=cy_+70*sc;ctx.strokeStyle='rgba(0,229,255,0.2)';ctx.lineWidth=0.8*sc;
for(let x=0;x<cw;x+=15*sc)for(let y=0;y<wh*0.35;y+=15*sc){const dx=Math.sin(x*.02/sc+t)*3*sc;
ctx.beginPath();ctx.moveTo(cx_+x+dx,my+y);ctx.lineTo(cx_+x+15*sc+dx,my+y);ctx.stroke();
ctx.beginPath();ctx.moveTo(cx_+x+dx,my+y);ctx.lineTo(cx_+x+dx,my+y+15*sc);ctx.stroke();}
ctx.fillStyle='#00ffcc';ctx.font=`bold ${13*sc}px Orbitron`;ctx.fillText('FLEXIBILITY: HIGH | WEIGHT: OPTIMIZED',cx_,my+wh*0.35+20*sc);
}else{
ctx.fillStyle='#00e5ff';ctx.font=`${13*sc}px Orbitron`;ctx.fillText('MATERIAL ANALYSIS SYSTEM ONLINE',cx_,cy_);
const msgs=['SCANNING STRUCTURES...','INITIALIZING DATA STREAM...','AI CORE: ACTIVE','NEURAL NETWORK: CALIBRATED','SENSOR ARRAY: NOMINAL','QUANTUM PROCESSOR: READY'];
msgs.forEach((m,i)=>{ctx.fillStyle=`rgba(0,229,255,${.3+.3*Math.sin(t*2+i*1.3)})`;ctx.font=`${9*sc}px Share Tech Mono`;ctx.fillText('> '+m,cx_,cy_+20*sc+i*14*sc);});
// Animated waves
const gy=cy_+120*sc,gh=wh*0.3;
ctx.strokeStyle='rgba(0,229,255,0.15)';ctx.lineWidth=0.5*sc;for(let i=0;i<=5;i++){const yy=gy+i*gh/5;ctx.beginPath();ctx.moveTo(cx_,yy);ctx.lineTo(cx_+cw,yy);ctx.stroke();}
[['#42a5f5',2,0.03,3],['#ffaa00',1.5,0.04,2.5],['#00e5ff',1.8,0.05,4]].forEach(([col,lt,freq,spd])=>{
ctx.strokeStyle=col;ctx.lineWidth=lt*sc;ctx.beginPath();
for(let x=0;x<cw;x++){const v=Math.sin(x*freq+t*spd)*gh*.3+Math.sin(x*freq*2+t*(spd+1))*gh*.1;ctx.lineTo(cx_+x,gy+gh/2+v);}ctx.stroke();});
}
// Status bar
ctx.fillStyle='#060a14';ctx.fillRect(wx,wy+wh-18*sc,ww,18*sc);
ctx.fillStyle='rgba(0,255,100,0.6)';ctx.font=`${8*sc}px Share Tech Mono`;
ctx.fillText(`STATUS: OPERATIONAL | FPS: ${(58+Math.sin(t)*2).toFixed(0)} | DATA: ${(1200+Math.sin(t*5)*400).toFixed(0)} Hz`,wx+8*sc,wy+wh-5*sc);
// Flicker
if(Math.random()<.04){ctx.fillStyle='rgba(255,255,255,0.015)';ctx.fillRect(0,Math.random()*h,w,2+Math.random()*3);}
}

function updateMonitor(t){
if(monCtx){drawScreen(monCtx,MW,MH,t,currentMat);monTex.needsUpdate=true;}
if(monitorOpen&&fsCtx){drawScreen(fsCtx,1920,1080,t,currentMat);}
if(models.monLed){const cols={idle:0x0044ff,steel:0xff2200,kevlar:0xffaa00,aluminum:0x00e5ff};models.monLed.material.color.setHex(cols[currentMat]||0x0044ff);}
}

// ═══ MODELS ═══
function steelSection(){
const gr=new THREE.Group();
const mat=new THREE.MeshPhysicalMaterial({color:0x8899aa,metalness:0.92,roughness:0.15,clearcoat:1,emissive:0x1144bb,emissiveIntensity:0.4});
const tower=new THREE.Group();const br=0.08,W=3,D=3,fH=1.2,floors=5,H=floors*fH;
const cols=[[-W/2,-D/2],[W/2,-D/2],[W/2,D/2],[-W/2,D/2]];
cols.forEach(([x,z])=>tower.add(beam([x,0,z],[x,H,z],br,mat)));
for(let f=0;f<=floors;f++){const y=f*fH;for(let i=0;i<4;i++){const[x1,z1]=cols[i],[x2,z2]=cols[(i+1)%4];tower.add(beam([x1,y,z1],[x2,y,z2],br*.8,mat));}
if(f<floors)for(let i=0;i<4;i++){const[x1,z1]=cols[i],[x2,z2]=cols[(i+1)%4];tower.add(beam([x1,y,z1],[x2,(f+1)*fH,z2],br*.5,mat));tower.add(beam([x2,y,z2],[x1,(f+1)*fH,z1],br*.5,mat));}}
tower.position.set(SX-3,1.5,0);models.steelTower=tower;gr.add(tower);
const g1=bigGear(3,24,0.8,mat);g1.position.set(SX+4,4.5,2);g1.rotation.x=Math.PI/2;models.g1=g1;gr.add(g1);
const g2=bigGear(1.8,14,0.7,mat);g2.position.set(SX+4,2.5,2);g2.rotation.x=Math.PI/2;models.g2=g2;gr.add(g2);
scene.add(gr);
}
function bigGear(R,teeth,thick,mat){const g=new THREE.Group();
g.add(new THREE.Mesh(new THREE.CylinderGeometry(R*.8,R*.8,thick,48),mat));
g.add(new THREE.Mesh(new THREE.CylinderGeometry(R*.2,R*.2,thick+.2,24),mat));
for(let i=0;i<teeth;i++){const a=(i/teeth)*Math.PI*2;const t_=new THREE.Mesh(new THREE.BoxGeometry(R*.2,thick*.9,R*.3),mat);t_.position.set(Math.cos(a)*R*.93,0,Math.sin(a)*R*.93);t_.rotation.y=-a;g.add(t_);}
for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2;const sp=new THREE.Mesh(new THREE.BoxGeometry(R*.55,thick*.35,.1),mat);sp.position.set(Math.cos(a)*R*.5,0,Math.sin(a)*R*.5);sp.rotation.y=-a;g.add(sp);}
return g;}

function kevlarSection(){
const gr=new THREE.Group();const shape=new THREE.Shape();
shape.moveTo(-1.8,0);shape.lineTo(1.8,0);shape.lineTo(1.8,2.5);shape.quadraticCurveTo(1.6,3.5,2.2,4);shape.lineTo(2.2,4.8);shape.lineTo(1,4.8);
shape.quadraticCurveTo(0,3.8,-1,4.8);shape.lineTo(-2.2,4.8);shape.lineTo(-2.2,4);shape.quadraticCurveTo(-1.6,3.5,-1.8,2.5);shape.lineTo(-1.8,0);
const geom=new THREE.ExtrudeGeometry(shape,{depth:1.2,bevelEnabled:true,bevelSegments:6,steps:4,bevelSize:.2,bevelThickness:.2});geom.center();
const sc=1.3;
models.vest=new THREE.Group();
const vW=new THREE.Mesh(geom,new THREE.MeshPhysicalMaterial({color:0xffaa00,metalness:.3,roughness:.2,wireframe:true,transparent:true,opacity:.8,emissive:0xcc5500,emissiveIntensity:.5}));
vW.scale.set(sc,sc,sc);models.vest.add(vW);
const vS=new THREE.Mesh(geom,new THREE.MeshPhysicalMaterial({color:0xffaa00,metalness:.8,roughness:.2,transparent:true,opacity:.2,emissive:0xffaa00,emissiveIntensity:.2}));
vS.scale.set(sc*.98,sc*.98,sc*.98);models.vest.add(vS);
models.vest.position.set(KX,3,0);gr.add(models.vest);
const vGeo=new THREE.BufferGeometry(),vPos=new Float32Array(500*3);
for(let i=0;i<500;i++){vPos[i*3]=(Math.random()-.5)*4;vPos[i*3+1]=(Math.random()-.5)*5;vPos[i*3+2]=(Math.random()-.5)*1.2;}
vGeo.setAttribute('position',new THREE.BufferAttribute(vPos,3));
models.vest.add(new THREE.Points(vGeo,new THREE.PointsMaterial({color:0xffaa00,size:.1,transparent:true,opacity:.8,blending:THREE.AdditiveBlending})));
scene.add(gr);
}

function aluminumSection(){
const gr=new THREE.Group();const mat=new THREE.MeshPhysicalMaterial({color:0xccffff,metalness:1,roughness:0,clearcoat:1,emissive:0x00aaff,emissiveIntensity:.3});
const truss=new THREE.Group(),nodes=[],sp=1.2;
for(let l=0;l<4;l++){const y=l*1.5,off=l%2?sp*.5:0;for(let r=0;r<3;r++)for(let c=0;c<3;c++)nodes.push([(c-1)*sp+off,y,(r-1)*sp+(l%2?sp*.4:0)]);}
for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const d=Math.hypot(nodes[i][0]-nodes[j][0],nodes[i][1]-nodes[j][1],nodes[i][2]-nodes[j][2]);if(d<2.2&&d>.3)truss.add(beam(nodes[i],nodes[j],.06,mat));}
nodes.forEach(n=>{const s=new THREE.Mesh(new THREE.SphereGeometry(.12,6,6),mat);s.position.set(...n);truss.add(s);});
truss.position.set(AX-3,.5,0);truss.scale.set(1.5,1.5,1.5);models.aluTruss=truss;gr.add(truss);
const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(0,0,0),new THREE.Vector3(1,2,.5),new THREE.Vector3(-1,4,-.5),new THREE.Vector3(0,6,0));
const bg_=new THREE.TubeGeometry(curve,64,.8,12,false);bg_.scale(1,1,.1);
const blade=new THREE.Group();blade.add(new THREE.Mesh(bg_,mat));
const bb=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1,32),mat);bb.position.set(0,-.5,0);blade.add(bb);
blade.position.set(AX+4,2,1);blade.rotation.x=.2;models.blade=blade;gr.add(blade);scene.add(gr);
}

function beam(f,t_,r,m){const a=new THREE.Vector3(...f),b=new THREE.Vector3(...t_),d=new THREE.Vector3().subVectors(b,a),l=d.length();
const mesh=new THREE.Mesh(new THREE.BoxGeometry(r*1.5,l,r*1.5),m);mesh.position.copy(a).add(b).multiplyScalar(.5);
mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());return mesh;}

function particleStreams(){
const sCfg=[
 {from:[SX,7,0],to:[CX-8,5,CZ+2],ah:10,col:0x00aaff,tube:0x0055cc},
 {from:[KX,10,0],to:[CX,6,CZ+2],ah:15,col:0xffaa00,tube:0xcc6600},
 {from:[AX,7,0],to:[CX+8,5,CZ+2],ah:10,col:0x00ffcc,tube:0x00aa88}
];
sCfg.forEach(cfg=>{
 const [sx,sy,sz]=cfg.from,[ex,ey,ez]=cfg.to;
 const mid=[(sx+ex)/2,cfg.ah,(sz+ez)/2];
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(sx,sy,sz),new THREE.Vector3(...mid),new THREE.Vector3(ex,ey,ez)]);
 // Multi-layer tube glow (3 nested tubes for RGB halo)
 for(let w=0;w<3;w++){
   const r=0.03+w*0.035,op=0.14-w*0.04;
   scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,60,r,6,false),
     new THREE.MeshBasicMaterial({color:w===0?cfg.tube:0xffffff,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false})));
 }
 // Primary colored particles
 const geo=new THREE.BufferGeometry(),pos=new Float32Array(250*3),phase=new Float32Array(250);
 for(let i=0;i<250;i++)phase[i]=Math.random();
 geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('phase',new THREE.BufferAttribute(phase,1));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:cfg.col,size:.2,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));
 pts.userData={curve,speed:.004,spread:0.35};particles.push(pts);scene.add(pts);
 // Secondary white sparkles
 const geo2=new THREE.BufferGeometry(),pos2=new Float32Array(80*3),phase2=new Float32Array(80);
 for(let i=0;i<80;i++)phase2[i]=Math.random();
 geo2.setAttribute('position',new THREE.BufferAttribute(pos2,3));geo2.setAttribute('phase',new THREE.BufferAttribute(phase2,1));
 const pts2=new THREE.Points(geo2,new THREE.PointsMaterial({color:0xffffff,size:.08,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));
 pts2.userData={curve,speed:.006,spread:0.7};particles.push(pts2);scene.add(pts2);
});
}

// ═══ INTERACTIVITY ═══
function setupInteractivity(){
const targets=[];
[{pos:[SX,4,0],sz:[12,8,8],mat:'steel'},{pos:[KX,4,0],sz:[8,8,6],mat:'kevlar'},{pos:[AX,4,0],sz:[12,8,8],mat:'aluminum'}].forEach(cfg=>{
const t=new THREE.Mesh(new THREE.BoxGeometry(...cfg.sz),new THREE.MeshBasicMaterial({visible:false}));
t.position.set(...cfg.pos);t.userData={material:cfg.mat};scene.add(t);targets.push(t);});
targets.push(models.monitorGroup);

window.addEventListener('pointerdown',e=>{
if(monitorOpen)return;
mouse.x=(e.clientX/innerWidth)*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;
raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects(targets,true);
if(hits.length>0){const o=hits[0].object;
if(o.userData.isMonitor){openMonitor();}
else if(o.userData.material){selectMaterial(o.userData.material);}}
});
document.getElementById('main-canvas').addEventListener('pointermove',e=>{
if(monitorOpen)return;mouse.x=(e.clientX/innerWidth)*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;
raycaster.setFromCamera(mouse,camera);document.getElementById('main-canvas').style.cursor=raycaster.intersectObjects(targets,true).length>0?'pointer':'default';});
// Monitor close
document.getElementById('monitor-close').addEventListener('click',closeMonitor);
document.getElementById('monitor-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('monitor-overlay'))closeMonitor();});
window.addEventListener('kevincs-shutdown', closeMonitor);
}

function openMonitor(){
  monitorOpen=true;
  document.getElementById('monitor-overlay').classList.add('active');
  controls.enabled=false;
  // Launch KevinOS
  const container=document.getElementById('kevin-os-container');
  if(container && !kevinOSInstance){
    kevinOSInstance=new KevinOS(container);
  }
}
function closeMonitor(){
  monitorOpen=false;
  document.getElementById('monitor-overlay').classList.remove('active');
  controls.enabled=true;
  // Destroy KevinOS
  if(kevinOSInstance){
    kevinOSInstance.destroy();
    kevinOSInstance=null;
  }
}

function selectMaterial(mat){
currentMat=mat;controls.autoRotate=false;
const st=document.getElementById('monitor-status-text');
const s={steel:'ANALYZING: STEEL — THERMAL STRESS',kevlar:'ANALYZING: KEVLAR — BALLISTIC',aluminum:'ANALYZING: ALUMINUM — STRUCTURAL'};
if(st)st.textContent=s[mat]||'AI CORE: SCANNING';
const p={
  steel:{c:new THREE.Vector3(SX,8,16),t:new THREE.Vector3(SX,4,0)},
  kevlar:{c:new THREE.Vector3(KX,8,16),t:new THREE.Vector3(KX,4,0)},
  aluminum:{c:new THREE.Vector3(AX,8,16),t:new THREE.Vector3(AX,4,0)}
};
if(p[mat]){targetCamPos=p[mat].c.clone();targetCtrlTgt=p[mat].t.clone();controls.enableRotate=false;controls.enableZoom=false;controls.enablePan=false;}
const hs=document.getElementById('hud-steel'),hk=document.getElementById('hud-kevlar'),ha=document.getElementById('hud-alu');
[hs,hk,ha].forEach(el=>{if(el){el.style.opacity='0';el.style.pointerEvents='none';}});
const tgt=mat==='steel'?hs:mat==='kevlar'?hk:ha;if(tgt)setTimeout(()=>{tgt.style.opacity='1';tgt.style.pointerEvents='auto';},600);
}

// ═══ ANIMATION ═══
function animate(){
requestAnimationFrame(animate);const t=clock.getElapsedTime();

if(dustParticles) {
  dustParticles.material.uniforms.time.value = t;
}

// Update RGB desk edges
rgbDeskEdges.forEach(edge => {
  edge.material.color.setHSL((t * 0.15) % 1.0, 1.0, 0.5);
});

if(models.g1)models.g1.rotation.y+=.02;if(models.g2)models.g2.rotation.y-=.035;
if(models.steelTower)models.steelTower.position.y=1+Math.sin(t*1.5)*.3;
if(models.g1)models.g1.position.y=4+Math.sin(t*1.5+1)*.3;
if(models.g2)models.g2.position.y=2+Math.sin(t*1.5+2)*.3;
if(models.vest){models.vest.rotation.y=Math.sin(t*.5)*.2;models.vest.position.y=3+Math.sin(t*1.2)*.4;}
if(models.aluTruss){models.aluTruss.rotation.y+=.01;models.aluTruss.position.y=.5+Math.sin(t*1.8)*.3;}
if(models.blade){models.blade.rotation.y+=.015;models.blade.position.y=2+Math.sin(t*1.8+Math.PI)*.3;}

// Energy platform animations
energyBases.forEach((eb,idx)=>{
for(let i=0;i<3;i++){const r=models['ring_'+idx+'_'+i];if(r){r.rotation.z+=(.008+i*.004)*(idx%2?1:-1);r.scale.setScalar(1+Math.sin(t*2+i)*.05);}}
const v=models['vortex_'+idx];if(v){const pos=v.geometry.attributes.position.array;
for(let i=0;i<pos.length;i+=3){const a=Math.atan2(pos[i+2],pos[i])+.02;const r=Math.sqrt(pos[i]*pos[i]+pos[i+2]*pos[i+2]);
pos[i]=Math.cos(a)*r;pos[i+2]=Math.sin(a)*r;pos[i+1]=pos[i+1]>.01?pos[i+1]-.01:3;}
v.geometry.attributes.position.needsUpdate=true;}
});

// Camera
if(targetCamPos&&targetCtrlTgt){camera.position.lerp(targetCamPos,.07);controls.target.lerp(targetCtrlTgt,.07);
if(camera.position.distanceTo(targetCamPos)<0.5){camera.position.copy(targetCamPos);controls.target.copy(targetCtrlTgt);targetCamPos=null;targetCtrlTgt=null;controls.enableRotate=true;controls.enableZoom=true;controls.enablePan=true;}}
controls.update();

// Cinematic breathing effect when not moving camera
if(controls.enabled && currentMat==='idle' && !monitorOpen) {
  const breath = Math.sin(t * 1.5) * 0.05;
  camera.position.y += breath * 0.05;
  camera.lookAt(baseTgt.x, baseTgt.y + breath, baseTgt.z);
}

if(Math.floor(t*30)%2===0)updateMonitor(t);

particles.forEach(ps=>{const ph=ps.geometry.attributes.phase.array,po=ps.geometry.attributes.position.array,cv=ps.userData.curve,sp=ps.userData.spread||0.35;
for(let i=0;i<ph.length;i++){ph[i]+=ps.userData.speed+Math.random()*.002;if(ph[i]>1)ph[i]=0;
const pt=cv.getPointAt(ph[i]);po[i*3]=pt.x+(Math.random()-.5)*sp;po[i*3+1]=pt.y+(Math.random()-.5)*sp;po[i*3+2]=pt.z+(Math.random()-.5)*sp;}
ps.geometry.attributes.position.needsUpdate=true;});

if(composer)composer.render();else renderer.render(scene,camera);
}

function startApp(){
try{init();lights();bloom();cosmos();buildLab();buildEnergyPlatforms();buildMonitor();
steelSection();kevlarSection();aluminumSection();particleStreams();setupInteractivity();
scene.traverse(o=>{o.frustumCulled=false;});animate();}catch(e){console.error(e);}
let p=0;const el=document.getElementById('load-pct');
const iv=setInterval(()=>{p+=Math.random()*12+4;if(p>=100){p=100;clearInterval(iv);}if(el)el.textContent=Math.floor(p)+'%';},70);
setTimeout(()=>{document.getElementById('loading-screen').classList.add('hidden');
document.querySelectorAll('.anim-bar').forEach(b=>b.style.width=b.dataset.width);
setTimeout(()=>{
document.getElementById('central-hologram')?.classList.add('visible');
document.getElementById('monitor-status')?.classList.add('visible');
document.getElementById('click-hint')?.classList.add('visible');
},500);},2500);
}
if(document.readyState==='loading'){window.addEventListener('DOMContentLoaded',startApp);}else{startApp();}
