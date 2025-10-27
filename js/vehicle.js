/**
 * Vehicle System - Tesla Model S
 * Creates a simplified Tesla Model S with interior for driver's view
 */

class Vehicle {
    constructor(scene) {
        this.scene = scene;
        this.vehicleGroup = new THREE.Group();
        this.speed = 0;
        this.maxSpeed = 120; // km/h
        this.acceleration = 0.5;

        // Position tracking
        this.trackProgress = 0; // 0 to 1 on the track
        this.currentSpeed = 0;

        this.createExterior();
        this.createInterior();
        this.createLights();

        this.scene.add(this.vehicleGroup);
    }

    /**
     * Create the exterior body of Tesla Model S
     */
    createExterior() {
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(4.5, 1.5, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        this.vehicleGroup.add(body);

        // Roof/Cabin
        const roofGeometry = new THREE.BoxGeometry(3, 1.2, 1.8);
        const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
        roof.position.set(0, 1.85, 0);
        this.vehicleGroup.add(roof);

        // Hood
        const hoodGeometry = new THREE.BoxGeometry(1.5, 0.3, 2);
        const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
        hood.position.set(2.5, 1, 0);
        this.vehicleGroup.add(hood);

        // Trunk
        const trunkGeometry = new THREE.BoxGeometry(1.2, 0.5, 2);
        const trunk = new THREE.Mesh(trunkGeometry, bodyMaterial);
        trunk.position.set(-2.3, 1.1, 0);
        this.vehicleGroup.add(trunk);

        // Wheels
        this.createWheels();

        // Windows (transparent)
        this.createWindows();
    }

    /**
     * Create wheels
     */
    createWheels() {
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.7,
            roughness: 0.3,
        });

