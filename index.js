const shopItems = [
    { name: "Skip to Boss", cost: 30, effect: () => spawnBoss() },
    { name: "+1 Projectile", cost: 20, effect: () => upgrades.extraProjectiles++ },
    { name: "Homing Shot", cost: 40, effect: () => upgrades.homing = true },
    { name: "Beam Skill (Press O)", cost: 50, effect: () => upgrades.beamUnlocked = true },
    { name: "Faster Shooting", cost: 25, effect: () => upgrades.shootCooldown = Math.max(200, upgrades.shootCooldown - 200) },
    { name: "Bigger Bullets", cost: 30, effect: () => upgrades.bulletSize += 5 },
    { name: "Shield Skill (Press I)", cost: 50, effect: () => upgrades.shieldUnlocked = true },
    { name: "Slow Motion Skill (Press P)", cost: 35, effect: () => upgrades.slowMoUnlocked = true },
    { name: "Double Money (10 kills)", cost: 40, effect: activateDoubleMoney },
    { name: "Piercing Bullets", cost: 45, effect: () => upgrades.piercing = true },
    { name: "Explosive Shots", cost: 60, effect: () => upgrades.explosive = true },
    { name: "Extra Life", cost: 80, effect: () => upgrades.extraLife++ },
    { name: "Faster Enemies", cost: 25, effect: () => upgrades.enemySpeed *= 1.2 },
    { name: "Auto-Fire", cost: 50, effect: () => upgrades.autoFire = true }
];

let upgrades = {
    extraProjectiles: 0,
    homing: false,
    beamUnlocked: false,
    shieldUnlocked: false,
    slowMoUnlocked: false,
    shootCooldown: 1000,
    bulletSize: 5,
    shieldActive: false,
    slowMoActive: false,
    doubleMoneyActive: false,
    doubleMoneyCount: 10,
    piercing: false,
    explosive: false,
    extraLife: 0,
    enemySpeed: 1,
    autoFire: false
};

let player = { x: canvas.width / 2, y: canvas.height / 2, size: 10 };  // Player as a ball
let bullets = [];
let enemies = [];
let money = 0;
let shopOpen = false;
let canShoot = true;

document.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

document.addEventListener("keydown", (e) => {
    if (shopOpen && e.key !== "j") return;
    if (["w", "a", "s", "d"].includes(e.key)) {
        shoot(e.key);
        if (upgrades.autoFire) setInterval(() => shoot(e.key), upgrades.shootCooldown);
    }
    if (e.key === "k") openShop();
    if (e.key === "j") closeShop();
    if (e.key === "p") activateSlowMotion();
    if (e.key === "i") activateShield();
    if (e.key === "o") activateBeam();
});

function spawnEnemy() {
    let type = Math.floor(Math.random() * 3);
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let size = 20 + Math.random() * 20;
    enemies.push({ x, y, size, type, vx: 0, vy: 0, lastDash: 0 });
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
                if (bullet.explosive) {
                    enemies.splice(ei, 1);
                    bullets.splice(bi, 1);
                    updateMoney();
                    return;
                }
                if (bullet.piercing) {
                    enemies.splice(ei, 1);
                    updateMoney();
                    return;
                }
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
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
            if (Date.now() - enemy.lastDash > 3000) {
                enemy.lastDash = Date.now();
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
            if (upgrades.shieldActive) return;
            if (upgrades.extraLife > 0) {
                upgrades.extraLife--;
                return;
            }
            alert("Game Over! Refresh to restart.");
            location.reload();
        }
    });

    if (Math.random() < 0.05) spawnEnemy();
}

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

    bullets.push({ x: player.x, y: player.y, vx, vy, size: bulletSize, piercing: upgrades.piercing, explosive: upgrades.explosive });

    for (let i = 0; i < upgrades.extraProjectiles; i++) {
        bullets.push({ x: player.x, y: player.y, vx: vx * 1.2, vy: vy * 1.2, size: bulletSize, piercing: upgrades.piercing, explosive: upgrades.explosive });
    }
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

function updateMoney() {
    document.getElementById("money").innerText = `$${money}`;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
