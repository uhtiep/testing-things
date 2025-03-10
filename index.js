const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width / 2, y: canvas.height / 2, size: 10 };  // Player as a ball
let bullets = [];
let enemies = [];
let money = 0;
let shopOpen = false;
let canShoot = true;
let upgrades = {
    extraProjectiles: 0,
    homing: false,
    shootCooldown: 1000,
    bulletSize: 5,
    extraLife: 0,
    enemySpeed: 1,
    autoFire: false,
    piercing: false,
    explosive: false
};

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

function collision(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.size + obj2.size) / 2;
}

function updateMoney() {
    document.getElementById("money").innerText = `$${money}`;
}

function openShop() {
    shopOpen = true;
    updateShop();
    document.getElementById("shop").style.display = "block";
}

function closeShop() {
    shopOpen = false;
    document.getElementById("shop").style.display = "none";
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

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

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
