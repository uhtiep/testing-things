const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const moneyDisplay = document.getElementById('money-value');
canvas.width = 800;
canvas.height = 600;

let money = 100;
let enemies = [];
let towers = [];
let projectiles = [];
let lives = 20;

const enemySpeed = 1;
const enemyRadius = 15;
const towerCost = 50;
const towerRadius = 25;
const projectileSpeed = 5;
const enemyHealth = 1;
let isInfiniteMoney = false;
let isSpawningEnemies = false;

const path = [
    {x: 0, y: 300},
    {x: 200, y: 300},
    {x: 200, y: 100},
    {x: 600, y: 100},
    {x: 600, y: 400},
    {x: 800, y: 400},
];

let currentRound = 0;
let enemiesSpawned = 0;
let roundEnemyCount = 5;

// Define a simple enemy class
class Enemy {
    constructor(x, y, health = enemyHealth) {
        this.x = x;
        this.y = y;
        this.speed = enemySpeed;
        this.radius = enemyRadius;
        this.health = health;
        this.pathIndex = 0;
    }

    move() {
        if (this.pathIndex < path.length - 1) {
            let target = path[this.pathIndex + 1];
            let dx = target.x - this.x;
            let dy = target.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let moveX = (dx / distance) * this.speed;
            let moveY = (dy / distance) * this.speed;

            this.x += moveX;
            this.y += moveY;

            if (Math.abs(this.x - target.x) < 3 && Math.abs(this.y - target.y) < 3) {
                this.pathIndex++;
            }
        } else {
            // If enemy reaches the end of the path, it removes 1 life.
            lives -= 1;
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
        this.shootCooldown = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            let nearestEnemy = this.getNearestEnemy();
            if (nearestEnemy) {
                projectiles.push(new Projectile(this.x, this.y, nearestEnemy));
                this.shootCooldown = 30; // Delay before shooting again
            }
        }
    }

    getNearestEnemy() {
        let closestEnemy = null;
        let minDistance = Infinity;
        for (let enemy of enemies) {
            let dx = enemy.x - this.x;
            let dy = enemy.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100 && distance < minDistance) { // 100 is the shooting range
                closestEnemy = enemy;
                minDistance = distance;
            }
        }
        return closestEnemy;
    }

    update() {
        if (this.shootCooldown > 0) this.shootCooldown--;
    }
}

// Define a simple projectile class
class Projectile {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = projectileSpeed;
        this.radius = 5;
    }

    move() {
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let moveX = (dx / distance) * this.speed;
        let moveY = (dy / distance) * this.speed;

        this.x += moveX;
        this.y += moveY;

        // Check if projectile hits the target
        if (Math.abs(this.x - this.target.x) < this.radius && Math.abs(this.y - this.target.y) < this.radius) {
            this.target.health -= 1;
            projectiles = projectiles.filter(p => p !== this);
            if (this.target.health <= 0) {
                enemies = enemies.filter(enemy => enemy !== this.target);
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
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
        money = Math.max(money, 0); // Prevent negative money
    }
    moneyDisplay.textContent = money;

    // Spawn enemies if allowed
    if (isSpawningEnemies && enemiesSpawned < roundEnemyCount) {
        enemies.push(new Enemy(path[0].x, path[0].y));
        enemiesSpawned++;
    }

    // Update and draw enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();
    }

    // Draw and update towers
    for (let i = 0; i < towers.length; i++) {
        towers[i].update();
        towers[i].draw();
        towers[i].shoot();
    }

    // Move and draw projectiles
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].move();
        projectiles[i].draw();
    }

    // Display lives
    ctx.font = "20px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText("Lives: " + lives, 10, 30);

    // Check game over
    if (lives <= 0) {
        alert("Game Over!");
        resetGame();
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

// Function to reset the game
function resetGame() {
    lives = 20;
    enemies = [];
    towers = [];
    projectiles = [];
    money = 100;
    enemiesSpawned = 0;
    roundEnemyCount = 5;
}

// Start the game loop
gameLoop();
