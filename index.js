// Show and hide game sections
function showGameSection(section) {
    const sections = document.querySelectorAll('.game-section');
    sections.forEach(sec => {
        sec.style.display = sec.id === section ? 'block' : 'none';
    });
}

// Catch the Ball
let catchBalls = [];
let catchScore = 0;

function startCatchGame() {
    const canvas = document.getElementById('catchCanvas');
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
        catchBalls.forEach(ball => {
            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
            if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;

            ball.x += ball.dx;
            ball.y += ball.dy;
            drawBall(ball);

            if (ball.y > canvas.height - ball.radius) {
                catchScore++;
                document.getElementById('catchScore').textContent = "Score: " + catchScore;
            }
        });
    }

    setInterval(updateBallPosition, 10);
}

// Ball Bounce
let balls = [];
let borderHole = null;

function startBallBounce() {
    const canvas = document.getElementById('bounceCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    function Ball(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = 10;
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
        if (borderHole) {
            ctx.beginPath();
            ctx.arc(borderHole.x, borderHole.y, borderHole.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    }

    setInterval(updateBallPosition, 10);
}

function spawnBorderHole() {
    const canvas = document.getElementById('bounceCanvas');
    borderHole = { x: 200, y: 150, radius: 30 };
}

// Maze Runner
let player = { x: 50, y: 50, speed: 5 };
function startMazeGame() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    function drawPlayer() {
        ctx.beginPath();
        ctx.rect(player.x, player.y, 20, 20);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    function updateMazePosition(e) {
        switch (e.key) {
            case 'ArrowUp':
                player.y -= player.speed;
                break;
            case 'ArrowDown':
                player.y += player.speed;
                break;
            case 'ArrowLeft':
                player.x -= player.speed;
                break;
            case 'ArrowRight':
                player.x += player.speed;
                break;
        }
    }

    document.addEventListener('keydown', updateMazePosition);

    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
    }, 10);
}

// Number Guessing Game
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
let clickerPoints = 0;
let clickerMultiplier = 1;
let passiveIncome = 0;

function incrementPoints() {
    clickerPoints += clickerMultiplier;
    document.getElementById('clickerPoints').textContent = clickerPoints;
}

function buyClickerUpgrade() {
    if (clickerPoints >= 50) {
        clickerPoints -= 50;
        clickerMultiplier *= 2;
        document.getElementById('clickerMultiplier').textContent = `Multiplier: x${clickerMultiplier}`;
    }
}

function buyPassiveUpgrade() {
    if (clickerPoints >= 100) {
        clickerPoints -= 100;
        passiveIncome += 1;
        document.getElementById('passiveIncome').textContent = `Passive Income: ${passiveIncome} points/s`;
    }
}

// Breakout (needs a full game loop)
function startBreakoutGame() {
    // Full logic for Breakout to be implemented
}

// Add similar for other games...
