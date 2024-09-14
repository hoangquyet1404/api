document.addEventListener("DOMContentLoaded", () => {
    const snowflakes = document.querySelectorAll('.snowflake');
    
    snowflakes.forEach(snowflake => {
        const size = Math.random() * 10 + 10;
        snowflake.style.fontSize = `${size}px`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to sections when they come into view
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});
