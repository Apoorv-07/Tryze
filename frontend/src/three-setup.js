// Advanced Three.js Setup with Interactive Features
class ThreeSetup {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.loader = null;
        this.models = new Map();
        this.animations = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.setupLighting();
        this.setupControls();
        this.setupLoaders();
        this.setupPostProcessing();
        this.addEventListeners();
        this.animate();
    }
    
    createScene() {
        // Enhanced scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x000000, 0.1, 100);
        
        // Camera with better FOV
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );
        this.camera.position.set(0, 0, 0);
        
        // Enhanced renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            precision: 'highp',
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Accent lights
        const pointLight1 = new THREE.PointLight(0x00d4ff, 0.5, 10);
        pointLight1.position.set(-3, 2, 3);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x667eea, 0.3, 8);
        pointLight2.position.set(3, -2, -3);
        this.scene.add(pointLight2);
        
        // Hemisphere light for natural lighting
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x98fb98, 0.4);
        this.scene.add(hemiLight);
    }
    
    setupLoaders() {
        // GLTF Loader
        this.loader = new THREE.GLTFLoader();
        
        // DRACOLoader for compressed models
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        this.loader.setDRACOLoader(dracoLoader);
    }
    
    loadModel(url, options = {}) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Apply options
                    if (options.scale) {
                        model.scale.setScalar(options.scale);
                    }
                    if (options.position) {
                        model.position.copy(options.position);
                    }
                    if (options.rotation) {
                        model.rotation.copy(options.rotation);
                    }
                    
                    // Enable shadows
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Enhance materials
                            if (child.material) {
                                child.material.envMapIntensity = 1;
                            }
                        }
                    });
                    
                    // Setup animations
                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => {
                            mixer.clipAction(clip).play();
                        });
                        this.animations.push(mixer);
                    }
                    
                    this.scene.add(model);
                    this.models.set(url, model);
                    resolve(model);
                },
                (progress) => {
                    // Loading progress
                    const percentComplete = (progress.loaded / progress.total) * 100;
                    this.updateLoadingProgress(percentComplete);
                },
                (error) => {
                    console.error('Model loading error:', error);
                    reject(error);
                }
            );
        });
    }
    
    updateLoadingProgress(percent) {
        // Update loading UI
        if (window.tryzeApp) {
            window.tryzeApp.updateLoadingProgress(percent);
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('click', (e) => this.handleClick(e));
    }
    
    handleResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    handleMouseMove(event) {
        // Update mouse coordinates for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    handleClick(event) {
        // Raycast for object selection
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            this.onObjectSelected(selectedObject);
        }
    }
    
    onObjectSelected(object) {
        // Handle object selection
        console.log('Object selected:', object);
        
        // Add selection highlight
        this.highlightObject(object);
        
        // Show product details
        if (window.tryzeApp && window.tryzeApp.productOverlay) {
            window.tryzeApp.productOverlay.show();
        }
    }
    
    highlightObject(object) {
        // Add glow effect to selected object
        const outline = new THREE.Mesh(
            object.geometry,
            new THREE.MeshBasicMaterial({
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.3,
                side: THREE.BackSide
            })
        );
        
        outline.scale.multiplyScalar(1.05);
        object.parent.add(outline);
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
            object.parent.remove(outline);
        }, 2000);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update animations
        this.animations.forEach((mixer) => {
            mixer.update(0.01);
        });
        
        // Render scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize Three.js setup
window.ThreeSetup = ThreeSetup;
