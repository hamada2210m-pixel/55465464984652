// Faculty Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page components
    initializeFacultyPage();
    setupEventListeners();
    loadFacultyData();
});

function initializeFacultyPage() {
    // Add any page-specific initialization
    console.log('Faculty page initialized');
    
    // Setup audio elements
    setupAudioElements();
    
    // Initialize interactive elements
    initializeInteractiveElements();
}

function setupEventListeners() {
    // Add event listeners for interactive elements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', handleButtonClick);
    });
    
    // Add scroll effect
    window.addEventListener('scroll', handleScroll);
}

function handleButtonClick(event) {
    const button = event.target;
    
    // Add click effect
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // Play sound if available
    playSound('correct');
}

function handleScroll() {
    // Add scroll effects
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
}

function loadFacultyData() {
    // Load and display faculty-specific data
    const facultyInfo = getFacultyInfo();
    displayFacultyInfo(facultyInfo);
}

function getFacultyInfo() {
    // Return default faculty information
    return {
        name: 'الكلية',
        description: 'معلومات الكلية',
        departments: ['القسم الأول', 'القسم الثاني'],
        programs: ['البرنامج الأول', 'البرنامج الثاني']
    };
}

function displayFacultyInfo(info) {
    // Display faculty information on the page
    const nameElement = document.querySelector('.faculty-name');
    const descElement = document.querySelector('.faculty-description');
    
    if (nameElement) nameElement.textContent = info.name;
    if (descElement) descElement.textContent = info.description;
}

function setupAudioElements() {
    // Setup audio elements for page interactions
    const audioElements = {
        correct: document.getElementById('correct-sound'),
        incorrect: document.getElementById('incorrect-sound'),
        transition: document.getElementById('transition-sound'),
        guide: document.getElementById('guide-appears-sound'),
        badge: document.getElementById('badge-sound')
    };
    
    // Store audio elements globally
    window.audioElements = audioElements;
}

function playSound(soundName) {
    try {
        const audio = window.audioElements && window.audioElements[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    } catch (error) {
        console.log('Sound playback error:', error);
    }
}

function initializeInteractiveElements() {
    // Initialize any interactive elements specific to faculty pages
    const quizElements = document.querySelectorAll('.quiz-question');
    quizElements.forEach(initializeQuizElement);
    
    // Initialize tabs if present
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(initializeTab);
}

function initializeQuizElement(element) {
    const choices = element.querySelectorAll('.choice');
    choices.forEach(choice => {
        choice.addEventListener('click', function() {
            // Remove previous selections
            choices.forEach(c => c.classList.remove('selected'));
            // Add selection to clicked choice
            this.classList.add('selected');
            playSound('correct');
        });
    });
}

function initializeTab(tab) {
    tab.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const targetElement = document.getElementById(targetId);
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(t => {
            t.classList.remove('active');
        });
        
        // Show target content and activate tab
        if (targetElement) {
            targetElement.classList.add('active');
        }
        this.classList.add('active');
        
        playSound('transition');
    });
}

// Export functions for global use
window.facultyPage = {
    playSound,
    initializeFacultyPage,
    setupEventListeners
};