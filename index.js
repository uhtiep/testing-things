// Updated Clicker Game - Cookie Clicker Style
let clickerPoints = localStorage.getItem('clickerPoints') ? parseInt(localStorage.getItem('clickerPoints')) : 0;
let multiplier = localStorage.getItem('multiplier') ? parseInt(localStorage.getItem('multiplier')) : 1;
let passiveIncome = localStorage.getItem('passiveIncome') ? parseInt(localStorage.getItem('passiveIncome')) : 0;
let passiveTimer;

// Upgrade clicker multiplier
function buyClickerUpgrade() {
    if (clickerPoints >= 50) { // Upgrade costs 50 points
        clickerPoints -= 50;
        multiplier += 1;
        document.getElementById('clickerPoints').textContent = clickerPoints;
        document.getElementById('clickerMultiplier').textContent = `Multiplier: x${multiplier}`;
        localStorage.setItem('clickerPoints', clickerPoints);
        localStorage.setItem('multiplier', multiplier);
    }
}

// Upgrade passive income generator
function buyPassiveUpgrade() {
    if (clickerPoints >= 100) { // Upgrade costs 100 points
        clickerPoints -= 100;
        passiveIncome += 1;
        document.getElementById('clickerPoints').textContent = clickerPoints;
        document.getElementById('passiveIncome').textContent = `Passive Income: ${passiveIncome} points/s`;
        localStorage.setItem('clickerPoints', clickerPoints);
        localStorage.setItem('passiveIncome', passiveIncome);
    }
}

// Add passive income over time
function startPassiveIncome() {
    if (!passiveTimer) {
        passiveTimer = setInterval(() => {
            clickerPoints += passiveIncome;
            document.getElementById('clickerPoints').textContent = clickerPoints;
            localStorage.setItem('clickerPoints', clickerPoints);
        }, 1000); // Earn points every second
    }
}

// Manual click increment
function incrementPoints() {
    clickerPoints += multiplier;
    document.getElementById('clickerPoints').textContent = clickerPoints;
    localStorage.setItem('clickerPoints', clickerPoints);
}

// Ball Bounce Game with Spinning Border
let balls = [];
let borderHoleRadius = 40;  // Hole radius

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

    function drawSpinningBorder() {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Date.now() / 1000); // Spin effect

        // Draw circular border with a hole
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, borderHoleRadius, 0, Math.PI * 2); // Hole in the center
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    }

    function updateBallPosition() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSpinningBorder();

        balls.forEach(ball => {
            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
            if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;

            // Balls escaping the hole in the border
            let distanceToCenter = Math.sqrt(Math.pow(ball.x - canvas.width / 2, 2) + Math.pow(ball.y - canvas.height / 2, 2));
            if (distanceToCenter < borderHoleRadius + ball.radius) {
                ball.dy = 0;
                ball.dx = 0;
            }

            ball.x += ball.dx;
            ball.y += ball.dy;
            drawBall(ball);
        });
    }

    setInterval(updateBallPosition, 10);
}

function spawnBorderHole() {
    // Button triggers spawning of a spinning border
    balls.push(new Ball(Math.random() * 300, Math.random() * 200, Math.random() * 4 + 1, Math.random() * 4 + 1, 'blue'));
}

function resetBallBounce() {
    balls = [];
}
