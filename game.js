// Player and enemy stats
let playerHealth = 100;
let enemyHealth = 100;
let playerTurn = true;

// References
const playerHealthElement = document.getElementById("playerHealth");
const enemyHealthElement = document.getElementById("enemyHealth");
const battleMessageElement = document.getElementById("battleMessage");
const playerHeart = document.getElementById("playerHeart");
const battleBox = document.getElementById("battleBox");

// Player movement variables
let heartX = 135;
let heartY = 130;
const speed = 5;

// Move player heart with WASD or arrow keys
document.addEventListener("keydown", (event) => {
    if (!playerTurn) return;

    switch (event.key) {
        case "ArrowLeft":
        case "a":
            heartX -= speed;
            break;
        case "ArrowRight":
        case "d":
            heartX += speed;
            break;
        case "ArrowUp":
        case "w":
            heartY -= speed;
            break;
        case "ArrowDown":
        case "s":
            heartY += speed;
            break;
    }

    heartX = Math.max(0, Math.min(285, heartX));
    heartY = Math.max(0, Math.min(135, heartY));

    playerHeart.style.left = `${heartX}px`;
    playerHeart.style.top = `${heartY}px`;
});

// Enemy Attack (Spawns projectiles)
function enemyAttack() {
    battleMessageElement.innerText = "Enemy is attacking!";
    playerTurn = false;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            let projectile = document.createElement("div");
            projectile.classList.add("projectile");
            battleBox.appendChild(projectile);

            let projX = Math.random() * 290;
            projectile.style.left = `${projX}px`;
            projectile.style.top = "0px";

            let fallInterval = setInterval(() => {
                let projY = parseInt(projectile.style.top) + 5;
                projectile.style.top = `${projY}px`;

                // Collision detection
                if (projY > 135 && Math.abs(projX - heartX) < 15) {
                    playerHealth -= 10;
                    updateHealth();
                    clearInterval(fallInterval);
                    battleBox.removeChild(projectile);
                }

                if (projY > 150) {
                    clearInterval(fallInterval);
                    battleBox.removeChild(projectile);
                }
            }, 100);
        }, i * 500);
    }

    setTimeout(() => {
        battleMessageElement.innerText = "Your turn!";
        playerTurn = true;
    }, 4000);
}

// Attack mechanic with timing
function attack() {
    if (!playerTurn) return;
    battleMessageElement.innerText = "Press SPACE when the bar reaches the center!";
    
    let timing = Math.random() * 1000 + 500;
    setTimeout(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === " " && playerTurn) {
                let damage = Math.floor(Math.random() * 25) + 10;
                enemyHealth -= damage;
                battleMessageElement.innerText = `You hit for ${damage} damage!`;
                updateHealth();

                if (enemyHealth <= 0) {
                    battleMessageElement.innerText = "You won!";
                } else {
                    setTimeout(enemyAttack, 1000);
                }
            }
        }, { once: true });
    }, timing);
}

// Update health display
function updateHealth() {
    playerHealthElement.innerText = `HP: ${playerHealth}`;
    enemyHealthElement.innerText = `Enemy HP: ${enemyHealth}`;

    if (playerHealth <= 0) {
        battleMessageElement.innerText = "You lost...";
        playerTurn = false;
    }
}

// Buttons
document.getElementById("attackButton").addEventListener("click", attack);
document.getElementById("defendButton").addEventListener("click", enemyAttack);
