// ===== PORTFOLIO SCRIPT =====
// Main JavaScript file for Doua Galai's portfolio website

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INITIALIZATION =====
    console.log('Portfolio website loaded successfully!');
    
    // Initialize all components
    initFormValidation();
    initSmoothScrolling();
    initAnimations();
    initLanguageProgress();
    initScrollEffects();
    
    // ===== FORM VALIDATION =====
    function initFormValidation() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if (contactForm.checkValidity()) {
                    // Form is valid - simulate submission
                    handleFormSubmission();
                }
                
                contactForm.classList.add('was-validated');
            }, false);
            
            // Real-time validation
            const formInputs = contactForm.querySelectorAll('input, textarea');
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.checkValidity()) {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    } else {
                        this.classList.remove('is-valid');
                        this.classList.add('is-invalid');
                    }
                });
            });
        }
    }
    
    function handleFormSubmission() {
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showAlert('Message envoyé avec succès! Je vous répondrai dans les plus brefs délais.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            document.getElementById('contactForm').classList.remove('was-validated');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Remove validation classes
            const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
            formInputs.forEach(input => {
                input.classList.remove('is-valid');
            });
        }, 2000);
    }
    
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(alertDiv, contactForm);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    // ===== SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile navbar if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });
        });
    }
    
    // ===== ANIMATIONS =====
    function initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Elements to animate
        const animateElements = document.querySelectorAll('.skill-card, .project-card, .certification-card, .timeline-item');
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .timeline-item.animate-on-scroll {
                transform: translateX(-30px);
            }
            
            .timeline-item.animate-on-scroll.animate-in {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== LANGUAGE PROGRESS BARS =====
    function initLanguageProgress() {
        const progressBars = document.querySelectorAll('.language-progress');
        
        progressBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            if (level) {
                // Animate progress bar after a short delay
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, 500);
            }
        });
    }
    
    // ===== SCROLL EFFECTS =====
    function initScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = '';
                navbar.style.backdropFilter = '';
            }
        });
        
        // Active nav link highlighting
        window.addEventListener('scroll', highlightActiveNavLink);
        
        function highlightActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            const scrollY = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                }
            });
        }
        
        // Initial call
        highlightActiveNavLink();
    }
    
    // ===== ADDITIONAL FEATURES =====
    
    // Project filter functionality
    function initProjectFilter() {
        // This can be extended to filter projects by technology
        console.log('Project filter initialized - ready for extension');
    }
    
    // Theme switcher (optional)
    function initThemeSwitcher() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'btn btn-outline-light theme-toggle';
        themeToggle.style.position = 'fixed';
        themeToggle.style.bottom = '20px';
        themeToggle.style.right = '20px';
        themeToggle.style.zIndex = '1000';
        themeToggle.style.borderRadius = '50%';
        themeToggle.style.width = '50px';
        themeToggle.style.height = '50px';
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
        
        document.body.appendChild(themeToggle);
        
        // Add dark theme styles
        const darkThemeStyles = `
            <style>
                .dark-theme {
                    --secondary-color: #1a252f;
                    --light-color: #2c3e50;
                    --text-color: #ecf0f1;
                    --white: #2c3e50;
                    --gray-light: #34495e;
                }
                
                .dark-theme .skill-card,
                .dark-theme .project-card,
                .dark-theme .certification-card,
                .dark-theme .contact-form {
                    background: var(--secondary-color);
                    color: var(--text-color);
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', darkThemeStyles);
    }
    
    // Uncomment to enable theme switcher
    // initThemeSwitcher();
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Lazy loading for images (if added in future)
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('Script error:', e.error);
    });
    
    // ===== RESIZE HANDLER =====
    window.addEventListener('resize', function() {
        // Handle any resize-specific logic
        console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
    });
    
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== EXPORTS FOR MODULAR USE =====
// These would be used if splitting into modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle
    };
}