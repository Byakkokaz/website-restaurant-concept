// 1. Dynamic Page Loader - Executed IMMEDIATELY when the script runs
const loader = document.createElement('div');
loader.className = 'page-loader';
loader.innerHTML = `
    <div class="loader-body">
        <div class="pan-loader">
            <div class="loader-food">
                <div class="food-item item-1"></div>
                <div class="food-item item-2"></div>
                <div class="food-item item-3"></div>
            </div>
            <div class="loader-pan">
                <div class="pan-bowl"></div>
                <div class="pan-handle"></div>
            </div>
            <div class="loader-fire">
                <div class="fire-flame flame-1"></div>
                <div class="fire-flame flame-2"></div>
                <div class="fire-flame flame-3"></div>
            </div>
        </div>
        <div class="loader-text">Menyiapkan Hidangan Lezat...</div>
    </div>
`;

// Extremely safe append: falls back to documentElement if body is temporarily null during early parsing
if (document.body) {
    document.body.appendChild(loader);
} else {
    document.documentElement.appendChild(loader);
}

// Fade out loader once the whole page is fully loaded
function hideLoader() {
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 600); // matches CSS transition duration
    }, 1500); // Set to 1.5 seconds minimum animation duration
}

if (document.readyState === 'complete') {
    hideLoader();
} else {
    window.addEventListener('load', hideLoader);
}

// 2. Initialize Website Interactions (Scroll Spy, Smooth Scroll, etc.)
function initInteractions() {
    // Set copyright year
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Navigation links
    const navLinks = document.querySelectorAll('nav ul li a, .footer-link ul li a');
    
    // DOM-ordered target sections (Beranda, Tentang, Menu, Pesan, Kontak)
    const sections = [
        { el: document.querySelector('.intro-section'), name: 'beranda' },
        { el: document.querySelector('.about-section'), name: 'tentang' },
        { el: document.querySelector('.menu-section'), name: 'menu' },
        { el: document.querySelector('.order-section'), name: 'pesan' },
        { el: document.querySelector('footer'), name: 'kontak' }
    ];

    let isScrolling = false;
    let scrollTimeout = null;

    // Smooth scroll event handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') {
                e.preventDefault();
                const linkText = this.textContent.trim().toLowerCase();
                let targetElement = null;

                if (linkText === 'beranda') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (linkText === 'menu') {
                    targetElement = document.querySelector('.menu-section');
                } else if (linkText === 'pesan') {
                    targetElement = document.querySelector('.order-section');
                } else if (linkText === 'tentang') {
                    targetElement = document.querySelector('.about-section');
                } else if (linkText === 'kontak') {
                    targetElement = document.querySelector('footer');
                }

                if (targetElement || linkText === 'beranda') {
                    isScrolling = true;
                    if (scrollTimeout) clearTimeout(scrollTimeout);

                    // Update active state class immediately
                    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('current'));
                    
                    if (this.closest('nav')) {
                        this.classList.add('current');
                    } else {
                        // Find matching nav link for footer link click
                        document.querySelectorAll('nav ul li a').forEach(a => {
                            if (a.textContent.trim().toLowerCase() === linkText) {
                                a.classList.add('current');
                            }
                        });
                    }

                    if (linkText === 'beranda') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }

                    // Re-enable scroll spy after scrolling finishes
                    scrollTimeout = setTimeout(() => {
                        isScrolling = false;
                    }, 1000);
                }
            }
        });
    });

    // Scroll Spy (Dynamic navigation highlight on scroll)
    window.addEventListener('scroll', () => {
        if (isScrolling) return; // Ignore scroll-spy checks when scrolling is initiated by clicking links
        
        let currentSection = 'beranda';
        const scrollPos = window.scrollY + 220; // offset for sticky header height & buffer

        // Find current section based on offsetTop position
        sections.forEach(sec => {
            if (sec.el && scrollPos >= sec.el.offsetTop) {
                currentSection = sec.name;
            }
        });

        // Set the active navigation styling
        document.querySelectorAll('nav ul li a').forEach(a => {
            const text = a.textContent.trim().toLowerCase();
            if (text === currentSection) {
                a.classList.add('current');
            } else {
                a.classList.remove('current');
            }
        });
    });
}

// Run interactions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractions);
} else {
    initInteractions();
}
