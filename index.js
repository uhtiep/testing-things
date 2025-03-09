const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

document.addEventListener("keydown", moveBall);

let ball = {
    x: 100,
    y: 400,
    radius: 15,
    color: "blue",
    dx: 0,
    dy: 0,
    speed: 2,
    onGround: false,
};

let platforms = [
    { x: 50, y: 450, width: 200, height: 10 },
    { x: 300, y: 400, width: 200, height: 10 },
    { x: 550, y: 350, width: 200, height: 10 },
    { x: 200, y: 250, width: 150, height: 10 },
    { x: 450, y: 200, width: 150, height: 10 },
];

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPlatforms() {
    ctx.fillStyle = "black";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function moveBall(event) {
    if (event.key === "ArrowRight") {
        ball.dx = ball.speed;
    } else if (event.key === "ArrowLeft") {
        ball.dx = -ball.speed;
    } else if (event.key === "ArrowUp" && ball.onGround) {
        ball.dy = -5;
        ball.onGround = false;
    }
}

document.addEventListener("keyup", () => {
    ball.dx = 0;
});

function applyPhysics() {
    ball.dy += 0.2; // Gravity
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    ball.onGround = false;
    platforms.forEach(platform => {
        if (
            ball.x + ball.radius > platform.x &&
            ball.x - ball.radius < platform.x + platform.width &&
            ball.y + ball.radius > platform.y &&
            ball.y + ball.radius < platform.y + platform.height
        ) {
            ball.y = platform.y - ball.radius;
            ball.dy = 0;
            ball.onGround = true;
        }
    });
    
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = 0;
        ball.onGround = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawBall();
}

function update() {
    applyPhysics();
    draw();
    requestAnimationFrame(update);
}

update();
