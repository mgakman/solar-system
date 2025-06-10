// 3D Solar System - Milestone 3 (Enhanced Features and Effects)
let scene, camera, renderer;
let sun, planets = {}, planetGroups = {};
let timeSpeed = 1;
let raycaster, mouse;
let textureLoader;

// Milestone 3 systems
let lightingSystem;
let cameraController;
let uiManager;
let celestialObjectsManager;

// Mouse control variables
let mouseX = 0, mouseY = 0;
let isMouseDown = false;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// High-quality 2K texture URLs using local files
const textureUrls = {
    sun: './textures/sun.jpg',
    mercury: './textures/mercury.jpg',
    venus: './textures/venus.jpg',
    earth: './textures/earth.jpg',
    earthClouds: './textures/earth_clouds.jpg',
    moon: './textures/moon.jpg',
    mars: './textures/mars.jpg',
    jupiter: './textures/jupiter.jpg',
    saturn: './textures/saturn.jpg',
    saturnRings: './textures/saturn_rings.png',
    uranus: './textures/uranus.jpg',
    neptune: './textures/neptune.jpg',
    stars: './textures/stars.jpg'
};

// Fallback colors for each celestial body
const fallbackColors = {
    sun: 0xffd700,
    mercury: 0x8c7853,
    venus: 0xffc649,
    earth: 0x4a90e2,
    earthClouds: 0xffffff,
    moon: 0xc0c0c0,
    mars: 0xcd5c5c,
    jupiter: 0xd8ca9d,
    saturn: 0xfad5a5,
    saturnRings: 0xd2b48c,
    uranus: 0x4fd0e4,
    neptune: 0x4b70dd,
    stars: 0x222222
};

// Planet data with better visibility (closer and larger for demo purposes)
const planetData = {
    mercury: { size: 0.4, distance: 5, speed: 4.0, color: 0x8c7853, name: "Mercury", info: "Closest to the Sun, fastest orbit" },
    venus: { size: 0.6, distance: 7, speed: 1.6, color: 0xffc649, name: "Venus", info: "Hottest planet, thick atmosphere" },
    earth: { size: 0.7, distance: 9, speed: 1.0, color: 0x4a90e2, name: "Earth", info: "Our home planet, has water and life" },
    mars: { size: 0.5, distance: 12, speed: 0.5, color: 0xcd5c5c, name: "Mars", info: "The Red Planet, has polar ice caps" },
    jupiter: { size: 1.8, distance: 16, speed: 0.2, color: 0xd8ca9d, name: "Jupiter", info: "Largest planet, has Great Red Spot" },
    saturn: { size: 1.5, distance: 20, speed: 0.1, color: 0xfad5a5, name: "Saturn", info: "Has beautiful rings" },
    uranus: { size: 1.0, distance: 24, speed: 0.05, color: 0x4fd0e4, name: "Uranus", info: "Ice giant, rotates on its side" },
    neptune: { size: 1.0, distance: 28, speed: 0.03, color: 0x4b70dd, name: "Neptune", info: "Windiest planet, deep blue color" }
};

// Initialize the 3D scene
function init() {
    console.log("Initializing Enhanced Solar System with Milestone 3 features...");
    
    // Create scene
    scene = new THREE.Scene();
    console.log("Scene created");
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 45);
    console.log("Camera created");
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    
    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    console.log("Renderer created and added to DOM");
    
    // Initialize texture loader and raycaster
    textureLoader = new THREE.TextureLoader();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Initialize Milestone 3 systems
    lightingSystem = new LightingSystem(scene, renderer);
    cameraController = new CameraController(camera, scene);
    uiManager = new UIManager();
    celestialObjectsManager = new CelestialObjectsManager(scene, textureLoader);
    
    // Create celestial bodies
    createSun();
    createAllPlanets();
    
    // Add enhanced lighting (replaces basic lighting)
    lightingSystem.createSunLighting(sun);
    
    // Add stars background
    createStars();
    
    // Add orbital paths
    createOrbitalPaths();
    
    // Create enhanced objects
    celestialObjectsManager.createAsteroidBelt();
    celestialObjectsManager.createDwarfPlanets();
    celestialObjectsManager.createComets();
    celestialObjectsManager.createKuiperBelt();
    
    // Set up event listeners
    setupEventListeners();
    
    // Create info panel (replaced by enhanced UI)
    createInfoPanel();
    
    // Setup UI event listeners
    uiManager.setupEventListeners(cameraController, setTimeSpeed);
    
    console.log("Enhanced solar system with Milestone 3 features complete");
    
    // Start animation loop
    animate();
}

