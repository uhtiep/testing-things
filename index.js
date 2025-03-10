// Game container management
function showGame(gameId) {
    const games = document.querySelectorAll('.game-container');
    games.forEach(game => game.style.display = 'none');
    
    document.getElementById(gameId).style.display = 'block';
}

// Catch the Ball Game
let score = 0;
let ballX = Math.random() * window.innerWidth;
let ballY = Math.random() * window.innerHeight;
let ballRadius = 20;
let isDragging = false;

function startCatchGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    const canvas = document.getElementById('catchCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', (event) => {
        const dist = Math.sqrt(Math.pow(event.offsetX - ballX, 2) + Math.pow(event.offsetY - ballY, 2));
        if (dist < ballRadius) {
            isDragging = true;
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDragging) {
            ballX = event.offsetX;
            ballY = event.offsetY;
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('click', (event) => {
        const dist = Math.sqrt(Math.pow(event.offsetX - ballX, 2) + Math.pow(event.offsetY - ballY, 2));
        if (dist < ballRadius) {
            score++;
            document.getElementById('score').textContent = score;
            ballX = Math.random() * window.innerWidth;
            ballY = Math.random() * window.innerHeight;
        }
    });

    function gameLoop() {
        drawBall();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Ball Bounce Game
let bounceBalls = [];

function spawnBall() {
    const canvas = document.getElementById('bounceCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let angle = 0;

    function drawBorder() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 200, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        angle += 0.01;
    }

    function createBall() {
        const ball = {
            x: Math.random() * 400 + 50, // Spawns inside the border
            y: Math.random() * 400 + 50,
            radius: 15,
            dx: Math.random() * 4 - 2,
            dy: Math.random() * 4 - 2
        };
        bounceBalls.push(ball);
    }

    function moveBalls() {
        bounceBalls.forEach(ball => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x < 50 || ball.x > canvas.width - 50) ball.dx = -ball.dx;
            if (ball.y < 50 || ball.y > canvas.height - 50) ball.dy = -ball.dy;
        });
    }

    function drawBalls() {
        bounceBalls.forEach(ball => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        });
    }

    createBall();
    function gameLoop() {
        drawBorder();
        moveBalls();
        drawBalls();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Maze Runner
function mazeRunner() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const player = { x: 50, y: 50, size: 20, color: "#0095DD" };

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    function movePlayer(event) {
        const speed = 5;
        if (event.key === "ArrowUp") player.y -= speed;
        if (event.key === "ArrowDown") player.y += speed;
        if (event.key === "ArrowLeft") player.x -= speed;
        if (event.key === "ArrowRight") player.x += speed;
    }

    document.addEventListener('keydown', movePlayer);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Number Guessing Game
let targetNumber = Math.floor(Math.random() * 100) + 1;

function checkGuess() {
    const guess = document.getElementById("guess").value;
    const result = document.getElementById("guessResult");

    if (guess == targetNumber) {
        result.textContent = "Correct! The number was " + targetNumber;
        targetNumber = Math.floor(Math.random() * 100) + 1; // New number for the next round
    } else {
        result.textContent = guess < targetNumber ? "Too low!" : "Too high!";
    }
}

// Clicker Game
let clickerMoney = 0;
let clickerUpgrades = 0;
let upgradeCost = 10;

function clickGame() {
    clickerMoney++;
    document.getElementById('clickerMoney').textContent = clickerMoney;
}

function buyUpgrade() {
    if (clickerMoney >= upgradeCost) {
        clickerMoney -= upgradeCost;
        clickerUpgrades++;
        upgradeCost *= 2;  // Cost increases with each upgrade
        document.getElementById('clickerMoney').textContent = clickerMoney;
        document.getElementById('clickerUpgrades').textContent = clickerUpgrades;
    } else {
        alert("Not enough money!");
    }
}

// Breakout Game
const breakoutBalls = [];
const paddle = { x: window.innerWidth / 2 - 50, y: window.innerHeight - 30, width: 100, height: 20, dx: 0 };

function createBreakoutBall() {
    const ball = { x: window.innerWidth / 2, y: window.innerHeight - 60, radius: 10, dx: 2, dy: -2 };
    breakoutBalls.push(ball);
}

function drawBreakout() {
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddle
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw ball
    breakoutBalls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // Ball movement
    breakoutBalls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball bounce logic
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
        if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
        if (ball.y + ball.radius > canvas.height) {
            alert("Game Over!");
            resetBreakout();
        }

        // Paddle collision
        if (ball.y + ball.radius > paddle.y && ball.y + ball.radius < paddle.y + paddle.height &&
            ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        }
    });

    // Move paddle with arrow keys
    if (paddle.dx) {
        paddle.x += paddle.dx;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }

    requestAnimationFrame(drawBreakout);
}

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") paddle.dx = -5;
    if (e.key === "ArrowRight") paddle.dx = 5;
});

document.addEventListener('keyup', () => paddle.dx = 0);

function resetBreakout() {
    breakoutBalls.length = 0;
    createBreakoutBall();
    drawBreakout();
}

createBreakoutBall();
drawBreakout();
