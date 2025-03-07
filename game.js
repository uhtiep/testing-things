// Player object
const player = {
    element: document.getElementById('player'),
    x: 100,
    y: 300,
    width: 100,
    height: 100,
    speed: 20,
    attackRange: 100, // Range of basic attack
};

// Enemy object
const enemy = {
    element: document.getElementById('enemy'),
    x: 600,
    y: 300,
    width: 100,
    height: 100,
};

// Attack range (shown when basic attack is performed)
let attackRangeElement = null;

// Function to update player position
function updatePlayerPosition() {
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
}

// Function to handle player movement
function movePlayer(direction) {
    switch (direction) {
        case 'up':
            player.y -= player.speed;
            break;
        case 'down':
            player.y += player.speed;
            break;
        case 'left':
            player.x -= player.speed;
            break;
        case 'right':
            player.x += player.speed;
            break;
    }
    updatePlayerPosition();
}

// Function to handle basic attack (Z)
function basicAttack() {
    if (attackRangeElement) {
        attackRangeElement.remove(); // Remove the previous attack range
    }

    attackRangeElement = document.createElement('div');
    attackRangeElement.classList.add('attack-range');
    attackRangeElement.style.left = `${player.x + player.width}px`; // Position it based on player
    attackRangeElement.style.top = `${player.y + player.height / 2 - 10}px`; // Center vertically
    document.getElementById('gameArea').appendChild(attackRangeElement);

    // Check if the enemy is within range
    if (
        player.x + player.width + player.attackRange > enemy.x &&
        player.x < enemy.x + enemy.width &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    ) {
        // Damage enemy (simple collision detection)
        console.log('Enemy hit with basic attack!');
        enemy.element.style.backgroundColor = "#ff69b4"; // Change enemy color to indicate hit
        enemy.element.classList.add("hit"); // Add hit animation
        setTimeout(() => {
            enemy.element.style.backgroundColor = "#ff0000"; // Reset color
            enemy.element.classList.remove("hit"); // Remove hit animation
        }, 500);
    }
}

// Function to handle heavy attack (X)
function heavyAttack() {
    if (attackRangeElement) {
        attackRangeElement.remove(); // Remove the previous attack range
    }

    attackRangeElement = document.createElement('div');
    attackRangeElement.classList.add('attack-range');
    attackRangeElement.style.left = `${player.x + player.width + 50}px`; // Bigger range for heavy attack
    attackRangeElement.style.top = `${player.y + player.height / 2 - 20}px`; // Center vertically
    attackRangeElement.style.width = '200px'; // Heavy attack range
    document.getElementById('gameArea').appendChild(attackRangeElement);

    // Check if the enemy is within range
    if (
        player.x + player.width + 50 < enemy.x + enemy.width &&
        player.x + player.width + 250 > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    ) {
        // Damage enemy (heavy attack)
        console.log('Enemy hit with heavy attack!');
        enemy.element.style.backgroundColor = "#ff69b4"; // Change enemy color to indicate hit
        enemy.element.classList.add("hit"); // Add hit animation
        setTimeout(() => {
            enemy.element.style.backgroundColor = "#ff0000"; // Reset color
            enemy.element.classList.remove("hit"); // Remove hit animation
        }, 500);
    }
}

// Event listeners for player controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
        movePlayer('up');
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        movePlayer('down');
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        movePlayer('left');
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
        movePlayer('right');
    } else if (event.key === 'z') {
        basicAttack();
    } else if (event.key === 'x') {
        heavyAttack();
    }
});