// Create the Sun with texture
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    
    textureLoader.load(
        textureUrls.sun,
        function(texture) {
            const sunMaterial = new THREE.MeshBasicMaterial({ 
                map: texture,
                emissive: 0xffaa00,
                emissiveIntensity: 0.1
            });
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            sun.name = "Sun";
            sun.userData = { info: "The center of our solar system, a massive star" };
            scene.add(sun);
            console.log("Sun created with texture");
        },
        function(progress) {
            console.log("Loading sun texture: " + (progress.loaded / progress.total * 100) + '%');
        },
        function(error) {
            console.error("Error loading sun texture:", error);
            // Fallback to simple material
            const sunMaterial = new THREE.MeshBasicMaterial({ 
                color: fallbackColors.sun,
                emissive: fallbackColors.sun,
                emissiveIntensity: 0.4
            });
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            sun.name = "Sun";
            sun.userData = { info: "The center of our solar system, a massive star" };
            scene.add(sun);
            console.log("Sun created with fallback material");
        }
    );
}

// Create all planets
function createAllPlanets() {
    // Create Earth and Moon first (special case)
    createEarthSystem();
    console.log("Earth system created");
    
    // Create all other planets
    Object.keys(planetData).forEach(planetKey => {
        if (planetKey !== 'earth') {
            createPlanet(planetKey);
            console.log(`${planetKey} created at distance ${planetData[planetKey].distance}`);
        }
    });
    
    console.log("All planets created - total planets:", Object.keys(planets).length);
}

// Create Earth with Moon system using textures
function createEarthSystem() {
    const earthGroup = new THREE.Group();
    const data = planetData.earth;
    
    // Earth sphere with texture
    const earthGeometry = new THREE.SphereGeometry(data.size, 32, 32);
    
    textureLoader.load(
        textureUrls.earth,
        function(earthTexture) {
            // Load clouds texture
            textureLoader.load(
                textureUrls.earthClouds,
                function(cloudsTexture) {
                    // Earth with day texture
                    const earthMaterial = new THREE.MeshLambertMaterial({ 
                        map: earthTexture
                    });
                    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
                    
                    // Earth clouds layer
                    const cloudsGeometry = new THREE.SphereGeometry(data.size * 1.01, 32, 32);
                    const cloudsMaterial = new THREE.MeshLambertMaterial({
                        map: cloudsTexture,
                        transparent: true,
                        opacity: 0.3
                    });
                    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
                    
                    earth.position.set(data.distance, 0, 0);
                    clouds.position.set(data.distance, 0, 0);
                    earth.castShadow = true;
                    earth.receiveShadow = true;
                    earth.name = data.name;
                    earth.userData = { info: data.info };
                    
                    // Set clouds name and make them ignore raycasting
                    clouds.name = "Earth Clouds";
                    clouds.userData = { info: data.info, isEarth: true, parentName: "Earth" };
                    clouds.raycast = () => {}; // Disable raycasting for clouds
                    
                    earthGroup.add(earth);
                    earthGroup.add(clouds);
                    planets.earth = earth;
                    planets.earthClouds = clouds;
                    
                    // Create Moon
                    createMoon(earthGroup);
                    
                    planetGroups.earth = earthGroup;
                    scene.add(earthGroup);
                    console.log("Earth created with textures and clouds");
                },
                function(progress) {
                    console.log("Loading Earth clouds texture: " + (progress.loaded / progress.total * 100) + '%');
                },
                function(error) {
                    console.error("Error loading Earth clouds texture:", error);
                    // Create Earth without clouds
                    createEarthFallback(earthGroup, data, earthTexture);
                }
            );
        },
        function(progress) {
            console.log("Loading Earth texture: " + (progress.loaded / progress.total * 100) + '%');
        },
        function(error) {
            console.error("Error loading Earth texture:", error);
            // Create Earth with fallback color
            createEarthFallback(earthGroup, data, null);
        }
    );
}

