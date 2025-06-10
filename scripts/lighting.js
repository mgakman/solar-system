// Enhanced Lighting Effects Module
class LightingSystem {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.lights = {};
        this.glowEffects = {};
        
        // Enable shadow mapping
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.soft = true;
    }

    // Create enhanced sun lighting with glow effect
    createSunLighting(sunMesh) {
        // Main sun light (point light) - increased intensity for better planet illumination
        const sunLight = new THREE.PointLight(0xffffff, 3, 200);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 200;
        this.scene.add(sunLight);
        this.lights.sunLight = sunLight;
        
        // Additional directional light for better planet visibility
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
        this.lights.directionalLight = directionalLight;

        // Strong ambient light for excellent planet visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        this.lights.ambientLight = ambientLight;
        
        // Additional hemisphere light for natural looking illumination
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x2c1810, 0.4);
        this.scene.add(hemisphereLight);
        this.lights.hemisphereLight = hemisphereLight;

        // Create sun glow effect
        this.createSunGlow(sunMesh);

        // Add sun corona effect
        this.createSunCorona(sunMesh);
    }

    // Create sun glow effect
    createSunGlow(sunMesh) {
        // Inner glow
        const glowGeometry = new THREE.SphereGeometry(3.2, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffaa00) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(color, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glowMesh);
        this.glowEffects.sunGlow = { mesh: glowMesh, material: glowMaterial };

        // Outer glow
        const outerGlowGeometry = new THREE.SphereGeometry(4.5, 32, 32);
        const outerGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff6600) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.4 - dot(vNormal, vec3(0, 0, 1.0)), 1.5);
                    gl_FragColor = vec4(color, 0.3) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        this.scene.add(outerGlowMesh);
        this.glowEffects.sunOuterGlow = { mesh: outerGlowMesh, material: outerGlowMaterial };
    }

    // Create sun corona effect
    createSunCorona(sunMesh) {
        const coronaGeometry = new THREE.RingGeometry(2.8, 6.0, 64);
        const coronaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffaa00) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                void main() {
                    float dist = distance(vUv, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.1 + 0.05 * sin(time * 2.0 + dist * 10.0);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const coronaMesh = new THREE.Mesh(coronaGeometry, coronaMaterial);
        coronaMesh.lookAt(0, 0, 1); // Face the camera
        this.scene.add(coronaMesh);
        this.glowEffects.sunCorona = { mesh: coronaMesh, material: coronaMaterial };
    }

    // Enable shadows for planets
    enablePlanetShadows(planetMesh) {
        if (planetMesh) {
            planetMesh.castShadow = true;
            planetMesh.receiveShadow = true;
        }
    }

    // Update lighting effects (call in animation loop)
    update(time) {
        // Update glow effects
        Object.values(this.glowEffects).forEach(effect => {
            if (effect.material && effect.material.uniforms && effect.material.uniforms.time) {
                effect.material.uniforms.time.value = time;
            }
        });

        // Animate sun light intensity (keep it bright for planet visibility)
        if (this.lights.sunLight) {
            this.lights.sunLight.intensity = 3 + 0.3 * Math.sin(time * 0.5);
        }
        
        // Ensure ambient light stays strong for planet visibility
        if (this.lights.ambientLight) {
            this.lights.ambientLight.intensity = 0.6 + 0.1 * Math.sin(time * 0.3);
        }
    }

    // Create atmospheric glow for Earth
    createAtmosphericGlow(earthMesh, earthSize) {
        const atmosphereGeometry = new THREE.SphereGeometry(earthSize * 1.1, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphereMesh.position.copy(earthMesh.position);
        this.scene.add(atmosphereMesh);
        this.glowEffects.earthAtmosphere = { mesh: atmosphereMesh, material: atmosphereMaterial };
        
        return atmosphereMesh;
    }
} 