// ===== SHOPPING CART FUNCTIONALITY =====

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromLocalStorage();
        this.updateCartUI();
    }
    
    // Add item to cart
    addItem(product, price, quantity = 1, image = null, category = null) {
        const existingItem = this.items.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ 
                product, 
                price, 
                quantity, 
                image: image || 'default-product',
                category: category || 'general'
            });
        }
        
        this.saveToLocalStorage();
        this.updateCartUI();
        this.showAddToCartMessage(product);
        
        // Dispatch custom event
        this.dispatchCartUpdateEvent();
    }
    
    // Remove item from cart
    removeItem(product) {
        this.items = this.items.filter(item => item.product !== product);
        this.saveToLocalStorage();
        this.updateCartUI();
        this.showRemoveFromCartMessage(product);
        
        // Dispatch custom event
        this.dispatchCartUpdateEvent();
    }
    
    // Update item quantity
    updateQuantity(product, quantity) {
        const item = this.items.find(item => item.product === product);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(product);
            } else {
                item.quantity = quantity;
                this.saveToLocalStorage();
                this.updateCartUI();
                
                // Dispatch custom event
                this.dispatchCartUpdateEvent();
            }
        }
    }
    
    // Clear entire cart
    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.updateCartUI();
        this.showClearCartMessage();
        
        // Dispatch custom event
        this.dispatchCartUpdateEvent();
    }
    
    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    // Get items by category
    getItemsByCategory(category) {
        return this.items.filter(item => item.category === category);
    }
    
    // Save to localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('techshop-cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            this.showError('Impossible de sauvegarder le panier');
        }
    }
    
    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const savedCart = localStorage.getItem('techshop-cart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.items = [];
        }
    }
    
    // Update cart UI
    updateCartUI() {
        this.updateCartBadge();
        this.updateCartSidebar();
    }
    
    // Update cart badge
    updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        const itemCount = this.getItemCount();
        
        if (cartBadge) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }
    
    // Update cart sidebar
    updateCartSidebar() {
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;
        
        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-shopping-cart fa-3x mb-3 opacity-25"></i>
                    <p>Votre panier est vide</p>
                    <a href="#products" class="btn btn-primary mt-2">Découvrir les produits</a>
                </div>
            `;
            cartSubtotal.textContent = '€0.00';
            cartTotal.textContent = '€0.00';
            return;
        }
        
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-product="${this.escapeHtml(item.product)}">
                <div class="cart-item-img">
                    ${item.image === 'default-product' ? 
                        '<i class="fas fa-box"></i>' : 
                        `<img src="${this.escapeHtml(item.image)}" alt="${this.escapeHtml(item.product)}">`
                    }
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${this.escapeHtml(item.product)}</div>
                    <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${this.escapeHtml(item.product)}', ${item.quantity - 1})" 
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${this.escapeHtml(item.product)}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="cart.removeItem('${this.escapeHtml(item.product)}')" 
                        title="Supprimer du panier">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        const total = this.getTotal();
        cartSubtotal.textContent = `€${total.toFixed(2)}`;
        cartTotal.textContent = `€${total.toFixed(2)}`;
    }
    
    // Show add to cart message
    showAddToCartMessage(product) {
        this.showToast(`${product} a été ajouté à votre panier`, 'success');
    }
    
    // Show remove from cart message
    showRemoveFromCartMessage(product) {
        this.showToast(`${product} a été retiré du panier`, 'warning');
    }
    
    // Show clear cart message
    showClearCartMessage() {
        this.showToast('Panier vidé', 'info');
    }
    
    // Show error message
    showError(message) {
        this.showToast(message, 'error');
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas ${this.getToastIcon(type)} me-2"></i>
                <strong class="me-auto">${this.getToastTitle(type)}</strong>
                <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
            <div class="toast-body">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
    
    // Get toast icon based on type
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    // Get toast title based on type
    getToastTitle(type) {
        const titles = {
            success: 'Succès',
            error: 'Erreur',
            warning: 'Attention',
            info: 'Information'
        };
        return titles[type] || 'Information';
    }
    
    // Escape HTML to prevent XSS
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Dispatch cart update event
    dispatchCartUpdateEvent() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                itemCount: this.getItemCount(),
                total: this.getTotal(),
                items: this.items
            }
        });
        document.dispatchEvent(event);
    }
    
    // Export cart data (for analytics or other purposes)
    exportCartData() {
        return {
            items: this.items,
            total: this.getTotal(),
            itemCount: this.getItemCount(),
            timestamp: new Date().toISOString()
        };
    }
    
    // Import cart data
    importCartData(data) {
        if (data && Array.isArray(data.items)) {
            this.items = data.items;
            this.saveToLocalStorage();
            this.updateCartUI();
            this.showToast('Panier importé avec succès', 'success');
        } else {
            this.showError('Données de panier invalides');
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Cart sidebar functionality
function initCartSidebar() {
    const cartButton = document.getElementById('cartButton');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('cartOpened'));
    }
    
    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('cartClosed'));
    }
    
    if (cartButton) {
        cartButton.addEventListener('click', openCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    
    // Close cart with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
            closeCartSidebar();
        }
    });
}

// Checkout functionality
function initCheckout() {
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.getItemCount() === 0) {
                cart.showError('Votre panier est vide');
                return;
            }
            
            // Simulate checkout process
            cart.showToast('Redirection vers le paiement...', 'info');
            
            // In a real application, this would redirect to a checkout page
            setTimeout(() => {
                cart.showToast('Fonctionnalité de paiement à implémenter', 'info');
            }, 1000);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, cart, initCartSidebar, initCheckout };
}