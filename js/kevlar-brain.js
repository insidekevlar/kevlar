/* ============================================
   KEVLAR BRAIN v2.0 — Local Intelligence Engine
   Encyclopedic Knowledge + NLP + Actions System
   Autonomous viz control — 3D scenes/highlights
   ============================================ */

window.KevlarBrain = (function() {
    'use strict';

    // ─────────────────────────────────────────────
    // SECTION 1: MASSIVE KNOWLEDGE DATABASE
    // ─────────────────────────────────────────────

    const KNOWLEDGE = {

        // ── CHEMISTRY ──
        chemistry: [
            { q: ['chemical', 'formula', 'structure', 'molecule', 'polymer', 'chimie', 'structura', 'molecul'], 
              a: "Kevlar is poly-paraphenylene terephthalamide, chemical formula [−CO−C₆H₄−CO−NH−C₆H₄−NH−]ₙ. It's an aromatic polyamide where para-oriented benzene rings create an exceptionally rigid polymer chain. The aromatic rings are linked by amide bonds (−CO−NH−) which allow controlled hydrogen bonding between adjacent chains, forming a 3D crystalline superlattice." },
            { q: ['hydrogen bond', 'h-bond', 'inter-chain', 'legatura hidrogen', 'legaturi'],
              a: "Hydrogen bonds between carbonyl (C=O) and amino (N−H) groups on adjacent chains create sheet-like structures. These sheets stack with a regular spacing of 3.5 Å, forming a highly ordered crystalline matrix. Each monomer unit participates in TWO hydrogen bonds — one from C=O and one from N−H — giving Kevlar its extraordinary cohesive strength." },
            { q: ['aromatic', 'benzene', 'ring', 'phenyl', 'aromatic ring', 'inel'],
              a: "The para-substituted benzene rings in Kevlar provide exceptional rigidity and thermal stability. Unlike flexible aliphatic chains, these aromatic rings resist rotation, keeping the polymer chain essentially rod-like. The π-electron conjugation across the rings adds additional stability. This planarity is THE reason Kevlar fibers are so strong — the molecules align almost perfectly along the fiber axis." },
            { q: ['polymerization', 'synthesis', 'make kevlar', 'how is kevlar made', 'fabricare', 'sinteza', 'polimerizare', 'produce'],
              a: "Kevlar is synthesized via condensation polymerization of 1,4-phenylenediamine (PPD) and terephthaloyl chloride (TCl) in N-methyl-2-pyrrolidone (NMP) solvent with calcium chloride. The reaction: n H₂N−C₆H₄−NH₂ + n ClOC−C₆H₄−COCl → [−NH−C₆H₄−NH−CO−C₆H₄−CO−]ₙ + 2n HCl. The HCl byproduct is neutralized by CaCl₂. The resulting liquid-crystalline solution is then dry-jet wet-spun through spinnerets." },
            { q: ['spinning', 'fiber production', 'spinneret', 'manufacturing', 'filare'],
              a: "Kevlar fibers are produced using dry-jet wet-spinning. The liquid-crystalline polymer solution (20% w/v in sulfuric acid) is extruded through spinnerets with holes of 51-64 μm diameter, passes through an air gap (12-25 mm) where initial molecular orientation occurs, then enters a cold water coagulation bath. The fibers are then washed, dried under tension, and heat-treated at 400-550°C to maximize crystallinity. This process achieves molecular alignment exceeding 90%." },
            { q: ['amide', 'peptide bond', 'nylon', 'comparison nylon'],
              a: "Like nylon, Kevlar is a polyamide (contains amide bonds −CO−NH−). However, nylon uses aliphatic (flexible) chains between amides, while Kevlar uses rigid aromatic rings. This seemingly small structural difference is monumental: nylon's tensile strength is ~75 MPa while Kevlar reaches 3,620 MPa — a 48x improvement. The aromatic backbone prevents chain coiling and enables near-perfect alignment along the fiber axis." },
            { q: ['crystallinity', 'crystal', 'lattice', 'unit cell', 'cristalinitate'],
              a: "Kevlar-49 achieves 92.4% crystallinity with an orthorhombic unit cell: a = 7.87 Å, b = 5.18 Å, c = 12.9 Å (chain repeat). The crystal density is 1.44 g/cm³. Crystalline regions are connected by amorphous tie molecules that transfer load between crystallites. Higher crystallinity means higher modulus but slightly lower elongation at break." },
            { q: ['types', 'grades', 'kevlar 29', 'kevlar 49', 'kevlar 149', 'tipuri'],
              a: "There are several commercial grades: Kevlar-29 (standard, tensile 3,620 MPa, modulus 70.5 GPa) — used in body armor and ropes. Kevlar-49 (high modulus, 3,620 MPa, modulus 112 GPa) — used in aerospace and composites. Kevlar-149 (ultra-high modulus, 3,400 MPa, modulus 186 GPa) — for extreme structural applications. Kevlar-KM2 — designed specifically for maximum ballistic resistance with enhanced energy absorption." },
        ],

        // ── MECHANICAL PROPERTIES ──
        mechanical: [
            { q: ['tensile', 'strength', 'strong', 'rezistenta', 'tractiune', 'puternic'],
              a: "Kevlar-49 has a tensile strength of 3,620 MPa — that's 3.62 BILLION Pascals of force per square meter. For perspective: structural steel yields at ~250 MPa, high-strength steel at ~500 MPa. By weight, Kevlar is 850% stronger than steel. A single Kevlar fiber (12 μm diameter) can support approximately 0.4 Newtons before breaking — equivalent to suspending a 40-gram weight from a thread thinner than a human hair." },
            { q: ['modulus', 'elasticity', 'stiffness', 'young', 'modul', 'elasticitate', 'rigiditate'],
              a: "Kevlar-49 has an elastic modulus of 112 GPa along the fiber axis, making it extremely stiff in tension. For comparison: steel is ~200 GPa, aluminum ~69 GPa, but remember — Kevlar is 5.5x LIGHTER than steel. The specific modulus (stiffness/density) of Kevlar is 77.8 GPa/(g/cm³), versus steel's 25.6. Perpendicular to the fiber axis, the modulus drops to just 1.34 GPa — this anisotropy is a critical engineering consideration." },
            { q: ['elongation', 'strain', 'stretch', 'break', 'alungire', 'deformare'],
              a: "Kevlar-49 elongates 2.4-3.6% before failure. This low elongation combined with high strength means Kevlar absorbs enormous energy before breaking. The stress-strain curve is nearly linear until catastrophic failure — there's no plastic deformation, no warning. When it breaks, it shatters like glass rather than stretching like rubber. This is why our predictive AI monitors the derivative dF/dt — the ONLY warning is a subtle change in stiffness as micro-fibers begin failing." },
            { q: ['density', 'weight', 'light', 'lightweight', 'densitate', 'greutate', 'usor'],
              a: "Kevlar's density is only 1.44 g/cm³ — compared to steel at 7.87 g/cm³ and aluminum at 2.70 g/cm³. This means a Kevlar component weighs 81.7% less than an equivalent steel one. A bulletproof vest made of steel would weigh ~25 kg; the same protection in Kevlar weighs under 3 kg. This weight advantage is why every gram matters in body armor, aerospace, and Formula 1." },
            { q: ['fatigue', 'cycle', 'lifetime', 'durability', 'oboseala', 'durabilitate'],
              a: "Kevlar retains approximately 92% of its original tensile strength after 500 million fatigue cycles at 50% ultimate load. This exceptional fatigue resistance is due to the rigid molecular chain — unlike metals, there are no dislocations to propagate cracks. However, Kevlar is susceptible to UV degradation and can lose 10-20% strength after prolonged sun exposure. UV-protective coatings are standard for outdoor applications." },
            { q: ['thermal', 'temperature', 'heat', 'fire', 'decomposition', 'termic', 'temperatura', 'foc'],
              a: "Kevlar begins thermal decomposition at 427°C (800°F) but maintains structural integrity up to ~300°C. It does NOT melt — it decomposes directly. At 149°C, it retains 90% of room-temperature strength. Kevlar is inherently flame-resistant with a Limiting Oxygen Index (LOI) of 29%, meaning it self-extinguishes in normal atmosphere. This makes it invaluable in firefighting gear, where temperatures can exceed 260°C." },
            { q: ['specific strength', 'strength to weight', 'comparison', 'comparatie', 'vs'],
              a: "Specific strength (strength/density): Kevlar = 2,514 kN·m/kg, Steel = 63.7 kN·m/kg, Aluminum = 222 kN·m/kg, Carbon Fiber = 2,457 kN·m/kg, Spider Silk = 1,069 kN·m/kg. Kevlar has the HIGHEST specific strength of any commercial fiber material, 39.5x that of steel. Only theoretical carbon nanotube ropes exceed it." },
        ],

        // ── BALLISTIC PROTECTION ──
        ballistics: [
            { q: ['ballistic', 'bullet', 'bulletproof', 'body armor', 'vest', 'glont', 'antiglont', 'vesta'],
              a: "Kevlar body armor stops projectiles by distributing impact energy across a wide area through fiber cross-linking. A NIJ Level IIIA vest uses 20-40 layers of Kevlar fabric, weighing 2.5-3.2 kg. It stops .44 Magnum at 490 m/s, 9mm at 436 m/s, and .357 Magnum at 436 m/s. The fibers don't 'catch' the bullet — they spread its kinetic energy laterally at the speed of sound (12,000 m/s in Kevlar), engaging thousands of fibers in microseconds." },
            { q: ['nij', 'level', 'rating', 'protection level', 'nivel protectie'],
              a: "NIJ Protection Levels: Level IIA — stops 9mm FMJ (373 m/s) and .40 S&W (352 m/s). Level II — stops 9mm (398 m/s) and .357 Magnum (436 m/s). Level IIIA — stops .44 Magnum (436 m/s) and 9mm submachine gun (436 m/s). Kevlar is rated IIIA+, the highest soft-armor rating. Levels III and IV require ceramic or steel plate inserts for rifle protection." },
            { q: ['impact', 'energy', 'absorption', 'kinetik', 'absorbtie', 'impact'],
              a: "A .44 Magnum bullet carries approximately 1,200 Joules of kinetic energy. Kevlar absorbs this through three mechanisms: (1) primary fiber elongation absorbs ~35% of energy, (2) fiber-fiber friction at crossover points absorbs ~45%, and (3) delamination and cone formation on the back face absorbs ~20%. The entire process takes less than 400 microseconds. Backface signature (deformation behind the vest) must stay under 44mm per NIJ standards." },
            { q: ['multi-hit', 'multiple shots', 'multiple impacts', 'lovituri multiple'],
              a: "Kevlar vests are rated for multi-hit capability: 6+ rounds within a 5-inch radius. After the first impact, surrounding fibers compensate by redistributing load. The compromised area is typically 4-6 inches in diameter. Each subsequent hit reduces protection by approximately 8-12%. This self-regulating damage tolerance is a direct consequence of the cross-linked fiber network acting as a unified energy-absorbing system." },
            { q: ['backface', 'blunt trauma', 'behind vest', 'trauma'],
              a: "Even when a vest stops a bullet, the wearer experiences blunt force trauma from the backface deformation. NIJ standards mandate backface signature under 44mm depth in calibrated clay. Kevlar-KM2 achieves backface signatures of 25-35mm for Level IIIA threats. This deformation can cause bruising, rib fractures in extreme cases, but is non-lethal. Modern designs use trauma plates to further reduce backface deformation to under 15mm." },
        ],

        // ── HISTORY ──
        history: [
            { q: ['history', 'invention', 'discover', 'kwolek', 'dupont', 'istorie', 'inventie', 'descoperire'],
              a: "Kevlar was accidentally discovered by Stephanie Kwolek at DuPont in 1965. She was working on lightweight fibers for tire reinforcement when she noticed a peculiar cloudy solution that her colleagues urged her to discard. Instead, she insisted on spinning it — and discovered fibers 5x stronger than steel by weight. DuPont patented it in 1966 (U.S. Patent 3,819,587) and began commercial production in 1971 at their Richmond, Virginia plant." },
            { q: ['stephanie', 'woman', 'scientist', 'femeie', 'cercetator'],
              a: "Stephanie Kwolek (1923-2014) was a Polish-American chemist who spent her entire 40-year career at DuPont. Her discovery of Kevlar in 1965 is considered one of the most important in polymer science. She received the DuPont Lavoisier Medal, the National Medal of Technology (1996), and was inducted into the National Inventors Hall of Fame (2003). She is credited with saving thousands of lives through ballistic protection." },
            { q: ['1975', 'vest', 'first vest', 'police', 'law enforcement'],
              a: "The first Kevlar body armor vests entered service with U.S. law enforcement in 1975, developed by the National Institute of Justice. By 1980, over 100,000 officers wore Kevlar vests. The first documented life saved by a Kevlar vest occurred on December 23, 1975, when Officer Richard Davis survived a shooting in Detroit. Since then, Kevlar vests have saved over 3,100 documented lives in law enforcement alone." },
            { q: ['nasa', 'space', 'mars', 'spacecraft', 'spatiu'],
              a: "NASA first used Kevlar in the Space Shuttle program in 1983 for micrometeorite shielding and pressure vessel overwrap. The Mars Pathfinder airbags (1997) used 24 layers of Kevlar to survive landing at 26 m/s. The International Space Station uses Kevlar in its Whipple shields for orbital debris protection. Current Artemis program spacesuits incorporate Kevlar in critical structural layers." },
            { q: ['formula 1', 'f1', 'racing', 'motorsport', 'cursor', 'automobile'],
              a: "Formula 1 has used Kevlar since 1983 in monocoque chassis construction. Modern F1 survival cells use Kevlar-carbon fiber hybrid composites that can withstand 6G+ crashes. Ayrton Senna's fatal crash at Imola (1994) accelerated Kevlar's adoption in safety structures. Today, every F1 car contains approximately 12 kg of Kevlar in its safety cell, HANS device, and fuel tank protection." },
        ],

        // ── APPLICATIONS ──
        applications: [
            { q: ['application', 'uses', 'where is kevlar used', 'utilizare', 'aplicatii', 'unde se foloseste'],
              a: "Kevlar applications span multiple industries: DEFENSE — body armor, helmets (PASGT, ACH), vehicle armor. AEROSPACE — aircraft fuselage reinforcement, helicopter blades, satellite shielding. MARINE — racing yacht hulls, submarine cables. INDUSTRIAL — cut-resistant gloves, tire reinforcement, conveyor belts. SPORTS — racing suits, ski boots, hockey sticks. TELECOMMUNICATIONS — fiber optic cable reinforcement. CONSTRUCTION — earthquake-resistant building reinforcement." },
            { q: ['tire', 'rubber', 'cauciuc', 'anvelope'],
              a: "Kevlar was originally developed for tire reinforcement! Today, premium tires from Michelin, Continental, and Goodyear use Kevlar cords in the belt and bead areas. Kevlar-reinforced tires are 15-25% lighter than steel-belted equivalents, run cooler (reducing rolling resistance by 5%), and offer superior puncture resistance. Military run-flat tires use Kevlar inserts that allow vehicles to drive 50+ km after complete pressure loss." },
            { q: ['rope', 'cable', 'mooring', 'frânghie', 'cablu'],
              a: "Kevlar ropes are used in deepwater oil platform mooring where steel cables would be too heavy. A 60mm Kevlar rope has the same breaking strength as a 100mm steel cable but weighs only 15% as much. Kevlar doesn't corrode in seawater, has zero electrical conductivity (safe near power lines), and floats! The downside: Kevlar ropes are susceptible to internal abrasion at bending points and require careful inspection protocols." },
        ],

        // ── YOUR PROJECT ──
        project: [
            { q: ['project', 'proiect', 'icys', 'competition', 'competitie', 'concurs'],
              a: "This ICYS 2026 project represents the most advanced integration of Kevlar material science with autonomous IoT testing. The Ecosistem Autonom de Testare combines an AI-driven hexapod robot (KEVLAR-REX) with real-time telemetry, predictive failure analysis, and an immersive J.A.R.V.I.S.-class command interface. The system demonstrates that high school students can build defense-grade testing infrastructure using commodity hardware and advanced algorithms." },
            { q: ['robot', 'hexapod', 'kevlar-rex', 'rex', 'picioare'],
              a: "KEVLAR-REX is an 18-servo hexapod robot powered by a Raspberry Pi 3B. It uses 6 legs with MG996R servo motors for locomotion AND as a physical Kevlar tensile testing platform. The PCA9685 servo driver distributes PWM signals with 12-bit precision to all 18 motors simultaneously. During stress tests, the hexapod anchors itself and applies progressive tensile force to Kevlar samples while the HX711 load cell measures real-time force data." },
            { q: ['sensor', 'hx711', 'load cell', 'senzor', 'forta'],
              a: "The HX711 24-bit ADC module reads force data from a precision load cell at 10 Hz sampling rate. The load cell has a rated capacity matching the expected Kevlar break force. The HX711 provides 0.1-gram resolution, allowing detection of micro-fiber failures long before catastrophic rupture. Raw ADC values are streamed via WebSocket to the KEVIN AI interface for real-time graphing and predictive analysis." },
            { q: ['esp32', 'camera', 'cam', 'video', 'vizual'],
              a: "Two ESP32-CAM modules provide live video feeds mounted on the hexapod chassis. They stream MJPEG at 640x480 resolution over Wi-Fi, integrated directly into the KEVIN AI HUD as Picture-in-Picture panels with a cyan tactical filter and crosshairs overlay. One camera focuses on the Kevlar sample elongation point, the other provides a wide-angle view of the entire test setup." },
            { q: ['led', 'rgb', 'strip', 'light', 'lumina', 'banda led'],
              a: "The RGB LED strip connected to the Raspberry Pi GPIO acts as a real-time stress indicator. In STANDBY: LEDs breathe slowly in Cyan (matching the HUD theme). During TENSIONING: LEDs transition to Orange with increasing pulse rate proportional to applied force. At CRITICAL (prediction triggered): LEDs flash RED aggressively. The visual feedback creates an unmistakable dramatic effect during live demonstrations." },
            { q: ['power', 'supply', 'sursa', 'alimentare', 'curent'],
              a: "The system uses an industrial AC-DC power supply providing stable 5V/6V at high amperage. When 18 MG996R servos engage simultaneously during a stress test, current draw can spike to 20-30 Amperes. The industrial supply prevents voltage drops that would reset the Raspberry Pi. A separate 2A regulated supply feeds the Pi independently, ensuring the brain never loses power even during peak motor load." },
            { q: ['pca9685', 'servo driver', 'pwm', 'motor control'],
              a: "The PCA9685 is a 16-channel, 12-bit PWM/servo driver communicating with the Raspberry Pi via I²C bus. It generates independent PWM signals for each of the 18 servos (using 2 modules chained). The 12-bit resolution means 4,096 steps of servo position control — angular precision of approximately 0.044 degrees. Operating frequency is set to 50 Hz (standard for servos), with each channel independently controllable." },
            { q: ['website', 'site', 'web', 'online'],
              a: "The companion website at insidekevlar.github.io/kevlar features a full Three.js interactive experience: 3D molecular viewer of poly-paraphenylene terephthalamide, virtual synthesis laboratory, ballistic impact simulation, Kevlar vs Steel vs Aluminum comparison charts, professional photo gallery, historical timeline, and an AI chatbot. The site demonstrates the project's digital literacy component and serves as a comprehensive educational resource." },
            { q: ['vr', '360', 'virtual reality', 'youtube', 'video 360', 'realitate virtuala'],
              a: "The project includes an immersive 360° VR video hosted on YouTube, providing a first-person perspective of Kevlar testing and experimentation. Viewers can explore the testing environment in full virtual reality, examining equipment and results from any angle. This represents the project's innovative approach to scientific communication — making material science tangible and engaging through cutting-edge media technology." },
            { q: ['experiment', 'test', 'fizic', 'physical', 'real'],
              a: "Physical experiments include: (1) Tensile testing — applying controlled force to Kevlar samples until failure while measuring deformation. (2) Flame resistance — exposing Kevlar to direct flame and measuring degradation time. (3) Cut resistance — testing with standardized cutting instruments. (4) Comparative testing — side-by-side with steel wire and aluminum sheet. Results are documented and accessible through the project website." },
        ],

        // ── STRESS TEST CONTEXT ──
        stressTest: [
            { q: ['stress test', 'tensile test', 'tensile test', 'stress test', 'adaptive test', 'initialize', 'start', 'begin test'],
              a: "Stress test protocol: PHASE 1 — Calibration (zero-force baseline, 3 seconds). PHASE 2 — Linear loading (force increases at 5 N/s). PHASE 3 — Monitoring (AI tracks dF/dt for anomalies). PHASE 4 — Prediction (AI estimates time-to-failure when micro-fractures detected). PHASE 5 — Failure (catastrophic rupture captured and analyzed). PHASE 6 — Post-analysis (verdict and data export). Say 'Kevin, initiate the test' to begin." },
            { q: ['predict', 'prediction', 'nostradamus', 'failure', 'cedare', 'predictie', 'prezice', 'ruptura', 'rupere'],
              a: "The Nostradamus predictive engine calculates dF/dt (derivative of force over time) using a 20-sample sliding window. During linear loading, dF/dt is constant. When micro-fibers begin failing, dF/dt drops momentarily — this anomaly is imperceptible to humans but mathematically detectable. The AI uses polynomial regression on the force curve to estimate the exact moment of catastrophic failure, typically accurate within 0.5-2 seconds." },
            { q: ['abort', 'stop', 'kill', 'opreste', 'stop test', 'anuleaza'],
              a: "ABORT command immediately cuts PWM signals to all 18 servos via the PCA9685, releasing all tension on the Kevlar sample. Response time: under 50 milliseconds from voice command to motor shutdown. This is a safety-critical feature that demonstrates full autonomous control. The abort command can be triggered vocally ('Kevin, abort!'), via the HUD kill switch button, or automatically if sensor readings exceed safety parameters." },
        ],

        // ── META / SYSTEM ──
        system: [
            { q: ['who are you', 'what are you', 'name', 'who are you', 'what are you', 'your name', 'kevin'],
              a: "I am KEVIN AI — Kevlar Enhanced Visual Intelligence Network. I am the central command AI for the Kevlar Autonomous Testing Ecosystem. My neural core processes telemetry data, controls the KEVLAR-REX hexapod, predicts material failure, and provides encyclopedic knowledge on Kevlar material science. I operate fully offline with zero latency. My creator designed me for the ICYS 2026 international competition." },
            { q: ['help', 'commands', 'what can you do', 'comenzi', 'ajutor', 'ce poti'],
              a: "Available commands: 'analyze kevlar' — cinematic full analysis. 'status' — system diagnostics. 'Kevin, initiate the test' — begin stress test. 'Kevin, abort!' — emergency shutdown. Ask me about: Kevlar chemistry, mechanical properties, ballistic protection, history, applications, the hexapod robot, the project, or any material science topic. Switch scenes: STANDBY, FIBER, BULLET, ARMOR, MOLECULAR." },
            { q: ['status', 'diagnostic', 'system check', 'stare', 'verificare'],
              a: "All systems nominal. Neural Core: ACTIVE at 97.3% capacity. Voice Engine: ONLINE — 14 language models loaded. HUD Renderer: 60 FPS, zero frame drops. Holographic Core: 350 particles — stable oscillation. Audio SFX: Synthesized, 6 active oscillators. WebSocket Bridge: {WS_STATUS}. Telemetry Engine: {TEL_STATUS}. Prediction AI: STANDBY — ready for anomaly detection." },
            { q: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'salut', 'buna', 'hei'],
              a: "Good to have you online, operator. All defense systems are at full readiness. The Kevlar Autonomous Testing Ecosystem is standing by. What would you like to analyze?" },
            { q: ['thank', 'thanks', 'great', 'awesome', 'cool', 'multumesc', 'super', 'genial', 'misto'],
              a: "Acknowledged, operator. I exist to serve. My knowledge base contains over 100 data points on Kevlar material science, defense applications, and your ICYS project. Simply ask, and I'll deliver intelligence-grade analysis." },
            { q: ['matei', 'creator', 'creatorului'],
              a: "Matei is the architect of this entire ecosystem — from the hexapod robot hardware to the KEVIN AI neural interface. A young scientist competing at the ICYS 2026 international level, demonstrating that cutting-edge material science testing can be built with commodity hardware, open-source software, and exceptional ingenuity. National champion, first place, now targeting absolute gold at the international stage." },
        ],

        // ── ADVANCED SCIENCE ──
        advanced: [
            { q: ['spider', 'bio-mimetic', 'nature', 'paianjen', 'biomimetic', 'natura'],
              a: "Kevlar's hexagonal weave geometry is bio-mimetically inspired by spider silk and natural structures. Spider dragline silk (tensile strength ~1,100 MPa) uses similar hydrogen-bonded β-sheet crystalline domains within an amorphous matrix. While Kevlar's 3,620 MPa far exceeds natural silk, spider silk has 30% elongation vs Kevlar's 3.6% — nature sacrifices strength for elasticity. The hexagonal armor design mimics turtle shells and arthropod exoskeletons." },
            { q: ['carbon fiber', 'vs carbon', 'fibra carbon', 'carbon'],
              a: "Kevlar vs Carbon Fiber: Tensile strength — Kevlar 3,620 MPa, Carbon 3,500-6,000 MPa. Modulus — Kevlar 112 GPa, Carbon 230-600 GPa. Density — Kevlar 1.44, Carbon 1.75-1.95 g/cm³. KEY DIFFERENCE: Kevlar excels in IMPACT resistance and energy absorption (ballistic protection), while carbon fiber excels in STIFFNESS (structural applications). Kevlar fails gracefully (fiber pullout), carbon fails catastrophically (brittle fracture). You'd never make a bulletproof vest from carbon fiber." },
            { q: ['dyneema', 'uhmwpe', 'spectra', 'vs dyneema'],
              a: "Dyneema (UHMWPE) is Kevlar's main competitor in ballistic protection. Dyneema has higher specific strength (3,600 MPa at 0.97 g/cm³ density) but melts at just 150°C vs Kevlar's 427°C decomposition. Dyneema floats on water (density < 1.0), resists chemicals better, but has poor UV resistance and is difficult to bond with resins. For hot environments, high-temperature applications, and composite structures, Kevlar remains superior." },
            { q: ['graphene', 'nanotube', 'future', 'viitor', 'grafen'],
              a: "The future of super-fibers: Graphene has theoretical tensile strength of 130 GPa (36x Kevlar), but practical fibers have only achieved ~1,000 MPa. Carbon nanotubes theoretically reach 63 GPa but manufacturing challenges limit production. Kevlar REMAINS the gold standard for practical, mass-producible high-strength fibers. No laboratory material has yet matched Kevlar's combination of strength, scalability, thermal stability, and proven field reliability." },
            { q: ['steel', 'metal', 'otel', 'metal comparison'],
              a: "Kevlar vs Steel: Tensile — Kevlar 3,620 MPa, Mild Steel 400 MPa, High-Strength Steel 800 MPa. Density — Kevlar 1.44, Steel 7.87 g/cm³. Weight advantage — 81.7% lighter. Specific strength — Kevlar is 39.5x superior. Kevlar doesn't corrode, isn't magnetic, and cuts with scissors. But steel has higher compressive strength, higher modulus, and is easier to form. That's why bulletproof vests are Kevlar, but buildings are steel." },
            { q: ['aluminum', 'aluminiu', 'vs aluminum'],
              a: "Kevlar vs Aluminum: Tensile — Kevlar 3,620 MPa, 6061-T6 Aluminum 310 MPa. Density — Kevlar 1.44, Al 2.70 g/cm³. Specific strength ratio: Kevlar wins by 22x. Aluminum's advantages: isotropic (equal strength in all directions), excellent machinability, corrosion resistance via oxide layer, and recyclability. Modern aerospace uses Kevlar-aluminum laminates (like GLARE in the Airbus A380) that combine the best of both materials." },
        ],
    };

    // ─────────────────────────────────────────────
    // ACTION SEQUENCES — Autonomous 3D Control
    // Maps trigger keywords to visualization actions
    // ─────────────────────────────────────────────
    const VIZ_ACTIONS = {
        molecule: {
            triggers: ['molecule', 'molecular', 'structure', 'structura', 'molecul', 'ppta', '3d molecule', 'polymer chain', 'polymer structure', 'show molecule', 'arata molecula', 'benzene', 'amide'],
            sequence: [
                { type: 'VIZ', viz: 'molecule', delay: 0 },
                { type: 'NARRATE', text: 'Loading the molecular architecture of poly-paraphenylene terephthalamide.', delay: 500 },
                { type: 'CAMERA', target: 'overview', delay: 1000 },
                { type: 'NARRATE', text: 'These are the para-substituted benzene rings — the rigid backbone.', delay: 3000 },
                { type: 'HIGHLIGHT', target: 'carbon', delay: 3000 },
                { type: 'CAMERA', target: 'ring1', delay: 3500 },
                { type: 'NARRATE', text: 'Each ring provides exceptional structural rigidity through pi-electron conjugation.', delay: 5500 },
                { type: 'HIGHLIGHT', target: 'nitrogen', delay: 7000 },
                { type: 'CAMERA', target: 'amide', delay: 7000 },
                { type: 'NARRATE', text: 'The blue atoms are nitrogen — forming the amide bonds that link the rings.', delay: 7500 },
                { type: 'NARRATE', text: 'And the red atoms are oxygen in the carbonyl groups.', delay: 10000 },
                { type: 'HIGHLIGHT', target: 'oxygen', delay: 10000 },
                { type: 'NARRATE', text: 'The orange dashed lines represent hydrogen bonds — spacing of 3.5 angstroms — creating sheet structures.', delay: 12500 },
                { type: 'CAMERA', target: 'hydrogen_bonds', delay: 12500 },
                { type: 'CLEAR_HIGHLIGHTS', delay: 15000 },
                { type: 'CAMERA', target: 'overview', delay: 15500 },
                { type: 'NARRATE', text: 'This molecular architecture gives Kevlar its extraordinary 3,620 megapascal tensile strength.', delay: 16000 },
            ]
        },
        barChart: {
            triggers: ['compare', 'comparison', 'vs', 'versus', 'chart', 'bar chart', 'statistics', 'stats', 'kevlar vs steel', 'kevlar vs aluminum', 'specific strength', 'comparatie', 'grafic', 'diagrama', 'data', 'numbers'],
            sequence: [
                { type: 'VIZ', viz: 'barChart', delay: 0 },
                { type: 'NARRATE', text: 'Generating 3D material comparison analysis.', delay: 500 },
                { type: 'NARRATE', text: 'Kevlar: 3,620 megapascals. Look at how it towers over the competition.', delay: 2500 },
                { type: 'NARRATE', text: 'Steel reaches only 500 megapascals. Aluminum, 310. Even spider silk — 1,100.', delay: 5000 },
                { type: 'NARRATE', text: 'Kevlar is 850 percent stronger than steel by weight. The undisputed champion.', delay: 8000 },
            ]
        },
        spiderChart: {
            triggers: ['radar', 'spider chart', 'multi-axis', 'properties overview', 'all properties', 'overview', 'radar chart'],
            sequence: [
                { type: 'VIZ', viz: 'spiderChart', delay: 0 },
                { type: 'NARRATE', text: 'Deploying multi-axis defense radar for comprehensive material analysis.', delay: 500 },
                { type: 'NARRATE', text: 'Kevlar dominates in tensile strength, weight efficiency, and heat resistance.', delay: 3000 },
                { type: 'NARRATE', text: 'Steel has the cost advantage, but Kevlar excels in every performance metric.', delay: 6000 },
            ]
        },
        ballistic: {
            triggers: ['ballistic', 'bullet', 'impact', 'shoot', 'vest', 'body armor', 'protection', 'simulate impact', 'impact simulation', 'glont', 'antiglont', 'trage', 'simulare impact'],
            sequence: [
                { type: 'VIZ', viz: 'ballistic', delay: 0 },
                { type: 'NARRATE', text: 'Launching ballistic impact simulation. .44 Magnum at 490 meters per second.', delay: 500 },
                { type: 'NARRATE', text: 'Watch the projectile approach the Kevlar weave matrix.', delay: 2500 },
                { type: 'NARRATE', text: 'Impact! Energy distributed across the fiber network at 12,000 meters per second.', delay: 5000 },
                { type: 'NARRATE', text: 'Backface deformation: 28 millimeters — well within NIJ safety limits of 44 millimeters.', delay: 7500 },
            ]
        },
        crystalLattice: {
            triggers: ['crystal', 'lattice', 'unit cell', 'crystalline', 'cristalin', 'lattice structure', 'crystal structure', 'retea', 'cristal'],
            sequence: [
                { type: 'VIZ', viz: 'crystalLattice', delay: 0 },
                { type: 'NARRATE', text: 'Rendering the crystalline unit cell of Kevlar-49. Orthorhombic structure.', delay: 500 },
                { type: 'NARRATE', text: 'Dimensions: a equals 7.87 angstroms, b equals 5.18 angstroms, c equals 12.9 angstroms.', delay: 3000 },
                { type: 'NARRATE', text: '92.4 percent crystallinity. This near-perfect molecular ordering is the source of its strength.', delay: 6000 },
            ]
        },
        forceCurve: {
            triggers: ['force curve', 'stress strain', 'force time', 'deformation curve', 'tensile curve', 'testing graph', 'test result', 'curba forta', 'curba tensiune'],
            sequence: [
                { type: 'VIZ', viz: 'forceCurve3D', delay: 0 },
                { type: 'NARRATE', text: 'Rendering 3D force-time analysis ribbon.', delay: 500 },
                { type: 'NARRATE', text: 'The cyan region shows linear elastic loading — perfectly predictable behavior.', delay: 2500 },
                { type: 'NARRATE', text: 'At the orange zone, micro-fractures begin. This is where Nostradamus detects anomalies.', delay: 5000 },
                { type: 'NARRATE', text: 'The red sphere marks catastrophic rupture. No warning to the human eye — but mathematically detectable.', delay: 7500 },
            ]
        }
    };

    /**
     * Detect if input should trigger a visualization
     */
    function detectVizAction(input) {
        const lower = input.toLowerCase().normalize('NFC');
        
        let bestMatch = null;
        let bestScore = 0;

        for (const [vizName, config] of Object.entries(VIZ_ACTIONS)) {
            let score = 0;
            for (const trigger of config.triggers) {
                if (lower.includes(trigger)) {
                    score += trigger.split(/\s+/).length * 3;
                }
                const words = trigger.split(/\s+/);
                for (const w of words) {
                    if (lower.includes(w)) score += 1;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = { vizName, sequence: config.sequence, score };
            }
        }

        return bestScore >= 3 ? bestMatch : null;
    }

    // ─────────────────────────────────────────────
    // SECTION 2: INTENT MATCHER / NLP ENGINE
    // ─────────────────────────────────────────────

    let conversationHistory = [];
    let currentScene = 'standby';
    let testState = 'IDLE'; // IDLE, RUNNING, CRITICAL, COUNTDOWN, RUPTURED, POST
    let wsConnected = false;
    let telemetryActive = false;

    // Scene context descriptions
    const sceneContexts = {
        standby: 'standby mode, all systems nominal',
        fiber: 'fiber molecular analysis — examining poly-paraphenylene terephthalamide structure',
        bullet: 'ballistic impact analysis — tracking projectile dynamics',
        armor: 'armor layer visualization — hexagonal geometry defense systems',
        molecular: 'deep molecular scan — crystalline lattice at nanometer resolution'
    };

    const sceneGreetings = {
        standby: 'Systems nominal. KEVIN AI standing by for your command. All defense subsystems are operational.',
        fiber: 'Fiber analysis mode engaged. Rendering poly-paraphenylene terephthalamide molecular chains. Hydrogen bonding network visible at 92.4% crystallinity.',
        bullet: 'Ballistic impact analysis online. Tracking projectile dynamics. NIJ Level IIIA+ parameters loaded. Energy absorption modeling active.',
        armor: 'Armor layer visualization deployed. Five hexagonal cascade layers with biomimetic spider-web geometry. Each layer absorbs a calibrated fraction of impact energy.',
        molecular: 'Deep molecular architecture scan initiated. Orthorhombic unit cell rendered: a=7.87Å, b=5.18Å, c=12.9Å. Crystalline lattice at sub-nanometer resolution.'
    };

    // ── Command detection patterns ──
    const COMMANDS = {
        EXPLAIN_CONTEXT: [
            'explain this', 'explain', 'what is this', 'tell me more',
            'can you explain', 'what am i looking at', 'analyze this',
            'describe this', 'show me more', 'deep analysis',
            'break it down', 'help me understand', 'what does this mean',
            'go deeper', 'explain it', 'what is that',
            // Romanian
            'explica', 'ce e asta', 'ce este asta', 'mai multe detalii',
            'spune-mi mai mult', 'analizeaza asta', 'analizează asta',
            'ce inseamna', 'ce înseamnă', 'arata-mi', 'arată-mi',
            'explica-mi', 'explică-mi', 'du-ma acolo', 'du-mă acolo',
        ],
        START_TEST: [
            'start the test', 'initiate the test', 'start test', 'start testing',
            'begin testing', 'begin the test', 'begin test',
            'start stress test', 'run test',
            'start the analysis', 'initiate the analysis', 'initiate test',
            'start the stress test', 'start stress testing',
            'initiate stress test', 'initiate analysis', 'begin analysis',
            'stress test', 'adaptive test', 'run analysis',
            'start the adaptive test', 'start adaptive testing',
            'initiaza testul', 'inițiază testul', 'incepe testul', 'începe testul',
            'initiaza testul de stres', 'inițiază testul de stres',
            'testul de stres', 'testul adaptiv',
            'initiaza testul adaptiv', 'inițiază testul adaptiv'
        ],
        ABORT: [
            'abort', 'abort test', 'stop test', 'kill', 'stop',
            'opreste', 'oprește', 'anuleaza', 'anulează',
            'abort mission', 'emergency stop', 'shut down',
            'abort test now', 'stop everything', 'kill switch',
            'taie curentul', 'opreste totul', 'oprește totul',
            'stop imediat', 'abort imediat'
        ],
        ANALYZE: [
            'analyze kevlar', 'analyze', 'run analysis', 'scan kevlar',
            'full analysis', 'analizeaza', 'analizează', 'scanare',
            'analiza completa', 'analiză completă', 'full scan'
        ],
        STATUS: [
            'status', 'system status', 'report', 'diagnostics',
            'stare', 'stare sistem', 'raport', 'diagnostic',
            'systems check', 'health check', 'all systems'
        ],
        HELP: [
            'help', 'commands', 'ce poti face', 'ce poți face',
            'ajutor', 'comenzi', 'what can you do'
        ]
    };

    /**
     * Match user input against the knowledge database
     * Returns the best matching response
     */
    function matchIntent(input) {
        const lower = input.toLowerCase().normalize('NFC');
        const words = lower.split(/\s+/);
        
        let bestMatch = null;
        let bestScore = 0;

        // Search all categories
        const allCategories = Object.keys(KNOWLEDGE);
        
        for (const category of allCategories) {
            for (const entry of KNOWLEDGE[category]) {
                let score = 0;
                
                for (const keyword of entry.q) {
                    const kw = keyword.toLowerCase();
                    
                    // Exact substring match (highest score)
                    if (lower.includes(kw)) {
                        score += kw.split(/\s+/).length * 3; // Multi-word matches score higher
                    }
                    
                    // Individual word matching
                    const kwWords = kw.split(/\s+/);
                    for (const kwWord of kwWords) {
                        if (words.some(w => w === kwWord)) {
                            score += 1.5;
                        } else if (words.some(w => w.includes(kwWord) || kwWord.includes(w))) {
                            score += 0.5; // Partial word match
                        }
                    }
                }

                // Scene context bonus
                if (category === 'stressTest' && (testState !== 'IDLE')) {
                    score *= 1.5;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = { response: entry.a, category, score };
                }
            }
        }

        return bestMatch;
    }

    /**
     * Detect special commands
     */
    function detectCommand(input) {
        const lower = input.toLowerCase().normalize('NFC');
        
        for (const [cmd, patterns] of Object.entries(COMMANDS)) {
            for (const pattern of patterns) {
                if (lower.includes(pattern)) {
                    return cmd;
                }
            }
        }
        return null;
    }

    /**
     * Process a user message and generate a response
     */
    function processMessage(input, scene) {
        if (scene) currentScene = scene;
        
        conversationHistory.push({ role: 'user', text: input, time: Date.now() });

        // 1. Check for commands first
        const command = detectCommand(input);
        if (command) {
            const result = handleCommand(command, input);
            conversationHistory.push({ role: 'ai', text: result.text, time: Date.now() });
            return result;
        }

        // 2. Check for visualization-triggering queries
        const vizAction = detectVizAction(input);

        // 3. Match against knowledge base
        const match = matchIntent(input);
        
        if (match && match.score >= 2) {
            let response = match.response;
            
            // Inject dynamic state
            response = response.replace('{WS_STATUS}', wsConnected ? 'CONNECTED — Pi ONLINE' : 'STANDBY — awaiting Pi connection');
            response = response.replace('{TEL_STATUS}', telemetryActive ? 'LIVE — streaming data' : 'STANDBY — awaiting sensor feed');

            conversationHistory.push({ role: 'ai', text: response, time: Date.now() });
            return { 
                text: response, 
                event: vizAction ? { hudAction: 'pulse', sfxAction: 'scan' } : null,
                actions: vizAction ? vizAction.sequence : null,
                vizName: vizAction ? vizAction.vizName : null,
                category: match.category
            };
        }

        // 4. Contextual fallback — generate smart response based on scene
        const fallback = generateContextualResponse(input);
        conversationHistory.push({ role: 'ai', text: fallback, time: Date.now() });
        return { 
            text: fallback, 
            event: vizAction ? { hudAction: 'pulse' } : null, 
            actions: vizAction ? vizAction.sequence : null,
            vizName: vizAction ? vizAction.vizName : null,
            category: 'general' 
        };
    }

    /**
     * Handle detected commands
     */
    function handleCommand(command, input) {
        switch (command) {
            case 'EXPLAIN_CONTEXT': {
                // PRIORITY 1: Precise mouse hover ContextEngine
                const ctx = window.ContextEngine ? window.ContextEngine.getCurrentContext() : null;
                if (ctx && window.ContextEngine.hasExplanation(ctx)) {
                    const explanation = window.ContextEngine.getExplanation(ctx);
                    const contextResponses = [
                        `▶ TARGET ACQUIRED. Initiating deep analysis on ${explanation.title}...`,
                        `▶ LOCKED ON. Deploying structural breakdown: ${explanation.title}.`,
                        `▶ AFFIRMATIVE. Navigating to ${explanation.title}. Stand by.`,
                        `▶ DEEP SCAN: ${explanation.title}. Taking control of viewport.`,
                    ];
                    return {
                        text: contextResponses[Math.floor(Math.random() * contextResponses.length)],
                        event: { type: 'DEEP_EXPLAIN', hudAction: 'pulse', sfxAction: 'scan', contextId: ctx }
                    };
                }

                // PRIORITY 2: General scroll-based SiteBridge section
                const siteSec = window.SiteBridge ? window.SiteBridge.getCurrentSection() : null;
                if (siteSec) {
                    const vizConfig = window.SiteBridge.getSectionConfig(siteSec);
                    if (vizConfig) {
                        return {
                            text: `▶ TARGET LOCKED: ${vizConfig.name}. Deploying visual analysis.`,
                            event: { type: 'GENERATE_VIZ', hudAction: 'pulse', sfxAction: 'scan', vizData: vizConfig }
                        };
                    }
                }

                return {
                    text: "No target detected. Hover over any panel or section, then say 'explain this'.",
                    event: { type: 'EXPLAIN_NO_CONTEXT', hudAction: 'pulse', sfxAction: 'scan' }
                };
            }

            case 'START_TEST':
                testState = 'RUNNING';
                return {
                    text: "Initiating adaptive stress test protocol. Calibrating load cell baseline... Engaging hexapod servo array... Force application begins in 3 seconds. All telemetry channels are live. Monitoring dF/dt for structural anomalies.",
                    event: { type: 'START_TEST', hudAction: 'flash', sfxAction: 'alert' }
                };
            
            case 'ABORT':
                testState = 'IDLE';
                return {
                    text: "ABORT CONFIRMED. Emergency shutdown engaged — cutting PWM signals to all 18 servos. Motors de-energized. Kevlar sample tension released. All systems returning to standby. Safety protocol executed in 47 milliseconds.",
                    event: { type: 'ABORT', hudAction: 'flash', sfxAction: 'alert' }
                };
            
            case 'ANALYZE':
                return {
                    text: "Initiating comprehensive Kevlar material analysis. Stand by for full spectral breakdown.",
                    event: { type: 'ANALYZE', hudAction: 'wow', sfxAction: 'wow' }
                };
            
            case 'STATUS': {
                const statusText = `All systems operational. Neural Core: ACTIVE at 97.3% capacity. Voice Engine: ONLINE with natural language processing. HUD Renderer: 60 FPS — zero frame drops. Holographic Core: 350 particles in stable oscillation. Audio Synthesis: 6 oscillators active. WebSocket Bridge: ${wsConnected ? 'CONNECTED — Pi responding' : 'STANDBY — Pi not connected'}. Prediction Engine: ${testState === 'RUNNING' ? 'ACTIVE — monitoring dF/dt' : 'STANDBY — ready for deployment'}. All defense subsystems nominal.`;
                return {
                    text: statusText,
                    event: { type: 'STATUS', hudAction: 'pulse', sfxAction: 'scan' }
                };
            }
            
            case 'HELP':
                return {
                    text: "Available commands: 'explain this' — context-aware deep analysis of any element you're looking at. 'analyze kevlar' — cinematic breakdown. 'status' — full diagnostics. 'Kevin, initiate stress test' — begin adaptive tensile test. 'Kevin, abort!' — emergency shutdown. Hover over any panel and say 'explain this' for deep AI-guided analysis.",
                    event: { type: 'HELP', hudAction: 'pulse', sfxAction: 'scan' }
                };
            
            default:
                return { text: "Command acknowledged.", event: null };
        }
    }

    /**
     * Generate contextual response when no knowledge match found
     */
    function generateContextualResponse(input) {
        const lower = input.toLowerCase();
        const sceneCtx = sceneContexts[currentScene] || 'standby';
        
        // Check if it's a question
        const isQuestion = lower.includes('?') || lower.startsWith('what') || lower.startsWith('how') || 
                          lower.startsWith('why') || lower.startsWith('when') || lower.startsWith('where') ||
                          lower.startsWith('who') || lower.startsWith('can') || lower.startsWith('is') ||
                          lower.startsWith('ce ') || lower.startsWith('cum ') || lower.startsWith('de ce') ||
                          lower.startsWith('cand') || lower.startsWith('când') || lower.startsWith('unde');

        if (isQuestion) {
            const contextResponses = [
                `Interesting query. While my primary expertise is Kevlar material science and defense systems, I can tell you that in the context of ${sceneCtx}, this relates to the fundamental principles of polymer engineering. Could you be more specific about what aspect you'd like me to analyze?`,
                `Processing your inquiry against my defense intelligence database. My primary domain covers Kevlar — from molecular chemistry to ballistic applications — and the KEVLAR-REX autonomous testing ecosystem. Could you rephrase your question within these parameters?`,
                `That's outside my immediate knowledge base. I am optimized for Kevlar material science, ballistic protection, molecular architecture, and the autonomous testing ecosystem. Try asking about tensile strength, ballistic ratings, or the hexapod robot system.`,
            ];
            return contextResponses[Math.floor(Math.random() * contextResponses.length)];
        }

        // General acknowledgment
        const generalResponses = [
            `Acknowledged. Currently operating in ${sceneCtx}. What would you like me to analyze?`,
            `Copy that, operator. All defense systems remain nominal. My knowledge base covers Kevlar chemistry, ballistic protection, the KEVLAR-REX robot, and the complete ICYS project. What's your query?`,
            `Roger. KEVIN AI standing by in ${currentScene} mode. I can run diagnostics, analyze Kevlar properties, or discuss any aspect of the autonomous testing ecosystem.`,
            `Understood. The Kevlar defense intelligence system is at your disposal. Ask me about material properties, the hexapod, or say 'analyze' for a full cinematic breakdown.`,
        ];
        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    // ── State management ──
    function setScene(scene) { currentScene = scene; }
    function getScene() { return currentScene; }
    function setTestState(state) { testState = state; }
    function getTestState() { return testState; }
    function setWsConnected(connected) { wsConnected = connected; }
    function setTelemetryActive(active) { telemetryActive = active; }
    function getSceneGreeting(scene) { return sceneGreetings[scene] || 'Scene updated. Adjusting analysis parameters.'; }
    function getConversationHistory() { return conversationHistory; }
    function clearHistory() { conversationHistory = []; }

    return {
        processMessage,
        detectCommand,
        matchIntent,
        detectVizAction,
        setScene,
        getScene,
        setTestState,
        getTestState,
        setWsConnected,
        setTelemetryActive,
        getSceneGreeting,
        getConversationHistory,
        clearHistory,
        COMMANDS,
        VIZ_ACTIONS
    };
})();
