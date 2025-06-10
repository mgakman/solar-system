// Camera Controls Module - Smooth Transitions Between Planets
class CameraController {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.isTransitioning = false;
        this.transitionDuration = 2000; // 2 seconds
        this.currentTarget = null;
        this.isLocked = false; // Track if camera is locked to a specific view
        
        // Easing function for smooth transitions
        this.easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        // Preset camera positions for each planet
        this.planetCameraPositions = {
            sun: { position: { x: 0, y: 8, z: 15 }, lookAt: { x: 0, y: 0, z: 0 } },
            mercury: { position: { x: 8, y: 3, z: 8 }, lookAt: { x: 5, y: 0, z: 0 } },
            venus: { position: { x: 10, y: 4, z: 10 }, lookAt: { x: 7, y: 0, z: 0 } },
            earth: { position: { x: 12, y: 5, z: 12 }, lookAt: { x: 9, y: 0, z: 0 } },
            moon: { position: { x: 11, y: 3, z: 11 }, lookAt: { x: 9, y: 0, z: 0 } }, // Close-up view of Earth-Moon system
            mars: { position: { x: 16, y: 6, z: 16 }, lookAt: { x: 12, y: 0, z: 0 } },
            jupiter: { position: { x: 22, y: 8, z: 22 }, lookAt: { x: 16, y: 0, z: 0 } },
            saturn: { position: { x: 28, y: 10, z: 28 }, lookAt: { x: 20, y: 0, z: 0 } },
            uranus: { position: { x: 34, y: 12, z: 34 }, lookAt: { x: 24, y: 0, z: 0 } },
            neptune: { position: { x: 40, y: 14, z: 40 }, lookAt: { x: 28, y: 0, z: 0 } },
            overview: { position: { x: 0, y: 30, z: 50 }, lookAt: { x: 0, y: 0, z: 0 } }
        };
        
