// Ball Bounce Game
function startBallBounce() {
    const canvas = document.getElementById('bounceCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    let ball = { x: 200, y: 150, radius: 20, dx: 2, dy: 2, color: 'blue' };

    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function updateBallPosition() {
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
        if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
        ball.x += ball.dx;
        ball.y += ball.dy;
        drawBall();
    }

    setInterval(updateBallPosition, 10);
}

// Clicker Game
let points = 0;
function incrementPoints() {
    points++;
    document.getElementById('clickerPoints').textContent = points;
}

// Number Guessing Game
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

// Catch the Ball Game
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
        ball.y += ball.dy;
        if (ball.y + ball.radius > canvas.height) {
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

// Maze Runner Game
function startMazeGame() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    const player = { x: 50, y: 50, width: 20, height: 20, color: 'blue' };
    const maze = [
        { x: 100, y: 100, width: 200, height: 20 }, // walls of the maze
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

    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') player.y -= 5;
        if (e.key === 'ArrowDown') player.y += 5;
        if (e.key === 'ArrowLeft') player.x -= 5;
        if (e.key === 'ArrowRight') player.x += 5;
    });

    setInterval(updatePlayerPosition, 10);
}
