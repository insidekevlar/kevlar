/* ============================================
   SITE BRIDGE — Click-to-Generate System
   Monitors site section clicks, offers generation,
   triggers ultra 3D visualizations
   ============================================ */
window.SiteBridge = (function() {
    'use strict';

    let onSectionClick = null;
    let onGenerateRequest = null;
    let currentSection = null;

    // Section → Visualization mapping
    const SECTION_MAP = {
        molecules: {
            name: '3D MOLECULES',
            viz: 'molecule',
            prompt: 'Want me to generate a high-fidelity 3D molecular structure of PPTA?',
            response: 'Loading the 3D molecular viewer. You are now looking at the PPTA polymer — poly-paraphenylene terephthalamide — rendered at full atomic resolution.',
            narration: [
                { text: 'On your screen: the full molecular architecture of Kevlar. Carbon atoms in dark gray, nitrogen in blue, oxygen in red, hydrogen in white.', delay: 3000 },
                { text: 'The para-substituted benzene rings you see form the rigid polymer backbone. Their planar structure prevents chain coiling.', delay: 8000 },
                { text: 'The dashed orange lines represent hydrogen bonds at 3.5 angstroms spacing — forming the crystalline superlattice that gives Kevlar its extraordinary strength.', delay: 14000 },
            ]
        },
        comparison: {
            name: 'KEVLAR vs STEEL vs ALUMINUM',
            viz: 'barChart',
            prompt: 'Shall I generate a 3D statistical comparison of Kevlar versus other materials?',
            response: 'Deploying the 3D material comparison engine. You are now viewing an interactive holographic analysis with Steel, Kevlar, and Aluminum models.',
            narration: [
                { text: 'On your screen: three material samples in a high-end laboratory environment. Steel on the left, Kevlar center, Aluminum on the right.', delay: 3000 },
                { text: 'The HUD cards display real-time data. Kevlar reaches 3,620 megapascals tensile strength — dwarfing Steel at 400 and Aluminum at 600.', delay: 8000 },
                { text: 'Click any model to focus the analysis. The monitor in the back shows detailed stress simulations for each material.', delay: 14000 },
            ]
        },
        ballistic: {
            name: 'BALLISTIC IMPACT',
            viz: 'ballistic',
            prompt: 'Want me to simulate a ballistic impact on Kevlar fabric in 3D?',
            response: 'Launching ballistic impact simulation. Rendering the fiber weave matrix and projectile trajectory.',
            narration: [
                { text: 'You are viewing the ballistic impact simulation. A .44 Magnum projectile is approaching the Kevlar weave at 490 meters per second.', delay: 3000 },
                { text: 'Watch the energy distribution pattern. On impact, 1,200 Joules spread across the fiber network at 12,000 meters per second.', delay: 7000 },
                { text: 'Backface deformation measured at 28 millimeters — well within the NIJ safety limit of 44 millimeters. Sample integrity: preserved.', delay: 12000 },
            ]
        },
        history: {
            name: 'HISTORY & APPLICATIONS',
            viz: 'f1car',
            prompt: 'Want me to show the interactive Kevlar history and applications experience?',
            response: 'Loading the interactive timeline. Scroll through decades of Kevlar innovation — from Stephanie Kwolek\'s 1965 discovery to modern Formula 1 and space applications.',
            narration: [
                { text: 'You are now in the interactive history module. Scroll down to explore Kevlar\'s journey from laboratory accident to life-saving technology.', delay: 3000 },
                { text: 'Kevlar has been used in Formula 1 since 1983. The safety cell you see contains 12 kilograms of Kevlar-carbon composite.', delay: 8000 },
                { text: 'From body armor saving over 3,100 lives, to Mars Pathfinder airbags — Kevlar has proven itself across every frontier.', delay: 14000 },
            ]
        },
        synthesis: {
            name: 'VIRTUAL SYNTHESIS LAB',
            viz: 'synthesis',
            prompt: 'Shall I render the virtual synthesis laboratory showing PPTA polymerization?',
            response: 'Loading the Virtual Synthesis Lab. You are viewing the complete Kevlar PPTA polymerization process with reactants, products, and manufacturing steps.',
            narration: [
                { text: 'On screen: the full synthesis rendering. On the left — Kevlar intelligence technical data. Center — the molecular structure with reactant formulas.', delay: 3000 },
                { text: 'Para-phenylenediamine reacts with terephthaloyl chloride. The condensation polymerization produces PPTA polymer chains with HCl as byproduct.', delay: 8000 },
                { text: 'On the right panel: the four manufacturing steps — extrusion through spinnerets, air gap processing, cold water coagulation, and thermal treatment at 400 to 550 degrees Celsius.', delay: 14000 },
            ]
        },
        research: {
            name: 'RESEARCH DATABASE',
            viz: 'crystalLattice',
            prompt: 'Want me to render the crystalline unit cell structure from the research data?',
            response: 'Loading the Research Database. You are viewing the full scientific data interface with crystal lattice visualization, stress-strain curves, molecular formula, and thermal profile.',
            narration: [
                { text: 'On your screen: the Research Database with four data panels. Left panel shows the rotating crystal lattice — orthorhombic structure, density 1.44 grams per cubic centimeter.', delay: 3000 },
                { text: 'Right panel displays the tensile stress-strain curve. Ultimate tensile strength: 3.620 gigapascals. Elongation at break: 3.6 percent.', delay: 8000 },
                { text: 'Bottom panels show the molecular formula C14 H10 N2 O2 and the thermal decomposition profile. Glass transition at 263 degrees, decomposition at 550 degrees Celsius.', delay: 14000 },
            ]
        },
        defense: {
            name: 'BODY ARMOR',
            viz: 'vest',
            prompt: 'Want me to generate a 3D body armor cross-section showing Kevlar layers?',
            response: 'Rendering the NIJ Level IIIA plus body armor visualization. Multi-layer Kevlar fabric capable of stopping .44 Magnum at 490 meters per second.',
            narration: [
                { text: 'You are viewing the body armor cross-section. 20 to 40 layers of woven Kevlar fabric arranged in a cross-linked matrix.', delay: 3000 },
                { text: 'Each layer absorbs a calibrated fraction of the projectile\'s kinetic energy. Total vest weight: only 2.8 kilograms.', delay: 7000 },
                { text: 'Kevlar vests are rated for multi-hit capability — 6 or more rounds within a 5-inch radius. Each subsequent hit reduces protection by 8 to 12 percent.', delay: 12000 },
            ]
        },
        space: {
            name: 'NASA / SPACE',
            viz: 'spaceStation',
            prompt: 'Shall I render the International Space Station showing Kevlar Whipple shielding?',
            response: 'Generating the ISS visualization with Kevlar composite Whipple shields. These panels protect astronauts from orbital debris traveling at 7,800 meters per second.',
            narration: [
                { text: 'On screen: the International Space Station with highlighted Kevlar Whipple shield sections. Each module uses multi-layer Kevlar for debris protection.', delay: 3000 },
                { text: 'In 1997, Mars Pathfinder used 24 layers of Kevlar in its landing airbags — surviving impact at 26 meters per second.', delay: 8000 },
                { text: 'Current Artemis program spacesuits incorporate Kevlar in critical structural layers. From orbit to Mars, Kevlar protects humanity\'s frontier.', delay: 14000 },
            ]
        }
    };

    function init(callbacks) {
        onSectionClick = callbacks.onSectionClick || null;
        onGenerateRequest = callbacks.onGenerateRequest || null;

        // Wire up site section buttons (sidebar panel)
        const sections = document.querySelectorAll('.site-section');
        sections.forEach(sec => {
            sec.addEventListener('click', () => {
                const sectionId = sec.dataset.section;
                handleSectionClick(sectionId, sec);
            });
        });

        // Website panel toggle
        const toggleBtn = document.getElementById('website-toggle');
        const closeBtn = document.getElementById('website-close');
        const webPanel = document.getElementById('website-panel');
        const sciToggleForWeb = document.getElementById('sci-toggle');
        if (toggleBtn && webPanel) {
            toggleBtn.addEventListener('click', () => {
                webPanel.classList.toggle('hidden');
                const isHidden = webPanel.classList.contains('hidden');
                toggleBtn.style.display = isHidden ? '' : 'none';
                if (sciToggleForWeb) sciToggleForWeb.style.display = isHidden ? '' : 'none';
            });
        }
        if (closeBtn && webPanel) {
            closeBtn.addEventListener('click', () => {
                webPanel.classList.add('hidden');
                if (toggleBtn) toggleBtn.style.display = '';
                if (sciToggleForWeb) sciToggleForWeb.style.display = '';
            });
        }

        // Sidebar toggle
        const sideToggle = document.getElementById('site-toggle');
        const sidePanel = document.getElementById('site-sections');
        if (sideToggle && sidePanel) {
            sideToggle.addEventListener('click', () => {
                sidePanel.classList.toggle('collapsed');
                sideToggle.textContent = sidePanel.classList.contains('collapsed') ? '▶' : '▼';
            });
        }

        // Scientific Dashboard toggle
        const sciToggle = document.getElementById('sci-toggle');
        const sciClose = document.getElementById('sci-close');
        const sciPanel = document.getElementById('sci-dashboard');
        if (sciToggle && sciPanel) {
            sciToggle.addEventListener('click', () => {
                sciPanel.classList.toggle('hidden');
                sciToggle.style.display = sciPanel.classList.contains('hidden') ? '' : 'none';
            });
        }
        if (sciClose && sciPanel) {
            sciClose.addEventListener('click', () => {
                sciPanel.classList.add('hidden');
                if (sciToggle) sciToggle.style.display = '';
            });
        }
    }

    function handleSectionClick(sectionId, el) {
        const config = SECTION_MAP[sectionId];
        if (!config) return;

        // Update visual state
        document.querySelectorAll('.site-section').forEach(s => s.classList.remove('active'));
        if (el && el.classList.contains('site-section')) {
            el.classList.add('active');
            const statusEl = el.querySelector('.section-status');
            if (statusEl) statusEl.textContent = 'ACTIVE';
        }

        currentSection = sectionId;

        // Fire the callback — KEVIN asks "want me to generate?"
        if (onSectionClick) {
            onSectionClick({
                sectionId,
                sectionName: config.name,
                prompt: config.prompt,
                viz: config.viz,
                response: config.response,
                narration: config.narration
            });
        }
    }

    function confirmGenerate(sectionId) {
        const config = SECTION_MAP[sectionId || currentSection];
        if (!config) return null;

        if (onGenerateRequest) {
            onGenerateRequest({
                viz: config.viz,
                response: config.response,
                narration: config.narration,
                sectionName: config.name
            });
        }
        return config;
    }

    function getCurrentSection() { return currentSection; }
    function getSectionConfig(id) { return SECTION_MAP[id] || null; }

    return { init, confirmGenerate, getCurrentSection, getSectionConfig, SECTION_MAP };
})();
