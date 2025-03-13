const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const player = {
  x: WIDTH / 2,
  y: HEIGHT - 50,
  size: 20,
  speed: 5,
  color: "cyan",
  colorChangeTimer: 0,
  shootingCooldown: 0,
  lastShotTime: 0,
  dashing: false,
  dashCooldown: 0,
  bullets: [],
  money: 0,
  shotsPerFire: 1,
  shotType: "normal",
};

const enemies = [];
const obstacles = [];
const bosses = [];
let score = 0;
let enemyCount = 0;
let bossActive = false;
let shopOpen = false;
let bossMoveTimer = 0;

let keys = { left: false, right: false, up: false, down: false, shoot: false, dash: false, shop: false };

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
  if (e.key === "x") keys.shoot = true;
  if (e.key === "z") keys.dash = true;
  if (e.key === "k") shopOpen = true;
  if (e.key === "j") shopOpen = false;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
  if (e.key === "x") keys.shoot = false;
  if (e.key === "z") keys.dash = false;
});

function dash() {
  if (player.dashCooldown === 0) {
    player.dashing = true;
    player.dashCooldown = 100;
  }
}

function movePlayer() {
  let speed = player.speed;
  if (player.dashing) speed *= 3;

  if (keys.left) player.x -= speed;
  if (keys.right) player.x += speed;
  if (keys.up) player.y -= speed;
  if (keys.down) player.y += speed;

  if (player.x < 0) player.x = 0;
  if (player.x > WIDTH - player.size) player.x = WIDTH - player.size;
  if (player.y < 0) player.y = 0;
  if (player.y > HEIGHT - player.size) player.y = HEIGHT - player.size;

  if (player.dashing) {
    player.dashing = false;
  }

  if (player.dashCooldown > 0) player.dashCooldown--;

  player.colorChangeTimer++;
  if (player.colorChangeTimer > 5) {
    const colors = ["cyan", "magenta", "yellow", "green", "red", "blue", "white"];
    player.color = colors[Math.floor(Math.random() * colors.length)];
    player.colorChangeTimer = 0;
  }
}

function createEnemy() {
  if (bossActive) return;
  let enemyX = Math.random() * WIDTH;
  let enemyY = Math.random() * HEIGHT;
  while (Math.abs(player.x - enemyX) < 50 && Math.abs(player.y - enemyY) < 50) {
    enemyX = Math.random() * WIDTH;
    enemyY = Math.random() * HEIGHT;
  }
  enemies.push({ x: enemyX, y: enemyY, size: 20, health: 1, disintegrating: false });
  enemyCount++;
  if (enemyCount % 10 === 0) spawnBoss();
}

function spawnBoss() {
  bossActive = true;
  enemies.length = 0; // Remove all enemies
  const boss = { x: WIDTH / 2, y: 50, size: 50, health: 10 };
  bosses.push(boss);
}

function moveEnemies() {
  enemies.forEach((enemy, index) => {
    if (enemy.disintegrating) {
      enemy.size -= 2;
      if (enemy.size <= 0) enemies.splice(index, 1);
      return;
    }
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const angle = Math.atan2(dy, dx);
    enemy.x += Math.cos(angle) * 2;
    enemy.y += Math.sin(angle) * 2;
  });
  if (enemies.length === 0) bossActive = false;
}

function shootBullet() {
  const now = Date.now();
  if (now - player.lastShotTime >= 1000) { // 1-second cooldown
    player.lastShotTime = now;
    for (let i = 0; i < player.shotsPerFire; i++) {
      player.bullets.push({ x: player.x + player.size / 2, y: player.y, speed: -5, type: player.shotType });
    }
  }
}

function moveBullets() {
  player.bullets.forEach((bullet, bulletIndex) => {
    bullet.y += bullet.speed;
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x > enemy.x &&
        bullet.x < enemy.x + enemy.size &&
        bullet.y > enemy.y &&
        bullet.y < enemy.y + enemy.size
      ) {
        enemy.health--;
        if (enemy.health <= 0) {
          enemy.disintegrating = true;
          player.money++;
          score += 10;
        }
        player.bullets.splice(bulletIndex, 1);
      }
    });
  });
}

function moveBoss() {
  if (bosses.length > 0) {
    let boss = bosses[0];

    if (Math.random() < 0.02) {
      boss.x = Math.max(0, boss.x - 100);
    }

    if (bossMoveTimer % 120 === 0) {
      for (let i = 0; i < 2; i++) {
        let platform = {
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT,
          width: 60,
          height: 10,
          speedX: (Math.random() - 0.5) * 4,
          speedY: (Math.random() - 0.5) * 4,
        };
        obstacles.push(platform);
      }
    }

    bossMoveTimer++;
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  enemies.forEach((enemy) => {
    ctx.fillStyle = "white";
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  bosses.forEach((boss) => {
    ctx.fillStyle = "red";
    ctx.fillRect(boss.x, boss.y, boss.size, boss.size);
    ctx.fillStyle = "white";
    ctx.fillRect(50, 20, 200, 10);
    ctx.fillStyle = "red";
    ctx.fillRect(50, 20, (boss.health / 10) * 200, 10);
  });

  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  player.bullets.forEach((bullet) => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Money: $" + player.money, 10, 40);
}

function update() {
  movePlayer();
  moveEnemies();
  moveBullets();
  moveBoss();
  if (keys.shoot) shootBullet();
  if (keys.dash) dash();
  draw();
  requestAnimationFrame(update);
}

setInterval(createEnemy, 2000);
update();
