// Enhanced UI Panels Module
class UIManager {
    constructor() {
        this.activePanel = null;
        this.isAnimating = false;
        
        // Detailed planet information
        this.planetInfo = {
            sun: {
                name: "Sun",
                type: "G-type Main-sequence Star",
                diameter: "1,391,000 km",
                mass: "1.989 × 10³⁰ kg",
                temperature: "5,778 K (surface)",
                composition: "73% Hydrogen, 25% Helium, 2% Other",
                facts: [
                    "The Sun contains 99.86% of the Solar System's mass",
                    "One million Earths could fit inside the Sun",
                    "The Sun's core reaches 15 million°C"
                ]
            },
            mercury: {
                name: "Mercury",
                type: "Terrestrial Planet",
                diameter: "4,879 km",
                mass: "3.301 × 10²³ kg",
                distance: "57.9 million km from Sun",
                day: "58.6 Earth days",
                year: "88 Earth days",
                temperature: "427°C (day) / -173°C (night)",
                facts: [
                    "Closest planet to the Sun",
                    "Has extreme temperature variations",
                    "No atmosphere to retain heat"
                ]
            },
            venus: {
                name: "Venus",
                type: "Terrestrial Planet",
                diameter: "12,104 km",
                mass: "4.867 × 10²⁴ kg",
                distance: "108.2 million km from Sun",
                day: "243 Earth days (retrograde)",
                year: "225 Earth days",
                temperature: "462°C (surface)",
                facts: [
                    "Hottest planet in the Solar System",
                    "Rotates backwards (retrograde)",
                    "Thick atmosphere of carbon dioxide"
                ]
            },
            earth: {
                name: "Earth",
                type: "Terrestrial Planet",
                diameter: "12,756 km",
                mass: "5.972 × 10²⁴ kg",
                distance: "149.6 million km from Sun",
                day: "24 hours",
                year: "365.25 days",
                temperature: "15°C (average)",
                facts: [
                    "Only known planet with life",
                    "71% of surface covered by water",
                    "Protected by magnetic field"
                ]
            },
            mars: {
                name: "Mars",
                type: "Terrestrial Planet",
                diameter: "6,792 km",
                mass: "6.417 × 10²³ kg",
                distance: "227.9 million km from Sun",
                day: "24.6 hours",
                year: "687 Earth days",
                temperature: "-65°C (average)",
                facts: [
                    "Known as the Red Planet",
                    "Has the largest volcano in the Solar System",
                    "Evidence of ancient water flows"
                ]
            },
            jupiter: {
                name: "Jupiter",
                type: "Gas Giant",
                diameter: "142,984 km",
                mass: "1.898 × 10²⁷ kg",
                distance: "778.5 million km from Sun",
                day: "9.9 hours",
                year: "11.9 Earth years",
                temperature: "-110°C (cloud tops)",
                facts: [
                    "Largest planet in the Solar System",
                    "Has over 80 known moons",
                    "Great Red Spot is a giant storm"
                ]
            },
            saturn: {
                name: "Saturn",
                type: "Gas Giant",
                diameter: "120,536 km",
                mass: "5.683 × 10²⁶ kg",
                distance: "1.432 billion km from Sun",
                day: "10.7 hours",
                year: "29.4 Earth years",
                temperature: "-140°C (cloud tops)",
                facts: [
                    "Famous for its prominent ring system",
                    "Less dense than water",
                    "Has over 80 known moons"
                ]
            },
            uranus: {
                name: "Uranus",
                type: "Ice Giant",
                diameter: "51,118 km",
                mass: "8.681 × 10²⁵ kg",
                distance: "2.867 billion km from Sun",
                day: "17.2 hours",
                year: "84 Earth years",
                temperature: "-195°C (cloud tops)",
                facts: [
                    "Rotates on its side (98° tilt)",
                    "Has faint rings",
                    "Composed mostly of water, methane, and ammonia ices"
                ]
            },
            neptune: {
                name: "Neptune",
                type: "Ice Giant",
                diameter: "49,528 km",
                mass: "1.024 × 10²⁶ kg",
                distance: "4.515 billion km from Sun",
                day: "16.1 hours",
                year: "165 Earth years",
                temperature: "-200°C (cloud tops)",
                facts: [
                    "Windiest planet with speeds up to 2,100 km/h",
                    "Deep blue color from methane",
                    "Has 14 known moons"
                ]
            },
            moon: {
                name: "Moon",
                type: "Natural Satellite",
                diameter: "3,474 km",
                mass: "7.342 × 10²² kg",
                distance: "384,400 km from Earth",
                day: "27.3 Earth days (tidally locked)",
                year: "27.3 Earth days (orbital period)",
                temperature: "127°C (day) / -173°C (night)",
                facts: [
                    "Always shows the same face to Earth (tidally locked)",
                    "Formed from debris after a Mars-sized object hit Earth",
                    "Causes tides on Earth through gravitational pull",
                    "Has no atmosphere, so no wind or weather"
                ]
            }
        };
        
        this.initializeUI();
    }

