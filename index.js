const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2, y: canvas.height / 2, size: 20 };  // Player as a ball
let bullets = [];
let enemies = [];
let money = 0;
let shopOpen = false;
let canShoot = true;
let lastShotTime = 0; // to handle cooldown
let upgrades = {
    extraProjectiles: 0,
    homing: false,
    shootCooldown: 1000,
    bulletSize: 5,
    enemySpeed: 1
};

// Keep track of mouse movement
document.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

// Control keys for shooting
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
                money += 1;
                updateMoney();
            }
        });
    });

    enemies.forEach((enemy, i) => {
        if (enemy.type === 0) {
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            if (Math.random() < 0.02) {
                bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, size: 10 });
            }
        } else if (enemy.type === 1) {
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.x += Math.cos(angle) * upgrades.enemySpeed;
            enemy.y += Math.sin(angle) * upgrades.enemySpeed;
            if (Math.random() < 0.03) {
                enemy.vx = Math.cos(angle) * 15;
                enemy.vy = Math.sin(angle) * 15;
            }
        } else if (enemy.type === 2) {
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.x += Math.cos(angle) * upgrades.enemySpeed;
            enemy.y += Math.sin(angle) * upgrades.enemySpeed;
        }
    });

    enemies.forEach((enemy, i) => {
        if (collision(player, enemy)) {
            alert("Game Over! Refresh to restart.");
            location.reload();
        }
    });

    if (Math.random() < 0.05) spawnEnemy();
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
    let speed = 10, vx = 0, vy = 0;
    let bulletSize = upgrades.bulletSize;

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
    // Example items
    let item1 = { name: "Extra Projectile", cost: 10, effect: () => { upgrades.extraProjectiles++; } };
    let item2 = { name: "Faster Bullets", cost: 20, effect: () => { upgrades.shootCooldown = Math.max(500, upgrades.shootCooldown - 200); } };

    document.getElementById("item1").innerText = `${item1.name} - $${item1.cost}`;
    document.getElementById("item1").onclick = function() { buyItem(item1); };

    document.getElementById("item2").innerText = `${item2.name} - $${item2.cost}`;
    document.getElementById("item2").onclick = function() { buyItem(item2); };
}

// Handle item purchase
function buyItem(item) {
    if (money >= item.cost) {
        money -= item.cost;
        item.effect();
        updateMoney();
        updateShop();
    }
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
        ctx.fillStyle = "#0000FF";
        ctx.fill();
    });
}

gameLoop();
