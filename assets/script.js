const sections = document.querySelectorAll('section');

let currentSection = 0;

document.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        // Scrolling down
        currentSection = Math.min(currentSection + 1, sections.length - 1);
    } else {
        // Scrolling up
        currentSection = Math.max(currentSection - 1, 0);
    }

    // Faster fading effect
    anime({
        targets: sections,
        opacity: 0,
        duration: 300, // Decreased duration for a faster effect
        easing: 'easeOutQuad',
        complete: () => {
            // Scroll to the next section
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });

            // Responsive fading effect
            anime({
                targets: sections[currentSection],
                opacity: 1,
                duration: 500, // Adjusted duration for responsiveness
                easing: 'easeInQuad'
            });
        }
    });
});