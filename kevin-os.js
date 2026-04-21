// ═══════════════════════════════════════════════════════════════════════════════
// KEVIN OS — Ultra Interactive Desktop Environment
// Runs inside the monitor fullscreen overlay
// ═══════════════════════════════════════════════════════════════════════════════

export class KevinOS {
  constructor(container) {
    this.container = container;
    this.windows = [];
    this.windowIdCounter = 0;
    this.activeWindow = null;
    this.zIndexCounter = 100;
    this.startMenuOpen = false;
    this.dragState = null;
    this.resizeState = null;
    this.notifications = [];
    this.bootComplete = false;

    // File system
    this.fileSystem = {
      'C:': {
        type: 'folder', children: {
          'Users': {
            type: 'folder', children: {
              'Kevin': {
                type: 'folder', children: {
                  'Desktop': {
                    type: 'folder', children: {
                      'Material Analysis.kev': { type: 'file', icon: '📊', size: '2.4 MB', modified: '2026-04-08', content: 'KEVIN Material Analysis Report\n════════════════════════════\n\nSteel (Fe):\n  Density: 7.85 g/cm³\n  Tensile: 400 MPa\n  Modulus: 210 GPa\n\nKevlar (Aramid):\n  Density: 1.44 g/cm³\n  Tensile: 3620 MPa\n  Modulus: 130 GPa\n\nAluminum (Al):\n  Density: 2.70 g/cm³\n  Tensile: 600 MPa\n  Modulus: 70 GPa\n\n▸ Recommendation: KEVLAR optimal for ballistic applications\n▸ Weight savings: 81.7% vs Steel' },
                      'readme.txt': { type: 'file', icon: '📝', size: '1.2 KB', modified: '2026-04-07', content: 'KEVIN AI — Material Comparison Lab\n══════════════════════════════════\n\nWelcome to the KEVIN AI research facility.\nThis system provides real-time analysis\nof advanced materials.\n\nSystem Status: OPERATIONAL\nAI Core: v4.2.1\nNeural Network: CALIBRATED\nSensor Array: NOMINAL' },
                      'Project Notes': { type: 'folder', children: {
                        'ballistic_test.log': { type: 'file', icon: '📄', size: '4.1 MB', modified: '2026-04-08', content: '=== BALLISTIC TEST LOG ===\nTest #1247 — 9mm FMJ @ 370 m/s\nResult: STOPPED at layer 3/7\nDeformation: 12mm\nBackface: 28mm\nVerdict: PASS\n\nTest #1248 — .357 Mag @ 440 m/s\nResult: STOPPED at layer 5/7\nDeformation: 18mm\nBackface: 34mm\nVerdict: PASS\n\nTest #1249 — 5.56 NATO @ 940 m/s\nResult: STOPPED at layer 7/7\nDeformation: 31mm\nBackface: 42mm\nVerdict: MARGINAL' },
                        'thermal_data.csv': { type: 'file', icon: '📈', size: '890 KB', modified: '2026-04-06', content: 'Temperature,Steel_Stress,Kevlar_Stress,Al_Stress\n20,400,3620,600\n100,395,3200,580\n200,380,2800,550\n300,360,2400,510\n400,330,1900,460\n500,290,1200,400\n600,240,800,320\n700,180,400,200' },
                      }},
                    }
                  },
                  'Documents': {
                    type: 'folder', children: {
                      'Research Paper.txt': { type: 'file', icon: '📝', size: '12 KB', modified: '2026-04-05', content: 'ADVANCED MATERIAL COMPARISON STUDY\n══════════════════════════════════\n\nAbstract:\nThis paper presents a comprehensive analysis\nof three structural materials: Steel, Kevlar,\nand Aluminum, evaluated across multiple\nperformance metrics.\n\n1. Introduction\n    Modern engineering demands careful material\n    selection based on application requirements.\n\n2. Methodology\n    Three-axis tensile testing\n    Thermal stress analysis\n    Impact simulation (finite element)\n    Corrosion resistance evaluation\n\n3. Results\n    See attached data files for raw results.\n    Key finding: Kevlar provides optimal\n    strength-to-weight ratio for protective\n    applications.\n\n4. Conclusion\n    Material selection should be application-\n    specific, but Kevlar excels in ballistic\n    and lightweight structural roles.' },
                      'Lab Schedule.txt': { type: 'file', icon: '📝', size: '2 KB', modified: '2026-04-07', content: 'LAB SCHEDULE — APRIL 2026\n════════════════════════\n\nMon  — Steel thermal cycling\nTue  — Kevlar impact testing\nWed  — Aluminum fatigue analysis\nThu  — Comparative data review\nFri  — AI model training\nSat  — Equipment maintenance\nSun  — System backups' },
                    }
                  },
                  'Downloads': {
                    type: 'folder', children: {
                      'sensor_firmware_v3.2.bin': { type: 'file', icon: '💾', size: '14.2 MB', modified: '2026-04-03' },
                      'neural_weights.h5': { type: 'file', icon: '🧠', size: '234 MB', modified: '2026-04-01' },
                      'calibration_data.json': { type: 'file', icon: '📋', size: '567 KB', modified: '2026-04-04', content: '{\n  "sensors": {\n    "strain_gauge_1": {\n      "offset": 0.0023,\n      "gain": 1.00012,\n      "last_cal": "2026-04-01"\n    },\n    "thermocouple_array": {\n      "channels": 16,\n      "range": [-40, 1200],\n      "accuracy": "±0.5°C"\n    },\n    "accelerometer": {\n      "range": "±16000g",\n      "sample_rate": 100000,\n      "bandwidth": "50kHz"\n    }\n  }\n}' },
                    }
                  },
                  'Pictures': {
                    type: 'folder', children: {
                      'steel_microstructure.png': { type: 'file', icon: '🖼️', size: '3.2 MB', modified: '2026-04-02', isImage: true },
                      'kevlar_fiber_scan.png': { type: 'file', icon: '🖼️', size: '5.1 MB', modified: '2026-04-03', isImage: true },
                      'aluminum_crystal.png': { type: 'file', icon: '🖼️', size: '2.8 MB', modified: '2026-04-01', isImage: true },
                    }
                  }
                }
              }
            }
          },
          'System': {
            type: 'folder', children: {
              'config.sys': { type: 'file', icon: '⚙️', size: '4 KB', modified: '2026-03-15', content: '[KEVIN_OS]\nversion=4.2.1\nkernel=quantum_v3\nprocessor=neural_fpga_x16\nmemory=1024TB\nai_core=active\nneural_net=calibrated\nsensor_array=nominal\nquantum_proc=ready\nclock_speed=4.8THz\nbus_width=2048bit' },
              'drivers': { type: 'folder', children: {
                'gpu_rtx_9090.drv': { type: 'file', icon: '💾', size: '45 MB', modified: '2026-02-20' },
                'neural_accel.drv': { type: 'file', icon: '💾', size: '12 MB', modified: '2026-01-10' },
                'quantum_bridge.drv': { type: 'file', icon: '💾', size: '78 MB', modified: '2026-03-01' },
              }}
            }
          },
          'Programs': {
            type: 'folder', children: {
              'KEVIN AI Core': { type: 'folder', children: {
                'kevin_ai.exe': { type: 'file', icon: '🧠', size: '1.2 GB', modified: '2026-04-01' },
                'models': { type: 'folder', children: {
                  'material_classifier.onnx': { type: 'file', icon: '🔮', size: '456 MB', modified: '2026-03-28' },
                  'stress_predictor.onnx': { type: 'file', icon: '🔮', size: '234 MB', modified: '2026-03-25' },
                }},
              }},
            }
          }
        }
      }
    };

    this.desktopIcons = [
      { name: 'File Explorer', icon: '📁', app: 'explorer', x: 20, y: 20 },
      { name: 'Terminal', icon: '⬛', app: 'terminal', x: 20, y: 110 },
      { name: 'System Monitor', icon: '📊', app: 'sysmonitor', x: 20, y: 200 },
      { name: 'Text Editor', icon: '📝', app: 'editor', x: 20, y: 290 },
      { name: 'Calculator', icon: '🔢', app: 'calculator', x: 20, y: 380 },
      { name: 'AI Chat', icon: '🤖', app: 'aichat', x: 20, y: 470 },
      { name: 'Settings', icon: '⚙️', app: 'settings', x: 20, y: 560 },
      { name: 'Material Analysis', icon: '📊', app: 'analysis', x: 120, y: 20 },
      { name: 'Material History', icon: '📜', app: 'mathistory', x: 120, y: 110 },
      { name: 'Molecular Viewer', icon: '⚛️', app: 'molecular', x: 120, y: 200 },
      { name: 'Comparison Lab', icon: '⚖️', app: 'comparelab', x: 120, y: 290 },
      { name: 'Stress Simulator', icon: '💥', app: 'stresssim', x: 120, y: 380 },
      { name: 'Properties DB', icon: '🗄️', app: 'propsdb', x: 120, y: 470 },
      { name: 'Music Player', icon: '🎵', app: 'music', x: 220, y: 20 },
      { name: 'Network', icon: '🌐', app: 'network', x: 220, y: 110 },
      { name: 'Recycle Bin', icon: '🗑️', app: 'recycle', x: 220, y: 200 },
    ];

    this.init();
  }

  init() {
    this.container.innerHTML = '';
    this.container.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;background:#000;font-family:"Segoe UI","Rajdhani",sans-serif;user-select:none;';

    // Boot sequence first
    this.showBootScreen();
  }

