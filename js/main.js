// ===== MAIN APPLICATION SCRIPT =====

class TechShopApp {
    constructor() {
        this.products = [];
        this.currentTheme = 'light';
        this.isInitialized = false;
    }
    
    // Initialize the application
    init() {
        if (this.isInitialized) return;
        
        this.loadProducts();
        this.initTheme();
        this.initEventListeners();
        this.initAnimations();
        this.initCartFunctionality();
        this.initProductFiltering();
        
        this.isInitialized = true;
        console.log('TechShop app initialized successfully');
    }
    
    // Load products data
    loadProducts() {
        // In a real application, this would be an API call
        this.products = [
            {
                id: 1,
                name: "Smartphone Pro X",
                description: "Écran 6.7\", 256GB, Appareil photo triple",
                price: 899,
                oldPrice: 1099,
                category: "smartphones",
                badge: "sale",
                image: "default-product",
                features: ["Écran AMOLED", "256GB Stockage", "Triple caméra", "5G"]
            },
            {
                id: 2,
                name: "Laptop Ultra Slim",
                description: "i7, 16GB RAM, SSD 512GB, 14\"",
                price: 1299,
                oldPrice: null,
                category: "laptops",
                badge: null,
                image: "default-product",
                features: ["Processeur i7", "16GB RAM", "SSD 512GB", "14 pouces"]
            },
            {
                id: 3,
                name: "Smart Watch Pro",
                description: "Écran AMOLED, GPS, Résistant à l'eau",
                price: 299,
                oldPrice: null,
                category: "wearables",
                badge: "new",
                image: "default-product",
                features: ["Écran AMOLED", "GPS intégré", "Résistant à l'eau", "30 jours batterie"]
            },
            {
                id: 4,
                name: "Écouteurs Sans Fil",
                description: "Annulation de bruit, Autonomie 30h",
                price: 199,
                oldPrice: 249,
                category: "accessories",
                badge: "sale",
                image: "default-product",
                features: ["Annulation de bruit", "Autonomie 30h", "Bluetooth 5.0", "Charge rapide"]
            },
            {
                id: 5,
                name: "Tablette Graphique",
                description: "10 pouces, Stylus inclus, Dessin professionnel",
                price: 449,
                oldPrice: null,
                category: "tablets",
                badge: "new",
                image: "default-product",
                features: ["Écran 10 pouces", "Stylus inclus", "4096 niveaux de pression", "Connexion USB-C"]
            },
            {
                id: 6,
                name: "Enceinte Bluetooth",
                description: "Sound 360°, Batterie 24h, Résistante à l'eau",
                price: 129,
                oldPrice: 159,
                category: "accessories",
                badge: "sale",
                image: "default-product",
                features: ["Sound 360°", "Batterie 24h", "Résistante IPX7", "Bluetooth 5.0"]
            },
            {
                id: 7,
                name: "Caméra Action 4K",
                description: "Stabilisation avancée, Étanche 10m",
                price: 349,
                oldPrice: null,
                category: "cameras",
                badge: null,
                image: "default-product",
                features: ["4K 60fps", "Stabilisation avancée", "Étanche 10m", "Wi-Fi intégré"]
            },
            {
                id: 8,
                name: "Clavier Mécanique",
                description: "Switches bleus, RGB, Anti-ghosting",
                price: 89,
                oldPrice: 119,
                category: "accessories",
                badge: "sale",
                image: "default-product",
                features: ["Switches bleus", "Rétroéclairage RGB", "Anti-ghosting", "Câble détachable"]
            }
        ];
        
        this.renderProducts();
    }
    
    // Render products to the DOM
    renderProducts(filteredProducts = null) {
        const productsToRender = filteredProducts || this.products;
        const productsGrid = document.querySelector('.products-grid');
        
        if (!productsGrid) return;
        
        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="col-md-6 col-lg-3" data-category="${product.category}">
                <div class="product-card">
                    <div class="product-img position-relative">
                        ${product.badge ? `<span class="product-badge ${product.badge}">${this.getBadgeText(product.badge)}</span>` : ''}
                        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='150' height='150' fill='%23f8f9fa'/><rect x='30' y='20' width='90' height='110' rx='10' fill='%23333'/><rect x='40' y='30' width='70' height='80' fill='%23149eca'/></svg>" 
                             alt="${this.escapeHtml(product.name)}" class="img-fluid">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${this.escapeHtml(product.name)}</h5>
                        <p class="product-description">${this.escapeHtml(product.description)}</p>
                        <div class="product-price-container">
                            <span class="product-price">€${product.price}</span>
                            ${product.oldPrice ? `<span class="product-old-price">€${product.oldPrice}</span>` : ''}
                        </div>
                        <button class="btn btn-primary btn-add-cart" 
                                data-product="${this.escapeHtml(product.name)}" 
                                data-price="${product.price}"
                                data-category="${product.category}">
                            <i class="fas fa-cart-plus me-2"></i>Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.attachProductEventListeners();
    }
    
