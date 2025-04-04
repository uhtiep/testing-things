// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSpeed = 5;
const bulletSpeed = 6;
const enemySpeed = 2;
let currentStage = 1;
let stageEnemiesKilled = 0;
let score = 0;
let coins = 0;

// Game state variables
let gameRunning = false;
let player, bullets, enemies;

// Initialize game
function startGame() {
    gameRunning = true;
    score = 0;
    coins = 0;
    stageEnemiesKilled = 0;
    player = createPlayer();
    bullets = [];
    enemies = [];
    update();
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
        health: 3,
    };
}

// Generate random enemies (5 per stage)
function generateEnemies() {
    if (enemies.length < 5) {
        for (let i = enemies.length; i < 5; i++) {
            let xPos = Math.random() * canvas.width;
            let yPos = Math.random() * canvas.height;
            enemies.push({ x: xPos, y: yPos, width: 30, height: 30 });
        }
    }
}

// Move enemies
function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += (Math.random() - 0.5) * enemySpeed * 2; // Move randomly
        enemy.y += (Math.random() - 0.5) * enemySpeed * 2;
    });
}

// Calculate the nearest enemy to the player
function getNearestEnemy() {
    let nearestEnemy = null;
    let shortestDistance = Infinity;

    enemies.forEach(enemy => {
        const distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestEnemy = enemy;
        }
    });

    return nearestEnemy;
}

// Shoot bullet towards nearest enemy
function shootBulletTowardsEnemy() {
    const nearestEnemy = getNearestEnemy();
    if (nearestEnemy) {
        const angle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
        const bullet = {
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            speed: bulletSpeed,
            angle: angle,
        };
        bullets.push(bullet);
    }
}

// Move bullets
function moveBullets() {
    bullets.forEach(bullet => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
    });

    bullets = bullets.filter(bullet => bullet.x > 0 && bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height); // Remove off-screen bullets
}

// Check bullet-enemy collisions
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
                // Bullet hit enemy
                enemies.splice(enemyIndex, 1); // Remove enemy
                bullets.splice(bulletIndex, 1); // Remove bullet
                score += 10; // Add score for killing an enemy
                stageEnemiesKilled++;
            }
        });
    });
}

// Update game state
function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    moveEnemies();
    moveBullets();
    generateEnemies();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();

    // Auto-shoot towards nearest enemy
    shootBulletTowardsEnemy();

    // Handle stage progression
    if (stageEnemiesKilled >= 5) {
        currentStage++;
        stageEnemiesKilled = 0;
    }

    requestAnimationFrame(update);
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = '#00FF00';
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

// Handle movement keys (not used in this case, since we're auto-shooting)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -playerSpeed;
    if (e.key === 'ArrowRight') player.dx = playerSpeed;
    if (e.key === 'ArrowUp') player.dy = -playerSpeed;
    if (e.key === 'ArrowDown') player.dy = playerSpeed;
});

// Stop movement keys
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
});

// Start the game
startGame();
 