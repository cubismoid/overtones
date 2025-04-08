document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const topImage = document.querySelector('.top-image');
    const mask = document.querySelector('.mask');
    const clickSound = document.getElementById('clickSound');
    const textInputContainer = document.querySelector('.text-input-container');
    const wordInput = document.getElementById('wordInput');
    const submitWord = document.getElementById('submitWord');
    const finishButton = document.getElementById('finishButton');
    const wordDisplay = document.getElementById('wordDisplay');
    
    let maskPosition = { x: 0, y: 0 };
    let collectedWords = [];

    // Update mask position and clip-path
    function updateMaskPosition(x, y) {
        const rect = container.getBoundingClientRect();
        maskPosition.x = x;
        maskPosition.y = y;
        
        // Update mask position
        mask.style.left = `${x}px`;
        mask.style.top = `${y}px`;

        // Update clip-path
        const maskSize = 200;
        const halfSize = maskSize / 2;
        
        const clipPathPoints = [
            `${x - halfSize}px ${y - halfSize}px`,
            `${x + halfSize}px ${y - halfSize}px`,
            `${x + halfSize}px ${y + halfSize}px`,
            `${x - halfSize}px ${y + halfSize}px`
        ];

        topImage.style.clipPath = `polygon(${clipPathPoints.join(', ')})`;
    }

    // Click event
    container.addEventListener('click', (e) => {
        // Don't update position if clicking on text input area
        if (e.target === textInputContainer || 
            e.target === wordInput || 
            e.target === submitWord || 
            e.target === finishButton) {
            return;
        }
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        updateMaskPosition(x, y);
        mask.classList.add('active');
        clickSound.currentTime = 0;
        clickSound.play();
        
        // Show text input
        textInputContainer.style.display = 'flex';
        wordInput.focus();
    });

    // Handle word submission
    function handleWordSubmission() {
        const word = wordInput.value.trim();
        if (word) {
            collectedWords.push(word);
            wordInput.value = '';
            textInputContainer.style.display = 'none';
        }
    }

    submitWord.addEventListener('click', handleWordSubmission);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleWordSubmission();
        }
    });

    // Finish button functionality
    finishButton.addEventListener('click', () => {
        // Remove the clip-path from the top image to reveal everything
        topImage.style.clipPath = 'none';
        
        // Hide the mask and text input
        mask.style.display = 'none';
        textInputContainer.style.display = 'none';
        
        // Display collected words randomly on screen
        collectedWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            
            // Random position
            const x = Math.random() * (window.innerWidth - 200);
            const y = Math.random() * (window.innerHeight - 50);
            
            wordElement.style.left = `${x}px`;
            wordElement.style.top = `${y}px`;
            
            wordDisplay.appendChild(wordElement);
        });
    });

    // Initialize mask position to center
    const rect = container.getBoundingClientRect();
    updateMaskPosition(rect.width / 2, rect.height / 2);
}); 