    // Get badge text
    getBadgeText(badgeType) {
        const badges = {
            'sale': '-20%',
            'new': 'Nouveau',
            'hot': 'Populaire'
        };
        return badges[badgeType] || badgeType;
    }
    
    // Attach event listeners to product buttons
    attachProductEventListeners() {
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = e.target.closest('.btn-add-cart');
                const productName = product.getAttribute('data-product');
                const productPrice = parseFloat(product.getAttribute('data-price'));
                const productCategory = product.getAttribute('data-category');
                
                if (window.cart) {
                    window.cart.addItem(productName, productPrice, 1, null, productCategory);
                }
                
                // Add click animation
                this.animateButton(product);
            });
        });
    }
    
    // Initialize theme functionality
    initTheme() {
        this.currentTheme = localStorage.getItem('techshop-theme') || 'light';
        this.applyTheme(this.currentTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    // Toggle between light and dark theme
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('techshop-theme', this.currentTheme);
    }
    
    // Apply theme to document
    applyTheme(theme) {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            document.body.classList.remove('dark-theme');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
    
    // Initialize event listeners
    initEventListeners() {
        // Category filtering
        document.querySelectorAll('[data-category]').forEach(element => {
            if (element.tagName === 'A') {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = element.getAttribute('data-category');
                    this.filterByCategory(category);
                });
            }
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
        
        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Cart update events
        document.addEventListener('cartUpdated', (e) => {
            this.handleCartUpdate(e.detail);
        });
    }
    
    // Initialize animations
    initAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
    }
    
    // Setup scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.product-card, .feature-card, .category-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Setup hover animations
    setupHoverAnimations() {
        // Add hover effects to interactive elements
        document.querySelectorAll('.btn, .card, .nav-link').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    // Initialize cart functionality
    initCartFunctionality() {
        if (typeof initCartSidebar === 'function') {
            initCartSidebar();
        }
        if (typeof initCheckout === 'function') {
            initCheckout();
        }
    }
    
    // Initialize product filtering
    initProductFiltering() {
        // This would be extended with more filtering options
        console.log('Product filtering initialized');
    }
    
    // Filter products by category
    filterByCategory(category) {
        const filteredProducts = category === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === category);
        
        this.renderProducts(filteredProducts);
        
        // Show filter feedback
        this.showFilterFeedback(category);
    }
    
    // Handle search
    handleSearch() {
        const searchInput = document.querySelector('.search-input');
        const query = searchInput ? searchInput.value.trim() : '';
        
        if (!query) {
            if (window.formValidator) {
                window.formValidator.showSearchError('Veuillez entrer un terme de recherche');
            }
            return;
        }
        
        // Filter products based on search query
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderProducts(filteredProducts);
        this.showSearchFeedback(query, filteredProducts.length);
    }
    
    // Show filter feedback
    showFilterFeedback(category) {
        const categoryNames = {
            'smartphones': 'Smartphones',
            'laptops': 'Ordinateurs',
            'accessories': 'Accessoires',
            'all': 'Tous les produits'
        };
        
        const message = category === 'all' 
            ? 'Affichage de tous les produits'
            : `Filtrage par : ${categoryNames[category] || category}`;
        
        this.showToast(message, 'info');
    }
    
    // Show search feedback
    showSearchFeedback(query, resultCount) {
        const message = resultCount > 0
            ? `${resultCount} résultat(s) trouvé(s) pour "${query}"`
            : `Aucun résultat trouvé pour "${query}"`;
        
        this.showToast(message, resultCount > 0 ? 'info' : 'warning');
    }
    
    // Handle cart updates
    handleCartUpdate(cartData) {
        // Update any cart-related UI elements
        console.log('Cart updated:', cartData);
        
        // You could update recommendations or other cart-related features here
    }
    
    // Handle window resize
    handleResize() {
        // Adjust any responsive elements
        const width = window.innerWidth;
        
        if (width < 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }
    
    // Animate button click
    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        if (window.cart && typeof window.cart.showToast === 'function') {
            window.cart.showToast(message, type);
        } else {
            // Fallback toast
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Utility function to escape HTML
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Get application stats
    getStats() {
        return {
            productCount: this.products.length,
            categories: [...new Set(this.products.map(p => p.category))],
            theme: this.currentTheme,
            cartItems: window.cart ? window.cart.getItemCount() : 0
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.techShopApp = new TechShopApp();
    window.techShopApp.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechShopApp;
}