  showBootScreen() {
    const boot = document.createElement('div');
    boot.id = 'kevin-boot';
    boot.style.cssText = 'position:absolute;inset:0;background:#000;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    boot.innerHTML = `
      <div style="text-align:center;">
        <div id="boot-logo" style="font-size:48px;margin-bottom:20px;opacity:0;transform:scale(0.5);transition:all 1s cubic-bezier(0.34,1.56,0.64,1);">⬡</div>
        <div id="boot-title" style="font-family:'Orbitron',monospace;font-size:22px;color:#00e5ff;letter-spacing:8px;opacity:0;transition:opacity 0.8s;text-shadow:0 0 30px #00e5ff;">KEVIN OS</div>
        <div id="boot-version" style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(0,229,255,0.4);margin-top:8px;letter-spacing:4px;opacity:0;transition:opacity 0.8s;">v4.2.1 — QUANTUM READY</div>
        <div id="boot-bar-wrap" style="width:300px;height:2px;background:rgba(255,255,255,0.05);margin-top:40px;border-radius:2px;overflow:hidden;opacity:0;transition:opacity 0.5s;">
          <div id="boot-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#00e5ff,#bf5fff,#00e5ff);border-radius:2px;transition:width 0.3s;"></div>
        </div>
        <div id="boot-status" style="font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(0,229,255,0.3);margin-top:15px;letter-spacing:2px;opacity:0;transition:opacity 0.5s;min-height:15px;"></div>
      </div>
    `;
    this.container.appendChild(boot);

    // Animate boot
    setTimeout(() => {
      document.getElementById('boot-logo').style.opacity = '1';
      document.getElementById('boot-logo').style.transform = 'scale(1)';
    }, 200);
    setTimeout(() => { document.getElementById('boot-title').style.opacity = '1'; }, 600);
    setTimeout(() => { document.getElementById('boot-version').style.opacity = '1'; }, 900);
    setTimeout(() => {
      document.getElementById('boot-bar-wrap').style.opacity = '1';
      document.getElementById('boot-status').style.opacity = '1';
    }, 1200);

    const statuses = [
      'Initializing quantum processors...',
      'Loading neural networks...',
      'Calibrating sensor arrays...',
      'Mounting file systems...',
      'Starting AI core services...',
      'Loading desktop environment...',
      'Ready.'
    ];

    let step = 0;
    const bootInterval = setInterval(() => {
      if (step < statuses.length) {
        const bar = document.getElementById('boot-bar');
        const status = document.getElementById('boot-status');
        if (bar) bar.style.width = `${((step + 1) / statuses.length) * 100}%`;
        if (status) status.textContent = statuses[step];
        step++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => {
          boot.style.transition = 'opacity 0.8s, filter 0.8s';
          boot.style.opacity = '0';
          boot.style.filter = 'blur(10px)';
          setTimeout(() => {
            boot.remove();
            this.buildDesktop();
            this.bootComplete = true;
          }, 800);
        }, 400);
      }
    }, 350);
  }

  buildDesktop() {
    // Inject Custom Scrollbar and Window Selection Styles
    if (!document.getElementById('kevin-os-styles')) {
      const style = document.createElement('style');
      style.id = 'kevin-os-styles';
      style.innerHTML = `
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); }
        ::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 4px; border: 1px solid rgba(0,229,255,0.1); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,229,255,0.6); }
        ::-webkit-scrollbar-corner { background: transparent; }
        
        .kevin-window .resizer-n { position:absolute;width:100%;height:6px;left:0;top:-3px;cursor:ns-resize;z-index:99; }
        .kevin-window .resizer-s { position:absolute;width:100%;height:6px;left:0;bottom:-3px;cursor:ns-resize;z-index:99; }
        .kevin-window .resizer-e { position:absolute;width:6px;height:100%;top:0;right:-3px;cursor:ew-resize;z-index:99; }
        .kevin-window .resizer-w { position:absolute;width:6px;height:100%;top:0;left:-3px;cursor:ew-resize;z-index:99; }
        .kevin-window .resizer-nw { position:absolute;width:12px;height:12px;left:-4px;top:-4px;cursor:nwse-resize;z-index:100; }
        .kevin-window .resizer-ne { position:absolute;width:12px;height:12px;right:-4px;top:-4px;cursor:nesw-resize;z-index:100; }
        .kevin-window .resizer-sw { position:absolute;width:12px;height:12px;left:-4px;bottom:-4px;cursor:nesw-resize;z-index:100; }
        .kevin-window .resizer-se { position:absolute;width:12px;height:12px;right:-4px;bottom:-4px;cursor:nwse-resize;z-index:100; }
      `;
      document.head.appendChild(style);
    }

    // Desktop wallpaper
    const desktop = document.createElement('div');
    desktop.id = 'kevin-desktop';
    desktop.style.cssText = `
      position:absolute;inset:0;
      background: radial-gradient(ellipse at 30% 40%, #0a1628 0%, #050b15 50%, #020408 100%);
      overflow:hidden;
    `;

    // Animated background particles
    const bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'desktop-bg-canvas';
    bgCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0.3;pointer-events:none;';
    desktop.appendChild(bgCanvas);
    this.bgCanvas = bgCanvas;

    // Desktop icons container
    const iconsContainer = document.createElement('div');
    iconsContainer.id = 'desktop-icons';
    iconsContainer.style.cssText = 'position:absolute;inset:0;bottom:48px;';
    this.desktopIcons.forEach(ic => {
      const icon = this.createDesktopIcon(ic);
      iconsContainer.appendChild(icon);
    });
    desktop.appendChild(iconsContainer);

    // Windows container
    const winsContainer = document.createElement('div');
    winsContainer.id = 'windows-container';
    winsContainer.style.cssText = 'position:absolute;inset:0;bottom:48px;overflow:hidden;';
    desktop.appendChild(winsContainer);
    this.winsContainer = winsContainer;

    // Taskbar
    const taskbar = this.createTaskbar();
    desktop.appendChild(taskbar);

    // Notification area
    const notifContainer = document.createElement('div');
    notifContainer.id = 'notif-container';
    notifContainer.style.cssText = 'position:absolute;bottom:56px;right:8px;display:flex;flex-direction:column-reverse;gap:6px;z-index:90000;pointer-events:none;';
    desktop.appendChild(notifContainer);
    this.notifContainer = notifContainer;

    this.container.appendChild(desktop);
    this.desktop = desktop;

    // Start background animation
    this.startBackgroundAnimation();

    // Start clock
    this.startClock();

    // Start system animations
    this.startSystemAnimations();

    // Welcome notification
    setTimeout(() => {
      this.showNotification('KEVIN OS', 'System ready. All modules operational.', '⬡');
    }, 500);
    setTimeout(() => {
      this.showNotification('AI Core', 'Neural network calibrated. Accuracy: 99.7%', '🧠');
    }, 2000);

    // Global mouse events for drag
    this.container.addEventListener('pointermove', e => this.onPointerMove(e));
    this.container.addEventListener('pointerup', e => this.onPointerUp(e));
  }

  createDesktopIcon(config) {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.style.cssText = `
      position:absolute;left:${config.x}px;top:${config.y}px;width:80px;
      display:flex;flex-direction:column;align-items:center;gap:4px;
      cursor:pointer;padding:6px 4px;border-radius:6px;
      transition:background 0.2s, transform 0.15s;
    `;
    icon.innerHTML = `
      <div style="font-size:36px;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.5));transition:transform 0.2s;">${config.icon}</div>
      <div style="font-size:11px;color:#fff;text-align:center;text-shadow:0 1px 4px #000,0 0 8px rgba(0,0,0,0.8);line-height:1.2;word-wrap:break-word;max-width:76px;">${config.name}</div>
    `;

    icon.addEventListener('mouseenter', () => {
      icon.style.background = 'rgba(255,255,255,0.08)';
      icon.querySelector('div').style.transform = 'scale(1.15)';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.background = 'transparent';
      icon.querySelector('div').style.transform = 'scale(1)';
    });

    icon.addEventListener('click', () => {
      if (this._iconDragged) { this._iconDragged = false; return; }
      document.querySelectorAll('.desktop-icon').forEach(i => i.style.background = 'transparent');
      icon.style.background = 'rgba(0,150,255,0.15)';
      this.openApp(config.app, config.name);
    });

    // Make icon draggable on desktop (with drag threshold)
    icon.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      this._iconDragged = false;
      const rect = icon.getBoundingClientRect();
      const contRect = this.container.getBoundingClientRect();
      this.dragState = {
        type: 'icon',
        el: icon,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        contLeft: contRect.left,
        contTop: contRect.top,
        startX: e.clientX,
        startY: e.clientY,
      };
      e.stopPropagation();
    });

    return icon;
  }

  createTaskbar() {
    const taskbar = document.createElement('div');
    taskbar.id = 'kevin-taskbar';
    taskbar.style.cssText = `
      position:absolute;bottom:0;left:0;right:0;height:48px;
      background:linear-gradient(180deg, rgba(15,20,35,0.95) 0%, rgba(8,12,22,0.98) 100%);
      backdrop-filter:blur(20px);
      border-top:1px solid rgba(0,229,255,0.15);
      display:flex;align-items:center;z-index:50000;
      box-shadow:0 -2px 20px rgba(0,0,0,0.5);
    `;

    // Start button
    const startBtn = document.createElement('div');
    startBtn.id = 'start-btn';
    startBtn.style.cssText = `
      width:48px;height:48px;display:flex;align-items:center;justify-content:center;
      font-size:22px;cursor:pointer;transition:background 0.2s;position:relative;
    `;
    startBtn.textContent = '⬡';
    startBtn.addEventListener('mouseenter', () => { startBtn.style.background = 'rgba(0,229,255,0.1)'; });
    startBtn.addEventListener('mouseleave', () => { if (!this.startMenuOpen) startBtn.style.background = 'transparent'; });
    startBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleStartMenu(); });
    taskbar.appendChild(startBtn);

    // Divider
    const div1 = document.createElement('div');
    div1.style.cssText = 'width:1px;height:28px;background:rgba(255,255,255,0.08);margin:0 4px;';
    taskbar.appendChild(div1);

    // Search bar
    const search = document.createElement('div');
    search.style.cssText = `
      height:32px;width:200px;background:rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.08);border-radius:4px;
      display:flex;align-items:center;padding:0 10px;gap:8px;
      cursor:text;margin:0 4px;transition:border-color 0.2s, background 0.2s;
    `;
    search.innerHTML = '<span style="font-size:13px;opacity:0.4;">🔍</span><span style="font-size:12px;color:rgba(255,255,255,0.3);font-family:\'Segoe UI\',sans-serif;">Search KEVIN OS...</span>';
    search.addEventListener('mouseenter', () => {
      search.style.borderColor = 'rgba(0,229,255,0.3)';
      search.style.background = 'rgba(255,255,255,0.08)';
    });
    search.addEventListener('mouseleave', () => {
      search.style.borderColor = 'rgba(255,255,255,0.08)';
      search.style.background = 'rgba(255,255,255,0.05)';
    });
    taskbar.appendChild(search);

    // Task buttons area
    const taskBtns = document.createElement('div');
    taskBtns.id = 'task-buttons';
    taskBtns.style.cssText = 'flex:1;display:flex;align-items:center;height:100%;gap:2px;padding:0 4px;overflow-x:auto;';
    taskbar.appendChild(taskBtns);
    this.taskBtnsContainer = taskBtns;

    // System tray
    const tray = document.createElement('div');
    tray.style.cssText = 'display:flex;align-items:center;gap:6px;padding:0 12px;height:100%;';

    // Tray icons
    const trayIcons = ['🔊', '📶', '🔋'];
    trayIcons.forEach(ic => {
      const ti = document.createElement('div');
      ti.style.cssText = 'font-size:14px;cursor:pointer;opacity:0.6;transition:opacity 0.2s;padding:2px;';
      ti.textContent = ic;
      ti.addEventListener('mouseenter', () => { ti.style.opacity = '1'; });
      ti.addEventListener('mouseleave', () => { ti.style.opacity = '0.6'; });
      ti.addEventListener('click', (e) => {
        e.stopPropagation();
        const infos = {'🔊':'Volume: 80%','📶':'Network: KEVIN-SECURE','🔋':'Battery: 100% (AC)'};
        this.showNotification('System Tools', infos[ic], ic);
      });
      tray.appendChild(ti);
    });

    // Clock
    const clock = document.createElement('div');
    clock.id = 'taskbar-clock';
    clock.style.cssText = `
      font-family:'Share Tech Mono',monospace;font-size:12px;color:rgba(255,255,255,0.7);
      text-align:right;padding:0 8px;cursor:pointer;line-height:1.3;
    `;
    clock.innerHTML = '<div>00:00</div><div style="font-size:10px;opacity:0.5;">2026-04-08</div>';
    tray.appendChild(clock);

    // Notification bell
    const bell = document.createElement('div');
    bell.style.cssText = 'font-size:16px;cursor:pointer;padding:4px 8px;opacity:0.6;transition:opacity 0.2s;';
    bell.textContent = '🔔';
    bell.addEventListener('mouseenter', () => { bell.style.opacity = '1'; });
    bell.addEventListener('mouseleave', () => { bell.style.opacity = '0.6'; });
    tray.appendChild(bell);

    taskbar.appendChild(tray);

    // Start menu (hidden by default)
    const startMenu = this.createStartMenu();
    taskbar.appendChild(startMenu);

    // Click outside to close start menu
    this.container.addEventListener('click', () => {
      if (this.startMenuOpen) this.toggleStartMenu();
    });

    return taskbar;
  }

  createStartMenu() {
    const menu = document.createElement('div');
    menu.id = 'start-menu';
    menu.style.cssText = `
      position:absolute;bottom:48px;left:0;width:380px;height:500px;
      background:linear-gradient(180deg, rgba(18,24,40,0.98) 0%, rgba(10,14,25,0.99) 100%);
      backdrop-filter:blur(30px);
      border:1px solid rgba(0,229,255,0.12);
      border-bottom:none;border-radius:8px 8px 0 0;
      transform:translateY(10px) scale(0.95);opacity:0;pointer-events:none;
      transition:all 0.25s cubic-bezier(0.4,0,0.2,1);
      display:flex;flex-direction:column;overflow:hidden;
      box-shadow:0 -8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,255,0.05);
    `;

    // User header
    const header = document.createElement('div');
    header.style.cssText = `
      padding:20px;display:flex;align-items:center;gap:14px;
      border-bottom:1px solid rgba(255,255,255,0.06);
    `;
    header.innerHTML = `
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#00e5ff,#bf5fff);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 15px rgba(0,229,255,0.3);">⬡</div>
      <div>
        <div style="font-size:14px;font-weight:600;color:#fff;">KEVIN Admin</div>
        <div style="font-size:11px;color:rgba(0,229,255,0.6);font-family:'Share Tech Mono',monospace;">root@kevin-lab</div>
      </div>
    `;
    menu.appendChild(header);

    // Pinned section
    const pinned = document.createElement('div');
    pinned.style.cssText = 'padding:14px 20px;flex:1;overflow-y:auto;';
    pinned.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;font-weight:600;">PINNED</div>';

    const pinnedGrid = document.createElement('div');
    pinnedGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:4px;';

    const pinnedApps = [
      { name: 'Explorer', icon: '📁', app: 'explorer' },
      { name: 'Terminal', icon: '⬛', app: 'terminal' },
      { name: 'Monitor', icon: '📊', app: 'sysmonitor' },
      { name: 'Editor', icon: '📝', app: 'editor' },
      { name: 'Calculator', icon: '🔢', app: 'calculator' },
      { name: 'AI Chat', icon: '🤖', app: 'aichat' },
      { name: 'Settings', icon: '⚙️', app: 'settings' },
      { name: 'Network', icon: '🌐', app: 'network' },
      { name: 'Analysis', icon: '🔬', app: 'analysis' },
      { name: 'History', icon: '📜', app: 'mathistory' },
      { name: 'Molecular', icon: '⚛️', app: 'molecular' },
      { name: 'Compare', icon: '⚖️', app: 'comparelab' },
      { name: 'Stress Sim', icon: '💥', app: 'stresssim' },
      { name: 'Props DB', icon: '🗄️', app: 'propsdb' },
      { name: 'Music', icon: '🎵', app: 'music' },
      { name: 'About', icon: '❓', app: 'about' },
    ];

    pinnedApps.forEach(app => {
      const item = document.createElement('div');
      item.style.cssText = `
        display:flex;flex-direction:column;align-items:center;gap:4px;
        padding:10px 4px;border-radius:6px;cursor:pointer;transition:background 0.15s;
      `;
      item.innerHTML = `
        <div style="font-size:26px;">${app.icon}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.7);text-align:center;">${app.name}</div>
      `;
      item.addEventListener('mouseenter', () => { item.style.background = 'rgba(255,255,255,0.06)'; });
      item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openApp(app.app, app.name);
        this.toggleStartMenu();
      });
      pinnedGrid.appendChild(item);
    });

    pinned.appendChild(pinnedGrid);
    menu.appendChild(pinned);

    // Power buttons
    const power = document.createElement('div');
    power.style.cssText = `
      padding:12px 20px;border-top:1px solid rgba(255,255,255,0.06);
      display:flex;justify-content:flex-end;gap:8px;
    `;
    ['⏻ Shutdown', '🔄 Restart'].forEach(label => {
      const btn = document.createElement('div');
      btn.style.cssText = `
        font-size:11px;color:rgba(255,255,255,0.5);cursor:pointer;
        padding:6px 12px;border-radius:4px;transition:all 0.15s;
        font-family:'Share Tech Mono',monospace;
      `;
      btn.textContent = label;
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.06)';
        btn.style.color = 'rgba(255,255,255,0.8)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
        btn.style.color = 'rgba(255,255,255,0.5)';
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('kevincs-shutdown'));
      });
      power.appendChild(btn);
    });
    menu.appendChild(power);

    this.startMenu = menu;
    return menu;
  }

  toggleStartMenu() {
    this.startMenuOpen = !this.startMenuOpen;
    if (this.startMenuOpen) {
      this.startMenu.style.opacity = '1';
      this.startMenu.style.pointerEvents = 'all';
      this.startMenu.style.transform = 'translateY(0) scale(1)';
    } else {
      this.startMenu.style.opacity = '0';
      this.startMenu.style.pointerEvents = 'none';
      this.startMenu.style.transform = 'translateY(10px) scale(0.95)';
    }
  }

  // ═══ WINDOW MANAGEMENT ═══
  createWindow(title, icon, width, height, contentHTML, options = {}) {
    const id = this.windowIdCounter++;
    const z = ++this.zIndexCounter;

    const contRect = this.winsContainer.getBoundingClientRect();
    const maxW = contRect.width;
    const maxH = contRect.height;

    const w = Math.min(width, maxW - 20);
    const h = Math.min(height, maxH - 20);
    const x = Math.min(80 + (id * 30) % 300, maxW - w - 10);
    const y = Math.min(40 + (id * 25) % 200, maxH - h - 10);

    const win = document.createElement('div');
    win.id = `win-${id}`;
    win.className = 'kevin-window';
    win.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;
      background:rgba(12,16,28,0.97);
      border:1px solid rgba(0,229,255,0.12);
      border-radius:8px;overflow:hidden;
      display:flex;flex-direction:column;
      z-index:${z};
      box-shadow:0 8px 40px rgba(0,0,0,0.6), 0 0 1px rgba(0,229,255,0.2);
      transform:scale(0.9) translateY(20px);opacity:0;
      transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s, box-shadow 0.2s;
      min-width:200px;min-height:150px;
    `;

    // Title bar
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      height:36px;background:rgba(15,20,35,0.95);
      display:flex;align-items:center;padding:0 10px;gap:8px;
      cursor:default;flex-shrink:0;
      border-bottom:1px solid rgba(255,255,255,0.05);
    `;

    // App icon
    const appIcon = document.createElement('span');
    appIcon.style.cssText = 'font-size:14px;';
    appIcon.textContent = icon;
    titleBar.appendChild(appIcon);

    // Title
    const titleText = document.createElement('span');
    titleText.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.85);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    titleText.textContent = title;
    titleBar.appendChild(titleText);

    // Window buttons
    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:6px;align-items:center;';

    const makeBtn = (color, hoverColor, action) => {
      const b = document.createElement('div');
      b.style.cssText = `
        width:13px;height:13px;border-radius:50%;background:${color};
        cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;
        font-size:8px;color:transparent;
      `;
      b.addEventListener('mouseenter', () => {
        b.style.background = hoverColor;
        b.style.transform = 'scale(1.2)';
        b.style.color = '#000';
      });
      b.addEventListener('mouseleave', () => {
        b.style.background = color;
        b.style.transform = 'scale(1)';
        b.style.color = 'transparent';
      });
      b.addEventListener('click', (e) => { e.stopPropagation(); action(); });
      return b;
    };

    const minimizeBtn = makeBtn('rgba(255,200,0,0.6)', '#ffcc00', () => this.minimizeWindow(id));
    minimizeBtn.textContent = '—';
    btns.appendChild(minimizeBtn);

    const maximizeBtn = makeBtn('rgba(0,200,80,0.6)', '#00cc50', () => this.maximizeWindow(id));
    maximizeBtn.textContent = '□';
    btns.appendChild(maximizeBtn);

    const closeBtn = makeBtn('rgba(255,60,60,0.6)', '#ff3c3c', () => this.closeWindow(id));
    closeBtn.textContent = '✕';
    btns.appendChild(closeBtn);

    titleBar.appendChild(btns);

    // Make title bar draggable
    titleBar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('div[style*="border-radius:50%"]')) return; // Don't drag from buttons
      const wRect = win.getBoundingClientRect();
      const contRect = this.winsContainer.getBoundingClientRect();
      this.dragState = {
        type: 'window',
        winId: id,
        el: win,
        offsetX: e.clientX - wRect.left,
        offsetY: e.clientY - wRect.top,
        contLeft: contRect.left,
        contTop: contRect.top,
      };
      this.focusWindow(id);
      e.preventDefault();
    });
    
    // Double-click titlebar to maximize
    titleBar.addEventListener('dblclick', () => this.maximizeWindow(id));

    win.appendChild(titleBar);

    // Content area
    const content = document.createElement('div');
    content.className = 'win-content';
    content.style.cssText = 'flex:1;overflow:auto;position:relative;';
    content.innerHTML = contentHTML;
    win.appendChild(content);

    // Multi-directional Resize Handles
    ['n','s','e','w','nw','ne','sw','se'].forEach(dir => {
      const r = document.createElement('div');
      r.className = `resizer-${dir}`;
      r.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.resizeState = {
          winId: id,
          el: win,
          startX: e.clientX,
          startY: e.clientY,
          startW: win.offsetWidth,
          startH: win.offsetHeight,
          startL: win.offsetLeft,
          startT: win.offsetTop,
          dir: dir
        };
        this.focusWindow(id);
        e.preventDefault();
      });
      win.appendChild(r);
    });

    // Focus on click
    win.addEventListener('pointerdown', () => this.focusWindow(id));

    this.winsContainer.appendChild(win);

    // Animate in
    requestAnimationFrame(() => {
      win.style.transform = 'scale(1) translateY(0)';
      win.style.opacity = '1';
    });

    const winData = {
      id, title, icon, el: win, content, contentEl: content,
      minimized: false, maximized: false,
      prevBounds: null,
      app: options.app || 'unknown'
    };
    this.windows.push(winData);
    this.focusWindow(id);

    // Add to taskbar
    this.addTaskbarButton(winData);

    return winData;
  }

  focusWindow(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    this.activeWindow = id;
    this.zIndexCounter++;
    win.el.style.zIndex = this.zIndexCounter;
    win.el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.6), 0 0 2px rgba(0,229,255,0.4)';
    this.windows.forEach(w => {
      if (w.id !== id) {
        w.el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), 0 0 1px rgba(0,229,255,0.1)';
      }
    });
    // Update taskbar
    document.querySelectorAll('.task-btn').forEach(b => {
      b.style.background = b.dataset.winId == id ? 'rgba(0,229,255,0.12)' : 'transparent';
      b.style.borderBottom = b.dataset.winId == id ? '2px solid #00e5ff' : '2px solid transparent';
    });
  }

  minimizeWindow(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    win.minimized = true;
    win.el.style.transform = 'scale(0.8) translateY(100px)';
    win.el.style.opacity = '0';
    win.el.style.pointerEvents = 'none';
    setTimeout(() => { win.el.style.display = 'none'; }, 300);
  }

  restoreWindow(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    win.minimized = false;
    win.el.style.display = 'flex';
    requestAnimationFrame(() => {
      win.el.style.transform = win.maximized ? 'scale(1)' : 'scale(1) translateY(0)';
      win.el.style.opacity = '1';
      win.el.style.pointerEvents = 'auto';
    });
    this.focusWindow(id);
  }

  maximizeWindow(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    if (win.maximized) {
      // Restore
      if (win.prevBounds) {
        win.el.style.left = win.prevBounds.left + 'px';
        win.el.style.top = win.prevBounds.top + 'px';
        win.el.style.width = win.prevBounds.width + 'px';
        win.el.style.height = win.prevBounds.height + 'px';
        win.el.style.borderRadius = '8px';
      }
      win.maximized = false;
    } else {
      // Save current bounds
      win.prevBounds = {
        left: win.el.offsetLeft,
        top: win.el.offsetTop,
        width: win.el.offsetWidth,
        height: win.el.offsetHeight
      };
      win.el.style.left = '0';
      win.el.style.top = '0';
      win.el.style.width = '100%';
      win.el.style.height = '100%';
      win.el.style.borderRadius = '0';
      win.maximized = true;
    }
  }

  closeWindow(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    if (win.el.audioObject) {
      win.el.audioObject.pause();
      win.el.audioObject.src = '';
    }
    win.el.style.transform = 'scale(0.85)';
    win.el.style.opacity = '0';
    win.el.style.filter = 'blur(4px)';
    setTimeout(() => {
      win.el.remove();
      this.windows = this.windows.filter(w => w.id !== id);
      // Remove taskbar button
      const btn = document.querySelector(`.task-btn[data-win-id="${id}"]`);
      if (btn) btn.remove();
    }, 250);
  }

  addTaskbarButton(winData) {
    const btn = document.createElement('div');
    btn.className = 'task-btn';
    btn.dataset.winId = winData.id;
    btn.style.cssText = `
      display:flex;align-items:center;gap:6px;
      padding:4px 12px;height:36px;border-radius:4px;
      cursor:pointer;transition:all 0.15s;
      background:rgba(0,229,255,0.12);
      border-bottom:2px solid #00e5ff;
      max-width:160px;overflow:hidden;
    `;
    btn.innerHTML = `
      <span style="font-size:13px;">${winData.icon}</span>
      <span style="font-size:11px;color:rgba(255,255,255,0.8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${winData.title}</span>
    `;

    btn.addEventListener('click', () => {
      if (winData.minimized) {
        this.restoreWindow(winData.id);
      } else if (this.activeWindow === winData.id) {
        this.minimizeWindow(winData.id);
      } else {
        this.focusWindow(winData.id);
      }
    });

    btn.addEventListener('mouseenter', () => {
      if (this.activeWindow !== winData.id) btn.style.background = 'rgba(255,255,255,0.06)';
    });
    btn.addEventListener('mouseleave', () => {
      if (this.activeWindow !== winData.id) btn.style.background = 'transparent';
    });

    this.taskBtnsContainer.appendChild(btn);
  }

  onPointerMove(e) {
    if (this.dragState) {
      const { type, el, offsetX, offsetY, contLeft, contTop } = this.dragState;
      const x = e.clientX - contLeft - offsetX;
      const y = e.clientY - contTop - offsetY;

      if (type === 'window') {
        const win = this.windows.find(w => w.id === this.dragState.winId);
        if (win && win.maximized) {
          // Un-maximize on drag
          win.maximized = false;
          el.style.width = (win.prevBounds?.width || 600) + 'px';
          el.style.height = (win.prevBounds?.height || 400) + 'px';
          el.style.borderRadius = '8px';
        }
        el.style.left = Math.max(0, x) + 'px';
        el.style.top = Math.max(0, y) + 'px';
      } else if (type === 'icon') {
        const dx = e.clientX - (this.dragState.startX || 0);
        const dy = e.clientY - (this.dragState.startY || 0);
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        this._iconDragged = true;
        el.style.left = Math.max(0, x) + 'px';
        el.style.top = Math.max(0, y) + 'px';
      }
    }
    if (this.resizeState) {
      const { el, startX, startY, startW, startH, startL, startT, dir } = this.resizeState;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      let newW = startW, newH = startH, newL = startL, newT = startT;
      
      if (dir.includes('e')) newW = Math.max(200, startW + dx);
      if (dir.includes('s')) newH = Math.max(150, startH + dy);
      if (dir.includes('w')) {
        newW = Math.max(200, startW - dx);
        if (newW > 200) newL = startL + dx;
      }
      if (dir.includes('n')) {
        newH = Math.max(150, startH - dy);
        if (newH > 150) newT = startT + dy;
      }
      
      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      if (newL !== startL) el.style.left = newL + 'px';
      if (newT !== startT) el.style.top = newT + 'px';
    }
  }

  onPointerUp() {
    this.dragState = null;
    this.resizeState = null;
  }

  // ═══ NOTIFICATIONS ═══
  showNotification(title, message, icon = '💬') {
    const notif = document.createElement('div');
    notif.style.cssText = `
      width:320px;padding:14px 16px;
      background:rgba(15,20,35,0.95);
      backdrop-filter:blur(20px);
      border:1px solid rgba(0,229,255,0.15);
      border-radius:8px;
      display:flex;gap:12px;align-items:flex-start;
      transform:translateX(120%);opacity:0;
      transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
      pointer-events:all;cursor:pointer;
      box-shadow:0 4px 20px rgba(0,0,0,0.4);
    `;
    notif.innerHTML = `
      <div style="font-size:24px;flex-shrink:0;margin-top:2px;">${icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:600;color:#00e5ff;margin-bottom:4px;">${title}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.4;">${message}</div>
      </div>
    `;

    this.notifContainer.appendChild(notif);
    requestAnimationFrame(() => {
      notif.style.transform = 'translateX(0)';
      notif.style.opacity = '1';
    });

    setTimeout(() => {
      notif.style.transform = 'translateX(120%)';
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 400);
    }, 4000);
  }

  // ═══ APPLICATION LAUNCHERS ═══
  openApp(appName, displayName) {
    const apps = {
      explorer: () => this.openFileExplorer(),
      terminal: () => this.openTerminal(),
      sysmonitor: () => this.openSystemMonitor(),
      editor: () => this.openTextEditor(),
      calculator: () => this.openCalculator(),
      aichat: () => this.openAIChat(),
      settings: () => this.openSettings(),
      analysis: () => this.openAnalysis(),
      mathistory: () => this.openMaterialHistory(),
      molecular: () => this.openMolecularViewer(),
      comparelab: () => this.openComparisonLab(),
      stresssim: () => this.openStressSimulator(),
      propsdb: () => this.openPropertiesDB(),
      music: () => this.openMusicPlayer(),
      imageviewer: () => this.openImageViewer(),
      network: () => this.openNetwork(),
      recycle: () => this.openRecycleBin(),
      about: () => this.openAbout(),
    };

    if (apps[appName]) {
      apps[appName]();
    } else {
      this.showNotification('Error', `Application "${displayName}" not found.`, '❌');
    }
  }

  // ═══ FILE EXPLORER ═══
  openFileExplorer(path = 'C:/Users/Kevin/Desktop') {
    const win = this.createWindow('File Explorer — ' + path, '📁', 700, 480, '', { app: 'explorer' });

    const renderFolder = (path) => {
      const parts = path.replace(/\//g, '/').split('/').filter(Boolean);
      let node = this.fileSystem;
      for (const p of parts) {
        if (node[p] && node[p].type === 'folder') {
          node = node[p].children;
        } else if (node[p]) {
          // It's a file, open it
          this.openFileContent(node[p], p);
          return;
        } else break;
      }

      let html = `
        <div style="background:rgba(15,20,35,0.9);padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.05);">
          <div class="nav-btn" style="cursor:pointer;padding:4px 8px;border-radius:3px;font-size:13px;opacity:0.6;" data-action="back">◀</div>
          <div class="nav-btn" style="cursor:pointer;padding:4px 8px;border-radius:3px;font-size:13px;opacity:0.6;" data-action="up">▲</div>
          <div style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:3px;padding:5px 10px;font-size:11px;color:rgba(0,229,255,0.7);font-family:'Share Tech Mono',monospace;">${path}</div>
        </div>
        <div style="display:flex;flex:1;overflow:hidden;">
          <div style="width:170px;background:rgba(10,14,24,0.9);border-right:1px solid rgba(255,255,255,0.05);padding:10px 0;overflow-y:auto;">
            <div style="padding:4px 14px;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:1px;margin-bottom:4px;">QUICK ACCESS</div>
      `;

      const quickLinks = [
        { icon: '🏠', name: 'Desktop', path: 'C:/Users/Kevin/Desktop' },
        { icon: '📄', name: 'Documents', path: 'C:/Users/Kevin/Documents' },
        { icon: '⬇️', name: 'Downloads', path: 'C:/Users/Kevin/Downloads' },
        { icon: '🖼️', name: 'Pictures', path: 'C:/Users/Kevin/Pictures' },
        { icon: '💻', name: 'This PC', path: 'C:' },
        { icon: '⚙️', name: 'System', path: 'C:/System' },
        { icon: '📦', name: 'Programs', path: 'C:/Programs' },
      ];

      quickLinks.forEach(ql => {
        const active = path === ql.path ? 'background:rgba(0,229,255,0.08);' : '';
        html += `<div class="sidebar-link" style="${active}padding:6px 14px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,0.7);transition:background 0.15s;" data-path="${ql.path}">${ql.icon} ${ql.name}</div>`;
      });

      html += `</div><div style="flex:1;padding:10px;overflow-y:auto;display:flex;flex-wrap:wrap;align-content:flex-start;gap:4px;">`;

      // List files and folders
      if (node && typeof node === 'object') {
        Object.keys(node).forEach(name => {
          const item = node[name];
          const isFolder = item.type === 'folder';
          const icon = isFolder ? '📁' : (item.icon || '📄');
          const size = item.size || (isFolder ? '' : '0 KB');
          const modified = item.modified || '';

          html += `
            <div class="file-item" style="
              width:100%;padding:6px 10px;border-radius:4px;cursor:pointer;
              display:flex;align-items:center;gap:10px;
              transition:background 0.15s;font-size:12px;
            " data-name="${name}" data-type="${item.type}" data-path="${path}/${name}">
              <span style="font-size:20px;flex-shrink:0;">${icon}</span>
              <span style="flex:1;color:rgba(255,255,255,0.85);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</span>
              <span style="color:rgba(255,255,255,0.3);font-size:10px;font-family:'Share Tech Mono',monospace;min-width:60px;text-align:right;">${size}</span>
              <span style="color:rgba(255,255,255,0.3);font-size:10px;font-family:'Share Tech Mono',monospace;min-width:80px;text-align:right;">${modified}</span>
            </div>
          `;
        });
      }

      html += '</div></div>';
      win.content.innerHTML = html;

      // Event handlers
      win.content.querySelectorAll('.file-item').forEach(fi => {
        fi.addEventListener('mouseenter', () => { fi.style.background = 'rgba(0,229,255,0.06)'; });
        fi.addEventListener('mouseleave', () => { fi.style.background = 'transparent'; });
        fi.addEventListener('dblclick', () => {
          const itemPath = fi.dataset.path;
          if (fi.dataset.type === 'folder') {
            renderFolder(itemPath);
          } else {
            // Open file
            const parts2 = itemPath.split('/').filter(Boolean);
            let n2 = this.fileSystem;
            for (const p2 of parts2) {
              if (n2[p2] && n2[p2].type === 'folder') n2 = n2[p2].children;
              else if (n2[p2]) { this.openFileContent(n2[p2], p2); break; }
            }
          }
        });
      });

      win.content.querySelectorAll('.sidebar-link').forEach(sl => {
        sl.addEventListener('mouseenter', () => { sl.style.background = 'rgba(0,229,255,0.06)'; });
        sl.addEventListener('mouseleave', () => {
          sl.style.background = sl.dataset.path === path ? 'rgba(0,229,255,0.08)' : 'transparent';
        });
        sl.addEventListener('click', () => renderFolder(sl.dataset.path));
      });

      win.content.querySelectorAll('.nav-btn').forEach(nb => {
        nb.addEventListener('mouseenter', () => { nb.style.opacity = '1'; nb.style.background = 'rgba(255,255,255,0.06)'; });
        nb.addEventListener('mouseleave', () => { nb.style.opacity = '0.6'; nb.style.background = 'transparent'; });
        if (nb.dataset.action === 'up') {
          nb.addEventListener('click', () => {
            const parentPath = path.split('/').slice(0, -1).join('/') || 'C:';
            renderFolder(parentPath);
          });
        }
      });
      
      // Update window title
      win.el.querySelector('span:nth-child(2)').textContent = 'File Explorer — ' + path;
    };

    renderFolder(path);
  }

  openFileContent(file, name) {
    if (file.isImage) {
      this.openImageViewerWithFile(name);
    } else if (file.content) {
      this.openTextEditor(file.content, name);
    } else {
      this.showNotification('File Info', `${name} — ${file.size || 'Unknown size'}`, file.icon || '📄');
    }
  }

  // ═══ TERMINAL ═══
  openTerminal() {
    const win = this.createWindow('KEVIN Terminal', '⬛', 650, 420, '', { app: 'terminal' });
    const history = ['KEVIN OS v4.2.1 — Quantum Shell', '© 2026 KEVIN Robotics. All rights reserved.', '', 'Type "help" for a list of commands.', ''];

    const render = (cmd) => {
      if (cmd !== undefined) {
        history.push(`root@kevin-lab:~$ ${cmd}`);
        const output = this.executeCommand(cmd);
        output.forEach(l => history.push(l));
        history.push('');
      }

      win.content.innerHTML = `
        <div style="background:#0a0e18;height:100%;padding:12px;font-family:'Share Tech Mono',monospace;font-size:12px;color:#00e5ff;overflow-y:auto;line-height:1.6;" id="term-output-${win.id}">
          ${history.map(l => `<div style="color:${l.startsWith('root@') ? '#00ff88' : l.startsWith('ERROR') ? '#ff4040' : l.startsWith('>>>') ? '#ffaa00' : 'rgba(255,255,255,0.7)'};">${l || '&nbsp;'}</div>`).join('')}
          <div style="display:flex;align-items:center;gap:0;">
            <span style="color:#00ff88;">root@kevin-lab:~$&nbsp;</span>
            <input id="term-input-${win.id}" type="text" style="
              background:transparent;border:none;outline:none;color:#fff;
              font-family:'Share Tech Mono',monospace;font-size:12px;flex:1;
              caret-color:#00e5ff;
            " autofocus />
          </div>
        </div>
      `;

      const input = document.getElementById(`term-input-${win.id}`);
      const output = document.getElementById(`term-output-${win.id}`);
      if (input) {
        input.focus();
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const cmd = input.value.trim();
            if (cmd) render(cmd);
          }
        });
      }
      if (output) output.scrollTop = output.scrollHeight;
    };

    render();
  }

  executeCommand(cmd) {
    const parts = cmd.toLowerCase().trim().split(/\s+/);
    const command = parts[0];

    const commands = {
      help: () => [
        '>>> Available commands:',
        '  help          — Show this help',
        '  clear         — Clear terminal',
        '  ls / dir      — List files',
        '  cat <file>    — View file contents',
        '  date          — Current date/time',
        '  whoami        — Current user',
        '  hostname      — System hostname',
        '  uname         — System information',
        '  uptime        — System uptime',
        '  free          — Memory usage',
        '  df            — Disk usage',
        '  neofetch      — System info display',
        '  top           — Process list',
        '  ping <host>   — Network ping',
        '  echo <text>   — Echo text',
        '  matrix        — Matrix rain effect',
        '  cowsay        — ASCII cow',
      ],
      clear: () => { return ['[CLEAR]']; },
      ls: () => [
        '>>> Desktop  Documents  Downloads  Pictures',
        '  Material Analysis.kev  readme.txt  Project Notes/',
      ],
      dir: () => commands.ls(),
      date: () => [`>>> ${new Date().toLocaleString()}`],
      whoami: () => ['>>> root (KEVIN Admin)'],
      hostname: () => ['>>> kevin-lab-primary'],
      uname: () => ['>>> KEVIN OS 4.2.1 (Quantum) x86_64 Neural-FPGA-x16'],
      uptime: () => [`>>> System up ${Math.floor(Math.random() * 365)} days, ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`],
      free: () => [
        '>>> Memory Usage:',
        '  Total:    1,048,576 TB',
        '  Used:       723,841 TB (69%)',
        '  Free:       324,735 TB',
        '  Neural:     512,000 TB (dedicated)',
      ],
      df: () => [
        '>>> Filesystem      Size  Used  Avail  Use%',
        '  /dev/quantum0    4.2 PB  2.8 PB  1.4 PB  67%',
        '  /dev/neural0     1.0 PB  890 TB  134 TB  87%',
        '  /dev/sensor0     256 TB  45 TB   211 TB  18%',
      ],
      neofetch: () => [
        '>>> ',
        '  ⬡⬡⬡⬡⬡⬡    root@kevin-lab',
        '  ⬡    ⬡    ─────────────',
        '  ⬡ ⬡⬡ ⬡    OS: KEVIN OS 4.2.1',
        '  ⬡    ⬡    Kernel: quantum_v3',
        '  ⬡⬡⬡⬡⬡⬡    CPU: Neural FPGA x16 @ 4.8THz',
        '              GPU: RTX 9090 Quantum',
        '              Memory: 1024 TB',
        '              Shell: kevin-sh 2.1',
        '              Resolution: 7680x4320',
        '              AI Core: Active (99.7%)',
      ],
      top: () => [
        '>>> PID    CPU%  MEM%  COMMAND',
        '  1      2.3   0.1   systemd',
        '  42     34.7  12.4  kevin_ai_core',
        '  108    18.2   8.9  neural_engine',
        '  209    12.1   4.3  sensor_manager',
        '  301     8.6   2.1  quantum_bridge',
        '  445     5.4   1.8  material_analyzer',
        '  512     3.2   0.9  display_server',
        '  667     2.8   0.6  kevin_shell',
      ],
      ping: () => [
        '>>> PING quantum-server.kevin.lab (10.0.0.1)',
        '  64 bytes: seq=1 ttl=64 time=0.042ms',
        '  64 bytes: seq=2 ttl=64 time=0.038ms',
        '  64 bytes: seq=3 ttl=64 time=0.041ms',
        '  --- 3 packets transmitted, 3 received, 0% loss ---',
      ],
      echo: () => [`>>> ${parts.slice(1).join(' ') || ''}`],
      matrix: () => ['>>> Initializing Matrix... (just kidding, this is a terminal 😄)'],
      cowsay: () => [
        '>>>  _________________________',
        '  < KEVIN AI says hello! >',
        '   -------------------------',
        '          \\   ^__^',
        '           \\  (oo)\\_______',
        '              (__)\\       )\\/\\',
        '                  ||----w |',
        '                  ||     ||',
      ],
    };

    if (commands[command]) return commands[command]();
    return [`ERROR: Command not found: ${command}`, 'Type "help" for available commands.'];
  }

  // ═══ SYSTEM MONITOR ═══
  openSystemMonitor() {
    const win = this.createWindow('System Monitor', '📊', 660, 480, '', { app: 'sysmonitor' });
    const c = win.content;
    const cpuHistory = Array(60).fill(0).map(() => 30 + Math.random() * 40);
    const memHistory = Array(60).fill(0).map(() => 50 + Math.random() * 30);
    const drawGraph = (data, color) => {
      const max = 100;
      const points = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * 100},${100 - (v / max) * 100}`);
      return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;">
        <defs><linearGradient id="g-${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
        </linearGradient></defs>
        <polygon points="0,100 ${points.join(' ')} 100,100" fill="url(#g-${color.replace('#','')})" />
        <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="1.2" />
      </svg>`;
    };
    let updateInterval;
    const update = () => {
      cpuHistory.push(10 + Math.random() * 70); cpuHistory.shift();
      memHistory.push(40 + Math.random() * 50); memHistory.shift();
      const cpuCurrent = cpuHistory[cpuHistory.length - 1];
      const memCurrent = memHistory[memHistory.length - 1];
      const processes = [
        { name: 'kevin_ai_core', cpu: (Math.random() * 40 + 10).toFixed(1), mem: '1.2 TB' },
        { name: 'neural_engine', cpu: (Math.random() * 20 + 5).toFixed(1), mem: '890 GB' },
        { name: 'sensor_mgr', cpu: (Math.random() * 5 + 1).toFixed(1), mem: '45 GB' },
        { name: 'material_anlz', cpu: (Math.random() * 8 + 2).toFixed(1), mem: '212 GB' },
        { name: 'display_srv', cpu: (Math.random() * 3).toFixed(1), mem: '16 GB' },
        { name: 'kevin_shell', cpu: (Math.random() * 2).toFixed(1), mem: '4 GB' },
      ].sort((a, b) => parseFloat(b.cpu) - parseFloat(a.cpu));

      c.innerHTML = `
        <div style="padding:14px;font-family:'Share Tech Mono',monospace;height:100%;overflow-y:auto;background:linear-gradient(180deg,rgba(0,10,20,0.98),rgba(5,5,15,0.95));">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <div style="font-size:14px;color:#00e5ff;font-weight:700;letter-spacing:2px;text-shadow:0 0 10px rgba(0,229,255,0.5);">PERFORMANCE MONITOR</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.4);border:1px solid rgba(255,255,255,0.1);padding:2px 8px;border-radius:10px;">REAL-TIME TICK</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">
            <div style="background:rgba(0,229,255,0.03);border:1px solid rgba(0,229,255,0.15);border-radius:8px;padding:12px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#00e5ff;font-size:11px;letter-spacing:1px;font-weight:700;">CPU USAGE [32 CORES]</span>
                <span style="color:${cpuCurrent > 70 ? '#ff4444' : '#00e5ff'};font-size:16px;font-weight:bold;text-shadow:0 0 8px ${cpuCurrent > 70 ? '#ff4444' : '#00e5ff'};">${cpuCurrent.toFixed(1)}%</span>
              </div>
              <div style="height:90px;background:rgba(0,0,0,0.4);border-radius:4px;overflow:hidden;border:1px solid rgba(0,229,255,0.1);">${drawGraph(cpuHistory, '#00e5ff')}</div>
            </div>
            <div style="background:rgba(191,95,255,0.03);border:1px solid rgba(191,95,255,0.15);border-radius:8px;padding:12px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="color:#bf5fff;font-size:11px;letter-spacing:1px;font-weight:700;">MEMORY [1024 TB]</span>
                <span style="color:${memCurrent > 80 ? '#ff4040' : '#bf5fff'};font-size:16px;font-weight:bold;text-shadow:0 0 8px ${memCurrent > 80 ? '#ff4040' : '#bf5fff'};">${memCurrent.toFixed(1)}%</span>
              </div>
              <div style="height:90px;background:rgba(0,0,0,0.4);border-radius:4px;overflow:hidden;border:1px solid rgba(191,95,255,0.1);">${drawGraph(memHistory, '#bf5fff')}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
            <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:6px;padding:10px;text-align:center;">
              <div style="color:rgba(255,255,255,0.5);font-size:9px;margin-bottom:4px;letter-spacing:1px;">GPU TEMP</div>
              <div style="color:#00ff88;font-size:18px;font-weight:bold;text-shadow:0 0 10px #00ff88;">${(45 + Math.random() * 15).toFixed(0)}°C</div>
            </div>
            <div style="background:rgba(255,170,0,0.05);border:1px solid rgba(255,170,0,0.2);border-radius:6px;padding:10px;text-align:center;">
              <div style="color:rgba(255,255,255,0.5);font-size:9px;margin-bottom:4px;letter-spacing:1px;">NETWORK</div>
              <div style="color:#ffaa00;font-size:18px;font-weight:bold;text-shadow:0 0 10px #ffaa00;">${(10 + Math.random() * 90).toFixed(1)} Gb/s</div>
            </div>
            <div style="background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.2);border-radius:6px;padding:10px;text-align:center;">
              <div style="color:rgba(255,255,255,0.5);font-size:9px;margin-bottom:4px;letter-spacing:1px;">DISK I/O</div>
              <div style="color:#00e5ff;font-size:18px;font-weight:bold;text-shadow:0 0 10px #00e5ff;">${(2 + Math.random() * 5).toFixed(1)} TB/s</div>
            </div>
            <div style="background:rgba(255,68,68,0.05);border:1px solid rgba(255,68,68,0.2);border-radius:6px;padding:10px;text-align:center;">
              <div style="color:rgba(255,255,255,0.5);font-size:9px;margin-bottom:4px;letter-spacing:1px;">AI LOAD</div>
              <div style="color:#ff4444;font-size:18px;font-weight:bold;text-shadow:0 0 10px #ff4444;">${(80 + Math.random() * 20).toFixed(0)}%</div>
            </div>
          </div>
          <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);border-radius:6px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <thead>
                <tr style="background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.5);text-align:left;">
                  <th style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.1);">PROCESS</th>
                  <th style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.1);">CPU</th>
                  <th style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.1);">MEMORY</th>
                </tr>
              </thead>
              <tbody>
                ${processes.map((p, i) => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.03);background:${i%2?'transparent':'rgba(255,255,255,0.01)'}">
                    <td style="padding:6px 12px;color:rgba(255,255,255,0.9);">${p.name}</td>
                    <td style="padding:6px 12px;color:${p.cpu>20?'#ffaa00':'#00ff88'};">${p.cpu}%</td>
                    <td style="padding:6px 12px;color:rgba(255,255,255,0.6);">${p.mem}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    };
    update();
    updateInterval = setInterval(update, 1000);
    // Bind cleanup
    const closeBtn = win.el.querySelector('.kevin-window-close');
    const oldClick = closeBtn.onclick;
    closeBtn.onclick = (e) => { clearInterval(updateInterval); if(oldClick) oldClick.call(closeBtn, e); };
  }

  // ═══ TEXT EDITOR ═══
  openTextEditor(content = '', filename = 'Untitled') {
    const defaultContent = content || 'Welcome to KEVIN Editor.\n\nStart typing here...\n\n// Example code:\nfunction analyzeArmor(material) {\n  const density = material.density;\n  const tensile = material.tensileStrength;\n  const ratio = tensile / density;\n  return {\n    efficiency: ratio,\n    grade: ratio > 2500 ? "EXCELLENT" : "STANDARD"\n  };\n}';

    const win = this.createWindow(`Editor — ${filename}`, '📝', 600, 420, `
      <div style="display:flex;flex-direction:column;height:100%;">
        <div style="display:flex;gap:2px;padding:4px 8px;background:rgba(15,20,35,0.9);border-bottom:1px solid rgba(255,255,255,0.05);">
          ${['File', 'Edit', 'View', 'Format', 'Help'].map(m => `
            <div style="padding:4px 10px;font-size:11px;color:rgba(255,255,255,0.6);cursor:pointer;border-radius:3px;transition:background 0.15s;"
              onmouseenter="this.style.background='rgba(255,255,255,0.06)'"
              onmouseleave="this.style.background='transparent'">${m}</div>
          `).join('')}
        </div>
        <div style="display:flex;flex:1;overflow:hidden;">
          <div id="editor-lines-${win.id}" style="width:40px;background:rgba(8,12,20,0.9);padding:8px 0;text-align:right;font-family:'Share Tech Mono',monospace;font-size:12px;color:rgba(255,255,255,0.15);line-height:1.6;overflow:hidden;flex-shrink:0;padding-right:8px;"></div>
          <textarea id="editor-area-${win.id}" style="
            flex:1;background:rgba(12,16,28,0.5);border:none;outline:none;resize:none;
            padding:8px 12px;font-family:'Share Tech Mono',monospace;font-size:12px;
            color:rgba(255,255,255,0.85);line-height:1.6;tab-size:4;
          " spellcheck="false">${defaultContent}</textarea>
        </div>
        <div style="padding:4px 12px;background:rgba(15,20,35,0.9);border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;">
          <span>UTF-8 | LF</span>
          <span id="editor-pos-${win.id}">Ln 1, Col 1</span>
          <span>${filename}</span>
        </div>
      </div>
    `, { app: 'editor' });

    const textarea = document.getElementById(`editor-area-${win.id}`);
    const linesEl = document.getElementById(`editor-lines-${win.id}`);
    const posEl = document.getElementById(`editor-pos-${win.id}`);

    const updateLines = () => {
      if (!textarea) return;
      const lines = textarea.value.split('\n').length;
      linesEl.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
    };

    const updatePos = () => {
      if (!textarea) return;
      const pos = textarea.selectionStart;
      const text = textarea.value.substring(0, pos);
      const line = text.split('\n').length;
      const col = pos - text.lastIndexOf('\n');
      if (posEl) posEl.textContent = `Ln ${line}, Col ${col}`;
    };

    if (textarea) {
      textarea.addEventListener('input', updateLines);
      textarea.addEventListener('click', updatePos);
      textarea.addEventListener('keyup', updatePos);
      textarea.addEventListener('scroll', () => {
        if (linesEl) linesEl.scrollTop = textarea.scrollTop;
      });
      updateLines();
    }
  }

  // ═══ CALCULATOR ═══
  openCalculator() {
    const win = this.createWindow('Calculator', '🔢', 300, 420, '', { app: 'calculator' });
    let display = '0';
    let prevValue = null;
    let operator = null;
    let fresh = true;

    const render = () => {
      const buttons = [
        ['C', '±', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '−'],
        ['1', '2', '3', '+'],
        ['0', '.', '⌫', '='],
      ];

      win.content.innerHTML = `
        <div style="padding:16px;display:flex;flex-direction:column;height:100%;gap:8px;">
          <div style="
            background:rgba(0,0,0,0.3);border:1px solid rgba(0,229,255,0.1);
            border-radius:8px;padding:16px 20px;text-align:right;
            min-height:80px;display:flex;flex-direction:column;justify-content:flex-end;
          ">
            <div style="font-size:12px;color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;min-height:16px;">
              ${prevValue !== null ? `${prevValue} ${operator || ''}` : ''}
            </div>
            <div style="font-size:32px;color:#fff;font-family:'Orbitron','Share Tech Mono',monospace;font-weight:300;overflow:hidden;text-overflow:ellipsis;">
              ${display}
            </div>
          </div>
          <div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
            ${buttons.flat().map(b => {
              const isOp = ['÷', '×', '−', '+', '='].includes(b);
              const isFunc = ['C', '±', '%', '⌫'].includes(b);
              const bg = isOp ? 'rgba(0,229,255,0.15)' : isFunc ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)';
              const color = isOp ? '#00e5ff' : '#fff';
              const span = b === '0' ? '' : '';
              return `<div class="calc-btn" data-val="${b}" style="
                background:${bg};border-radius:8px;display:flex;align-items:center;justify-content:center;
                font-size:${isOp ? '20' : '18'}px;color:${color};cursor:pointer;
                transition:all 0.12s;user-select:none;border:1px solid rgba(255,255,255,0.04);
                ${span}
              ">${b}</div>`;
            }).join('')}
          </div>
        </div>
      `;

      win.content.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'scale(1.05)';
          btn.style.filter = 'brightness(1.3)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'scale(1)';
          btn.style.filter = 'brightness(1)';
        });
        btn.addEventListener('click', () => {
          const val = btn.dataset.val;
          if ('0123456789'.includes(val)) {
            display = (fresh || display === '0') ? val : display + val;
            fresh = false;
          } else if (val === '.') {
            if (!display.includes('.')) display += '.';
            fresh = false;
          } else if (val === 'C') {
            display = '0';
            prevValue = null;
            operator = null;
            fresh = true;
          } else if (val === '⌫') {
            display = display.length > 1 ? display.slice(0, -1) : '0';
          } else if (val === '±') {
            display = display.startsWith('-') ? display.slice(1) : '-' + display;
          } else if (val === '%') {
            display = String(parseFloat(display) / 100);
          } else if ('÷×−+'.includes(val)) {
            if (prevValue !== null && operator && !fresh) {
              display = String(this.calcOp(parseFloat(prevValue), parseFloat(display), operator));
            }
            prevValue = display;
            operator = val;
            fresh = true;
          } else if (val === '=') {
            if (prevValue !== null && operator) {
              display = String(this.calcOp(parseFloat(prevValue), parseFloat(display), operator));
              prevValue = null;
              operator = null;
              fresh = true;
            }
          }
          render();
        });
      });
    };

    render();
  }

  calcOp(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  }

  // ═══ AI CHAT ═══
  openAIChat() {
    const win = this.createWindow('KEVIN AI Chat', '🤖', 500, 450, '', { app: 'aichat' });
    const messages = [
      { role: 'system', text: 'KEVIN AI v4.2.1 initialized. Neural accuracy: 99.7%' },
      { role: 'ai', text: 'Hello! I\'m KEVIN AI, your material analysis assistant. How can I help you today?' },
    ];

    const responses = [
      'Based on my analysis, Kevlar provides the optimal strength-to-weight ratio for your application.',
      'The thermal data indicates steel maintains structural integrity up to 600°C under sustained load.',
      'I\'ve cross-referenced the ballistic test data — Kevlar fiber weave shows 98.7% energy dispersion at NIJ Level IIIA.',
      'Aluminum alloy 7075-T6 offers the best combination of weight savings and corrosion resistance for aerospace applications.',
      'My neural network predicts a 12.3% improvement in tensile performance with the proposed carbon nanotube reinforcement.',
      'Running finite element analysis... The stress concentration factor at the weld joint exceeds acceptable limits by 4.2%.',
      'I recommend a layered composite approach: Kevlar outer shell, aluminum honeycomb core, carbon fiber inner lining.',
      'The sensor array is detecting anomalous readings in sector 7. I suggest recalibration before proceeding.',
    ];

    const render = () => {
      win.content.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;">
          <div id="chat-msgs-${win.id}" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;">
            ${messages.map(m => `
              <div style="display:flex;${m.role === 'user' ? 'justify-content:flex-end;' : ''}">
                <div style="
                  max-width:80%;padding:10px 14px;border-radius:${m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};
                  background:${m.role === 'system' ? 'rgba(255,255,255,0.03)' : m.role === 'user' ? 'rgba(0,229,255,0.12)' : 'rgba(191,95,255,0.08)'};
                  border:1px solid ${m.role === 'system' ? 'rgba(255,255,255,0.05)' : m.role === 'user' ? 'rgba(0,229,255,0.15)' : 'rgba(191,95,255,0.12)'};
                  font-size:12px;color:rgba(255,255,255,0.8);line-height:1.5;
                ">
                  ${m.role === 'ai' ? '<span style="color:#bf5fff;font-size:14px;margin-right:6px;">🤖</span>' : ''}
                  ${m.role === 'system' ? `<span style="color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;font-size:10px;">${m.text}</span>` : m.text}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="padding:10px;border-top:1px solid rgba(255,255,255,0.05);display:flex;gap:8px;">
            <input id="chat-input-${win.id}" type="text" placeholder="Ask KEVIN AI..." style="
              flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
              border-radius:8px;padding:10px 14px;outline:none;color:#fff;font-size:12px;
              font-family:'Segoe UI',sans-serif;transition:border-color 0.2s;
            " onfocus="this.style.borderColor='rgba(0,229,255,0.3)'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'" />
            <div id="chat-send-${win.id}" style="
              width:40px;height:40px;background:rgba(0,229,255,0.15);border-radius:8px;
              display:flex;align-items:center;justify-content:center;cursor:pointer;
              transition:all 0.15s;font-size:16px;
            " onmouseenter="this.style.background='rgba(0,229,255,0.25)'" onmouseleave="this.style.background='rgba(0,229,255,0.15)'">➤</div>
          </div>
        </div>
      `;

      const input = document.getElementById(`chat-input-${win.id}`);
      const sendBtn = document.getElementById(`chat-send-${win.id}`);
      const msgsEl = document.getElementById(`chat-msgs-${win.id}`);

      const send = () => {
        const text = input.value.trim();
        if (!text) return;
        messages.push({ role: 'user', text });
        input.value = '';
        render();
        // AI "typing" delay
        setTimeout(() => {
          const resp = responses[Math.floor(Math.random() * responses.length)];
          messages.push({ role: 'ai', text: resp });
          render();
          const el = document.getElementById(`chat-msgs-${win.id}`);
          if (el) el.scrollTop = el.scrollHeight;
        }, 800 + Math.random() * 1200);
      };

      if (input) {
        input.focus();
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
      }
      if (sendBtn) sendBtn.addEventListener('click', send);
      if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
    };

    render();
  }

  // ═══ SETTINGS ═══
  openSettings() {
    const win = this.createWindow('Settings', '⚙️', 650, 480, '', { app: 'settings' });
    const c = win.content;
    let activeTab = 'System';
    const tabs = ['System', 'Display', 'Network', 'Sound', 'Personalization', 'Security', 'AI Core'];
    
    // Some state for interaction
    let perfMode = 'Quantum';
    let btEnabled = true;
    let volume = 80;

    const render = () => {
      c.innerHTML = `
        <div style="display:flex;height:100%;background:linear-gradient(135deg,rgba(0,5,15,0.98),rgba(5,5,15,0.95));">
          <div style="width:160px;background:rgba(0,0,0,0.5);border-right:1px solid rgba(255,255,255,0.05);padding:12px 0;">
            ${tabs.map(s => `
              <div class="sett-tab" data-tab="${s}" style="padding:10px 16px;font-size:12px;color:rgba(255,255,255,${s === activeTab ? '0.9' : '0.5'});cursor:pointer;
                transition:all 0.2s;${s === activeTab ? 'background:rgba(0,229,255,0.1);border-left:3px solid #00e5ff;font-weight:600;' : 'border-left:3px solid transparent;'}"
                onmouseenter="if('${s}'!=='${activeTab}') this.style.background='rgba(255,255,255,0.04)'"
                onmouseleave="if('${s}'!=='${activeTab}') this.style.background='transparent'">${s}</div>
            `).join('')}
          </div>
          <div style="flex:1;padding:24px;overflow-y:auto;">
            <div style="font-size:20px;color:#fff;margin-bottom:24px;font-weight:700;letter-spacing:1px;text-shadow:0 0 10px rgba(0,229,255,0.4); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">${activeTab} Settings</div>
            
            ${activeTab === 'System' ? `
              <div style="margin-bottom:24px;">
                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;letter-spacing:1px;">Performance Mode</div>
                <div style="display:flex;gap:10px;">
                  ${['Saver', 'Balanced', 'Performance', 'Quantum'].map(m => `
                    <div class="sett-perf" data-m="${m}" style="padding:8px 14px;background:${m === perfMode ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.04)'};
                      border:1px solid ${m === perfMode ? '#00e5ff' : 'rgba(255,255,255,0.1)'};
                      border-radius:6px;font-size:11px;cursor:pointer;transition:all 0.2s;
                      color:${m === perfMode ? '#00e5ff' : 'rgba(255,255,255,0.6)'};font-weight:${m===perfMode?'700':'400'};">${m}</div>
                  `).join('')}
                </div>
              </div>
              <div style="margin-bottom:20px;">
                ${['AI Auto-Analysis','Neural Network Training','Hardware Acceleration','Diagnostics Reporting'].map(t => this.renderToggle(t)).join('')}
              </div>
              <div style="padding:16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,229,255,0.2);border-radius:6px;position:relative;">
                <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:#00e5ff;"></div>
                <div style="font-size:11px;color:#00e5ff;margin-bottom:8px;font-weight:700;letter-spacing:1px;">SYSTEM SPECS</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.8;font-family:'Share Tech Mono',monospace;">
                  OS: KEVIN OS 4.2.1 Pro<br>CPU: Neural FPGA x16 @ 4.8 THz<br>GPU: RTX 9090 Quantum<br>RAM: 1024 TB<br>Active Storage: 4.2 PB
                </div>
              </div>
            ` : activeTab === 'Display' ? `
              <div style="margin-bottom:20px;">
                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Resolution</div>
                <select style="width:100%;padding:10px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:6px;outline:none;">
                  <option>7680 x 4320 (8K Native)</option><option>3840 x 2160 (4K)</option>
                </select>
              </div>
              <div style="margin-bottom:24px;">
                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Brightness</div>
                <input type="range" style="width:100%;accent-color:#00e5ff;cursor:pointer;" min="0" max="100" value="85">
              </div>
              ${this.renderToggle('HDR Support')}
              ${this.renderToggle('Blue Light Filter')}
              ${this.renderToggle('Auto-Brightness')}
            ` : activeTab === 'Network' ? `
              <div style="padding:16px;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:6px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
                <div style="font-size:24px;">🌐</div>
                <div>
                  <div style="color:#00ff88;font-weight:700;font-size:13px;margin-bottom:4px;">Connected (Quantum Link)</div>
                  <div style="color:rgba(255,255,255,0.5);font-size:10px;font-family:'Share Tech Mono',monospace;">IP: 10.0.0.1 • 1.2 Tbps • Ping: 0.04ms</div>
                </div>
              </div>
              <div style="margin-bottom:20px;">
                ${this.renderToggle('Wi-Fi 8 (Orbital)', true)}
                ${this.renderToggle('Bluetooth 7.0', btEnabled, 'bt-toggle')}
                ${this.renderToggle('VPN Layer')}
              </div>
              <button style="padding:8px 16px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;font-size:12px;cursor:pointer;">Network Diagnostics</button>
            ` : activeTab === 'Sound' ? `
              <div style="margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                  <span style="font-size:12px;color:rgba(255,255,255,0.5);">Master Volume</span>
                  <span style="font-size:12px;color:#fff;" id="vol-text">${volume}%</span>
                </div>
                <input id="vol-slider" type="range" style="width:100%;accent-color:#bf5fff;cursor:pointer;" min="0" max="100" value="${volume}">
              </div>
              <div style="margin-bottom:24px;padding:16px;background:rgba(0,0,0,0.4);border:1px solid rgba(191,95,255,0.2);border-radius:6px;">
                <div style="font-size:12px;color:#bf5fff;font-weight:700;margin-bottom:12px;">Test Audio output</div>
                <button id="test-audio" style="padding:8px 24px;background:rgba(191,95,255,0.2);border:1px solid #bf5fff;color:#fff;border-radius:4px;cursor:pointer;font-weight:700;letter-spacing:1px;transition:all 0.2s;">▶ PLAY TEST TONE</button>
              </div>
              ${this.renderToggle('Spatial Audio')}
              ${this.renderToggle('Noise Cancellation', true)}
            ` : activeTab === 'Personalization' ? `
              <div style="margin-bottom:20px;">
                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Theme</div>
                <div style="display:flex;gap:12px;">
                  <div style="width:80px;height:50px;background:#111;border:2px solid #00e5ff;border-radius:6px;cursor:pointer;position:relative;">
                    <div style="position:absolute;bottom:4px;width:100%;text-align:center;font-size:10px;color:#fff;">Dark</div>
                  </div>
                  <div style="width:80px;height:50px;background:#eee;border:1px solid rgba(255,255,255,0.2);border-radius:6px;cursor:pointer;position:relative;">
                    <div style="position:absolute;bottom:4px;width:100%;text-align:center;font-size:10px;color:#000;">Light</div>
                  </div>
                </div>
              </div>
              <div style="margin-bottom:20px;">
                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:12px;">Accent Color</div>
                <div style="display:flex;gap:10px;">
                  ${['#00e5ff','#bf5fff','#ff2d78','#ffd000','#00ff88'].map(c => `<div style="width:24px;height:24px;border-radius:50%;background:${c};cursor:pointer;${c==='#00e5ff'?'box-shadow:0 0 0 2px #111, 0 0 0 4px #00e5ff;':''}"></div>`).join('')}
                </div>
              </div>
              ${this.renderToggle('Window Glassmorphism', true)}
              ${this.renderToggle('Dynamic Taskbar', true)}
            ` : activeTab === 'Security' ? `
              <div style="text-align:center;padding:30px 0;">
                <div style="font-size:40px;margin-bottom:15px;">🛡️</div>
                <div style="font-size:16px;color:#00ff88;font-weight:700;margin-bottom:5px;">System Secure</div>
                <div style="font-size:10px;color:rgba(255,255,255,0.3);">Last scan: 2 minutes ago</div>
                <button style="margin-top:20px;padding:8px 24px;background:rgba(0,255,136,0.1);border:1px solid #00ff88;color:#00ff88;border-radius:4px;cursor:pointer;">Run Quick Scan</button>
              </div>
              ${this.renderToggle('Real-time Protection', true)}
              ${this.renderToggle('Firewall')}
              ${this.renderToggle('Zero-Trust Architecture', true)}
            ` : activeTab === 'AI Core' ? `
               <div style="padding:16px;background:rgba(255,45,120,0.05);border:1px solid rgba(255,45,120,0.2);border-radius:6px;margin-bottom:20px;">
                 <div style="font-size:11px;color:#ff2d78;margin-bottom:8px;font-weight:700;">KEVIN NEURAL NETWORK</div>
                 <div style="font-size:10px;color:rgba(255,255,255,0.6);margin-bottom:4px;">Status: <span style="color:#00ff88;">Learning</span></div>
                 <div style="font-size:10px;color:rgba(255,255,255,0.6);margin-bottom:4px;">Parameters: 175 Billion</div>
                 <div style="font-size:10px;color:rgba(255,255,255,0.6);">Mode: Aggressive Optimization</div>
               </div>
               <div style="margin-bottom:24px;">
                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:8px;">Autonomy Level</div>
                <input type="range" style="width:100%;accent-color:#ff2d78;cursor:pointer;" min="0" max="3" value="2">
                <div style="display:flex;justify-content:space-between;font-size:9px;color:rgba(255,255,255,0.3);margin-top:4px;"><span>Manual</span><span>Assist</span><span>Semi-Auto</span><span>Full AGI</span></div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      // Bind Tab clicks
      c.querySelectorAll('.sett-tab').forEach(el => el.addEventListener('click', () => { activeTab = el.dataset.tab; render(); }));
      // Bind Perf Mode clicks
      c.querySelectorAll('.sett-perf').forEach(el => el.addEventListener('click', () => { perfMode = el.dataset.m; render(); }));
      // Bind Toggles
      c.querySelectorAll('.sett-tgl').forEach(el => el.addEventListener('click', () => {
        const i = el.querySelector('.tgl-inner');
        if (i.style.left === '22px') { i.style.left = '2px'; el.style.background = 'rgba(255,255,255,0.1)'; }
        else { i.style.left = '22px'; el.style.background = 'rgba(0,229,255,0.3)'; }
      }));
      // Sound logic
      const vSlider = c.querySelector('#vol-slider');
      if (vSlider) {
        vSlider.addEventListener('input', (e) => { volume = e.target.value; c.querySelector('#vol-text').textContent = volume+'%'; });
      }
      const testAudio = c.querySelector('#test-audio');
      if (testAudio) {
        testAudio.addEventListener('click', () => {
          testAudio.textContent = '🔊 PLAYING...'; testAudio.style.background = 'rgba(191,95,255,0.4)';
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.type = 'sine'; osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(volume/100, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
          osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 1);
          setTimeout(() => { testAudio.textContent = '▶ PLAY TEST TONE'; testAudio.style.background = 'rgba(191,95,255,0.2)'; }, 1000);
        });
      }
    };
    render();
  }

  renderToggle(label, active = true, id = '') {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:12px;color:rgba(255,255,255,0.7);">${label}</span>
        <div class="sett-tgl" ${id?'id="'+id+'"':''} style="width:44px;height:24px;background:${active?'rgba(0,229,255,0.3)':'rgba(255,255,255,0.1)'};border-radius:12px;cursor:pointer;position:relative;transition:background 0.2s;">
          <div class="tgl-inner" style="width:20px;height:20px;background:#fff;border-radius:50%;position:absolute;top:2px;left:${active?'22px':'2px'};transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>
        </div>
      </div>
    `;
  }

  // ═══ MATERIAL ANALYSIS ═══
  openAnalysis() {
    const win = this.createWindow('Material Analysis | KEVLAR FOCUS', '🔬', 800, 560, '', { app: 'analysis' });
    let t = 0;
    const render = () => {
      t += 0.05;
      if (!document.getElementById(`win-${win.id}`)) return; // closed
      
      const p1 = []; const p2 = []; const p3 = [];
      for(let i=0; i<100; i++) {
        p1.push(`${i},${100 - (40 + Math.sin(t*2+i*0.1)*10)}`);
        p2.push(`${i},${100 - (30 + Math.sin(t*1.5+i*0.05)*15)}`);
        p3.push(`${i},${100 - (20 + Math.cos(t*3+i*0.15)*8)}`);
      }

      win.content.innerHTML = `
        <div style="padding:20px;height:100%;overflow-y:auto;display:flex;flex-direction:column;gap:20px;background:radial-gradient(circle at 50% 0%, rgba(0,229,255,0.05), transparent 70%);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:24px;color:#fff;font-weight:700;letter-spacing:1px;text-shadow:0 0 10px rgba(0,229,255,0.5);">QUANTUM TENSOR ANALYSIS</div>
              <div style="font-size:10px;color:#00e5ff;letter-spacing:4px;font-family:'Share Tech Mono',monospace;">REAL-TIME STRUCTURE SIMULATION</div>
            </div>
            <div style="position:relative;width:60px;height:60px;perspective:100px;">
              <div style="position:absolute;inset:0;border:2px solid #ffaa00;transform:rotateX(60deg) rotateZ(${t*25}deg);transform-style:preserve-3d;box-shadow:0 0 20px #ffaa00;">
                <div style="position:absolute;inset:5px;border:1px dashed #00e5ff;transform:translateZ(10px) rotateZ(-${t*40}deg);box-shadow:0 0 10px #00e5ff;"></div>
                <div style="position:absolute;inset:10px;border:1px solid #ff2d78;transform:translateZ(20px) rotateZ(${t*60}deg);box-shadow:0 0 10px #ff2d78;"></div>
              </div>
            </div>
          </div>
          
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:15px;">
            <div class="anlz-card" style="background:rgba(255,170,0,0.05);border:1px solid rgba(255,170,0,0.2);border-radius:6px;padding:15px;position:relative;overflow:hidden;">
              <div class="scan-line" style="position:absolute;left:0;top:-100%;width:100%;height:5px;background:rgba(255,170,0,0.5);box-shadow:0 0 10px #ffaa00;animation:scan 2s infinite;"></div>
              <div style="font-size:10px;color:#ffaa00;letter-spacing:2px;margin-bottom:10px;">IMPACT TOLERANCE</div>
              <div style="font-size:32px;font-family:'Share Tech Mono',monospace;color:#fff;text-shadow:0 0 10px #ffaa00;">${(98.7+Math.sin(t)*0.2).toFixed(2)}%</div>
              <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:5px;">OPTIMAL EFFICIENCY</div>
            </div>
            <div class="anlz-card" style="background:rgba(0,229,255,0.05);border:1px solid rgba(0,229,255,0.2);border-radius:6px;padding:15px;position:relative;overflow:hidden;">
              <div class="scan-line" style="position:absolute;left:0;top:-100%;width:100%;height:5px;background:rgba(0,229,255,0.5);box-shadow:0 0 10px #00e5ff;animation:scan 2s infinite 0.5s;"></div>
              <div style="font-size:10px;color:#00e5ff;letter-spacing:2px;margin-bottom:10px;">SHEAR MODULUS</div>
              <div style="font-size:32px;font-family:'Share Tech Mono',monospace;color:#fff;text-shadow:0 0 10px #00e5ff;">${(112 - Math.cos(t)*0.5).toFixed(1)} <span style="font-size:16px;">GPa</span></div>
              <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:5px;">MICRO-FRACTURE: 0.00%</div>
            </div>
            <div class="anlz-card" style="background:rgba(255,45,120,0.05);border:1px solid rgba(255,45,120,0.2);border-radius:6px;padding:15px;position:relative;overflow:hidden;">
              <div class="scan-line" style="position:absolute;left:0;top:-100%;width:100%;height:5px;background:rgba(255,45,120,0.5);box-shadow:0 0 10px #ff2d78;animation:scan 2s infinite 1.0s;"></div>
              <div style="font-size:10px;color:#ff2d78;letter-spacing:2px;margin-bottom:10px;">THERMAL DELTA</div>
              <div style="font-size:32px;font-family:'Share Tech Mono',monospace;color:#fff;text-shadow:0 0 10px #ff2d78;">${(124 + Math.sin(t*3)*5).toFixed(1)}°C</div>
              <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:5px;">WITHIN TOLERANCE</div>
            </div>
            <div class="anlz-card" style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);border-radius:6px;padding:15px;position:relative;overflow:hidden;">
              <div class="scan-line" style="position:absolute;left:0;top:-100%;width:100%;height:5px;background:rgba(0,255,136,0.5);box-shadow:0 0 10px #00ff88;animation:scan 2s infinite 1.5s;"></div>
              <div style="font-size:10px;color:#00ff88;letter-spacing:2px;margin-bottom:10px;">STRUCTURAL INT.</div>
              <div style="font-size:32px;font-family:'Share Tech Mono',monospace;color:#fff;text-shadow:0 0 10px #00ff88;">100%</div>
              <div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:5px;">NO ANOMALIES DETECTED</div>
            </div>
          </div>

          <div style="display:flex;gap:20px;flex:1;">
            <div style="flex:2;background:rgba(0,0,0,0.4);border:1px solid rgba(0,229,255,0.2);border-radius:6px;padding:15px;position:relative;overflow:hidden;box-shadow:inset 0 0 40px rgba(0,229,255,0.05);">
              <div style="position:absolute;top:0;left:0;bottom:0;width:30px;background:linear-gradient(90deg,rgba(0,229,255,0.1),transparent);"></div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;position:relative;z-index:2;">
                <div style="font-size:11px;color:#00e5ff;letter-spacing:2px;font-weight:700;">MULTIVARIATE STRAIN WAVEFORM</div>
                <div style="font-size:10px;color:#ffaa00;font-family:'Share Tech Mono';">T+${(t).toFixed(2)}s</div>
              </div>
              
              <svg width="100%" height="calc(100% - 30px)" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;position:relative;z-index:1;filter:drop-shadow(0 0 6px rgba(0,229,255,0.6));">
                <!-- Grid -->
                ${Array(10).fill(0).map((_,i) => `<line x1="0" y1="${i*10}" x2="100" y2="${i*10}" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>`).join('')}
                ${Array(10).fill(0).map((_,i) => `<line x1="${i*10}" y1="0" x2="${i*10}" y2="100" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>`).join('')}
                
                <!-- Waves -->
                <polyline points="0,100 ${p3.join(' ')} 100,100" fill="rgba(255,45,120,0.15)" stroke="#ff2d78" stroke-width="0.8" />
                <polyline points="0,100 ${p2.join(' ')} 100,100" fill="rgba(0,255,136,0.15)" stroke="#00ff88" stroke-width="1.2" />
                <polyline points="0,100 ${p1.join(' ')} 100,100" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="2.5" />
                
                <!-- Scanner line -->
                <line x1="${(t*20)%100}" y1="0" x2="${(t*20)%100}" y2="100" stroke="#fff" stroke-width="1" />
                <rect x="${(t*20)%100 - 10}" y="0" width="10" height="100" fill="url(#scannerGrad-${Math.floor(t)})" />
                <defs>
                  <linearGradient id="scannerGrad-${Math.floor(t)}" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="transparent" />
                    <stop offset="100%" stop-color="rgba(0,229,255,0.5)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
              <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;">EVENT STREAM</div>
              <div class="anlz-log" style="flex:1;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:12px;font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(0,255,136,0.8);overflow:hidden;display:flex;flex-direction:column;gap:6px;position:relative;">
                <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,0.15) 0px,rgba(0,0,0,0.15) 1px,transparent 1px,transparent 2px);pointer-events:none;z-index:10;"></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;color:#fff;"><span>[SYS]</span><span>INITIALIZING...</span></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;color:#00e5ff;"><span>[MEM]</span><span>ALLOCATING 1.2 PB</span></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;color:#ffaa00;"><span>[SCN]</span><span>KEVLAR L4 LOCK</span></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;"><span>[VAL]</span><span>DEFLECTION: 99.8%</span></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;"><span>[VAL]</span><span>PENETRATION: 0.0%</span></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;color:#ff2d78;"><span>[WRN]</span><span>THERMAL SPIKE @ 120°C</span></div>
                <div style="display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,0.1);padding-bottom:4px;"><span>[SYS]</span><span>ABSORPTION OPTIMAL</span></div>
                <div style="margin-top:auto;color:#111;background:#00e5ff;padding:4px;text-align:center;font-weight:bold;">> MONITORING <span style="opacity:${Math.floor(t*4)%2===0?1:0}">_</span></div>
              </div>
            </div>
          </div>
        </div>
        <style>
          @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
          .anlz-card { transition: all 0.3s; }
          .anlz-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.1); }
        </style>
      `;
      requestAnimationFrame(render);
    };
    render();
  }

  // ═══ MUSIC PLAYER ═══
  openMusicPlayer() {
    const winEl = this.createWindow('Music Player', '🎵', 380, 460, '', { app: 'music' });
    let playing = false;
    let currentTrack = 0;
    let progress = 0;
    let progressInterval = null;

    // Custom audio player logic
    const audio = new Audio();
    audio.volume = window.KevinSystemVolume ? (window.KevinSystemVolume / 100) : 0.8;
    winEl.audioObject = audio; // Attach so it can be cleaned up if window closes

    const tracks = [
      { title: 'SomaFM - Def Con', artist: 'Cyberpunk Stream', duration: 'LIVE', url: 'https://icecast.somafm.com/defcon-128-mp3' },
      { title: 'SomaFM - Drone Zone', artist: 'Atmospheric', duration: 'LIVE', url: 'https://icecast.somafm.com/dronezone-128-mp3' },
      { title: 'SomaFM - Groove Salad', artist: 'Chillout', duration: 'LIVE', url: 'https://icecast.somafm.com/groovesalad-128-mp3' },
      { title: 'SomaFM - Space Station', artist: 'Ambient', duration: 'LIVE', url: 'https://icecast.somafm.com/spacestation-128-mp3' },
      { title: 'SomaFM - The Trip', artist: 'Trance / Techno', duration: 'LIVE', url: 'https://icecast.somafm.com/thetrip-128-mp3' }
    ];

    const render = () => {
      const track = tracks[currentTrack];
      winEl.content.innerHTML = `
        <div style="padding:16px;height:100%;display:flex;flex-direction:column;">
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;">
            <div style="
              width:140px;height:140px;border-radius:50%;
              background:conic-gradient(from ${progress * 3.6}deg, #00e5ff, #bf5fff, #ff4080, #ffaa00, #00e5ff);
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 0 40px rgba(0,229,255,0.2);
              transition:transform 0.3s;
              ${playing ? 'animation:spin-disc 4s linear infinite;' : ''}
            ">
              <div style="width:50px;height:50px;border-radius:50%;background:rgba(12,16,28,0.95);display:flex;align-items:center;justify-content:center;">
                <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.2);"></div>
              </div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:16px;color:#fff;font-weight:500;">${track.title}</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">${track.artist}</div>
            </div>
          </div>

          <div style="padding:0 8px;">
            <div style="display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;margin-bottom:4px;">
              <span>${Math.floor(progress * 0.042)}:${String(Math.floor(progress * 2.5) % 60).padStart(2, '0')}</span>
              <span>${track.duration}</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;cursor:pointer;margin-bottom:16px;">
              <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,#00e5ff,#bf5fff);border-radius:2px;transition:width 0.3s;"></div>
            </div>

            <div style="display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:16px;">
              <div class="player-btn" data-action="prev" style="font-size:18px;cursor:pointer;opacity:0.5;transition:all 0.15s;">⏮</div>
              <div class="player-btn" data-action="play" style="
                width:50px;height:50px;border-radius:50%;
                background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.3);
                display:flex;align-items:center;justify-content:center;
                font-size:20px;cursor:pointer;transition:all 0.15s;
              ">${playing ? '⏸' : '▶'}</div>
              <div class="player-btn" data-action="next" style="font-size:18px;cursor:pointer;opacity:0.5;transition:all 0.15s;">⏭</div>
            </div>
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:8px;max-height:120px;overflow-y:auto;">
            ${tracks.map((t, i) => `
              <div class="track-item" data-idx="${i}" style="
                display:flex;align-items:center;gap:10px;padding:6px 10px;
                border-radius:4px;cursor:pointer;transition:background 0.15s;
                ${i === currentTrack ? 'background:rgba(0,229,255,0.08);' : ''}
              ">
                <span style="font-size:14px;">${i === currentTrack && playing ? '🔊' : '🎵'}</span>
                <div style="flex:1;">
                  <div style="font-size:11px;color:${i === currentTrack ? '#00e5ff' : 'rgba(255,255,255,0.7)'};">${t.title}</div>
                  <div style="font-size:9px;color:rgba(255,255,255,0.3);">${t.artist}</div>
                </div>
                <span style="font-size:10px;color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;">${t.duration}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <style>
          @keyframes spin-disc { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        </style>
      `;

      // Event handlers
      winEl.content.querySelectorAll('.player-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => { btn.style.opacity = '1'; btn.style.transform = 'scale(1.1)'; });
        btn.addEventListener('mouseleave', () => { btn.style.opacity = btn.dataset.action === 'play' ? '1' : '0.5'; btn.style.transform = 'scale(1)'; });
        btn.addEventListener('click', () => {
          if (btn.dataset.action === 'play') {
            playing = !playing;
            if (playing) {
              if (audio.src !== tracks[currentTrack].url) {
                audio.src = tracks[currentTrack].url;
              }
              audio.play().catch(e => console.error("Audio block:", e));
              progressInterval = setInterval(() => {
                progress = (progress + 0.5) % 100;
              }, 500);
            } else {
              audio.pause();
              clearInterval(progressInterval);
            }
            render();
          } else if (btn.dataset.action === 'next') {
            currentTrack = (currentTrack + 1) % tracks.length;
            progress = 0;
            if (playing) { audio.src = tracks[currentTrack].url; audio.play(); }
            render();
          } else if (btn.dataset.action === 'prev') {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            progress = 0;
            if (playing) { audio.src = tracks[currentTrack].url; audio.play(); }
            render();
          }
        });
      });

      winEl.content.querySelectorAll('.track-item').forEach(ti => {
        ti.addEventListener('mouseenter', () => { if (ti.dataset.idx != currentTrack) ti.style.background = 'rgba(255,255,255,0.04)'; });
        ti.addEventListener('mouseleave', () => { if (ti.dataset.idx != currentTrack) ti.style.background = 'transparent'; });
        ti.addEventListener('click', () => {
          currentTrack = parseInt(ti.dataset.idx);
          progress = 0;
          playing = true;
          audio.src = tracks[currentTrack].url;
          audio.play().catch(e => console.error(e));
          render();
        });
      });
    };

    render();
  }

  // ═══ IMAGE VIEWER ═══
  openImageViewer() {
    this.openImageViewerWithFile('Image Gallery');
  }

  openImageViewerWithFile(name) {
    const win = this.createWindow(`Image Viewer — ${name}`, '🖼️', 550, 420, '', { app: 'imageviewer' });

    // Generate procedural "images" using canvas
    const generateImage = (type) => {
      const c = document.createElement('canvas');
      c.width = 400; c.height = 300;
      const ctx = c.getContext('2d');

      if (type === 0) {
        // Steel microstructure
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 400, 300);
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * 400, y = Math.random() * 300;
          const r = 5 + Math.random() * 20;
          ctx.strokeStyle = `rgba(66,165,245,${0.1 + Math.random() * 0.3})`;
          ctx.lineWidth = 0.5 + Math.random();
          ctx.beginPath();
          ctx.moveTo(x, y);
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2;
            ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else if (type === 1) {
        // Kevlar fiber scan
        ctx.fillStyle = '#1a1400';
        ctx.fillRect(0, 0, 400, 300);
        for (let i = 0; i < 80; i++) {
          const y = i * 4;
          ctx.strokeStyle = `rgba(255,170,0,${0.2 + Math.random() * 0.4})`;
          ctx.lineWidth = 1 + Math.random() * 2;
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x < 400; x += 10) {
            ctx.lineTo(x, y + Math.sin(x * 0.1 + i) * 3);
          }
          ctx.stroke();
        }
      } else {
        // Aluminum crystal
        ctx.fillStyle = '#001218';
        ctx.fillRect(0, 0, 400, 300);
        for (let i = 0; i < 30; i++) {
          const cx = Math.random() * 400, cy = Math.random() * 300;
          const r = 20 + Math.random() * 40;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, `rgba(0,229,255,${0.2 + Math.random() * 0.3})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      return c.toDataURL();
    };

    const images = [
      { name: 'Steel Microstructure', src: generateImage(0) },
      { name: 'Kevlar Fiber Scan', src: generateImage(1) },
      { name: 'Aluminum Crystal', src: generateImage(2) },
    ];

    let currentImg = 0;

    const render = () => {
      win.content.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;background:#0a0e18;">
          <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
            <img src="${images[currentImg].src}" style="max-width:95%;max-height:95%;object-fit:contain;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,0.5);" />
            <div style="position:absolute;left:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:24px;opacity:0.4;transition:opacity 0.15s;padding:10px;" 
              onmouseenter="this.style.opacity='0.9'" onmouseleave="this.style.opacity='0.4'" 
              onclick="this.dispatchEvent(new CustomEvent('nav',{bubbles:true,detail:'prev'}))">◀</div>
            <div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:24px;opacity:0.4;transition:opacity 0.15s;padding:10px;" 
              onmouseenter="this.style.opacity='0.9'" onmouseleave="this.style.opacity='0.4'"
              onclick="this.dispatchEvent(new CustomEvent('nav',{bubbles:true,detail:'next'}))">▶</div>
          </div>
          <div style="padding:10px 16px;border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:12px;color:rgba(255,255,255,0.7);">${images[currentImg].name}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;">${currentImg + 1}/${images.length}</div>
          </div>
          <div style="padding:6px 16px 10px;display:flex;gap:6px;justify-content:center;">
            ${images.map((img, i) => `
              <div style="width:50px;height:38px;border-radius:3px;overflow:hidden;cursor:pointer;
                border:2px solid ${i === currentImg ? '#00e5ff' : 'rgba(255,255,255,0.1)'};transition:border-color 0.15s;"
                data-idx="${i}">
                <img src="${img.src}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Thumbnail click
      win.content.querySelectorAll('[data-idx]').forEach(thumb => {
        thumb.addEventListener('click', () => {
          currentImg = parseInt(thumb.dataset.idx);
          render();
        });
      });

      // Navigation
      win.content.addEventListener('nav', (e) => {
        if (e.detail === 'prev') currentImg = (currentImg - 1 + images.length) % images.length;
        else currentImg = (currentImg + 1) % images.length;
        render();
      });
    };

    render();
  }

  // ═══ NETWORK ═══
  openNetwork() {
    const win = this.createWindow('Network Monitor', '🌐', 550, 380, `
      <div style="padding:16px;height:100%;overflow-y:auto;">
        <div style="font-size:16px;color:#fff;margin-bottom:16px;font-weight:300;">Network Connections</div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div style="background:rgba(0,255,136,0.04);border:1px solid rgba(0,255,136,0.1);border-radius:6px;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="color:#00ff88;font-size:11px;">▲ UPLOAD</span>
              <span style="color:#00ff88;font-size:18px;font-weight:bold;font-family:'Orbitron',monospace;">247 Mb/s</span>
            </div>
            <div style="height:40px;background:rgba(0,0,0,0.2);border-radius:3px;overflow:hidden;">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;"><polyline points="${Array(50).fill(0).map((_, i) => `${i*2},${20 + Math.sin(i * 0.5) * 15 + Math.random() * 5}`).join(' ')}" fill="none" stroke="#00ff88" stroke-width="0.8"/></svg>
            </div>
          </div>
          <div style="background:rgba(0,229,255,0.04);border:1px solid rgba(0,229,255,0.1);border-radius:6px;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="color:#00e5ff;font-size:11px;">▼ DOWNLOAD</span>
              <span style="color:#00e5ff;font-size:18px;font-weight:bold;font-family:'Orbitron',monospace;">891 Mb/s</span>
            </div>
            <div style="height:40px;background:rgba(0,0,0,0.2);border-radius:3px;overflow:hidden;">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;"><polyline points="${Array(50).fill(0).map((_, i) => `${i*2},${20 + Math.cos(i * 0.3) * 12 + Math.random() * 8}`).join(' ')}" fill="none" stroke="#00e5ff" stroke-width="0.8"/></svg>
            </div>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:6px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:1fr 120px 80px 60px;padding:8px 12px;background:rgba(255,255,255,0.03);font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;">
            <span>HOST</span><span>IP ADDRESS</span><span>LATENCY</span><span>STATUS</span>
          </div>
          ${[
            { host: 'quantum-server.kevin.lab', ip: '10.0.0.1', latency: '0.04ms', status: '🟢' },
            { host: 'neural-cluster-01', ip: '10.0.1.10', latency: '0.12ms', status: '🟢' },
            { host: 'sensor-array-main', ip: '10.0.2.1', latency: '0.08ms', status: '🟢' },
            { host: 'storage-pool-01', ip: '10.0.3.100', latency: '0.23ms', status: '🟢' },
            { host: 'backup-server', ip: '10.0.4.50', latency: '1.2ms', status: '🟡' },
            { host: 'external-gateway', ip: '192.168.1.1', latency: '3.8ms', status: '🟢' },
          ].map(h => `
            <div style="display:grid;grid-template-columns:1fr 120px 80px 60px;padding:6px 12px;border-top:1px solid rgba(255,255,255,0.02);font-size:11px;transition:background 0.15s;cursor:default;"
              onmouseenter="this.style.background='rgba(0,229,255,0.04)'"
              onmouseleave="this.style.background='transparent'">
              <span style="color:rgba(255,255,255,0.8);overflow:hidden;text-overflow:ellipsis;">${h.host}</span>
              <span style="color:rgba(0,229,255,0.6);font-family:'Share Tech Mono',monospace;">${h.ip}</span>
              <span style="color:rgba(255,255,255,0.5);font-family:'Share Tech Mono',monospace;">${h.latency}</span>
              <span style="text-align:center;">${h.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `, { app: 'network' });
  }

  // ═══ RECYCLE BIN ═══
  openRecycleBin() {
    const win = this.createWindow('Recycle Bin', '🗑️', 400, 300, `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;opacity:0.4;">
        <div style="font-size:64px;">🗑️</div>
        <div style="font-size:14px;color:rgba(255,255,255,0.5);">Recycle Bin is empty</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.2);">Deleted files will appear here</div>
      </div>
    `, { app: 'recycle' });
  }

  // ═══ ABOUT ═══
  openAbout() {
    const win = this.createWindow('About KEVIN OS', '❓', 400, 350, `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;padding:30px;">
        <div style="font-size:56px;filter:drop-shadow(0 0 20px rgba(0,229,255,0.3));">⬡</div>
        <div style="font-family:'Orbitron',monospace;font-size:20px;color:#00e5ff;letter-spacing:6px;">KEVIN OS</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.3);font-family:'Share Tech Mono',monospace;">Version 4.2.1 (Build 20260408)</div>
        <div style="width:200px;height:1px;background:linear-gradient(90deg,transparent,rgba(0,229,255,0.2),transparent);margin:8px 0;"></div>
        <div style="text-align:center;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.8;">
          © 2026 KEVIN Robotics<br>
          All rights reserved.<br><br>
          Quantum Kernel v3<br>
          Neural FPGA x16 Architecture<br>
          AI Core Accuracy: 99.7%
        </div>
      </div>
    `, { app: 'about' });
  }

  // ═══ BACKGROUND ANIMATION ═══
  startBackgroundAnimation() {
    const canvas = this.bgCanvas;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 1920;
      canvas.height = canvas.parentElement?.offsetHeight || 1080;
    };
    resize();

    const ctx = canvas.getContext('2d');
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    const animBg = () => {
      if (!document.getElementById('desktop-bg-canvas')) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(0,229,255,${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(0,229,255,${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animBg);
    };

    animBg();
  }

  // ═══ CLOCK ═══
  startClock() {
    const updateClock = () => {
      const clock = document.getElementById('taskbar-clock');
      if (!clock) return;
      const now = new Date();
      clock.innerHTML = `
        <div>${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div style="font-size:10px;opacity:0.5;">${now.toLocaleDateString()}</div>
      `;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ═══ SYSTEM ANIMATIONS ═══
  startSystemAnimations() {
    // Periodic notifications
    const sysMessages = [
      { title: 'Sensor Array', msg: 'All 16 channels calibrated and nominal.', icon: '📡' },
      { title: 'Material Scan', msg: 'New scan data available for review.', icon: '🔬' },
      { title: 'AI Training', msg: 'Epoch 1247 complete. Loss: 0.0023', icon: '🧠' },
      { title: 'Security', msg: 'No threats detected. Firewall active.', icon: '🛡️' },
      { title: 'Backup', msg: 'Incremental backup completed successfully.', icon: '💾' },
    ];

    let notifIdx = 0;
    setInterval(() => {
      if (!this.bootComplete) return;
      const msg = sysMessages[notifIdx % sysMessages.length];
      this.showNotification(msg.title, msg.msg, msg.icon);
      notifIdx++;
    }, 15000);
  }

  // ═══ MATERIAL HISTORY ═══
  openMaterialHistory() {
    const win = this.createWindow('Material History', '📜', 780, 540);
    const c = win.content;
    const events = [
      { year: '3300 BC', title: 'Bronze Age Begins', desc: 'Copper-tin alloys revolutionize tools and weapons across civilizations.', color: '#cd7f32', icon: '⚔️', cat: 'Metal', detail: 'Bronze (Cu+Sn) replaced stone tools. Hardness: ~3.5 Mohs. First deliberate alloy in human history.' },
      { year: '1200 BC', title: 'Iron Age', desc: 'Smelting iron ores produces stronger, more durable metals.', color: '#a8a8a8', icon: '🔨', cat: 'Metal', detail: 'Wrought iron: 250 MPa tensile. Required 1538°C smelting. Revolutionized agriculture and warfare.' },
      { year: '1856', title: 'Bessemer Process', desc: 'Mass production of steel transforms industry forever.', color: '#4a90d9', icon: '🏭', cat: 'Metal', detail: 'Blowing air through molten pig iron. Reduced cost from £40/ton to £6/ton. Enabled skyscrapers and railways.' },
      { year: '1886', title: 'Hall-Héroult Process', desc: 'Electrolytic reduction makes aluminum commercially viable.', color: '#ff5588', icon: '⚡', cat: 'Metal', detail: 'Aluminum was more expensive than gold before this. Process uses cryolite bath at 960°C. Density: 2.7 g/cm³.' },
      { year: '1935', title: 'Nylon Invented', desc: 'DuPont creates the first fully synthetic fiber.', color: '#aa55ff', icon: '🧵', cat: 'Polymer', detail: 'Wallace Carothers at DuPont. Polyamide 6,6. Tensile: 75 MPa. First used in toothbrush bristles, then stockings.' },
      { year: '1938', title: 'Fiberglass Developed', desc: 'Glass fibers in resin matrix create lightweight composites.', color: '#44cc88', icon: '🔬', cat: 'Composite', detail: 'E-glass fibers: 3.45 GPa tensile. Used in boats, aircraft, automotive. Density: 2.5 g/cm³.' },
      { year: '1965', title: 'Kevlar Synthesized', desc: 'Stephanie Kwolek discovers poly-paraphenylene terephthalamide.', color: '#ffd000', icon: '🛡️', cat: 'Polymer', detail: 'Kevlar 49: 3620 MPa tensile, 5× stronger than steel by weight. Used in body armor, tires, aerospace.' },
      { year: '1991', title: 'Carbon Nanotubes', desc: 'Sumio Iijima observes multi-walled carbon nanotubes via TEM.', color: '#00e5ff', icon: '🔬', cat: 'Nano', detail: 'Theoretical tensile: 63 GPa. Young modulus: ~1 TPa. Diameter: 1-100nm. 200× stronger than steel.' },
      { year: '2004', title: 'Graphene Isolated', desc: 'Geim & Novoselov isolate single-layer graphene.', color: '#00ff88', icon: '🏆', cat: 'Nano', detail: 'Nobel Prize 2010. Tensile: 130 GPa (strongest material). Conducts electricity better than copper. 1 atom thick.' },
      { year: '2023', title: 'AI-Designed Alloys', desc: 'Machine learning discovers novel high-entropy alloys.', color: '#ff4444', icon: '🤖', cat: 'AI', detail: 'GNoME by DeepMind: 2.2 million new crystal structures. Multi-principal element alloys with unprecedented properties.' },
    ];
    let activeFilter = 'All';
    let expandedIdx = -1;
    const cats = ['All','Metal','Polymer','Composite','Nano','AI'];
    const renderTimeline = () => {
      const filtered = activeFilter === 'All' ? events : events.filter(e => e.cat === activeFilter);
      c.innerHTML = `<div style="padding:14px;height:100%;overflow-y:auto;background:linear-gradient(180deg,rgba(0,10,20,0.97),rgba(5,5,15,0.99));">
        <div style="text-align:center;margin-bottom:12px;">
          <div style="font-size:16px;font-weight:700;color:#00e5ff;letter-spacing:4px;text-shadow:0 0 20px rgba(0,229,255,0.4);animation:pulseGlow 2s ease-in-out infinite alternate;">MATERIAL SCIENCE TIMELINE</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:3px;letter-spacing:2px;">${filtered.length} BREAKTHROUGHS • 5000+ YEARS</div>
        </div>
        <div style="display:flex;gap:4px;justify-content:center;margin-bottom:14px;flex-wrap:wrap;">
          ${cats.map(cat => `<button class="tl-cat" data-cat="${cat}" style="padding:4px 12px;font-size:9px;border:1px solid ${cat === activeFilter ? '#00e5ff' : 'rgba(255,255,255,0.1)'};background:${cat === activeFilter ? 'rgba(0,229,255,0.15)' : 'transparent'};color:${cat === activeFilter ? '#00e5ff' : 'rgba(255,255,255,0.5)'};border-radius:12px;cursor:pointer;letter-spacing:1px;transition:all 0.3s;font-family:'Share Tech Mono',monospace;">${cat}</button>`).join('')}
        </div>
        <div style="position:relative;padding-left:40px;">
          <div style="position:absolute;left:18px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#00e5ff,#ffd000,#ff2d78,#00ff88);opacity:0.25;"></div>
          ${filtered.map((e, i) => `
            <div class="tl-evt" data-idx="${events.indexOf(e)}" style="margin-bottom:12px;opacity:0;transform:translateX(-20px);animation:tlSlide 0.4s ${i * 0.08}s forwards;cursor:pointer;transition:transform 0.2s;">
              <div style="position:absolute;left:-28px;width:16px;height:16px;border-radius:50%;background:${e.color};box-shadow:0 0 12px ${e.color}80;display:flex;align-items:center;justify-content:center;font-size:9px;transition:transform 0.3s,box-shadow 0.3s;">${e.icon}</div>
              <div style="background:rgba(${parseInt(e.color.slice(1,3),16)},${parseInt(e.color.slice(3,5),16)},${parseInt(e.color.slice(5,7),16)},0.05);border:1px solid ${e.color}22;padding:10px 14px;border-radius:6px;transition:all 0.3s;${expandedIdx === events.indexOf(e) ? 'border-color:' + e.color + '66;background:rgba(' + parseInt(e.color.slice(1,3),16) + ',' + parseInt(e.color.slice(3,5),16) + ',' + parseInt(e.color.slice(5,7),16) + ',0.1);' : ''}">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                  <span style="font-size:11px;font-weight:700;color:${e.color};text-shadow:0 0 8px ${e.color};">${e.title}</span>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="font-size:7px;padding:2px 6px;border-radius:8px;background:${e.color}15;color:${e.color};border:1px solid ${e.color}30;">${e.cat}</span>
                    <span style="font-size:9px;color:rgba(255,255,255,0.35);font-family:'Share Tech Mono',monospace;">${e.year}</span>
                  </div>
                </div>
                <div style="font-size:10px;color:rgba(255,255,255,0.55);line-height:1.5;">${e.desc}</div>
                ${expandedIdx === events.indexOf(e) ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid ${e.color}22;font-size:10px;color:${e.color}cc;line-height:1.6;animation:fadeIn 0.3s ease;">📋 ${e.detail}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:12px;padding:10px;background:rgba(0,229,255,0.03);border:1px solid rgba(0,229,255,0.08);border-radius:6px;">
          <div style="font-size:8px;color:rgba(255,255,255,0.3);letter-spacing:2px;margin-bottom:6px;">MATERIAL PROGRESS INDEX</div>
          <div style="display:flex;gap:3px;align-items:flex-end;height:30px;">
            ${events.map((e, i) => `<div style="flex:1;background:linear-gradient(to top,${e.color}88,${e.color}22);border-radius:2px 2px 0 0;height:${12 + i * 2}px;transition:height 0.5s;animation:barRise 0.8s ${i*0.06}s backwards;" title="${e.year}: ${e.title}"></div>`).join('')}
          </div>
        </div>
        <style>@keyframes tlSlide{to{opacity:1;transform:translateX(0)}}@keyframes pulseGlow{from{text-shadow:0 0 20px rgba(0,229,255,0.4)}to{text-shadow:0 0 30px rgba(0,229,255,0.7),0 0 60px rgba(0,229,255,0.2)}}@keyframes fadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}@keyframes barRise{from{height:0}}</style>
      </div>`;
      c.querySelectorAll('.tl-cat').forEach(btn => {
        btn.addEventListener('mouseenter', () => { if (btn.dataset.cat !== activeFilter) { btn.style.borderColor = '#00e5ff55'; btn.style.color = '#00e5ffaa'; }});
        btn.addEventListener('mouseleave', () => { if (btn.dataset.cat !== activeFilter) { btn.style.borderColor = 'rgba(255,255,255,0.1)'; btn.style.color = 'rgba(255,255,255,0.5)'; }});
        btn.addEventListener('click', () => { activeFilter = btn.dataset.cat; renderTimeline(); });
      });
      c.querySelectorAll('.tl-evt').forEach(el => {
        el.addEventListener('mouseenter', () => { el.style.transform = 'translateX(4px)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'translateX(0)'; });
        el.addEventListener('click', () => { const idx = parseInt(el.dataset.idx); expandedIdx = expandedIdx === idx ? -1 : idx; renderTimeline(); });
      });
    };
    renderTimeline();
  }

  // ═══ MOLECULAR VIEWER ═══
  openMolecularViewer() {
    const win = this.createWindow('Molecular Viewer', '⚛️', 720, 560);
    const c = win.content;
    const molecules = {
      kevlar: { name: 'Kevlar (PPTA)', formula: '[-CO-C₆H₄-CO-NH-C₆H₄-NH-]ₙ', bonds: 'Aromatic amide (para)', strength: '3620 MPa', density: '1.44 g/cm³', melting: '500°C (decomp)', apps: 'Body armor, tires, ropes', color: '#ffd000',
        atoms: [{s:'C',x:50,y:30,r:18,c:'#666'},{s:'O',x:25,y:20,r:15,c:'#ff4444'},{s:'N',x:75,y:20,r:15,c:'#4488ff'},{s:'H',x:90,y:12,r:10,c:'#aaa'},{s:'C',x:35,y:55,r:18,c:'#666'},{s:'C',x:65,y:55,r:18,c:'#666'},{s:'C',x:50,y:75,r:18,c:'#666'},{s:'O',x:20,y:70,r:15,c:'#ff4444'},{s:'N',x:80,y:70,r:15,c:'#4488ff'}]},
      steel: { name: 'Steel (Fe-C)', formula: 'Fe₃C (Cementite) + α-Fe', bonds: 'Metallic + Interstitial', strength: '400-2000 MPa', density: '7.85 g/cm³', melting: '1510°C', apps: 'Construction, vehicles, tools', color: '#00b4ff',
        atoms: [{s:'Fe',x:50,y:40,r:22,c:'#8899bb'},{s:'Fe',x:25,y:28,r:22,c:'#8899bb'},{s:'Fe',x:75,y:28,r:22,c:'#8899bb'},{s:'C',x:50,y:20,r:12,c:'#555'},{s:'Fe',x:35,y:62,r:22,c:'#8899bb'},{s:'Fe',x:65,y:62,r:22,c:'#8899bb'},{s:'C',x:50,y:55,r:12,c:'#555'},{s:'Fe',x:50,y:80,r:22,c:'#8899bb'}]},
      aluminum: { name: 'Aluminum 7075', formula: 'Al-Zn-Mg-Cu', bonds: 'Metallic (FCC crystal)', strength: '503-572 MPa', density: '2.81 g/cm³', melting: '660°C', apps: 'Aerospace, electronics, packaging', color: '#ff2d78',
        atoms: [{s:'Al',x:50,y:40,r:20,c:'#ccccdd'},{s:'Zn',x:28,y:25,r:17,c:'#7777aa'},{s:'Mg',x:72,y:25,r:17,c:'#77aa77'},{s:'Cu',x:35,y:65,r:17,c:'#cc8844'},{s:'Al',x:65,y:58,r:20,c:'#ccccdd'},{s:'Al',x:50,y:78,r:20,c:'#ccccdd'},{s:'Zn',x:20,y:55,r:17,c:'#7777aa'}]},
    };
    let activeMol = 'kevlar';
    let showBonds = true;
    let showLabels = true;
    let animSpeed = 1;
    const render = () => {
      const mol = molecules[activeMol];
      c.innerHTML = `<div style="height:100%;display:flex;flex-direction:column;background:linear-gradient(135deg,rgba(0,5,15,0.98),rgba(5,10,25,0.96));">
        <div style="display:flex;gap:4px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);align-items:center;">
          ${Object.keys(molecules).map(k => `<button class="mol-btn" data-mol="${k}" style="padding:5px 14px;font-size:10px;border:1px solid ${molecules[k].color}${k===activeMol?'88':'33'};background:${k===activeMol?molecules[k].color+'18':'transparent'};color:${molecules[k].color};border-radius:4px;cursor:pointer;letter-spacing:1px;font-weight:700;transition:all 0.3s;">${k.toUpperCase()}</button>`).join('')}
          <div style="flex:1;"></div>
          <button class="mol-toggle" data-t="bonds" style="padding:3px 8px;font-size:8px;border:1px solid ${showBonds?'#00e5ff44':'#fff1'};background:${showBonds?'#00e5ff15':'transparent'};color:${showBonds?'#00e5ff':'#fff5'};border-radius:3px;cursor:pointer;">BONDS</button>
          <button class="mol-toggle" data-t="labels" style="padding:3px 8px;font-size:8px;border:1px solid ${showLabels?'#00e5ff44':'#fff1'};background:${showLabels?'#00e5ff15':'transparent'};color:${showLabels?'#00e5ff':'#fff5'};border-radius:3px;cursor:pointer;">LABELS</button>
          <button class="mol-toggle" data-t="speed" style="padding:3px 8px;font-size:8px;border:1px solid #ffd00044;background:#ffd00010;color:#ffd000;border-radius:3px;cursor:pointer;">${animSpeed}× SPD</button>
        </div>
        <div style="flex:1;display:flex;overflow:hidden;">
          <div style="flex:1;position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:relative;width:320px;height:320px;">
              <div style="position:absolute;inset:0;border-radius:50%;border:1px dashed ${mol.color}18;animation:orbSpin ${8/animSpeed}s linear infinite;"></div>
              <div style="position:absolute;inset:12%;border-radius:50%;border:1px dashed ${mol.color}10;animation:orbSpin ${12/animSpeed}s linear infinite reverse;"></div>
              <div style="position:absolute;inset:25%;border-radius:50%;border:1px dotted ${mol.color}08;animation:orbSpin ${16/animSpeed}s linear infinite;"></div>
              ${showBonds ? mol.atoms.slice(0,-1).map((a,i) => {const b=mol.atoms[i+1];return `<svg style="position:absolute;inset:0;width:100%;height:100%;z-index:1;"><line x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%" stroke="${mol.color}55" stroke-width="2" stroke-dasharray="6,3"><animate attributeName="stroke-dashoffset" from="0" to="9" dur="${1/animSpeed}s" repeatCount="indefinite"/></line></svg>`;}).join('') : ''}
              ${mol.atoms.map((a,i) => `
                <div class="mol-atom" data-idx="${i}" style="position:absolute;left:${a.x}%;top:${a.y}%;transform:translate(-50%,-50%);width:${a.r*2}px;height:${a.r*2}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,${a.c}ff,${a.c}88,${a.c}44);box-shadow:0 0 ${a.r}px ${a.c}66,inset 0 -3px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:${a.r > 15 ? 11 : 8}px;font-weight:700;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.6);animation:atomFloat ${(2+i*0.3)/animSpeed}s ease-in-out infinite alternate;z-index:2;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;">${showLabels ? a.s : ''}</div>
              `).join('')}
            </div>
            <div style="position:absolute;bottom:8px;left:8px;font-size:8px;color:${mol.color}88;font-family:'Share Tech Mono',monospace;">⟳ Click atoms for info</div>
          </div>
          <div style="width:230px;padding:14px;border-left:1px solid rgba(255,255,255,0.06);overflow-y:auto;">
            <div style="font-size:15px;font-weight:700;color:${mol.color};margin-bottom:6px;text-shadow:0 0 15px ${mol.color};">${mol.name}</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.35);letter-spacing:2px;margin-bottom:14px;">MOLECULAR STRUCTURE</div>
            ${[['Formula',mol.formula],['Bond Type',mol.bonds],['Tensile Str.',mol.strength],['Density',mol.density],['Melting Pt.',mol.melting],['Applications',mol.apps]].map(([l,v])=>`
              <div style="margin-bottom:10px;padding:6px 8px;background:rgba(255,255,255,0.02);border-radius:4px;border-left:2px solid ${mol.color}44;transition:border-color 0.3s;" class="mol-prop">
                <div style="font-size:7px;color:rgba(255,255,255,0.3);letter-spacing:2px;text-transform:uppercase;margin-bottom:2px;">${l}</div>
                <div style="font-size:10px;color:${mol.color};font-weight:600;">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <style>
          @keyframes atomFloat{0%{transform:translate(-50%,-50%) translateY(0) scale(1)}100%{transform:translate(-50%,-50%) translateY(-5px) scale(1.05)}}
          @keyframes orbSpin{to{transform:rotate(360deg)}}
        </style>
      </div>`;
      c.querySelectorAll('.mol-btn').forEach(btn => {
        btn.addEventListener('click', () => { activeMol = btn.dataset.mol; render(); });
      });
      c.querySelectorAll('.mol-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.dataset.t === 'bonds') showBonds = !showBonds;
          else if (btn.dataset.t === 'labels') showLabels = !showLabels;
          else if (btn.dataset.t === 'speed') animSpeed = animSpeed >= 3 ? 0.5 : animSpeed + 0.5;
          render();
        });
      });
      c.querySelectorAll('.mol-atom').forEach(el => {
        el.addEventListener('mouseenter', () => { el.style.transform = 'translate(-50%,-50%) scale(1.3)'; el.style.boxShadow = `0 0 20px ${molecules[activeMol].color}`; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'translate(-50%,-50%) scale(1)'; el.style.boxShadow = ''; });
        el.addEventListener('click', () => {
          const a = molecules[activeMol].atoms[parseInt(el.dataset.idx)];
          const info = {C:'Carbon — 12.01 amu, essential backbone element',O:'Oxygen — 16.00 amu, forms strong double bonds',N:'Nitrogen — 14.01 amu, key in aramid bonds',H:'Hydrogen — 1.008 amu, lightest element',Fe:'Iron — 55.85 amu, primary component of steel',Al:'Aluminum — 26.98 amu, lightweight structural metal',Zn:'Zinc — 65.38 amu, strengthening agent',Mg:'Magnesium — 24.31 amu, reduces density',Cu:'Copper — 63.55 amu, improves hardness'};
          this.showNotification('Atom Info', info[a.s] || a.s + ' atom', '⚛️');
        });
      });
      c.querySelectorAll('.mol-prop').forEach(el => {
        el.addEventListener('mouseenter', () => { el.style.borderLeftColor = molecules[activeMol].color; });
        el.addEventListener('mouseleave', () => { el.style.borderLeftColor = molecules[activeMol].color + '44'; });
      });
    };
    render();
  }

  // ═══ COMPARISON LAB ═══
  openComparisonLab() {
    const win = this.createWindow('Comparison Lab', '⚖️', 800, 540);
    const c = win.content;
    const props = [
      { name: 'Tensile Strength', unit: 'MPa', steel: 1200, kevlar: 3620, aluminum: 572, max: 4000 },
      { name: 'Density', unit: 'g/cm³', steel: 7.85, kevlar: 1.44, aluminum: 2.81, max: 8, lowBest: true },
      { name: 'Elastic Modulus', unit: 'GPa', steel: 200, kevlar: 112, aluminum: 71.7, max: 210 },
      { name: 'Melting Point', unit: '°C', steel: 1510, kevlar: 500, aluminum: 660, max: 1600 },
      { name: 'Thermal Cond.', unit: 'W/mK', steel: 50, kevlar: 0.04, aluminum: 167, max: 180 },
      { name: 'Cost Index', unit: '$/kg', steel: 0.8, kevlar: 25, aluminum: 2.5, max: 30, lowBest: true },
      { name: 'Fatigue Life', unit: '×10⁶ cycles', steel: 10, kevlar: 50, aluminum: 5, max: 55 },
      { name: 'Impact Resist.', unit: 'kJ/m²', steel: 150, kevlar: 480, aluminum: 60, max: 500 },
    ];
    let viewMode = 'bars';
    let highlightMat = null;
    const mats = [{key:'steel',name:'STEEL',col:'#00b4ff'},{key:'kevlar',name:'KEVLAR',col:'#ffd000'},{key:'aluminum',name:'ALUMINUM',col:'#ff2d78'}];
    const renderLab = () => {
      c.innerHTML = `<div style="padding:12px;height:100%;overflow-y:auto;background:linear-gradient(180deg,rgba(0,5,15,0.98),rgba(5,5,15,0.96));">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <div style="font-size:15px;font-weight:700;color:#00e5ff;letter-spacing:3px;text-shadow:0 0 15px rgba(0,229,255,0.4);">COMPARISON LAB</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.3);letter-spacing:2px;">8 PROPERTIES • 3 MATERIALS • REAL-TIME</div>
          </div>
          <div style="display:flex;gap:4px;">
            ${['bars','table'].map(m => `<button class="view-btn" data-m="${m}" style="padding:4px 12px;font-size:9px;border:1px solid ${m===viewMode?'#00e5ff66':'#fff1'};background:${m===viewMode?'#00e5ff15':'transparent'};color:${m===viewMode?'#00e5ff':'#fff5'};border-radius:4px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">${m}</button>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:4px;margin-bottom:14px;">
          ${mats.map(m => `<button class="mat-hi" data-k="${m.key}" style="flex:1;padding:8px;text-align:center;border:1px solid ${m.col}${highlightMat===m.key?'88':'22'};background:${highlightMat===m.key?m.col+'15':'transparent'};border-radius:6px;cursor:pointer;transition:all 0.3s;">
            <div style="font-size:11px;font-weight:700;color:${m.col};letter-spacing:2px;text-shadow:0 0 8px ${m.col}55;">${m.name}</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.3);margin-top:2px;">Click to highlight</div>
          </button>`).join('')}
        </div>
        ${viewMode === 'bars' ? `
          ${props.map((p, i) => {
            const best = p.lowBest ? Math.min(p.steel, p.kevlar, p.aluminum) : Math.max(p.steel, p.kevlar, p.aluminum);
            return `<div style="margin-bottom:10px;padding:8px;background:rgba(255,255,255,0.015);border-radius:6px;border-left:2px solid rgba(255,255,255,0.05);">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:10px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:1px;">${p.name}</span>
                <span style="font-size:8px;color:rgba(255,255,255,0.3);">${p.unit}</span>
              </div>
              ${mats.map(m => {const v=p[m.key];const w=(v/p.max*100).toFixed(0);const isBest=v===best;const dim=highlightMat&&highlightMat!==m.key;return `
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;opacity:${dim?'0.3':'1'};transition:opacity 0.3s;">
                  <span style="font-size:8px;color:${m.col};width:50px;text-align:right;">${m.name}</span>
                  <div style="flex:1;height:5px;background:rgba(255,255,255,0.04);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:0;background:linear-gradient(90deg,${m.col}66,${m.col});border-radius:3px;box-shadow:0 0 6px ${m.col}44;animation:labBar 1.2s ${i*0.06+0.1}s forwards;--lw:${w}%;"></div>
                  </div>
                  <span style="font-size:9px;color:${isBest?m.col:'rgba(255,255,255,0.5)'};font-weight:${isBest?'700':'400'};width:55px;font-family:'Share Tech Mono',monospace;">${v}${isBest?' ★':''}</span>
                </div>
              `;}).join('')}
            </div>`;
          }).join('')}
        ` : `
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:10px;">
              <thead><tr style="background:rgba(255,255,255,0.03);">
                <th style="padding:8px;text-align:left;color:rgba(255,255,255,0.4);border-bottom:1px solid rgba(255,255,255,0.06);">Property</th>
                ${mats.map(m => `<th style="padding:8px;text-align:center;color:${m.col};border-bottom:1px solid rgba(255,255,255,0.06);">${m.name}</th>`).join('')}
                <th style="padding:8px;text-align:center;color:#00ff64;border-bottom:1px solid rgba(255,255,255,0.06);">WINNER</th>
              </tr></thead>
              <tbody>${props.map((p,i) => {
                const best = p.lowBest ? Math.min(p.steel,p.kevlar,p.aluminum) : Math.max(p.steel,p.kevlar,p.aluminum);
                const winner = mats.find(m => p[m.key] === best);
                return `<tr style="opacity:0;animation:dbFade 0.3s ${i*0.05}s forwards;">
                  <td style="padding:6px 8px;color:rgba(255,255,255,0.7);border-bottom:1px solid rgba(255,255,255,0.03);">${p.name} <span style="color:rgba(255,255,255,0.3);font-size:8px;">(${p.unit})</span></td>
                  ${mats.map(m => `<td style="padding:6px 8px;text-align:center;color:${p[m.key]===best?m.col:'rgba(255,255,255,0.5)'};font-weight:${p[m.key]===best?'700':'400'};font-family:'Share Tech Mono',monospace;border-bottom:1px solid rgba(255,255,255,0.03);">${p[m.key]}${p[m.key]===best?' ★':''}</td>`).join('')}
                  <td style="padding:6px 8px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.03);"><span style="background:${winner.col}15;color:${winner.col};padding:2px 8px;border-radius:4px;font-size:9px;border:1px solid ${winner.col}30;">${winner.name}</span></td>
                </tr>`;
              }).join('')}</tbody>
            </table>
          </div>
        `}
        <style>@keyframes labBar{to{width:var(--lw,50%)}}@keyframes dbFade{to{opacity:1}}</style>
      </div>`;
      c.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', () => { viewMode = b.dataset.m; renderLab(); }));
      c.querySelectorAll('.mat-hi').forEach(b => b.addEventListener('click', () => { highlightMat = highlightMat === b.dataset.k ? null : b.dataset.k; renderLab(); }));
    };
    renderLab();
  }

  // ═══ STRESS SIMULATOR ═══
  openStressSimulator() {
    const win = this.createWindow('Stress Simulator', '💥', 760, 520);
    const c = win.content;
    let running = false, elapsed = 0, interval = null, fails = 0;
    let loadRate = 50, temp = 25;
    const yields = { steel: 1200, kevlar: 3620, aluminum: 572 };
    const colors = { steel: '#00b4ff', kevlar: '#ffd000', aluminum: '#ff2d78' };
    let stressLevels = { steel: 0, kevlar: 0, aluminum: 0 };
    let history = { steel: [], kevlar: [], aluminum: [] };
    const renderSim = () => {
      c.innerHTML = `<div class="ss-container" style="height:100%;display:flex;flex-direction:column;background:#050508;position:relative;${fails>=3? 'animation:glitchShake 0.2s infinite;':''}">
        ${fails>=3? `<div style="position:absolute;inset:0;background:rgba(255,0,0,0.1);z-index:100;pointer-events:none;animation:flashRed 1s infinite;"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;color:#ff0000;font-weight:900;letter-spacing:10px;text-shadow:0 0 20px #ff0000;z-index:101;pointer-events:none;">SYSTEM FAILURE</div>` : ''}
        <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg, rgba(0,229,255,0.05), transparent);">
          <div>
            <span style="font-size:14px;font-weight:700;color:#00e5ff;letter-spacing:2px;text-shadow:0 0 10px #00e5ff88;">STRESS TEST SIMULATOR</span>
            <span style="font-size:9px;color:rgba(255,255,255,0.4);margin-left:8px;font-family:'Share Tech Mono';">v3.0 ADVANCED KINETIC</span>
          </div>
          <div style="display:flex;gap:8px;">
            <button id="ss-start" style="padding:6px 16px;font-size:10px;font-weight:bold;background:${running?'#ff2d7822':'#00e5ff22'};color:${running?'#ff2d78':'#00e5ff'};border:1px solid ${running?'#ff2d78':'#00e5ff'};border-radius:4px;cursor:pointer;letter-spacing:1px;box-shadow:0 0 10px ${running?'#ff2d7844':'#00e5ff44'};">${running?'⏸ HALT TEST':'▶ INITIATE'}</button>
            <button id="ss-reset" style="padding:6px 16px;font-size:10px;background:#ffffff08;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2);border-radius:4px;cursor:pointer;letter-spacing:1px;">↺ PURGE DATA</button>
          </div>
        </div>
        <div style="padding:12px 16px;display:flex;gap:16px;border-bottom:1px solid rgba(255,255,255,0.04);">
          <div style="flex:1;">
            <div style="font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:5px;">APPLIED LOAD RATE: <span style="color:#00e5ff;font-size:11px;font-weight:bold;">${loadRate} MPa/s</span></div>
            <input id="ss-rate" type="range" min="10" max="250" value="${loadRate}" style="width:100%;height:4px;accent-color:#00e5ff;cursor:pointer;">
          </div>
          <div style="flex:1;">
            <div style="font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:5px;">ENVIRONMENTAL TEMP: <span style="color:#ff4444;font-size:11px;font-weight:bold;">${temp}°C</span></div>
            <input id="ss-temp" type="range" min="-50" max="1000" value="${temp}" style="width:100%;height:4px;accent-color:#ff4444;cursor:pointer;">
          </div>
          <div style="text-align:right;min-width:100px;">
            <div style="font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:2px;">TEST DURATION</div>
            <div class="ss-time" style="font-size:22px;font-weight:700;color:#00e5ff;font-family:'Share Tech Mono',monospace;text-shadow:0 0 10px #00e5ff88;">${formatTime(elapsed)}</div>
          </div>
        </div>
        <div style="flex:1;display:flex;padding:12px;gap:12px;overflow:hidden;">
          <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
            ${Object.keys(yields).map(mat => {
              const pct = Math.min(stressLevels[mat] / yields[mat] * 100, 120);
              const status = pct > 100 ? 'Ruptured' : pct > 75 ? 'Critical Warning' : pct > 40 ? 'Plastic Def.' : 'Elastic Zone';
              const statusCol = pct > 100 ? '#ff0000' : pct > 75 ? '#ffaa00' : pct > 40 ? '#ffcc00' : '#00ff88';
              return `<div style="flex:1;background:rgba(255,255,255,0.02);border:1px solid ${pct>100?'#ff0000':colors[mat]+'44'};border-radius:6px;padding:12px;position:relative;overflow:hidden;${pct>100?'box-shadow:inset 0 0 20px rgba(255,0,0,0.3);':''}">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:12px;font-weight:800;color:${colors[mat]};letter-spacing:2px;text-shadow:0 0 8px ${colors[mat]}88;">${mat.toUpperCase()}</span>
                    <div class="ss-stat-${mat}" style="font-size:9px;padding:3px 8px;border-radius:4px;background:${statusCol}22;color:${statusCol};letter-spacing:1px;font-weight:700;border:1px solid ${statusCol}44;${pct>100?'animation:flashRed 0.5s infinite;':''}">${status.toUpperCase()}</div>
                  </div>
                  <span class="ss-val-${mat}" style="font-size:14px;font-weight:700;color:${pct>100?'#ff0000':colors[mat]};font-family:'Share Tech Mono',monospace;">${Math.floor(stressLevels[mat])} MPa</span>
                </div>
                <div style="height:8px;background:rgba(0,0,0,0.5);border-radius:4px;overflow:hidden;margin-bottom:6px;border:1px solid rgba(255,255,255,0.1);">
                  <div class="ss-bar-${mat}" style="height:100%;width:${Math.min(pct,100)}%;background:linear-gradient(90deg,${colors[mat]}44,${pct>100?'#ff0000':pct>75?'#ff8800':colors[mat]});border-radius:4px;transition:width 0.15s;box-shadow:0 0 10px ${colors[mat]};"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:8px;color:rgba(255,255,255,0.4);font-family:'Share Tech Mono';">
                  <span>0</span><span>Yield Threshold: ${yields[mat]}</span>
                </div>
              </div>`;
            }).join('')}
          </div>
          <div style="width:300px;background:#000;border:1px solid rgba(0,229,255,0.2);border-radius:6px;padding:12px;display:flex;flex-direction:column;position:relative;box-shadow:inset 0 0 30px rgba(0,229,255,0.05);">
            <div style="font-size:10px;color:#00e5ff;letter-spacing:2px;margin-bottom:8px;font-weight:700;">TELEMETRY GRAPH <span style="color:#ffaa00;">[LIVE]</span></div>
            <div style="position:absolute;top:12px;right:12px;display:flex;gap:10px;">
              ${Object.keys(colors).map(m => `<div style="display:flex;align-items:center;gap:4px;font-size:8px;color:rgba(255,255,255,0.6);"><div style="width:8px;height:2px;background:${colors[m]};box-shadow:0 0 4px ${colors[m]};"></div>${m.slice(0,3).toUpperCase()}</div>`).join('')}
            </div>
            <div style="flex:1;position:relative;">
               <!-- Background grid SVG -->
               <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
                 <defs>
                   <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                     <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,229,255,0.05)" stroke-width="0.5"/>
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#grid)" />
               </svg>
               <canvas id="ss-graph" style="position:absolute;inset:0;width:100%;height:100%;border-radius:4px;"></canvas>
            </div>
          </div>
        </div>
        <style>
          @keyframes glitchShake { 0% {transform:translate(1px,1px)} 25% {transform:translate(-1px,-2px)} 50% {transform:translate(-2px,1px)} 75% {transform:translate(1px,-1px)} 100% {transform:translate(2px,2px)} }
          @keyframes flashRed { 0% {opacity:1} 50% {opacity:0.2} 100% {opacity:1} }
        </style>
      </div>`;

      // Draw Graph
      const canvas = c.querySelector('#ss-graph');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; // High DPI
        ctx.scale(2, 2);
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        ctx.clearRect(0, 0, w, h);
        Object.keys(history).forEach(mat => {
          const pts = history[mat];
          if (pts.length < 2) return;
          ctx.beginPath();
          ctx.strokeStyle = colors[mat];
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = colors[mat];
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          pts.forEach((v, i) => {
            const x = (i / Math.max(pts.length - 1, 1)) * w;
            const y = h - Math.min(v / 4200, 1) * h;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.stroke();
          
          // Draw leading point dot
          const lastV = pts[pts.length-1];
          const lx = w; const ly = h - Math.min(lastV / 4200, 1) * h;
          ctx.beginPath(); ctx.fillStyle="#fff"; ctx.arc(lx, ly, 3, 0, Math.PI*2); ctx.fill();
        });
      }
      
      // Events
      c.querySelector('#ss-start').addEventListener('click', () => {
        running = !running;
        if (running && fails < 3) { interval = setInterval(tick, 50); } else { clearInterval(interval); }
        renderSim();
      });
      c.querySelector('#ss-reset').addEventListener('click', () => {
        clearInterval(interval); running = false; elapsed = 0; fails = 0;
        stressLevels = { steel: 0, kevlar: 0, aluminum: 0 };
        history = { steel: [], kevlar: [], aluminum: [] };
        renderSim();
      });
      c.querySelector('#ss-rate').addEventListener('input', (e) => { loadRate = parseInt(e.target.value); });
      c.querySelector('#ss-temp').addEventListener('input', (e) => { temp = parseInt(e.target.value); });
    };
    function formatTime(ms) {
      const s = ms / 1000;
      return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}.${Math.floor((s%1)*100).toString().padStart(2,'0')}`;
    }
    const tick = () => {
      elapsed += 50; // faster tick
      const tempFactor = 1 + Math.max(0, (temp - 50)) * 0.003;
      fails = 0;
      
      Object.keys(yields).forEach(mat => {
        const rate = loadRate * (mat === 'aluminum' ? 2.2 : mat === 'kevlar' ? 0.3 : 1.2) * tempFactor;
        stressLevels[mat] += (rate * 0.05) * (0.8 + Math.random() * 0.4);
        if(stressLevels[mat] > yields[mat]*1.1) stressLevels[mat] = yields[mat]*1.1; // cap
        history[mat].push(stressLevels[mat]);
        if (history[mat].length > 150) history[mat].shift();
        
        if (stressLevels[mat] >= yields[mat]) fails++;
      });
      
      // Quick DOM updates
      const timeEl = c.querySelector('.ss-time');
      if (timeEl) timeEl.textContent = formatTime(elapsed);
      
      Object.keys(yields).forEach(mat => {
        const pct = Math.min(stressLevels[mat] / yields[mat] * 100, 120);
        const bar = c.querySelector('.ss-bar-' + mat);
        const val = c.querySelector('.ss-val-' + mat);
        if (bar) bar.style.width = Math.min(pct, 100) + '%';
        if (val) val.textContent = Math.floor(stressLevels[mat]) + ' MPa';
        
        if (pct >= 100) {
           const stat = c.querySelector('.ss-stat-' + mat);
           if(stat && stat.textContent !== 'RUPTURED') {
             stat.textContent = 'RUPTURED';
             stat.style.background = 'rgba(255,0,0,0.2)'; stat.style.color = '#ff0000'; stat.style.borderColor = '#ff0000';
             stat.style.animation = 'flashRed 0.3s infinite';
             if(bar) bar.style.background = 'linear-gradient(90deg,#ff000044,#ff0000)';
             if(val) val.style.color = '#ff0000';
           }
        }
      });
      
      // Update canvas graph
      const canvas = c.querySelector('#ss-graph');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        ctx.setTransform(2, 0, 0, 2, 0, 0);
        ctx.clearRect(0, 0, w, h);
        Object.keys(history).forEach(mat => {
          const pts = history[mat];
          if (pts.length < 2) return;
          ctx.beginPath(); ctx.strokeStyle = (stressLevels[mat]>=yields[mat]) ? '#ff0000' : colors[mat]; 
          ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 10; ctx.lineWidth = 2;
          pts.forEach((v, i) => {
            const x = (i / Math.max(pts.length - 1, 1)) * w;
            const y = h - Math.min(v / 4200, 1) * h;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.stroke();
          const lastV = pts[pts.length-1];
          const lx = w; const ly = h - Math.min(lastV / 4200, 1) * h;
          ctx.beginPath(); ctx.fillStyle="#fff"; ctx.arc(lx, ly, 3, 0, Math.PI*2); ctx.fill();
        });
      }
      
      if (fails >= 3) {
        clearInterval(interval); running = false;
        renderSim(); // triggers glitch effect container
        this.showNotification('Catastrophic Failure', 'All test specimens have ruptured.', '🚨');
      }
    };
    renderSim();
  }

  // ═══ PROPERTIES DATABASE ═══
  openPropertiesDB() {
    const win = this.createWindow('Prop. DB & Encyclopedia', '🗄️', 820, 540);
    const c = win.content;
    const materials = [
      { name: 'Carbon Steel AISI 1045', cat: 'Steel', tensile: 585, yield_s: 505, elong: 12, hardness: 170, density: 7.87, thermal: 49.8, color: '#00b4ff', icon: '⚙️', desc: 'General purpose medium carbon steel for shafts, gears, and crankshafts. Highly machinable but susceptible to rust.' },
      { name: 'Stainless Steel 316L', cat: 'Steel', tensile: 485, yield_s: 170, elong: 40, hardness: 217, density: 8.0, thermal: 16.3, color: '#00b4ff', icon: '🛡️', desc: 'Marine-grade austenitic stainless, excellent corrosion resistance. Adding molybdenum prevents pitting.' },
      { name: 'Tool Steel D2', cat: 'Steel', tensile: 1850, yield_s: 1570, elong: 1, hardness: 62, density: 7.7, thermal: 20.9, color: '#00b4ff', icon: '🔪', desc: 'High-carbon, high-chromium tool steel for dies and cutting tools. Extremely hard but brittle.' },
      { name: 'Kevlar 29', cat: 'Kevlar', tensile: 2920, yield_s: 2760, elong: 3.6, hardness: 0, density: 1.44, thermal: 0.04, color: '#ffd000', icon: '🧶', desc: 'Standard Kevlar used widely for body armor, industrial ropes, and cables due to its high strength-to-weight ratio.' },
      { name: 'Kevlar 49', cat: 'Kevlar', tensile: 3000, yield_s: 2800, elong: 2.4, hardness: 0, density: 1.44, thermal: 0.04, color: '#ffd000', icon: '🚀', desc: 'High-modulus variant optimized for aerospace composites, pressure vessels, and high-performance racing gear.' },
      { name: 'Kevlar KM2', cat: 'Kevlar', tensile: 3400, yield_s: 3200, elong: 3.8, hardness: 0, density: 1.44, thermal: 0.04, color: '#ffd000', icon: '🪖', desc: 'Enhanced ballistic-grade fiber specifically engineered for military fragmentation and armor systems.' },
      { name: 'Al 2024-T3', cat: 'Aluminum', tensile: 483, yield_s: 345, elong: 18, hardness: 120, density: 2.78, thermal: 121, color: '#ff2d78', icon: '✈️', desc: 'Classic aerospace aluminum alloy heavily used in commercial aircraft fuselage and structural shear webs.' },
      { name: 'Al 6061-T6', cat: 'Aluminum', tensile: 310, yield_s: 276, elong: 12, hardness: 95, density: 2.70, thermal: 167, color: '#ff2d78', icon: '🚲', desc: 'Highly versatile, weldable alloy. Standard choice for bicycle frames, marine fittings, and standard extrusions.' },
      { name: 'Al 7075-T6', cat: 'Aluminum', tensile: 572, yield_s: 503, elong: 11, hardness: 150, density: 2.81, thermal: 130, color: '#ff2d78', icon: '🛰️', desc: 'Ultra-high-strength alloy blending zinc and magnesium for military equipment and extreme stress components.' },
    ];
    let filter = 'All';
    let search = '';
    let selectedIdx = -1;
    const renderDB = () => {
      let filtered = materials.filter(m => (filter === 'All' || m.cat === filter) && (search === '' || m.name.toLowerCase().includes(search.toLowerCase())));
      
      c.innerHTML = `<div style="height:100%;display:flex;flex-direction:column;background:#06080e;">
        <div style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg, rgba(0,229,255,0.05), transparent);">
          <div>
            <div style="font-size:18px;font-weight:900;color:#00e5ff;letter-spacing:4px;text-shadow:0 0 10px #00e5ff88;">MATERIAL ENCYCLOPEDIA</div>
            <div style="font-size:9px;color:rgba(255,255,255,0.5);letter-spacing:1px;font-family:'Share Tech Mono';">INDEXING ${materials.length} QUANTUM PROFILES</div>
          </div>
          <div style="display:flex;gap:12px;align-items:center;">
             <input id="db-search" type="text" placeholder="QUERY DATABASE..." value="${search}" style="padding:8px 14px;font-size:11px;background:rgba(0,0,0,0.5);border:1px solid rgba(0,229,255,0.3);border-radius:20px;color:#fff;outline:none;font-family:'Share Tech Mono',monospace;width:200px;box-shadow:inset 0 0 10px rgba(0,229,255,0.1);transition:all 0.3s;">
             <div style="display:flex;gap:4px;">
               ${['All','Steel','Kevlar','Aluminum'].map(f => `<button class="db-f" data-f="${f}" style="padding:6px 12px;font-size:10px;font-weight:700;border:1px solid ${f===filter?'#00e5ff':'rgba(255,255,255,0.1)'};background:${f===filter?'#00e5ff22':'#ffffff05'};color:${f===filter?'#00e5ff':'rgba(255,255,255,0.5)'};border-radius:12px;cursor:pointer;transition:all 0.3s;box-shadow:${f===filter?'0 0 10px #00e5ff44':'none'};">${f.toUpperCase()}</button>`).join('')}
             </div>
          </div>
        </div>
        
        <div style="display:flex;flex:1;overflow:hidden;">
          <div style="flex:1;overflow-y:auto;padding:20px;display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:16px;align-content:start;">
            ${filtered.map((m, i) => `
              <div class="db-card" data-ri="${materials.indexOf(m)}" style="background:rgba(255,255,255,0.02);border:1px solid ${selectedIdx===materials.indexOf(m)?m.color:m.color+'33'};border-radius:8px;padding:16px;cursor:pointer;transition:all 0.3s;opacity:0;animation:dbFadeIn 0.4s ${i*0.05}s forwards;position:relative;overflow:hidden;box-shadow:${selectedIdx===materials.indexOf(m)?'0 0 20px '+m.color+'44, inset 0 0 10px '+m.color+'22':'none'};transform:${selectedIdx===materials.indexOf(m)?'scale(1.02)':'scale(1)'};">
                <div style="position:absolute;top:0;right:0;width:50px;height:50px;background:radial-gradient(circle at top right, ${m.color}66, transparent);pointer-events:none;"></div>
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                   <div style="font-size:24px;filter:drop-shadow(0 0 8px ${m.color});">${m.icon}</div>
                   <div>
                     <div style="font-size:12px;font-weight:800;color:${m.color};text-shadow:0 0 8px ${m.color}88;">${m.name}</div>
                     <div style="font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:1px;font-family:'Share Tech Mono';">${m.cat.toUpperCase()}</div>
                   </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;font-family:'Share Tech Mono';">
                  <div style="background:rgba(0,0,0,0.3);padding:6px;border-radius:4px;border-left:2px solid ${m.color};">
                    <div style="color:rgba(255,255,255,0.4);font-size:8px;">TENSILE</div><div style="color:#fff;">${m.tensile} MPa</div>
                  </div>
                  <div style="background:rgba(0,0,0,0.3);padding:6px;border-radius:4px;border-left:2px solid ${m.color};">
                    <div style="color:rgba(255,255,255,0.4);font-size:8px;">DENSITY</div><div style="color:#fff;">${m.density} g/cc</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          ${selectedIdx >= 0 ? `
            <div style="width:280px;background:#0a0c14;border-left:1px solid rgba(255,255,255,0.06);padding:24px;display:flex;flex-direction:column;animation:slideLeft 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);position:relative;box-shadow:-10px 0 30px rgba(0,0,0,0.5);">
              <div style="position:absolute;top:-50px;right:-50px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle, ${materials[selectedIdx].color}22, transparent 70%);filter:blur(20px);"></div>
              
              <div style="font-size:32px;filter:drop-shadow(0 0 10px ${materials[selectedIdx].color});margin-bottom:8px;">${materials[selectedIdx].icon}</div>
              <div style="font-size:18px;font-weight:900;color:#fff;text-shadow:0 0 10px ${materials[selectedIdx].color}88;line-height:1.2;">${materials[selectedIdx].name}</div>
              <div style="font-size:11px;color:${materials[selectedIdx].color};letter-spacing:3px;font-family:'Share Tech Mono';margin-bottom:20px;">${materials[selectedIdx].cat.toUpperCase()} DATASET</div>
              
              <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:24px;padding:12px;background:rgba(255,255,255,0.03);border-radius:6px;border:1px solid rgba(255,255,255,0.05);position:relative;">
                <div style="position:absolute;left:0;top:10px;bottom:10px;width:3px;background:${materials[selectedIdx].color};border-radius:0 2px 2px 0;box-shadow:0 0 8px ${materials[selectedIdx].color};"></div>
                ${materials[selectedIdx].desc}
              </div>
              
              <div style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:2px;margin-bottom:12px;font-weight:bold;">TECHNICAL SPECIFICATIONS</div>
              <div style="display:flex;flex-direction:column;gap:12px;">
                ${[['Tensile Strength',materials[selectedIdx].tensile,'MPa',4000],['Yield Strength',materials[selectedIdx].yield_s,'MPa',4000],['Elongation',materials[selectedIdx].elong,'%',50],['Hardness',materials[selectedIdx].hardness||0,'HRC',250],['Density',materials[selectedIdx].density,'g/cm³',10],['Thermal Cond.',materials[selectedIdx].thermal,'W/mK',200]].map(([l,v,u,m]) => `
                  <div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;align-items:flex-end;">
                      <span style="font-size:9px;color:rgba(255,255,255,0.5);letter-spacing:1px;">${l}</span>
                      <span style="font-size:12px;color:${materials[selectedIdx].color};font-weight:700;font-family:'Share Tech Mono';text-shadow:0 0 8px ${materials[selectedIdx].color}66;">${v} <span style="font-size:9px;color:rgba(255,255,255,0.4);">${u}</span></span>
                    </div>
                    <div style="height:4px;background:rgba(0,0,0,0.4);border-radius:2px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
                      <div style="height:100%;width:${(v/m)*100}%;background:linear-gradient(90deg, ${materials[selectedIdx].color}44, ${materials[selectedIdx].color});border-radius:2px;animation:labBar 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) backwards;box-shadow:0 0 8px ${materials[selectedIdx].color};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="width:280px;border-left:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0.3;">
               <div style="font-size:48px;margin-bottom:16px;">🧿</div>
               <div style="font-family:'Share Tech Mono';font-size:12px;letter-spacing:2px;text-align:center;">AWAITING<br>SELECTION</div>
            </div>
          `}
        </div>
        <style>@keyframes dbFadeIn{to{opacity:1;transform:translateY(0)}from{opacity:0;transform:translateY(10px)}} @keyframes slideLeft{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}} @keyframes labBar{from{width:0}} .db-card:hover { border-color: #00e5ff; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }</style>
      </div>`;
      
      c.querySelector('#db-search').addEventListener('input', (e) => { search = e.target.value; renderDB(); });
      // Add magical glow focus to input
      const searchBox = c.querySelector('#db-search');
      searchBox.addEventListener('focus', () => searchBox.style.boxShadow = '0 0 15px rgba(0,229,255,0.4), inset 0 0 10px rgba(0,229,255,0.2)');
      searchBox.addEventListener('blur', () => searchBox.style.boxShadow = 'inset 0 0 10px rgba(0,229,255,0.1)');
      
      c.querySelectorAll('.db-f').forEach(b => b.addEventListener('click', () => { filter = b.dataset.f; renderDB(); }));
      c.querySelectorAll('.db-card').forEach(row => {
        row.addEventListener('click', () => { selectedIdx = selectedIdx === parseInt(row.dataset.ri) ? -1 : parseInt(row.dataset.ri); renderDB(); });
      });
    };
    renderDB();
  }

  // ═══ CLEANUP ═══
  destroy() {
    if (this.container) this.container.innerHTML = '';
    this.windows = [];
  }
}
