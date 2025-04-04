// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSpeed = 5;
const bulletSpeed = 6;
const enemySpeed = 2;
const bulletCooldown = 1000; // 1 second between shots (in ms)
let lastShotTime = 0; // Track last shot time

let currentStage = 1;
let stageEnemiesKilled = 0;
let score = 0;
let coins = 0;

// Game state variables
let gameRunning = false;
let player, bullets, enemies, abilities;

// Initialize game
function startGame() {
    gameRunning = true;
    score = 0;
    coins = 0;
    stageEnemiesKilled = 0;
    player = createPlayer();
    bullets = [];
    enemies = [];
    abilities = [];
    generateEnemies();
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
        fireRate: bulletCooldown // Start with base fire rate (1 shot per second)
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
    if (nearestEnemy && (Date.now() - lastShotTime >= player.fireRate)) {
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
        lastShotTime = Date.now(); // Update last shot time
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
                checkForAbility(); // Check if an ability should be rewarded
            }
        });
    });
}

// Ability system - Random ability after every 3 kills
function checkForAbility() {
    if (stageEnemiesKilled % 3 === 0) {
        selectAbility();
    }
}

// Random ability selection (150 abilities)
function selectAbility() {
    const abilitiesList = [
        { name: "Increase Fire Rate", effect: () => { player.fireRate = 500; } },  // Faster firing (0.5 sec cooldown)
        { name: "Double Damage", effect: () => { player.damage = 2; } },  // Double damage
        { name: "Speed Boost", effect: () => { player.speed = 8; } },  // Increase player speed
        { name: "Triple Shot", effect: () => { player.fireRate = 333; } },  // Triple shot (0.33 sec cooldown)
        { name: "Piercing Bullets", effect: () => { bulletSpeed = 8; } },  // Increase bullet speed
        // Add more abilities here (up to 150)
    ];

    const randomAbility = abilitiesList[Math.floor(Math.random() * abilitiesList.length)];
    abilities.push(randomAbility);
    randomAbility.effect(); // Apply the selected ability effect

    console.log(`New ability acquired: ${randomAbility.name}`);
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

// Select Map button click handler
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

// Map and main menu switch
function goBackToMainMenu() {
    document.getElementById('mapSelectionMenu').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}

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

// Start the game (initially)
startGame();
