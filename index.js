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
  shootingCooldown: 0,
  beamActive: false,
  colorChangeTimer: 0,
};

// Enemy & obstacle setup
const enemies = [];
const obstacles = [];
const enemySpeed = 2;
const obstacleSpeed = 3;

// Glitch effects
const glitches = [];
const glitchEffects = ["screenTeardown", "memoryLeak", "errorInjection", "pixelCorruption"];

// Controls
let keys = { left: false, right: false, up: false, down: false, shoot: false };

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
  if (e.key === " ") keys.shoot = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
  if (e.key === " ") keys.shoot = false;
});

// Glitch Effects
function triggerGlitch() {
  const glitchType = glitchEffects[Math.floor(Math.random() * glitchEffects.length)];
  glitches.push({ type: glitchType, intensity: Math.random() * 0.7, timer: 200 });
}

function applyGlitchEffects() {
  glitches.forEach((glitch, index) => {
    if (glitch.type === "screenTeardown") {
      ctx.fillStyle = `rgba(0, 0, 0, ${glitch.intensity})`;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    } else if (glitch.type === "memoryLeak") {
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 80, 80);
      }
    } else if (glitch.type === "errorInjection") {
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("ERROR", Math.random() * WIDTH, Math.random() * HEIGHT);
    } else if (glitch.type === "pixelCorruption") {
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = "black";
        ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 5, 5);
      }
    }

    glitch.timer--;
    if (glitch.timer <= 0) glitches.splice(index, 1);
  });
}

// Player movement & color change
function movePlayer() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  if (keys.up) player.y -= player.speed;
  if (keys.down) player.y += player.speed;

  player.colorChangeTimer++;
  if (player.colorChangeTimer > 5) { 
    const colors = ["cyan", "magenta", "yellow", "green", "red", "blue", "white"];
    player.color = colors[Math.floor(Math.random() * colors.length)];
    player.colorChangeTimer = 0;
  }
}

// Enemy spawning
function createEnemy() {
  let enemyX = Math.random() * WIDTH;
  let enemyY = Math.random() * HEIGHT;

  while (Math.abs(player.x - enemyX) < 50 && Math.abs(player.y - enemyY) < 50) {
    enemyX = Math.random() * WIDTH;
    enemyY = Math.random() * HEIGHT;
  }

  enemies.push({ x: enemyX, y: enemyY, size: 20, health: 1, color: "white", disintegrating: false });
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
}

// Falling obstacles
function createObstacle() {
  obstacles.push({ x: Math.random() * WIDTH, y: 0, width: 50, height: 10, split: false });
}

function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    if (obstacle.split) {
      obstacle.width /= 2;
      if (obstacle.width < 5) obstacles.splice(index, 1);
      return;
    }
    obstacle.y += obstacleSpeed;
    if (obstacle.y > HEIGHT) obstacles.splice(index, 1);
  });
}

// Beam Shooting
function shootBeam() {
  player.beamActive = true;
  
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].y < player.y) {
      enemies[i].disintegrating = true;
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
  
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  obstacles.forEach(obstacle => {
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

  applyGlitchEffects();
}

// Game loop
function update() {
  movePlayer();
  moveEnemies();
  moveObstacles();
  if (keys.shoot) shootBeam();
  draw();
  requestAnimationFrame(update);
}

setInterval(createEnemy, 2000);
setInterval(createObstacle, 3000);
setInterval(triggerGlitch, 5000);
update();
