/* ============================================================================
   CONTEXT ENGINE v1.0 — Context-Aware AI Navigation System
   
   ICYS 2026 GOLD Feature: The AI sees what the user is looking at,
   understands intent, navigates autonomously, and generates
   deep visual explanations.
   
   ├─ Mouse tracking → data-kevin-context attribute detection
   ├─ Context state management with real-time HUD updates
   ├─ Deep structured explanation database (10+ contexts)
   ├─ Cinematic navigation with blur/fade transitions
   ├─ Intent detection for "explain this" type queries
   └─ Explanation rendering with progressive animations
   ============================================================================ */

window.ContextEngine = (function () {
    'use strict';

    // ─────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────
    let currentContext = null;        // Current context ID string
    let currentContextEl = null;      // Current hovered DOM element
    let contextTimestamp = 0;         // When context was acquired
    let previousContext = null;       // Last context before current
    let isExplanationActive = false;  // Is deep explanation overlay showing
    let explanationSection = null;    // The overlay DOM element
    let onContextChange = null;       // Callback for context changes
    let onExplanationTrigger = null;  // Callback to trigger explanation flow
    let iframeHoveredContext = null;  // Tracks current explicit hover in iframe

    // ── GLOBAL EXPOSURE: The "Eyes" of KEVIN ──
    // Any module can read window.currentKevinContext to know what the user is looking at
    window.currentKevinContext = null;

    // ─────────────────────────────────────────────
    // EXPLANATION DATABASE — Deep structured data
    // Each entry: scientifically accurate, visually rich
    // ─────────────────────────────────────────────
    const EXPLANATIONS = {

        // ── MATERIAL SCIENCE CONTEXTS ──
        'kevlar-structure': {
            title: 'KEVLAR FIBER STRUCTURE',
            subtitle: 'Poly-Paraphenylene Terephthalamide Molecular Architecture',
            summary: 'Kevlar consists of highly ordered polymer chains aligned along the fiber axis, forming a crystalline superlattice through inter-chain hydrogen bonding.',
            deep_explanation: 'The para-substituted benzene rings create an exceptionally rigid polymer chain. Unlike flexible aliphatic polymers, these aromatic rings resist rotation, keeping the chain essentially rod-like. The π-electron conjugation across the rings adds additional stability. Each monomer unit participates in TWO hydrogen bonds — one from C=O and one from N−H — creating sheet-like structures that stack with 3.5 Å spacing. This near-perfect molecular ordering is the fundamental source of Kevlar\'s extraordinary 3,620 MPa tensile strength.',
            key_points: [
                'Chemical formula: [−CO−C₆H₄−CO−NH−C₆H₄−NH−]ₙ',
                'Para-oriented benzene rings → rigid rod-like chains',
                'Dual hydrogen bonds per monomer → 3D crystalline lattice',
                'Inter-chain spacing: 3.5 Å between stacked sheets',
                '92.4% crystallinity in Kevlar-49 grade',
                'Molecular alignment exceeds 90% along fiber axis'
            ],
            visual_suggestions: ['fiber_alignment', 'hydrogen_bonds', 'crystal_lattice'],
            highlight_targets: ['carbon_rings', 'amide_bonds', 'h_bonds'],
            animation_type: 'fiber_alignment',
            model: 'kevlar',
            color: '#00d4ff',
            accent: '#ff6600'
        },

        'tensile-strength': {
            title: 'TENSILE STRENGTH ANALYSIS',
            subtitle: '3,620 MPa — 850% Stronger Than Steel by Weight',
            summary: 'Kevlar-49 achieves extraordinary tensile strength through near-perfect molecular alignment and crystalline hydrogen bonding networks.',
            deep_explanation: 'At 3,620 MPa, Kevlar resists 3.62 BILLION Pascals of force per square meter. A single 12 μm fiber can support 0.4 Newtons — suspending a 40-gram weight from a thread thinner than a human hair. The stress-strain curve is nearly linear until catastrophic failure — no plastic deformation, no warning. When it breaks, it shatters like glass rather than stretching like rubber. The specific strength (strength/density) of 2,514 kN·m/kg is 39.5× that of steel, making it the strongest commercial fiber material available.',
            key_points: [
                'Tensile strength: 3,620 MPa (Kevlar-49)',
                'Specific strength: 2,514 kN·m/kg — 39.5× steel',
                'Elastic modulus: 112 GPa along fiber axis',
                'Elongation at break: 2.4–3.6% (linear until failure)',
                'No plastic deformation — brittle fracture mode',
                'Detectable only via dF/dt derivative analysis'
            ],
            visual_suggestions: ['stress_gradient', 'force_curve', 'comparison_bars'],
            highlight_targets: ['stress_zone', 'failure_point'],
            animation_type: 'stress_propagation',
            model: 'kevlar',
            color: '#ff6600',
            accent: '#00d4ff'
        },

        'hydrogen-bonds': {
            title: 'HYDROGEN BONDING NETWORK',
            subtitle: 'Inter-Chain Cohesion at 3.5 Å Spacing',
            summary: 'Hydrogen bonds between carbonyl and amino groups create the crystalline superlattice responsible for Kevlar\'s cohesive strength.',
            deep_explanation: 'The C=O (carbonyl) and N−H (amino) groups on adjacent PPTA chains form a precise hydrogen bonding network. Each bond has an energy of approximately 20-25 kJ/mol — individually weak, but collectively forming billions of connections per micrometer of fiber. These bonds create planar sheet structures that stack parallel to each other with exactly 3.5 Å spacing. The regularity of this spacing creates an X-ray diffraction pattern characteristic of highly crystalline materials. This bonding geometry is what transforms brittle individual polymer chains into a cooperative load-bearing superlattice.',
            key_points: [
                'Bond type: N−H···O=C hydrogen bonds',
                'Bond energy: ~20-25 kJ/mol each',
                'Inter-sheet spacing: 3.5 Å (angstroms)',
                'Two H-bonds per monomer repeat unit',
                'Creates planar sheet structures',
                'Cooperative load transfer between chains'
            ],
            visual_suggestions: ['bond_network', 'sheet_stacking'],
            highlight_targets: ['oxygen', 'nitrogen', 'h_bonds'],
            animation_type: 'bond_visualization',
            model: 'kevlar',
            color: '#ffd700',
            accent: '#00d4ff'
        },

        'ballistic-impact': {
            title: 'BALLISTIC IMPACT MECHANICS',
            subtitle: '.44 Magnum vs NIJ IIIA+ Kevlar Body Armor',
            summary: 'Kevlar absorbs projectile kinetic energy through three simultaneous mechanisms in under 400 microseconds.',
            deep_explanation: 'A .44 Magnum bullet carries approximately 1,200 Joules of kinetic energy at 490 m/s muzzle velocity. Kevlar distributes this energy through: (1) Primary fiber elongation absorbs ~35% — individual fibers stretch up to 3.6% before failure. (2) Fiber-fiber friction at crossover points absorbs ~45% — the woven structure creates billions of friction points. (3) Delamination and cone formation on the back face absorbs ~20% — the vest deforms outward, spreading force over a larger area. The entire process completes in under 400 μs. Energy propagates laterally through the fiber network at 12,000 m/s — the speed of sound in Kevlar.',
            key_points: [
                'Projectile energy: 1,200 J (.44 Magnum)',
                'Impact velocity: 490 m/s',
                'Absorption: 35% fiber elongation + 45% friction + 20% delamination',
                'Process duration: < 400 microseconds',
                'Wave speed in Kevlar: 12,000 m/s',
                'Backface signature: 28 mm (limit: 44 mm per NIJ)'
            ],
            visual_suggestions: ['impact_wave', 'energy_distribution', 'cone_formation'],
            highlight_targets: ['impact_point', 'wave_front', 'deformation_cone'],
            animation_type: 'impact_simulation',
            model: 'bullet',
            color: '#ff3344',
            accent: '#ff6600'
        },

        'stress-propagation': {
            title: 'STRESS PROPAGATION ANALYSIS',
            subtitle: 'Real-Time Force Distribution in Fiber Networks',
            summary: 'During tensile loading, stress propagates through the Kevlar fiber network following predictable patterns detectable by AI-driven dF/dt analysis.',
            deep_explanation: 'The Nostradamus predictive engine calculates dF/dt using a 20-sample sliding window during controlled loading. In the linear elastic regime, dF/dt remains constant — the material follows Hooke\'s law. When micro-fibers begin failing internally, dF/dt exhibits subtle fluctuations that are mathematically detectable but imperceptible to humans. These fluctuations follow a characteristic pattern: small dips of 2-5% magnitude occurring 1-3 seconds before catastrophic rupture. The AI uses polynomial regression on the force curve to estimate time-to-failure, achieving accuracy within 0.5-2 seconds. This is the core innovation of the ICYS project.',
            key_points: [
                'Monitoring: dF/dt via 20-sample sliding window',
                'Linear regime: constant dF/dt (Hooke\'s law)',
                'Micro-failure signature: 2-5% dF/dt dips',
                'Warning time: 1-3 seconds before rupture',
                'Prediction accuracy: ±0.5-2 seconds',
                'Core scientific indicators: EFI, IGI, DTD'
            ],
            visual_suggestions: ['force_curve', 'derivative_plot', 'failure_zone'],
            highlight_targets: ['linear_zone', 'anomaly_zone', 'failure_point'],
            animation_type: 'stress_wave',
            model: 'kevlar',
            color: '#ff6600',
            accent: '#ff3344'
        },

        'crystal-lattice': {
            title: 'CRYSTALLINE LATTICE STRUCTURE',
            subtitle: 'Orthorhombic Unit Cell — Sub-Nanometer Resolution',
            summary: 'Kevlar-49 achieves 92.4% crystallinity with an orthorhombic unit cell optimized for maximum tensile load transfer.',
            deep_explanation: 'The unit cell of Kevlar-49 has dimensions a = 7.87 Å, b = 5.18 Å, c = 12.9 Å (chain axis repeat). This orthorhombic symmetry means the structure has three mutually perpendicular axes of different lengths. The crystal density is 1.44 g/cm³. Crystalline regions are connected by amorphous tie molecules that act as load-transfer bridges between crystallites. Higher crystallinity correlates with higher elastic modulus: Kevlar-29 at 70.5 GPa (standard), Kevlar-49 at 112 GPa (high modulus), and Kevlar-149 at 186 GPa (ultra-high modulus). The trade-off is that higher crystallinity slightly reduces elongation at break.',
            key_points: [
                'Unit cell: a=7.87 Å, b=5.18 Å, c=12.9 Å',
                'Crystal system: Orthorhombic',
                'Crystallinity: 92.4% (Kevlar-49)',
                'Crystal density: 1.44 g/cm³',
                'Amorphous tie molecules transfer inter-crystallite load',
                'Higher crystallinity → higher modulus, lower elongation'
            ],
            visual_suggestions: ['unit_cell', 'lattice_grid', 'crystallite_map'],
            highlight_targets: ['unit_cell', 'tie_molecules'],
            animation_type: 'lattice_rotation',
            model: 'kevlar',
            color: '#ffd700',
            accent: '#00d4ff'
        },

        'kevlar-history': {
            title: 'KEVLAR HISTORICAL TIMELINE',
            subtitle: 'From Accidental Discovery to Space Exploration',
            summary: 'Kevlar was accidentally discovered in 1965 by Stephanie Kwolek at DuPont, transforming modern material science and safety.',
            deep_explanation: 'In 1965, Stephanie Kwolek, a chemist at DuPont, was searching for a lightweight, strong fiber to replace steel in radial tires. She synthesized a cloudy, liquid-crystalline polymer solution that would normally be discarded. Upon spinning it, she discovered a fiber 5X stronger than steel. By 1971, it entered commercial production. In 1975, the first Kevlar bulletproof vests were introduced, and by 1988, Kevlar was adopted by NASA for aerospace protection. Stephanie Kwolek holds 17 patents and her discovery has saved thousands of lives globally.',
            key_points: [
                'Discovered in 1965 by Stephanie Kwolek (DuPont)',
                'Initial goal: replace steel in radial tires',
                'Commercial production started in 1971',
                'First bulletproof vests in 1975',
                'NASA adoption for space missions in 1988',
                'Thousands of lives saved globally'
            ],
            visual_suggestions: ['timeline_map', 'historical_documents', 'kwolek_profile'],
            highlight_targets: ['timeline_nodes', 'discovery_date'],
            animation_type: 'rgb_nodes',
            model: null,
            color: '#ffd700',
            accent: '#ff9900'
        },

        'research-database': {
            title: 'SCIENTIFIC RESEARCH DATABASE',
            subtitle: 'Literature, Patents, and Reaction Formulas',
            summary: 'The research database aggregates scientific literature, reaction kinematics, and molecular dynamics simulations of Kevlar.',
            deep_explanation: 'The research database grants access to core scientific literature regarding Poly-paraphenylene terephthalamide (PPTA). This includes Stephanie Kwolek’s original 1965 synthesis document (US Patent 3,287,323), ballistic performance analysis from the US Army Research Lab, Molecular Dynamics simulations scaling accurate to 99.2%, and UV degradation reviews indicating titanium dioxide (TiO₂) doping as a countermeasure. The live analytical module additionally calculates the condensation polymerization kinetics in real-time.',
            key_points: [
                'Original DuPont Synthesis Patent (1965)',
                'US Army ballistic performance evaluations',
                'Molecular Dynamics (MD) force-field simulations',
                'UV degradation and TiO₂ nano-coating studies',
                'Live condensation polymerization kinetic charting'
            ],
            visual_suggestions: ['document_scan', 'reaction_chart', 'kinetic_graph'],
            highlight_targets: ['literature_grid', 'reaction_formula'],
            animation_type: 'data_stream',
            model: null,
            color: '#00d4ff',
            accent: '#00ffcc'
        },

        'f1-safety': {
            title: 'FORMULA 1 SAFETY CELL TECHNOLOGY',
            subtitle: 'Kevlar-Carbon Composite Monocoque — 6G+ Crash Survival',
            summary: 'F1 survival cells use Kevlar-carbon fiber hybrid composites that protect drivers at 350+ km/h impact speeds.',
            deep_explanation: 'Formula 1 has used Kevlar since 1983 in monocoque chassis construction. The survival cell is a Kevlar-carbon fiber sandwich — carbon fiber provides stiffness while Kevlar provides impact energy absorption. In a high-speed crash, carbon fiber shatters in a controlled manner (progressive crushing), while Kevlar layers trap the debris and maintain structural integrity of the cockpit. Each F1 car contains approximately 12 kg of Kevlar. After Ayrton Senna\'s fatal crash at Imola in 1994, Kevlar adoption in safety structures was dramatically accelerated. Modern F1 survival cells can withstand lateral impacts exceeding 6G while keeping the cockpit intact.',
            key_points: [
                'Kevlar in F1 since 1983 (monocoque construction)',
                '~12 kg of Kevlar per car in safety structures',
                'Hybrid composite: carbon (stiffness) + Kevlar (impact absorption)',
                'Crash survival rating: 6G+ lateral impact',
                'Post-Senna safety revolution (1994)',
                'Used in survival cell, HANS device, fuel tank protection'
            ],
            visual_suggestions: ['monocoque_cutaway', 'crash_simulation', 'layer_diagram'],
            highlight_targets: ['safety_cell', 'kevlar_layers', 'impact_zone'],
            animation_type: 'crash_analysis',
            model: 'f1car',
            color: '#ff3344',
            accent: '#00d4ff'
        },

        'body-armor': {
            title: 'NIJ LEVEL IIIA+ BODY ARMOR',
            subtitle: 'Multi-Layer Kevlar Protection — 3,100+ Lives Saved',
            summary: 'Kevlar body armor uses 20-40 layers of woven fabric to stop handgun projectiles up to .44 Magnum.',
            deep_explanation: 'A NIJ Level IIIA Kevlar vest uses 20-40 layers of tightly woven Kevlar-KM2 fabric, weighing only 2.5-3.2 kg total. For comparison, equivalent steel armor would weigh ~25 kg. The multi-layer design creates a graduated energy absorption system: outer layers catch the projectile, middle layers spread the force laterally, and inner layers minimize backface deformation. The vest is rated for multi-hit capability — 6+ rounds within a 5-inch radius. Each subsequent hit reduces protection by approximately 8-12%. The first documented life saved by a Kevlar vest occurred December 23, 1975 — Officer Richard Davis in Detroit. Since then, over 3,100 documented lives saved.',
            key_points: [
                'NIJ Level IIIA+ — highest soft armor rating',
                '20-40 layers of Kevlar-KM2 fabric',
                'Weight: 2.5-3.2 kg (vs ~25 kg steel equivalent)',
                'Multi-hit: 6+ rounds in 5-inch radius',
                'Backface deformation: 25-35 mm (limit: 44 mm)',
                '3,100+ documented lives saved since 1975'
            ],
            visual_suggestions: ['layer_cross_section', 'energy_cascade', 'protection_zones'],
            highlight_targets: ['outer_layers', 'mid_layers', 'backface'],
            animation_type: 'layer_penetration',
            model: 'bullet',
            color: '#00d4ff',
            accent: '#00ff88'
        },

        'synthesis-reaction': {
            title: 'CONDENSATION POLYMERIZATION SYNTHESIS',
            subtitle: 'PPD + TCl → PPTA + 2n HCl',
            summary: 'Kevlar is synthesized through condensation polymerization of phenylenediamine and terephthaloyl chloride.',
            deep_explanation: 'The synthesis reaction combines 1,4-phenylenediamine (PPD) and terephthaloyl chloride (TCl) in N-methyl-2-pyrrolidone (NMP) solvent with calcium chloride as HCl scavenger. The reaction proceeds: n H₂N−C₆H₄−NH₂ + n ClOC−C₆H₄−COCl → [−NH−C₆H₄−NH−CO−C₆H₄−CO−]ₙ + 2n HCl. The resulting liquid-crystalline solution (20% w/v in sulfuric acid) is dry-jet wet-spun through spinnerets with 51-64 μm diameter holes. Fibers pass through a 12-25 mm air gap for initial molecular orientation, then enter a cold water coagulation bath. Final heat treatment at 400-550°C maximizes crystallinity to 92.4%.',
            key_points: [
                'Reactants: PPD + TCl in NMP/CaCl₂ solvent',
                'Reaction type: Condensation polymerization',
                'Byproduct: 2n HCl (neutralized by CaCl₂)',
                'Spinning: Dry-jet wet-spinning through 51-64 μm spinnerets',
                'Air gap: 12-25 mm for molecular orientation',
                'Heat treatment: 400-550°C for max crystallinity'
            ],
            visual_suggestions: ['reaction_equation', 'spinning_process', 'molecular_alignment'],
            highlight_targets: ['reactants', 'polymer_chain', 'spinneret'],
            animation_type: 'synthesis_flow',
            model: null,
            heroImage: 'CONDENSATION_POLYMERIZATION_SYNTHESIS.png',
            color: '#00ff88',
            accent: '#00d4ff'
        },

        'system-analytics': {
            title: 'KEVIN AI — NEURAL SYSTEM DIAGNOSTICS',
            subtitle: 'Real-Time Performance Monitoring Dashboard',
            summary: 'The system analytics panel monitors all AI subsystem performance in real-time, from neural processing load to voice engine status.',
            deep_explanation: 'KEVIN AI operates as a multi-module autonomous system. The Neural Core processes natural language input against a 100+ data point knowledge base with zero-latency local inference — no API calls, no internet dependency. The Voice Engine synthesizes speech using 14+ language models through the Web Speech API. The HUD Renderer maintains 60 FPS canvas rendering with hardware-accelerated 2D compositing. The Holographic Core manages 350-1200 particles in real-time 3D projection. The Prediction Engine (Nostradamus) calculates scientific indicators — EFI (Entropy of Failure Index), IGI (Instability Gradient Index), and DTD (Digital Twin Divergence) — in real-time during stress tests.',
            key_points: [
                'Neural Core: 100+ knowledge points, zero-latency local AI',
                'Voice Engine: 14 language models, Web Speech API',
                'HUD Renderer: 60 FPS hardware-accelerated canvas',
                'Holographic Core: 350-1200 dynamic particles',
                'Prediction: EFI + IGI + DTD scientific indicators',
                'WebSocket: Real-time Pi communication at 10 Hz'
            ],
            visual_suggestions: ['system_diagram', 'performance_graph', 'module_map'],
            highlight_targets: ['neural_core', 'voice_module', 'hud_module'],
            animation_type: 'system_pulse',
            model: null,
            color: '#00d4ff',
            accent: '#00ff88'
        },

        'live-telemetry': {
            title: 'LIVE TELEMETRY DATA STREAM',
            subtitle: 'HX711 Load Cell — 10 Hz Real-Time Force Acquisition',
            summary: 'The telemetry system streams force data from the HX711 24-bit ADC at 10 Hz, enabling real-time stress analysis and failure prediction.',
            deep_explanation: 'The HX711 24-bit ADC module reads force data from a precision load cell calibrated for the expected Kevlar break force range. At 10 Hz sampling rate with 0.1-gram resolution, the system captures micro-fiber failures as subtle force fluctuations long before catastrophic rupture occurs. Raw ADC values are transmitted via WebSocket protocol from the Raspberry Pi 3B to the KEVIN AI interface. The force data is simultaneously displayed as real-time graphs and fed into the Nostradamus prediction engine for derivative analysis (dF/dt and d²F/dt²). The Applied Force gauge shows instantaneous load, while the graph traces the complete force-time history.',
            key_points: [
                'ADC: HX711 24-bit, 10 Hz sampling',
                'Resolution: 0.1 gram force detection',
                'Transport: WebSocket from Raspberry Pi 3B',
                'Visualization: Real-time gauge + time-series graph',
                'Derivatives: dF/dt and d²F/dt² computed live',
                'Peak detection and anomaly flagging'
            ],
            visual_suggestions: ['data_flow', 'force_trace', 'sampling_diagram'],
            highlight_targets: ['force_gauge', 'graph', 'derivative'],
            animation_type: 'data_stream',
            model: null,
            color: '#00d4ff',
            accent: '#ff6600'
        },

        'prediction-engine': {
            title: 'NOSTRADAMUS PREDICTION ENGINE',
            subtitle: 'AI-Driven Catastrophic Failure Prediction',
            summary: 'The Nostradamus engine uses derivative analysis and entropy-based indicators to predict Kevlar failure 1-3 seconds before rupture.',
            deep_explanation: 'The prediction engine operates in five states: MONITORING → WARNING → CRITICAL → COUNTDOWN → RUPTURED. It computes three novel scientific indicators: EFI (Entropy of Failure Index) measures how disordered the force signal becomes as micro-fractures accumulate. IGI (Instability Gradient Index) tracks the spatial rate of change in structural integrity. DTD (Digital Twin Divergence) compares real sensor data against a mathematical material model calibrated via recursive least squares. When P(failure) exceeds threshold, the countdown begins — predicting exact rupture time using polynomial regression on the force curve. Accuracy: ±0.5-2 seconds.',
            key_points: [
                'States: MONITORING → WARNING → CRITICAL → COUNTDOWN → RUPTURED',
                'EFI: Entropy of Failure Index (signal disorder)',
                'IGI: Instability Gradient Index (spatial integrity rate)',
                'DTD: Digital Twin Divergence (model vs reality)',
                'Prediction: Polynomial regression on force curve',
                'Accuracy: ±0.5-2 seconds before catastrophic failure'
            ],
            visual_suggestions: ['state_machine', 'indicator_gauges', 'prediction_curve'],
            highlight_targets: ['efi_indicator', 'igi_indicator', 'countdown'],
            animation_type: 'prediction_flow',
            model: null,
            color: '#ff3344',
            accent: '#ffd700'
        },

        'led-status': {
            title: 'RGB LED STRESS VISUALIZATION',
            subtitle: 'Real-Time Physical Feedback via GPIO-Controlled LED Strip',
            summary: 'The RGB LED strip connected to Raspberry Pi GPIO provides real-time visual stress feedback synchronized with telemetry data.',
            deep_explanation: 'The RGB LED strip acts as a physical manifestation of the AI\'s analysis state — bridging the digital-physical divide. In STANDBY mode, LEDs breathe slowly in cyan, matching the HUD theme. During TENSIONING, they transition through a gradient from blue to orange with increasing pulse rate proportional to applied force. At CRITICAL state (when the prediction engine detects imminent failure), LEDs flash aggressively in red. This creates dramatic visual feedback during live demonstrations that communicates system state without requiring screen visibility. The LED controller on the Raspberry Pi receives state updates via the same WebSocket channel as telemetry data.',
            key_points: [
                'STANDBY: Cyan breathing animation (idle state)',
                'TENSIONING: Blue → Orange gradient, pulse rate ∝ force',
                'CRITICAL: Aggressive red flashing (failure imminent)',
                'Control: Raspberry Pi GPIO → RGB LED strip',
                'Sync: Same WebSocket channel as telemetry',
                'Purpose: Physical stress indicator for live demos'
            ],
            visual_suggestions: ['led_states', 'color_gradient', 'sync_diagram'],
            highlight_targets: ['led_strip', 'gpio_pins'],
            animation_type: 'led_cycle',
            model: null,
            color: '#00ff88',
            accent: '#ff3344'
        },

        'visual-feed': {
            title: 'ESP32-CAM VISUAL INTELLIGENCE',
            subtitle: 'Dual-Camera MJPEG Streaming at 640×480',
            summary: 'Two ESP32-CAM modules provide live video feeds integrated into the tactical HUD with crosshair overlay and timestamp.',
            deep_explanation: 'The visual feed system uses two ESP32-CAM modules mounted on the KEVLAR-REX hexapod chassis. Camera 1 focuses on the Kevlar sample elongation point for micro-deformation observation. Camera 2 provides a wide-angle view of the entire test setup. Both stream MJPEG at 640×480 resolution over Wi-Fi. The feeds are integrated into the KEVIN AI HUD as Picture-in-Picture panels with a cyan tactical filter, crosshairs overlay, and real-time timestamp. The system is designed for both local demonstration and remote monitoring — operators can observe the physical test while the AI provides simultaneous digital analysis.',
            key_points: [
                'Hardware: 2× ESP32-CAM modules',
                'Resolution: 640×480 MJPEG stream',
                'Camera 1: Close-up on sample elongation',
                'Camera 2: Wide-angle test setup view',
                'HUD integration: PiP with tactical overlay',
                'Features: Crosshairs, timestamp, recording indicator'
            ],
            visual_suggestions: ['camera_placement', 'feed_overlay', 'pip_layout'],
            highlight_targets: ['camera_1', 'camera_2', 'pip_panel'],
            animation_type: 'camera_sweep',
            model: null,
            color: '#00d4ff',
            accent: '#00ff88'
        },

        'kevlar-intel': {
            title: 'KEVLAR MATERIAL INTELLIGENCE',
            subtitle: 'Core Material Properties at a Glance',
            summary: 'The KEVLAR INTEL panel displays fundamental material properties of poly-paraphenylene terephthalamide in real-time.',
            deep_explanation: 'This intelligence panel aggregates the most critical material properties for rapid assessment. POLY-PARAPHENYLENE identifies the material class (aromatic polyamide). Tensile strength of 3,620 MPa places Kevlar at the apex of commercial fiber materials. Density of 1.44 g/cm³ means it\'s 81.7% lighter than equivalent steel. The NIJ Level IIIA+ rating confirms it meets the highest standard for soft body armor. The CONTEXT indicator shows what the AI is currently analyzing, providing real-time awareness of the system\'s focus state. This panel represents the operator\'s primary reference for material specifications.',
            key_points: [
                'Material: Poly-paraphenylene terephthalamide (PPTA)',
                'Tensile: 3,620 MPa — commercial fiber apex',
                'Density: 1.44 g/cm³ — 81.7% lighter than steel',
                'NIJ Level: IIIA+ (highest soft armor rating)',
                'Context: Real-time AI focus indicator',
                'Purpose: Operator quick-reference panel'
            ],
            visual_suggestions: ['property_radar', 'weight_comparison', 'nij_scale'],
            highlight_targets: ['material_class', 'tensile_value', 'density_value'],
            animation_type: 'data_reveal',
            model: null,
            color: '#00d4ff',
            accent: '#ff6600'
        },

        // ── SCENE CONTEXTS ──
        'scene-fiber': {
            title: 'FIBER ANALYSIS MODE',
            subtitle: 'Molecular-Level Structural Investigation',
            summary: 'Fiber analysis mode enables deep inspection of the poly-paraphenylene terephthalamide molecular chains and hydrogen bonding networks.',
            deep_explanation: 'In Fiber Analysis mode, the holographic core shifts to represent molecular-scale dynamics. The particle system visualizes the vibrational modes of polymer chains, with inter-particle connections representing hydrogen bonds. The knowledge base context shifts to prioritize structural chemistry queries. This mode is optimized for discussing crystallinity, molecular alignment, benzene ring orientation, and amide bond mechanics. The 3D visualization can render the complete PPTA molecular structure loaded from the kevlar.glb model.',
            key_points: [
                'Focus: Molecular chain structure',
                'Visualization: Polymer vibration dynamics',
                'H-bond network: 3.5 Å inter-chain spacing',
                'Crystallinity monitoring: 92.4% target',
                '3D model: kevlar.glb atomic structure',
                'Knowledge priority: Chemistry + Structure'
            ],
            visual_suggestions: ['chain_vibration', 'bond_network'],
            highlight_targets: ['polymer_chain', 'h_bonds'],
            animation_type: 'fiber_vibration',
            model: 'kevlar',
            color: '#00ff88',
            accent: '#00d4ff'
        },

        'scene-bullet': {
            title: 'BALLISTIC IMPACT ANALYSIS MODE',
            subtitle: 'Projectile Dynamics and Energy Absorption Modeling',
            summary: 'Ballistic mode simulates projectile impact on Kevlar weave, modeling energy distribution and backface deformation.',
            deep_explanation: 'The ballistic analysis mode configures all subsystems for impact simulation. The holographic core shifts to orange-red reactive coloring, representing high-energy dynamics. The knowledge base prioritizes NIJ rating queries, velocity calculations, energy absorption mechanics, and multi-hit analysis. The 3D viewport can load the bullet.glb model for detailed projectile geometry visualization. Force data in this mode is interpreted as impact energy rather than tensile load.',
            key_points: [
                '.44 Magnum: 490 m/s, 1,200 J kinetic energy',
                'Three absorption mechanisms activated',
                'Backface deformation tracking',
                'Multi-hit degradation modeling',
                '3D model: bullet.glb projectile geometry',
                'Knowledge priority: Ballistics + Protection'
            ],
            visual_suggestions: ['trajectory_arc', 'energy_distribution'],
            highlight_targets: ['projectile', 'impact_zone', 'wave_front'],
            animation_type: 'impact_simulation',
            model: 'bullet',
            color: '#ff3344',
            accent: '#ff6600'
        },

        'scene-molecular': {
            title: 'DEEP MOLECULAR SCAN MODE',
            subtitle: 'Crystalline Lattice at Sub-Nanometer Resolution',
            summary: 'Molecular mode provides the deepest level of structural analysis, visualizing unit cells and crystallographic data.',
            deep_explanation: 'Deep Molecular Scan mode renders the orthorhombic unit cell of Kevlar-49 with dimensions a=7.87Å, b=5.18Å, c=12.9Å. The holographic core transitions to gold coloring representing the crystalline order. This mode supports queries about lattice parameters, crystallographic symmetry, unit cell geometry, and structure-property relationships. The 3D viewport can render space-filling models and ball-and-stick representations. Knowledge base context shifts to prioritize crystallography and advanced materials science.',
            key_points: [
                'Unit cell: Orthorhombic (a≠b≠c, all 90°)',
                'Dimensions: 7.87 × 5.18 × 12.9 Å',
                'Visualization: Space-filling + ball-and-stick',
                'Focus: Structure-property relationships',
                '3D model: kevlar.glb at atomic scale',
                'Knowledge priority: Crystallography + Advanced'
            ],
            visual_suggestions: ['unit_cell_3d', 'space_filling'],
            highlight_targets: ['unit_cell', 'axes', 'atoms'],
            animation_type: 'lattice_rotation',
            model: 'kevlar',
            color: '#ffd700',
            accent: '#00d4ff'
        },
    };

    // ─────────────────────────────────────────────
    // INTENT DETECTION — "explain this" type queries
    // ─────────────────────────────────────────────
    const EXPLAIN_INTENTS = [
        'explain this', 'explain', 'what is this', 'tell me more',
        'can you explain', 'what am i looking at', 'analyze this',
        'describe this', 'show me more', 'deep analysis',
        'break it down', 'help me understand', 'what does this mean',
        // Romanian
        'explica', 'ce e asta', 'ce este asta', 'mai multe detalii',
        'spune-mi mai mult', 'analizeaza asta', 'analizează asta',
        'ce inseamna', 'ce înseamnă', 'arata-mi', 'arată-mi',
    ];

    // ─────────────────────────────────────────────
    // INITIALIZATION
    // ─────────────────────────────────────────────
    function init(callbacks = {}) {
        onContextChange = callbacks.onContextChange || null;
        onExplanationTrigger = callbacks.onExplanationTrigger || null;

        // Global mouse tracking for context detection
        document.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseout', handleMouseOut, { passive: true });

        // Website panel iframe section detection
        initWebsiteOverlay();

        // Create the deep explanation section overlay
        createExplanationSection();

        console.log('[ContextEngine] Initialized — tracking data-kevin-context elements + website sections');
    }

    // ─────────────────────────────────────────────
    // WEBSITE PANEL — Direct IFrame Section Detection
    // ─────────────────────────────────────────────

    // Map main site sections chronologically (Top to Bottom)
    const IFRAME_SECTIONS = [
        { id: 'kevlar-structure', name: '3D MOLECULES', color: '#00d4ff', bridgeId: 'molecules' },
        { id: 'tensile-strength', name: 'KEVLAR vs STEEL vs ALUMINUM', color: '#ff9900', bridgeId: 'comparison' },
        { id: 'ballistic-impact', name: 'BALLISTIC IMPACT', color: '#ff4444', bridgeId: 'ballistic' },
        { id: 'kevlar-history', name: 'HISTORY & APPLICATIONS', color: '#ffd700', bridgeId: 'history' },
        { id: 'synthesis-reaction', name: 'VIRTUAL SYNTHESIS LAB', color: '#ff66ff', bridgeId: 'synthesis' },
        { id: 'research-database', name: 'RESEARCH DATABASE', color: '#00ffcc', bridgeId: 'research' }
    ];

    let activeWebsiteSection = null;

    function initWebsiteOverlay() {
        const iframe = document.getElementById('kevlar-iframe');
        if (!iframe) return;

        // Wait for iframe to load via polling if necessary, or onload event
        iframe.addEventListener('load', attachIframeListeners);

        // Try immediately in case it's already loaded or loading fast
        setTimeout(attachIframeListeners, 500);
        setTimeout(attachIframeListeners, 2000);
    }

    let iframeListenersAttached = false;
    function attachIframeListeners() {
        if (iframeListenersAttached) return;

        const iframe = document.getElementById('kevlar-iframe');
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.readyState === 'complete') {
                // Attach scroll and mousemove to trigger tracking
                iframeDoc.addEventListener('mousemove', updateIframeContext, { passive: true });
                if (iframe.contentWindow) {
                    iframe.contentWindow.addEventListener('scroll', updateIframeContext, { passive: true });
                }

                iframeListenersAttached = true;
                console.log('[ContextEngine] Successfully attached directly to local iframe DOM');

                // Initial update
                setTimeout(updateIframeContext, 500);
            }
        } catch (e) {
            console.warn('[ContextEngine] IFrame is cross-origin or not ready; direct DOM access failed.');
        }
    }

    function updateIframeContext() {
        const iframe = document.getElementById('kevlar-iframe');
        if (!iframe || !iframe.contentWindow) return;

        let ratio = 0;
        try {
            const win = iframe.contentWindow;
            const scrollY = win.scrollY || 0;
            let docH = 0;
            if (win.document && win.document.body) {
                docH = Math.max(win.document.body.scrollHeight, win.document.documentElement.scrollHeight);
            }
            const innerH = win.innerHeight || 0;

            if (docH > innerH) {
                ratio = scrollY / (docH - innerH);
            }
        } catch (e) {
            // Blocked by CORS. The window message listener will handle it.
            return;
        }

        processScrollRatio(ratio);
    }

    // Secure cross-origin receiver in case file:// protocols block direct DOM access
    window.addEventListener('message', (e) => {
        if (!e.data || !e.data.type) return;

        switch (e.data.type) {
            case 'KEVIN_IFRAME_SCROLL':
                // Legacy, ignored now.
                break;
            case 'KEVIN_IFRAME_SECTION_VISIBLE':
                processSectionVisible(e.data.contextId);
                break;
            case 'KEVIN_IFRAME_HOVER_IN':
                iframeHoveredContext = e.data.contextId;
                if (e.data.contextId && e.data.contextId !== currentContext) {
                    previousContext = currentContext;
                    currentContext = e.data.contextId;
                    currentContextEl = null; // Sourced from iframe
                    contextTimestamp = Date.now();

                    // ── GLOBAL EXPOSURE ──
                    window.currentKevinContext = currentContext;

                    updateContextDisplay(currentContext);
                    updateScanningLabel(currentContext);

                    if (onContextChange) {
                        onContextChange({
                            context: currentContext,
                            previous: previousContext,
                            element: null,
                            timestamp: contextTimestamp,
                            source: 'iframe-hover',
                            sectionName: getExplanation(currentContext) ? getExplanation(currentContext).title : 'Unknown'
                        });
                    }
                }
                break;
            case 'KEVIN_IFRAME_HOVER_OUT':
                iframeHoveredContext = null;
                // Revert to the scrolled section context if needed
                if (activeWebsiteSection) {
                    const sectionData = IFRAME_SECTIONS.find(s => s.name === activeWebsiteSection);
                    if (sectionData && sectionData.id !== currentContext) {
                        previousContext = currentContext;
                        currentContext = sectionData.id;
                        window.currentKevinContext = currentContext;
                        updateContextDisplay(currentContext);
                        updateScanningLabel(currentContext);
                    }
                }
                break;
            case 'KEVIN_IFRAME_KEYPRESS':
                const chatInput = document.getElementById('chat-input');
                if (chatInput) {
                    chatInput.focus();
                    if (e.data.key !== 'Backspace' && e.data.key.length === 1) {
                        chatInput.value += e.data.key;
                    }
                }
                break;
        }
    });

    function processSectionVisible(newContextId) {
        // Find section data based on exact ID from intersection observer/scroll center
        const sectionData = IFRAME_SECTIONS.find(s => s.id === newContextId);

        if (sectionData) {
            const isNewSection = sectionData.name !== activeWebsiteSection;
            const isContextDesync = currentContext !== sectionData.id;

            // Allow update if different, AND ONLY if no specific element is currently being hovered
            if ((isNewSection || isContextDesync) && !currentContextEl && !iframeHoveredContext) {
                activeWebsiteSection = sectionData.name;

                // Update the main context system
                const newContext = sectionData.id;
                if (newContext !== currentContext) {
                    previousContext = currentContext;
                    currentContext = newContext;
                    currentContextEl = null; // No specific DOM element in main document
                    contextTimestamp = Date.now();

                    // ── GLOBAL EXPOSURE ──
                    window.currentKevinContext = currentContext;

                    updateContextDisplay(currentContext);
                    updateScanningLabel(currentContext);

                    // Remove highlights from non-website elements in main doc
                    document.querySelectorAll('.kevin-context-highlight').forEach(el => {
                        el.classList.remove('kevin-context-highlight');
                    });

                    // Automatically highlight corresponding sidebar item (SiteBridge)
                    if (window.SiteBridge && window.SiteBridge.silentlyActivateSection) {
                        window.SiteBridge.silentlyActivateSection(sectionData.bridgeId);
                    }

                    if (onContextChange) {
                        onContextChange({
                            context: currentContext,
                            previous: previousContext,
                            element: null,
                            timestamp: contextTimestamp,
                            source: 'website-panel',
                            sectionName: sectionData.name
                        });
                    }
                }
            }
        }
    }

    // ─────────────────────────────────────────────
    // MOUSE TRACKING
    // ─────────────────────────────────────────────
    function handleMouseOver(e) {
        const el = e.target.closest('[data-kevin-context]');

        if (el) {
            const newContext = el.dataset.kevinContext;
            if (newContext !== currentContext) {
                previousContext = currentContext;
                currentContext = newContext;
                currentContextEl = el;
                contextTimestamp = Date.now();

                // ── GLOBAL EXPOSURE ──
                window.currentKevinContext = currentContext;

                // Update HUD context display
                updateContextDisplay(currentContext);

                // Update scanning HUD label
                updateScanningLabel(currentContext);

                // Add visual highlight to hovered element
                highlightContextElement(el);

                // Fire callback
                if (onContextChange) {
                    onContextChange({
                        context: currentContext,
                        previous: previousContext,
                        element: el,
                        timestamp: contextTimestamp
                    });
                }
            }
        }
    }

    function handleMouseOut(e) {
        const el = e.target.closest('[data-kevin-context]');
        if (el && el === currentContextEl) {
            // Only clear if the related target (where mouse went) is NOT inside the same context element
            const toEl = e.relatedTarget;
            if (!toEl || !el.contains(toEl)) {
                previousContext = currentContext;
                currentContext = null;
                currentContextEl = null;
                window.currentKevinContext = null;

                // Clear visual highlight
                el.classList.remove('kevin-context-highlight');

                // Update scanning label to idle
                updateScanningLabel(null);
            }
        }
    }

    function updateContextDisplay(contextId) {
        const ctxEl = document.getElementById('context-display');
        const intelBody = document.getElementById('intel-body');
        const stressBody = document.getElementById('stress-body');
        const rightPanelTitle = document.getElementById('right-panel-title');
        const rightPanelIcon = document.getElementById('right-panel-icon');

        if (ctxEl && contextId) {
            ctxEl.textContent = contextId.toUpperCase().replace(/-/g, ' ');
            ctxEl.style.color = '#ffd700';
            ctxEl.classList.add('context-active');

            // Brief glow animation
            ctxEl.style.textShadow = '0 0 15px rgba(255,215,0,0.8)';
            setTimeout(() => {
                ctxEl.style.textShadow = '0 0 8px rgba(255,215,0,0.4)';
            }, 300);

            // Smart Panel Switching
            if (intelBody && stressBody) {
                if (contextId === 'tensile-strength' || contextId === 'ballistic-impact') {
                    // Show Stress Simulator
                    intelBody.classList.add('hidden');
                    stressBody.classList.remove('hidden');
                    if (rightPanelTitle) { rightPanelTitle.textContent = 'STRESS SIMULATOR'; rightPanelTitle.style.color = '#ff3344'; }
                    if (rightPanelIcon) { rightPanelIcon.textContent = '⚠️'; rightPanelIcon.style.color = '#ff3344'; }
                } else {
                    // Show Default Intel
                    stressBody.classList.add('hidden');
                    intelBody.classList.remove('hidden');
                    if (rightPanelTitle) { rightPanelTitle.textContent = 'KEVLAR INTEL'; rightPanelTitle.style.color = ''; }
                    if (rightPanelIcon) { rightPanelIcon.textContent = '◆'; rightPanelIcon.style.color = ''; }

                    // Special case for History
                    if (contextId === 'kevlar-history' && rightPanelTitle) {
                        rightPanelTitle.textContent = 'HISTORY & APPLICATIONS';
                    }
                }
            }
        }
    }

    const SECTION_NAMES = {
        'kevlar-structure': '3D MOLECULAR STRUCTURE',
        'tensile-strength': 'KEVLAR vs STEEL — MATERIAL COMPARISON',
        'ballistic-impact': 'BALLISTIC IMPACT SIMULATION',
        'kevlar-history': 'HISTORY & APPLICATIONS',
        'stress-propagation': 'STRESS PROPAGATION TEST',
        'research-database': 'RESEARCH DATABASE',
        'synthesis-reaction': 'VIRTUAL SYNTHESIS LAB',
        'f1-safety': 'FORMULA 1 SAFETY CELL'
    };

    /**
     * Update the scanning HUD label — shows what KEVIN is currently tracking
     */
    function updateScanningLabel(contextId) {
        const scanLabel = document.getElementById('kevin-scan-label');
        if (!scanLabel) return;

        if (contextId) {
            const readableName = SECTION_NAMES[contextId] || contextId.toUpperCase().replace(/-/g, ' ');
            scanLabel.textContent = `◎ ANALYZING: ${readableName}`;
            scanLabel.classList.add('active');
            scanLabel.style.color = '#00ffcc';
            scanLabel.style.textShadow = '0 0 10px rgba(0,255,204,0.6)';
        } else {
            scanLabel.textContent = '◎ SCANNING SITE...';
            scanLabel.classList.remove('active');
            scanLabel.style.color = 'rgba(0,212,255,0.4)';
            scanLabel.style.textShadow = 'none';
        }
    }

    function highlightContextElement(el) {
        // Remove highlight from previous element
        document.querySelectorAll('.kevin-context-highlight').forEach(e => {
            e.classList.remove('kevin-context-highlight');
        });
        // Add highlight to new element
        el.classList.add('kevin-context-highlight');
    }

    // ─────────────────────────────────────────────
    // INTENT MATCHING
    // ─────────────────────────────────────────────
    function isExplainIntent(input) {
        const lower = input.toLowerCase().normalize('NFC').trim();
        return EXPLAIN_INTENTS.some(intent => lower.includes(intent));
    }

    function getCurrentContext() {
        return currentContext;
    }

    function getExplanation(contextId) {
        const id = contextId || currentContext;
        return EXPLANATIONS[id] || null;
    }

    function hasExplanation(contextId) {
        return !!EXPLANATIONS[contextId || currentContext];
    }

    // ─────────────────────────────────────────────
    // CINEMATIC NAVIGATION
    // ─────────────────────────────────────────────
    function navigateToExplanation(contextId, callbacks = {}) {
        const explanation = EXPLANATIONS[contextId];
        if (!explanation) {
            console.warn('[ContextEngine] No explanation for context:', contextId);
            return false;
        }

        isExplanationActive = true;

        // Step 1: Cinematic transition overlay
        showCinematicTransition(() => {
            // Step 2: Show explanation section
            showExplanationSection(explanation);

            // Step 3: Callback for post-navigation actions
            if (callbacks.onReady) callbacks.onReady(explanation);
        });

        return true;
    }

    function showCinematicTransition(onComplete) {
        const transition = document.createElement('div');
        transition.className = 'cinematic-transition';
        transition.id = 'cinematic-transition-overlay';
        document.body.appendChild(transition);

        // Phase 1: Blur + darken (0-600ms)
        requestAnimationFrame(() => {
            transition.classList.add('active');
        });

        // Phase 2: Navigate after transition peak
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 800);

        // Phase 3: Fade out transition (after content loads)
        setTimeout(() => {
            transition.classList.add('fade-out');
            setTimeout(() => {
                transition.remove();
            }, 600);
        }, 1800);
    }

    // ─────────────────────────────────────────────
    // EXPLANATION SECTION — Fullscreen Overlay
    // ─────────────────────────────────────────────
    function createExplanationSection() {
        explanationSection = document.createElement('div');
        explanationSection.id = 'deep-explanation-section';
        explanationSection.className = 'deep-explanation-section hidden';
        explanationSection.innerHTML = `
            <div class="deep-explanation-backdrop"></div>
            <div class="deep-explanation-container">
                <!-- Header -->
                <div class="deep-explanation-header">
                    <div class="deep-exp-header-left">
                        <span class="deep-exp-icon">◈</span>
                        <span class="deep-exp-mode">DEEP ANALYSIS MODE</span>
                    </div>
                    <div class="deep-exp-header-center">
                        <span class="deep-exp-context-label" id="deep-exp-context-label">CONTEXT</span>
                    </div>
                    <div class="deep-exp-header-right">
                        <button class="deep-exp-close" id="deep-exp-close" title="Close Analysis">✕</button>
                    </div>
                </div>
                
                <!-- Main Content Split -->
                <div class="deep-explanation-body">
                    <!-- Left: 3D Viewport -->
                    <div class="deep-exp-viewport" id="deep-exp-viewport">
                        <canvas id="deep-exp-canvas"></canvas>
                        <div class="deep-exp-model-loading hidden" id="deep-exp-loading">
                            <div class="viz-loading-spinner"></div>
                            <div>LOADING 3D MODEL...</div>
                        </div>
                        <!-- Highlight overlay annotations -->
                        <div class="deep-exp-annotations" id="deep-exp-annotations"></div>
                        <!-- Particle canvas -->
                        <canvas id="deep-exp-particles" class="deep-exp-particles"></canvas>
                    </div>
                    
                    <!-- Right: Explanation Content -->
                    <div class="deep-exp-content" id="deep-exp-content">
                        <div class="deep-exp-title" id="deep-exp-title"></div>
                        <div class="deep-exp-subtitle" id="deep-exp-subtitle"></div>
                        <div class="deep-exp-divider"></div>
                        <div class="deep-exp-summary" id="deep-exp-summary"></div>
                        <div class="deep-exp-detail" id="deep-exp-detail"></div>
                        <div class="deep-exp-keypoints-label">KEY FINDINGS</div>
                        <div class="deep-exp-keypoints" id="deep-exp-keypoints"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(explanationSection);

        // Close button
        const closeBtn = explanationSection.querySelector('#deep-exp-close');
        closeBtn.addEventListener('click', closeExplanation);

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isExplanationActive) {
                closeExplanation();
            }
        });
    }

    function showExplanationSection(explanation) {
        if (!explanationSection) return;

        const section = explanationSection;
        section.classList.remove('hidden');

        // Set header context label
        const ctxLabel = section.querySelector('#deep-exp-context-label');
        if (ctxLabel) ctxLabel.textContent = explanation.title;

        // Set accent colors
        section.style.setProperty('--exp-color', explanation.color);
        section.style.setProperty('--exp-accent', explanation.accent);

        // Animate in after brief delay
        requestAnimationFrame(() => {
            section.classList.add('active');
        });

        // Render the explanation content with progressive animation
        renderExplanationContent(explanation);

        // Start particles in viewport
        startExplanationParticles(explanation);

        // If has 3D model, load it
        if (explanation.model) {
            loadExplanationModel(explanation);
        } else if (explanation.heroImage) {
            showImageVisualization(explanation);
        } else if (explanation.animation_type === 'rgb_nodes') {
            showRGBVisualizer(explanation);
        } else {
            // Show animated background pattern instead
            showAbstractVisualization(explanation);
        }
    }

    function renderExplanationContent(exp) {
        const titleEl = document.getElementById('deep-exp-title');
        const subtitleEl = document.getElementById('deep-exp-subtitle');
        const summaryEl = document.getElementById('deep-exp-summary');
        const detailEl = document.getElementById('deep-exp-detail');
        const keypointsEl = document.getElementById('deep-exp-keypoints');

        // Clear previous
        if (titleEl) titleEl.textContent = '';
        if (subtitleEl) subtitleEl.textContent = '';
        if (summaryEl) summaryEl.textContent = '';
        if (detailEl) detailEl.textContent = '';
        if (keypointsEl) keypointsEl.innerHTML = '';

        // Progressive reveal with typewriter effects
        // Title: immediate
        setTimeout(() => {
            if (titleEl) {
                titleEl.style.color = exp.color;
                typewriterEffect(titleEl, exp.title, 30);
            }
        }, 200);

        // Subtitle: 0.8s
        setTimeout(() => {
            if (subtitleEl) typewriterEffect(subtitleEl, exp.subtitle, 20);
        }, 800);

        // Summary: 1.5s
        setTimeout(() => {
            if (summaryEl) typewriterEffect(summaryEl, exp.summary, 15);
        }, 1500);

        // Deep explanation: 3s
        setTimeout(() => {
            if (detailEl) typewriterEffect(detailEl, exp.deep_explanation, 10);
        }, 3000);

        // Key points: staggered from 5s
        if (exp.key_points) {
            exp.key_points.forEach((point, i) => {
                setTimeout(() => {
                    const kp = document.createElement('div');
                    kp.className = 'deep-exp-keypoint';
                    kp.style.borderLeftColor = exp.color;
                    kp.style.setProperty('--kp-delay', `${i * 0.15}s`);

                    const icon = document.createElement('span');
                    icon.className = 'kp-icon';
                    icon.textContent = '◆';
                    icon.style.color = exp.color;

                    const text = document.createElement('span');
                    text.className = 'kp-text';
                    text.textContent = point;

                    kp.appendChild(icon);
                    kp.appendChild(text);
                    if (keypointsEl) keypointsEl.appendChild(kp);

                    // Animate in
                    requestAnimationFrame(() => {
                        kp.classList.add('visible');
                    });
                }, 5000 + i * 400);
            });
        }
    }

    function typewriterEffect(el, text, speed) {
        el.innerHTML = '';
        el.classList.add('text-decode-active');

        let i = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+={}[]|;:<>,.?/~';

        // Stateful map for numeric counting animations
        const numberAnimators = new Map();
        let isFullyTyped = false;
        let animFrameId = null;

        function processText(str) {
            let p = str;
            // 1. Acronyms/Uppercase
            p = p.replace(/\b([A-Z]{2,}[0-9A-Z-]*)\b/g, '<span class="data-highlight-uppercase">$1</span>');

            // 2. Numbers with optional units, smoothly interpolated
            p = p.replace(/\b(\d+(?:,\d+)?(?:\.\d+)?)\s*(%|MPa|GPa|J|m\/s|kg|mm|cm|Å|kHz|Hz|kJ\/mol|hours)?\b/g, (match, numStr, unit, offset) => {
                const numVal = parseFloat(numStr.replace(/,/g, ''));
                if (isNaN(numVal)) return match;

                const animId = 'num_' + offset;
                const isYear = (!unit && numVal >= 1900 && numVal <= 2100 && !numStr.includes('.') && !numStr.includes(','));

                if (!numberAnimators.has(animId)) {
                    numberAnimators.set(animId, {
                        start: Date.now(),
                        duration: 800 + Math.random() * 1200, // 0.8s to 2s
                        target: numVal,
                        isYear: isYear,
                        unit: unit || '',
                        hasComma: numStr.includes(','),
                        hasDecimal: numStr.includes('.'),
                        decimals: numStr.includes('.') ? numStr.split('.')[1].length : 0
                    });
                }

                const anim = numberAnimators.get(animId);
                // Update target if the number is still typing (e.g. 3 -> 36 -> 362)
                if (anim.target !== numVal) {
                    anim.target = numVal;
                    anim.hasComma = numStr.includes(',');
                    anim.hasDecimal = numStr.includes('.');
                    anim.decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
                    anim.unit = unit || '';
                    anim.isYear = (!unit && numVal >= 1900 && numVal <= 2100 && !numStr.includes('.') && !numStr.includes(','));
                }

                const elapsed = Date.now() - anim.start;
                let currentVal;

                if (elapsed >= anim.duration) {
                    currentVal = anim.target;
                } else {
                    const progress = elapsed / anim.duration;
                    const easeOut = 1 - Math.pow(1 - progress, 3);

                    if (anim.isYear) {
                        currentVal = 2026 - Math.floor((2026 - anim.target) * easeOut);
                    } else {
                        currentVal = 1 + (anim.target - 1) * easeOut;
                    }
                }

                let displayStr;
                if (anim.hasComma && anim.decimals === 0) {
                    displayStr = Math.floor(currentVal).toLocaleString('en-US');
                } else if (anim.hasDecimal) {
                    displayStr = currentVal.toLocaleString('en-US', { minimumFractionDigits: anim.decimals, maximumFractionDigits: anim.decimals });
                } else {
                    displayStr = Math.floor(currentVal).toString();
                }

                return `<span class="data-highlight-number">${displayStr}${anim.unit ? ' ' + anim.unit : ''}</span>`;
            });

            // 3. System Keywords
            const keywords = ['force', 'failure', 'stress', 'impact', 'energy', 'polymer', 'crystalline', 'hydrogen', 'bond', 'velocity', 'entropy', 'derivative', 'prediction', 'kinetic', 'molecular'];
            const kwRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'gi');
            p = p.replace(kwRegex, '<span class="data-highlight-keyword">$&</span>');
            return p;
        }

        function renderFrame() {
            if (!isExplanationActive) return;

            let currentStr = text.substring(0, i);
            let scrambleHtml = '';

            if (!isFullyTyped) {
                let scrambleLimit = Math.min(text.length - i, 1 + Math.floor(Math.random() * 3));
                for (let s = 0; s < scrambleLimit; s++) {
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    scrambleHtml += `<span class="rgb-decode-char">${randomChar}</span>`;
                }
            }

            el.innerHTML = processText(currentStr) + scrambleHtml;

            let anyRunning = false;
            const now = Date.now();
            numberAnimators.forEach(anim => {
                if (now - anim.start < anim.duration) anyRunning = true;
            });

            if (!isFullyTyped || anyRunning) {
                animFrameId = requestAnimationFrame(renderFrame);
            } else {
                el.innerHTML = processText(text);
                el.classList.remove('text-decode-active');
                el.classList.add('rgb-completed');
            }
        }

        function typeStep() {
            if (!isExplanationActive || isFullyTyped) return;
            i += 1 + Math.floor(Math.random() * 2);
            if (i >= text.length) {
                i = text.length;
                isFullyTyped = true;
            } else {
                setTimeout(typeStep, speed * 0.5 + Math.random() * speed * 0.5);
            }
        }

        // Boot loops
        typeStep();
        animFrameId = requestAnimationFrame(renderFrame);
    }

    // ─────────────────────────────────────────────
    // 3D MODEL LOADING (for explanation viewport)
    // ─────────────────────────────────────────────
    let expScene, expCamera, expRenderer, expControls, expModel, expAnimFrame;
    let expComposer;

    function loadExplanationModel(explanation) {
        const viewport = document.getElementById('deep-exp-viewport');
        const canvas = document.getElementById('deep-exp-canvas');
        const loading = document.getElementById('deep-exp-loading');
        if (!viewport || !canvas) return;

        loading.classList.remove('hidden');

        const rect = viewport.getBoundingClientRect();
        const w = rect.width || 600;
        const h = rect.height || 500;

        // Renderer
        expRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        expRenderer.setSize(w, h);
        expRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        expRenderer.outputEncoding = THREE.sRGBEncoding;
        expRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        expRenderer.toneMappingExposure = 1.3;

        // Scene
        expScene = new THREE.Scene();
        if (explanation.model === 'f1car') {
            // Transparent background so cinematic racetrack canvas shows through
            expScene.background = null;
            expRenderer.setClearColor(0x000000, 0);
        } else {
            expScene.background = new THREE.Color(explanation.model === 'kevlar' ? 0x000000 : 0x000a14);
            expScene.fog = new THREE.FogExp2(explanation.model === 'kevlar' ? 0x000000 : 0x000a14, 0.02);
        }

        // Camera
        expCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
        expCamera.position.set(3, 2, 4);

        // Controls
        expControls = new THREE.OrbitControls(expCamera, canvas);
        expControls.enableDamping = true;
        expControls.dampingFactor = 0.05;
        expControls.autoRotate = true;
        expControls.autoRotateSpeed = 1.0;

        // Lighting
        const ambient = new THREE.AmbientLight(0x404060, 0.5);
        expScene.add(ambient);

        const key = new THREE.DirectionalLight(0xffffff, 1.0);
        key.position.set(5, 8, 5);
        expScene.add(key);

        const accent = new THREE.PointLight(new THREE.Color(explanation.color), 2, 20);
        accent.position.set(3, 1, 3);
        expScene.add(accent);

        const accent2 = new THREE.PointLight(new THREE.Color(explanation.accent), 1.5, 15);
        accent2.position.set(-3, 2, -2);
        expScene.add(accent2);

        // Grid
        if (explanation.model !== 'kevlar' && explanation.model !== 'f1car') {
            const gridColor = new THREE.Color(explanation.color);
            const grid = new THREE.GridHelper(20, 40, gridColor, 0x001122);
            grid.position.y = -0.01;
            grid.material.opacity = 0.12;
            grid.material.transparent = true;
            expScene.add(grid);
        }

        // Post-processing
        try {
            if (explanation.model === 'f1car') {
                // Post-processing breaks WebGL alpha transparency, skip it for F1
                expComposer = null;
            } else {
                expComposer = new THREE.EffectComposer(expRenderer);
                expComposer.addPass(new THREE.RenderPass(expScene, expCamera));
                expComposer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.85));
            }
        } catch (e) {
            expComposer = null;
        }

        // Model paths
        const MODELS = {
            kevlar: 'models/kevlar.glb',
            bullet: 'models/bullet.glb',
            f1car: 'models/f1_car.glb',
            lab: 'models/lab.glb',
        };

        const modelPath = MODELS[explanation.model];
        if (!modelPath) {
            loading.classList.add('hidden');
            animateExplanation(); // Ensure loop starts even without a 3D model
            return;
        }

        if (explanation.model === 'bullet') {
            loading.classList.add('hidden');
            expModel = new THREE.Object3D();
            expScene.add(expModel);
            animateExplanation();
        } else {
            const loader = new THREE.GLTFLoader();
            try {
                const dracoLoader = new THREE.DRACOLoader();
                dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
                loader.setDRACOLoader(dracoLoader);
            } catch (e) { console.warn('DRACOLoader not available'); }
            loader.load(modelPath, (gltf) => {
                if (!isExplanationActive) return;
                loading.classList.add('hidden');

                expModel = gltf.scene;
                const box = new THREE.Box3().setFromObject(expModel);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;

                expModel.scale.set(scale, scale, scale);
                expModel.position.sub(center.multiplyScalar(scale));
                if (explanation.model === 'kevlar') {
                    expModel.position.y = 0.2; // A slight offset if needed, mostly centered
                } else if (explanation.model === 'f1car') {
                    expModel.position.y = -0.6; // Push F1 lower so it rests correctly on the track
                    expModel.userData.isF1 = true;
                } else {
                    expModel.position.y = 0;
                }
                expModel.userData.baseY = expModel.position.y;

                expModel.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                expScene.add(expModel);
                expControls.target.set(0, size.y * scale * 0.3, 0);

                // Cinematic camera entrance
                const startPos = { x: expCamera.position.x * 2, y: expCamera.position.y * 2, z: expCamera.position.z * 2 };
                expCamera.position.set(startPos.x, startPos.y, startPos.z);
                animateCameraTo(expCamera, { x: 3, y: 2, z: 4 }, 2000);

                // Start render loop
                animateExplanation();
            }, null, () => {
                loading.classList.add('hidden');
                animateExplanation(); // Start render loop even on error, so canvas isn't black
            });
        }
    }

    function animateCameraTo(camera, target, duration) {
        const start = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        const startTime = performance.now();

        function step(now) {
            if (!isExplanationActive) return;
            const t = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            camera.position.x = start.x + (target.x - start.x) * ease;
            camera.position.y = start.y + (target.y - start.y) * ease;
            camera.position.z = start.z + (target.z - start.z) * ease;
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function animateExplanation() {
        if (!isExplanationActive || !expRenderer) return;
        expAnimFrame = requestAnimationFrame(animateExplanation);

        if (expControls) expControls.update();

        // Subtle model float
        if (expModel) {
            if (expModel.userData.baseY === undefined) {
                expModel.userData.baseY = expModel.position.y;
            }
            // Add a very subtle float (or none if it's a heavy car)
            const floatAmp = expModel.userData.isF1 ? 0 : 0.04;
            const floatSpeed = 0.001;
            expModel.position.y = expModel.userData.baseY + Math.sin(Date.now() * floatSpeed) * floatAmp;
        }

        if (expComposer) {
            expComposer.render();
        } else if (expRenderer && expScene && expCamera) {
            expRenderer.render(expScene, expCamera);
        }
    }

    function showImageVisualization(explanation) {
        const viewport = document.getElementById('deep-exp-viewport');
        if (!viewport) return;

        const canvas = document.getElementById('deep-exp-canvas');
        if (canvas) canvas.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'deep-exp-hero-img-wrap';
        wrapper.style.cssText = 'position:absolute;inset:0;overflow:hidden;z-index:0;background:#000;';

        const img = document.createElement('img');
        img.src = explanation.heroImage;
        img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;
            filter:brightness(0.6) contrast(1.1) saturate(1.2);
            animation: cinemaKenBurns 20s ease infinite alternate, cinemaFadeIn 1s ease forwards;`;

        wrapper.appendChild(img);
        viewport.insertBefore(wrapper, viewport.firstChild);
    }

    let abstractAnimFrame;
    let rgbAnimFrame;

    function showRGBVisualizer(explanation) {
        const canvas = document.getElementById('deep-exp-canvas');
        if (!canvas) return;

        const viewport = document.getElementById('deep-exp-viewport');
        const rect = viewport.getBoundingClientRect();
        const W = rect.width || 600;
        const H = rect.height || 500;

        canvas.width = W; 
        canvas.height = H;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        
        const ctx = canvas.getContext('2d');
        
        let nodes = [];
        let mouse = { x: -9999, y: -9999 };

        const NODE_COUNT = 120;
        const MAX_DIST = 165;
        const MOUSE_DIST = 350;
        const MOUSE_REPEL = 2.5;

        const PALETTE = [
          { h: 0   },
          { h: 30  },
          { h: 60  },
          { h: 120 },
          { h: 185 },
          { h: 210 },
          { h: 270 },
          { h: 300 },
        ];

        function hslToRgb(h, s, l) {
          s /= 100; l /= 100;
          const k = n => (n + h / 30) % 12;
          const a = s * Math.min(l, 1 - l);
          const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
          return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)];
        }

        function mkNode() {
          const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          return {
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.95,
            vy: (Math.random() - 0.5) * 0.95,
            r: Math.random() * 2.4 + 0.8,
            phase: Math.random() * Math.PI * 2,
            h: p.h + (Math.random() - 0.5) * 30,
            hub: Math.random() < 0.11,
            colorShiftSpeed: (Math.random() - 0.5) * 0.3,
          };
        }

        for (let i = 0; i < NODE_COUNT; i++) nodes.push(mkNode());

        viewport.addEventListener('mousemove', e => {
            const r = viewport.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        viewport.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

        function drawRGB() {
          if (!isExplanationActive) return;

          ctx.fillStyle = '#040d0a';
          ctx.fillRect(0, 0, W, H);
          const t = Date.now() * 0.001;

          nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0) { n.x = 0; n.vx *= -1; }
            if (n.x > W) { n.x = W; n.vx *= -1; }
            if (n.y < 0) { n.y = 0; n.vy *= -1; }
            if (n.y > H) { n.y = H; n.vy *= -1; }
            n.h = (n.h + n.colorShiftSpeed + 360) % 360;

            const mdx = n.x - mouse.x;
            const mdy = n.y - mouse.y;
            const md  = Math.hypot(mdx, mdy);
            if (md < MOUSE_DIST && md > 0) {
              const force = ((MOUSE_DIST - md) / MOUSE_DIST) * MOUSE_REPEL;
              n.x += (mdx / md) * force;
              n.y += (mdy / md) * force;
            }
          });

          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const a = nodes[i], b = nodes[j];
              const dx = a.x - b.x, dy = a.y - b.y;
              const dist = Math.hypot(dx, dy);
              if (dist < MAX_DIST) {
                const alpha = (1 - dist / MAX_DIST) * 0.6;
                const [ra, ga, ba] = hslToRgb(a.h, 90, 65);
                const [rb, gb, bb] = hslToRgb(b.h, 90, 65);
                const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                grad.addColorStop(0, `rgba(${ra},${ga},${ba},${alpha})`);
                grad.addColorStop(1, `rgba(${rb},${gb},${bb},${alpha})`);
                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.85;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }

          nodes.forEach(n => {
            const pulse  = 0.55 + 0.45 * Math.sin(t * (n.hub ? 1.1 : 1.9) + n.phase);
            const radius = (n.hub ? 5.5 : n.r) * (0.85 + 0.15 * pulse);
            const alpha  = n.hub ? 0.97 : (0.5 + 0.5 * pulse);
            const [r, g, b] = hslToRgb(n.h, 95, 65);

            if (n.hub) {
              ctx.beginPath();
              ctx.arc(n.x, n.y, radius * 3.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r},${g},${b},${0.06 * pulse})`;
              ctx.fill();
              ctx.beginPath();
              ctx.arc(n.x, n.y, radius * 1.9, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r},${g},${b},${0.14 * pulse})`;
              ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.shadowBlur  = n.hub ? 24 : 11;
            ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          rgbAnimFrame = requestAnimationFrame(drawRGB);
        }

        drawRGB();
    }

    function showAbstractVisualization(explanation) {
        const canvas = document.getElementById('deep-exp-canvas');
        if (!canvas) return;

        const viewport = document.getElementById('deep-exp-viewport');
        const rect = viewport.getBoundingClientRect();
        const w = rect.width || 600;
        const h = rect.height || 500;

        canvas.width = w * Math.min(window.devicePixelRatio, 2);
        canvas.height = h * Math.min(window.devicePixelRatio, 2);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio, 2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Animated network visualization
        const nodes = [];
        for (let i = 0; i < 60; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 1 + Math.random() * 3,
                hueOffset: Math.random() * 60,
            });
        }

        function drawAbstract() {
            if (!isExplanationActive) return;

            ctx.fillStyle = 'rgba(0, 10, 20, 0.1)';
            ctx.fillRect(0, 0, w, h);

            const baseColor = explanation.color;

            // Draw connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.3;
                        ctx.strokeStyle = `${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;

                ctx.beginPath();
                ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
                ctx.fillStyle = baseColor;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `${baseColor}15`;
                ctx.fill();
            }

            abstractAnimFrame = requestAnimationFrame(drawAbstract);
        }
        drawAbstract();
    }

    // ─────────────────────────────────────────────
    // CINEMATIC BACKGROUND SYSTEM — Per-Model Effects
    // ─────────────────────────────────────────────
    let expParticles = [];
    let expParticleAnim;

    function startExplanationParticles(explanation) {
        const canvas = document.getElementById('deep-exp-particles');
        if (!canvas) return;

        const viewport = document.getElementById('deep-exp-viewport');
        const rect = viewport.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        const w = rect.width, h = rect.height;
        const cx = w / 2, cy = h / 2;

        let modelType = 'default';
        if (explanation) {
            if (explanation.model) modelType = explanation.model;
            else if (explanation.title && explanation.title.includes('SYNTHESIS')) modelType = 'lab';
        }

        // No particles for lab/synthesis or rgb nodes
        if (modelType === 'lab' || (explanation && explanation.animation_type === 'rgb_nodes')) { expParticles = []; return; }

        const startTime = Date.now();

        // ═══════════════════════════════════════════════
        // KEVLAR — Molecular Neural Network + Orbital Rings
        // ═══════════════════════════════════════════════
        if (modelType === 'kevlar' || modelType === 'default') {
            const nodes = [];
            for (let i = 0; i < 100; i++) {
                nodes.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5, vy: -Math.random() * 0.8 - 0.2,
                    size: Math.random() * 2.5 + 0.5, alpha: Math.random() * 0.5 + 0.15,
                    phase: Math.random() * Math.PI * 2
                });
            }
            const rings = [];
            for (let i = 0; i < 5; i++) {
                rings.push({
                    rx: 80 + i * 55, ry: 35 + i * 22,
                    rot: Math.random() * Math.PI,
                    speed: (0.08 + Math.random() * 0.12) * (i % 2 === 0 ? 1 : -1),
                    dash: Math.random() * 50, alpha: 0.08 + Math.random() * 0.07
                });
            }

            function drawKevlar() {
                if (!isExplanationActive) return;
                expParticleAnim = requestAnimationFrame(drawKevlar);
                ctx.clearRect(0, 0, w, h);
                const t = Date.now() * 0.001;
                const fade = Math.min(1, (Date.now() - startTime) / 2000);

                // Connections
                ctx.lineWidth = 0.4;
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 90) {
                            ctx.strokeStyle = `hsla(190, 100%, 70%, ${(1 - d / 90) * 0.15 * fade})`;
                            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                        }
                    }
                }

                // Particles with glow
                for (const p of nodes) {
                    p.x += p.vx + Math.sin(t * 0.6 + p.phase) * 0.4;
                    p.y += p.vy;
                    if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
                    if (p.x < -5) p.x = w + 5;
                    if (p.x > w + 5) p.x = -5;
                    const ps = p.size + Math.sin(t * 2.5 + p.phase) * 0.6;
                    ctx.fillStyle = `hsla(190, 100%, 75%, ${p.alpha * fade})`;
                    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.5, ps), 0, Math.PI * 2); ctx.fill();
                    if (ps > 1.5) {
                        ctx.fillStyle = `hsla(190, 100%, 75%, ${p.alpha * 0.2 * fade})`;
                        ctx.beginPath(); ctx.arc(p.x, p.y, ps * 3, 0, Math.PI * 2); ctx.fill();
                    }
                }

                // Orbital rings
                ctx.save(); ctx.translate(cx, cy);
                for (const r of rings) {
                    r.rot += r.speed * 0.01; r.dash += 0.4;
                    ctx.save(); ctx.rotate(r.rot);
                    ctx.setLineDash([5, 14]); ctx.lineDashOffset = r.dash;
                    ctx.lineWidth = 0.8;
                    ctx.strokeStyle = `hsla(190, 100%, 65%, ${r.alpha * fade})`;
                    ctx.beginPath(); ctx.ellipse(0, 0, r.rx, r.ry, 0, 0, Math.PI * 2); ctx.stroke();
                    ctx.restore();
                }
                ctx.restore();

                // Hex data fragments
                ctx.font = '8px "Share Tech Mono", monospace';
                const hexC = '0123456789ABCDEF';
                for (let i = 0; i < 10; i++) {
                    const fx = (Math.sin(t * 0.2 + i * 1.7) * 0.5 + 0.5) * w;
                    const fy = ((t * 0.02 + i * 0.1) % 1) * h;
                    let txt = '';
                    for (let c = 0; c < 4; c++) txt += hexC[(Math.floor(t * 3 + i + c) * 7) % 16];
                    ctx.fillStyle = `hsla(50, 80%, 65%, ${0.12 * fade})`;
                    ctx.fillText(txt, fx, fy);
                }
            }
            drawKevlar();
        }

        // ═══════════════════════════════════════════════
        // F1 CAR — CINEMATIC RACETRACK BACKGROUND (from f1_cinematic_background.html)
        // ═══════════════════════════════════════════════
        else if (modelType === 'f1car') {
            let f1time = 0;

            /* ── Vanishing point ── */
            const VP_Y_RATIO = 0.48;
            const VP_X_RATIO = 0.50;

            /* ── Streaks ── */
            const f1streaks = Array.from({ length: 90 }, () => ({
                x: Math.random(), y: Math.random() * 0.45,
                len: 0.02 + Math.random() * 0.055,
                speed: 0.003 + Math.random() * 0.007,
                alpha: 0.08 + Math.random() * 0.35,
                width: 0.3 + Math.random() * 1.1,
                hue: Math.random() < 0.12 ? (Math.random() < 0.5 ? 130 : 220) : 195,
            }));

            /* ── Particles ── */
            const f1particles = Array.from({ length: 55 }, () => ({
                x: Math.random(), y: Math.random() * 0.5,
                r: 0.4 + Math.random() * 1.8,
                alpha: 0.15 + Math.random() * 0.5,
                speed: 0.0004 + Math.random() * 0.0018,
                drift: (Math.random() - 0.5) * 0.0008,
            }));

            /* ── Dust ── */
            const f1dust = Array.from({ length: 18 }, () => ({
                x: Math.random(), y: Math.random() * 0.5,
                r: 3 + Math.random() * 7,
                alpha: 0.025 + Math.random() * 0.055,
                speed: 0.0002 + Math.random() * 0.0009,
            }));

            /* ── Road lights ── */
            const NUM_LIGHTS = 18;
            const roadLights = Array.from({ length: NUM_LIGHTS }, (_, i) => ({
                t: i / (NUM_LIGHTS - 1), side: i % 2 === 0 ? -1 : 1,
                hue: (i * 43) % 360, phase: Math.random() * Math.PI * 2,
            }));

            /* ── Tire marks ── */
            const tireMarks = Array.from({ length: 7 }, (_, i) => ({
                xOff: (Math.random() - 0.5) * 0.18,
                len: 0.06 + Math.random() * 0.12,
                tStart: 0.25 + i * 0.09,
                alpha: 0.06 + Math.random() * 0.09,
            }));

            /* ── Perspective project ── */
            function project(tx, tz) {
                const vpy = h * VP_Y_RATIO;
                const vpx = w * VP_X_RATIO;
                const roadHalfNear = w * 0.28;
                const roadHalfFar = w * 0.012;
                const easedZ = Math.pow(tz, 1.6);
                const halfW = roadHalfFar + (roadHalfNear - roadHalfFar) * easedZ;
                const py = vpy + (h * 0.52 - vpy) * Math.pow(tz, 0.7);
                const px = vpx + tx * halfW;
                return { x: px, y: py };
            }

            /* ── Draw sky ── */
            function drawF1Sky() {
                const vpy = h * VP_Y_RATIO;
                const bg = ctx.createLinearGradient(0, 0, 0, vpy * 1.05);
                bg.addColorStop(0, '#010308'); bg.addColorStop(0.4, '#050d1c');
                bg.addColorStop(0.75, '#091525'); bg.addColorStop(1, '#0e1f35');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, w, vpy * 1.05);

                const horizH = vpy * 0.06;
                const hgR = ctx.createLinearGradient(0, vpy - horizH, 0, vpy + horizH);
                hgR.addColorStop(0, 'rgba(0,0,0,0)');
                hgR.addColorStop(0.5, `rgba(${20 + 15 * Math.sin(f1time * 0.3)},${8 + 5 * Math.sin(f1time * 0.5 + 1)},${40 + 20 * Math.sin(f1time * 0.4 + 2)},0.22)`);
                hgR.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = hgR; ctx.fillRect(0, vpy - horizH, w, horizH * 2);

                const blobs = [
                    { x: 0.22, y: 0.18, rx: 0.28, ry: 0.14, r: 190, g: 30, b: 100, a: 0.07 },
                    { x: 0.75, y: 0.22, rx: 0.22, ry: 0.10, r: 10, g: 60, b: 180, a: 0.08 },
                    { x: 0.50, y: 0.12, rx: 0.35, ry: 0.10, r: 0, g: 120, b: 80, a: 0.06 },
                ];
                blobs.forEach(b => {
                    const gx = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.rx * w);
                    gx.addColorStop(0, `rgba(${b.r},${b.g},${b.b},${b.a})`);
                    gx.addColorStop(0.5, `rgba(${b.r},${b.g},${b.b},${b.a * 0.3})`);
                    gx.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.save(); ctx.scale(1, b.ry / b.rx); ctx.fillStyle = gx;
                    ctx.fillRect(0, 0, w, h / (b.ry / b.rx)); ctx.restore();
                });
            }

            /* ── Draw grandstands ── */
            function drawF1Grandstands() {
                const vpy = h * VP_Y_RATIO;
                const floorY = h * 0.5;
                ctx.save();
                const lx = w * 0.05, standW = w * 0.22, standH = h * 0.14;
                const standY = vpy - standH * 0.3;
                ctx.beginPath(); ctx.moveTo(lx, floorY); ctx.lineTo(lx, standY);
                ctx.lineTo(lx + standW * 0.6, standY - standH * 0.2);
                ctx.lineTo(lx + standW, standY - standH * 0.05);
                ctx.lineTo(lx + standW, floorY); ctx.closePath();
                const lgr = ctx.createLinearGradient(lx, standY - standH, lx, floorY);
                lgr.addColorStop(0, 'rgba(5,10,20,0.95)'); lgr.addColorStop(1, 'rgba(8,15,28,0.8)');
                ctx.fillStyle = lgr; ctx.fill();
                ctx.globalAlpha = 0.65;
                for (let row = 0; row < 9; row++) {
                    const ry = standY + row * (floorY - standY) / 10;
                    const rowAlpha = 0.15 + 0.05 * Math.sin(f1time * 1.5 + row * 0.8);
                    ctx.strokeStyle = `rgba(${30 + row * 8},${60 + row * 5},${100 + row * 6},${rowAlpha})`;
                    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx + 2, ry); ctx.lineTo(lx + standW - 2, ry); ctx.stroke();
                }
                ctx.globalAlpha = 1;
                const rx = w * 0.73, rStandW = w * 0.25;
                ctx.beginPath(); ctx.moveTo(rx, floorY); ctx.lineTo(rx, standY - standH * 0.1);
                ctx.lineTo(rx + rStandW * 0.4, standY - standH * 0.25);
                ctx.lineTo(rx + rStandW, standY); ctx.lineTo(rx + rStandW, floorY); ctx.closePath();
                const rgr = ctx.createLinearGradient(rx, standY - standH, rx, floorY);
                rgr.addColorStop(0, 'rgba(5,10,20,0.95)'); rgr.addColorStop(1, 'rgba(8,15,28,0.8)');
                ctx.fillStyle = rgr; ctx.fill();
                ctx.globalAlpha = 0.65;
                for (let row = 0; row < 9; row++) {
                    const ry = standY + row * (floorY - standY) / 10;
                    const rowAlpha = 0.15 + 0.05 * Math.sin(f1time * 1.2 + row * 1.1 + 2);
                    ctx.strokeStyle = `rgba(${100 + row * 4},${30 + row * 3},${60 + row * 5},${rowAlpha})`;
                    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx + 2, ry); ctx.lineTo(rx + rStandW - 2, ry); ctx.stroke();
                }
                ctx.globalAlpha = 1;
                for (let i = 0; i < 55; i++) {
                    const bx2 = lx + Math.random() * standW, by2 = standY + Math.random() * (floorY - standY);
                    const hue = (i * 67 + f1time * 40) % 360;
                    ctx.beginPath(); ctx.arc(bx2, by2, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue},90%,70%,${(0.4 + 0.6 * Math.random()) * 0.6})`; ctx.fill();
                }
                for (let i = 0; i < 55; i++) {
                    const bx2 = rx + Math.random() * rStandW, by2 = standY + Math.random() * (floorY - standY);
                    const hue = (i * 53 + f1time * 35 + 100) % 360;
                    ctx.beginPath(); ctx.arc(bx2, by2, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue},90%,70%,${(0.4 + 0.6 * Math.random()) * 0.6})`; ctx.fill();
                }
                ctx.restore();
            }

            /* ── Draw pit buildings ── */
            function drawF1PitBuildings() {
                const vpy = h * VP_Y_RATIO;
                ctx.save();
                const bx = w * 0.54, bw2 = w * 0.09, bh2 = h * 0.055;
                const by2 = vpy * 0.92;
                ctx.fillStyle = 'rgba(4,8,16,0.92)'; ctx.fillRect(bx, by2 - bh2, bw2, bh2);
                for (let wi = 0; wi < 5; wi++) {
                    const wx = bx + 4 + wi * (bw2 - 8) / 5, wy = by2 - bh2 + 5;
                    const ww = (bw2 - 8) / 5 - 3, wh2 = bh2 * 0.38;
                    const winHue = (wi * 55 + f1time * 30) % 360;
                    ctx.fillStyle = `hsla(${winHue},80%,55%,0.5)`; ctx.fillRect(wx, wy, ww, wh2);
                }
                ctx.strokeStyle = 'rgba(0,180,255,0.3)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(bx, by2 - bh2); ctx.lineTo(bx + bw2, by2 - bh2); ctx.stroke();
                ctx.restore();
            }

            /* ── Draw road ── */
            function drawF1Road() {
                const STEPS = 80;
                for (let i = 0; i < STEPS - 1; i++) {
                    const t0 = i / STEPS, t1 = (i + 1) / STEPS;
                    const pL0 = project(-1, t0), pR0 = project(1, t0);
                    const pL1 = project(-1, t1), pR1 = project(1, t1);
                    const darkness = 0.018 + 0.006 * ((i % 2 === 0) ? 1 : 0);
                    const gAsph = ctx.createLinearGradient(pL0.x, pL0.y, pR0.x, pR0.y);
                    gAsph.addColorStop(0, `rgba(10,12,18,${darkness * 6})`);
                    gAsph.addColorStop(0.15, `rgba(14,16,22,${darkness * 8})`);
                    gAsph.addColorStop(0.5, `rgba(16,18,26,${darkness * 9})`);
                    gAsph.addColorStop(0.85, `rgba(14,16,22,${darkness * 8})`);
                    gAsph.addColorStop(1, `rgba(10,12,18,${darkness * 6})`);
                    ctx.beginPath(); ctx.moveTo(pL0.x, pL0.y); ctx.lineTo(pR0.x, pR0.y);
                    ctx.lineTo(pR1.x, pR1.y); ctx.lineTo(pL1.x, pL1.y); ctx.closePath();
                    ctx.fillStyle = gAsph; ctx.fill();
                }
                const pLH = project(-1, 0), pRH = project(1, 0);
                const pLC = project(-1, 1), pRC = project(1, 1);
                const roadGrad = ctx.createLinearGradient(w * 0.5, pLH.y, w * 0.5, pLC.y);
                roadGrad.addColorStop(0, 'rgba(8,11,18,0.5)'); roadGrad.addColorStop(0.4, 'rgba(11,14,22,0.7)');
                roadGrad.addColorStop(1, 'rgba(7,9,14,0.85)');
                ctx.beginPath(); ctx.moveTo(pLH.x, pLH.y); ctx.lineTo(pRH.x, pRH.y);
                ctx.lineTo(pRC.x, pRC.y); ctx.lineTo(pLC.x, pLC.y); ctx.closePath();
                ctx.fillStyle = roadGrad; ctx.fill();

                // Road reflection
                ctx.save(); ctx.globalCompositeOperation = 'screen';
                for (let i = 0; i < 59; i++) {
                    const t0 = i / 60, t1 = (i + 1) / 60;
                    const pL0r = project(-0.18, t0), pR0r = project(0.18, t0);
                    const pL1r = project(-0.18, t1), pR1r = project(0.18, t1);
                    const hue = (f1time * 25 + t0 * 180) % 360;
                    const alpha = 0.04 + 0.03 * Math.sin(f1time * 1.8 + t0 * 6);
                    const gRef = ctx.createLinearGradient(pL0r.x, pL0r.y, pR0r.x, pR0r.y);
                    gRef.addColorStop(0, 'rgba(0,0,0,0)');
                    gRef.addColorStop(0.4, `hsla(${hue},100%,60%,${alpha})`);
                    gRef.addColorStop(0.6, `hsla(${(hue + 40) % 360},100%,60%,${alpha})`);
                    gRef.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.beginPath(); ctx.moveTo(pL0r.x, pL0r.y); ctx.lineTo(pR0r.x, pR0r.y);
                    ctx.lineTo(pR1r.x, pR1r.y); ctx.lineTo(pL1r.x, pL1r.y); ctx.closePath();
                    ctx.fillStyle = gRef; ctx.fill();
                }
                ctx.restore();

                // Lane markings
                const DASH_ON = 6, DASH_OFF = 4;
                for (let i = 0; i < 79; i++) {
                    if (i % (DASH_ON + DASH_OFF) >= DASH_ON) continue;
                    const t0 = i / 80, t1 = (i + 1) / 80;
                    const p0 = project(0, t0), p1 = project(0, t1);
                    ctx.strokeStyle = `rgba(210,215,225,${0.55 + 0.25 * Math.pow(t0, 1.5)})`;
                    ctx.lineWidth = 0.5 + 2.5 * Math.pow(t0, 0.9);
                    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
                }
                [-0.98, 0.98].forEach(side => {
                    ctx.beginPath(); let first = true;
                    for (let i = 0; i <= 80; i++) {
                        const t = i / 80, p = project(side, t);
                        ctx.lineWidth = 0.4 + 2.8 * Math.pow(t, 0.9);
                        if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
                    }
                    ctx.strokeStyle = 'rgba(200,205,215,0.55)'; ctx.stroke();
                });

                // Kerbs
                for (let side = -1; side <= 1; side += 2) {
                    for (let i = 0; i < 79; i++) {
                        const t0 = i / 80, t1 = (i + 1) / 80;
                        const inner0 = project(side * 0.98, t0), outer0 = project(side * 1.18, t0);
                        const inner1 = project(side * 0.98, t1), outer1 = project(side * 1.18, t1);
                        const stripe = Math.floor(i / 2) % 2 === 0;
                        const r2 = stripe ? 220 : 240, g2 = stripe ? 30 : 238, b2 = stripe ? 40 : 240;
                        ctx.beginPath(); ctx.moveTo(inner0.x, inner0.y); ctx.lineTo(outer0.x, outer0.y);
                        ctx.lineTo(outer1.x, outer1.y); ctx.lineTo(inner1.x, inner1.y); ctx.closePath();
                        ctx.fillStyle = `rgba(${r2},${g2},${b2},${0.7 + 0.15 * Math.pow(t0, 1.2)})`; ctx.fill();
                    }
                }

                // Tire marks
                tireMarks.forEach(tm => {
                    const tEnd = tm.tStart + tm.len;
                    ctx.beginPath(); let first = true;
                    for (let i = 0; i <= 60; i++) {
                        const t = tm.tStart + i / 60 * (tEnd - tm.tStart);
                        if (t > 1) break;
                        const p = project(tm.xOff, t);
                        ctx.lineWidth = 0.8 + 3.5 * Math.pow(t, 0.9);
                        if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
                    }
                    ctx.strokeStyle = `rgba(0,0,0,${tm.alpha})`; ctx.stroke();
                });

                // Road lights
                roadLights.forEach(light => {
                    const pos = project(light.side * 1.25, light.t);
                    const pulse = 0.7 + 0.3 * Math.sin(f1time * 2.5 + light.phase);
                    const hue = (light.hue + f1time * 20) % 360;
                    const size = (1.5 + 4 * Math.pow(light.t, 0.8)) * pulse;
                    ctx.save(); ctx.globalCompositeOperation = 'screen';
                    const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 7);
                    glow.addColorStop(0, `hsla(${hue},100%,75%,${0.35 * pulse})`);
                    glow.addColorStop(0.3, `hsla(${hue},100%,60%,${0.12 * pulse})`);
                    glow.addColorStop(1, 'hsla(0,0%,0%,0)');
                    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(pos.x, pos.y, size * 7, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                    ctx.beginPath(); ctx.arc(pos.x, pos.y, size * 0.9, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue},100%,88%,${0.9 * pulse})`; ctx.fill();
                    if (light.t > 0.2) {
                        ctx.save(); ctx.globalCompositeOperation = 'screen';
                        const refLen = size * (6 + 10 * light.t);
                        const refGrad = ctx.createLinearGradient(pos.x, pos.y, pos.x, pos.y + refLen);
                        refGrad.addColorStop(0, `hsla(${hue},100%,65%,${0.25 * pulse})`);
                        refGrad.addColorStop(0.4, `hsla(${hue},100%,50%,${0.08 * pulse})`);
                        refGrad.addColorStop(1, 'hsla(0,0%,0%,0)');
                        ctx.fillStyle = refGrad; ctx.beginPath();
                        ctx.ellipse(pos.x, pos.y + refLen * 0.5, size * 1.5, refLen * 0.5, 0, 0, Math.PI * 2);
                        ctx.fill(); ctx.restore();
                    }
                });

                // Wet sheen
                ctx.save(); ctx.globalCompositeOperation = 'screen';
                for (let i = 0; i < 49; i++) {
                    const t0 = i / 50, t1 = (i + 1) / 50;
                    const pL0s = project(-0.95, t0), pR0s = project(0.95, t0);
                    const pL1s = project(-0.95, t1), pR1s = project(0.95, t1);
                    const sweep = 0.3 + 0.7 * ((Math.sin(f1time * 0.4 + t0 * 4) + 1) * 0.5);
                    const specX = pL0s.x + (pR0s.x - pL0s.x) * sweep;
                    const specW2 = (pR0s.x - pL0s.x) * 0.25;
                    const alpha = 0.025 * Math.pow(t0, 0.8);
                    const specGrad = ctx.createLinearGradient(specX - specW2, 0, specX + specW2, 0);
                    specGrad.addColorStop(0, 'rgba(0,0,0,0)');
                    specGrad.addColorStop(0.4, `rgba(120,160,200,${alpha})`);
                    specGrad.addColorStop(0.6, `rgba(140,180,220,${alpha * 1.5})`);
                    specGrad.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.beginPath(); ctx.moveTo(pL0s.x, pL0s.y); ctx.lineTo(pR0s.x, pR0s.y);
                    ctx.lineTo(pR1s.x, pR1s.y); ctx.lineTo(pL1s.x, pL1s.y); ctx.closePath();
                    ctx.fillStyle = specGrad; ctx.fill();
                }
                ctx.restore();
            }

            /* ── Draw ground (grass) ── */
            function drawF1Ground() {
                const sides = [-1, 1];
                sides.forEach(side => {
                    for (let i = 0; i < 49; i++) {
                        const t0 = i / 50, t1 = (i + 1) / 50;
                        const inner0 = project(side * 1.18, t0), outer0 = project(side * 2.0, t0);
                        const inner1 = project(side * 1.18, t1), outer1 = project(side * 2.0, t1);
                        const darkGrass = ctx.createLinearGradient(inner0.x, 0, outer0.x, 0);
                        darkGrass.addColorStop(0, 'rgba(6,18,10,0.9)');
                        darkGrass.addColorStop(0.5, 'rgba(8,22,12,0.8)');
                        darkGrass.addColorStop(1, 'rgba(4,12,7,0.95)');
                        ctx.beginPath(); ctx.moveTo(inner0.x, inner0.y); ctx.lineTo(outer0.x, outer0.y);
                        ctx.lineTo(outer1.x, outer1.y); ctx.lineTo(inner1.x, inner1.y); ctx.closePath();
                        ctx.fillStyle = darkGrass; ctx.fill();
                    }
                });
            }

            /* ── Draw barriers ── */
            function drawF1Barriers() {
                const STEPS = 50;
                const sides = [-1.5, 1.5];
                sides.forEach((side, si) => {
                    for (let i = 0; i < STEPS - 1; i++) {
                        const t0 = i / STEPS, t1 = (i + 1) / STEPS;
                        const p0 = project(side, t0), p1 = project(side, t1);
                        const barrH = 3 + 9 * Math.pow(t0, 0.7);
                        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p0.x, p0.y - barrH);
                        ctx.lineTo(p1.x, p1.y - barrH); ctx.lineTo(p1.x, p1.y); ctx.closePath();
                        const stripe = Math.floor(i / 3) % 2 === 0;
                        ctx.fillStyle = stripe ? 'rgba(220,20,30,0.82)' : 'rgba(235,235,235,0.82)'; ctx.fill();
                        ctx.save(); ctx.globalCompositeOperation = 'screen';
                        const sheen = ctx.createLinearGradient(p0.x, p0.y - barrH, p0.x, p0.y);
                        sheen.addColorStop(0, 'rgba(255,255,255,0.06)');
                        sheen.addColorStop(0.5, 'rgba(255,255,255,0.12)');
                        sheen.addColorStop(1, 'rgba(0,0,0,0)');
                        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p0.x, p0.y - barrH);
                        ctx.lineTo(p1.x, p1.y - barrH); ctx.lineTo(p1.x, p1.y); ctx.closePath();
                        ctx.fillStyle = sheen; ctx.fill(); ctx.restore();
                    }
                });
            }

            /* ── Draw gantry ── */
            function drawF1Gantry() {
                const t = 0.72;
                const leftP = project(-1.6, t), rightP = project(1.6, t);
                const gantryH = h * 0.085, poleH = h * 0.07;
                const gY = leftP.y - poleH - gantryH;
                ctx.save();
                ctx.strokeStyle = 'rgba(50,55,65,0.9)'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(leftP.x, leftP.y); ctx.lineTo(leftP.x, gY + gantryH); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(rightP.x, rightP.y); ctx.lineTo(rightP.x, gY + gantryH); ctx.stroke();
                ctx.strokeStyle = 'rgba(40,45,55,0.95)'; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(leftP.x, gY + gantryH * 0.5); ctx.lineTo(rightP.x, gY + gantryH * 0.5); ctx.stroke();
                ctx.save(); ctx.globalCompositeOperation = 'screen';
                const beamW = rightP.x - leftP.x;
                for (let i = 0; i < 30; i++) {
                    const bx2 = leftP.x + (i / 29) * beamW, by2 = gY + gantryH * 0.5;
                    const hue = (i * 12 + f1time * 60) % 360;
                    const gLed = ctx.createRadialGradient(bx2, by2, 0, bx2, by2, 12);
                    gLed.addColorStop(0, `hsla(${hue},100%,70%,0.7)`);
                    gLed.addColorStop(0.4, `hsla(${hue},100%,60%,0.2)`);
                    gLed.addColorStop(1, 'hsla(0,0%,0%,0)');
                    ctx.fillStyle = gLed; ctx.beginPath(); ctx.arc(bx2, by2, 12, 0, Math.PI * 2); ctx.fill();
                }
                ctx.restore();
                ctx.fillStyle = 'rgba(6,10,18,0.92)';
                ctx.fillRect(leftP.x + 10, gY, rightP.x - leftP.x - 20, gantryH);
                ctx.strokeStyle = 'rgba(0,150,255,0.35)'; ctx.lineWidth = 1.5;
                ctx.strokeRect(leftP.x + 10, gY, rightP.x - leftP.x - 20, gantryH);
                const fontSize = Math.max(8, gantryH * 0.45);
                ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                const textGrad = ctx.createLinearGradient(leftP.x, 0, rightP.x, 0);
                textGrad.addColorStop(0, '#ff2020'); textGrad.addColorStop(0.5, '#ffffff'); textGrad.addColorStop(1, '#2080ff');
                ctx.fillStyle = textGrad; ctx.fillText('FORMULA 1', (leftP.x + rightP.x) * 0.5, gY + gantryH * 0.5);
                ctx.restore();
            }

            /* ── Draw light rays ── */
            function drawF1LightRays() {
                ctx.save(); ctx.globalCompositeOperation = 'screen';
                for (let i = 0; i < 5; i++) {
                    const angle = -0.55 + i * 0.07;
                    const baseA = 0.010 + 0.005 * Math.sin(f1time * 0.45 + i * 0.9);
                    const spread = 0.038;
                    const ox = w * 0.78, oy = h * 0.02;
                    const rg = ctx.createLinearGradient(ox, oy, ox + Math.cos(angle) * w * 1.3, oy + Math.sin(angle) * h * 1.3);
                    rg.addColorStop(0, `rgba(80,130,200,${baseA * 4})`);
                    rg.addColorStop(0.25, `rgba(50,90,160,${baseA * 1.5})`);
                    rg.addColorStop(0.6, `rgba(20,50,100,${baseA * 0.5})`);
                    rg.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.beginPath(); ctx.moveTo(ox, oy);
                    ctx.lineTo(ox + Math.cos(angle - spread) * w * 1.8, oy + Math.sin(angle - spread) * h * 1.8);
                    ctx.lineTo(ox + Math.cos(angle + spread) * w * 1.8, oy + Math.sin(angle + spread) * h * 1.8);
                    ctx.closePath(); ctx.fillStyle = rg; ctx.fill();
                }
                ctx.restore();
            }

            /* ── Draw streaks + dust + particles ── */
            function drawF1Streaks() {
                ctx.save();
                f1streaks.forEach(s => {
                    const sx = s.x * w, sy = s.y * h, len = s.len * w;
                    const hue = s.hue + Math.random() * 15 - 7;
                    const grad = ctx.createLinearGradient(sx, sy, sx + len, sy);
                    grad.addColorStop(0, `hsla(${hue},60%,80%,0)`);
                    grad.addColorStop(0.3, `hsla(${hue},70%,85%,${s.alpha})`);
                    grad.addColorStop(1, `hsla(${hue},60%,80%,0)`);
                    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + len, sy);
                    ctx.strokeStyle = grad; ctx.lineWidth = s.width; ctx.stroke();
                    s.x -= s.speed;
                    if (s.x < -s.len) { s.x = 1 + Math.random() * 0.3; s.y = Math.random() * 0.46; }
                });
                ctx.restore();
                f1particles.forEach(p => {
                    const shimmer = 0.5 + 0.5 * Math.sin(f1time * 2.2 + p.x * 12);
                    ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(130,175,215,${p.alpha * shimmer * 0.5})`; ctx.fill();
                    p.x -= p.speed; p.y += p.drift;
                    if (p.x < 0) { p.x = 1; p.y = Math.random() * 0.5; }
                    if (p.y < 0) p.y = 0.5; if (p.y > 0.5) p.y = 0;
                });
                f1dust.forEach(d => {
                    ctx.beginPath(); ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(70,110,150,${d.alpha})`; ctx.fill();
                    d.x -= d.speed;
                    if (d.x < -0.05) { d.x = 1.05; d.y = Math.random() * 0.5; }
                });
            }


            /* ── Draw vignette + post-fx ── */
            function drawF1PostFX() {
                const vT = ctx.createLinearGradient(0, 0, 0, h * 0.28);
                vT.addColorStop(0, 'rgba(0,0,0,0.78)'); vT.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = vT; ctx.fillRect(0, 0, w, h);
                const vB = ctx.createLinearGradient(0, h * 0.72, 0, h);
                vB.addColorStop(0, 'rgba(0,0,0,0)'); vB.addColorStop(1, 'rgba(0,0,0,0.88)');
                ctx.fillStyle = vB; ctx.fillRect(0, 0, w, h);
                const vL = ctx.createLinearGradient(0, 0, w * 0.12, 0);
                vL.addColorStop(0, 'rgba(0,0,0,0.65)'); vL.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = vL; ctx.fillRect(0, 0, w, h);
                const vR = ctx.createLinearGradient(w, 0, w * 0.88, 0);
                vR.addColorStop(0, 'rgba(0,0,0,0.65)'); vR.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = vR; ctx.fillRect(0, 0, w, h);

                // Chromatic aberration
                ctx.save(); ctx.globalCompositeOperation = 'screen';
                const lE = ctx.createLinearGradient(0, 0, w * 0.07, 0);
                lE.addColorStop(0, 'rgba(0,25,55,0.10)'); lE.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = lE; ctx.fillRect(0, 0, w, h);
                const rE = ctx.createLinearGradient(w, 0, w * 0.93, 0);
                rE.addColorStop(0, 'rgba(25,0,55,0.08)'); rE.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = rE; ctx.fillRect(0, 0, w, h);
                ctx.restore();

                // Scanlines
                ctx.save(); ctx.globalAlpha = 0.012; ctx.fillStyle = 'rgba(0,0,0,1)';
                for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
                ctx.restore();
            }

            /* ── Main F1 cinematic loop ── */
            function drawF1Cinematic() {
                if (!isExplanationActive) return;
                expParticleAnim = requestAnimationFrame(drawF1Cinematic);
                f1time += 0.016;
                ctx.clearRect(0, 0, w, h);

                drawF1Sky();
                drawF1Streaks();
                drawF1Grandstands();
                drawF1PitBuildings();
                drawF1Ground();
                drawF1Road();
                drawF1Barriers();
                drawF1Gantry();
                drawF1LightRays();

                drawF1PostFX();
            }
            drawF1Cinematic();
        }

        else if (modelType === 'bullet') {
            const viewport = document.getElementById('deep-exp-viewport');
            const iframe = document.createElement('iframe');
            iframe.src = 'cinematic_room_bullet_bg.html';
            iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;z-index:4;pointer-events:none;';
            viewport.appendChild(iframe);
            return;
        }
    }

    // ─────────────────────────────────────────────
    // CLOSE EXPLANATION
    // ─────────────────────────────────────────────
    function closeExplanation() {
        isExplanationActive = false;

        // Clean up 3D
        if (expAnimFrame) cancelAnimationFrame(expAnimFrame);
        if (expParticleAnim) cancelAnimationFrame(expParticleAnim);
        if (abstractAnimFrame) cancelAnimationFrame(abstractAnimFrame);
        if (rgbAnimFrame) cancelAnimationFrame(rgbAnimFrame);
        if (expModel && expScene) expScene.remove(expModel);
        if (expRenderer) { expRenderer.dispose(); expRenderer = null; }

        // Clean up image wrapper if exists
        const imgWrap = document.querySelector('.deep-exp-hero-img-wrap');
        if (imgWrap) imgWrap.remove();

        expModel = null;
        expScene = null;
        expCamera = null;
        expControls = null;
        expComposer = null;

        // Animate out
        if (explanationSection) {
            explanationSection.classList.remove('active');
            setTimeout(() => {
                explanationSection.classList.add('hidden');
                // Destroy canvas to permanently wipe contexts (fixes WebGL/2D context crash)
                const oldCanvas = document.getElementById('deep-exp-canvas');
                if (oldCanvas && oldCanvas.parentNode) {
                    const newCanvas = document.createElement('canvas');
                    newCanvas.id = 'deep-exp-canvas';
                    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
                }
            }, 600);
        }
    }

    // ─────────────────────────────────────────────
    // KEVIN PROACTIVE CONTEXT AWARENESS
    // Kevin notices what you're looking at and offers insight
    // ─────────────────────────────────────────────
    function getProactiveMessage(contextId) {
        const messages = {
            'kevlar-structure': "I see you're examining the fiber structure. Want me to show you the molecular architecture in detail?",
            'tensile-strength': "I notice you're analyzing tensile data. I can break down the 3,620 MPa figure — it's fascinating. Say 'explain this'.",
            'hydrogen-bonds': "Ah, the hydrogen bonding network. This is the secret behind Kevlar's strength. I can show you the inter-chain dynamics.",
            'ballistic-impact': "Ballistic impact analysis. I can simulate a .44 Magnum striking Kevlar fabric at 490 m/s. Want to see?",
            'stress-propagation': "I see you're looking at stress propagation. This is where my Nostradamus prediction engine shines.",
            'crystal-lattice': "The crystalline lattice — 92.4% ordered perfection. I can render the orthorhombic unit cell for you.",
            'f1-safety': "Formula 1 safety technology. I can show you how 12 kg of Kevlar protects a driver at 350 km/h.",
            'body-armor': "Body armor analysis. 3,100 lives saved since 1975. I have the complete breakdown ready.",
            'synthesis-reaction': "The synthesis reaction. I can walk you through the entire condensation polymerization process.",
            'system-analytics': "My system diagnostics. All neural subsystems are at peak performance. Ask me to go deeper.",
            'live-telemetry': "Live telemetry stream. The HX711 is capturing force data at 10 Hz. I can explain the data pipeline.",
            'prediction-engine': "The Nostradamus engine. My pride. I predict catastrophic failure 1-3 seconds ahead. Want the technical breakdown?",
            'led-status': "LED status indicators — bridging the digital and physical world. I control those via GPIO.",
            'visual-feed': "ESP32-CAM visual feed. Dual cameras for multi-angle observation during stress tests.",
            'kevlar-intel': "The Kevlar intelligence summary. Every data point here has a story. Ask me about any one.",
        };
        return messages[contextId] || null;
    }

    // ─────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────
    return {
        init,
        getCurrentContext,
        getExplanation,
        hasExplanation,
        isExplainIntent,
        navigateToExplanation,
        closeExplanation,
        getProactiveMessage,
        isActive: () => isExplanationActive,
        EXPLANATIONS
    };
})();
