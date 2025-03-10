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

    if (["w", "a", "s", "d"].includes(e.key)) {
        if (canShoot && Date.now() - lastShotTime > upgrades.shootCooldown) {
            shoot(e.key);
            lastShotTime = Date.now();
        }
    }
});

// Spawn enemies randomly
function spawnEnemy() {
    let type = Math.floor(Math.random() * 3);
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let size = 20 + Math.random() * 20;
    enemies.push({ x, y, size, type, vx: 0, vy: 0 });
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

// Update shop items
function updateShop() {
    let item1 = { name: "Extra Projectile", cost: 10, effect: () => { upgrades.extraProjectiles++; } };
    let item2 = { name: "Faster Bullets", cost: 20, effect: () => { upgrades.shootCooldown = Math.max(500, upgrades.shootCooldown - 200); } };
    let item3 = { name: "Homing Shots", cost: 30, effect: () => { upgrades.homing = true; } };
    let item4 = { name: "Speed Boost", cost: 15, effect: () => { upgrades.enemySpeed += 0.5; } };
    let item5 = { name: "Shield", cost: 25, effect: () => { upgrades.shield = true; } };
    let item6 = { name: "Double Speed", cost: 50, effect: () => { upgrades.doubleSpeed = true; } };
    let item7 = { name: "Double Damage", cost: 60, effect: () => { upgrades.doubleDamage = true; } };
    let item8 = { name: "Bullet Size Increase", cost: 40, effect: () => { upgrades.bulletSizeIncrease += 5; } };
    let item9 = { name: "Fast Reload", cost: 35, effect: () => { upgrades.shootCooldown = Math.max(300, upgrades.shootCooldown - 100); } };
    let item10 = { name: "Enemy Health Decrease", cost: 45, effect: () => { upgrades.enemyHealthDecrease = true; } };
    let item11 = { name: "Auto-shoot", cost: 70, effect: () => { upgrades.autoShoot = true; } };
    let item12 = { name: "Invincibility", cost: 80, effect: () => { upgrades.invincibility = true; } };
    let item13 = { name: "Damage Reflection", cost: 90, effect: () => { upgrades.damageReflection = true; } };
    let item14 = { name: "Projectile Bouncing", cost: 100, effect: () => { upgrades.projectileBouncing = true; } };
    let item15 = { name: "Health Regeneration", cost: 120, effect: () => { upgrades.healthRegen = true; } };

    // Update the shop UI with new items
    let items = [item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12, item13, item14, item15];
    let randomItems = getRandomItems(items);
    document.getElementById("item1").innerText = `${randomItems[0].name} - $${randomItems[0].cost}`;
    document.getElementById("item2").innerText = `${randomItems[1].name} - $${randomItems[1].cost}`;

    document.getElementById("item1").onclick = function() { buyItem(randomItems[0]); };
    document.getElementById("item2").onclick = function() { buyItem(randomItems[1]); };
}

// Get random items for the shop
function getRandomItems(items) {
    let shuffled = items.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
}

// Handle item purchase
function buyItem(item) {
    if (money >= item.cost) {
        money -= item.cost;
        item.effect();
        updateMoney();
        updateShop(); // Reset shop after purchase
    }
}

// Activate slow motion ability
function activateSlowMotion() {
    upgrades.slowMotion = true;
    setTimeout(() => {
        upgrades.slowMotion = false;
    }, 5000);
}

// Activate shield ability
function activateShield() {
    upgrades.shield = true;
    setTimeout(() => {
        upgrades.shield = false;
    }, 5000);
}

// Activate beam ability
function activateBeam() {
    upgrades.beam = true;
    setTimeout(() => {
        upgrades.beam = false;
    }, 5000);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
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
}

gameLoop();
 