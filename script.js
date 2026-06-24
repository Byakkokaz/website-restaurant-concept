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

if (document.body) {
    document.body.appendChild(loader);
} else {
    document.documentElement.appendChild(loader);
}

function hideLoader() {
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 600); 
    }, 1500); 
}

if (document.readyState === 'complete') {
    hideLoader();
} else {
    window.addEventListener('load', hideLoader);
}

function initInteractions() {
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const navLinks = document.querySelectorAll('nav ul li a, .footer-link ul li a');
    
    const sections = [
        { el: document.querySelector('.intro-section'), name: 'beranda' },
        { el: document.querySelector('.about-section'), name: 'tentang' },
        { el: document.querySelector('.menu-section'), name: 'menu' },
        { el: document.querySelector('.order-section'), name: 'pesan' },
        { el: document.querySelector('footer'), name: 'kontak' }
    ];

    let isScrolling = false;
    let scrollTimeout = null;

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

                   
                    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('current'));
                    
                    if (this.closest('nav')) {
                        this.classList.add('current');
                    } else {
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

    window.addEventListener('scroll', () => {
        if (isScrolling) return; 
        
        let currentSection = 'beranda';
        const scrollPos = window.scrollY + 220; 

        
        sections.forEach(sec => {
            if (sec.el && scrollPos >= sec.el.offsetTop) {
                currentSection = sec.name;
            }
        });

   
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


function initAll() {
    initInteractions();
    initBackToTop();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

/* ============================================================
   BACK TO TOP — Scroll Progress Ring
   ============================================================ */
function initBackToTop() {
    const btn    = document.getElementById('back-to-top');
    const circle = document.getElementById('btt-circle');

    if (!btn || !circle) return;

    // SVG circle circumference: 2π × r = 2π × 15.9155 ≈ 100
    const CIRCUMFERENCE = 100;

    function updateScrollProgress() {
        const scrollTop    = window.scrollY || document.documentElement.scrollTop;
        const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        const scrollRatio  = docHeight > 0 ? scrollTop / docHeight : 0;

        // Show / hide button (appears after 300px)
        if (scrollTop > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
            btn.classList.remove('at-bottom');
        }

        // Update circular progress ring (dashoffset goes from 100 → 0 as you scroll down)
        const offset = CIRCUMFERENCE - (scrollRatio * CIRCUMFERENCE);
        circle.style.strokeDashoffset = offset.toFixed(2);

        // Pulse effect when near the very bottom (≥ 95 %)
        if (scrollRatio >= 0.95) {
            btn.classList.add('at-bottom');
        } else {
            btn.classList.remove('at-bottom');
        }
    }

    // Click → smooth scroll to top
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    
    // Initialize on load
    updateScrollProgress();
}
