// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSpeed = 5;
const bulletSpeed = 6;
const enemySpeed = 2;
const bossSpeed = 1;
let currentStage = 1;
let currentMap = 1;
let totalStages = 60;
let powerUps = [];
let score = 0;
let coins = 0;

// Game state
let gameRunning = false;
let player, bullets, enemies, rogueAbilities, stageEnemiesKilled, mapData, bosses;

// Define maps
const maps = [
    { name: "Forest of Shadows", stages: 60 },
    { name: "Desert of Doom", stages: 60 },
    { name: "Frozen Peaks", stages: 60 },
    { name: "Volcanic Abyss", stages: 60 },
    { name: "Cavern of Chaos", stages: 60 },
    { name: "Temple of Time", stages: 60 },
    { name: "Skylands", stages: 60 },
    { name: "Dark Rift", stages: 60 },
    { name: "Ancient Tombs", stages: 60 },
    { name: "Mystic Woods", stages: 60 },
    { name: "The Abyss", stages: 60 },
    { name: "Celestial Realm", stages: 60 },
    { name: "The Forgotten City", stages: 60 },
    { name: "Blood Marsh", stages: 60 },
    { name: "Storm Fortress", stages: 60 }
];

// Show the map selection menu
function showMaps() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('mapSelectionMenu').style.display = 'block';
    const mapList = document.getElementById('mapList');
    mapList.innerHTML = ''; // clear list
    maps.forEach((map, index) => {
        let li = document.createElement('li');
        li.textContent = map.name;
        li.onclick = () => startGame(index + 1);
        mapList.appendChild(li);
    });
}

// Go back to the main menu
function goBackToMainMenu() {
    document.getElementById('mapSelectionMenu').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}

// Start the game for selected map
function startGame(mapIndex) {
    currentMap = mapIndex;
    currentStage = 1;
    stageEnemiesKilled = 0;
    gameRunning = true;
    score = 0;
    coins = 0;
    mapData = maps[mapIndex - 1];
    initializeGame();
}

// Initialize game variables
function initializeGame() {
    player = createPlayer();
    bullets = [];
    enemies = [];
    rogueAbilities = [];
    stageEnemiesKilled = 0;
    bosses = [];
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
        damage: 1,
        coins: 0
    };
}

// Auto-shooting bullets
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: bulletSpeed,
        direction: 0 // Shoot upward
    });
}

// Generate enemies for each stage
function generateEnemies() {
    if (enemies.length < 5) {
        for (let i = enemies.length; i < 5; i++) {
            let xPos = Math.random() * canvas.width;
            let yPos = Math.random() * canvas.height;
            let type = Math.random() < 0.5 ? "moving" : "stationary"; // Random type
            enemies.push({ x: xPos, y: yPos, width: 30, height: 30, type: type });
        }
    }
}

// Move enemies
function moveEnemies() {
    enemies.forEach(enemy => {
        if (enemy.type === "moving") {
            enemy.x += (Math.random() - 0.5) * enemySpeed * 2; // Move randomly
            enemy.y += (Math.random() - 0.5) * enemySpeed * 2;
        }
    });
}

// Check bullet-enemy collisions
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
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
    movePlayer();
    moveEnemies();
    generateEnemies();
    checkCollisions();
    drawPlayer();
    drawBullets();
    drawEnemies();

    // Handle stage progression
    if (stageEnemiesKilled >= 5) {
        currentStage++;
        stageEnemiesKilled = 0;
        if (currentStage % 3 === 0) { // Boss stage
            // Boss mechanics here
        }
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

// Handle movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -playerSpeed;
    if (e.key === 'ArrowRight') player.dx = playerSpeed;
    if (e.key === 'ArrowUp') player.dy = -playerSpeed;
    if (e.key === 'ArrowDown') player.dy = playerSpeed;
});

// Stop movement
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
});

// Shop and power-up system (simplified for now)
// Later expand to add coins, power-ups, and upgrade logic.

