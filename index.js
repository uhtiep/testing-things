const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 800;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Player setup
const player = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  size: 20,
  speed: 5,
  color: "cyan",
  colorChangeTimer: 0,
  shootingCooldown: 0,
  dashing: false,
  dashCooldown: 0,
  beamActive: false,
};

// Enemy & obstacle setup
const enemies = [];
const obstacles = [];
let score = 0;
let enemyCount = 0;
const enemySpeed = 2;
const obstacleSpeed = 3;
let bossActive = false;

// Controls
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

// Dash ability
function dash() {
  if (player.dashCooldown === 0) {
    player.dashing = true;
    player.dashCooldown = 100;
  }
}

// Player movement & color change
function movePlayer() {
  let speed = player.speed;
  if (player.dashing) speed *= 3;

  if (keys.left) player.x -= speed;
  if (keys.right) player.x += speed;
  if (keys.up) player.y -= speed;
  if (keys.down) player.y += speed;

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

// Enemy spawning
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

  if (enemyCount % 10 === 0) {
    spawnBoss();
  }
}

// Boss variations
function spawnBoss() {
  bossActive = true;
  const bossType = Math.floor(Math.random() * 3);
  let boss;

  if (bossType === 0) {
    boss = { x: WIDTH / 2, y: 50, size: 50, health: 5, type: "Shooter" };
  } else if (bossType === 1) {
    boss = { x: WIDTH / 2, y: 50, size: 50, health: 7, type: "Charger" };
  } else {
    boss = { x: WIDTH / 2, y: 50, size: 50, health: 10, type: "Splitter" };
  }

  enemies.push(boss);
}

// Enemy movement & destruction
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
    enemy.x += Math.cos(angle) * enemySpeed;
    enemy.y += Math.sin(angle) * enemySpeed;

    if (
      enemy.x < player.x + player.size &&
      enemy.x + enemy.size > player.x &&
      enemy.y < player.y + player.size &&
      enemy.y + enemy.size > player.y
    ) {
      alert("Game Over! You were hit.");
      window.location.reload();
    }
  });

  if (enemies.length === 0) bossActive = false;
}

// Beam Shooting
function shootBeam() {
  player.beamActive = true;

  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].y < player.y) {
      enemies[i].disintegrating = true;
      score += 10;
      player.beamActive = false;
      break;
    }
  }

  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].y < player.y) {
      obstacles[i].split = true;
      player.beamActive = false;
      break;
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  enemies.forEach((enemy) => {
    ctx.fillStyle = "white";
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  if (player.beamActive) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(player.x + player.size / 2, player.y);
    ctx.lineTo(player.x + player.size / 2, 0);
    ctx.stroke();
    player.beamActive = false;
  }

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// Game loop
function update() {
  movePlayer();
  moveEnemies();
  if (keys.shoot) shootBeam();
  if (keys.dash) dash();
  draw();
  requestAnimationFrame(update);
}

setInterval(createEnemy, 2000);
update();
j 