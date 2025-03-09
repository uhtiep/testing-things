const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game Objects
let ball = {
    x: 100,
    y: 500,
    radius: 20,
    color: 'red',
    dx: 0,
    dy: 0,
    gravity: 0.5,
    friction: 0.98,
    jumpPower: -10,
    speed: 3
};

let ground = {
    y: canvas.height - 30,
    width: 3000,  // Large enough for scrolling
    height: 30,
    color: 'green'
};

// Game Settings
let isJumping = false;
let isOnGround = true;
let level = 1;
let score = 0;
let backgroundOffset = 0;

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x - backgroundOffset, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawGround() {
    ctx.fillStyle = ground.color;
    ctx.fillRect(-backgroundOffset, ground.y, ground.width, ground.height);
}

function moveBall() {
    if (ball.y + ball.radius < ground.y) {
        ball.dy += ball.gravity;  // Gravity effect
        isOnGround = false;
    } else {
        ball.dy = 0;
        ball.y = ground.y - ball.radius;
        if (isJumping) {
            isJumping = false;
        }
        isOnGround = true;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball friction
    ball.dx *= ball.friction;
    ball.dy *= ball.friction;
}

function keyControl() {
    if (keyState['ArrowRight']) {
        if (ball.x < canvas.width - 100) {
            ball.dx = ball.speed;  // Move right at a constant speed
        }
    }
    if (keyState['ArrowLeft']) {
        if (ball.x > 100) {
            ball.dx = -ball.speed;  // Move left at a constant speed
        }
    }
    if (keyState['ArrowUp'] && isOnGround && !isJumping) {
        ball.dy = ball.jumpPower;  // Jump
        isJumping = true;
    }
}

// Keyboard events for controlling the ball
let keyState = {};
window.addEventListener('keydown', (e) => keyState[e.key] = true);
window.addEventListener('keyup', (e) => keyState[e.key] = false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawGround();

    moveBall();
    keyControl();

    // Side-scrolling effect
    if (ball.x > canvas.width - 100) {
        backgroundOffset = ball.x - (canvas.width - 100);  // Keep ball at the right of the screen
    }

    requestAnimationFrame(draw);
}

// Level mechanics
function startLevel(level) {
    // Reset ball position and state
    ball.x = 100;
    ball.y = 500;
    ball.dx = 0;
    ball.dy = 0;
    isJumping = false;
    isOnGround = true;
    backgroundOffset = 0;

    if (level === 1) {
        // Basic physics (gravity, ground)
        console.log("Level 1: Basic physics introduced.");
    } else if (level === 2) {
        // Physics-based puzzles (add obstacles or platforms)
        console.log("Level 2: Physics-based puzzles introduced.");
    } else if (level === 3) {
        // Puzzle-based mechanics (moving platforms, switches)
        console.log("Level 3: General puzzle mechanics introduced.");
    } else if (level === 4) {
        // Boss fight
        console.log("Level 4: Boss fight!");
        // Boss mechanics here (add a boss character)
    }
}

startLevel(level);
draw();
