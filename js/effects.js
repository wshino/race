/**
 * Effects System
 * Manages visual effects like motion blur, particles, camera shake
 */

class Effects {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.particles = [];
        this.particleSystem = null;

        this.createParticleSystem();
    }

    /**
     * Create particle system for speed effects (wind, dust, rain)
     * Optimized particle count for better performance
     */
    createParticleSystem() {
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Position particles in front of camera
            positions.push(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 100 - 50
            );

            velocities.push(Math.random() * 2 + 1);
        }

        particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
        });

        this.particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    /**
     * Update particle positions for motion effect
     */
    updateParticles(speed, deltaTime) {
        if (!this.particleSystem) return;

        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;

        const speedFactor = speed / 50; // Normalize speed

        for (let i = 0; i < positions.length; i += 3) {
            // Move particles backwards (relative to camera)
            positions[i + 2] += velocities[i / 3] * speedFactor * deltaTime * 100;

            // Reset particles that pass the camera
            if (positions[i + 2] > 10) {
                positions[i] = (Math.random() - 0.5) * 50;
                positions[i + 1] = (Math.random() - 0.5) * 30;
                positions[i + 2] = -100;
            }
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        // Opacity based on speed
        this.particleSystem.material.opacity = Math.min(0.8, speedFactor * 0.5);
    }

    /**
     * Add camera shake for immersion
     */
    addCameraShake(intensity = 0.05) {
        this.camera.position.x += (Math.random() - 0.5) * intensity;
        this.camera.position.y += (Math.random() - 0.5) * intensity;
    }

    /**
     * Create speed lines effect
     */
    createSpeedLines() {
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
        });

        const lineCount = 50;
        const positions = [];

        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            const radius = 20 + Math.random() * 30;

            const x = Math.cos(angle) * radius;
            const y = (Math.random() - 0.5) * 20;
            const z1 = -50 - Math.random() * 50;
            const z2 = z1 + 5;

            positions.push(x, y, z1);
            positions.push(x, y, z2);
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const speedLines = new THREE.LineSegments(lineGeometry, lineMaterial);

        return speedLines;
    }

    /**
     * Update effects based on speed
     */
    update(speed, deltaTime) {
        this.updateParticles(speed, deltaTime);

        // Add subtle camera shake based on speed
        if (speed > 60) {
            const shakeIntensity = (speed - 60) / 1000;
            this.addCameraShake(shakeIntensity);
        }
    }

    /**
     * Create glow effect for lights
     */
    createGlow(position, color, size = 1) {
        const glowGeometry = new THREE.SphereGeometry(size, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(position);
        this.scene.add(glow);

        return glow;
    }

    /**
     * Clean up resources
     */
    dispose() {
        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
    }
}
