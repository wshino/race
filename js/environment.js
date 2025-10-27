/**
 * Environment System
 * Manages skybox, fog, lighting, and atmospheric effects
 */

class Environment {
    constructor(scene) {
        this.scene = scene;
        this.isNightMode = true;

        this.setupSkybox();
        this.setupLighting();
        this.setupFog();
    }

    /**
     * Create skybox for Tokyo night/day
     */
    setupSkybox() {
        if (this.isNightMode) {
            // Night sky with stars
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 2,
                transparent: true,
            });

            const starsVertices = [];
            for (let i = 0; i < 10000; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                starsVertices.push(x, y, z);
            }

            starsGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(starsVertices, 3)
            );

            const stars = new THREE.Points(starsGeometry, starsMaterial);
            this.scene.add(stars);

            // Dark blue night sky
            this.scene.background = new THREE.Color(0x000510);
        } else {
            // Day sky
            this.scene.background = new THREE.Color(0x87ceeb);
        }
    }

    /**
     * Setup scene lighting
     */
    setupLighting() {
        if (this.isNightMode) {
            // Ambient light (dim for night)
            const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
            this.scene.add(ambientLight);

            // Moon light (directional)
            const moonLight = new THREE.DirectionalLight(0x8899cc, 0.5);
            moonLight.position.set(50, 100, 50);
            moonLight.castShadow = true;
            moonLight.shadow.camera.left = -200;
            moonLight.shadow.camera.right = 200;
            moonLight.shadow.camera.top = 200;
            moonLight.shadow.camera.bottom = -200;
            moonLight.shadow.camera.near = 0.5;
            moonLight.shadow.camera.far = 500;
            moonLight.shadow.mapSize.width = 2048;
            moonLight.shadow.mapSize.height = 2048;
            this.scene.add(moonLight);

            // Hemisphere light for ambient variation
            const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.2);
            this.scene.add(hemiLight);

            // Add some orange glow from city lights
            const cityGlow = new THREE.PointLight(0xff6600, 0.5, 300);
            cityGlow.position.set(0, 50, 0);
            this.scene.add(cityGlow);
        } else {
            // Day lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);

            const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
            sunLight.position.set(100, 200, 100);
            sunLight.castShadow = true;
            this.scene.add(sunLight);
        }
    }

    /**
     * Setup atmospheric fog
     */
    setupFog() {
        if (this.isNightMode) {
            this.scene.fog = new THREE.Fog(0x000510, 50, 300);
        } else {
            this.scene.fog = new THREE.Fog(0x87ceeb, 100, 500);
        }
    }

    /**
     * Create ground plane
     */
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: this.isNightMode ? 0x0a0a0a : 0x228b22,
            roughness: 0.9,
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    /**
     * Update environment (for day/night cycle if needed)
     */
    update(time) {
        // Could add dynamic lighting changes here
    }

    /**
     * Toggle between day and night
     */
    toggleDayNight() {
        this.isNightMode = !this.isNightMode;
        // Would need to rebuild scene for full effect
    }
}
