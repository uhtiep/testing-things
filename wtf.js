document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
    // Play background music
    const music = document.getElementById('background-music');
    music.play();

    // Initialize the game
    initializeTubes();
    initializeBalls();
}

function initializeTubes() {
    const tubesContainer = document.getElementById('tubes-container');
    tubesContainer.innerHTML = ''; // Clear existing tubes

    // Create 3 tubes
    for (let i = 0; i < 3; i++) {
        const tube = document.createElement('div');
        tube.classList.add('tube');
        tube.setAttribute('id', `tube-${i}`);
        tubesContainer.appendChild(tube);
    }
}

function initializeBalls() {
    const ballsContainer = document.getElementById('balls-container');
    ballsContainer.innerHTML = ''; // Clear existing balls

    const colors = ['red', 'blue', 'green', 'yellow'];
    const ballCount = 6; // Number of balls to be created

    // Create balls
    for (let i = 0; i < ballCount; i++) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        ball.setAttribute('draggable', true);
        ball.setAttribute('id', `ball-${i}`);
        ball.addEventListener('dragstart', dragStart);
        ballsContainer.appendChild(ball);
    }
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

const tubes = document.querySelectorAll('.tube');
tubes.forEach(tube => {
    tube.addEventListener('dragover', dragOver);
    tube.addEventListener('drop', dropBall);
});

function dragOver(event) {
    event.preventDefault(); // Allow the drop
}

function dropBall(event) {
    event.preventDefault();
    const ballId = event.dataTransfer.getData("text");
    const ball = document.getElementById(ballId);

    const tube = event.target;
    if (tube.classList.contains('tube')) {
        if (tube.children.length < 5) { // Limit the number of balls in each tube
            tube.appendChild(ball);
        }
    }
}
