/**
 * Main Application
 * Handles UI interactions and game state management
 */

class TokyoDriveApp {
    constructor() {
        this.sceneManager = null;
        this.isPlaying = false;

        // DOM elements
        this.startScreen = document.getElementById('startScreen');
        this.gameContainer = document.getElementById('gameContainer');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.startButton = document.getElementById('startButton');
        this.stopButton = document.getElementById('stopButton');
        this.speedValue = document.getElementById('speedValue');

        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        console.log('Tokyo Drive initializing...');

        // Setup event listeners
        this.startButton.addEventListener('click', () => this.onStartClick());
        this.stopButton.addEventListener('click', () => this.onStopClick());

        // ESC key to stop
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPlaying) {
                this.onStopClick();
            }
        });

        // Prevent context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Handle start button click
     */
    async onStartClick() {
        console.log('Starting Tokyo Drive...');

        // Show loading screen
        this.startScreen.classList.add('hidden');
        this.loadingScreen.classList.remove('hidden');

        try {
            // Create scene manager
            if (!this.sceneManager) {
                this.sceneManager = new SceneManager();
            }

            // Load scene
            const loaded = await this.sceneManager.load();

            if (!loaded) {
                throw new Error('Failed to load scene');
            }

            // Small delay for loading effect
            await this.delay(1000);

            // Hide loading, show game
            this.loadingScreen.classList.add('hidden');
            this.gameContainer.classList.remove('hidden');

            // Start game loop
            this.sceneManager.start();
            this.isPlaying = true;

            // Start UI update loop
            this.updateUI();

            console.log('Tokyo Drive started successfully');
        } catch (error) {
            console.error('Error starting game:', error);
            alert('Failed to start the game. Please refresh and try again.');

            // Return to start screen
            this.loadingScreen.classList.add('hidden');
            this.startScreen.classList.remove('hidden');
        }
    }

    /**
     * Handle stop button click
     */
    onStopClick() {
        console.log('Stopping Tokyo Drive...');

        if (this.sceneManager) {
            this.sceneManager.stop();
        }

        this.isPlaying = false;

        // Return to start screen
        this.gameContainer.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
    }

    /**
     * Update UI elements (speed, etc.)
     */
    updateUI() {
        if (!this.isPlaying) return;

        // Update speed display
        if (this.sceneManager) {
            const speed = Math.round(this.sceneManager.getSpeed());
            this.speedValue.textContent = speed;

            // Pulse effect on speedometer at high speeds
            if (speed > 100) {
                this.speedValue.style.textShadow = '0 0 30px rgba(0, 212, 255, 1)';
            } else {
                this.speedValue.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.8)';
            }
        }

        // Continue updating
        requestAnimationFrame(() => this.updateUI());
    }

    /**
     * Utility: delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clean up on page unload
     */
    cleanup() {
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
    }
}

// Initialize app when page loads
let app;

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Tokyo Drive app...');
    app = new TokyoDriveApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});

// Handle visibility change (pause when tab not visible)
document.addEventListener('visibilitychange', () => {
    if (app && app.isPlaying) {
        if (document.hidden) {
            // Pause
            if (app.sceneManager) {
                app.sceneManager.stop();
            }
        } else {
            // Resume
            if (app.sceneManager) {
                app.sceneManager.start();
            }
        }
    }
});
