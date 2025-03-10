// index.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let player = { x: 100, y: 200, size: 20, health: 100, color: '#00FF00', speed: 5 };
let enemy = { x: 500, y: 200, size: 20, health: 100, color: '#FF0000', speed: 5 };
let turn = 1;
let isBlocking = false;
let inAir = false;

document.getElementById('attackButton').addEventListener('click', () => {
    if (turn % 2 !== 0) {
        playerAttack();
    }
});

document.getElementById('dashButton').addEventListener('click', () => {
    if (turn % 2 !== 0) {
        playerDash();
    }
});

document.getElementById('uppercutButton').addEventListener('click', () => {
    if (turn % 2 !== 0) {
        playerUppercut();
    }
});

document.getElementById('jumpButton').addEventListener('click', () => {
    if (turn % 2 !== 0) {
        playerJump();
    }
});

document.getElementById('upperSliceButton').addEventListener('click', () => {
    if (turn % 2 !== 0) {
        playerUpperSlice();
    }
});

// Player attack
function playerAttack() {
    if (enemy.health > 0) {
        let damage = 10;
        if (enemy.blocking) {
            damage /= 2; // Block reduces damage
        }
        enemy.health -= damage;
        updateHealth();
        nextTurn();
    }
}

// Player Dash (move quickly to a new position)
function playerDash() {
    player.x += player.speed * 20;
    if (player.x > canvas.width) player.x = canvas.width;
    nextTurn();
}

// Player Uppercut (knocks the enemy back)
function playerUppercut() {
    if (Math.abs(player.x - enemy.x) < 30) {
        enemy.y -= 30;
        enemy.health -= 15;
        updateHealth();
    }
    nextTurn();
}

// Player Jump (move upwards)
function playerJump() {
    if (!inAir) {
        inAir = true;
        player.y -= 50;
        setTimeout(() => {
            player.y += 50;
            inAir = false;
        }, 500); // Simulate jumping for 500ms
    }
    nextTurn();
}

// Player Upper Slice (powerful slash with a cooldown)
function playerUpperSlice() {
    if (Math.abs(player.x - enemy.x) < 40) {
        enemy.health -= 25;
        updateHealth();
    }
    nextTurn();
}

// Enemy attack (randomized actions)
function enemyAttack() {
    const move = Math.random();
    if (move < 0.2) {
        enemyBasicAttack();
    } else if (move < 0.4) {
        enemyDash();
    } else if (move < 0.6) {
        enemyUppercut();
    } else if (move < 0.8) {
        enemyJump();
    } else {
        enemyUpperSlice();
    }
}

// Enemy Basic Attack (simple attack)
function enemyBasicAttack() {
    let damage = 10;
    if (isBlocking) damage /= 2; // Block reduces damage
    player.health -= damage;
    updateHealth();
}

// Enemy Dash (move quickly)
function enemyDash() {
    enemy.x -= enemy.speed * 20;
    if (enemy.x < 0) enemy.x = 0;
}

// Enemy Uppercut (knocks player back)
function enemyUppercut() {
    if (Math.abs(player.x - enemy.x) < 30) {
        player.y -= 30;
        player.health -= 15;
        updateHealth();
    }
}

// Enemy Jump (move upwards)
function enemyJump() {
    enemy.y -= 50;
    setTimeout(() => {
        enemy.y += 50;
    }, 500); // Simulate jump for 500ms
}

// Enemy Upper Slice (powerful slash)
function enemyUpperSlice() {
    if (Math.abs(player.x - enemy.x) < 40) {
        player.health -= 25;
        updateHealth();
    }
}

// Block player action
function playerBlock() {
    isBlocking = true;
    nextTurn();
}

// Update the health display
function updateHealth() {
    document.getElementById('playerHealth').textContent = player.health;
    document.getElementById('enemyHealth').textContent = enemy.health;
}

// Next turn logic
function nextTurn() {
    turn++;
    isBlocking = false;
    document.getElementById('turn').textContent = turn;
    if (player.health <= 0 || enemy.health <= 0) {
        gameOver();
    } else {
        setTimeout(enemyTurn, 1000);
    }
}

// Enemy's turn: perform a randomized action
function enemyTurn() {
    if (turn % 2 === 0) {
        enemyAttack();
        nextTurn();
    }
}

// Game over condition
function gameOver() {
    if (player.health <= 0) {
        alert('Game Over! You lost!');
    } else if (enemy.health <= 0) {
        alert('You won!');
    }
    resetGame();
}

// Reset the game state
function resetGame() {
    player.health = 100;
    enemy.health = 100;
    player.x = 100;
    enemy.x = 500;
    turn = 1;
    updateHealth();
    document.getElementById('turn').textContent = turn;
}

// Draw the game on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();

    // Draw enemy
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
}

// Game loop to update drawing
function gameLoop() {
    drawGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
