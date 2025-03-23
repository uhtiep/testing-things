// Set up canvas sizes
const physicsCanvas = document.getElementById('physicsCanvas');
const combatCanvas = document.getElementById('combatCanvas');

const physicsCtx = physicsCanvas.getContext('2d');
const combatCtx = combatCanvas.getContext('2d');

let currentGame = null;

function goHome() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('physics-game').style.display = 'none';
    document.getElementById('combat-game').style.display = 'none';
}

function startPhysicsGame() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('physics-game').style.display = 'block';
    currentGame = 'physics';
    initPhysicsGame();
}

function startCombatGame() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('combat-game').style.display = 'block';
    currentGame = 'combat';
    initCombatGame();
}

// Physics Game Setup
function initPhysicsGame() {
    // Set up canvas dimensions
    physicsCanvas.width = window.innerWidth;
    physicsCanvas.height = window.innerHeight;
    // Example physics objects (planks, nails, etc.)
    // You could expand this later with more complex physics interactions
    let planks = [];
    let gravity = 0.5;

    function createPlank(x, y, width, height) {
        planks.push({x, y, width, height, velocityY: 0});
    }

    function updatePhysics() {
        physicsCtx.clearRect(0, 0, physicsCanvas.width, physicsCanvas.height);
        for (let plank of planks) {
            plank.velocityY += gravity;
            plank.y += plank.velocityY;
            physicsCtx.fillStyle = '#1e90ff';
            physicsCtx.fillRect(plank.x, plank.y, plank.width, plank.height);
        }
        requestAnimationFrame(updatePhysics);
    }

    createPlank(200, 0, 100, 20);  // Example plank
    updatePhysics();
}

// Combat Game Setup
function initCombatGame() {
    // Set up canvas dimensions
    combatCanvas.width = window.innerWidth;
    combatCanvas.height = window.innerHeight;

    let player = { x: 100, y: 100, width: 50, height: 50, image: 'hand.png' };
    let enemies = [];
    let isPunching = false;
    let isShooting = false;

    const playerImage = new Image();
    playerImage.src = player.image;

    function spawnEnemy() {
        const enemy = { x: Math.random() * combatCanvas.width, y: Math.random() * combatCanvas.height, width: 50, height: 50, image: 'enemy.png' };
        enemies.push(enemy);
    }

    function drawCombat() {
        combatCtx.clearRect(0, 0, combatCanvas.width, combatCanvas.height);
        combatCtx.drawImage(playerImage, player.x, player.y, player.width, player.height);

        for (let enemy of enemies) {
            const enemyImage = new Image();
            enemyImage.src = enemy.image;
            combatCtx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }

        if (isPunching) {
            // Handle punching logic (e.g., check for collision with enemies)
        }

        if (isShooting) {
            // Handle shooting logic (e.g., create projectiles)
        }

        requestAnimationFrame(drawCombat);
    }

    // Game control - Punching and Shooting
    document.addEventListener('keydown', (event) => {
        if (event.key === 'z') {
            isPunching = true;
        }
        if (event.key === 'x') {
            isShooting = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'z') {
            isPunching = false;
        }
        if (event.key === 'x') {
            isShooting = false;
        }
    });

    setInterval(spawnEnemy, 2000);  // Spawn enemies periodically
    drawCombat();
}
