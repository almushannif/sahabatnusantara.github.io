// ============================================================
// SLIDER PENGURUS - Minimal & Fast
// ============================================================
let currentSlide = 1;
let autoSlideInterval;

function changeSlide(n) {
    clearInterval(autoSlideInterval);
    showSlide(currentSlide += n);
    startAutoSlide();
}

function goToSlide(n) {
    clearInterval(autoSlideInterval);
    showSlide(currentSlide = n);
    startAutoSlide();
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) currentSlide = 1;
    if (n < 1) currentSlide = slides.length;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlide - 1]) {
        slides[currentSlide - 1].classList.add('active');
        dots[currentSlide - 1].classList.add('active');
    }
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 5000);
}

// ============================================================
// PRELOADER - Ultra Fast
// ============================================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const heroVideo = document.getElementById('hero-video');
    
    if (!preloader) return;

    const hidePreloader = () => {
        preloader.classList.add('preloader-slide-out');
        setTimeout(() => preloader.style.display = 'none', 700);
    };

    if (heroVideo) {
        // Trigger lebih cepat - saat video siap diputar
        if (heroVideo.readyState >= 3) {
            hidePreloader();
        } else {
            heroVideo.addEventListener('canplay', hidePreloader, { once: true });
        }
        // Fallback timeout - jangan terlalu lama
        setTimeout(hidePreloader, 5000);
    } else {
        hidePreloader();
    }
}

// ============================================================
// HEADER SCROLL EFFECT
// ============================================================
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    const headerLogo = document.getElementById('header-logo');
    const heroSection = document.getElementById('hero');
    
    if (!header || !headerLogo || !heroSection) return;

    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        // Header background
        if (scrollY > 50) {
            header.classList.add('bg-primary/95', 'backdrop-blur-md', 'shadow-lg', 'py-3', 'md:py-4');
            header.classList.remove('bg-transparent', 'py-5', 'md:py-8');
        } else {
            header.classList.remove('bg-primary/95', 'backdrop-blur-md', 'shadow-lg', 'py-3', 'md:py-4');
            header.classList.add('bg-transparent', 'py-5', 'md:py-8');
        }

        // Logo visibility
        if (scrollY > heroHeight - 100) {
            headerLogo.classList.remove('opacity-0', '-translate-y-full');
            headerLogo.classList.add('opacity-100', 'translate-y-0');
        } else {
            headerLogo.classList.add('opacity-0', '-translate-y-full');
            headerLogo.classList.remove('opacity-100', 'translate-y-0');
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const fullMenu = document.getElementById('full-menu');
    const menuItems = document.querySelectorAll('.menu-item');

    if (!menuToggle || !closeMenu || !fullMenu) return;

    function toggleMenu(show) {
        if (show) {
            fullMenu.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            fullMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            menuItems.forEach((item, i) => {
                item.style.transitionDelay = `${i * 50}ms`;
                item.classList.remove('translate-y-8', 'opacity-0');
            });
        } else {
            fullMenu.classList.add('opacity-0', 'pointer-events-none');
            fullMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            menuItems.forEach(item => item.classList.add('translate-y-8', 'opacity-0'));
            setTimeout(() => fullMenu.classList.add('hidden'), 300);
        }
    }

    menuToggle.addEventListener('click', () => toggleMenu(true));
    closeMenu.addEventListener('click', () => toggleMenu(false));
    
    // Close menu when clicking menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => toggleMenu(false));
    });
}

// ============================================================
// VIDEO AUDIO CONTROL
// ============================================================
function initVideoAudio() {
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const heroVideo = document.getElementById('hero-video');
    
    if (!audioToggle || !audioIcon || !heroVideo) return;

    audioToggle.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        audioIcon.className = heroVideo.muted 
            ? 'fa-solid fa-volume-xmark' 
            : 'fa-solid fa-volume-high';
    });
}

// ============================================================
// SCROLL REVEAL - Optimized dengan Intersection Observer
// ============================================================
function initScrollReveal() {
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return observer;
}

