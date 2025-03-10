const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bullets = [];
const enemies = [];
const bosses = [];
let ballCount = 0;
let gameOver = false;

// Player (Cursor)
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    color: "white",
};

// Track cursor movement
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

// Handle shooting with WASD
document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    const speed = 5;
    let vx = 0, vy = 0;

    if (e.key === "w") vy = -speed;
    if (e.key === "s") vy = speed;
    if (e.key === "a") vx = -speed;
    if (e.key === "d") vx = speed;

    if (vx !== 0 || vy !== 0) {
        bullets.push({ x: player.x, y: player.y, vx, vy, size: 5, color: "yellow" });
    }
});

// Spawn enemies randomly
function spawnEnemy() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push({ x, y, size: 15, color: "red" });
    ballCount++;

    if (ballCount % 50 === 0) spawnBoss();
}

// Spawn bosses every 50 enemies
function spawnBoss() {
    const bossType = Math.floor(Math.random() * 3); // 0, 1, or 2
    bosses.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 30, type: bossType, cooldown: 0 });
}

// Update game state
function update() {
    if (gameOver) return;

    // Update bullets
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
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullet.size + enemy.size) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
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
                    x: boss.x, y: boss.y, size: 10, type: 3, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
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
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size + enemy.size) {
            gameOver = true;
            alert("Game Over! Refresh to play again.");
        }
    });

    // Spawn new enemies
    if (Math.random() < 0.02) spawnEnemy();
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw bullets
    bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
    });

    // Draw enemies
    enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw bosses
    bosses.forEach((boss) => {
        ctx.fillStyle = boss.type === 0 ? "blue" : boss.type === 1 ? "purple" : "orange";
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
