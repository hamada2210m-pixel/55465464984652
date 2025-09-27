// Advertisement JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAds();
});

function initializeAds() {
    // Setup ad containers
    setupAdContainers();
    
    // Initialize ad behaviors
    setupAdBehaviors();
    
    // Load ad content
    loadAdContent();
}

function setupAdContainers() {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        // Add close button if not present
        if (!container.querySelector('.ad-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'ad-close';
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', 'إغلاق الإعلان');
            container.appendChild(closeBtn);
            
            closeBtn.addEventListener('click', () => {
                closeAd(container);
            });
        }
    });
}

function setupAdBehaviors() {
    // Auto-show banner ads
    setTimeout(() => {
        showBannerAds();
    }, 2000);
    
    // Setup popup ads with user interaction
    document.addEventListener('click', showPopupAds, { once: true });
}

function loadAdContent() {
    // Load scholarship ads
    loadScholarshipAds();
    
    // Load faculty ads
    loadFacultyAds();
    
    // Load event ads
    loadEventAds();
}

function showBannerAds() {
    const banners = document.querySelectorAll('.ad-banner');
    banners.forEach((banner, index) => {
        setTimeout(() => {
            banner.style.display = 'block';
            banner.classList.add('slide-in');
        }, index * 1000);
    });
}

function showPopupAds() {
    // Only show popup if user hasn't dismissed it recently
    const lastDismissed = localStorage.getItem('adPopupDismissed');
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (!lastDismissed || (now - parseInt(lastDismissed)) > dayInMs) {
        setTimeout(() => {
            showScholarshipPopup();
        }, 5000);
    }
}

function showScholarshipPopup() {
    const popup = createAdPopup({
        title: 'فرصة منحة دراسية!',
        content: `
            <p>احصل على منحة دراسية في الجامعة الإسلامية بغزة</p>
            <ul>
                <li>تخصصات متنوعة</li>
                <li>هيئة تدريس متميزة</li>
                <li>بيئة أكاديمية محفزة</li>
            </ul>
            <p><strong>سجل الآن واحصل على خصم 25%!</strong></p>
        `,
        ctaText: 'سجل الآن',
        ctaLink: 'admission.html',
        image: 'assets/images/scholarship-banner.webp'
    });
    
    document.body.appendChild(popup);
}