    initializeUI() {
        this.createNavigationPanel();
        this.createEnhancedInfoPanel();
        this.createTimeControlPanel();
        this.setupPanelStyles();
    }

    // Create navigation panel for planet selection
    createNavigationPanel() {
        const navPanel = document.createElement('div');
        navPanel.id = 'navigationPanel';
        navPanel.innerHTML = `
            <h3>Navigate Solar System</h3>
            <div class="nav-buttons">
                <button class="nav-btn" data-target="overview">Overview</button>
                <button class="nav-btn" data-target="sun">Sun</button>
                <button class="nav-btn" data-target="mercury">Mercury</button>
                <button class="nav-btn" data-target="venus">Venus</button>
                <button class="nav-btn" data-target="earth">Earth</button>
                <button class="nav-btn" data-target="moon">Moon</button>
                <button class="nav-btn" data-target="mars">Mars</button>
                <button class="nav-btn" data-target="jupiter">Jupiter</button>
                <button class="nav-btn" data-target="saturn">Saturn</button>
                <button class="nav-btn" data-target="uranus">Uranus</button>
                <button class="nav-btn" data-target="neptune">Neptune</button>
            </div>
            <div class="nav-controls">
                <button id="autoTourBtn">Start Auto Tour</button>
                <button id="orbitBtn">Orbit Current</button>
            </div>
        `;
        document.body.appendChild(navPanel);
    }

    // Create enhanced information panel
    createEnhancedInfoPanel() {
        const infoPanel = document.createElement('div');
        infoPanel.id = 'enhancedInfoPanel';
        infoPanel.innerHTML = `
            <div class="panel-header">
                <h2 id="planetTitle">Solar System</h2>
                <button id="closePanelBtn">×</button>
            </div>
            <div class="panel-content">
                <div class="info-section">
                    <h4>Basic Information</h4>
                    <div id="basicInfo"></div>
                </div>
                <div class="info-section">
                    <h4>Physical Properties</h4>
                    <div id="physicalInfo"></div>
                </div>
                <div class="info-section">
                    <h4>Interesting Facts</h4>
                    <ul id="factsList"></ul>
                </div>
            </div>
        `;
        document.body.appendChild(infoPanel);
        
        // Close button handler
        document.getElementById('closePanelBtn').addEventListener('click', () => {
            this.hideInfoPanel();
        });
    }

    // Create enhanced time control panel
    createTimeControlPanel() {
        const timePanel = document.createElement('div');
        timePanel.id = 'timeControlPanel';
        timePanel.innerHTML = `
            <h3>Time Controls</h3>
            <div class="time-controls">
                <button id="pauseBtn">⏸ Pause</button>
                <button id="playBtn" style="display:none;">▶ Play</button>
                <div class="speed-control">
                    <label>Speed:</label>
                    <input type="range" id="timeSpeedSlider" min="0" max="10" value="1" step="0.1">
                    <span id="speedDisplay">1.0x</span>
                </div>
                <div class="preset-speeds">
                    <button class="speed-preset" data-speed="0.1">0.1x</button>
                    <button class="speed-preset" data-speed="0.5">0.5x</button>
                    <button class="speed-preset" data-speed="1">1x</button>
                    <button class="speed-preset" data-speed="2">2x</button>
                    <button class="speed-preset" data-speed="5">5x</button>
                </div>
            </div>
        `;
        document.body.appendChild(timePanel);
    }