// Create Earth fallback (with or without texture)
function createEarthFallback(earthGroup, data, earthTexture) {
    const earthGeometry = new THREE.SphereGeometry(data.size, 32, 32);
    const earthMaterial = earthTexture ? 
        new THREE.MeshLambertMaterial({ 
            map: earthTexture
        }) :
        new THREE.MeshLambertMaterial({ 
            color: fallbackColors.earth
        });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(data.distance, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;
    earth.name = data.name;
    earth.userData = { info: data.info };
    
    earthGroup.add(earth);
    planets.earth = earth;
    
    // Create Moon
    createMoon(earthGroup);
    
    planetGroups.earth = earthGroup;
    scene.add(earthGroup);
    console.log("Earth created with fallback material");
}

// Create Moon with proper orbit around Earth
function createMoon(earthGroup) {
    console.log("=== CREATING PROPER ORBITING MOON ===");
    
    // Create Moon group for orbital animation
    const moonGroup = new THREE.Group();
    const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Much larger for visibility
    
    // Load Moon texture for realistic appearance
    textureLoader.load(
        textureUrls.moon,
        function(moonTexture) {
            const moonMaterial = new THREE.MeshLambertMaterial({ 
                map: moonTexture
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.set(2.0, 0, 0); // Further from Earth center for clear visibility
            moon.castShadow = true;
            moon.receiveShadow = true;
            moon.name = "Moon";
            moon.userData = { 
                info: "Earth's natural satellite, formed 4.5 billion years ago",
                type: "Moon",
                diameter: "3,474 km",
                distance: "384,400 km from Earth"
            };
            
            moonGroup.add(moon);
            earthGroup.add(moonGroup);
            
            planets.moon = moon;
            planetGroups.moonGroup = moonGroup;
            
            console.log("🌙 Moon created with texture and added to Earth group");
            console.log("🌙 Moon local position relative to Earth:", moon.position);
        },
        function(progress) {
            console.log("Loading Moon texture: " + (progress.loaded / progress.total * 100) + '%');
        },
        function(error) {
            console.error("Error loading Moon texture, using fallback:", error);
            // Fallback with realistic gray color
            const moonMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xcccccc // Realistic gray color
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.set(2.0, 0, 0); // Further from Earth center for clear visibility
            moon.castShadow = true;
            moon.receiveShadow = true;
            moon.name = "Moon";
            moon.userData = { 
                info: "Earth's natural satellite, formed 4.5 billion years ago",
                type: "Moon",
                diameter: "3,474 km",
                distance: "384,400 km from Earth"
            };
            
            moonGroup.add(moon);
            earthGroup.add(moonGroup);
            
            planets.moon = moon;
            planetGroups.moonGroup = moonGroup;
            
            console.log("🌙 Moon created with fallback material and added to Earth group");
        }
    );
}

// Create individual planet with texture
function createPlanet(planetKey) {
    const data = planetData[planetKey];
    const planetGroup = new THREE.Group();
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    
    textureLoader.load(
        textureUrls[planetKey],
        function(texture) {
            const material = new THREE.MeshLambertMaterial({ 
                map: texture
            });
            
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(data.distance, 0, 0);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.name = data.name;
            planet.userData = { info: data.info };
            
            // Special case for Saturn - add rings with texture
            if (planetKey === 'saturn') {
                const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2, 32);
                
                textureLoader.load(
                    textureUrls.saturnRings,
                    function(ringTexture) {
                        const ringMaterial = new THREE.MeshLambertMaterial({ 
                            map: ringTexture,
                            transparent: true, 
                            opacity: 0.8,
                            side: THREE.DoubleSide
                        });
                        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                        rings.rotation.x = Math.PI / 2;
                        planet.add(rings);
                        console.log("Saturn rings created with texture");
                    },
                    function(progress) {
                        console.log("Loading Saturn rings texture: " + (progress.loaded / progress.total * 100) + '%');
                    },
                    function(error) {
                        console.error("Error loading Saturn rings texture:", error);
                        // Fallback rings
                        const ringMaterial = new THREE.MeshLambertMaterial({ 
                            color: fallbackColors.saturnRings,
                            transparent: true, 
                            opacity: 0.8,
                            side: THREE.DoubleSide
                        });
                        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                        rings.rotation.x = Math.PI / 2;
                        planet.add(rings);
                        console.log("Saturn rings created with fallback material");
                    }
                );
            }
            
            planetGroup.add(planet);
            planets[planetKey] = planet;
            planetGroups[planetKey] = planetGroup;
            
            scene.add(planetGroup);
            console.log(`${planetKey} created with texture`);
        },
        function(progress) {
            console.log(`Loading ${planetKey} texture: ` + (progress.loaded / progress.total * 100) + '%');
        },
        function(error) {
            console.error(`Error loading ${planetKey} texture:`, error);
            // Fallback to simple colored material
            const material = new THREE.MeshLambertMaterial({ 
                color: fallbackColors[planetKey] || data.color
            });
            
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(data.distance, 0, 0);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.name = data.name;
            planet.userData = { info: data.info };
            
            // Special case for Saturn - add fallback rings
            if (planetKey === 'saturn') {
                const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2, 32);
                const ringMaterial = new THREE.MeshLambertMaterial({ 
                    color: fallbackColors.saturnRings,
                    transparent: true, 
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planet.add(rings);
                console.log("Saturn rings created with fallback material");
            }
            
            planetGroup.add(planet);
            planets[planetKey] = planet;
            planetGroups[planetKey] = planetGroup;
            
            scene.add(planetGroup);
            console.log(`${planetKey} created with fallback material`);
        }
    );
}

// Create orbital paths
function createOrbitalPaths() {
    Object.keys(planetData).forEach(planetKey => {
        const data = planetData[planetKey];
        const points = [];
        
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * data.distance, 
                0, 
                Math.sin(angle) * data.distance
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x333333, 
            transparent: true, 
            opacity: 0.3 
        });
        const orbit = new THREE.Line(geometry, material);
        scene.add(orbit);
    });
    
    console.log("Orbital paths created");
}

// Add lighting to the scene
function addLighting() {
    // Strong ambient light for excellent texture visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Main directional light from the sun
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(0, 10, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);
    
    // Additional point light at sun position for glow
    const sunGlow = new THREE.PointLight(0xffd700, 0.5, 100);
    sunGlow.position.set(0, 0, 0);
    scene.add(sunGlow);
    
    // Hemisphere light for natural looking illumination
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x2c1810, 0.3);
    scene.add(hemisphereLight);
    
    console.log("Enhanced lighting added");
}

