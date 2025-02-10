document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('#nav-links');
    const body = document.body;
    const bars = hamburger.querySelectorAll('span');

    // Add class to spans to make them bars
    bars.forEach(span => span.classList.add('bar'));

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking on links
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && 
            !navLinks.contains(e.target) && 
            navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Prevent clicks inside nav menu from closing it
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});