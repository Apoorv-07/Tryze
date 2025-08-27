// Advanced AR Controller with Interactive Features
class ARController {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentModel = null;
        this.isMarkerVisible = false;
        this.animationMixer = null;
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }
    
    init() {
        console.log('Initializing Advanced AR Controller...');
        this.setupARScene();
        this.setupInteractions();
        this.setupAnimations();
    }
    
    setupARScene() {
        // Enhanced A-Frame scene setup
        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.setAttribute('arjs', {
                sourceType: 'webcam',
                debugUIEnabled: false,
                detectionMode: 'mono_and_matrix',
                matrixCodeType: '3x3',
                trackingMethod: 'best',
                smooth: true,
                smoothCount: 10,
                smoothTolerance: 0.01,
                smoothThreshold: 5
            });
            
            scene.setAttribute('renderer', {
                precision: 'high',
                antialias: true,
                alpha: true,
                logarithmicDepthBuffer: true,
                colorManagement: true,
                sortObjects: true
            });
            
            this.setupLighting();
            this.setupMarkerTracking();
        }
    }
    
    setupLighting() {
        const scene = document.querySelector('a-scene');
        
        // Add dynamic lighting
        const lightingEntity = document.createElement('a-entity');
        lightingEntity.innerHTML = `
            <a-light type="ambient" color="#404040" intensity="0.4"></a-light>
            <a-light type="directional" position="2 4 2" color="#ffffff" intensity="0.8" 
                     shadow="cast: true; mapSize: 2048 2048;"></a-light>
            <a-light type="point" position="-2 2 2" color="#00d4ff" intensity="0.3"></a-light>
        `;
        scene.appendChild(lightingEntity);
    }
    
    setupMarkerTracking() {
        const marker = document.querySelector('#markerA');
        
        if (marker) {
            // Enhanced marker events
            marker.addEventListener('markerFound', () => {
                this.onMarkerFound();
                this.startModelAnimations();
            });
            
            marker.addEventListener('markerLost', () => {
                this.onMarkerLost();
                this.stopModelAnimations();
            });
            
            // Add smooth tracking
            marker.setAttribute('smooth', 'true');
            marker.setAttribute('smoothCount', '10');
            marker.setAttribute('smoothTolerance', '0.01');
        }
    }
    
    setupInteractions() {
        // Touch and gesture controls
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
            canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            canvas.addEventListener('click', (e) => this.handleClick(e));
        }
    }
    
    setupAnimations() {
        // Setup model animations
        this.animate();
    }
    
    loadModel(modelUrl, options = {}) {
        const productEntity = document.querySelector('#product-entity');
        if (productEntity) {
            // Enhanced model loading with animations
            productEntity.setAttribute('gltf-model', `url(${modelUrl})`);
            productEntity.setAttribute('animation-mixer', 'clip: *; loop: repeat;');
            productEntity.setAttribute('shadow', 'cast: true; receive: true;');
            
            // Apply options
            if (options.scale) {
                productEntity.setAttribute('scale', options.scale);
            }
            if (options.position) {
                productEntity.setAttribute('position', options.position);
            }
            if (options.rotation) {
                productEntity.setAttribute('rotation', options.rotation);
            }
            
            // Add interaction component
            productEntity.setAttribute('cursor-listener', '');
        }
    }
    
    onMarkerFound() {
        this.isMarkerVisible = true;
        
        // Trigger UI animations
        this.triggerMarkerFoundEffects();
        
        // Analytics
        this.trackEvent('marker_found');
        
        if (window.tryzeApp) {
            window.tryzeApp.onMarkerFound();
        }
    }
    
    onMarkerLost() {
        this.isMarkerVisible = false;
        
        // Trigger UI animations
        this.triggerMarkerLostEffects();
        
        if (window.tryzeApp) {
            window.tryzeApp.onMarkerLost();
        }
    }
    
    triggerMarkerFoundEffects() {
        // Smooth fade-in effect for UI
        const overlay = document.querySelector('#productOverlay');
        if (overlay) {
            overlay.style.animation = 'slideUpFadeIn 0.5s ease-out';
        }
        
        // Particle effect (optional)
        this.createParticleEffect();
    }
    
    triggerMarkerLostEffects() {
        // Smooth fade-out effect
        const overlay = document.querySelector('#productOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-in';
        }
    }
    
    createParticleEffect() {
        // Add subtle particle effect when marker is found
        const marker = document.querySelector('#markerA');
        if (marker) {
            const particles = document.createElement('a-entity');
            particles.setAttribute('particle-system', {
                preset: 'dust',
                particleCount: 50,
                color: '#00d4ff, #667eea',
                size: 0.5,
                maxAge: 2
            });
            marker.appendChild(particles);
            
            // Remove after animation
            setTimeout(() => {
                marker.removeChild(particles);
            }, 3000);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.animationMixer) {
            this.animationMixer.update(this.clock.getDelta());
        }
    }
    
    handleTouch(event) {
        if (this.isMarkerVisible) {
            // Implement rotation gesture
            this.startRotation(event);
        }
    }
    
    handleTouchMove(event) {
        if (this.isMarkerVisible) {
            this.updateRotation(event);
        }
    }
    
    handleClick(event) {
        // Show product details on click
        if (this.isMarkerVisible && window.tryzeApp && window.tryzeApp.productOverlay) {
            window.tryzeApp.productOverlay.show();
        }
    }
    
    trackEvent(eventName, data = {}) {
        // Analytics tracking
        console.log(`AR Event: ${eventName}`, data);
        // Integrate with analytics service here
    }
}

// Initialize AR Controller
window.ARController = ARController;
