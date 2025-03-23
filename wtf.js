document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
    // Play background music
    const music = document.getElementById('background-music');
    music.play();

    // Initialize the game
    initializeTubes();
}

function initializeTubes() {
    const tubesContainer = document.getElementById('tubes-container');
    tubesContainer.innerHTML = ''; // Clear existing tubes

    // Create 3 tubes
    for (let i = 0; i < 3; i++) {
        const tube = document.createElement('div');
        tube.classList.add('tube');
        tube.setAttribute('id', `tube-${i}`);
        tube.addEventListener('dragover', dragOver);
        tube.addEventListener('drop', dropBall);
        tubesContainer.appendChild(tube);
    }

    initializeBalls();
}

function initializeBalls() {
    const tubes = document.querySelectorAll('.tube');
    const colors = ['red', 'blue', 'green']; // Only 3 colors per round
    const ballsPerTube = 4; // Number of balls per tube (each tube gets balls of one color)

    // Assign balls to tubes
    tubes.forEach((tube, index) => {
        const tubeBalls = [];
        for (let i = 0; i < ballsPerTube; i++) {
            const ball = document.createElement('div');
            ball.classList.add('ball');
            ball.style.backgroundColor = colors[index]; // Assign a color per tube
            ball.setAttribute('draggable', true);
            ball.setAttribute('id', `ball-${index}-${i}`);
            ball.addEventListener('dragstart', dragStart);
            tubeBalls.push(ball);
        }

        // Add the balls to the tube
        tubeBalls.forEach(ball => {
            tube.appendChild(ball);
        });
    });

    document.getElementById('start-btn').disabled = false; // Enable the button for a new game
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
    event.preventDefault(); // Allow the drop
}

function dropBall(event) {
    event.preventDefault();
    const ballId = event.dataTransfer.getData("text");
    const ball = document.getElementById(ballId);

    const tube = event.target;
    if (tube.classList.contains('tube') && tube !== ball.parentElement) {
        const topBall = tube.children[tube.children.length - 1];

        if (topBall && topBall.style.backgroundColor === ball.style.backgroundColor) {
            // Move the ball only if the top ball of the tube matches the ball's color
            tube.appendChild(ball);
        }
    }

    // Check if the game is won (all tubes have only 1 color)
    if (checkWinCondition()) {
        alert("You win!");
        document.getElementById('start-btn').disabled = false; // Enable the button for a new game
    }
}

function checkWinCondition() {
    const tubes = document.querySelectorAll('.tube');

    // Check if each tube contains only one color of balls
    for (let tube of tubes) {
        const balls = tube.children;
        const firstBallColor = balls[0]?.style.backgroundColor;

        if (!firstBallColor || [...balls].some(ball => ball.style.backgroundColor !== firstBallColor)) {
            return false; // If any tube has mixed colors, the player hasn't won yet
        }
    }

    return true; // All tubes contain only one color
}
