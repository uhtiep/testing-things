const audio = document.getElementById("bgm");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

// Move cursor as player
document.addEventListener("mousemove", e => {
  player.style.left = `${e.clientX - 10}px`;
  player.style.top = `${e.clientY - 10}px`;
});

startBtn.addEventListener("click", () => {
  audio.play();
  runPatterns();
});

function spawnShape(type, x, y, dx = 0, dy = 2) {
  const shape = document.createElement("div");
  shape.classList.add("shape", type);
  shape.style.left = `${x}px`;
  shape.style.top = `${y}px`;
  gameArea.appendChild(shape);

  let posX = x;
  let posY = y;

  const interval = setInterval(() => {
    posX += dx;
    posY += dy;
    shape.style.left = `${posX}px`;
    shape.style.top = `${posY}px`;

    if (posY > window.innerHeight + 50 || posX < -50 || posX > window.innerWidth + 50) {
      shape.remove();
      clearInterval(interval);
    }
  }, 16);
}

// --- Pattern Functions ---

function lineAttack(yDelay = 0) {
  for (let i = 0; i < window.innerWidth; i += 60) {
    setTimeout(() => spawnShape("square", i, -30), yDelay);
  }
}

function waveAttack(count = 5, delay = 600) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawnShape("circle", Math.random() * window.innerWidth, -30, 0, 3);
    }, i * delay);
  }
}

function sideAttack() {
  for (let y = 100; y < window.innerHeight - 100; y += 60) {
    spawnShape("triangle", -30, y, 3, 0); // from left
    spawnShape("triangle", window.innerWidth + 30, y, -3, 0); // from right
  }
}

function runPatterns() {
  let time = 0;

  setTimeout(() => waveAttack(5), time += 1000);
  setTimeout(() => lineAttack(), time += 2000);
  setTimeout(() => sideAttack(), time += 3000);
  setInterval(() => {
    waveAttack(3);
    lineAttack();
    sideAttack();
  }, 8000);
}
