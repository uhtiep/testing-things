const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const healthDisplay = document.getElementById("health");
const stageDisplay = document.getElementById("stage");

canvas.width = 800;
canvas.height = 600;

let score = 0;
let health = 100;
let stage = 1;
let player;
let enemies = [];
let bullets = [];
let powerups = [];
let gameInterval;
let enemySpawnInterval;

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 60;
        this.width = 30;
        this.height = 30;
        this.color = "green";
        this.speed = 5;
        this.bulletSpeed = 5;
        this.health = 100;
        this.bulletDamage = 10;
    }

    move() {
        if (this.right && this.x + this.width < canvas.width) this.x += this.speed;
        if (this.left && this.x > 0) this.x -= this.speed;
        if (this.up && this.y > 0) this.y -= this.speed;
        if (this.down && this.y + this.height < canvas.height) this.y += this.speed;
    }

    shoot() {
        const bullet = new Bullet(this.x + this.width / 2, this.y);
        bullets.push(bullet);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = "yellow";
        this.speed = 5;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Enemy {
    constructor() {
        this.x = Math.random() * (canvas.width - 30);
        this.y = -30;
        this.width = 30;
        this.height = 30;
        this.color = "red";
        this.speed = 2;
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 20;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = this.type === "Health" ? "blue" : "purple";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function startGame() {
    player = new Player();
    gameInterval = setInterval(gameLoop, 1000 / 60);
    enemySpawnInterval = setInterval(createEnemies, 2000);
}

function gameLoop() {
    clearCanvas();
    player.move();
    player.draw();

    bullets.forEach((bullet, index) => {
        bullet.move();
        bullet.draw();

        // Check for bullet collisions with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (collisionDetection(bullet, enemy)) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(index, 1);
                score += 10;
                scoreDisplay.textContent = score;
            }
        });
    });

    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw();

        // Check for collisions with player
        if (collisionDetection(player, enemy)) {
            health -= 10;
            healthDisplay.textContent = health;
            enemies.splice(index, 1);
        }
    });

    powerups.forEach((powerup, index) => {
        powerup.draw();
        if (collisionDetection(player, powerup)) {
            handlePowerup(powerup);
            powerups.splice(index, 1);
        }
    });

    if (enemies.length < 5) {
        enemies.push(new Enemy());
    }

    if (health <= 0) {
        clearInterval(gameInterval);
        clearInterval(enemySpawnInterval);
        alert("Game Over!");
    }
}

function collisionDetection(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

function handlePowerup(powerup) {
    if (powerup.type === "Health") {
        health += 20;
        healthDisplay.textContent = health;
    } else if (powerup.type === "Rapid Fire") {
        player.bulletSpeed = 10;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createEnemies() {
    enemies.push(new Enemy());
}

function createPowerup() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const type = Math.random() > 0.5 ? "Health" : "Rapid Fire";
    const powerup = new Powerup(x, y, type);
    powerups.push(powerup);
}

startGame();
