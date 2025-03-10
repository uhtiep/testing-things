const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
    x: 100,
    y: 500,
    width: 30,
    height: 30,
    color: "red",
    speed: 3,
    jumpPower: -10,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.5,
    isOnGround: false,
    isDashing: false,
    canDash: true,
    dashSpeed: 10,
    dashTime: 0,
    dashDuration: 10,
};

// Input keys
const keys = {
    left: false,
    right: false,
    up: false,
    dash: false,
};

// Platforms
const platforms = [
    { x: 50, y: 550, width: 200, height: 20 },
    { x: 300, y: 450, width: 200, height: 20 },
    { x: 550, y: 350, width: 200, height: 20 },
];

// Event listeners for input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowUp") {
        if (player.isOnGround) {
            player.velocityY = player.jumpPower;
            player.isOnGround = false;
        }
    }
    if (e.key === "Shift" && player.canDash) {
        player.isDashing = true;
        player.canDash = false;
        player.dashTime = player.dashDuration;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
});

// Update function
function update() {
    if (player.isDashing) {
        if (player.dashTime > 0) {
            player.velocityX = keys.left ? -player.dashSpeed : keys.right ? player.dashSpeed : 0;
            player.dashTime--;
        } else {
            player.isDashing = false;
        }
    } else {
        player.velocityX = 0;
        if (keys.left) player.velocityX = -player.speed;
        if (keys.right) player.velocityX = player.speed;
        player.velocityY += player.gravity;
    }

    // Movement and collision
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collision
    player.isOnGround = false;
    platforms.forEach((platform) => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height - player.velocityY < platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isOnGround = true;
            player.canDash = true;
        }
    });

    // Prevent falling off the screen
    if (player.y > canvas.height) {
        player.y = 500;
        player.velocityY = 0;
        player.canDash = true;
    }
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = "brown";
    platforms.forEach((platform) => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
