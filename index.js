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
let upgrades = { extraProjectiles: 0, homing: false, beam: false };
let shopItems = [
    { name: "Skip to Boss", cost: 30, effect: () => spawnBoss() },
    { name: "+1 Projectile", cost: 20, effect: () => upgrades.extraProjectiles++ },
    { name: "Homing Shot", cost: 40, effect: () => upgrades.homing = true },
    { name: "Beam Shot", cost: 50, effect: () => upgrades.beam = true }
];

const player = { x: canvas.width / 2, y: canvas.height / 2, size: 10 };

canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

document.addEventListener("keydown", (e) => {
    if (shopOpen) return;
    if (["w", "a", "s", "d"].includes(e.key) && canShoot) shoot(e.key);
    if (e.key === "k") openShop();
    if (e.key === "j") closeShop();
});

function shoot(direction) {
    canShoot = false;
    setTimeout(() => canShoot = true, 1000);
    let speed = 10;
    let vx = 0, vy = 0;

    if (direction === "w") vy = -speed;
    if (direction === "s") vy = speed;
    if (direction === "a") vx = -speed;
    if (direction === "d") vx = speed;

    bullets.push({ x: player.x, y: player.y, vx, vy, size: 5 });

    for (let i = 0; i < upgrades.extraProjectiles; i++) {
        bullets.push({ x: player.x, y: player.y, vx: vx * 1.2, vy: vy * 1.2, size: 5 });
    }
}

function spawnEnemy() {
    enemies.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        size: 15 
    });
    ballCount++;

    if (ballCount % 50 === 0) spawnBoss();
}

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

function update() {
    if (shopOpen) return;

    bullets.forEach((bullet, index) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

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

    bosses.forEach((boss) => {
        if (boss.type === 0) {
            if (boss.cooldown <= 0) {
                let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, size: 10 });
                boss.cooldown = 60;
            } else {
                boss.cooldown--;
            }
        } else if (boss.type === 1) {
            if (boss.cooldown <= 0) {
                let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8, size: 10 });
                boss.cooldown = 100;
            } else {
                boss.cooldown--;
            }
        } else if (boss.type === 2) {
            let angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            boss.x += Math.cos(angle) * 2;
            boss.y += Math.sin(angle) * 2;
        }
    });

    [...enemies, ...bosses].forEach((enemy) => {
        if (collision(player, enemy)) {
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

    bullets.forEach(bullet => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
    });

    enemies.forEach(enemy => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateMoney() {
    document.getElementById("money").innerText = `Money: $${money}`;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