    // Setup CSS styles for panels
    setupPanelStyles() {
        const styles = `
            #navigationPanel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #ffd700;
                border-radius: 10px;
                padding: 20px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 1000;
                max-width: 250px;
                backdrop-filter: blur(10px);
            }

            #navigationPanel h3 {
                margin: 0 0 15px 0;
                color: #ffd700;
                text-align: center;
            }

            .nav-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 15px;
            }

            .nav-btn {
                background: linear-gradient(45deg, #333, #555);
                color: white;
                border: 1px solid #666;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            }

            .nav-btn:hover {
                background: linear-gradient(45deg, #555, #777);
                border-color: #ffd700;
                transform: translateY(-2px);
            }

            .nav-btn.active {
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                color: #000;
                border-color: #ffd700;
            }

            .nav-controls {
                border-top: 1px solid #444;
                padding-top: 10px;
                display: flex;
                gap: 5px;
            }

            #autoTourBtn, #orbitBtn {
                flex: 1;
                background: #4a90e2;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
                transition: background 0.3s;
            }

            #autoTourBtn:hover, #orbitBtn:hover {
                background: #357abd;
            }

            #enhancedInfoPanel {
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid #ffd700;
                border-radius: 15px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 1001;
                width: 350px;
                max-height: 70vh;
                overflow-y: auto;
                display: none;
                backdrop-filter: blur(15px);
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
            }

            .panel-header {
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                color: #000;
                padding: 15px 20px;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .panel-header h2 {
                margin: 0;
                font-size: 18px;
            }

            #closePanelBtn {
                background: none;
                border: none;
                color: #000;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #closePanelBtn:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .panel-content {
                padding: 20px;
            }

            .info-section {
                margin-bottom: 20px;
            }

            .info-section h4 {
                color: #ffd700;
                margin: 0 0 10px 0;
                border-bottom: 1px solid #444;
                padding-bottom: 5px;
            }

            .info-section p {
                margin: 5px 0;
                line-height: 1.4;
            }

            #factsList {
                margin: 0;
                padding-left: 20px;
            }

            #factsList li {
                margin: 8px 0;
                line-height: 1.4;
            }

            #timeControlPanel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #ffd700;
                border-radius: 10px;
                padding: 15px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            #timeControlPanel h3 {
                margin: 0 0 10px 0;
                color: #ffd700;
                font-size: 14px;
            }

            .time-controls {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            #pauseBtn, #playBtn {
                background: #4a90e2;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
            }

            .speed-control {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
            }

            #timeSpeedSlider {
                flex: 1;
            }

            .preset-speeds {
                display: flex;
                gap: 5px;
            }

            .speed-preset {
                background: #333;
                color: white;
                border: 1px solid #666;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                flex: 1;
            }

            .speed-preset:hover {
                background: #555;
                border-color: #ffd700;
            }

            .speed-preset.active {
                background: #ffd700;
                color: #000;
            }

            @keyframes slideInLeft {
                from { transform: translateX(-100%) translateY(-50%); opacity: 0; }
                to { transform: translateY(-50%); opacity: 1; }
            }

            @keyframes slideOutLeft {
                from { transform: translateY(-50%); opacity: 1; }
                to { transform: translateX(-100%) translateY(-50%); opacity: 0; }
            }

            .slide-in {
                animation: slideInLeft 0.3s ease-out;
            }

            .slide-out {
                animation: slideOutLeft 0.3s ease-in;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Show detailed information for a celestial body
    showDetailedInfo(objectName) {
        const info = this.planetInfo[objectName];
        if (!info) return;

        const panel = document.getElementById('enhancedInfoPanel');
        const title = document.getElementById('planetTitle');
        const basicInfo = document.getElementById('basicInfo');
        const physicalInfo = document.getElementById('physicalInfo');
        const factsList = document.getElementById('factsList');

        title.textContent = info.name;
        
        // Basic information
        basicInfo.innerHTML = `
            <p><strong>Type:</strong> ${info.type}</p>
            ${info.distance ? `<p><strong>Distance from Sun:</strong> ${info.distance}</p>` : ''}
            ${info.day ? `<p><strong>Day Length:</strong> ${info.day}</p>` : ''}
            ${info.year ? `<p><strong>Year Length:</strong> ${info.year}</p>` : ''}
        `;

        // Physical properties
        physicalInfo.innerHTML = `
            <p><strong>Diameter:</strong> ${info.diameter}</p>
            <p><strong>Mass:</strong> ${info.mass}</p>
            <p><strong>Temperature:</strong> ${info.temperature}</p>
            ${info.composition ? `<p><strong>Composition:</strong> ${info.composition}</p>` : ''}
        `;

        // Facts
        factsList.innerHTML = info.facts.map(fact => `<li>${fact}</li>`).join('');

        // Show panel with animation
        panel.style.display = 'block';
        panel.classList.remove('slide-out');
        panel.classList.add('slide-in');
        
        this.activePanel = objectName;
    }

    // Hide information panel
    hideInfoPanel() {
        const panel = document.getElementById('enhancedInfoPanel');
        panel.classList.remove('slide-in');
        panel.classList.add('slide-out');
        
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
        
        this.activePanel = null;
    }

    // Update navigation button states
    updateNavigationState(activeTarget) {
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.target === activeTarget) {
                btn.classList.add('active');
            }
        });
    }

    // Setup event listeners for UI elements
    setupEventListeners(cameraController, timeSpeedCallback) {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                if (target === 'overview') {
                    cameraController.transitionToOverview();
                } else {
                    cameraController.transitionToPlanet(target);
                }
                this.updateNavigationState(target);
            });
        });

        // Auto tour button
        document.getElementById('autoTourBtn').addEventListener('click', (e) => {
            if (cameraController.autoTourActive) {
                cameraController.stopAutoTour();
                e.target.textContent = 'Start Auto Tour';
            } else {
                cameraController.startAutoTour();
                e.target.textContent = 'Stop Auto Tour';
            }
        });

        // Orbit button
        document.getElementById('orbitBtn').addEventListener('click', (e) => {
            if (cameraController.isOrbiting) {
                cameraController.stopOrbiting();
                e.target.textContent = 'Orbit Current';
            } else {
                const current = cameraController.getCurrentTarget();
                if (current && current !== 'overview') {
                    cameraController.orbitPlanet(current);
                    e.target.textContent = 'Stop Orbit';
                }
            }
        });

        // Time control listeners
        const pauseBtn = document.getElementById('pauseBtn');
        const playBtn = document.getElementById('playBtn');
        const speedSlider = document.getElementById('timeSpeedSlider');
        const speedDisplay = document.getElementById('speedDisplay');

        pauseBtn.addEventListener('click', () => {
            timeSpeedCallback(0);
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'block';
            speedDisplay.textContent = '0.0x';
        });

        playBtn.addEventListener('click', () => {
            const speed = parseFloat(speedSlider.value);
            timeSpeedCallback(speed);
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            speedDisplay.textContent = speed.toFixed(1) + 'x';
        });

        speedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            timeSpeedCallback(speed);
            speedDisplay.textContent = speed.toFixed(1) + 'x';
            if (speed === 0) {
                pauseBtn.style.display = 'none';
                playBtn.style.display = 'block';
            } else {
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'block';
            }
        });

        // Speed preset buttons
        document.querySelectorAll('.speed-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                speedSlider.value = speed;
                timeSpeedCallback(speed);
                speedDisplay.textContent = speed.toFixed(1) + 'x';
                
                // Update button states
                document.querySelectorAll('.speed-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (speed === 0) {
                    pauseBtn.style.display = 'none';
                    playBtn.style.display = 'block';
                } else {
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'block';
                }
            });
        });
    }
} 