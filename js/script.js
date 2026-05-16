// ===================================
// Hamburger Menu Toggle
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// Sticky Navbar on Scroll
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Counter Animation
// ===================================
const counters = document.querySelectorAll('.counter');
const speed = 200;

const runCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / speed;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => runCounter(counter), 1);
    } else {
        counter.innerText = target;
    }
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            runCounter(counter);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ===================================
// Form Validation & Submission
// ===================================
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.phone || !data.date || !data.time || !data['case-type']) {
            showNotification('برجاء ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // Phone validation (Egyptian numbers)
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('برجاء إدخال رقم هاتف صحيح', 'error');
            return;
        }
        
        // Email validation (if provided)
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('برجاء إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
        }
        
        // Date validation (must be future date)
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('برجاء اختيار تاريخ مستقبلي', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Success
            showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريباً', 'success');
            this.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Optional: Send to WhatsApp
            const message = `
مرحباً، أرغب في حجز استشارة قانونية

*الاسم:* ${data.name}
*الهاتف:* ${data.phone}
*البريد الإلكتروني:* ${data.email || 'غير متوفر'}
*التاريخ المفضل:* ${data.date}
*الوقت المفضل:* ${data.time}
*نوع القضية:* ${getCaseTypeArabic(data['case-type'])}
*التفاصيل:* ${data.message || 'لا توجد تفاصيل إضافية'}
            `.trim();
            
            // Uncomment to enable WhatsApp redirect
            // const whatsappUrl = `https://wa.me/201003665319?text=${encodeURIComponent(message)}`;
            // window.open(whatsappUrl, '_blank');
            
        }, 1500);
    });
}

// Helper function to get case type in Arabic
function getCaseTypeArabic(caseType) {
    const types = {
        'criminal': 'قضايا جنائية',
        'civil': 'قضايا مدنية',
        'family': 'أحوال شخصية',
        'commercial': 'قضايا تجارية',
        'contracts': 'صياغة عقود',
        'consultation': 'استشارة عامة',
        'other': 'أخرى'
    };
    return types[caseType] || caseType;
}

// ===================================
// Contact Form (if exists on contact page)
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.message) {
            showNotification('برجاء ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('برجاء إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('تم إرسال رسالتك بنجاح! سنرد عليك قريباً', 'success');
            this.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: #fff;
                padding: 20px 25px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                min-width: 300px;
                max-width: 500px;
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-success {
                border-right: 4px solid #10b981;
            }
            
            .notification-success i {
                color: #10b981;
                font-size: 1.5rem;
            }
            
            .notification-error {
                border-right: 4px solid #ef4444;
            }
            
            .notification-error i {
                color: #ef4444;
                font-size: 1.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            
            .notification-close:hover {
                color: #000;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// ===================================
// Active Navigation Link
// ===================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    }
});

// ===================================
// Initialize AOS (Animate On Scroll)
// ===================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
}

// ===================================
// Back to Top Button
// ===================================
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.setAttribute('aria-label', 'العودة للأعلى');
document.body.appendChild(backToTopBtn);

// Add styles
const backToTopStyle = document.createElement('style');
backToTopStyle.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 110px;
        left: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .back-to-top.show {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top:hover {
        background: var(--dark-color);
        transform: translateY(-5px);
    }
    
    @media (max-width: 768px) {
        .back-to-top {
            bottom: 90px;
            left: 20px;
            width: 45px;
            height: 45px;
            font-size: 1rem;
        }
    }
`;
document.head.appendChild(backToTopStyle);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Lazy Loading for Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Prevent Form Resubmission
// ===================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ===================================
// Print Page Functionality
// ===================================
function printPage() {
    window.print();
}

// ===================================
// Copy to Clipboard
// ===================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم النسخ بنجاح', 'success');
    }).catch(() => {
        showNotification('فشل النسخ', 'error');
    });
}

// ===================================
// FAQ Accordion (for FAQ page)
// ===================================
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===================================
// Loading Screen
// ===================================
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// ===================================
// Service Worker Registration (PWA)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===================================
// Console Welcome Message
// ===================================
console.log('%c مرحباً بك في موقع المحامي عبد الله عادل النشار', 'color: #1a237e; font-size: 20px; font-weight: bold;');
console.log('%c للتواصل: 01003665319', 'color: #d4af37; font-size: 14px;');