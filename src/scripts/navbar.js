// src/scripts/navbar.js
// GlamBook Navbar functionality for robust hydration on all pages


function initNavbarMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBlogToggle = document.getElementById('mobile-blog-toggle');
    const mobileBlogSubmenu = document.getElementById('mobile-blog-submenu');

    // Función para abrir el menú móvil
    const openMobileMenu = () => {
        mobileMenu?.classList.remove('opacity-0', 'invisible');
        const menuPanel = mobileMenu?.querySelector('.transform');
        menuPanel?.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    };

    // Función para cerrar el menú móvil
    const closeMobileMenu = () => {
        const menuPanel = mobileMenu?.querySelector('.transform');
        menuPanel?.classList.add('translate-x-full');
        setTimeout(() => {
            mobileMenu?.classList.add('opacity-0', 'invisible');
            document.body.style.overflow = '';
        }, 300);
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = (e) => { e.preventDefault(); openMobileMenu(); };
        mobileMenuBtn.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMobileMenu();
            }
        };
    }
    if (closeMenuBtn) closeMenuBtn.onclick = (e) => { e.preventDefault(); closeMobileMenu(); };
    if (mobileMenu) {
        mobileMenu.onclick = (e) => { if (e.target === mobileMenu) closeMobileMenu(); };
        mobileMenu.ontouchmove = (e) => {
            const target = e.target;
            if (target) {
                const scrollableElement = target.closest('.overflow-y-auto');
                if (!scrollableElement) {
                    e.preventDefault();
                }
            }
        };
        // Cerrar menú al hacer clic en enlaces (excepto toggle de blog)
        const menuLinks = mobileMenu.querySelectorAll('a:not(#mobile-blog-toggle)');
        menuLinks.forEach(link => {
            link.onclick = () => closeMobileMenu();
        });
    }
    if (mobileBlogToggle && mobileBlogSubmenu) {
        mobileBlogToggle.onclick = (e) => {
            e.preventDefault();
            const isHidden = mobileBlogSubmenu.classList.contains('hidden');
            const arrow = mobileBlogToggle.querySelector('svg');
            if (isHidden) {
                mobileBlogSubmenu.classList.remove('hidden');
                arrow?.classList.add('rotate-180');
                setTimeout(() => {
                    mobileBlogSubmenu.style.opacity = '1';
                    mobileBlogSubmenu.style.transform = 'translateY(0)';
                }, 10);
            } else {
                mobileBlogSubmenu.style.opacity = '0';
                mobileBlogSubmenu.style.transform = 'translateY(-10px)';
                arrow?.classList.remove('rotate-180');
                setTimeout(() => {
                    mobileBlogSubmenu.classList.add('hidden');
                }, 200);
            }
        };
        mobileBlogSubmenu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }
    document.onkeydown = (e) => {
        if (e.key === 'Escape' && !mobileMenu?.classList.contains('opacity-0')) {
            closeMobileMenu();
        }
    };
    // CSS Animations (optional, can be moved to global CSS)
    if (!document.getElementById('navbar-anim-styles')) {
        const additionalStyles = document.createElement('style');
        additionalStyles.id = 'navbar-anim-styles';
        additionalStyles.textContent = `
            #mobile-menu { transition: opacity 0.3s ease, visibility 0.3s ease; }
            #mobile-menu .transform { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            #mobile-menu-btn { transition: all 0.2s ease; }
            #mobile-menu-btn:hover { background-color: rgba(147, 51, 234, 0.1); transform: scale(1.05); }
            .nav-icon { transition: transform 0.2s ease, color 0.2s ease; }
            @supports not (backdrop-filter: blur(12px)) {
                #mobile-menu { background-color: rgba(0, 0, 0, 0.8) !important; }
                #mobile-menu > div { background-color: rgba(255, 255, 255, 0.98) !important; }
            }
            html { scroll-behavior: smooth; }
            .nav-link:focus { outline: 2px solid #8B5CF6; outline-offset: 2px; border-radius: 4px; }
        `;
        document.head.appendChild(additionalStyles);
    }
}

// Init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarMenu);
} else {
    initNavbarMenu();
}

// Re-init on client-side navigation (Astro SPA mode)
window.addEventListener('popstate', () => {
    setTimeout(initNavbarMenu, 50);
});
