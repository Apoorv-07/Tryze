// Main Application Controller - Enhanced Version
class TryzeApp {
    constructor() {
        this.isInitialized = false;
        this.currentProduct = null;
        this.arScene = null;
        this.camera = null;
        this.loadingProgress = 0;
        this.isMarkerVisible = false;
        
        // Component instances
        this.menu = null;
        this.productOverlay = null;
        this.arController = null;
        this.threeSetup = null;
        
        // Initialize app
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Tryze AR App...');
            
            // Show loading screen
            this.showLoadingScreen();
            this.updateLoadingProgress(10);
            
            // Initialize core components
            await this.initializeAR();
            this.updateLoadingProgress(30);
            
            this.initializeUI();
            this.updateLoadingProgress(50);
            
            this.setupEventListeners();
            this.updateLoadingProgress(70);
            
            // Load initial data
            await this.loadProducts();
            this.updateLoadingProgress(90);
            
            // Initialize component instances
            this.initializeComponents();
            this.updateLoadingProgress(100);
            
            // Hide loading screen after a delay
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showInitialInstructions();
            }, 1000);
            
            this.isInitialized = true;
            console.log('✅ Tryze AR App initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showStatus('Failed to initialize AR experience. Please refresh and try again.', 5000);
        }
    }
    
    async initializeAR() {
        return new Promise((resolve) => {
            // Wait for A-Frame to be ready
            if (typeof AFRAME !== 'undefined') {
                this.arScene = document.querySelector('#arScene');
                
                if (this.arScene) {
                    // Setup AR scene event listeners
                    this.arScene.addEventListener('loaded', () => {
                        console.log('🎯 AR Scene loaded successfully');
                        resolve();
                    });
                    
                    // Marker events
                    const marker = document.querySelector('#markerA');
                    if (marker) {
                        marker.addEventListener('markerFound', () => {
                            console.log('🔍 AR Marker found');
                            this.onMarkerFound();
                        });
                        
                        marker.addEventListener('markerLost', () => {
                            console.log('👻 AR Marker lost');
                            this.onMarkerLost();
                        });
                    }
                } else {
                    console.warn('AR Scene element not found');
                    resolve();
                }
            } else {
                console.warn('A-Frame not available, using fallback');
                setTimeout(resolve, 500);
            }
        });
    }
    
    initializeUI() {
        console.log('🎨 Initializing UI components...');
        
        // The UI component classes will be initialized separately
        // This method sets up basic UI event listeners
        this.setupBasicUIListeners();
    }
    
    setupBasicUIListeners() {
        // Help button
        const helpBtn = document.getElementById('helpBtn');
        const helpModal = document.getElementById('helpModal');
        const closeHelp = document.getElementById('closeHelp');
        
        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                helpModal.classList.remove('hidden');
            });
        }
        
        if (closeHelp && helpModal) {
            closeHelp.addEventListener('click', () => {
                helpModal.classList.add('hidden');
            });
        }
        
        // Close modal when clicking outside
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.classList.add('hidden');
                }
            });
        }
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Control buttons
        this.setupControlButtons();
        
        // Window events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    setupControlButtons() {
        const resetBtn = document.getElementById('resetBtn');
        const captureBtn = document.getElementById('captureBtn');
        const switchCameraBtn = document.getElementById('switchCameraBtn');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetView());
        }
        
        if (captureBtn) {
            captureBtn.addEventListener('click', () => this.captureScreen());
        }
        
        if (switchCameraBtn) {
            switchCameraBtn.addEventListener('click', () => this.switchCamera());
        }
    }
    
    initializeComponents() {
        // Initialize component instances
        if (window.MenuComponent) {
            this.menu = new MenuComponent();
        }
        
        if (window.ProductOverlay) {
            this.productOverlay = new ProductOverlay();
        }
        
        if (window.ARController) {
            this.arController = new ARController();
        }
        
        if (window.ThreeSetup) {
            this.threeSetup = new ThreeSetup();
        }
    }
    
    async loadProducts() {
        console.log('📦 Loading product data...');
        
        // Sample product data - in a real app, this would come from an API
        const products = [
            {
                id: 1,
                name: 'Modern Office Chair',
                description: 'Ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions with premium materials and sleek design.',
                price: 299.99,
                category: 'Furniture',
                material: 'Mesh & Aluminum',
                dimensions: '65 x 65 x 120 cm',
                rating: 4.5,
                model: 'assets/chair.gltf',
                thumbnail: 'https://via.placeholder.com/150x150/667eea/white?text=Chair'
            },
            {
                id: 2,
                name: 'Wooden Coffee Table',
                description: 'Handcrafted wooden coffee table with natural finish. Features storage compartments and sustainable materials.',
                price: 199.99,
                category: 'Furniture',
                material: 'Oak Wood',
                dimensions: '120 x 60 x 45 cm',
                rating: 4.2,
                model: 'assets/table.gltf',
                thumbnail: 'https://via.placeholder.com/150x150/764ba2/white?text=Table'
            },
            {
                id: 3,
                name: 'LED Floor Lamp',
                description: 'Modern LED floor lamp with adjustable brightness and color temperature. Energy efficient with smart controls.',
                price: 149.99,
                category: 'Lighting',
                material: 'Metal & Fabric',
                dimensions: '30 x 30 x 160 cm',
                rating: 4.8,
                model: 'assets/lamp.gltf',
                thumbnail: 'https://via.placeholder.com/150x150/00d4ff/white?text=Lamp'
            },
            {
                id: 4,
                name: 'Decorative Vase',
                description: 'Ceramic decorative vase with unique geometric patterns. Perfect accent piece for modern interiors.',
                price: 79.99,
                category: 'Decoration',
                material: 'Ceramic',
                dimensions: '25 x 25 x 40 cm',
                rating: 4.3,
                model: 'assets/vase.gltf',
                thumbnail: 'https://via.placeholder.com/150x150/ff6b6b/white?text=Vase'
            }
        ];
        
        // Store products globally
        window.productData = products;
        
        // Load products into menu if available
        if (this.menu) {
            this.menu.loadProducts(products);
        }
        
        // Set default product
        if (products.length > 0) {
            this.selectProduct(products[0]);
        }
        
        return products;
    }
    
    selectProduct(product) {
        console.log('🎯 Selecting product:', product.name);
        
        this.currentProduct = product;
        
        // Update AR scene with new product
        this.updateARScene(product);
        
        // Update product overlay
        if (this.productOverlay) {
            this.productOverlay.updateProduct(product);
        }
        
        // Update menu selection
        if (this.menu) {
            this.menu.selectProduct(product.id);
        }
        
        // Show confirmation
        this.showStatus(`Loaded: ${product.name}`, 2000);
        
        // Track analytics
        this.trackEvent('product_selected', { productId: product.id, productName: product.name });
    }
    
    updateARScene(product) {
        const productEntity = document.querySelector('#product-entity');
        
        if (productEntity) {
            // Update model if available
            if (product.model) {
                // For now, we'll use the default shapes
                // In production, you'd load the actual GLTF model
                console.log('🔄 Updating AR model:', product.model);
            }
            
            // Update text label
            const textElement = productEntity.querySelector('a-text');
            if (textElement) {
                textElement.setAttribute('value', product.name);
            }
            
            // Update color based on product
            const boxElement = productEntity.querySelector('a-box');
            if (boxElement) {
                const colors = ['#00d4ff', '#667eea', '#764ba2', '#ff6b6b'];
                const colorIndex = product.id % colors.length;
                boxElement.setAttribute('color', colors[colorIndex]);
            }
        }
    }
    
    onMarkerFound() {
        this.isMarkerVisible = true;
        console.log('✨ Marker detected - AR is now active');
        
        // Update status
        this.showStatus('AR Active - Explore the product!', 3000);
        
        // Show product overlay if we have a current product
        if (this.productOverlay && this.currentProduct) {
            setTimeout(() => {
                this.productOverlay.show();
            }, 500);
        }
        
        // Add visual effects
        this.addMarkerFoundEffects();
        
        // Track event
        this.trackEvent('marker_found', { productId: this.currentProduct?.id });
    }
    
    onMarkerLost() {
        this.isMarkerVisible = false;
        console.log('👻 Marker lost - Point camera at marker');
        
        // Update status
        this.showStatus('Point your camera at the AR marker', 0);
        
        // Hide product overlay
        if (this.productOverlay) {
            this.productOverlay.hide();
        }
        
        // Track event
        this.trackEvent('marker_lost');
    }
    
    addMarkerFoundEffects() {
        // Add subtle visual feedback when marker is found
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.style.background = 'rgba(76, 175, 80, 0.9)';
            setTimeout(() => {
                statusMessage.style.background = 'rgba(0, 0, 0, 0.9)';
            }, 2000);
        }
    }
    
    resetView() {
        console.log('🔄 Resetting AR view');
        
        const productEntity = document.querySelector('#product-entity');
        if (productEntity) {
            // Reset transformations
            const boxElement = productEntity.querySelector('a-box');
            if (boxElement) {
                boxElement.setAttribute('rotation', '0 0 0');
                boxElement.setAttribute('position', '0 0.5 0');
                boxElement.setAttribute('scale', '0.5 0.5 0.5');
            }
        }
        
        this.showStatus('View reset to default position', 2000);
        this.trackEvent('view_reset');
    }
    
    captureScreen() {
        console.log('📸 Capturing screenshot');
        
        try {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                // Create download link
                const link = document.createElement('a');
                link.download = `tryze-ar-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                this.showStatus('Screenshot saved successfully! 📸', 2000);
                this.trackEvent('screenshot_captured');
            } else {
                this.showStatus('Unable to capture screenshot', 2000);
            }
        } catch (error) {
            console.error('Screenshot capture failed:', error);
            this.showStatus('Screenshot failed. Please try again.', 2000);
        }
    }
    
    switchCamera() {
        // Camera switching is limited in web browsers
        this.showStatus('Camera switching not available in web AR', 3000);
        this.trackEvent('camera_switch_attempted');
    }
    
    handleResize() {
        console.log('📱 Handling window resize');
        
        // Notify Three.js setup if available
        if (this.threeSetup && typeof this.threeSetup.handleResize === 'function') {
            this.threeSetup.handleResize();
        }
        
        // Update AR scene if needed
        if (this.arScene) {
            // A-Frame handles most resize automatically
        }
    }
    
    handleOrientationChange() {
        console.log('🔄 Handling orientation change');
        
        // Delay to allow orientation to settle
        setTimeout(() => {
            this.handleResize();
        }, 200);
    }
    
    handleKeyboard(event) {
        if (!this.isInitialized) return;
        
        switch (event.key) {
            case 'Escape':
                // Close any open overlays
                if (this.productOverlay) {
                    this.productOverlay.hide();
                }
                const helpModal = document.getElementById('helpModal');
                if (helpModal && !helpModal.classList.contains('hidden')) {
                    helpModal.classList.add('hidden');
                }
                break;
                
            case 'r':
            case 'R':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.resetView();
                }
                break;
                
            case 's':
            case 'S':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.captureScreen();
                }
                break;
                
            case 'h':
            case 'H':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    const helpModal = document.getElementById('helpModal');
                    if (helpModal) {
                        helpModal.classList.toggle('hidden');
                    }
                }
                break;
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('📱 App hidden - pausing operations');
            // Pause any animations or operations
        } else {
            console.log('📱 App visible - resuming operations');
            // Resume operations
        }
    }
    
    updateLoadingProgress(percent) {
        this.loadingProgress = Math.max(this.loadingProgress, percent);
        const progressBar = document.getElementById('progressBar');
        
        if (progressBar) {
            progressBar.style.width = `${this.loadingProgress}%`;
        }
        
        console.log(`Loading progress: ${this.loadingProgress}%`);
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
    
    showInitialInstructions() {
        const instructions = [
            'Welcome to Tryze AR! 👋',
            'Print the Hiro marker to get started',
            'Point your camera at the marker to see products in AR'
        ];
        
        instructions.forEach((instruction, index) => {
            setTimeout(() => {
                this.showStatus(instruction, 3000);
            }, index * 3500);
        });
    }
    
    showStatus(message, duration = 3000) {
        const statusMessage = document.getElementById('statusMessage');
        const statusText = document.getElementById('statusText');
        
        if (statusMessage && statusText) {
            statusText.textContent = message;
            statusMessage.classList.remove('hidden');
            
            // Auto hide after duration (if duration > 0)
            if (duration > 0) {
                setTimeout(() => {
                    statusMessage.classList.add('hidden');
                }, duration);
            }
        }
        
        console.log(`📢 Status: ${message}`);
    }
    
    trackEvent(eventName, data = {}) {
        const eventData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...data
        };
        
        console.log(`📊 Analytics Event: ${eventName}`, eventData);
        
        // In production, send to analytics service
        // Example: analytics.track(eventName, eventData);
    }
    
    // Public API methods for external access
    getCurrentProduct() {
        return this.currentProduct;
    }
    
    isMarkerCurrentlyVisible() {
        return this.isMarkerVisible;
    }
    
    getAppStatus() {
        return {
            initialized: this.isInitialized,
            markerVisible: this.isMarkerVisible,
            currentProduct: this.currentProduct?.name || 'None',
            loadingProgress: this.loadingProgress
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 DOM loaded - Starting Tryze AR App');
    window.tryzeApp = new TryzeApp();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TryzeApp;
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('🔥 Global error caught:', event.error);
    
    if (window.tryzeApp) {
        window.tryzeApp.showStatus('An error occurred. Please refresh the page.', 5000);
    }
});

// Service worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('📱 ServiceWorker registered: ', registration);
            })
            .catch((error) => {
                console.log('📱 ServiceWorker registration failed: ', error);
            });
    });
}
