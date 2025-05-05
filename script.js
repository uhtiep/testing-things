const audio = document.getElementById("bgm");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

let playerState = {
  x: 0,
  y: 0,
  blocking: false,
  blockDir: null,
  canBlock: true
};

document.addEventListener("mousemove", e => {
  playerState.x = e.clientX;
  playerState.y = e.clientY;
  player.style.left = `${playerState.x - 10}px`;
  player.style.top = `${playerState.y - 10}px`;
});

let keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === "z" && playerState.canBlock) {
    let dir = null;
    if (keys["ArrowLeft"]) dir = "left";
    if (keys["ArrowRight"]) dir = "right";
    if (keys["ArrowUp"]) dir = "up";
    if (keys["ArrowDown"]) dir = "down";

    if (dir) {
      playerState.blocking = true;
      playerState.blockDir = dir;
      player.classList.add("block");
      playerState.canBlock = false;

      setTimeout(() => {
        playerState.blocking = false;
        player.classList.remove("block");
        playerState.blockDir = null;
      }, 1000);

      setTimeout(() => playerState.canBlock = true, 5000);
    }
  }
});
document.addEventListener("keyup", e => keys[e.key] = false);

// Spawning logic
function spawnAttack(x, y, dx, dy) {
  const shape = document.createElement("div");
  shape.classList.add("shape");
  shape.style.left = `${x}px`;
  shape.style.top = `${y}px`;
  gameArea.appendChild(shape);

  const interval = setInterval(() => {
    x += dx;
    y += dy;
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;

    const rect = shape.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Check hit or block
    if (
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
        console.log("Player hit!");
      }
    }

    if (y > window.innerHeight + 30 || x < -30 || x > window.innerWidth + 30) {
      shape.remove();
      clearInterval(interval);
    }
  }, 16);
}

// Direction match
function matchDirection(dx, dy, dir) {
  if (dir === "up" && dy > 0) return true;
  if (dir === "down" && dy < 0) return true;
  if (dir === "left" && dx > 0) return true;
  if (dir === "right" && dx < 0) return true;
  return false;
}

// Reflect back to enemy
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
      console.log("Enemy hit!");
      shape.remove();
      clearInterval(interval);
    }
  }, 16);
}

// Enemy attack patterns
function randomPattern() {
  const type = Math.floor(Math.random() * 3);

  switch (type) {
    case 0:
      for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnAttack(enemy.offsetLeft + 30, 70, (Math.random() - 0.5) * 2, 3), i * 200);
      }
      break;
    case 1:
      for (let angle = 0; angle < 360; angle += 30) {
        const rad = angle * Math.PI / 180;
        spawnAttack(enemy.offsetLeft + 30, 70, Math.cos(rad) * 2, Math.sin(rad) * 2);
      }
      break;
    case 2:
      for (let i = 0; i < 4; i++) {
        setTimeout(() => spawnAttack(50 + i * 100, 70, 0, 3), i * 300);
      }
      break;
  }
}

// Start game
startBtn.addEventListener("click", () => {
  audio.play();
  setInterval(() => randomPattern(), 2000);
});