// Create stars background with texture
function createStars() {
    // Create a large sphere for the starfield
    const starsGeometry = new THREE.SphereGeometry(500, 32, 32);
    
    textureLoader.load(
        textureUrls.stars,
        function(starsTexture) {
            const starsMaterial = new THREE.MeshBasicMaterial({
                map: starsTexture,
                side: THREE.BackSide
            });
            const starsSphere = new THREE.Mesh(starsGeometry, starsMaterial);
            scene.add(starsSphere);
            console.log("Stars created with Milky Way texture");
        },
        function(progress) {
            console.log("Loading stars texture: " + (progress.loaded / progress.total * 100) + '%');
        },
        function(error) {
            console.error("Error loading stars texture:", error);
            // Fallback to point stars
            const pointStarsGeometry = new THREE.BufferGeometry();
            const pointStarsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
            
            const pointStarsVertices = [];
            for (let i = 0; i < 1000; i++) {
                const x = (Math.random() - 0.5) * 200;
                const y = (Math.random() - 0.5) * 200;
                const z = (Math.random() - 0.5) * 200;
                pointStarsVertices.push(x, y, z);
            }
            
            pointStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointStarsVertices, 3));
            const pointStars = new THREE.Points(pointStarsGeometry, pointStarsMaterial);
            scene.add(pointStars);
            console.log("Stars created with fallback point system");
        }
    );
}

