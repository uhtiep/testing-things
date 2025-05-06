const audio = document.getElementById("bgm");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const playerHealthBar = document.getElementById("playerHealthBar");
const bossHealthBar = document.getElementById("bossHealthBar");

let keys = {};
let canBlock = true;
let invincibleDuringDash = false;
let dashCooldown = true;
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
function spawnBullet(x, y, dx, dy) {
  const bullet = document.createElement("div");
  bullet.classList.add("shape");
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  gameArea.appendChild(bullet);

  const interval = setInterval(() => {
    x += dx;
    y += dy;
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;

    const rect = bullet.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (rect.top < playerRect.bottom && rect.bottom > playerRect.top && rect.left < playerRect.right && rect.right > playerRect.left) {
      if (playerState.blocking && matchDirection(dx, dy, playerState.blockDir)) {
        clearInterval(interval);
        bullet.style.background = "red";
        reflectToEnemy(bullet, x, y);
      } else {
        bullet.remove();
        clearInterval(interval);
        takeDamage(10);
      }
    }

    if (y > window.innerHeight + 30 || x < -30 || x > window.innerWidth + 30) {
      bullet.remove();
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

function reflectToEnemy(bullet, x, y) {
  const enemyX = enemy.offsetLeft + 30;
  const enemyY = enemy.offsetTop + 30;
  const angle = Math.atan2(enemyY - y, enemyX - x);
  const speed = 4;
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;

  const interval = setInterval(() => {
    x += dx;
    y += dy;
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;

    const rect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (rect.top < enemyRect.bottom && rect.bottom > enemyRect.top && rect.left < enemyRect.right && rect.right > enemyRect.left) {
      bullet.remove();
      clearInterval(interval);
      damageBoss(5);
    }
  }, 16);
}

function spawnBeam(x, y, direction) {
  const beam = document.createElement("div");
  beam.classList.add("beam");
  beam.style.top = `${y}px`;
  beam.style.width = "100%";
  beam.style.height = "10px";
  beam.style.transition = "width 1s";
  gameArea.appendChild(beam);

  setTimeout(() => {
    beam.style.background = "red"; // Make it harmful after a delay
  }, 1000);

  const interval = setInterval(() => {
    if (direction === "horizontal") {
      beam.style.left = "0";
    } else {
      beam.style.left = "100%";
    }
  }, 16);
}

function spawnSpiralBullets(x, y) {
  const bulletCount = 12; // Bullet count in spiral
  const angleOffset = Math.PI * 2 / bulletCount;

  for (let i = 0; i < bulletCount; i++) {
    const angle = i * angleOffset;
    const dx = Math.cos(angle) * 3;
    const dy = Math.sin(angle) * 3;

    spawnBullet(x, y, dx, dy);
  }
}

function spawnBeamSpiral(x, y) {
  const beamCount = 16; // Beam count for spiral
  const angleOffset = Math.PI * 2 / beamCount;

  for (let i = 0; i < beamCount; i++) {
    const angle = i * angleOffset;
    const dx = Math.cos(angle) * 4;
    const dy = Math.sin(angle) * 4;

    spawnBeam(x, y, "horizontal");
  }
}

function randomPattern() {
  const type = Math.floor(Math.random() * 6);  // More patterns

  switch (type) {
    case 0:
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          spawnBullet(enemy.offsetLeft + 30, 70, (Math.random() - 0.5) * 6, 4 + Math.random() * 3);
        }, i * 50);
      }
      break;
    case 1:
      for (let angle = 0; angle < 360; angle += 10) {
        const rad = angle * Math.PI / 180;
        spawnBullet(enemy.offsetLeft + 30, 70, Math.cos(rad) * 3, Math.sin(rad) * 3);
      }
      break;
    case 2:
      for (let i = 0; i < 6; i++) {
        spawnBullet(80 + i * 100, 70, 0, 6 + Math.random() * 3);
      }
      break;
    case 3:
      for (let angle = 0; angle < 360; angle += 15) {
        const rad = angle * Math.PI / 180;
        spawnBullet(enemy.offsetLeft + 30, 70, Math.cos(rad) * 3, Math.sin(rad) * 3);
      }
      break;
    case 4:
      spawnSpiralBullets(enemy.offsetLeft + 30, 70);
      break;
    case 5:
      spawnBeamSpiral(enemy.offsetLeft + 30, 70);
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
