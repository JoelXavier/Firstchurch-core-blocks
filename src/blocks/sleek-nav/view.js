document.addEventListener('DOMContentLoaded', () => {
    const navs = document.querySelectorAll('.fc-sleek-nav');
    
    navs.forEach(nav => {
        const hamburger = nav.querySelector('.fc-sleek-nav__hamburger');
        const overlay = nav.querySelector('.fc-sleek-nav__overlay');
        const closeBtn = nav.querySelector('.fc-sleek-nav__close');

        if (hamburger && overlay) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.add('is-active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeBtn && overlay) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        }

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
                overlay.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        });
    });
});
