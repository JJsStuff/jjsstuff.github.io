/**
 * JJ's Stuff – Main TypeScript
 * Handles: i18n, scroll animations, mobile nav, active nav state
 */

// --- Types ---
type Translations = Record<string, Record<string, string>>;

// --- i18n Module ---
function getLocaleBase(): string {
    // Detect base path for locale files
    const lang = document.documentElement.lang || 'de';
    // If we're in /en/, locale files are at ../locales/
    // If we're at root, locale files are at locales/
    const isSubdir = window.location.pathname.includes('/en/');
    return isSubdir ? '../locales/' : 'locales/';
}

async function loadTranslations(): Promise<void> {
    const lang = document.documentElement.lang || 'de';
    const base = getLocaleBase();

    try {
        const response = await fetch(`${base}${lang}.json`);
        if (!response.ok) return;
        const translations: Translations = await response.json();
        applyTranslations(translations);
    } catch (e) {
        console.warn(`[i18n] Could not load locale: ${lang}`, e);
    }
}

function resolveKey(obj: Translations, key: string): string | undefined {
    const parts = key.split('.');
    let current: unknown = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
            current = (current as Record<string, unknown>)[part];
        } else {
            return undefined;
        }
    }
    return typeof current === 'string' ? current : undefined;
}

function applyTranslations(translations: Translations): void {
    // data-i18n → textContent
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const value = resolveKey(translations, key);
        if (value) el.textContent = value;
    });

    // data-i18n-html → innerHTML (for strings with <strong> etc.)
    document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (!key) return;
        const value = resolveKey(translations, key);
        if (value) el.innerHTML = value;
    });

    // data-i18n-href → href attribute
    document.querySelectorAll<HTMLElement>('[data-i18n-href]').forEach((el) => {
        const key = el.getAttribute('data-i18n-href');
        if (!key) return;
        const value = resolveKey(translations, key);
        if (value) el.setAttribute('href', value);
    });

    // data-i18n-title → title attribute
    document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
        const key = el.getAttribute('data-i18n-title');
        if (!key) return;
        const value = resolveKey(translations, key);
        if (value) el.setAttribute('title', value);
    });

    // data-i18n-aria → aria-label attribute
    document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
        const key = el.getAttribute('data-i18n-aria');
        if (!key) return;
        const value = resolveKey(translations, key);
        if (value) el.setAttribute('aria-label', value);
    });
}

// --- Scroll-based fade-in animations (IntersectionObserver) ---
function initFadeAnimations(): void {
    const fadeElements = document.querySelectorAll<HTMLElement>('.fade-in');

    if (!fadeElements.length) return;

    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    fadeElements.forEach((el) => observer.observe(el));
}

// --- Mobile navigation toggle ---
function initMobileNav(): void {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    menu.querySelectorAll<HTMLAnchorElement>('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as Node;
        if (!menu.contains(target) && !toggle.contains(target)) {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// --- Active nav state based on scroll position ---
function initActiveNavState(): void {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav__link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px',
        }
    );

    sections.forEach((section) => observer.observe(section));
}

// --- Nav background on scroll ---
function initNavScroll(): void {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                nav.classList.toggle('nav--scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });
}

// --- Mesh parallax on scroll ---
function initMeshParallax(): void {
    const mesh = document.querySelector<HTMLElement>('.mesh');
    if (!mesh) return;

    const PARALLAX_FACTOR = 0.2; // 20% of scroll speed → blobs feel far away
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

// --- Initialize everything ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    initFadeAnimations();
    initMobileNav();
    initActiveNavState();
    initNavScroll();
    initMeshParallax();
});
