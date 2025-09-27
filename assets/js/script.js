// Main Script for Islamic University of Gaza website
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('IUG Website initialized');
    
    // Setup global variables
    setupGlobalVariables();
    
    // Initialize components
    initializeComponents();
    
    // Setup event listeners
    setupGlobalEventListeners();
    
    // Load saved data
    loadSavedData();
}

function setupGlobalVariables() {
    // Define global variables
    window.IUG = {
        version: '1.0.0',
        name: 'الجامعة الإسلامية بغزة',
        audioEnabled: true,
        currentUser: null,
        gameProgress: null
    };
}

function initializeComponents() {
    // Initialize modals
    initializeModals();
    
    // Initialize forms
    initializeForms();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize audio
    initializeAudio();
}

function setupGlobalEventListeners() {
    // Handle form submissions
    document.addEventListener('submit', handleFormSubmission);
    
    // Handle clicks on interactive elements
    document.addEventListener('click', handleGlobalClick);
    
    // Handle keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
}

function handleFormSubmission(event) {
    const form = event.target;
    if (form.tagName !== 'FORM') return;
    
    // Add validation
    if (!validateForm(form)) {
        event.preventDefault();
        return false;
    }
    
    // Show loading state
    showLoadingState(form);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'هذا الحقل مطلوب');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const error = document.createElement('div');
    error.className = 'field-error';
    error.style.color = '#dc3545';
    error.style.fontSize = '14px';
    error.style.marginTop = '5px';
    error.textContent = message;
    
    field.parentNode.appendChild(error);
    field.focus();
}

function showLoadingState(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري التحميل...';
    }
}

function handleGlobalClick(event) {
    const target = event.target;
    
    // Handle modal triggers
    if (target.dataset.modal) {
        showModal(target.dataset.modal);
        event.preventDefault();
    }
    
    // Handle external links
    if (target.tagName === 'A' && target.href && target.href.startsWith('http')) {
        target.setAttribute('target', '_blank');
        target.setAttribute('rel', 'noopener noreferrer');
    }
}

function handleKeyboardNavigation(event) {
    // Handle escape key for modals
    if (event.key === 'Escape') {
        closeAllModals();
    }
    
    // Handle enter key for buttons
    if (event.key === 'Enter' && event.target.classList.contains('btn')) {
        event.target.click();
    }
}

function handleWindowResize() {
    // Adjust layout for mobile devices
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile-view', isMobile);
}

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        // Add close button functionality
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal.id));
        }
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
        document.body.style.overflow = 'hidden';
        playGlobalSound('transition');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    });
    document.body.style.overflow = 'auto';
}

function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Add CSRF protection if needed
        addCSRFToken(form);
        
        // Setup field validation
        setupFieldValidation(form);
    });
}

function addCSRFToken(form) {
    // Add CSRF token if needed for secure forms
    // This is a placeholder for security implementation
}

function setupFieldValidation(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

function validateField(field) {
    // Basic field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'هذا الحقل مطلوب');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }
    }
    
    return true;
}

function clearFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

function initializeNavigation() {
    // Setup navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function handleNavigation(event) {
    const link = event.target;
    const href = link.getAttribute('href');
    
    // Handle internal navigation
    if (href && href.startsWith('#')) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function initializeAudio() {
    // Setup global audio functionality
    window.globalAudio = {
        correct: document.getElementById('correct-sound'),
        incorrect: document.getElementById('incorrect-sound'),
        transition: document.getElementById('transition-sound'),
        guide: document.getElementById('guide-appears-sound'),
        badge: document.getElementById('badge-sound')
    };
}

function playGlobalSound(soundName) {
    try {
        if (!window.IUG.audioEnabled) return;
        
        const audio = window.globalAudio && window.globalAudio[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    } catch (error) {
        console.log('Global sound error:', error);
    }
}

function loadSavedData() {
    // Load user preferences and game progress
    try {
        const savedProgress = localStorage.getItem('iugGameProgress');
        if (savedProgress) {
            window.IUG.gameProgress = JSON.parse(savedProgress);
        }
        
        const audioPreference = localStorage.getItem('iugAudioEnabled');
        if (audioPreference !== null) {
            window.IUG.audioEnabled = audioPreference === 'true';
        }
    } catch (error) {
        console.log('Error loading saved data:', error);
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log('Error saving data:', error);
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        color: white;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export global functions
window.IUGApp = {
    showModal,
    closeModal,
    playGlobalSound,
    showNotification,
    saveData,
    validateForm
};