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

      setTimeout(() => dashCooldown = true, 2000);
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

// Bullet Attack
function spawnBullet(x, y, targetX, targetY) {
  const bullet = document.createElement("div");
  bullet.classList.add("shape");
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  bullet.style.width = "10px";
  bullet.style.height = "10px";
  bullet.style.background = "red";
  gameArea.appendChild(bullet);

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
      if (playerState.blocking) {
        damageBoss(5);
      } else {
        takeDamage(10);
      }
      bullet.remove();
      clearInterval(interval);
    }

    if (x < -10 || x > window.innerWidth + 10 || y < -10 || y > window.innerHeight + 10) {
      bullet.remove();
      clearInterval(interval);
    }
  }, 16);
}

// Beam Attack
function spawnBeam(x, y, targetX, targetY, warnTime = 800) {
  const beam = document.createElement("div");
  beam.classList.add("shape");
  beam.style.position = "absolute";
  beam.style.width = "200px";
  beam.style.height = "40px";
  beam.style.background = "rgba(255, 0, 0, 0.2)";
  beam.style.left = `${x}px`;
  beam.style.top = `${y}px`;
  gameArea.appendChild(beam);

  const angle = Math.atan2(targetY - y, targetX - x);
  beam.style.transform = `rotate(${angle}rad)`;
  beam.style.transformOrigin = "top left";

  // After warnTime, beam becomes harmful
  setTimeout(() => {
    beam.style.background = "red";

    const interval = setInterval(() => {
      const rect = beam.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();

      if (
        rect.top < playerRect.bottom &&
        rect.bottom > playerRect.top &&
        rect.left < playerRect.right &&
        rect.right > playerRect.left
      ) {
        if (playerState.blocking) {
          damageBoss(5);
        } else {
          takeDamage(20);
        }
        beam.remove();
        clearInterval(interval);
      }
    }, 50);

    // Remove beam after some time
    setTimeout(() => {
      beam.remove();
      clearInterval(interval);
    }, 1000);
  }, warnTime);
}

// Attack Pattern
function randomPattern() {
  const pattern = Math.floor(Math.random() * 2);
  const playerRect = player.getBoundingClientRect();
  const targetX = playerRect.left + playerRect.width / 2;
  const targetY = playerRect.top + playerRect.height / 2;

  if (pattern === 0) {
    spawnBullet(enemy.offsetLeft + 30, 70, targetX, targetY);
  } else {
    spawnBeam(enemy.offsetLeft + 30, 70, targetX, targetY);
  }
}

// Start Game
startBtn.addEventListener("click", () => {
  audio.play();
  updateHealthBars();
  setInterval(randomPattern, 800);
  movePlayer();
});
