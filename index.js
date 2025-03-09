const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let glasses = [];
let selectedBall = null;

class Glass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 150;
        this.balls = [];
    }
    draw() {
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.balls.forEach((ball, index) => {
            ball.x = this.x + this.width / 2;
            ball.y = this.y + this.height - (index + 1) * 40;
            ball.draw();
        });
    }
    canAddBall(ball) {
        return this.balls.length < 4 && (this.balls.length === 0 || this.balls[this.balls.length - 1].color === ball.color);
    }
    addBall(ball) {
        if (this.canAddBall(ball)) {
            this.balls.push(ball);
            return true;
        }
        return false;
    }
    removeBall() {
        return this.balls.pop();
    }
    isSorted() {
        return this.balls.length === 4 && this.balls.every(ball => ball.color === this.balls[0].color);
    }
}

class Ball {
    constructor(color) {
        this.color = color;
        this.radius = 20;
        this.x = 0;
        this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function setupGame() {
    glasses = [new Glass(100, 200), new Glass(200, 200), new Glass(300, 200), new Glass(400, 200)];
    let colors = ["red", "blue", "green", "yellow"];
    let allBalls = [];
    colors.forEach(color => {
        for (let i = 0; i < 4; i++) {
            allBalls.push(new Ball(color));
        }
    });
    allBalls.sort(() => Math.random() - 0.5);
    
    let index = 0;
    glasses.forEach(glass => {
        while (glass.balls.length < 4 && index < allBalls.length) {
            glass.addBall(allBalls[index]);
            index++;
        }
    });
}

canvas.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    
    let clickedGlass = glasses.find(glass => mouseX > glass.x && mouseX < glass.x + glass.width && mouseY > glass.y && mouseY < glass.y + glass.height);
    
    if (clickedGlass) {
        if (selectedBall) {
            if (clickedGlass.addBall(selectedBall)) {
                selectedBall = null;
            }
        } else {
            selectedBall = clickedGlass.removeBall();
        }
    }
    checkWin();
});

function checkWin() {
    if (glasses.every(glass => glass.isSorted() || glass.balls.length === 0)) {
        alert("You win!");
        setupGame();
    }
}

function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    glasses.forEach(glass => glass.draw());
    if (selectedBall) selectedBall.draw();
}

function animate() {
    requestAnimationFrame(animate);
    drawObjects();
}

setupGame();
animate();
