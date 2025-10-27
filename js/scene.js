/**
 * Scene Manager
 * Manages Three.js scene, camera, renderer, and main game loop
 */

class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;

        this.track = null;
        this.vehicle = null;
        this.environment = null;
        this.effects = null;

        this.clock = new THREE.Clock();
        this.isRunning = false;

        this.init();
    }

    /**
     * Initialize Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera (driver's view)
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Create renderer
        const canvas = document.getElementById('gameCanvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: 'high-performance',
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    /**
     * Setup post-processing effects
     */
    setupPostProcessing() {
        // Note: EffectComposer is loaded from CDN
        if (typeof THREE.EffectComposer === 'undefined') {
            console.warn('EffectComposer not loaded, skipping post-processing');
            return;
        }

        this.composer = new THREE.EffectComposer(this.renderer);

        // Render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom pass for glow effect
        if (typeof THREE.UnrealBloomPass !== 'undefined') {
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.5,  // strength
                0.4,  // radius
                0.85  // threshold
            );
            this.composer.addPass(bloomPass);
        }
    }

    /**
     * Load and initialize all game objects
     */
    async load() {
        try {
            // Create environment
            this.environment = new Environment(this.scene);
            this.environment.createGround();

            // Create track
            this.track = new Track(this.scene);

            // Create vehicle
            this.vehicle = new Vehicle(this.scene);

            // Create effects
            this.effects = new Effects(this.scene, this.camera);

            // Setup post-processing
            this.setupPostProcessing();

            // Position camera in driver's seat
            this.setupDriverCamera();

            console.log('Scene loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading scene:', error);
            return false;
        }
    }

    /**
     * Setup camera for driver's view
     */
    setupDriverCamera() {
        // Camera will be updated in animate loop to follow vehicle
        // Initial position
        this.camera.position.set(0, 1.5, 0);
        this.camera.rotation.set(0, 0, 0);
    }

    /**
     * Update camera to follow vehicle from driver's perspective
     */
    updateCamera() {
        if (!this.vehicle) return;

        const vehicleGroup = this.vehicle.getGroup();

        // Driver's seat position inside the vehicle
        const cameraOffsetX = -0.5;  // Behind the steering wheel
        const cameraOffsetY = 1.4;   // Eye level
        const cameraOffsetZ = 0.3;   // Slightly to the left (driver's side)

        // Get vehicle rotation and position
        const angle = vehicleGroup.rotation.y;

        // Calculate camera position relative to vehicle orientation
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        // Rotate the offset by vehicle angle
        const rotatedX = cameraOffsetX * cosAngle - cameraOffsetZ * sinAngle;
        const rotatedZ = cameraOffsetX * sinAngle + cameraOffsetZ * cosAngle;

        // Set camera position
        this.camera.position.set(
            vehicleGroup.position.x + rotatedX,
            vehicleGroup.position.y + cameraOffsetY,
            vehicleGroup.position.z + rotatedZ
        );

        // Force camera up vector to prevent flipping (MUST be before lookAt)
        this.camera.up.set(0, 1, 0);

        // Look ahead in the direction the vehicle is facing
        const lookDistance = 30;
        const lookX = vehicleGroup.position.x + Math.cos(angle) * lookDistance;
        const lookZ = vehicleGroup.position.z + Math.sin(angle) * lookDistance;
        const lookY = vehicleGroup.position.y + cameraOffsetY;

        this.camera.lookAt(lookX, lookY, lookZ);
    }

    /**
     * Start the animation loop
     */
    start() {
        this.isRunning = true;
        this.clock.start();
        this.animate();
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Update vehicle position
        if (this.vehicle && this.track) {
            this.vehicle.updatePosition(this.track, deltaTime);
        }

        // Update camera to follow vehicle
        this.updateCamera();

        // Update effects
        if (this.effects && this.vehicle) {
            const speed = this.vehicle.getSpeed();
            this.effects.update(speed, deltaTime);
        }

        // Update environment
        if (this.environment) {
            this.environment.update(elapsedTime);
        }

        // Render scene
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Get current vehicle speed
     */
    getSpeed() {
        return this.vehicle ? this.vehicle.getSpeed() : 0;
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.stop();

        if (this.track) this.track.dispose();
        if (this.vehicle) this.vehicle.dispose();
        if (this.effects) this.effects.dispose();

        this.renderer.dispose();

        window.removeEventListener('resize', () => this.onWindowResize());
    }
}
