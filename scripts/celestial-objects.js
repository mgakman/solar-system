// Enhanced Celestial Objects Module - Asteroid Belt and Dwarf Planets
class CelestialObjectsManager {
    constructor(scene, textureLoader) {
        this.scene = scene;
        this.textureLoader = textureLoader;
        this.asteroids = [];
        this.dwarfPlanets = {};
        this.comets = [];
        
        // Dwarf planet data
        this.dwarfPlanetData = {
            pluto: { 
                size: 0.3, 
                distance: 32, 
                speed: 0.02, 
                color: 0xc0c0c0, 
                name: "Pluto", 
                info: "Former 9th planet, now classified as dwarf planet",
                type: "Dwarf Planet"
            },
            ceres: { 
                size: 0.15, 
                distance: 14, 
                speed: 0.3, 
                color: 0x8c7853, 
                name: "Ceres", 
                info: "Largest object in asteroid belt",
                type: "Dwarf Planet"
            },
            eris: { 
                size: 0.32, 
                distance: 45, 
                speed: 0.015, 
                color: 0xf0f0f0, 
                name: "Eris", 
                info: "Most massive dwarf planet, beyond Pluto",
                type: "Dwarf Planet"
            },
            makemake: { 
                size: 0.2, 
                distance: 38, 
                speed: 0.018, 
                color: 0xd2691e, 
                name: "Makemake", 
                info: "Kuiper belt object with no known moons",
                type: "Dwarf Planet"
            },
            haumea: { 
                size: 0.25, 
                distance: 35, 
                speed: 0.019, 
                color: 0xffd700, 
                name: "Haumea", 
                info: "Elongated dwarf planet with rings",
                type: "Dwarf Planet"
            }
        };
    }

