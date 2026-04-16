function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
    });
    fadeElements.forEach((el) => observer.observe(el));
}
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu)
        return;
    function closeMenu() {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
            const firstLink = menu.querySelector('.nav__link');
            if (firstLink)
                firstLink.focus();
        }
    });
    menu.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (!menu.classList.contains('open'))
            return;
        if (e.key === 'Escape') {
            closeMenu();
            toggle.focus();
            return;
        }
        if (e.key === 'Tab') {
            const focusable = menu.querySelectorAll('a, button');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}
function initActiveNavState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    if (!sections.length || !navLinks.length)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px',
    });
    sections.forEach((section) => observer.observe(section));
}
function initMeshParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
    const mesh = document.querySelector('.mesh');
    if (!mesh)
        return;
    const PARALLAX_FACTOR = 0.2;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                mesh.style.transform = `translateY(${window.scrollY * PARALLAX_FACTOR}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
document.addEventListener('DOMContentLoaded', () => {
    initFadeAnimations();
    initMobileNav();
    initActiveNavState();
    initMeshParallax();
});
