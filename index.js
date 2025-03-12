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
};

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

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Apply glitch effects
  applyGlitchEffects();

  // Move the player
  movePlayer();

  // Draw the player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Randomly trigger a glitch every 3 seconds
  if (Math.random() < 0.01) triggerGlitch();

  requestAnimationFrame(gameLoop);
}

gameLoop();
