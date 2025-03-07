// Initialize player and enemy stats
let playerHealth = 100;
let enemyHealth = 100;

// Reference to HTML elements
const playerHealthElement = document.getElementById("playerHealth");
const enemyHealthElement = document.getElementById("enemyHealth");
const battleMessageElement = document.getElementById("battleMessage");

// Action Buttons
const attackButton = document.getElementById("attackButton");
const actButton = document.getElementById("actButton");
const defendButton = document.getElementById("defendButton");

// Functions for actions
function attack() {
    const damage = Math.floor(Math.random() * 20) + 10; // Random damage between 10 and 30
    enemyHealth -= damage;
    battleMessageElement.innerText = `You attacked the enemy for ${damage} damage!`;

    // Update enemy health
    if (enemyHealth <= 0) {
        enemyHealth = 0;
        battleMessageElement.innerText = "You defeated the enemy!";
        disableActions();
    }
    updateHealth();
}

function act() {
    const result = Math.random() < 0.5 ? 'You comforted the enemy. They feel better.' : 'The enemy is confused!';
    battleMessageElement.innerText = result;
}

function defend() {
    const damageBlocked = Math.floor(Math.random() * 10) + 5; // Block between 5-15 damage
    playerHealth += damageBlocked;
    battleMessageElement.innerText = `You blocked some damage! You gained ${damageBlocked} health.`;

    if (playerHealth > 100) playerHealth = 100; // Maximum health is 100
    updateHealth();
}

// Update health values on the screen
function updateHealth() {
    playerHealthElement.innerText = `Player Health: ${playerHealth}`;
    enemyHealthElement.innerText = `Enemy Health: ${enemyHealth}`;
}

// Disable action buttons when the battle is over
function disableActions() {
    attackButton.disabled = true;
    actButton.disabled = true;
    defendButton.disabled = true;
}

// Reset the game after the battle is over
function resetGame() {
    playerHealth = 100;
    enemyHealth = 100;
    battleMessageElement.innerText = "Your turn!";
    attackButton.disabled = false;
    actButton.disabled = false;
    defendButton.disabled = false;
    updateHealth();
}

// Attach event listeners to buttons
attackButton.addEventListener("click", attack);
actButton.addEventListener("click", act);
defendButton.addEventListener("click", defend);

