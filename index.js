// Clicker Game with Upgrades
let points = 0;
let multiplier = 1;

function incrementPoints() {
    points += multiplier;
    document.getElementById('clickerPoints').textContent = points;
}

function buyUpgrade() {
    if (points >= 10) {
        points -= 10;
        multiplier++;
        document.getElementById('clickerPoints').textContent = points;
        document.getElementById('clickerMultiplier').textContent = `Multiplier: x${multiplier}`;
    }
}

// Show selected game section
function showGameSection(gameName) {
    const sections = document.querySelectorAll('.game-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(gameName).style.display = 'block';
}

// Catch the Ball Game (Fixed Score, No Trail)
let catchScore = 0;

function startCatchGame() {
    const canvas = document.getElementById('catchCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
    
    let ball = { x: Math.random() * canvas.width, y: 0, radius: 20, dy: 2, color: 'red' };
    let basket = { x: canvas.width / 2 - 50, y: canvas.height - 30, width: 100, height: 20, color: 'green' };

    function drawBasket() {
        ctx.beginPath();
        ctx.rect(basket.x, basket.y, basket.width, basket.height);
        ctx.fillStyle = basket.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function updateBallPosition() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.y += ball.dy;
        if (ball.y + ball.radius > canvas.height) {
            ball.y = 0;
            ball.x = Math.random() * canvas.width;
        }

        if (ball.y + ball.radius >= basket.y && ball.x >= basket.x && ball.x <= basket.x + basket.width) {
            catchScore++;
            document.getElementById('catchScore').textContent = 'Score: ' + catchScore;
            ball.y = 0;
            ball.x = Math.random() * canvas.width;
        }

        drawBall();
        drawBasket();
    }

    setInterval(updateBallPosition, 10);

    window.addEventListener('mousemove', function(event) {
        basket.x = event.clientX - canvas.offsetLeft - basket.width / 2;
    });
}

// Ball Bounce (Fixing Flicker)
let balls = [];

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

    balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 4 + 1, Math.random() * 4 + 1, 'blue'));

    setInterval(updateBallPosition, 10);
}

// Number Guessing Game (Correct Input Handling)
let targetNumber = Math.floor(Math.random() * 10) + 1;

function guessNumber() {
    const userGuess = parseInt(document.getElementById('guess').value);
    const result = document.getElementById('guessResult');
    if (userGuess === targetNumber) {
        result.textContent = 'Correct! You guessed the right number.';
    } else {
        result.textContent = 'Try again!';
    }
}

// Maze Runner Game (Control with Mouse)
function startMazeGame() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    const player = { x: 50, y: 50, width: 20, height: 20, color: 'blue' };
    const maze = [
        { x: 100, y: 100, width: 200, height: 20 },
        { x: 100, y: 100, width: 20, height: 100 },
        { x: 200, y: 200, width: 20, height: 100 },
    ];

    function drawPlayer() {
        ctx.beginPath();
        ctx.rect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawMaze() {
        maze.forEach(function(wall) {
            ctx.beginPath();
            ctx.rect(wall.x, wall.y, wall.width, wall.height);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
        });
    }

    function updatePlayerPosition() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawMaze();
    }

    window.addEventListener('mousemove', function(event) {
        player.x = event.clientX - canvas.offsetLeft - player.width / 2;
        player.y = event.clientY - canvas.offsetTop - player.height / 2;
    });

    setInterval(updatePlayerPosition, 10);
}
