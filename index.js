const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let money = 0;
let enemies = [];
let bosses = [];
let bullets = [];
let canShoot = true;
let ballCount = 0;
let shopOpen = false;

let upgrades = {
    extraProjectiles: 0,
    homing: false,
    beam: false,
    shootCooldown: 1000,
    bulletSize: 5,
    shieldActive: false,
    slowMotionActive: false,
    doubleMoneyActive: false,
    doubleMoneyCount: 10
};

const shopItems = [
    { name: "Skip to Boss", cost: 30, effect: () => spawnBoss() },
    { name: "+1 Projectile", cost: 20, effect: () => upgrades.extraProjectiles++ },
    { name: "Homing Shot", cost: 40, effect: () => upgrades.homing = true },
    { name: "Beam Shot", cost: 50, effect: () => upgrades.beam = true },
    { name: "Faster Shooting", cost: 25, effect: () => upgrades.shootCooldown = Math.max(200, upgrades.shootCooldown - 200) },
    { name: "Bigger Bullets", cost: 30, effect: () => upgrades.bulletSize += 5 },
    { name: "Shield (5s)", cost: 50, effect: activateShield },
    { name: "Slow Motion (5s)", cost: 35, effect: activateSlowMotion },
    { name: "Double Money (10 kills)", cost: 40, effect: activateDoubleMoney }
];

const player = { x: canvas.width / 2, y: canvas.height / 2, size: 10 };

canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

document.addEventListener("keydown", (e) => {
    if (shopOpen && e.key !== "j") return;
    
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") shoot(e.key);
    if (e.key === "k") openShop();
    if (e.key === "j") closeShop();
});

function shoot(direction) {
    if (!canShoot) return;
    canShoot = false;
    setTimeout(() => canShoot = true, upgrades.shootCooldown);

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

function spawnEnemy() {
    enemies.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 15 });
    ballCount++;
    if (ballCount % 50 === 0) spawnBoss();
}

function spawnBoss() {
    bosses.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 30, type: Math.floor(Math.random() * 3), cooldown: 0 });
}

function update() {
    if (shopOpen) return;

    bullets.forEach((bullet, i) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) bullets.splice(i, 1);
    });

    bullets.forEach((bullet, bi) => {
        enemies.forEach((enemy, ei) => {
            if (collision(bullet, enemy)) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                updateMoney();
            }
        });
    });

    bosses.forEach((boss) => {
        if (boss.type === 0 && boss.cooldown <= 0) {
            let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            bullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, size: 10 });
            boss.cooldown = 60;
        } else if (boss.type === 1 && boss.cooldown <= 0) {
            let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            bullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8, size: 10 });
            boss.cooldown = 100;
        } else if (boss.type === 2) {
            let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            boss.x += Math.cos(angle) * 2;
            boss.y += Math.sin(angle) * 2;
        }
        boss.cooldown--;
    });

    [...enemies, ...bosses].forEach((enemy) => {
        if (collision(player, enemy) && !upgrades.shieldActive) {
            alert("Game Over! Refresh to restart.");
            location.reload();
        }
    });

    if (Math.random() < 0.02) spawnEnemy();
}

function collision(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y) < a.size + b.size;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    bullets.forEach(b => { ctx.fillStyle = "yellow"; ctx.fillRect(b.x, b.y, b.size, b.size); });
    enemies.forEach(e => { ctx.fillStyle = "red"; ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2); ctx.fill(); });
}

function updateMoney(amount = 1) {
    if (upgrades.doubleMoneyActive) {
        amount = 2;
        upgrades.doubleMoneyCount--;
        if (upgrades.doubleMoneyCount <= 0) upgrades.doubleMoneyActive = false;
    }
    money += amount;
    document.getElementById("money").innerText = `Money: $${money}`;
}

function openShop() {
    document.getElementById("shop").style.display = "block";
    shopOpen = true;
    updateShop();
}

function closeShop() {
    document.getElementById("shop").style.display = "none";
    shopOpen = false;
}

function updateShop() {
    let item1 = shopItems[Math.floor(Math.random() * shopItems.length)];
    let item2 = shopItems[Math.floor(Math.random() * shopItems.length)];

    document.getElementById("item1").innerText = `${item1.name} - $${item1.cost}`;
    document.getElementById("item1").onclick = function() { buyItem(item1); };

    document.getElementById("item2").innerText = `${item2.name} - $${item2.cost}`;
    document.getElementById("item2").onclick = function() { buyItem(item2); };
}

function buyItem(item) {
    if (money >= item.cost) {
        money -= item.cost;
        item.effect();
        updateMoney();
        updateShop();
    }
}

function activateShield() {
    upgrades.shieldActive = true;
    setTimeout(() => upgrades.shieldActive = false, 5000);
}

function activateSlowMotion() {
    upgrades.slowMotionActive = true;
    setTimeout(() => upgrades.slowMotionActive = false, 5000);
}

function activateDoubleMoney() {
    upgrades.doubleMoneyActive = true;
    upgrades.doubleMoneyCount = 10;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
