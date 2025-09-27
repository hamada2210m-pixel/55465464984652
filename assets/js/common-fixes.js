// Common Fixes JavaScript
// This file contains common fixes and workarounds for browser compatibility and UI issues

document.addEventListener('DOMContentLoaded', function() {
    applyCommonFixes();
});

function applyCommonFixes() {
    // Fix RTL layout issues
    fixRTLLayout();
    
    // Fix mobile viewport issues
    fixMobileViewport();
    
    // Fix audio autoplay issues
    fixAudioAutoplay();
    
    // Fix form validation styling
    fixFormValidation();
    
    // Fix image loading issues
    fixImageLoading();
    
    // Fix scroll behavior
    fixScrollBehavior();
}

function fixRTLLayout() {
    // Ensure proper RTL direction for all elements
    const rtlElements = document.querySelectorAll('body, html');
    rtlElements.forEach(el => {
        if (!el.hasAttribute('dir')) {
            el.setAttribute('dir', 'rtl');
        }
    });
    
    // Fix button positioning in RTL
    const buttons = document.querySelectorAll('.btn, button');
    buttons.forEach(btn => {
        if (btn.style.float === 'left') {
            btn.style.float = 'right';
        }
    });
}

function fixMobileViewport() {
    // Add viewport meta tag if missing
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
    }
    
    // Fix mobile touch events
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Improve touch responsiveness
        const touchElements = document.querySelectorAll('button, .btn, a');
        touchElements.forEach(el => {
            el.style.touchAction = 'manipulation';
        });
    }
}

function fixAudioAutoplay() {
    // Handle audio autoplay restrictions
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        // Remove autoplay attribute if present
        audio.removeAttribute('autoplay');
        
        // Add user interaction requirement
        audio.addEventListener('play', function() {
            if (this.currentTime === 0) {
                // First time playing, ensure user interaction
                this.pause();
                
                // Show play button or require user interaction
                document.addEventListener('click', function playOnInteraction() {
                    audio.play().catch(e => console.log('Audio play failed:', e));
                    document.removeEventListener('click', playOnInteraction);
                }, { once: true });
            }
        });
    });
}

function fixFormValidation() {
    // Add custom form validation styling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const invalidFields = form.querySelectorAll(':invalid');
            
            invalidFields.forEach(field => {
                field.classList.add('invalid');
                
                // Remove invalid class when user starts typing
                field.addEventListener('input', function() {
                    this.classList.remove('invalid');
                }, { once: true });
            });
        });
    });
    
    // Fix HTML5 validation messages in Arabic
    const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('invalid', function() {
            // Set custom Arabic validation messages
            if (this.validity.valueMissing) {
                this.setCustomValidity('هذا الحقل مطلوب');
            } else if (this.validity.typeMismatch) {
                if (this.type === 'email') {
                    this.setCustomValidity('يرجى إدخال عنوان بريد إلكتروني صحيح');
                } else if (this.type === 'url') {
                    this.setCustomValidity('يرجى إدخال رابط صحيح');
                }
            } else if (this.validity.patternMismatch) {
                this.setCustomValidity('تنسيق غير صحيح');
            }
        });
        
        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    });
}

function fixImageLoading() {
    // Fix lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Intersection Observer for older browsers
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Add error handling for broken images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPti12YjYsdipINi62YrYsSDZhdiq2YjZgdix2Kk8L3RleHQ+PC9zdmc+';
            this.alt = 'صورة غير متوفرة';
        });
    });
}

function fixScrollBehavior() {
    // Fix smooth scrolling for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Add polyfill for smooth scrolling
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // Fix iOS scroll momentum
    const scrollableElements = document.querySelectorAll('.scroll-container, .modal-body');
    scrollableElements.forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
    });
}

// Fix common CSS issues
function applyCSSFixes() {
    const style = document.createElement('style');
    style.textContent = `
        /* Fix button focus styles */
        button:focus, .btn:focus {
            outline: 2px solid var(--primary-color, #0b5a3a);
            outline-offset: 2px;
        }
        
        /* Fix input validation styles */
        input.invalid, textarea.invalid, select.invalid {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        /* Fix RTL text alignment */
        .rtl-fix {
            text-align: right;
            direction: rtl;
        }
        
        /* Fix mobile touch targets */
        @media (max-width: 768px) {
            button, .btn, a {
                min-height: 44px;
                min-width: 44px;
            }
        }
        
        /* Fix print styles */
        @media print {
            .no-print {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Apply CSS fixes
applyCSSFixes();

// Fix browser-specific issues
function fixBrowserSpecificIssues() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Safari fixes
    if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) {
        document.body.classList.add('safari');
        
        // Fix date input in Safari
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('click', function() {
                this.showPicker && this.showPicker();
            });
        });
    }
    
    // Firefox fixes
    if (userAgent.indexOf('firefox') !== -1) {
        document.body.classList.add('firefox');
    }
    
    // IE fixes (for legacy support)
    if (userAgent.indexOf('trident') !== -1 || userAgent.indexOf('msie') !== -1) {
        document.body.classList.add('ie');
        
        // Add IE-specific fixes
        console.warn('Internet Explorer detected. Some features may not work properly.');
    }
}

fixBrowserSpecificIssues();

// Accessibility fixes
function fixAccessibility() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip links on Tab
        if (e.key === 'Tab' && e.target.tagName === 'BODY') {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            }
        }
    });
    
    // Improve screen reader support
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        img.alt = 'صورة';
    });
    
    // Add ARIA labels where missing
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(btn => {
        if (!btn.textContent.trim()) {
            btn.setAttribute('aria-label', 'زر');
        }
    });
}

fixAccessibility();

// Performance fixes
function fixPerformance() {
    // Debounce scroll events
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            // Trigger scroll-dependent functions
            document.dispatchEvent(new Event('debouncedScroll'));
        }, 10);
    });
    
    // Throttle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.dispatchEvent(new Event('debouncedResize'));
        }, 100);
    });
}

fixPerformance();

// Export fixes for manual application
window.commonFixes = {
    fixRTLLayout,
    fixMobileViewport,
    fixAudioAutoplay,
    fixFormValidation,
    fixImageLoading,
    fixScrollBehavior,
    fixAccessibility,
    applyCommonFixes
};