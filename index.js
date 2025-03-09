const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let balls = [];
let glasses = [];
let gravity = 0.5;
let friction = 0.8;
let selectedBall = null;

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
        if (!selectedBall) {
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
    let angle = Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
    let speed1 = Math.sqrt(ball1.vx * ball1.vx + ball1.vy * ball1.vy);
    let speed2 = Math.sqrt(ball2.vx * ball2.vx + ball2.vy * ball2.vy);
    
    let direction1 = Math.atan2(ball1.vy, ball1.vx);
    let direction2 = Math.atan2(ball2.vy, ball2.vx);
    
    let velocityX1 = speed1 * Math.cos(direction1 - angle);
    let velocityY1 = speed1 * Math.sin(direction1 - angle);
    let velocityX2 = speed2 * Math.cos(direction2 - angle);
    let velocityY2 = speed2 * Math.sin(direction2 - angle);
    
    let finalVelocityX1 = velocityX2;
    let finalVelocityX2 = velocityX1;
    
    ball1.vx = Math.cos(angle) * finalVelocityX1 + Math.cos(angle + Math.PI / 2) * velocityY1;
    ball1.vy = Math.sin(angle) * finalVelocityX1 + Math.sin(angle + Math.PI / 2) * velocityY1;
    ball2.vx = Math.cos(angle) * finalVelocityX2 + Math.cos(angle + Math.PI / 2) * velocityY2;
    ball2.vy = Math.sin(angle) * finalVelocityX2 + Math.sin(angle + Math.PI / 2) * velocityY2;
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
    let newBall;
    do {
        newBall = new Ball(Math.random() * (canvas.width - 40) + 20, Math.random() * (canvas.height - 40) + 20, color);
    } while (balls.some(ball => detectCollision(ball, newBall)));
    balls.push(newBall);
});

document.getElementById("addGlass").addEventListener("click", () => {
    let colors = ["red", "blue", "green", "yellow", "purple"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    glasses.push(new Glass(Math.random() * canvas.width, Math.random() * canvas.height, color));
});

canvas.addEventListener("mousedown", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    balls.forEach(ball => {
        let dx = mouseX - ball.x;
        let dy = mouseY - ball.y;
        if (Math.sqrt(dx * dx + dy * dy) < ball.radius) {
            selectedBall = ball;
        }
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (selectedBall) {
        let rect = canvas.getBoundingClientRect();
        selectedBall.x = e.clientX - rect.left;
        selectedBall.y = e.clientY - rect.top;
    }
});

canvas.addEventListener("mouseup", () => {
    selectedBall = null;
});

function animate() {
    requestAnimationFrame(animate);
    drawObjects();
}

animate();