function createAdPopup(options) {
    const popup = document.createElement('div');
    popup.className = 'ad-popup modal';
    popup.innerHTML = `
        <div class="modal-content ad-container">
            <button class="ad-close">×</button>
            ${options.image ? `<img src="${options.image}" alt="${options.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">` : ''}
            <div class="ad-title">${options.title}</div>
            <div class="ad-content">${options.content}</div>
            <div style="margin-top: 20px; text-align: center;">
                <a href="${options.ctaLink}" class="btn btn-primary" style="margin: 5px;">${options.ctaText}</a>
                <button class="btn btn-secondary ad-dismiss" style="margin: 5px;">لاحقاً</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = popup.querySelector('.ad-close');
    const dismissBtn = popup.querySelector('.ad-dismiss');
    
    closeBtn.addEventListener('click', () => {
        closeAdPopup(popup);
    });
    
    dismissBtn.addEventListener('click', () => {
        dismissAdPopup(popup);
    });
    
    // Close on background click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            dismissAdPopup(popup);
        }
    });
    
    return popup;
}

function closeAd(adElement) {
    adElement.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        adElement.style.display = 'none';
    }, 300);
}

function closeAdPopup(popup) {
    popup.style.display = 'none';
    popup.remove();
    localStorage.setItem('adPopupDismissed', Date.now().toString());
}

function dismissAdPopup(popup) {
    popup.style.display = 'none';
    popup.remove();
    // Don't set dismissed timestamp for dismiss, so ad can show again sooner
}

function loadScholarshipAds() {
    const scholarshipAds = [
        {
            title: 'منح دراسية للطلاب المتفوقين',
            content: 'احصل على منحة تصل إلى 50% من الرسوم الدراسية',
            link: 'grants.html',
            type: 'banner'
        },
        {
            title: 'برامج التبادل الطلابي',
            content: 'فرصة للدراسة في جامعات عالمية مرموقة',
            link: 'exchange.html',
            type: 'sidebar'
        }
    ];
    
    displayAds(scholarshipAds, '.scholarship-ads');
}

function loadFacultyAds() {
    const facultyAds = [
        {
            title: 'كلية الطب - تسجيل مفتوح',
            content: 'انضم إلى كلية الطب المتميزة',
            link: 'medicine.html',
            image: 'assets/images/medicine-ad.webp'
        },
        {
            title: 'كلية الهندسة',
            content: 'تخصصات هندسية متطورة',
            link: 'engineering.html',
            image: 'assets/images/engineering-ad.webp'
        }
    ];
    
    displayAds(facultyAds, '.faculty-ads');
}

function loadEventAds() {
    const eventAds = [
        {
            title: 'يوم الأبواب المفتوحة',
            content: 'زر الجامعة واكتشف كلياتها - الأحد القادم',
            link: '#events',
            urgent: true
        },
        {
            title: 'معرض الوظائف السنوي',
            content: 'التقِ بأصحاب العمل من كبرى الشركات',
            link: '#career-fair'
        }
    ];
    
    displayAds(eventAds, '.event-ads');
}

function displayAds(ads, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    ads.forEach(ad => {
        const adElement = createAdElement(ad);
        container.appendChild(adElement);
        
        // Add entrance animation
        setTimeout(() => {
            adElement.classList.add('fade-in');
        }, Math.random() * 1000);
    });
}

function createAdElement(ad) {
    const adElement = document.createElement('div');
    adElement.className = `ad-item ${ad.urgent ? 'urgent' : ''} ${ad.type || 'standard'}`;
    
    adElement.innerHTML = `
        ${ad.image ? `<img src="${ad.image}" alt="${ad.title}" class="ad-image">` : ''}
        <div class="ad-body">
            <h4 class="ad-title">${ad.title}</h4>
            <p class="ad-content">${ad.content}</p>
            <a href="${ad.link}" class="btn btn-primary ad-cta">اعرف المزيد</a>
        </div>
        <button class="ad-close">×</button>
    `;
    
    // Add close functionality
    const closeBtn = adElement.querySelector('.ad-close');
    closeBtn.addEventListener('click', () => {
        closeAd(adElement);
    });
    
    // Track click
    const ctaBtn = adElement.querySelector('.ad-cta');
    ctaBtn.addEventListener('click', () => {
        trackAdClick(ad.title);
    });
    
    return adElement;
}

function trackAdClick(adTitle) {
    // Simple analytics tracking
    try {
        const clicks = JSON.parse(localStorage.getItem('adClicks') || '{}');
        clicks[adTitle] = (clicks[adTitle] || 0) + 1;
        clicks.lastClick = Date.now();
        localStorage.setItem('adClicks', JSON.stringify(clicks));
        console.log('Ad clicked:', adTitle);
    } catch (error) {
        console.log('Error tracking ad click:', error);
    }
}

// Responsive ad management
function manageResponsiveAds() {
    const isMobile = window.innerWidth < 768;
    const ads = document.querySelectorAll('.ad-container');
    
    ads.forEach(ad => {
        if (isMobile && ad.classList.contains('desktop-only')) {
            ad.style.display = 'none';
        } else if (!isMobile && ad.classList.contains('mobile-only')) {
            ad.style.display = 'none';
        } else {
            ad.style.display = 'block';
        }
    });
}

// Handle responsive ads on resize
window.addEventListener('resize', manageResponsiveAds);
manageResponsiveAds();

// Ad rotation functionality
function rotateAds() {
    const rotatableAds = document.querySelectorAll('.ad-rotate');
    
    rotatableAds.forEach(container => {
        const ads = container.querySelectorAll('.ad-item');
        if (ads.length > 1) {
            let currentIndex = 0;
            
            setInterval(() => {
                ads[currentIndex].style.display = 'none';
                currentIndex = (currentIndex + 1) % ads.length;
                ads[currentIndex].style.display = 'block';
            }, 5000);
        }
    });
}

rotateAds();

// Export ad functions for external use
window.adManager = {
    showBannerAds,
    showPopupAds,
    closeAd,
    trackAdClick,
    createAdPopup,
    displayAds
};