// Create info panel
function createInfoPanel() {
    const infoPanel = document.createElement('div');
    infoPanel.id = 'planetInfo';
    infoPanel.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        display: none;
        max-width: 250px;
        z-index: 100;
        backdrop-filter: blur(10px);
    `;
    document.body.appendChild(infoPanel);
}

// Set up event listeners
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse controls
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('wheel', onMouseWheel, { passive: false });
    
    // Mouse click for planet info
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Reset camera button
    document.getElementById('resetCamera').addEventListener('click', resetCamera);
    
    // Time speed control
    const timeSpeedSlider = document.getElementById('timeSpeed');
    const speedValue = document.getElementById('speedValue');
    
    timeSpeedSlider.addEventListener('input', (e) => {
        timeSpeed = parseFloat(e.target.value);
        speedValue.textContent = timeSpeed + 'x';
    });
    
    console.log("Event listeners set up");
}

// Mouse movement for camera rotation
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.008;
    mouseY = (event.clientY - windowHalfY) * 0.008;
    
    // Update mouse for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Check for hover
    checkHover();
}

// Mouse wheel zoom handler
function onMouseWheel(event) {
    event.preventDefault();
    
    // Only apply zoom if camera is not locked or transitioning
    if (cameraController && (cameraController.isLockedToTarget() || cameraController.isInTransition())) {
        return;
    }
    
    const zoomSpeed = 0.1;
    const zoomDirection = event.deltaY > 0 ? 1 : -1;
    
    // Calculate zoom based on current distance from origin
    const currentDistance = camera.position.length();
    const zoomAmount = currentDistance * zoomSpeed * zoomDirection;
    
    // Apply zoom by moving camera closer/further from center
    const direction = camera.position.clone().normalize();
    const newPosition = camera.position.clone().add(direction.multiplyScalar(zoomAmount));
    
    // Limit zoom range (don't get too close or too far)
    const minDistance = 5;
    const maxDistance = 200;
    const newDistance = newPosition.length();
    
    if (newDistance >= minDistance && newDistance <= maxDistance) {
        camera.position.copy(newPosition);
    }
}

// Mouse click handler
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Get all objects for raycasting (including enhanced objects)
    let allObjects = Object.values(planets).concat([sun]);
    // Filter out Earth clouds to prevent click interference
    allObjects = allObjects.filter(obj => obj.name !== "Earth Clouds");
    if (celestialObjectsManager) {
        allObjects = allObjects.concat(celestialObjectsManager.getAllObjects());
    }
    
    const intersects = raycaster.intersectObjects(allObjects);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        console.log("Clicked object:", object.name, "Available info keys:", Object.keys(uiManager.planetInfo));
        
        // Handle special case for Earth clouds
        let targetName = object.name;
        if (object.userData && object.userData.isEarth && object.userData.parentName) {
            targetName = object.userData.parentName;
        }
        
        // Use enhanced UI if available
        if (uiManager && targetName && uiManager.planetInfo[targetName.toLowerCase()]) {
            uiManager.showDetailedInfo(targetName.toLowerCase());
        } else {
            console.log("Falling back to basic info for:", targetName);
            showPlanetInfo(object);
        }
    } else {
        if (uiManager) {
            uiManager.hideInfoPanel();
        }
        hidePlanetInfo();
    }
}

// Check for hover effects
function checkHover() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(planets).concat([sun]));
    
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        // Show hover info
        const object = intersects[0].object;
        showHoverInfo(object);
    } else {
        document.body.style.cursor = 'default';
        hideHoverInfo();
    }
}

// Show hover information
function showHoverInfo(object) {
    let hoverPanel = document.getElementById('hoverInfo');
    if (!hoverPanel) {
        hoverPanel = document.createElement('div');
        hoverPanel.id = 'hoverInfo';
        hoverPanel.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            pointer-events: none;
            font-size: 14px;
            z-index: 1000;
            border: 1px solid #ffd700;
        `;
        document.body.appendChild(hoverPanel);
    }
    
    hoverPanel.innerHTML = `<strong>${object.name}</strong>`;
    hoverPanel.style.display = 'block';
    
    // Update position near mouse
    hoverPanel.style.left = (mouse.x * window.innerWidth / 2 + window.innerWidth / 2 + 20) + 'px';
    hoverPanel.style.top = (-mouse.y * window.innerHeight / 2 + window.innerHeight / 2 - 30) + 'px';
}

