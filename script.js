const audio = document.getElementById("bgm");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const playerHealthBar = document.getElementById("playerHealthBar");
const bossHealthBar = document.getElementById("bossHealthBar");

// Cooldown UI
const cooldownOverlay = document.createElement("div");
cooldownOverlay.style.position = "fixed";
cooldownOverlay.style.bottom = "30px";
cooldownOverlay.style.left = "50%";
cooldownOverlay.style.transform = "translateX(-50%)";
cooldownOverlay.style.color = "white";
cooldownOverlay.style.fontSize = "16px";
cooldownOverlay.innerText = "Ready";
document.body.appendChild(cooldownOverlay);

let keys = {};
let canBlockOrDash = true;
let invincibleDuringDash = false;

let playerHP = 100;
let bossHP = 100;
let difficultySpeed = 800;

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
  isDashing: false
};

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === "z" && canBlockOrDash) {
    playerState.blocking = true;
    player.classList.add("block");
    cooldownOverlay.innerText = "Blocking";

    setTimeout(() => {
      playerState.blocking = false;
      player.classList.remove("block");

      canBlockOrDash = false;
      cooldownOverlay.innerText = "Cooldown";

      setTimeout(() => {
        canBlockOrDash = true;
        cooldownOverlay.innerText = "Ready";
      }, 1500);
    }, 1000);
  }

  if (e.key === "x" && canBlockOrDash) {
    const dir = getHeldDirection();
    if (dir) {
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

function spawnBullet(x, y, targetX, targetY) {
  const bullet = document.createElement("div");
  bullet.classList.add("shape");
  bullet.style.left = `${x}px`;
  bullet.style.top = `${y}px`;
  bullet.style.background = "red";
  bullet.style.width = "10px";
  bullet.style.height = "10px";
  gameArea.appendChild(bullet);

  const angle = Math.atan2(targetY - y, targetX - x);
  const speed = 4;
  let dx = Math.cos(angle) * speed;
  let dy = Math.sin(angle) * speed;

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
        const bossX = enemy.offsetLeft + enemy.offsetWidth / 2;
        const bossY = enemy.offsetTop + enemy.offsetHeight / 2;
        const angleBack = Math.atan2(bossY - y, bossX - x);
        dx = Math.cos(angleBack) * speed;
        dy = Math.sin(angleBack) * speed;
        bullet.style.background = "orange";
        playerState.blocking = false;
      } else {
        takeDamage(10);
        bullet.remove();
        clearInterval(interval);
      }
    }

    const bossRect = enemy.getBoundingClientRect();
    if (
      rect.top < bossRect.bottom &&
      rect.bottom > bossRect.top &&
      rect.left < bossRect.right &&
      rect.right > bossRect.left &&
      bullet.style.background === "orange"
    ) {
      damageBoss(5);
      bullet.remove();
      clearInterval(interval);
    }

    if (x < -20 || x > window.innerWidth + 20 || y < -20 || y > window.innerHeight + 20) {
      bullet.remove();
      clearInterval(interval);
    }
  }, 16);
}

function spawnBeam(originX, originY, targetX, targetY, warnTime = 800) {
  const beam = document.createElement("div");
  beam.classList.add("beam");

  const angle = Math.atan2(targetY - originY, targetX - originX);
  const length = Math.hypot(window.innerWidth, window.innerHeight) * 1.5;

  beam.style.width = `${length}px`;
  beam.style.height = `20px`;
  beam.style.left = `${originX}px`;
  beam.style.top = `${originY}px`;
  beam.style.background = "rgba(255, 0, 0, 0.1)";
  beam.style.transform = `rotate(${angle}rad)`;
  beam.style.transformOrigin = "0 50%";

  gameArea.appendChild(beam);

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

    setTimeout(() => {
      beam.remove();
      clearInterval(interval);
    }, 1000);
  }, warnTime);
}

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

startBtn.addEventListener("click", () => {
  audio.play();
  updateHealthBars();
  movePlayer();

  setInterval(() => {
    randomPattern();
    if (difficultySpeed > 200) difficultySpeed -= 25;
  }, difficultySpeed);
});
