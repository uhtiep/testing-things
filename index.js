const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const shop = document.getElementById("shop");
const moneyDisplay = document.getElementById("money");
const item1Btn = document.getElementById("item1");
const item2Btn = document.getElementById("item2");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let money = 0;
let ballCount = 0;
let gameOver = false;
let shopOpen = false;
let upgrades = {
    extraProjectiles: 0,
    extraColumns: 0,
    homingShots: false,
    beamShots: false
};

const bullets = [];
const enemies = [];
const bosses = [];

const shopItems = [
    { name: "Skip to Boss", cost: 30, effect: () => spawnBoss() },
    { name: "+1 Projectile", cost: 20, effect: () => upgrades.extraProjectiles++ },
    { name: "+1 Column", cost: 25, effect: () => upgrades.extraColumns++ },
    { name: "Homing Shot", cost: 40, effect: () => upgrades.homingShots = true },
    { name: "Beam Shot", cost: 50, effect: () => upgrades.beamShots = true }
];

// Player (Cursor)
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    color: "white"
};

// Track cursor movement
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

// Shooting handler
document.addEventListener("keydown", (e) => {
    if (gameOver || shopOpen) return;
    let vx = 0, vy = 0, speed = 5;

    if (e.key === "w") vy = -speed;
    if (e.key === "s") vy = speed;
    if (e.key === "a") vx = -speed;
    if (e.key === "d") vx = speed;

    if (vx !== 0 || vy !== 0) shoot(vx, vy);
});

// Shop controls
document.addEventListener("keydown", (e) => {
    if (e.key === "k") openShop();
    if (e.key === "j") closeShop();
});

function shoot(vx, vy) {
    let projectiles = 1 + upgrades.extraProjectiles;

    for (let i = 0; i < projectiles; i++) {
        bullets.push({ x: player.x, y: player.y, vx, vy, size: 5, color: "yellow" });
    }

    for (let i = 0; i < upgrades.extraColumns; i++) {
        bullets.push({ x: player.x, y: player.y, vx: vy, vy: -vx, size: 5, color: "yellow" });
    }
}

// Enemy spawning
function spawnEnemy() {
    enemies.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        size: 15, 
        color: "red" 
    });
    ballCount++;

    if (ballCount % 50 === 0) spawnBoss();
}

// Boss spawning
function spawnBoss() {
    let type = Math.floor(Math.random() * 3);
    bosses.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        size: 30, 
        type, 
        cooldown: 0 
    });
}

// Update game logic
function update() {
    if (gameOver) return;

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    // Check bullet collisions with enemies
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (collision(bullet, enemy)) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                money++;
                updateMoney();
            }
        });
    });

    // Boss behavior
    bosses.forEach((boss) => {
        if (boss.type === 0) {
            // Boss that shoots at cursor
            if (boss.cooldown <= 0) {
                let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bosses.push({ 
                    x: boss.x, y: boss.y, size: 10, type: 3, 
                    vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5 
                });
                boss.cooldown = 60;
            } else {
                boss.cooldown--;
            }
        } else if (boss.type === 1) {
            // Boss that fires beams
            if (boss.cooldown <= 0) {
                let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bosses.push({ x: boss.x, y: boss.y, size: 10, type: 4, vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8 });
                boss.cooldown = 100;
            } else {
                boss.cooldown--;
            }
        } else if (boss.type === 2) {
            // Boss that chases the cursor
            let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            boss.x += Math.cos(angle) * 2;
            boss.y += Math.sin(angle) * 2;
        }
    });

    // Check if player is hit
    [...enemies, ...bosses].forEach((enemy) => {
        if (collision(player, enemy)) {
            gameOver = true;
            alert("Game Over! Refresh to play again.");
        }
    });

    if (Math.random() < 0.02) spawnEnemy();
}

// Check collision
function collision(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < a.size + b.size;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
    });

    enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
    });

    bosses.forEach((boss) => {
        ctx.fillStyle = boss.type === 0 ? "blue" : boss.type === 1 ? "purple" : "orange";
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Shop system
function openShop() {
    shop.classList.remove("hidden");
    shopOpen = true;
    let items = shopItems.sort(() => Math.random() - 0.5).slice(0, 2);
    item1Btn.innerText = `${items[0].name} ($${items[0].cost})`;
    item1Btn.onclick = () => buyItem(items[0]);
    item2Btn.innerText = `${items[1].name} ($${items[1].cost})`;
    item2Btn.onclick = () => buyItem(items[1]);
}

function closeShop() {
    shop.classList.add("hidden");
    shopOpen = false;
}

function buyItem(item) {
    if (money >= item.cost) {
        money -= item.cost;
        updateMoney();
        item.effect();
        openShop();
    }
}

function updateMoney() {
    moneyDisplay.innerText = money;
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

gameLoop();