        this.defaultPosition = { x: 0, y: 20, z: 45 };
        this.defaultLookAt = { x: 0, y: 0, z: 0 };
    }

    // Smooth transition to a planet
    transitionToPlanet(planetName) {
        if (this.isTransitioning) return;
        
        const targetData = this.planetCameraPositions[planetName];
        if (!targetData) {
            console.warn(`No camera position defined for ${planetName}`);
            return;
        }

        this.isTransitioning = true;
        this.currentTarget = planetName;
        
        // Store starting position
        const startPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        
        // Calculate current look-at point (approximation)
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        const distance = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
        const currentLookAt = {
            x: this.camera.position.x + direction.x * distance,
            y: this.camera.position.y + direction.y * distance,
            z: this.camera.position.z + direction.z * distance
        };
        
        const startTime = Date.now();
        
        const animateTransition = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            // Interpolate position
            this.camera.position.x = startPosition.x + (targetData.position.x - startPosition.x) * easedProgress;
            this.camera.position.y = startPosition.y + (targetData.position.y - startPosition.y) * easedProgress;
            this.camera.position.z = startPosition.z + (targetData.position.z - startPosition.z) * easedProgress;
            
            // Interpolate look-at
            const lookAtX = currentLookAt.x + (targetData.lookAt.x - currentLookAt.x) * easedProgress;
            const lookAtY = currentLookAt.y + (targetData.lookAt.y - currentLookAt.y) * easedProgress;
            const lookAtZ = currentLookAt.z + (targetData.lookAt.z - currentLookAt.z) * easedProgress;
            
            this.camera.lookAt(lookAtX, lookAtY, lookAtZ);
            
            if (progress < 1) {
                requestAnimationFrame(animateTransition);
                         } else {
                 this.isTransitioning = false;
                 // Lock camera to target unless it's overview
                 this.isLocked = (planetName !== 'overview');
                 // Emit event that transition is complete
                 this.onTransitionComplete(planetName);
             }
        };
        
        animateTransition();
    }

    // Transition to overview (default) position
    transitionToOverview() {
        this.isLocked = false; // Unlock camera for overview
        this.transitionToPlanet('overview');
    }

    // Reset camera to default position
    resetToDefault() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentTarget = null;
        this.isLocked = false; // Unlock camera when resetting
        
        const startPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        
        const startTime = Date.now();
        
        const animateReset = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            // Interpolate to default position
            this.camera.position.x = startPosition.x + (this.defaultPosition.x - startPosition.x) * easedProgress;
            this.camera.position.y = startPosition.y + (this.defaultPosition.y - startPosition.y) * easedProgress;
            this.camera.position.z = startPosition.z + (this.defaultPosition.z - startPosition.z) * easedProgress;
            
            this.camera.lookAt(this.defaultLookAt.x, this.defaultLookAt.y, this.defaultLookAt.z);
            
            if (progress < 1) {
                requestAnimationFrame(animateReset);
                         } else {
                 this.isTransitioning = false;
                 this.isLocked = false; // Unlock camera for free movement
                 this.onTransitionComplete('default');
             }
        };
        
        animateReset();
    }

    // Follow a planet (orbit around it)
    orbitPlanet(planetName, radius = 10, speed = 0.5) {
        if (this.isTransitioning) return;
        
        const targetData = this.planetCameraPositions[planetName];
        if (!targetData) return;
        
        this.isOrbiting = true;
        this.orbitTarget = planetName;
        this.orbitRadius = radius;
        this.orbitSpeed = speed;
        this.orbitAngle = 0;
        this.orbitCenter = targetData.lookAt;
    }

    // Stop orbiting
    stopOrbiting() {
        this.isOrbiting = false;
        this.orbitTarget = null;
    }

    // Update camera for orbiting (call in animation loop)
    updateOrbiting(deltaTime) {
        if (!this.isOrbiting || !this.orbitCenter) return;
        
        this.orbitAngle += this.orbitSpeed * deltaTime;
        
        const x = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        const z = this.orbitCenter.z + Math.sin(this.orbitAngle) * this.orbitRadius;
        const y = this.orbitCenter.y + 5; // Slightly above
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.orbitCenter.x, this.orbitCenter.y, this.orbitCenter.z);
    }

    // Get available planets for navigation
    getAvailablePlanets() {
        return Object.keys(this.planetCameraPositions).filter(name => name !== 'overview');
    }

    // Check if camera is currently transitioning
    isInTransition() {
        return this.isTransitioning;
    }

    // Check if camera is locked to a specific target
    isLockedToTarget() {
        return this.isLocked;
    }

    // Get current target
    getCurrentTarget() {
        return this.currentTarget;
    }

    // Callback for when transition completes
    onTransitionComplete(target) {
        // Override this method to handle transition completion
        console.log(`Camera transition to ${target} completed`);
    }

    // Auto-tour functionality
    startAutoTour() {
        if (this.isTransitioning || this.autoTourActive) return;
        
        this.autoTourActive = true;
        this.autoTourIndex = 0;
        this.autoTourPlanets = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        this.autoTourInterval = 4000; // 4 seconds per planet
        
        this.nextAutoTourTarget();
    }

    nextAutoTourTarget() {
        if (!this.autoTourActive) return;
        
        const currentPlanet = this.autoTourPlanets[this.autoTourIndex];
        this.transitionToPlanet(currentPlanet);
        
        this.autoTourIndex = (this.autoTourIndex + 1) % this.autoTourPlanets.length;
        
        setTimeout(() => {
            this.nextAutoTourTarget();
        }, this.autoTourInterval);
    }

    stopAutoTour() {
        this.autoTourActive = false;
    }

    // Manually unlock camera for free movement
    unlockCamera() {
        this.isLocked = false;
        this.currentTarget = null;
    }

    // Lock camera to current position
    lockCamera() {
        this.isLocked = true;
    }
} 