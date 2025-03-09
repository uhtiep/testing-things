// Game Constants
const noteSpeed = 3; // Speed at which the notes fall
const noteHitThreshold = 20; // Distance when the note is considered "hit"
let health = 100; // Player's health
let score = 0;
let gameOver = false;
let noteInterval; // To store the interval for generating notes
let notes = []; // Array to store notes
let keyPresses = { left: false, down: false, up: false, right: false };

// DOM Elements
const healthBar = document.getElementById('health');
const noteContainer = document.getElementById('note-container');
const instructions = document.getElementById('instructions');

// Function to generate a new note
function generateNote() {
    const note = document.createElement('div');
    note.classList.add('note');
    const notePosition = ['left', 'down', 'up', 'right'][Math.floor(Math.random() * 4)];  // Random direction
    note.style.left = `${Math.random() * 550}px`; // Random horizontal position within the screen
    note.dataset.position = notePosition;
    noteContainer.appendChild(note);
    notes.push(note);
}

// Function to move notes down and check for collisions
function moveNotes() {
    notes.forEach((note, index) => {
        let noteTop = parseInt(note.style.bottom) || 0;
        note.style.bottom = `${noteTop + noteSpeed}px`;

        // Check if the note reaches the hit zone
        if (noteTop > noteHitThreshold && !note.classList.contains('hit')) {
            if (!keyPresses[note.dataset.position]) {
                // Missed the note, reduce health
                health -= 10;
                updateHealth();
                note.classList.add('missed');
            } else {
                // Hit the note, increase score
                score += 10;
                note.classList.add('hit');
            }
            setTimeout(() => note.remove(), 300); // Remove note after it hits or misses
            notes.splice(index, 1); // Remove note from array
        }
    });
}

// Update the health bar
function updateHealth() {
    healthBar.style.width = `${health}%`;
    if (health <= 0) {
        gameOver = true;
        instructions.textContent = "Game Over! Refresh to play again.";
        clearInterval(noteInterval); // Stop the game
    }
}

// Handle key presses for player input
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    switch (event.key) {
        case 'ArrowLeft': keyPresses.left = true; break;
        case 'ArrowDown': keyPresses.down = true; break;
        case 'ArrowUp': keyPresses.up = true; break;
        case 'ArrowRight': keyPresses.right = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    if (gameOver) return;
    switch (event.key) {
        case 'ArrowLeft': keyPresses.left = false; break;
        case 'ArrowDown': keyPresses.down = false; break;
        case 'ArrowUp': keyPresses.up = false; break;
        case 'ArrowRight': keyPresses.right = false; break;
    }
});

// Start the game
function startGame() {
    instructions.textContent = "Press Arrow Keys to Play!";
    noteInterval = setInterval(() => {
        generateNote();
        moveNotes();
    }, 1000); // Generate notes every 1 second
}

startGame();
