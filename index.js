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

function activateSlowMotion() {
    if (!upgrades.slowMoUnlocked || upgrades.slowMoActive) return;
    upgrades.slowMoActive = true;
    upgrades.shootCooldown *= 2;
    setTimeout(() => {
        upgrades.slowMoActive = false;
        upgrades.shootCooldown /= 2;
    }, 5000);
}

function activateShield() {
    if (!upgrades.shieldUnlocked || upgrades.shieldActive) return;
    upgrades.shieldActive = true;
    setTimeout(() => upgrades.shieldActive = false, 5000);
}

function activateBeam() {
    if (!upgrades.beamUnlocked) return;
    bullets.push({ x: player.x, y: player.y, vx: 0, vy: -15, size: 50, beam: true });
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
            boss.x += Math.cos(angle) * 2 * upgrades.enemySpeed;
            boss.y += Math.sin(angle) * 2 * upgrades.enemySpeed;
        }
        boss.cooldown--;
    });

    enemies.forEach((enemy) => {
        enemy.x += (Math.random() - 0.5) * upgrades.enemySpeed;
        enemy.y += (Math.random() - 0.5) * upgrades.enemySpeed;
    });

    [...enemies, ...bosses].forEach((enemy) => {
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

    if (Math.random() < 0.02) spawnEnemy();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
