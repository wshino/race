/**
 * Procedural texture generator for building facades
 * Creates textures using Canvas API for use with Three.js
 */

class BuildingTextureGenerator {
    constructor() {
        this.textures = {};
    }

    /**
     * Generate a glass office building texture with windows
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {THREE.CanvasTexture}
     */
    generateGlassBuildingTexture(width = 512, height = 1024) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Base dark glass/metal color
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a2530');
        gradient.addColorStop(0.5, '#0f1820');
        gradient.addColorStop(1, '#1a2530');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add windows in a grid pattern
        const windowWidth = 40;
        const windowHeight = 50;
        const horizontalSpacing = 50;
        const verticalSpacing = 60;
        const margin = 30;

        for (let y = margin; y < height - windowHeight; y += verticalSpacing) {
            for (let x = margin; x < width - windowWidth; x += horizontalSpacing) {
                // Window frame (metal)
                ctx.fillStyle = '#2a3a45';
                ctx.fillRect(x, y, windowWidth, windowHeight);

                // Window glass with reflection
                const windowGradient = ctx.createLinearGradient(x, y, x, y + windowHeight);
                const isLit = Math.random() > 0.3; // 70% of windows are lit

                if (isLit) {
                    // Lit window - warm yellow/orange glow
                    windowGradient.addColorStop(0, 'rgba(255, 220, 150, 0.8)');
                    windowGradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.9)');
                    windowGradient.addColorStop(1, 'rgba(255, 180, 80, 0.7)');
                } else {
                    // Dark window with subtle reflection
                    windowGradient.addColorStop(0, 'rgba(100, 140, 180, 0.3)');
                    windowGradient.addColorStop(0.5, 'rgba(60, 80, 100, 0.4)');
                    windowGradient.addColorStop(1, 'rgba(40, 50, 60, 0.5)');
                }

                ctx.fillStyle = windowGradient;
                ctx.fillRect(x + 2, y + 2, windowWidth - 4, windowHeight - 4);

                // Add window frame details
                ctx.strokeStyle = '#1a2530';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, windowWidth, windowHeight);

                // Vertical window divider
                ctx.beginPath();
                ctx.moveTo(x + windowWidth / 2, y);
                ctx.lineTo(x + windowWidth / 2, y + windowHeight);
                ctx.stroke();
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Generate a concrete building texture with rectangular windows
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {THREE.CanvasTexture}
     */
    generateConcreteBuildingTexture(width = 512, height = 1024) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Concrete base color with texture
        ctx.fillStyle = '#3a3a40';
        ctx.fillRect(0, 0, width, height);

