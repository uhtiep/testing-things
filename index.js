const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const moneyDisplay = document.getElementById('money-value');
const livesDisplay = document.getElementById('lives-value');
const roundDisplay = document.getElementById('round-value');
canvas.width = 800;
canvas.height = 600;

let money = 100;
let lives = 20;
let enemies = [];
let towers = [];
let projectiles = [];
let currentRound = 0;
let enemiesSpawned = 0;
let roundEnemyCount = 5;
let isInfiniteMoney = false;
let isSpawningEnemies = false;

// Path definition for enemies to follow
const path = [
    {x: 50, y: 300},
    {x: 200, y: 300},
    {x: 200, y: 150},
    {x: 400, y: 150},
    {x: 400, y: 400},
    {x: 650, y: 400},
    {x: 650, y: 550},
    {x: 800, y: 550},
];

// Define a simple enemy class
class Enemy {
    constructor(x, y, health = 1) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.radius = 15;
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
            // If enemy reaches the end, remove 1 life
            lives--;
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

// Define a basic tower class
class Tower {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.radius = 25;
        this.type = type;
        this.shootCooldown = 0;
        this.range = 100;
        this.cost = 50;
        if (this.type === 'sniper') {
            this.range = 200;
            this.cost = 100;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'sniper' ? 'green' : 'blue';
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
            if (distance < this.range && distance < minDistance) {
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

// Define a projectile class
class Projectile {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
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

// Handle mouse click for tower placement
document.getElementById('basic-tower').addEventListener('click', () => {
    if (money >= 50) {
        money -= 50;
        towers.push(new Tower(100, 100, 'basic'));
    }
});

document.getElementById('sniper-tower').addEventListener('click', () => {
    if (money >= 100) {
        money -= 100;
        towers.push(new Tower(200, 100, 'sniper'));
    }
});

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update money and display
    if (isInfiniteMoney) {
        money = Infinity;
    }
    moneyDisplay.textContent = money;
    livesDisplay.textContent = lives;
    roundDisplay.textContent = currentRound;

    // Spawn enemies if allowed
    if (isSpawningEnemies && enemiesSpawned < roundEnemyCount) {
        enemies.push(new Enemy(path[0].x, path[0].y));
        enemiesSpawned++;
    }

    // Update and draw enemies
    enemies.forEach(enemy => {
        enemy.move();
        enemy.draw();
    });

    // Update and draw towers
    towers.forEach(tower => {
        tower.update();
        tower.draw();
        tower.shoot();
    });

    // Move and draw projectiles
    projectiles.forEach(projectile => {
        projectile.move();
        projectile.draw();
    });

    // Check game over
    if (lives <= 0) {
        alert("Game Over!");
        resetGame();
    }

    requestAnimationFrame(gameLoop);
}

// Function to reset the game
function resetGame() {
    lives = 20;
    enemies = [];
    towers = [];
    projectiles = [];
    money = 100;
    enemiesSpawned = 0;
    currentRound = 0;
    roundEnemyCount = 5;
}

// Start the game loop
gameLoop();
