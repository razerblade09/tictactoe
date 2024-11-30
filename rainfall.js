function rain() {
    const amount = 70;
    const body = document.querySelector('body');
    
    // Clear existing raindrops (if any) to avoid multiple calls appending many raindrops
    const existingDrops = document.querySelectorAll('.raindrop');
    existingDrops.forEach(drop => drop.remove());

    let i = 0;
    while (i < amount) {
        const drop = document.createElement('i');
        drop.classList.add('raindrop'); // Add a class for styling

        const size = Math.random() * 5; // Randomize size
        const posX = Math.floor(Math.random() * window.innerWidth); // Randomize horizontal position
        const delay = Math.random() * -20; // Randomize animation delay
        const duration = Math.random() * 5; // Randomize animation duration

        // Apply styles
        drop.style.width = 0.2 + size + 'px';
        drop.style.height = 10 + size * 5 + 'px'; // Height proportional to size
        drop.style.left = posX + 'px';
        drop.style.animationDelay = delay + 's';
        drop.style.animationDuration = 1 + duration + 's';

        // Append to the body
        body.appendChild(drop);
        i++;
    }
}

// Call the rain function when the page is ready
window.addEventListener('load', rain);
