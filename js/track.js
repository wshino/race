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

        // Initialize texture generator
        this.textureGenerator = new BuildingTextureGenerator();
        this.buildingTextures = this.textureGenerator.generateAll();

        this.createPath();
        this.createRoad();
        this.createEnvironment();
    }

    /**
     * Create an oval race track path
     * Simple oval circuit for stable driving experience
     */
    createPath() {
        // Create an oval track using an ellipse
        const points = [];
        const numPoints = 100;
        const radiusX = 80; // Width of oval
        const radiusZ = 50; // Height of oval
        const trackHeight = 0; // Ground level track

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const x = Math.cos(angle) * radiusX;
            const z = Math.sin(angle) * radiusZ;
            points.push(new THREE.Vector3(x, trackHeight, z));
        }

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
     * Create lane markings on the road (optimized - merged geometry)
     */
    createLaneMarkings(points) {
        const dashLength = 6;
        const gapLength = 4;
        const totalLength = dashLength + gapLength;

        // Check if BufferGeometryUtils is available
        const canMerge = typeof THREE !== 'undefined' &&
                         THREE.BufferGeometryUtils &&
                         typeof THREE.BufferGeometryUtils.mergeGeometries === 'function';

        if (canMerge) {
            // Optimized path: Collect all geometries to merge
            const geometries = [];

            for (let i = 0; i < points.length; i += 2) {
                if ((i % Math.floor(totalLength)) < dashLength) {
                    const point = points[i];
                    const geometry = new THREE.BoxGeometry(0.3, 0.05, 2);

                    // Create a temporary mesh to apply transformations
                    const tempMesh = new THREE.Mesh(geometry);
                    tempMesh.position.copy(point);
                    tempMesh.position.y += 0.05;

                    // Rotation to align with road
                    if (i < points.length - 1) {
                        const nextPoint = points[i + 1];
                        const direction = new THREE.Vector3().subVectors(nextPoint, point);
                        tempMesh.lookAt(tempMesh.position.clone().add(direction));
                    }

                    // Apply transformations to geometry
                    tempMesh.updateMatrix();
                    geometry.applyMatrix4(tempMesh.matrix);

                    geometries.push(geometry);
                }
            }

            // Merge all geometries into one
            if (geometries.length > 0) {
                try {
                    const mergedGeometry = THREE.BufferGeometryUtils.mergeGeometries(geometries);
                    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const laneMarkings = new THREE.Mesh(mergedGeometry, material);
                    this.scene.add(laneMarkings);
                } catch (error) {
                    console.warn('Failed to merge lane marking geometries:', error);
                    // Fall back to individual meshes
                    this.createLaneMarkingsIndividual(points);
                }
            }
        } else {
            // Fallback: Create individual lane marking meshes
            console.warn('BufferGeometryUtils not available, using individual meshes for lane markings');
            this.createLaneMarkingsIndividual(points);
        }
    }

    /**
     * Create lane markings as individual meshes (fallback method)
     */
    createLaneMarkingsIndividual(points) {
        const dashLength = 6;
        const gapLength = 4;
        const totalLength = dashLength + gapLength;
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        for (let i = 0; i < points.length; i += 2) {
            if ((i % Math.floor(totalLength)) < dashLength) {
                const point = points[i];
                const geometry = new THREE.BoxGeometry(0.3, 0.05, 2);
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
     * Create Tokyo cityscape buildings around oval track
     */
    createBuildings() {
        const numBuildings = 80;
        const minDistance = 80;
        const maxDistance = 200;
        const textureTypes = ['glass', 'concrete', 'brick', 'apartment'];

        for (let i = 0; i < numBuildings; i++) {
            const angle = (i / numBuildings) * Math.PI * 2;
            const distance = minDistance + Math.random() * (maxDistance - minDistance);

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            const width = 10 + Math.random() * 20;
            const height = 20 + Math.random() * 80;
            const depth = 10 + Math.random() * 20;

            const geometry = new THREE.BoxGeometry(width, height, depth);

            // Choose a random texture type for variety
            const textureType = textureTypes[Math.floor(Math.random() * textureTypes.length)];
            const texture = this.buildingTextures[textureType];

            // Set texture repeat based on building size
            const textureClone = texture.clone();
            textureClone.needsUpdate = true;
            textureClone.wrapS = THREE.RepeatWrapping;
            textureClone.wrapT = THREE.RepeatWrapping;
            textureClone.repeat.set(Math.max(1, width / 20), Math.max(1, height / 30));

            const material = new THREE.MeshStandardMaterial({
                map: textureClone,
                roughness: 0.7,
                metalness: 0.3,
                emissive: new THREE.Color().setHSL(0.1, 0.5, 0.05),
                emissiveIntensity: 0.2,
            });

            const building = new THREE.Mesh(geometry, material);
            building.position.set(x, height / 2, z);
            // Shadows disabled for performance optimization
            building.castShadow = false;
            building.receiveShadow = false;

            this.buildingMeshes.push(building);
            this.scene.add(building);

            // Window glow removed for performance - using emissive maps only
        }
    }

    /**
     * Window glow function removed for performance optimization
     * Buildings now use only emissive materials for lit windows
     */

    /**
     * Create tunnel sections - removed for oval track
     */
    createTunnels() {
        // No tunnels on oval track for better visibility
    }

    /**
     * Create street lights along the highway (optimized)
     */
    createStreetLights() {
        const points = this.path.getPoints(100);

        points.forEach((point, index) => {
            // Reduced from every 5th to every 10th for better performance
            if (index % 10 === 0) {
                // Light pole
                const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8);
                const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
                const pole = new THREE.Mesh(poleGeometry, poleMaterial);

                pole.position.copy(point);
                pole.position.x += 8;
                pole.position.y += 4;

                this.scene.add(pole);

                // Light source - reduced intensity and range for performance
                const light = new THREE.PointLight(0xffaa00, 0.8, 30);
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
