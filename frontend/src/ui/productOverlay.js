// Advanced Product Overlay Component with Interactive Features
class ProductOverlay {
    constructor() {
        this.isVisible = false;
        this.currentProduct = null;
        this.overlayElement = document.getElementById('productOverlay');
        this.closeButton = document.getElementById('closeOverlay');
        this.productTitle = document.getElementById('productTitle');
        this.productDescription = document.getElementById('productDescription');
        this.productPrice = document.getElementById('productPrice');
        this.addToCartBtn = document.getElementById('addToCartBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        this.animations = [];
        this.touchStartY = 0;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Product Overlay...');
        this.setupEventListeners();
        this.setupAnimations();
        this.setupGestures();
    }
    
    setupEventListeners() {
        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hide());
        }
        
        // Action buttons
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', () => this.addToCart());
        }
        
        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', () => this.shareProduct());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        // Click outside to close
        this.overlayElement?.addEventListener('click', (e) => {
            if (e.target === this.overlayElement) {
                this.hide();
            }
        });
    }
    
    setupAnimations() {
        // Setup GSAP or CSS animations
        this.setupEntranceAnimations();
        this.setupExitAnimations();
        this.setupInteractionAnimations();
    }
    
    setupEntranceAnimations() {
        if (this.overlayElement) {
            this.overlayElement.style.cssText += `
                transform: translateY(100%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;
        }
    }
    
    setupExitAnimations() {
        // Exit animation setup
        this.exitAnimation = {
            transform: 'translateY(100%)',
            opacity: '0',
            transition: 'all 0.3s ease-in'
        };
    }
    
    setupInteractionAnimations() {
        // Button hover animations
        const buttons = [this.addToCartBtn, this.shareBtn, this.closeButton];
        buttons.forEach(button => {
            if (button) {
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-2px) scale(1.05)';
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
    }
    
    setupGestures() {
        // Touch gestures for mobile
        if (this.overlayElement) {
            this.overlayElement.addEventListener('touchstart', (e) => {
                this.touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            this.overlayElement.addEventListener('touchmove', (e) => {
                const touchY = e.touches[0].clientY;
                const deltaY = touchY - this.touchStartY;
                
                if (deltaY > 0) {
                    // Dragging down
                    const progress = Math.min(deltaY / 200, 1);
                    this.overlayElement.style.transform = `translateY(${deltaY}px)`;
                    this.overlayElement.style.opacity = 1 - (progress * 0.5);
                }
            }, { passive: true });
            
            this.overlayElement.addEventListener('touchend', (e) => {
                const touchY = e.changedTouches[0].clientY;
                const deltaY = touchY - this.touchStartY;
                
                if (deltaY > 100) {
                    // Hide if dragged down significantly
                    this.hide();
                } else {
                    // Snap back
                    this.overlayElement.style.transform = 'translateY(0)';
                    this.overlayElement.style.opacity = '1';
                }
            }, { passive: true });
        }
    }
    
    updateProduct(product) {
        this.currentProduct = product;
        this.renderProductInfo();
        this.loadProductDetails();
    }
    
    renderProductInfo() {
        if (!this.currentProduct) return;
        
        const product = this.currentProduct;
        
        // Update text content with animation
        this.animateTextUpdate(this.productTitle, product.name);
        this.animateTextUpdate(this.productDescription, product.description);
        this.animateTextUpdate(this.productPrice, `$${product.price}`);
        
        // Add product image
        this.updateProductImage(product);
        
        // Add additional details
        this.addProductDetails(product);
    }
    
    animateTextUpdate(element, newText) {
        if (!element) return;
        
        // Fade out
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.textContent = newText;
            // Fade in
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    }
    
    updateProductImage(product) {
        // Add product image to overlay
        let imageContainer = this.overlayElement.querySelector('.product-image');
        if (!imageContainer) {
            imageContainer = document.createElement('div');
            imageContainer.className = 'product-image';
            this.overlayElement.querySelector('.overlay-content').prepend(imageContainer);
        }
        
        imageContainer.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.name}" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
        `;
    }
    
    addProductDetails(product) {
        // Add detailed product information
        let detailsContainer = this.overlayElement.querySelector('.product-extra-details');
        if (!detailsContainer) {
            detailsContainer = document.createElement('div');
            detailsContainer.className = 'product-extra-details';
            detailsContainer.style.cssText = `
                margin: 20px 0;
                padding: 15px;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 10px;
            `;
            this.overlayElement.querySelector('.product-details').before(detailsContainer);
        }
        
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${product.category || 'Furniture'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Material:</span>
                <span class="detail-value">${product.material || 'Wood & Metal'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dimensions:</span>
                <span class="detail-value">${product.dimensions || '120 x 60 x 75 cm'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Rating:</span>
                <span class="detail-value">${this.renderStarRating(product.rating || 4.5)}</span>
            </div>
        `;
    }
    
    renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span style="color: #ffc107;">★</span>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<span style="color: #ffc107;">★</span>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span style="color: #ccc;">☆</span>';
        }
        
        return `${starsHTML} <span style="margin-left: 5px; color: #666;">(${rating}/5)</span>`;
    }
    
    loadProductDetails() {
        // Simulate loading additional product details
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            this.animateDetailsIn();
        }, 800);
    }
    
    showLoadingState() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-details';
        loadingElement.innerHTML = `
            <div class="loading-spinner" style="
                width: 20px; 
                height: 20px; 
                border: 2px solid #f3f3f3; 
                border-top: 2px solid #667eea; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
                margin: 10px auto;
            "></div>
            <p style="text-align: center; color: #666; font-size: 0.9em;">Loading details...</p>
        `;
        
        this.overlayElement.querySelector('.overlay-content').appendChild(loadingElement);
    }
    
    hideLoadingState() {
        const loadingElement = this.overlayElement.querySelector('.loading-details');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    animateDetailsIn() {
        const detailItems = this.overlayElement.querySelectorAll('.detail-item');
        detailItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    show() {
        this.isVisible = true;
        
        if (this.overlayElement) {
            this.overlayElement.classList.remove('hidden');
            
            // Trigger entrance animation
            requestAnimationFrame(() => {
                this.overlayElement.style.transform = 'translateY(0)';
                this.overlayElement.style.opacity = '1';
            });
            
            // Add backdrop blur effect
            document.body.style.backdropFilter = 'blur(5px)';
        }
        
        this.trackEvent('overlay_shown');
    }
    
    hide() {
        this.isVisible = false;
        
        if (this.overlayElement) {
            // Trigger exit animation
            Object.assign(this.overlayElement.style, this.exitAnimation);
            
            setTimeout(() => {
                this.overlayElement.classList.add('hidden');
            }, 300);
            
            // Remove backdrop blur
            document.body.style.backdropFilter = 'none';
        }
        
        this.trackEvent('overlay_hidden');
    }
    
    addToCart() {
        if (!this.currentProduct) return;
        
        // Add loading state to button
        const originalText = this.addToCartBtn.textContent;
        this.addToCartBtn.textContent = 'Adding...';
        this.addToCartBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.addToCartBtn.textContent = 'Added to Cart ✓';
            this.addToCartBtn.style.background = '#28a745';
            
            // Show success animation
            this.showSuccessAnimation();
            
            // Reset button after delay
            setTimeout(() => {
                this.addToCartBtn.textContent = originalText;
                this.addToCartBtn.disabled = false;
                this.addToCartBtn.style.background = '';
            }, 2000);
            
            this.trackEvent('add_to_cart', { productId: this.currentProduct.id });
        }, 1000);
    }
    
    showSuccessAnimation() {
        // Create success particle effect
        const particles = document.createElement('div');
        particles.innerHTML = '✨';
        particles.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2em;
            pointer-events: none;
            animation: successPop 0.6s ease-out;
        `;
        
        this.overlayElement.appendChild(particles);
        
        setTimeout(() => {
            particles.remove();
        }, 600);
    }
    
    shareProduct() {
        if (!this.currentProduct) return;
        
        const shareData = {
            title: this.currentProduct.name,
            text: this.currentProduct.description,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback - copy to clipboard
            const shareText = `Check out ${shareData.title}: ${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Link copied to clipboard!');
            });
        }
        
        this.trackEvent('product_shared', { productId: this.currentProduct.id });
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 0.9em;
            z-index: 10000;
            animation: toastSlide 3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    trackEvent(eventName, data = {}) {
        console.log(`Overlay Event: ${eventName}`, data);
        // Integrate with analytics service
    }
}

// Add additional CSS animations
const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
    @keyframes successPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes toastSlide {
        0%, 100% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        10%, 90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding: 5px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .detail-label {
        font-weight: 600;
        color: #333;
    }
    
    .detail-value {
        color: #666;
    }
    
    .product-overlay .overlay-content {
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
    }
    
    .product-overlay .overlay-content::-webkit-scrollbar {
        width: 6px;
    }
    
    .product-overlay .overlay-content::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .product-overlay .overlay-content::-webkit-scrollbar-thumb {
        background: rgba(102, 126, 234, 0.3);
        border-radius: 3px;
    }
`;
document.head.appendChild(overlayStyle);

// Initialize Product Overlay
window.ProductOverlay = ProductOverlay;
