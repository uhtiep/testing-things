const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let balls = [];
let glasses = [];
let gravity = 0.5;
let friction = 0.8;

class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.color = color;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update() {
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -friction;
        }
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx *= -friction;
        }
        balls.forEach(ball => {
            if (ball !== this && detectCollision(this, ball)) {
                resolveCollision(this, ball);
            }
        });
    }
}

class Glass {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 80;
        this.color = color;
    }
    draw() {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, 10);
    }
}

function detectCollision(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < ball1.radius + ball2.radius;
}

function resolveCollision(ball1, ball2) {
    let tempVx = ball1.vx;
    let tempVy = ball1.vy;
    ball1.vx = ball2.vx;
    ball1.vy = ball2.vy;
    ball2.vx = tempVx;
    ball2.vy = tempVy;
}

function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    glasses.forEach(glass => glass.draw());
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
}

document.getElementById("addBall").addEventListener("click", () => {
    let colors = ["red", "blue", "green", "yellow", "purple"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, color));
});

document.getElementById("addGlass").addEventListener("click", () => {
    let colors = ["red", "blue", "green", "yellow", "purple"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    glasses.push(new Glass(Math.random() * canvas.width, Math.random() * canvas.height, color));
});

function animate() {
    requestAnimationFrame(animate);
    drawObjects();
}

animate();
