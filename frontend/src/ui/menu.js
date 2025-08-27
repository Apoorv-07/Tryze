// Advanced Interactive Menu Component
class MenuComponent {
    constructor() {
        this.isOpen = false;
        this.products = [];
        this.selectedProductId = null;
        this.menuElement = document.getElementById('menu');
        this.menuToggle = document.getElementById('menuToggle');
        this.menuContent = document.getElementById('menuContent');
        this.productList = document.getElementById('productList');
        
        this.init();
    }
    
    init() {
        console.log('Initializing Menu Component...');
        this.setupEventListeners();
        this.setupAnimations();
        this.loadInitialState();
    }
    
    setupEventListeners() {
        // Menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggle());
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menuElement.contains(e.target) && this.isOpen) {
                this.close();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            if (e.key === 'm' && e.ctrlKey) {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // Touch gestures
        this.setupTouchGestures();
    }
    
    setupTouchGestures() {
        let startY = 0;
        let startX = 0;
        
        this.menuElement.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });
        
        this.menuElement.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        this.menuElement.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const deltaY = startY - endY;
            const deltaX = startX - endX;
            
            // Swipe detection
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    this.close(); // Swipe up to close
                } else {
                    this.open(); // Swipe down to open
                }
            }
        });
    }
    
    setupAnimations() {
        // CSS custom properties for animations
        this.menuElement.style.setProperty('--menu-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    }
    
    loadInitialState() {
        // Load menu state from localStorage
        const savedState = localStorage.getItem('tryze-menu-state');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.isOpen = state.isOpen || false;
            this.updateUI();
        }
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.updateUI();
        this.triggerOpenAnimation();
        this.saveState();
        
        // Analytics
        this.trackEvent('menu_opened');
    }
    
    close() {
        this.isOpen = false;
        this.updateUI();
        this.triggerCloseAnimation();
        this.saveState();
        
        // Analytics
        this.trackEvent('menu_closed');
    }
    
    updateUI() {
        if (this.menuContent) {
            if (this.isOpen) {
                this.menuContent.classList.remove('collapsed');
                this.menuToggle.innerHTML = '✕';
                this.menuElement.setAttribute('aria-expanded', 'true');
            } else {
                this.menuContent.classList.add('collapsed');
                this.menuToggle.innerHTML = '☰';
                this.menuElement.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    triggerOpenAnimation() {
        this.menuContent.style.animation = 'slideDown 0.3s ease-out';
        
        // Stagger animation for menu items
        const menuItems = this.menuContent.querySelectorAll('.product-item, .control-btn');
        menuItems.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.3s ease-out ${index * 0.05}s both`;
        });
    }
    
    triggerCloseAnimation() {
        this.menuContent.style.animation = 'slideUp 0.2s ease-in';
    }
    
    loadProducts(products) {
        this.products = products;
        this.renderProductList();
    }
    
    renderProductList() {
        if (!this.productList) return;
        
        this.productList.innerHTML = '';
        
        this.products.forEach((product) => {
            const productItem = this.createProductItem(product);
            this.productList.appendChild(productItem);
        });
    }
    
    createProductItem(product) {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.dataset.productId = product.id;
        
        item.innerHTML = `
            <div class="product-thumbnail" style="background-image: url('${product.thumbnail}');">
                <div class="product-overlay-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
            </div>
            <div class="product-details">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
                <div class="product-rating">
                    ${this.renderStarRating(4.5)}
                </div>
            </div>
        `;
        
        // Add interaction effects
        item.addEventListener('click', () => this.selectProduct(product));
        item.addEventListener('mouseenter', () => this.onProductHover(item));
        item.addEventListener('mouseleave', () => this.onProductLeave(item));
        
        // Add ripple effect
        this.addRippleEffect(item);
        
        return item;
    }
    
    renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star full">★</span>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="star empty">☆</span>';
        }
        
        return `<div class="rating-stars">${starsHTML}</div>`;
    }
    
    selectProduct(product) {
        this.selectedProductId = product.id;
        this.updateSelectedProduct();
        
        // Notify app
        if (window.tryzeApp) {
            window.tryzeApp.selectProduct(product);
        }
        
        // Add selection animation
        this.animateSelection(product.id);
        
        // Analytics
        this.trackEvent('product_selected', { productId: product.id });
    }
    
    updateSelectedProduct() {
        const items = this.productList.querySelectorAll('.product-item');
        items.forEach((item) => {
            if (parseInt(item.dataset.productId) === this.selectedProductId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    animateSelection(productId) {
        const item = this.productList.querySelector(`[data-product-id="${productId}"]`);
        if (item) {
            item.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                item.style.animation = '';
            }, 600);
        }
    }
    
    onProductHover(item) {
        item.style.transform = 'translateX(8px) scale(1.02)';
        item.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
    }
    
    onProductLeave(item) {
        if (!item.classList.contains('active')) {
            item.style.transform = '';
            item.style.boxShadow = '';
        }
    }
    
    addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    saveState() {
        const state = {
            isOpen: this.isOpen,
            selectedProductId: this.selectedProductId
        };
        localStorage.setItem('tryze-menu-state', JSON.stringify(state));
    }
    
    trackEvent(eventName, data = {}) {
        console.log(`Menu Event: ${eventName}`, data);
        // Integrate with analytics service
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .rating-stars {
        display: flex;
        gap: 2px;
        margin-top: 5px;
    }
    
    .star {
        color: #ffc107;
        font-size: 12px;
    }
    
    .star.empty {
        color: #ccc;
    }
    
    .star.half {
        background: linear-gradient(90deg, #ffc107 50%, #ccc 50%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;
document.head.appendChild(style);

// Initialize Menu Component
window.MenuComponent = MenuComponent;
