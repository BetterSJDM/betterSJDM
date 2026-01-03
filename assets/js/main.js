/* Better SJDM - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    // Prevent double-click on navigation and header links from causing unintended behavior
    const headerLinks = document.querySelectorAll('.site-header a, .main-nav a, .logo-container a');
    headerLinks.forEach(link => {
        // Prevent text selection on double-click
        link.addEventListener('mousedown', (e) => {
            if (e.detail > 1) {
                e.preventDefault();
            }
        });

        // Handle double-click explicitly
        link.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Stay on current link's destination (don't redirect elsewhere)
            if (link.href && !link.href.startsWith('javascript:')) {
                window.location.href = link.href;
            }
        });
    });

    // Prevent double-click text selection on entire header
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        siteHeader.addEventListener('mousedown', (e) => {
            if (e.detail > 1) {
                e.preventDefault();
            }
        });
    }

    // Mobile Menu Toggle
    const initMobileMenu = () => {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileMenuOverlay');
        const mobileClose = document.querySelector('.mobile-menu-close');
        const mobileSearchInput = document.getElementById('mobileSearchInput');

        if (!mobileToggle || !mobileMenu) return;

        const openMenu = () => {
            mobileMenu.classList.add('active');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.setAttribute('aria-expanded', 'false');
        };

        mobileToggle.addEventListener('click', openMenu);

        if (mobileClose) {
            mobileClose.addEventListener('click', closeMenu);
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMenu);
        }

        // Handle dropdowns in mobile menu
        const mobileDropdowns = mobileMenu.querySelectorAll('.has-dropdown > a');
        mobileDropdowns.forEach(link => {
            link.addEventListener('click', (e) => {
                const parent = link.parentElement;
                const isOpen = parent.classList.contains('open');

                // Close all other dropdowns
                mobileMenu.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));

                // Toggle current
                if (!isOpen) {
                    parent.classList.add('open');
                }

                e.preventDefault();
            });
        });

        // Mobile search - open global search modal
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('focus', () => {
                closeMenu();
                const searchModal = document.getElementById('searchModal');
                const globalSearchInput = document.getElementById('global-search-input');
                if (searchModal) {
                    searchModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    if (globalSearchInput) {
                        setTimeout(() => globalSearchInput.focus(), 100);
                    }
                }
            });
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    };

    initMobileMenu();

    // Language handling is now managed by TranslationEngine in translations.js
    // The TranslationEngine initializes automatically and handles:
    // - Language persistence via localStorage
    // - Button state management
    // - Content translation with fallback support

    // Dynamic copyright year
    const yearElement = document.getElementById('copyright-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // FAQ Accordion Functionality
    const initAccordion = () => {
        const accordionTriggers = document.querySelectorAll('.accordion-trigger');

        if (accordionTriggers.length === 0) return;

        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const accordionItem = this.closest('.accordion-item');
                const isActive = accordionItem.classList.contains('active');
                const accordionContent = accordionItem.querySelector('.accordion-content');

                // Close all other accordion items (optional - remove for multi-open)
                const allItems = document.querySelectorAll('.accordion-item');
                allItems.forEach(item => {
                    if (item !== accordionItem) {
                        item.classList.remove('active');
                        item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                if (isActive) {
                    accordionItem.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    accordionItem.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });

            // Keyboard accessibility
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Open first accordion item by default (optional)
        // const firstItem = document.querySelector('.accordion-item');
        // if (firstItem) {
        //     firstItem.classList.add('active');
        //     firstItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
        // }
    };

    initAccordion();

    // Education Category Accordion
    const initEduAccordion = () => {
        const categoryHeaders = document.querySelectorAll('.edu-category-header');

        categoryHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    content.hidden = true;
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    content.hidden = false;
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    initEduAccordion();
});
