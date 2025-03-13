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
let platforms = [];
let bosses = [];
let score = 0;
let enemyCount = 0;
let bossActive = false;
let bossMoveTimer = 0;

let keys = { left: false, right: false, up: false, down: false, shoot: false, dash: false };

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
  if (e.key === "x") keys.shoot = true;
  if (e.key === "z") keys.dash = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
  if (e.key === "x") keys.shoot = false;
  if (e.key === "z") keys.dash = false;
});

function movePlayer() {
  let speed = player.speed;
  if (player.dashing) speed *= 3;

  let nextX = player.x;
  let nextY = player.y;

  if (keys.left) nextX -= speed;
  if (keys.right) nextX += speed;
  if (keys.up) nextY -= speed;
  if (keys.down) nextY += speed;

  if (!checkCollision(nextX, nextY, player.size, player.size)) {
    player.x = nextX;
    player.y = nextY;
  }

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
  spawnPlatforms();
}

function spawnPlatforms() {
  platforms = [];
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: Math.random() * (WIDTH - 60),
      y: Math.random() * (HEIGHT - 100) + 50,
      width: 60,
      height: 10,
      speedX: 0,
      speedY: 0,
    });
  }
}

function moveBoss() {
  if (bosses.length > 0) {
    let boss = bosses[0];

    if (Math.random() < 0.005) { // Small chance to teleport left
      boss.x = Math.max(0, boss.x - 100);
    }

    if (bossMoveTimer % 120 === 0) {
      for (let i = 0; i < 2; i++) {
        let platform = platforms[Math.floor(Math.random() * platforms.length)];
        platform.speedX = (Math.random() - 0.5) * 2;
        platform.speedY = (Math.random() - 0.5) * 2;
      }
    }

    bossMoveTimer++;
  }
}

function movePlatforms() {
  platforms.forEach((platform) => {
    platform.x += platform.speedX;
    platform.y += platform.speedY;
  });
}

function checkCollision(x, y, width, height) {
  for (let platform of platforms) {
    if (
      x < platform.x + platform.width &&
      x + width > platform.x &&
      y < platform.y + platform.height &&
      y + height > platform.y
    ) {
      return true;
    }
  }

  for (let boss of bosses) {
    if (
      x < boss.x + boss.size &&
      x + width > boss.x &&
      y < boss.y + boss.size &&
      y + height > boss.y
    ) {
      return true;
    }
  }

  return false;
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

  platforms.forEach((platform) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Money: $" + player.money, 10, 40);
}

function update() {
  movePlayer();
  moveBoss();
  movePlatforms();
  draw();
  requestAnimationFrame(update);
}

setInterval(createEnemy, 2000);
update();
