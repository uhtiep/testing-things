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
};

// Enemies setup
const enemies = [];
const enemySpeed = 1.5;

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
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
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
  const enemy = {
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    size: 20,
    color: "white",
  };
  enemies.push(enemy);
}

// Enemy movement and collision detection
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

    // Check for collision with the player
    if (
      enemy.x < player.x + player.size &&
      enemy.x + enemy.size > player.x &&
      enemy.y < player.y + player.size &&
      enemy.y + enemy.size > player.y
    ) {
      // Enemy hit the player, reset the game
      alert("Game Over! You were hit by a glitch enemy.");
      window.location.reload(); // Restart the game
    }
  });
}

// Draw player and enemies
function drawEntities() {
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Draw enemies
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });
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

  // Move and check enemies
  moveEnemies();

  // Draw everything
  drawEntities();

  // Randomly trigger a glitch every 3 seconds
  if (Math.random() < 0.01) triggerGlitch();

  // Randomly create new enemies
  if (Math.random() < 0.02) createEnemy();

  requestAnimationFrame(gameLoop);
}

gameLoop();