        const wheelPositions = [
            { x: 1.5, z: 1.1 },   // Front left
            { x: 1.5, z: -1.1 },  // Front right
            { x: -1.5, z: 1.1 },  // Rear left
            { x: -1.5, z: -1.1 }, // Rear right
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, 0.4, pos.z);
            this.vehicleGroup.add(wheel);
        });
    }

    /**
     * Create windows
     */
    createWindows() {
        const windowMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
        });

        // Windshield
        const windshieldGeometry = new THREE.PlaneGeometry(1.8, 1);
        const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
        windshield.position.set(1.2, 1.8, 0);
        windshield.rotation.y = Math.PI / 2;
        windshield.rotation.z = -0.2;
        this.vehicleGroup.add(windshield);

        // Side windows
        const sideWindowGeometry = new THREE.PlaneGeometry(2, 0.8);

        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(0, 1.9, 1);
        leftWindow.rotation.y = Math.PI / 2;
        this.vehicleGroup.add(leftWindow);

        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(0, 1.9, -1);
        rightWindow.rotation.y = -Math.PI / 2;
        this.vehicleGroup.add(rightWindow);
    }

    /**
     * Create interior elements visible from driver's view
     */
    createInterior() {
        this.interiorGroup = new THREE.Group();

        // Dashboard
        const dashGeometry = new THREE.BoxGeometry(3, 0.5, 0.8);
        const dashMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.6,
        });
        const dashboard = new THREE.Mesh(dashGeometry, dashMaterial);
        dashboard.position.set(1.5, 0.9, 0);
        this.interiorGroup.add(dashboard);

        // Steering wheel
        this.steeringWheel = this.createSteeringWheel();
        this.steeringWheel.position.set(0.8, 1.1, -0.3);
        this.interiorGroup.add(this.steeringWheel);

        // Center console screen (Tesla's main display)
        const screenGeometry = new THREE.PlaneGeometry(1.2, 0.7);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a1a1a,
            emissive: 0x003366,
            emissiveIntensity: 0.5,
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(1.2, 1.2, 0);
        screen.rotation.y = Math.PI / 2;
        screen.rotation.z = -0.1;
        this.interiorGroup.add(screen);

        // Seats (simplified)
        this.createSeats();

        // Add interior to vehicle
        this.vehicleGroup.add(this.interiorGroup);
    }

    /**
     * Create steering wheel
     */
    createSteeringWheel() {
        const wheelGroup = new THREE.Group();

        // Wheel rim
        const rimGeometry = new THREE.TorusGeometry(0.35, 0.04, 8, 32);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.3,
            roughness: 0.7,
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.y = Math.PI / 2;
        wheelGroup.add(rim);

        // Center hub
        const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
        const hubMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        // Tesla logo placeholder (simplified)
        const logoGeometry = new THREE.CircleGeometry(0.06, 16);
        const logoMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.z = 0.03;
        wheelGroup.add(logo);

        return wheelGroup;
    }

    /**
     * Create seats
     */
    createSeats() {
        const seatGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.8,
        });

        // Driver seat
        const driverSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        driverSeat.position.set(-0.3, 0.5, -0.3);
        this.interiorGroup.add(driverSeat);

        // Passenger seat
        const passengerSeat = new THREE.Mesh(seatGeometry, seatMaterial);
        passengerSeat.position.set(-0.3, 0.5, 0.8);
        this.interiorGroup.add(passengerSeat);

        // Seat backs
        const backGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);

        const driverBack = new THREE.Mesh(backGeometry, seatMaterial);
        driverBack.position.set(-0.7, 0.9, -0.3);
        this.interiorGroup.add(driverBack);

        const passengerBack = new THREE.Mesh(backGeometry, seatMaterial);
        passengerBack.position.set(-0.7, 0.9, 0.8);
        this.interiorGroup.add(passengerBack);
    }

    /**
     * Create headlights and taillights
     */
    createLights() {
        // Headlights
        const headlightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        const headlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffee,
            emissive: 0xffffee,
            emissiveIntensity: 1,
        });

        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(3, 1, 0.6);
        leftHeadlight.rotation.z = Math.PI / 2;
        this.vehicleGroup.add(leftHeadlight);

        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(3, 1, -0.6);
        rightHeadlight.rotation.z = Math.PI / 2;
        this.vehicleGroup.add(rightHeadlight);

        // Headlight beams (SpotLights)
        const leftBeam = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 8, 0.5);
        leftBeam.position.copy(leftHeadlight.position);
        leftBeam.target.position.set(50, 0, 0.6);
        this.vehicleGroup.add(leftBeam);
        this.vehicleGroup.add(leftBeam.target);

        const rightBeam = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 8, 0.5);
        rightBeam.position.copy(rightHeadlight.position);
        rightBeam.target.position.set(50, 0, -0.6);
        this.vehicleGroup.add(rightBeam);
        this.vehicleGroup.add(rightBeam.target);

        // Taillights
        const taillightMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5,
        });

        const leftTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
        leftTaillight.position.set(-3, 1, 0.6);
        leftTaillight.rotation.z = Math.PI / 2;
        this.vehicleGroup.add(leftTaillight);

        const rightTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
        rightTaillight.position.set(-3, 1, -0.6);
        rightTaillight.rotation.z = Math.PI / 2;
        this.vehicleGroup.add(rightTaillight);
    }

    /**
     * Update vehicle position along track
     */
    updatePosition(track, deltaTime) {
        // Increase speed gradually
        if (this.currentSpeed < this.maxSpeed) {
            this.currentSpeed += this.acceleration;
        }

        // Convert speed to track progress (rough approximation)
        const speedFactor = this.currentSpeed / 3600; // km/h to units per second
        this.trackProgress += speedFactor * deltaTime * 2;

        // Keep progress between 0 and 1 (loop)
        if (this.trackProgress > 1) {
            this.trackProgress -= 1;
        }

        // Get position and orientation from track
        const position = track.getPositionAt(this.trackProgress);
        const tangent = track.getTangentAt(this.trackProgress);

        // Update vehicle position
        this.vehicleGroup.position.copy(position);

        // Update vehicle rotation to follow track
        // Calculate proper orientation using tangent
        // Add PI to flip the vehicle 180 degrees if it's backwards
        const angle = Math.atan2(tangent.z, tangent.x) + Math.PI;
        this.vehicleGroup.rotation.y = angle;

        // Animate steering wheel based on turn angle
        const nextTangent = track.getTangentAt(this.trackProgress + 0.01);
        const turnAngle = tangent.angleTo(nextTangent);
        const crossProduct = new THREE.Vector3().crossVectors(tangent, nextTangent);
        const turnDirection = crossProduct.y > 0 ? 1 : -1;

        this.steeringWheel.rotation.y = Math.PI / 2 + turnAngle * turnDirection * 3;
    }

    /**
     * Get current speed
     */
    getSpeed() {
        return this.currentSpeed;
    }

    /**
     * Get vehicle position
     */
    getPosition() {
        return this.vehicleGroup.position;
    }

    /**
     * Get vehicle for camera attachment
     */
    getGroup() {
        return this.vehicleGroup;
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.vehicleGroup.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}
