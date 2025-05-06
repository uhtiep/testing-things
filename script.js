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
let attacks = [];
let attackCooldown = false;  // Variable to control attack cooldown

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
      const attackInDirection = attacks.some(attack => attack.isInRange(playerState.x, playerState.y, dir));

      if (attackInDirection) {
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
function spawnBeam(x, y, dx, dy) {
  const beam = document.createElement("div");
  beam.classList.add("beam");
  beam.style.left = `${x}px`;
  beam.style.top = `${y}px`;
  gameArea.appendChild(beam);

  const attack = {
    element: beam,
    x: x,
    y: y,
    dx: dx,
    dy: dy,
    isVisible: false,  // Initially not visible
    transitionDuration: 2000,  // Time to fully appear
    move() {
      this.x += this.dx;
      this.y += this.dy;
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    },
    checkCollision() {
      if (this.isVisible) {
        const rect = this.element.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (rect.top < playerRect.bottom && rect.bottom > playerRect.top && rect.left < playerRect.right && rect.right > playerRect.left) {
          if (playerState.blocking && matchDirection(this.dx, this.dy, playerState.blockDir)) {
            this.element.remove();
            damageBoss(5); // Damage the boss when blocked
            return;
          } else {
            this.element.remove();
            takeDamage(20);
          }
        }
      }
    },
    isInRange(px, py, direction) {
      if (direction === "up" && this.dy < 0 && this.y < py) return true;
      if (direction === "down" && this.dy > 0 && this.y > py) return true;
      if (direction === "left" && this.dx < 0 && this.x < px) return true;
      if (direction === "right" && this.dx > 0 && this.x > px) return true;
      return false;
    },
    reveal() {
      setTimeout(() => {
        this.isVisible = true;
        this.element.style.backgroundColor = "red";  // Change to harmful color
      }, this.transitionDuration);  // Change color after some time
    }
  };

  attacks.push(attack);

  attack.reveal();

  const interval = setInterval(() => {
    attack.move();
    attack.checkCollision();

    if (attack.y > window.innerHeight + 30 || attack.x < -30 || attack.x > window.innerWidth + 30) {
      attack.element.remove();
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

function randomPattern() {
  if (attackCooldown) return; // Prevent new attacks from spawning too quickly

  attackCooldown = true; // Start cooldown

  const type = Math.floor(Math.random() * 6);

  switch (type) {
    case 0:
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          spawnBeam(enemy.offsetLeft + 30, 70, 0, 5);
        }, i * 50);
      }
      break;
    case 1:
      spawnBeam(enemy.offsetLeft + 30, 70, 0, 5);
      break;
    case 2:
      spawnBeam(enemy.offsetLeft + 30, 70, 0, 5);
      break;
  }

  setTimeout(() => {
    attackCooldown = false; // Reset cooldown after 2 seconds
  }, 2000); // Cooldown time: 2 seconds
}

// Start game
startBtn.addEventListener("click", () => {
  audio.play();
  updateHealthBars();
  setInterval(() => randomPattern(), 800);
  movePlayer();
});
