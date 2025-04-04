// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSpeed = 5;
const bulletSpeed = 6;
const enemySpeed = 2;
const stageDifficultyIncrease = 0.1; // increase enemy speed and frequency per stage
let currentStage = 1;

// Game state variables
let gameRunning = false;
let player, bullets, enemies, rogueAbilities, score, stage, playerHealth;

// Start new game
function startGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameOverMenu').style.display = 'none';
    gameRunning = true;
    score = 0;
    stage = 1;
    playerHealth = 3;
    player = createPlayer();
    bullets = [];
    enemies = [];
    rogueAbilities = [];
    update();
}

// Restart the game
function restartGame() {
    startGame();
}

// Create player object
function createPlayer() {
    return {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        speed: playerSpeed,
        dx: 0,
        dy: 0,
        color: '#00FF00',
        health: 3
    };
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = '#FFFF00';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = '#FF0000';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Draw rogue abilities
function drawRogueAbilities() {
    rogueAbilities.forEach(ability => {
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(ability.x, ability.y, ability.radius, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Move the player
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Keep player within canvas bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Shoot bullets
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: bulletSpeed
    });
}

// Move bullets
function moveBullets() {
    bullets.forEach(bullet => bullet.y -= bulletSpeed);
    bullets = bullets.filter(bullet => bullet.y > 0); // Remove off-screen bullets
}

// Generate enemies
function generateEnemies() {
    if (Math.random() < 0.02 + stage * stageDifficultyIncrease) {
        let xPos = Math.random() * (canvas.width - 30);
        enemies.push({ x: xPos, y: -30, width: 30, height: 30 });
    }
}

// Move enemies
function moveEnemies() {
    enemies.forEach(enemy => enemy.y += enemySpeed + stage * 0.1);
    enemies = enemies.filter(enemy => enemy.y < canvas.height); // Remove off-screen enemies
}

// Check collisions between bullets and enemies
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
                // Remove both bullet and enemy
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10; // Increase score for enemy kill
            }
        });
    });
}

// Handle rogue abilities (temporary upgrades)
function handleRogueAbilities() {
    rogueAbilities.forEach((ability, index) => {
        if (ability.x < player.x + player.width && ability.x + ability.radius > player.x &&
            ability.y < player.y + player.height && ability.y + ability.radius > player.y) {
            rogueAbilities.splice(index, 1); // Pick up ability
            applyRogueAbility();
        }
    });
}

// Apply rogue-like abilities
function applyRogueAbility() {
    const abilities = ['extraDamage', 'fasterShooting', 'doubleArrow'];
    const randomAbility = abilities[Math.floor(Math.random() * abilities.length)];
    rogueAbilities.push({ type: randomAbility, x: Math.random() * canvas.width, y: Math.random() * canvas.height });
}

// Update game state
function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    movePlayer();
    moveBullets();
    moveEnemies();
    handleRogueAbilities();
    generateEnemies();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();
    drawRogueAbilities();

    // Increase difficulty after each stage
    if (enemies.length === 0) {
        stage++;
        player.health = Math.min(player.health + 1, 5); // Cap player health
    }

    if (player.health <= 0) {
        gameOver();
    }

    requestAnimationFrame(update);
}

// Handle key press for movement
document.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowLeft' || e.key == 'a') {
        player.dx = -playerSpeed;
    }
    if (e.key == 'ArrowRight' || e.key == 'd') {
        player.dx = playerSpeed;
    }
    if (e.key == 'ArrowUp' || e.key == 'w') {
        player.dy = -playerSpeed;
    }
    if (e.key == 'ArrowDown' || e.key == 's') {
        player.dy = playerSpeed;
    }
    if (e.key == ' ') {
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowLeft' || e.key == 'a' || e.key == 'ArrowRight' || e.key == 'd') {
        player.dx = 0;
    }
    if (e.key == 'ArrowUp' || e.key == 'w' || e.key == 'ArrowDown' || e.key == 's') {
        player.dy = 0;
    }
});

// Show game over screen
function gameOver() {
    gameRunning = false;
    document.getElementById('gameOverMenu').style.display = 'block';
}
