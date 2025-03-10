const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2, y: canvas.height / 2, size: 20 };
let bullets = [];
let enemies = [];
let money = 0;
let kills = 0;
let shopOpen = false;
let lastShotTime = 0;
let lastEnemySpawnTime = 0;
let upgrades = { extraProjectiles: 0, homing: false, shootCooldown: 1000, bulletSize: 5, enemySpeed: 1 };
let showControls = false;

document.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

document.addEventListener("keydown", (e) => {
    if (shopOpen && e.key !== "j") return;
    if (e.key === "k") openShop();
    if (e.key === "j") closeShop();
    if (e.key === "p") activateSlowMotion();
    if (e.key === "i") activateShield();
    if (e.key === "o") activateBeam();
    if (e.key === "n") toggleControls();

    if (["w", "a", "s", "d"].includes(e.key)) {
        if (Date.now() - lastShotTime > upgrades.shootCooldown) {
            shoot(e.key);
            lastShotTime = Date.now();
        }
    }
});

function spawnEnemy() {
    let randomNumber = Math.random() * 100;
    let enemyType = randomNumber < 30 ? 2 : (randomNumber < 50 ? 0 : 1);
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let size = 20 + Math.random() * 20;
    enemies.push({ x, y, size, type: enemyType, vx: 0, vy: 0 });
}

function update() {
    if (shopOpen) return;

    bullets.forEach((bullet, bi) => {
        enemies.forEach((enemy, ei) => {
            if (collision(bullet, enemy)) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                kills++;
                money += 1;
                updateMoney();
                if (kills % 25 === 0) spawnBoss();
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

    if (Date.now() - lastEnemySpawnTime > 2000) {
        spawnEnemy();
        lastEnemySpawnTime = Date.now();
    }
}

function collision(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.size + obj2.size) / 2;
}

function shoot(direction) {
    let speed = 10;
    let vx = 0, vy = 0;
    let bulletSize = upgrades.bulletSize;

    if (direction === "w") vy = -speed;
    if (direction === "s") vy = speed;
    if (direction === "a") vx = -speed;
    if (direction === "d") vx = speed;

    bullets.push({ x: player.x, y: player.y, vx, vy, size: bulletSize });

    for (let i = 0; i < upgrades.extraProjectiles; i++) {
        bullets.push({ x: player.x, y: player.y, vx: vx * 1.2, vy: vy * 1.2, size: bulletSize });
    }

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

function updateMoney() {
    document.getElementById("money").innerText = `Money: $${money}`;
}

function openShop() {
    shopOpen = true;
    document.getElementById("shop").style.display = "block";
}

function closeShop() {
    shopOpen = false;
    document.getElementById("shop").style.display = "none";
}

function toggleControls() {
    showControls = !showControls;
    document.getElementById("controls").style.display = showControls ? 'block' : 'none';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();

    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    });

    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fillStyle = enemy.type === 3 ? "#FFD700" : "#0000FF";
        ctx.fill();
    });

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

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
