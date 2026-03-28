/* ============================================
   Digital Atelier — Global Scripts
   ============================================ */

/**
 * Mobile Menu Toggle
 * Opens/closes the slide-out drawer and backdrop overlay.
 */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');

    menu.classList.toggle('open');
    overlay.classList.toggle('open');

    // Lock body scroll when menu is open
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

/**
 * Scroll Reveal Observer
 * Fades-in elements with the .reveal or .reveal-stagger class
 * when they enter the viewport.
 */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        observer.observe(el);
    });
});
