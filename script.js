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

// Boss Attack - Bullets (Track Player)
function spawnBullet(x, y, targetX, targetY) {
  const bullet = document.createElement("div");
  bullet.classList.add("shape");
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  bullet.style.width = "10px";
  bullet.style.height = "10px";
  bullet.style.borderRadius = "50%";
  bullet.style.background = "red"; // Red bullets
  gameArea.appendChild(bullet);

  // Calculate the direction to the player
  const angle = Math.atan2(targetY - y, targetX - x);
  const speed = 4;
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;

  const interval = setInterval(() => {
    x += dx;
    y += dy;
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;

    const rect = bullet.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      rect.top < playerRect.bottom &&
      rect.bottom > playerRect.top &&
      rect.left < playerRect.right &&
      rect.right > playerRect.left
    ) {
      takeDamage(10);
      clearInterval(interval);
      bullet.remove();
    }

    if (x < -10 || x > window.innerWidth + 10 || y < -10 || y > window.innerHeight + 10) {
      clearInterval(interval);
      bullet.remove();
    }
  }, 16);
}

// Boss Attack - Beams (Track Player)
function spawnBeam(x, y, targetX, targetY, delay = 1000) {
  const beam = document.createElement("div");
  beam.classList.add("shape");
  beam.style.left = `${x}px`;
  beam.style.top = `${y}px`;
  beam.style.width = "10px";
  beam.style.height = "200px"; // height of beam
  beam.style.background = "rgba(255, 0, 0, 0.3)"; // Initially transparent red
  gameArea.appendChild(beam);

  // Calculate the direction to the player
  const angle = Math.atan2(targetY - y, targetX - x);
  const speed = 4;

  let harmful = false;

  setTimeout(() => {
    beam.style.background = "red"; // Fully visible and harmful
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
      takeDamage(15);
      clearInterval(interval);
      beam.remove();
    }

    if (y > window.innerHeight) {
      clearInterval(interval);
      beam.remove();
    }
  }, 16);
}

// Random Attack Patterns (Now tracks player)
function randomPattern() {
  const type = Math.floor(Math.random() * 2);

  // Get player's current position
  const targetX = playerState.x;
  const targetY = playerState.y;

  switch (type) {
    case 0:
      // Fire Bullets towards the player
      spawnBullet(enemy.offsetLeft + 30, 70, targetX, targetY);
      break;
    case 1:
      // Fire Beams towards the player
      spawnBeam(enemy.offsetLeft + 30, 70, targetX, targetY, 1000);
      break;
  }
}

// Start Game
startBtn.addEventListener("click", () => {
  audio.play();
  updateHealthBars();
  setInterval(randomPattern, 800); // Trigger random attacks every 800ms
  movePlayer();
});
