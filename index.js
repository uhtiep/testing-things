const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let balls = [];
let glasses = [];
let selectedBall = null;

class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
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

function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    glasses.forEach(glass => glass.draw());
    balls.forEach(ball => ball.draw());
}

document.getElementById("addBall").addEventListener("click", () => {
    let colors = ["red", "blue", "green", "yellow", "purple"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, color));
    drawObjects();
});

document.getElementById("addGlass").addEventListener("click", () => {
    let colors = ["red", "blue", "green", "yellow", "purple"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    glasses.push(new Glass(Math.random() * canvas.width, Math.random() * canvas.height, color));
    drawObjects();
});

canvas.addEventListener("mousedown", (event) => {
    let clickX = event.offsetX;
    let clickY = event.offsetY;
    balls.forEach(ball => {
        let distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);
        if (distance < ball.radius) {
            selectedBall = ball;
        }
    });
});

canvas.addEventListener("mousemove", (event) => {
    if (selectedBall) {
        selectedBall.x = event.offsetX;
        selectedBall.y = event.offsetY;
        drawObjects();
    }
});

canvas.addEventListener("mouseup", () => {
    selectedBall = null;
});