// ============================================================
// FETCH NEWS - Optimized dengan Error Handling
// ============================================================
function initNewsAPI(revealObserver) {
    const container = document.getElementById('news-container');
    if (!container) return;

    const apiUrl = 'https://berita.ikapmiintb.or.id/wp-json/wp/v2/posts?per_page=9&_embed';

    async function fetchNews() {
        try {
            // Show skeleton loaders
            const skeletons = Array.from({ length: 9 }).map((_, i) => `
                <div class="aspect-[4/3] rounded-[15px] overflow-hidden shadow-soft bg-slate-100 border border-slate-100 reveal" style="animation-delay: ${i * 50}ms">
                    <div class="skeleton-gradient h-full"></div>
                </div>
            `).join('');
            
            container.innerHTML = skeletons;

            // Fetch berita
            const response = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const posts = await response.json();
            if (!posts.length) throw new Error('No posts found');

            // Render berita
            const newsHTML = posts.map((post, idx) => {
                const title = post.title.rendered;
                const link = post.link;
                
                let imageUrl = 'https://ikapmiintb.or.id/wp-content/uploads/2026/06/baground.png';
                if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
                }

                let category = 'Berita';
                if (post._embedded?.['wp:term']?.[0]?.[0]?.name) {
                    category = post._embedded['wp:term'][0][0].name;
                }

                const date = new Date(post.date).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                });

                return `
                    <a href="${link}" target="_blank" rel="noopener noreferrer" 
                       class="aspect-[4/3] rounded-[15px] overflow-hidden shadow-soft group relative reveal focus:outline-none focus:ring-4 focus:ring-primary"
                       style="animation-delay: ${idx * 50}ms">
                        <img src="${imageUrl}" alt="${title}" loading="lazy" 
                             class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                             onerror="this.src='https://placehold.co/600x400/0973d6/ffffff?text=IKA+PMII+NTB'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div class="relative z-20 p-6 md:p-8 h-full flex flex-col justify-end">
                            <div class="flex justify-between items-center mb-3 text-sm">
                                <span class="text-accent font-bold tracking-widest uppercase">${category}</span>
                                <span class="text-white/70"><i class="fa-regular fa-clock mr-1"></i>${date}</span>
                            </div>
                            <h3 class="font-poppins font-bold text-[18px] text-white line-clamp-3 group-hover:text-accent transition-colors">${title}</h3>
                        </div>
                    </a>
                `;
            }).join('');

            container.innerHTML = newsHTML;
            document.querySelectorAll('.reveal', container).forEach(el => revealObserver.observe(el));

        } catch (error) {
            console.error('News fetch error:', error);
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center text-center py-16 bg-surface border border-slate-100 rounded-[15px]">
                    <div class="w-20 h-20 bg-slate-100 rounded-[15px] flex items-center justify-center mb-6">
                        <i class="fa-solid fa-tower-broadcast text-[30px] text-slate-400"></i>
                    </div>
                    <h3 class="font-poppins font-bold text-[20px] text-textmain mb-2">Gagal Memuat Berita</h3>
                    <p class="font-montserrat font-medium text-[14px] text-textmain mb-8">Mohon maaf, kami tidak dapat terhubung ke server berita saat ini.</p>
                    <button onclick="location.reload()" class="bg-primary text-white px-8 py-3 rounded-[15px] font-poppins font-bold text-[14px] hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all">
                        <i class="fa-solid fa-rotate-right mr-2"></i> Coba Muat Ulang
                    </button>
                </div>
            `;
        }
    }

    // Fetch news on DOMContentLoaded
    fetchNews();
}

// ============================================================
// MAIN INITIALIZATION - DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader first (fastest)
    initPreloader();

    // Initialize other features
    initHeaderScroll();
    initMenu();
    initVideoAudio();
    
    // Initialize slider
    showSlide(currentSlide);
    startAutoSlide();

    // Initialize scroll reveal
    const revealObserver = initScrollReveal();

    // Initialize news API with observer
    initNewsAPI(revealObserver);
});

// ============================================================
// OPTIMIZE IMAGES - Lazy Loading
// ============================================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}
