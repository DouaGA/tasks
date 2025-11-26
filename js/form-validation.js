// ===== FORM VALIDATION FUNCTIONALITY =====

class FormValidator {
    constructor() {
        this.forms = new Map();
        this.init();
    }
    
    // Initialize form validation
    init() {
        this.setupNewsletterForm();
        this.setupSearchValidation();
        this.setupContactForm();
    }
    
    // Newsletter form validation
    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        
        if (newsletterForm) {
            this.forms.set('newsletter', newsletterForm);
            
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateNewsletterForm(newsletterForm)) {
                    this.handleNewsletterSubmission(newsletterForm);
                }
            });
            
            // Real-time validation
            const emailInput = newsletterForm.querySelector('.newsletter-email');
            if (emailInput) {
                emailInput.addEventListener('input', () => {
                    this.validateEmailField(emailInput);
                });
                
                emailInput.addEventListener('blur', () => {
                    this.validateEmailField(emailInput);
                });
            }
        }
    }
    
    // Search validation
    setupSearchValidation() {
        const searchForm = document.querySelector('.search-container');
        
        if (searchForm) {
            const searchInput = searchForm.querySelector('.search-input');
            const searchBtn = searchForm.querySelector('.search-btn');
            
            if (searchInput && searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.handleSearch(searchInput.value);
                });
                
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSearch(searchInput.value);
                    }
                });
            }
        }
    }
    
    // Contact form setup (if exists)
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            this.forms.set('contact', contactForm);
            
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateContactForm(contactForm)) {
                    this.handleContactSubmission(contactForm);
                }
            });
            
            // Real-time validation for contact form
            this.setupRealTimeValidation(contactForm);
        }
    }
    
    // Real-time validation setup
    setupRealTimeValidation(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
            });
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.type;
        let isValid = true;
        let message = '';
        
        // Clear previous validation
        this.clearFieldValidation(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Ce champ est obligatoire';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            if (!this.isValidEmail(value)) {
                isValid = false;
                message = 'Veuillez entrer une adresse email valide';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            if (!this.isValidPhone(value)) {
                isValid = false;
                message = 'Veuillez entrer un numéro de téléphone valide';
            }
        }
        
        // Minimum length validation
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            isValid = false;
            message = `Minimum ${minLength} caractères requis`;
        }
        
        // Maximum length validation
        const maxLength = field.getAttribute('maxlength');
        if (maxLength && value.length > parseInt(maxLength)) {
            isValid = false;
            message = `Maximum ${maxLength} caractères autorisés`;
        }
        
        // Pattern validation
        const pattern = field.getAttribute('pattern');
        if (pattern && value) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                isValid = false;
                message = field.getAttribute('title') || 'Format invalide';
            }
        }
        
        // Apply validation state
        if (!isValid && value) {
            this.markFieldAsInvalid(field, message);
        } else if (isValid && value) {
            this.markFieldAsValid(field);
        }
        
        return isValid;
    }
    
    // Validate newsletter form
    validateNewsletterForm(form) {
        const emailInput = form.querySelector('.newsletter-email');
        const email = emailInput ? emailInput.value.trim() : '';
        
        this.clearFormValidation(form);
        
        if (!email) {
            this.markFieldAsInvalid(emailInput, 'L\'email est obligatoire');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.markFieldAsInvalid(emailInput, 'Veuillez entrer une adresse email valide');
            return false;
        }
        
        return true;
    }
    
    // Validate contact form
    validateContactForm(form) {
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        this.clearFormValidation(form);
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate email field specifically
    validateEmailField(field) {
        const value = field.value.trim();
        this.clearFieldValidation(field);
        
        if (!value) {
            if (field.hasAttribute('required')) {
                this.markFieldAsInvalid(field, 'L\'email est obligatoire');
            }
            return false;
        }
        
        if (!this.isValidEmail(value)) {
            this.markFieldAsInvalid(field, 'Veuillez entrer une adresse email valide');
            return false;
        }
        
        this.markFieldAsValid(field);
        return true;
    }
    
    // Handle newsletter submission
    handleNewsletterSubmission(form) {
        const emailInput = form.querySelector('.newsletter-email');
        const email = emailInput.value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Inscription...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success scenario
            this.showNewsletterSuccess(email);
            form.reset();
            this.clearFormValidation(form);
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Track subscription (in a real app, this would be an analytics call)
            this.trackNewsletterSubscription(email);
            
        }, 1500);
    }
    
    // Handle contact form submission
    handleContactSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success scenario
            this.showFormSuccess('Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.');
            form.reset();
            this.clearFormValidation(form);
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
        }, 2000);
    }
    
    // Handle search
    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            this.showSearchError('Veuillez entrer un terme de recherche');
            return;
        }
        
        if (trimmedQuery.length < 2) {
            this.showSearchError('Le terme de recherche doit contenir au moins 2 caractères');
            return;
        }
        
        // In a real application, this would trigger search functionality
        this.showSearchResults(trimmedQuery);
    }
    
    // Show newsletter success
    showNewsletterSuccess(email) {
        this.showToast(`Merci ! Vous êtes maintenant abonné à notre newsletter.`, 'success');
        
        // You could also save to localStorage or send to analytics
        this.saveNewsletterSubscription(email);
    }
    
    // Show form success
    showFormSuccess(message) {
        this.showToast(message, 'success');
    }
    
    // Show search error
    showSearchError(message) {
        this.showToast(message, 'error');
    }
    
    // Show search results (simulated)
    showSearchResults(query) {
        this.showToast(`Recherche de "${query}" - Fonctionnalité à implémenter`, 'info');
        
        // In a real app, this would display search results
        console.log('Search query:', query);
    }
    
    // Mark field as invalid
    markFieldAsInvalid(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Add or update error message
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    // Mark field as valid
    markFieldAsValid(field) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
        
        // Remove error message if exists
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Clear field validation
    clearFieldValidation(field) {
        field.classList.remove('is-valid', 'is-invalid');
        
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Clear form validation
    clearFormValidation(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.clearFieldValidation(field));
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Reuse the toast functionality from cart.js if available
        if (typeof cart !== 'undefined' && typeof cart.showToast === 'function') {
            cart.showToast(message, type);
            return;
        }
        
        // Fallback toast implementation
        const toast = document.createElement('div');
        toast.className = `alert alert-${this.getBootstrapAlertType(type)} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
    
    // Utility functions
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
    
    getBootstrapAlertType(type) {
        const types = {
            success: 'success',
            error: 'danger',
            warning: 'warning',
            info: 'info'
        };
        return types[type] || 'info';
    }
    
    // Save newsletter subscription (simulated)
    saveNewsletterSubscription(email) {
        const subscriptions = JSON.parse(localStorage.getItem('newsletter-subscriptions') || '[]');
        subscriptions.push({
            email: email,
            date: new Date().toISOString(),
            source: 'website'
        });
        localStorage.setItem('newsletter-subscriptions', JSON.stringify(subscriptions));
    }
    
    // Track newsletter subscription (for analytics)
    trackNewsletterSubscription(email) {
        // In a real application, this would send data to your analytics platform
        console.log('Newsletter subscription tracked:', email);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
                'event_category': 'engagement',
                'event_label': 'website'
            });
        }
    }
    
    // Get validation statistics
    getValidationStats() {
        const stats = {
            totalForms: this.forms.size,
            validatedSubmissions: 0,
            failedSubmissions: 0
        };
        
        // This would be populated from actual form submissions in a real app
        return stats;
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.formValidator = new FormValidator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}