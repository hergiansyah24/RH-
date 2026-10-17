// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.length < 2) return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// Animated counters
const stats = document.querySelectorAll('[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            let count = 0;
            const speed = 2000 / target;
            const updateCount = () => {
                if (count < target) {
                    count++;
                    entry.target.innerText = count;
                    setTimeout(updateCount, speed);
                } else {
                    entry.target.innerText = target + '+';
                }
            };
            updateCount();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 1 });
stats.forEach(stat => statsObserver.observe(stat));

// Interactive design/code hero image reveal
// Move cursor right -> reveal more of the "code" layer
// Move cursor left -> reveal more of the "design" layer
const heroStage = document.getElementById('hero-stage');
const codeLayer = document.getElementById('layer-code');

function updateSplit(clientX) {
    if (!heroStage || !codeLayer) return;
    const rect = heroStage.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    codeLayer.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
}

if (heroStage) {
    heroStage.addEventListener('mousemove', (e) => updateSplit(e.clientX));
    heroStage.addEventListener('mouseleave', () => {
        codeLayer.style.clipPath = 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';
    });
    heroStage.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) updateSplit(e.touches[0].clientX);
    }, { passive: true });
}

// Mark active nav link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ===== Mobile bottom navigation (tab bar) =====
// Dibuat lewat JS supaya cukup satu tempat untuk semua halaman.
(function () {
    const items = [
        { href: 'about.html', label: 'about',
          icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>' },
        { href: 'learn.html', label: 'learn',
          icon: '<path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/>' },
        { href: 'portfolio.html', label: 'portfolio',
          icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M3 13h18"/>' },
        { href: 'blog.html', label: 'blog',
          icon: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>' },
        { href: 'contact.html', label: 'contact',
          icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>' }
    ];

    const page = window.location.pathname.split('/').pop() || 'index.html';

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('aria-label', 'Main navigation');

    nav.innerHTML = items.map(it => `
        <a class="bottom-link${it.href === page ? ' active' : ''}" href="${it.href}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${it.icon}</svg>
            <span>${it.label}</span>
        </a>`).join('');

    document.body.appendChild(nav);
})();