// Hide hover information
function hideHoverInfo() {
    const hoverPanel = document.getElementById('hoverInfo');
    if (hoverPanel) {
        hoverPanel.style.display = 'none';
    }
}

// Show planet information
function showPlanetInfo(object) {
    const infoPanel = document.getElementById('planetInfo');
    infoPanel.innerHTML = `
        <h3>${object.name}</h3>
        <p>${object.userData.info}</p>
        <small>Click elsewhere to close</small>
    `;
    infoPanel.style.display = 'block';
}

// Hide planet information
function hidePlanetInfo() {
    const infoPanel = document.getElementById('planetInfo');
    infoPanel.style.display = 'none';
}

// Reset camera to initial position
function resetCamera() {
    if (cameraController) {
        cameraController.resetToDefault();
        cameraController.unlockCamera(); // Ensure camera is unlocked for free movement
    } else {
        camera.position.set(0, 20, 45);
        mouseX = 0;
        mouseY = 0;
    }
    hidePlanetInfo();
}

// Set time speed (called by UI controls)
function setTimeSpeed(speed) {
    timeSpeed = speed;
}

// Handle window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001 * timeSpeed;
    
    // Rotate the sun
    if (sun) {
        sun.rotation.y = time * 0.5;
    }
    
    // Animate all planets
    Object.keys(planetData).forEach(planetKey => {
        const data = planetData[planetKey];
        const planetGroup = planetGroups[planetKey];
        const planet = planets[planetKey];
        
        if (planetGroup && planet) {
            // Planet revolution around sun
            planetGroup.rotation.y = time * data.speed;
            
            // Planet rotation
            planet.rotation.y = time * (data.speed * 10);
        }
    });
    
    // Special handling for Moon - make orbital motion very obvious
    if (planetGroups.moonGroup && planets.moon) {
        // Make Moon orbit Earth clearly visible - faster than realistic but obvious
        planetGroups.moonGroup.rotation.y = time * 8; // Much faster orbital revolution around Earth
        // Moon is tidally locked - same side always faces Earth (synchronous rotation)
        planets.moon.rotation.y = time * 8; // Same rotation speed as orbit
        
        // Debug: Log Moon position more frequently for troubleshooting
        if (Math.floor(time * 2) % 10 === 0 && Math.floor(time * 20) % 20 === 0) {
            const worldPos = new THREE.Vector3();
            planets.moon.getWorldPosition(worldPos);
            console.log("🌙 MOON DEBUG - Group rotation:", planetGroups.moonGroup.rotation.y.toFixed(2), "World pos:", worldPos);
            console.log("🌙 Moon local position:", planets.moon.position);
            console.log("🌙 Moon visible:", planets.moon.visible);
        }
    } else {
        // Debug why Moon might not be animating
        if (Math.floor(time) % 10 === 0 && Math.floor(time * 10) % 10 === 0) {
            console.log("❌ MOON MISSING - moonGroup exists:", !!planetGroups.moonGroup, "moon exists:", !!planets.moon);
        }
    }
    
    // Rotate Earth clouds separately for realism
    if (planets.earthClouds) {
        planets.earthClouds.rotation.y = time * 1.2; // Slightly different speed
    }
    
    // Update Milestone 3 systems
    if (lightingSystem) {
        lightingSystem.update(time);
    }
    
    if (cameraController) {
        cameraController.updateOrbiting(0.016); // Assuming 60fps for deltaTime
        
        // Only apply mouse movement if camera is not transitioning, orbiting, or locked to a target
        if (!cameraController.isInTransition() && !cameraController.isOrbiting && !cameraController.isLockedToTarget()) {
            camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 10 - camera.position.y + 20) * 0.05;
            camera.lookAt(scene.position);
        }
    } else {
        // Fallback to original mouse movement
        camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 10 - camera.position.y + 20) * 0.05;
        camera.lookAt(scene.position);
    }
    
    if (celestialObjectsManager) {
        celestialObjectsManager.updateAll(time, timeSpeed);
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Wait for DOM to be fully loaded, then initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing complete solar system with 4K textures...");
    init();
});

// Also initialize immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Do nothing, wait for DOMContentLoaded
} else {
    console.log("DOM already loaded, initializing complete solar system with 4K textures immediately...");
    init();
} 