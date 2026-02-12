function getLocaleBase() {
    const isSubdir = window.location.pathname.includes('/en/');
    return isSubdir ? '../locales/' : 'locales/';
}
async function loadTranslations() {
    const lang = document.documentElement.lang || 'de';
    const base = getLocaleBase();
    try {
        const response = await fetch(`${base}${lang}.json`);
        if (!response.ok)
            return;
        const translations = await response.json();
        applyTranslations(translations);
    }
    catch (e) {
        console.warn(`[i18n] Could not load locale: ${lang}`, e);
    }
}
function resolveKey(obj, key) {
    const parts = key.split('.');
    let current = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        }
        else {
            return undefined;
        }
    }
    return typeof current === 'string' ? current : undefined;
}
function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key)
            return;
        const value = resolveKey(translations, key);
        if (value)
            el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (!key)
            return;
        const value = resolveKey(translations, key);
        if (value)
            el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-href]').forEach((el) => {
        const key = el.getAttribute('data-i18n-href');
        if (!key)
            return;
        const value = resolveKey(translations, key);
        if (value)
            el.setAttribute('href', value);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const key = el.getAttribute('data-i18n-title');
        if (!key)
            return;
        const value = resolveKey(translations, key);
        if (value)
            el.setAttribute('title', value);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
        const key = el.getAttribute('data-i18n-aria');
        if (!key)
            return;
        const value = resolveKey(translations, key);
        if (value)
            el.setAttribute('aria-label', value);
    });
}
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
    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!menu.contains(target) && !toggle.contains(target)) {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
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
function updateCopyrightYear() {
    const el = document.querySelector('[data-i18n="footer.copy"]');
    if (!el || !el.textContent)
        return;
    const year = new Date().getFullYear();
    el.textContent = el.textContent.replace(/© \d{4}/, `© ${year}`);
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
                const scrollY = window.scrollY;
                mesh.style.transform = `translateY(${scrollY * PARALLAX_FACTOR}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    initFadeAnimations();
    initMobileNav();
    initActiveNavState();
    initMeshParallax();
    updateCopyrightYear();
});
export {};
