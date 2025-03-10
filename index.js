const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2, y: canvas.height / 2, size: 20 };  // Player as a ball
let bullets = [];
let enemies = [];
let money = 0;
let kills = 0;
let shopOpen = false;
let canShoot = true;
let lastShotTime = 0; // to handle cooldown
let upgrades = {
    extraProjectiles: 0,
    homing: false,
    shootCooldown: 1000,
    bulletSize: 5,
    enemySpeed: 1,
    slowMotion: false,
    shield: false,
    beam: false,
    doubleSpeed: false,
    doubleDamage: false,
    bulletSizeIncrease: 0,
    fastReload: false,
    enemyHealthDecrease: false,
    autoShoot: false,
    invincibility: false,
    damageReflection: false,
    projectileBouncing: false,
    healthRegen: false
};

// UI visibility for controls
let showControls = false;

// Keep track of mouse movement
document.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

// Control keys for shooting and abilities
document.addEventListener("keydown", (e) => {
    if (shopOpen && e.key !== "j") return;
    if (e.key === "k") openShop();
    if (e.key === "j") closeShop();
    if (e.key === "p") activateSlowMotion();
    if (e.key === "i") activateShield();
    if (e.key === "o") activateBeam();
    if (e.key === "n") toggleControls();

    if (["w", "a", "s", "d"].includes(e.key)) {
        if (canShoot && Date.now() - lastShotTime > upgrades.shootCooldown) {
            shoot(e.key);
            lastShotTime = Date.now();
        }
    }
});

// Function to spawn enemy with RNG logic
function spawnEnemy() {
    let randomNumber = Math.random() * 100; // Random number between 0 and 100

    let enemyType;

    // Determine the type of enemy based on the RNG
    if (randomNumber < 30) {
        enemyType = 2;  // Circle enemy
    } else if (randomNumber < 50) {
        enemyType = 0;  // Triangle enemy
    } else {
        enemyType = 1;  // Square enemy
    }

    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let size = 20 + Math.random() * 20;
    enemies.push({ x, y, size, type: enemyType, vx: 0, vy: 0 });
}

// Spawn boss after 25 kills
function spawnBoss() {
    let boss = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 40, type: 3, vx: 0, vy: 0, behavior: 'shoot' };
    enemies.push(boss);
}

// Main game update loop
function update() {
    if (shopOpen) return;

    bullets.forEach((bullet, i) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
        }
    });

    bullets.forEach((bullet, bi) => {
        enemies.forEach((enemy, ei) => {
            if (collision(bullet, enemy)) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                kills++;
                money += 1;
                updateMoney();
                if (kills % 25 === 0) spawnBoss(); // Spawn boss every 25 kills
            }
        });
    });

    // Handle enemy movement and behavior
    enemies.forEach((enemy, i) => {
        if (enemy.type === 0) {
            // Triangle Enemies: Shoot projectiles towards the player
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            if (Math.random() < 0.02) {
                bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, size: 10 });
            }
        } else if (enemy.type === 1) {
            // Square Enemies: Dash toward the player every 3 seconds
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.x += Math.cos(angle) * upgrades.enemySpeed;
            enemy.y += Math.sin(angle) * upgrades.enemySpeed;
            if (Math.random() < 0.03) {
                enemy.vx = Math.cos(angle) * 15;
                enemy.vy = Math.sin(angle) * 15;
            }
        } else if (enemy.type === 2) {
            // Circle Enemies: Move constantly towards the player
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.x += Math.cos(angle) * upgrades.enemySpeed;
            enemy.y += Math.sin(angle) * upgrades.enemySpeed;
        } else if (enemy.type === 3) {
            // Boss behavior: Shoot at the player
            if (enemy.behavior === 'shoot') {
                let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                if (Math.random() < 0.05) {
                    bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10, size: 15 });
                }
            }
        }
    });

    enemies.forEach((enemy, i) => {
        if (collision(player, enemy)) {
            alert("Game Over! Refresh to restart.");
            location.reload();
        }
    });

    if (Math.random() < 0.05) spawnEnemy(); // Regular enemy spawn
}

// Handle collision detection
function collision(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.size + obj2.size) / 2;
}

// Shoot bullets in a direction
function shoot(direction) {
    let speed = upgrades.doubleDamage ? 20 : 10;
    let vx = 0, vy = 0;
    let bulletSize = upgrades.bulletSize + upgrades.bulletSizeIncrease;

    if (direction === "w") vy = -speed;
    if (direction === "s") vy = speed;
    if (direction === "a") vx = -speed;
    if (direction === "d") vx = speed;

    bullets.push({ x: player.x, y: player.y, vx, vy, size: bulletSize });

    for (let i = 0; i < upgrades.extraProjectiles; i++) {
        bullets.push({ x: player.x, y: player.y, vx: vx * 1.2, vy: vy * 1.2, size: bulletSize });
    }

    // Apply homing behavior
    if (upgrades.homing) {
        bullets.forEach((bullet) => {
            let nearestEnemy = findNearestEnemy(bullet);
            if (nearestEnemy) {
                let angle = Math.atan2(nearestEnemy.y - bullet.y, nearestEnemy.x - bullet.x);
                bullet.vx = Math.cos(angle) * 10;
                bullet.vy = Math.sin(angle) * 10;
            }
        });
    }
}

// Find the nearest enemy for homing shots
function findNearestEnemy(bullet) {
    let nearestEnemy = null;
    let minDist = Infinity;
    enemies.forEach((enemy) => {
        let dx = bullet.x - enemy.x;
        let dy = bullet.y - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
            minDist = dist;
            nearestEnemy = enemy;
        }
    });
    return nearestEnemy;
}

// Beam function for shooting
function activateBeam() {
    if (upgrades.beam) {
        let beamLength = 500;
        let angle = Math.atan2(player.y - player.y, player.x - player.x);
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + Math.cos(angle) * beamLength, player.y + Math.sin(angle) * beamLength);
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 5;
        ctx.stroke();
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 100);
    }
}

// Update money display
function updateMoney() {
    document.getElementById("money").innerText = `Money: $${money}`;
}

// Open shop interface
function openShop() {
    shopOpen = true;
    updateShop();
    document.getElementById("shop").style.display = "block";
}

// Close shop interface
function closeShop() {
    shopOpen = false;
    document.getElementById("shop").style.display = "none";
}

// Toggle control UI visibility
function toggleControls() {
    showControls = !showControls;
    document.getElementById("controls").style.display = showControls ? 'block' : 'none';
}

// Draw game elements on canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player (Ball)
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();

    // Draw Bullets
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    });

    // Draw Enemies
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        if (enemy.type === 3) {
            ctx.fillStyle = "#FFD700"; // Boss is yellow
        } else {
            ctx.fillStyle = "#0000FF"; // Regular enemies are blue
        }
        ctx.fill();
    });

    // Draw Controls
    if (showControls) {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText("Controls:", 10, canvas.height - 80);
        ctx.fillText("W: Shoot Up", 10, canvas.height - 60);
        ctx.fillText("A: Shoot Left", 10, canvas.height - 40);
        ctx.fillText("S: Shoot Down", 10, canvas.height - 20);
        ctx.fillText("D: Shoot Right", 10, canvas.height);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