        // Add concrete texture noise
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2;
            const opacity = Math.random() * 0.3;
            ctx.fillStyle = `rgba(${60 + Math.random() * 20}, ${60 + Math.random() * 20}, ${65 + Math.random() * 20}, ${opacity})`;
            ctx.fillRect(x, y, size, size);
        }

        // Add horizontal lines (floor separators)
        ctx.strokeStyle = '#2a2a30';
        ctx.lineWidth = 3;
        for (let y = 80; y < height; y += 80) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Add windows
        const windowWidth = 45;
        const windowHeight = 55;
        const horizontalSpacing = 60;
        const verticalSpacing = 80;
        const margin = 35;

        for (let y = margin; y < height - windowHeight; y += verticalSpacing) {
            for (let x = margin; x < width - windowWidth; x += horizontalSpacing) {
                // Window recess shadow
                ctx.fillStyle = '#1a1a20';
                ctx.fillRect(x - 2, y - 2, windowWidth + 4, windowHeight + 4);

                // Window
                const isLit = Math.random() > 0.4; // 60% lit
                if (isLit) {
                    const windowGradient = ctx.createRadialGradient(
                        x + windowWidth / 2, y + windowHeight / 2, 0,
                        x + windowWidth / 2, y + windowHeight / 2, windowWidth
                    );
                    windowGradient.addColorStop(0, 'rgba(255, 230, 180, 0.9)');
                    windowGradient.addColorStop(1, 'rgba(255, 200, 120, 0.6)');
                    ctx.fillStyle = windowGradient;
                } else {
                    ctx.fillStyle = 'rgba(30, 40, 60, 0.8)';
                }
                ctx.fillRect(x, y, windowWidth, windowHeight);

                // Window frame
                ctx.strokeStyle = '#2a2a30';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, windowWidth, windowHeight);

                // Window panes (cross pattern)
                ctx.strokeStyle = '#1a1a20';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + windowWidth / 2, y);
                ctx.lineTo(x + windowWidth / 2, y + windowHeight);
                ctx.moveTo(x, y + windowHeight / 2);
                ctx.lineTo(x + windowWidth, y + windowHeight / 2);
                ctx.stroke();
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Generate a brick building texture with windows
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {THREE.CanvasTexture}
     */
    generateBrickBuildingTexture(width = 512, height = 1024) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Base brick color
        ctx.fillStyle = '#4a2820';
        ctx.fillRect(0, 0, width, height);

        // Draw brick pattern
        const brickWidth = 40;
        const brickHeight = 15;
        const mortarSize = 2;

        for (let y = 0; y < height; y += brickHeight + mortarSize) {
            const offset = (Math.floor(y / (brickHeight + mortarSize)) % 2) * (brickWidth / 2);
            for (let x = -brickWidth; x < width + brickWidth; x += brickWidth + mortarSize) {
                // Brick color variation
                const colorVar = Math.random() * 20 - 10;
                ctx.fillStyle = `rgb(${74 + colorVar}, ${40 + colorVar}, ${32 + colorVar})`;
                ctx.fillRect(x + offset, y, brickWidth, brickHeight);

                // Brick shading for depth
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(x + offset, y + brickHeight - 2, brickWidth, 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.fillRect(x + offset, y, brickWidth, 1);
            }
        }

        // Add windows with ornate frames
        const windowWidth = 50;
        const windowHeight = 70;
        const horizontalSpacing = 75;
        const verticalSpacing = 90;
        const margin = 40;

        for (let y = margin; y < height - windowHeight; y += verticalSpacing) {
            for (let x = margin; x < width - windowWidth; x += horizontalSpacing) {
                // Window frame (stone/concrete trim)
                ctx.fillStyle = '#6a6a65';
                ctx.fillRect(x - 5, y - 5, windowWidth + 10, windowHeight + 10);

                // Decorative frame top
                ctx.fillStyle = '#7a7a75';
                ctx.fillRect(x - 5, y - 8, windowWidth + 10, 3);

                // Window glass
                const isLit = Math.random() > 0.35; // 65% lit
                if (isLit) {
                    const windowGradient = ctx.createLinearGradient(x, y, x + windowWidth, y + windowHeight);
                    windowGradient.addColorStop(0, 'rgba(255, 235, 200, 0.85)');
                    windowGradient.addColorStop(0.5, 'rgba(255, 215, 150, 0.9)');
                    windowGradient.addColorStop(1, 'rgba(255, 195, 100, 0.8)');
                    ctx.fillStyle = windowGradient;
                } else {
                    ctx.fillStyle = 'rgba(20, 30, 50, 0.9)';
                }
                ctx.fillRect(x, y, windowWidth, windowHeight);

                // Window panes (4 panes)
                ctx.strokeStyle = '#4a4a45';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x + windowWidth / 2, y);
                ctx.lineTo(x + windowWidth / 2, y + windowHeight);
                ctx.moveTo(x, y + windowHeight / 2);
                ctx.lineTo(x + windowWidth, y + windowHeight / 2);
                ctx.stroke();

                // Window frame borders
                ctx.strokeStyle = '#5a5a55';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, windowWidth, windowHeight);
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Generate modern apartment building texture
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {THREE.CanvasTexture}
     */
    generateModernApartmentTexture(width = 512, height = 1024) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Base color - light gray/beige modern building
        ctx.fillStyle = '#d5d5d0';
        ctx.fillRect(0, 0, width, height);

        // Add balcony floors
        const floorHeight = 70;
        ctx.fillStyle = '#c0c0b8';
        ctx.strokeStyle = '#a0a098';
        ctx.lineWidth = 2;

        for (let y = floorHeight; y < height; y += floorHeight) {
            // Balcony ledge
            ctx.fillRect(0, y - 8, width, 8);
            ctx.strokeRect(0, y - 8, width, 8);
        }

        // Add windows and balcony doors
        const windowWidth = 55;
        const windowHeight = 55;
        const horizontalSpacing = 70;
        const verticalSpacing = 70;
        const margin = 25;

        for (let y = margin; y < height - windowHeight; y += verticalSpacing) {
            for (let x = margin; x < width - windowWidth; x += horizontalSpacing) {
                // Balcony railing (if on balcony level)
                if ((y + windowHeight / 2) % floorHeight > floorHeight - 20) {
                    // This is a balcony door
                    ctx.strokeStyle = '#808078';
                    ctx.lineWidth = 1;
                    for (let rail = 0; rail < 8; rail++) {
                        ctx.beginPath();
                        ctx.moveTo(x, y + windowHeight + rail * 3);
                        ctx.lineTo(x + windowWidth, y + windowHeight + rail * 3);
                        ctx.stroke();
                    }
                }

                // Window/door frame
                ctx.fillStyle = '#a0a098';
                ctx.fillRect(x - 3, y - 3, windowWidth + 6, windowHeight + 6);

                // Window glass
                const isLit = Math.random() > 0.45; // 55% lit
                if (isLit) {
                    const windowGradient = ctx.createLinearGradient(x, y, x + windowWidth, y);
                    windowGradient.addColorStop(0, 'rgba(255, 240, 200, 0.8)');
                    windowGradient.addColorStop(0.5, 'rgba(255, 225, 180, 0.85)');
                    windowGradient.addColorStop(1, 'rgba(255, 210, 160, 0.75)');
                    ctx.fillStyle = windowGradient;
                } else {
                    // Reflection of sky
                    ctx.fillStyle = 'rgba(100, 120, 150, 0.4)';
                }
                ctx.fillRect(x, y, windowWidth, windowHeight);

                // Window frame details
                ctx.strokeStyle = '#808078';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, windowWidth, windowHeight);

                // Window panes
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + windowWidth / 2, y);
                ctx.lineTo(x + windowWidth / 2, y + windowHeight);
                ctx.stroke();
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Generate all building textures
     * @returns {Object} Object containing all building textures
     */
    generateAll() {
        this.textures = {
            glass: this.generateGlassBuildingTexture(),
            concrete: this.generateConcreteBuildingTexture(),
            brick: this.generateBrickBuildingTexture(),
            apartment: this.generateModernApartmentTexture()
        };

        // Set texture properties
        Object.values(this.textures).forEach(texture => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.needsUpdate = true;
        });

        return this.textures;
    }

    /**
     * Get a random building texture
     * @returns {THREE.CanvasTexture}
     */
    getRandomTexture() {
        const textureKeys = Object.keys(this.textures);
        const randomKey = textureKeys[Math.floor(Math.random() * textureKeys.length)];
        return this.textures[randomKey];
    }
}
