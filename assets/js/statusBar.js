// Status Bar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeStatusBar();
});

function initializeStatusBar() {
    // Check if status bar placeholder exists
    const placeholder = document.getElementById('status-bar-placeholder');
    if (!placeholder) return;
    
    // Create status bar element
    const statusBar = createStatusBar();
    
    // Insert status bar
    placeholder.appendChild(statusBar);
    
    // Add body class for spacing
    document.body.classList.add('has-status-bar');
    
    // Start status updates
    startStatusUpdates();
}

function createStatusBar() {
    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    statusBar.innerHTML = `
        <div class="status-bar-text" id="status-text">
            مرحباً بك في الجامعة الإسلامية بغزة
        </div>
    `;
    return statusBar;
}

function startStatusUpdates() {
    const statusText = document.getElementById('status-text');
    if (!statusText) return;
    
    const messages = [
        'مرحباً بك في الجامعة الإسلامية بغزة',
        'اكتشف كلياتنا المتميزة',
        'انضم إلى رحلة التعلم معنا',
        'جامعة رائدة في التعليم العالي',
        'نحو مستقبل أكاديمي مشرق'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % messages.length;
        statusText.textContent = messages[currentIndex];
    }, 5000);
}

function updateStatusBar(message) {
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.textContent = message;
    }
}

// Export function for global use
window.statusBar = {
    updateStatusBar
};