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
