const audio = document.getElementById("bgm");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const playerHealthBar = document.getElementById("playerHealthBar");
const bossHealthBar = document.getElementById("bossHealthBar");

let keys = {};
let dashCooldown = true;
let canBlock = true;
let invincibleDuringDash = false;

let playerHP = 100;
let bossHP = 100;

function updateHealthBars() {
  playerHealthBar.style.width = `${Math.max(0, playerHP)}%`;
  bossHealthBar.style.width = `${Math.max(0, bossHP)}%`;
}

function takeDamage(amount) {
  if (!invincibleDuringDash) {
    playerHP -= amount;
    updateHealthBars();
    if (playerHP <= 0) {
      alert("You died!");
      location.reload();
    }
  }
}

function damageBoss(amount) {
  bossHP -= amount;
  updateHealthBars();
  if (bossHP <= 0) {
    alert("You win!");
    location.reload();
  }
}

let playerState = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  speed: 3,
  blocking: false,
  blockDir: null,
  isDashing: false
};

// Input Handling
document.addEventListener("keydown", e => {
  keys[e.key] = true;

  // Block
  if (e.key === "z" && canBlock) {
    const dir = getHeldDirection();
    if (dir) {
      playerState.blocking = true;
      playerState.blockDir = dir;
      player.classList.add("block");
      canBlock = false;

      setTimeout(() => {
        playerState.blocking = false;
        player.classList.remove("block");
        playerState.blockDir = null;
      }, 1000);

      setTimeout(() => canBlock = true, 5000);
    }
  }

  // Dash
  if (e.key === "x" && dashCooldown) {
    const dir = getHeldDirection();
    if (dir) {
      dashCooldown = false;
      invincibleDuringDash = true;
      playerState.isDashing = true;

      let dashX = 0, dashY = 0;
      if (dir === "up") dashY = -1;
      if (dir === "down") dashY = 1;
      if (dir === "left") dashX = -1;
      if (dir === "right") dashX = 1;

      playerState.x += dashX * 60;
      playerState.y += dashY * 60;
      updatePlayerPos();

      player.style.background = "#aaa";
      setTimeout(() => {
        player.style.background = "white";
        playerState.isDashing = false;
        invincibleDuringDash = false;
      }, 200);

      setTimeout(() => dashCooldown = true, 2000); // 2s cooldown
    }
  }
});

document.addEventListener("keyup", e => keys[e.key] = false);

function getHeldDirection() {
  if (keys["ArrowUp"]) return "up";
  if (keys["ArrowDown"]) return "down";
  if (keys["ArrowLeft"]) return "left";
  if (keys["ArrowRight"]) return "right";
  return null;
}

// Movement
function movePlayer() {
  if (keys["ArrowLeft"]) playerState.x -= playerState.speed;
  if (keys["ArrowRight"]) playerState.x += playerState.speed;
  if (keys["ArrowUp"]) playerState.y -= playerState.speed;
  if (keys["ArrowDown"]) playerState.y += playerState.speed;

  playerState.x = Math.max(0, Math.min(window.innerWidth - 20, playerState.x));
  playerState.y = Math.max(0, Math.min(window.innerHeight - 100, playerState.y));

  updatePlayerPos();
  requestAnimationFrame(movePlayer);
}

function updatePlayerPos() {
  player.style.left = `${playerState.x}px`;
  player.style.top = `${playerState.y}px`;
}

// Boss Tracking Logic
const boss = document.getElementById("enemy");
let bossState = {
  x: boss.offsetLeft,
  y: boss.offsetTop,
  speed: 2,
  health: 100,
  maxHealth: 100,
  attackCooldown: 3000, // 3 seconds cooldown between attacks
  lastAttackTime: 0
};

function moveBoss() {
  const playerCenterX = playerState.x + 10; // Player's center X
  const playerCenterY = playerState.y + 10; // Player's center Y

  const angle = Math.atan2(playerCenterY - bossState.y, playerCenterX - bossState.x);
  const dx = Math.cos(angle) * bossState.speed;
  const dy = Math.sin(angle) * bossState.speed;

  bossState.x += dx;
  bossState.y += dy;

  // Update boss position
  boss.style.left = `${bossState.x}px`;
  boss.style.top = `${bossState.y}px`;

  requestAnimationFrame(moveBoss);
}

function spawnBeam(x, y, width = 10, height = 200, delay = 1000) {
  const beam = document.createElement("div");
  beam.classList.add("shape");
  beam.style.left = `${x}px`;
  beam.style.top = `${y}px`;
  beam.style.width = `${width}px`;
  beam.style.height = `${height}px`;
  beam.style.background = "rgba(255, 0, 255, 0.3)"; // Initially transparent magenta
  gameArea.appendChild(beam);

  let harmful = false;

  setTimeout(() => {
    beam.style.background = "magenta"; // Fully visible and harmful
    harmful = true;
  }, delay);

  const interval = setInterval(() => {
    const rect = beam.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      harmful &&
      rect.top < playerRect.bottom &&
      rect.bottom > playerRect.top &&
      rect.left < playerRect.right &&
      rect.right > playerRect.left
    ) {
      takeDamage(20);
      beam.remove();
      clearInterval(interval);
    }
  }, 50);

  setTimeout(() => {
    beam.remove();
    clearInterval(interval);
  }, delay + 1500);
}

function bossAttack() {
  const now = Date.now();
  if (now - bossState.lastAttackTime >= bossState.attackCooldown) {
    bossState.lastAttackTime = now;
    spawnBeam(bossState.x + 30, bossState.y + 60, 10, gameArea.offsetHeight, 1000); // Horizontal beam
  }
}

function gameLoop() {
  moveBoss();
  bossAttack();
  requestAnimationFrame(gameLoop);
}

// Start game
startBtn.addEventListener("click", () => {
  audio.play();
  updateHealthBars();
  movePlayer();
  gameLoop();
});
