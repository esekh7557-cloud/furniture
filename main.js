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

    if (!menu || !overlay) {
        return;
    }

    menu.classList.toggle('open');
    overlay.classList.toggle('open');

    // Lock body scroll when menu is open
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');

    if (!menu || !overlay) {
        return;
    }

    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function openMailto(subject, body) {
    const mailtoUrl = new URL('mailto:hello@digitalatelier.design');
    mailtoUrl.searchParams.set('subject', subject);
    mailtoUrl.searchParams.set('body', body);
    window.location.href = mailtoUrl.toString();
}

function setupRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach((element) => {
        observer.observe(element);
    });
}

function setupShareButtons() {
    document.querySelectorAll('[data-share-url]').forEach((button) => {
        button.addEventListener('click', async () => {
            const url = button.dataset.shareUrl || window.location.href;
            const title = button.dataset.shareTitle || document.title;
            const text = button.dataset.shareText || 'Explore Digital Atelier.';

            if (navigator.share) {
                try {
                    await navigator.share({ title, text, url });
                    return;
                } catch (error) {
                    if (error.name === 'AbortError') {
                        return;
                    }
                }
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                button.dataset.copied = 'true';
                setTimeout(() => {
                    delete button.dataset.copied;
                }, 2000);
            } else {
                window.prompt('Copy this link', url);
            }
        });
    });
}

function setupMailtoButtons() {
    document.querySelectorAll('[data-mailto-subject]').forEach((button) => {
        button.addEventListener('click', () => {
            openMailto(
                button.dataset.mailtoSubject,
                button.dataset.mailtoBody || 'Hello Digital Atelier,'
            );
        });
    });
}

function setupNewsletterForms() {
    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                emailInput?.focus();
                return;
            }

            openMailto(
                'Newsletter signup',
                `Hello Digital Atelier,\n\nPlease add ${email} to the mailing list.`
            );

            form.reset();
        });
    });
}

function setupCollectionFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('[data-filter-card]');
    const countTarget = document.querySelector('[data-filter-count]');

    if (!filterButtons.length || !cards.length) {
        return;
    }

    const setActiveClasses = (button, isActive) => {
        button.setAttribute('aria-pressed', String(isActive));
        button.classList.toggle('bg-primary', isActive);
        button.classList.toggle('text-on-primary', isActive);
        button.classList.toggle('bg-surface-container-low', !isActive);
        button.classList.toggle('text-on-surface-variant', !isActive);
        button.classList.toggle('hover:bg-surface-container-high', !isActive);
    };

    const updateFilter = (filterValue) => {
        let visibleCount = 0;

        cards.forEach((card) => {
            const categories = (card.dataset.category || '').split(' ');
            const isVisible = filterValue === 'all' || categories.includes(filterValue);

            card.classList.toggle('hidden', !isVisible);

            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (countTarget) {
            countTarget.textContent = `Showing ${visibleCount} of 42 Objects`;
        }
    };

    filterButtons.forEach((button) => {
        setActiveClasses(button, button.dataset.filter === 'all');

        button.addEventListener('click', () => {
            filterButtons.forEach((item) => {
                setActiveClasses(item, item === button);
            });

            updateFilter(button.dataset.filter || 'all');
        });
    });
}

function setupOptionGroups() {
    document.querySelectorAll('[data-option-group]').forEach((group) => {
        const buttons = group.querySelectorAll('[data-option-button]');
        const style = group.dataset.optionStyle;

        if (!buttons.length) {
            return;
        }

        const setButtonState = (button, isActive) => {
            if (style === 'swatch') {
                button.classList.toggle('border-primary', isActive);
                button.classList.toggle('border-transparent', !isActive);
                return;
            }

            button.classList.toggle('border-on-surface', isActive);
            button.classList.toggle('bg-white', isActive);
            button.classList.toggle('text-on-surface', isActive);
            button.classList.toggle('border-outline-variant', !isActive);
            button.classList.toggle('text-on-surface-variant', !isActive);
        };

        buttons.forEach((button, index) => {
            setButtonState(button, index === 0);

            button.addEventListener('click', () => {
                buttons.forEach((item) => {
                    setButtonState(item, item === button);
                });
            });
        });
    });
}

/**
 * Scroll Reveal Observer
 * Fades-in elements with the .reveal or .reveal-stagger class
 * when they enter the viewport.
 */
document.addEventListener('DOMContentLoaded', () => {
    setupRevealObserver();
    setupShareButtons();
    setupMailtoButtons();
    setupNewsletterForms();
    setupCollectionFilters();
    setupOptionGroups();

    document.querySelectorAll('#mobileMenu a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
});
