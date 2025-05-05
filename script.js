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

// Spawn Attacks
function spawnAttack(x, y, dx, dy) {
  const shape = document.createElement("div");
  shape.classList.add("shape");
  shape.style.left = `${x}px`;
  shape.style.top = `${y}px`;
  shape.style.background = getRandomColor();
  gameArea.appendChild(shape);

  let rotation = 0;

  const interval = setInterval(() => {
    x += dx;
    y += dy;
    rotation += 5;
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;
    shape.style.transform = `rotate(${rotation}deg)`;

    const rect = shape.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      !playerState.isDashing &&
      rect.top < playerRect.bottom &&
      rect.bottom > playerRect.top &&
      rect.left < playerRect.right &&
      rect.right > playerRect.left
    ) {
      if (playerState.blocking && matchDirection(dx, dy, playerState.blockDir)) {
        clearInterval(interval);
        shape.style.background = "red";
        reflectToEnemy(shape, x, y);
      } else {
        shape.remove();
        clearInterval(interval);
        takeDamage(10);
      }
    }

    if (y > window.innerHeight + 30 || x < -30 || x > window.innerWidth + 30) {
      shape.remove();
      clearInterval(interval);
    }
  }, 16);
}

function matchDirection(dx, dy, dir) {
  if (dir === "up" && dy > 0) return true;
  if (dir === "down" && dy < 0) return true;
  if (dir === "left" && dx > 0) return true;
  if (dir === "right" && dx < 0) return true;
  return false;
}

function reflectToEnemy(shape, x, y) {
  const enemyX = enemy.offsetLeft + 30;
  const enemyY = enemy.offsetTop + 30;
  const angle = Math.atan2(enemyY - y, enemyX - x);
  const speed = 4;
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;

  const interval = setInterval(() => {
    x += dx;
    y += dy;
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;

    const rect = shape.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      rect.top < enemyRect.bottom &&
      rect.bottom > enemyRect.top &&
      rect.left < enemyRect.right &&
      rect.right > enemyRect.left
    ) {
      shape.remove();
      clearInterval(interval);
      damageBoss(5);
    }
  }, 16);
}

function getRandomColor() {
  const colors = ["cyan", "magenta", "yellow", "lime", "orange", "aqua"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Chaotic Attack Patterns
function randomPattern() {
  const type = Math.floor(Math.random() * 4);

  switch (type) {
    case 0:
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          spawnAttack(enemy.offsetLeft + 30, 70, (Math.random() - 0.5) * 6, 4 + Math.random() * 3);
        }, i * 50);
      }
      break;
    case 1:
      for (let angle = 0; angle < 360; angle += 10) {
        const rad = angle * Math.PI / 180;
        spawnAttack(enemy.offsetLeft + 30, 70, Math.cos(rad) * 3, Math.sin(rad) * 3);
      }
      break;
    case 2:
      for (let i = 0; i < 6; i++) {
        spawnAttack(80 + i * 100, 70, 0, 6 + Math.random() * 3);
      }
      for (let i = 0; i < 5; i++) {
        const randX = Math.random() * window.innerWidth;
        spawnAttack(randX, 70, (Math.random() - 0.5) * 8, 2 + Math.random());
      }
      break;
    case 3:
      for (let angle = 0; angle < 360; angle += 15) {
        const rad = angle * Math.PI / 180;
        spawnAttack(enemy.offsetLeft + 30, 70, Math.cos(rad) * 3, Math.sin(rad) * 3);
      }
      break;
  }
}

// Start game
startBtn.addEventListener("click", () => {
  audio.play();
  updateHealthBars();
  setInterval(() => randomPattern(), 800);
  movePlayer();
});
