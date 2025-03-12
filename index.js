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
  colorTimer: 0, // Timer for color change
  shootingCooldown: 0,
};

// Projectile setup
const projectiles = [];
const projectileSpeed = 8;
const projectileSize = 5;

// Enemies setup
const enemies = [];
const enemySpeed = 2; // Slower enemy speed
const enemyHealthBase = 1;
let score = 0;

// Obstacles setup (falling platforms)
const obstacles = [];
const obstacleSpeed = 3; // Speed at which platforms fall

// Glitch effects
const glitchEffects = [
  "screenTeardown", "memoryLeak", "errorInjection", "pixelCorruption"
];

let glitches = [];

// Player movement
let keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  shoot: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
  if (e.key === " ") keys.shoot = true; // Spacebar to shoot
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
  if (e.key === " ") keys.shoot = false; // Stop shooting
});

// Glitch Effects
function triggerGlitch() {
  const glitchType = glitchEffects[Math.floor(Math.random() * glitchEffects.length)];
  glitches.push({ type: glitchType, intensity: Math.random() * 0.5 });
}

function applyGlitchEffects() {
  glitches.forEach((glitch, index) => {
    if (glitch.type === "screenTeardown") {
      ctx.fillStyle = "rgba(0, 0, 0, " + glitch.intensity + ")";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    } else if (glitch.type === "memoryLeak") {
      ctx.fillStyle = "rgba(255, 0, 0, " + glitch.intensity + ")";
      ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 100, 100);
    } else if (glitch.type === "errorInjection") {
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.fillText("ERROR", Math.random() * WIDTH, Math.random() * HEIGHT);
    } else if (glitch.type === "pixelCorruption") {
      ctx.clearRect(Math.random() * WIDTH, Math.random() * HEIGHT, 10, 10);
    }

    glitch.intensity -= 0.01;
    if (glitch.intensity <= 0) glitches.splice(index, 1);
  });
}

// Player Movement
function movePlayer() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  if (keys.up) player.y -= player.speed;
  if (keys.down) player.y += player.speed;
}

// Change player color (simulate glitching)
function changePlayerColor() {
  const colors = ["cyan", "magenta", "yellow", "green", "red", "blue"];
  player.color = colors[Math.floor(Math.random() * colors.length)];
}

// Enemy creation
function createEnemy() {
  let enemyX = Math.random() * WIDTH;
  let enemyY = Math.random() * HEIGHT;

  // Prevent enemies from spawning on top of the player
  while (Math.abs(player.x - enemyX) < 50 && Math.abs(player.y - enemyY) < 50) {
    enemyX = Math.random() * WIDTH;
    enemyY = Math.random() * HEIGHT;
  }

  const enemy = {
    x: enemyX,
    y: enemyY,
    size: 20,
    health: enemyHealthBase,
    color: "white",
  };
  enemies.push(enemy);
}

// Move enemies and check collisions
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 200) {
      const angle = Math.atan2(dy, dx);
      enemy.x += Math.cos(angle) * enemySpeed;
      enemy.y += Math.sin(angle) * enemySpeed;
    }

    // Collision detection with player
    if (
      enemy.x < player.x + player.size &&
      enemy.x + enemy.size > player.x &&
      enemy.y < player.y + player.size &&
      enemy.y + enemy.size > player.y
    ) {
      // Player is hit by an enemy
      alert("Game Over! You were hit by a glitch enemy.");
      window.location.reload(); // Restart the game
    }

    // Enemy health and destruction
    if (enemy.health <= 0) {
      enemies.splice(index, 1);
      score += 10; // Increase score when enemy is destroyed
    }
  });
}

// Shoot projectiles
function shootProjectile() {
  if (player.shootingCooldown <= 0) {
    const projectile = {
      x: player.x + player.size / 2,
      y: player.y,
      dx: Math.cos(Math.PI / 2) * projectileSpeed,
      dy: -Math.sin(Math.PI / 2) * projectileSpeed,
      size: projectileSize,
    };
    projectiles.push(projectile);
    player.shootingCooldown = 10; // Cooldown for shooting
  }
}

// Move projectiles and check for collisions
function moveProjectiles() {
  projectiles.forEach((projectile, index) => {
    projectile.x += projectile.dx;
    projectile.y += projectile.dy;

    // Check for collisions with enemies
    enemies.forEach((enemy) => {
      if (
        projectile.x < enemy.x + enemy.size &&
        projectile.x + projectile.size > enemy.x &&
        projectile.y < enemy.y + enemy.size &&
        projectile.y + projectile.size > enemy.y
      ) {
        enemy.health -= 1;
        projectiles.splice(index, 1);
      }
    });

    // Remove projectiles off-screen
    if (projectile.x < 0 || projectile.x > WIDTH || projectile.y < 0 || projectile.y > HEIGHT) {
      projectiles.splice(index, 1);
    }
  });
}

// Create obstacles (falling platforms)
function createObstacle() {
  const obstacle = {
    x: Math.random() * WIDTH,
    y: -50, // Start above the screen
    width: 100 + Math.random() * 100, // Random width for variety
    height: 20,
    color: "red",
  };
  obstacles.push(obstacle);
}

// Move obstacles (falling)
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacleSpeed;

    // Check for collisions with player
    if (
      obstacle.x < player.x + player.size &&
      obstacle.x + obstacle.width > player.x &&
      obstacle.y < player.y + player.size &&
      obstacle.y + obstacle.height > player.y
    ) {
      alert("Game Over! You hit a falling platform.");
      window.location.reload(); // Restart the game
    }

    // Remove obstacles when they go off-screen
    if (obstacle.y > HEIGHT) {
      obstacles.splice(index, 1);
    }
  });
}

// Draw everything
function drawEntities() {
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Draw enemies
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });

  // Draw projectiles
  projectiles.forEach((projectile) => {
    ctx.fillStyle = "white";
    ctx.fillRect(projectile.x, projectile.y, projectile.size, projectile.size);
  });

  // Draw obstacles (falling platforms)
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Apply glitch effects
  applyGlitchEffects();

  // Move the player
  movePlayer();

  // Change player color rapidly (simulate glitching)
  player.colorTimer += 1;
  if (player.colorTimer > 10) {
    changePlayerColor();
    player.colorTimer = 0;
  }

  // Move enemies and check collisions
  moveEnemies();

  // Shoot projectiles
  if (keys.shoot) shootProjectile();

  // Move projectiles
  moveProjectiles();

  // Create obstacles (falling platforms)
  if (Math.random() < 0.02) createObstacle();

  // Move obstacles
  moveObstacles();

  // Randomly trigger a glitch every 3 seconds
  if (Math.random() < 0.01) triggerGlitch();

  // Draw everything
  drawEntities();

  requestAnimationFrame(gameLoop);
}

gameLoop();
