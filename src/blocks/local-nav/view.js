/**
 * Frontend script for Local Nav Toggle
 */
document.addEventListener('DOMContentLoaded', () => {
    const navs = document.querySelectorAll('.fc-local-nav');

    navs.forEach(nav => {
        const toggle = nav.querySelector('.fc-local-nav__toggle');
        const list = nav.querySelector('.fc-local-nav__menu');

        if (toggle && list) {
            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                nav.classList.toggle('is-open');
            });
        }
    });
});