    // Create asteroid belt between Mars and Jupiter
    createAsteroidBelt() {
        const asteroidCount = 800;
        const innerRadius = 13; // Between Mars and Jupiter
        const outerRadius = 18;
        
        for (let i = 0; i < asteroidCount; i++) {
            // Random position in belt
            const angle = Math.random() * Math.PI * 2;
            const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
            
            // Vary height slightly for more realistic distribution
            const height = (Math.random() - 0.5) * 2;
            
            // Random size for asteroids
            const size = 0.02 + Math.random() * 0.08;
            
            // Create asteroid geometry
            const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
            const asteroidMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.1, 0.3, 0.3 + Math.random() * 0.3) 
            });
            
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            
            // Position asteroid
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = height;
            
            // Add some rotation
            asteroid.rotation.x = Math.random() * Math.PI;
            asteroid.rotation.y = Math.random() * Math.PI;
            asteroid.rotation.z = Math.random() * Math.PI;
            
            // Store orbital data
            asteroid.userData = {
                angle: angle,
                distance: distance,
                speed: 0.4 + Math.random() * 0.2, // Varied orbital speeds
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                originalHeight: height
            };
            
            asteroid.name = `Asteroid_${i}`;
            asteroid.castShadow = true;
            asteroid.receiveShadow = true;
            
            this.asteroids.push(asteroid);
            this.scene.add(asteroid);
        }
        
        console.log(`Created ${asteroidCount} asteroids in belt`);
    }

    // Create dwarf planets
    createDwarfPlanets() {
        Object.keys(this.dwarfPlanetData).forEach(planetKey => {
            this.createDwarfPlanet(planetKey);
        });
    }

    // Create individual dwarf planet
    createDwarfPlanet(planetKey) {
        const data = this.dwarfPlanetData[planetKey];
        const planetGroup = new THREE.Group();
        
        // Create planet geometry
        const planetGeometry = new THREE.SphereGeometry(data.size, 16, 16);
        const planetMaterial = new THREE.MeshLambertMaterial({ 
            color: data.color 
        });
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(data.distance, 0, 0);
        planet.name = data.name;
        planet.userData = data;
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        planetGroup.add(planet);
        planetGroup.name = `${data.name}Group`;
        
        this.scene.add(planetGroup);
        this.dwarfPlanets[planetKey] = planet;
        
        // Special case for Pluto - add Charon moon
        if (planetKey === 'pluto') {
            this.createCharon(planetGroup);
        }
        
        console.log(`Created dwarf planet: ${data.name}`);
    }

    // Create Charon (Pluto's moon)
    createCharon(plutoGroup) {
        const charonGeometry = new THREE.SphereGeometry(0.12, 12, 12);
        const charonMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        
        const charon = new THREE.Mesh(charonGeometry, charonMaterial);
        charon.position.set(1.5, 0, 0); // Relative to Pluto
        charon.name = "Charon";
        charon.userData = { 
            info: "Pluto's largest moon, unusually large relative to Pluto",
            type: "Moon"
        };
        charon.castShadow = true;
        charon.receiveShadow = true;
        
        // Create moon orbit group
        const charonOrbit = new THREE.Group();
        charonOrbit.add(charon);
        charonOrbit.name = "CharonOrbit";
        
        plutoGroup.add(charonOrbit);
        this.dwarfPlanets.charon = charon;
    }

    // Create comets with tails
    createComets() {
        const cometCount = 3;
        
        for (let i = 0; i < cometCount; i++) {
            const comet = this.createComet(i);
            this.comets.push(comet);
            this.scene.add(comet.group);
        }
        
        console.log(`Created ${cometCount} comets`);
    }

    // Create individual comet
    createComet(index) {
        const cometGroup = new THREE.Group();
        
        // Comet nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const nucleusMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        
        // Comet tail (using particles or line geometry)
        const tailGeometry = new THREE.BufferGeometry();
        const tailPositions = [];
        const tailColors = [];
        
        // Create tail points
        for (let i = 0; i < 50; i++) {
            const distance = i * 0.2;
            const spread = i * 0.05;
            
            tailPositions.push(
                -distance + (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread
            );
            
            const alpha = 1 - (i / 50);
            tailColors.push(0.8, 0.8, 1.0, alpha);
        }
        
        tailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tailPositions, 3));
        tailGeometry.setAttribute('color', new THREE.Float32BufferAttribute(tailColors, 4));
        
        const tailMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const tail = new THREE.Points(tailGeometry, tailMaterial);
        
        cometGroup.add(nucleus);
        cometGroup.add(tail);
        
        // Set random orbital parameters
        const distance = 25 + Math.random() * 20;
        const angle = Math.random() * Math.PI * 2;
        const inclination = (Math.random() - 0.5) * 0.5; // Random inclination
        
        cometGroup.position.x = Math.cos(angle) * distance;
        cometGroup.position.z = Math.sin(angle) * distance;
        cometGroup.position.y = Math.sin(inclination) * distance;
        
        return {
            group: cometGroup,
            nucleus: nucleus,
            tail: tail,
            angle: angle,
            distance: distance,
            inclination: inclination,
            speed: 0.01 + Math.random() * 0.02,
            name: `Comet_${index + 1}`
        };
    }

    // Update asteroid positions and rotations
    updateAsteroids(time, timeSpeed) {
        this.asteroids.forEach(asteroid => {
            const userData = asteroid.userData;
            
            // Update orbital position
            userData.angle += userData.speed * timeSpeed * 0.001;
            asteroid.position.x = Math.cos(userData.angle) * userData.distance;
            asteroid.position.z = Math.sin(userData.angle) * userData.distance;
            
            // Update rotation
            asteroid.rotation.x += userData.rotationSpeed;
            asteroid.rotation.y += userData.rotationSpeed * 0.7;
            asteroid.rotation.z += userData.rotationSpeed * 0.3;
        });
    }

    // Update dwarf planet positions
    updateDwarfPlanets(time, timeSpeed) {
        Object.keys(this.dwarfPlanetData).forEach(planetKey => {
            const data = this.dwarfPlanetData[planetKey];
            const planetGroup = this.scene.getObjectByName(`${data.name}Group`);
            const planet = this.dwarfPlanets[planetKey];
            
            if (planetGroup && planet) {
                // Planet revolution around sun
                planetGroup.rotation.y = time * data.speed * timeSpeed;
                
                // Planet rotation
                planet.rotation.y = time * (data.speed * 5) * timeSpeed;
                
                // Special handling for Pluto-Charon system
                if (planetKey === 'pluto') {
                    const charonOrbit = planetGroup.getObjectByName('CharonOrbit');
                    if (charonOrbit) {
                        charonOrbit.rotation.y = time * data.speed * 10 * timeSpeed;
                    }
                }
            }
        });
    }

    // Update comets
    updateComets(time, timeSpeed) {
        this.comets.forEach(comet => {
            // Update orbital position
            comet.angle += comet.speed * timeSpeed;
            
            const x = Math.cos(comet.angle) * comet.distance;
            const z = Math.sin(comet.angle) * comet.distance;
            const y = Math.sin(comet.inclination + comet.angle * 0.1) * comet.distance * 0.3;
            
            comet.group.position.set(x, y, z);
            
            // Point tail away from sun
            const directionToSun = new THREE.Vector3().subVectors(
                new THREE.Vector3(0, 0, 0), 
                comet.group.position
            ).normalize();
            
            comet.tail.lookAt(comet.group.position.clone().add(directionToSun));
        });
    }

    // Get all enhanced objects for raycasting
    getAllObjects() {
        const objects = [];
        objects.push(...this.asteroids);
        objects.push(...Object.values(this.dwarfPlanets));
        objects.push(...this.comets.map(c => c.nucleus));
        return objects;
    }

    // Create Kuiper Belt (distant objects)
    createKuiperBelt() {
        const kuiperCount = 200;
        const innerRadius = 30;
        const outerRadius = 50;
        
        for (let i = 0; i < kuiperCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
            const height = (Math.random() - 0.5) * 5;
            
            const size = 0.03 + Math.random() * 0.05;
            const objectGeometry = new THREE.SphereGeometry(size, 6, 6);
            const objectMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.15, 0.2, 0.2 + Math.random() * 0.2) 
            });
            
            const kuiperObject = new THREE.Mesh(objectGeometry, objectMaterial);
            kuiperObject.position.x = Math.cos(angle) * distance;
            kuiperObject.position.z = Math.sin(angle) * distance;
            kuiperObject.position.y = height;
            
            kuiperObject.userData = {
                angle: angle,
                distance: distance,
                speed: 0.005 + Math.random() * 0.01,
                originalHeight: height
            };
            
            kuiperObject.name = `KuiperObject_${i}`;
            this.scene.add(kuiperObject);
        }
        
        console.log(`Created ${kuiperCount} Kuiper Belt objects`);
    }

    // Update all enhanced celestial objects
    updateAll(time, timeSpeed) {
        this.updateAsteroids(time, timeSpeed);
        this.updateDwarfPlanets(time, timeSpeed);
        this.updateComets(time, timeSpeed);
    }
} 