// Global Variables
let balls = [];
let score = 0;
let multiplier = 1;
let passiveIncome = 0;
let points = 0;
let passiveUpgradeCost = 100;
let clickerUpgradeCost = 50;

function startCatchGame() {
    const canvas = document.getElementById('catchCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    // Ball Object and Logic
    function Ball(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }

    // Draw Ball
    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    // Update Ball Position and Check for Collision
    function updateBallPosition() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach(ball => {
            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
            if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;

            ball.x += ball.dx;
            ball.y += ball.dy;
            drawBall(ball);
        });
    }

    setInterval(updateBallPosition, 10);
}

// Start Game Button for Catch Game
document.querySelector('[onclick="startCatchGame()"]').addEventListener('click', () => {
    balls.push(new Ball(Math.random() * 300, Math.random() * 200, Math.random() * 4 + 1, Math.random() * 4 + 1, 'blue'));
});

// Ball Bounce
function startBallBounce() {
    const canvas = document.getElementById('bounceCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    function Ball(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }

    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function updateBallPosition() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach(ball => {
            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
            if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;

            ball.x += ball.dx;
            ball.y += ball.dy;
            drawBall(ball);
        });
    }

    setInterval(updateBallPosition, 10);
}

// Maze Runner
function startMazeGame() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    let playerX = 50;
    let playerY = 50;
    const playerSpeed = 5;

    function drawPlayer() {
        ctx.beginPath();
        ctx.rect(playerX, playerY, 20, 20);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    function updateMazePosition(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (playerY - playerSpeed >= 0) playerY -= playerSpeed;
                break;
            case 'ArrowDown':
                if (playerY + playerSpeed <= canvas.height - 20) playerY += playerSpeed;
                break;
            case 'ArrowLeft':
                if (playerX - playerSpeed >= 0) playerX -= playerSpeed;
                break;
            case 'ArrowRight':
                if (playerX + playerSpeed <= canvas.width - 20) playerX += playerSpeed;
                break;
        }
    }

    document.addEventListener('keydown', updateMazePosition);
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
    }, 10);
}

// Number Guessing
function guessNumber() {
    const guess = parseInt(document.getElementById('guess').value);
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const result = document.getElementById('guessResult');
    if (guess === randomNum) {
        result.textContent = 'You guessed correctly!';
    } else {
        result.textContent = 'Try again!';
    }
}

// Clicker Game
function incrementPoints() {
    points++;
    document.getElementById('clickerPoints').textContent = points;
}

function buyClickerUpgrade() {
    if (points >= clickerUpgradeCost) {
        points -= clickerUpgradeCost;
        multiplier *= 2;
        document.getElementById('clickerMultiplier').textContent = `Multiplier: x${multiplier}`;
    }
}

function buyPassiveUpgrade() {
    if (points >= passiveUpgradeCost) {
        points -= passiveUpgradeCost;
        passiveIncome += 1;
        document.getElementById('passiveIncome').textContent = `Passive Income: ${passiveIncome} points/s`;
    }
}

function updateClickerGame() {
    points += passiveIncome;
    document.getElementById('clickerPoints').textContent = points;
}

setInterval(updateClickerGame, 1000);
