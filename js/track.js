/**
 * Track System - Shuto Expressway C1 Loop
 * Manages the highway path and road generation
 */

class Track {
    constructor(scene) {
        this.scene = scene;
        this.path = null;
        this.roadMesh = null;
        this.tunnelMeshes = [];
        this.buildingMeshes = [];
        this.streetLights = [];
        this.guardrails = [];

        this.createPath();
        this.createRoad();
        this.createEnvironment();
    }

    /**
     * Create the Shuto C1 loop path using CatmullRomCurve3
     * Simplified version of the actual C1 route
     */
    createPath() {
        // Define control points for the C1 loop (simplified)
        // The path represents a loop around central Tokyo
        const points = [
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(50, 2, -20),
            new THREE.Vector3(100, 3, -30),
            new THREE.Vector3(150, 2, -25),
            new THREE.Vector3(200, 4, -10),
            new THREE.Vector3(250, 3, 10),
            new THREE.Vector3(300, 2, 30),
            new THREE.Vector3(320, 5, 60),  // Elevated section
            new THREE.Vector3(330, 6, 90),
            new THREE.Vector3(320, 4, 120),
            new THREE.Vector3(290, 3, 140),
            new THREE.Vector3(250, 2, 150),
            new THREE.Vector3(200, 2, 155),
            new THREE.Vector3(150, 3, 150),
            new THREE.Vector3(100, 2, 140),
            new THREE.Vector3(60, 4, 120),
            new THREE.Vector3(30, 5, 90),
            new THREE.Vector3(10, 3, 60),
            new THREE.Vector3(-5, 2, 30),
            new THREE.Vector3(-10, 2, 0),
        ];

        // Create smooth curve
        this.path = new THREE.CatmullRomCurve3(points, true); // true = closed loop

        // Visualize path for debugging (optional)
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(
            this.path.getPoints(500)
        );
        const pathMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            visible: false // Set to true for debugging
        });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        this.scene.add(pathLine);
    }

    /**
     * Create the road mesh along the path
     */
    createRoad() {
        const roadWidth = 12;
        const segments = 500;
        const points = this.path.getPoints(segments);

        // Create road geometry using custom approach
        const vertices = [];
        const uvs = [];
        const indices = [];

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const nextPoint = points[(i + 1) % points.length];

            // Calculate perpendicular direction for road width
            const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize();
            const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize();

            // Create road vertices (left and right edges)
            const leftPoint = new THREE.Vector3().addVectors(
                point,
                perpendicular.clone().multiplyScalar(roadWidth / 2)
            );
            const rightPoint = new THREE.Vector3().addVectors(
                point,
                perpendicular.clone().multiplyScalar(-roadWidth / 2)
            );

            vertices.push(leftPoint.x, leftPoint.y, leftPoint.z);
            vertices.push(rightPoint.x, rightPoint.y, rightPoint.z);

            // UVs for texture mapping
            const v = i / points.length;
            uvs.push(0, v);
            uvs.push(1, v);
        }

        // Create indices for triangles
        for (let i = 0; i < points.length - 1; i++) {
            const a = i * 2;
            const b = i * 2 + 1;
            const c = (i + 1) * 2;
            const d = (i + 1) * 2 + 1;

            indices.push(a, b, c);
            indices.push(b, d, c);
        }

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Road material with lane markings
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8,
            metalness: 0.2,
        });

        this.roadMesh = new THREE.Mesh(geometry, roadMaterial);
        this.roadMesh.receiveShadow = true;
        this.scene.add(this.roadMesh);

        // Add lane markings
        this.createLaneMarkings(points);

        // Add guardrails
        this.createGuardrails(points, roadWidth);
    }

    /**
     * Create lane markings on the road
     */
    createLaneMarkings(points) {
        const dashLength = 6;
        const gapLength = 4;
        const totalLength = dashLength + gapLength;

        for (let i = 0; i < points.length; i += 2) {
            if ((i % Math.floor(totalLength)) < dashLength) {
                const point = points[i];
                const geometry = new THREE.BoxGeometry(0.3, 0.05, 2);
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const marking = new THREE.Mesh(geometry, material);

                marking.position.copy(point);
                marking.position.y += 0.05;

                // Rotation to align with road
                if (i < points.length - 1) {
                    const nextPoint = points[i + 1];
                    const direction = new THREE.Vector3().subVectors(nextPoint, point);
                    marking.lookAt(marking.position.clone().add(direction));
                }

                this.scene.add(marking);
            }
        }
    }

    /**
     * Create guardrails along the road
     */
    createGuardrails(points, roadWidth) {
        const railHeight = 1;
        const offset = roadWidth / 2 + 0.5;

        for (let side = -1; side <= 1; side += 2) {
            for (let i = 0; i < points.length; i += 5) {
                const point = points[i];
                const nextPoint = points[(i + 1) % points.length];

                const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize();
                const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize();

                const railPos = new THREE.Vector3().addVectors(
                    point,
                    perpendicular.clone().multiplyScalar(offset * side)
                );

                const geometry = new THREE.BoxGeometry(0.2, railHeight, 3);
                const material = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    metalness: 0.8,
                    roughness: 0.3
                });
                const rail = new THREE.Mesh(geometry, material);

                rail.position.copy(railPos);
                rail.position.y += railHeight / 2;
                rail.lookAt(rail.position.clone().add(direction));

                this.guardrails.push(rail);
                this.scene.add(rail);
            }
        }
    }

    /**
     * Create environment elements (buildings, tunnels, etc.)
     */
    createEnvironment() {
        this.createBuildings();
        this.createTunnels();
        this.createStreetLights();
    }

    /**
     * Create Tokyo cityscape buildings
     */
    createBuildings() {
        const numBuildings = 100;
        const minDistance = 30;
        const maxDistance = 150;

        for (let i = 0; i < numBuildings; i++) {
            const angle = (i / numBuildings) * Math.PI * 2;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            const width = 10 + Math.random() * 20;
            const height = 20 + Math.random() * 80;
            const depth = 10 + Math.random() * 20;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.6, 0.1, 0.1 + Math.random() * 0.2),
                emissive: new THREE.Color().setHSL(0.1, 0.5, 0.05),
                emissiveIntensity: 0.3,
            });

            const building = new THREE.Mesh(geometry, material);
            building.position.set(x, height / 2, z);
            building.castShadow = true;
            building.receiveShadow = true;

            this.buildingMeshes.push(building);
            this.scene.add(building);

            // Add windows
            this.addWindows(building, width, height, depth);
        }
    }

    /**
     * Add lit windows to buildings
     */
    addWindows(building, width, height, depth) {
        const windowRows = Math.floor(height / 3);
        const windowCols = Math.floor(Math.max(width, depth) / 3);

        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (Math.random() > 0.3) { // 70% chance of lit window
                    const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffffaa,
                        transparent: true,
                        opacity: 0.8,
                    });
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);

                    // Position on building face
                    window.position.set(
                        (col - windowCols / 2) * 2.5,
                        (row - windowRows / 2) * 3 + height / 2,
                        width / 2 + 0.1
                    );

                    building.add(window);
                }
            }
        }
    }

    /**
     * Create tunnel sections
     */
    createTunnels() {
        const tunnelPositions = [
            { start: 0.2, length: 0.1 },
            { start: 0.6, length: 0.15 }
        ];

        tunnelPositions.forEach(({ start, length }) => {
            const startPoint = this.path.getPointAt(start);
            const endPoint = this.path.getPointAt(start + length);

            const tunnelLength = startPoint.distanceTo(endPoint);
            const geometry = new THREE.BoxGeometry(20, 10, tunnelLength);
            const material = new THREE.MeshStandardMaterial({
                color: 0x333333,
                side: THREE.DoubleSide,
            });

            const tunnel = new THREE.Mesh(geometry, material);
            tunnel.position.lerpVectors(startPoint, endPoint, 0.5);
            tunnel.position.y += 5;

            // Orient tunnel
            const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
            tunnel.lookAt(tunnel.position.clone().add(direction));

            this.tunnelMeshes.push(tunnel);
            this.scene.add(tunnel);
        });
    }

    /**
     * Create street lights along the highway
     */
    createStreetLights() {
        const points = this.path.getPoints(100);

        points.forEach((point, index) => {
            if (index % 5 === 0) {
                // Light pole
                const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8);
                const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
                const pole = new THREE.Mesh(poleGeometry, poleMaterial);

                pole.position.copy(point);
                pole.position.x += 8;
                pole.position.y += 4;

                this.scene.add(pole);

                // Light source
                const light = new THREE.PointLight(0xffaa00, 1, 50);
                light.position.copy(pole.position);
                light.position.y += 4;
                this.streetLights.push(light);
                this.scene.add(light);

                // Light bulb mesh
                const bulbGeometry = new THREE.SphereGeometry(0.5);
                const bulbMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    emissive: 0xffff00,
                    emissiveIntensity: 2
                });
                const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
                bulb.position.copy(light.position);
                this.scene.add(bulb);
            }
        });
    }

    /**
     * Get position on track at normalized distance (0-1)
     */
    getPositionAt(t) {
        return this.path.getPointAt(t % 1);
    }

    /**
     * Get tangent (direction) at normalized distance (0-1)
     */
    getTangentAt(t) {
        return this.path.getTangentAt(t % 1);
    }

    /**
     * Clean up resources
     */
    dispose() {
        // Dispose geometries and materials
        if (this.roadMesh) {
            this.roadMesh.geometry.dispose();
            this.roadMesh.material.dispose();
        }

        this.tunnelMeshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });

        this.buildingMeshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });

        this.guardrails.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
    }
}
