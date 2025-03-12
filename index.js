const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const moneyDisplay = document.getElementById('money-value');
canvas.width = 800;
canvas.height = 600;

let money = 100;
let enemies = [];
let towers = [];

const enemySpeed = 1; // Speed of the enemies
const enemyRadius = 15;
const towerCost = 50;
const towerRadius = 25;

let isInfiniteMoney = false;
let isSpawningEnemies = false;

// Define a simple enemy class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = enemySpeed;
        this.radius = enemyRadius;
    }

    move() {
        this.x += this.speed;
        if (this.x > canvas.width) {
            // If enemy reaches the end, remove from the game
            enemies = enemies.filter(enemy => enemy !== this);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

// Define a simple tower class
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = towerRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }
}

// Handle keyboard input for infinite money and spawning enemies
document.addEventListener('keydown', function (e) {
    if (e.key === 'l') {
        isInfiniteMoney = !isInfiniteMoney;
    }
    if (e.key === 'k') {
        isSpawningEnemies = !isSpawningEnemies;
    }
});

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update money
    if (isInfiniteMoney) {
        money = Infinity; // Set money to infinity when L is pressed
    } else {
        money = 100; // Set money back to 100 when L is not pressed
    }
    moneyDisplay.textContent = money;

    // Update and draw enemies
    if (isSpawningEnemies) {
        // Spawn a new enemy at the left of the canvas
        enemies.push(new Enemy(0, Math.random() * canvas.height));
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();
    }

    // Draw towers
    for (let i = 0; i < towers.length; i++) {
        towers[i].draw();
    }

    requestAnimationFrame(gameLoop);
}

// Mouse click event to place towers
canvas.addEventListener('click', (e) => {
    if (money >= towerCost) {
        const x = e.offsetX;
        const y = e.offsetY;
        towers.push(new Tower(x, y));
        money -= towerCost;
    }
});

// Start the game loop
gameLoop();
