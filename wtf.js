let tubes = [];
let containers = [];
let waterFlowing = false;
let playerGuess = null;
let isGameOver = false;

// Event listener for start button
document.getElementById('start-btn').addEventListener('click', startFlow);

// Generate random game structure
function generateGame() {
    const tubesContainer = document.getElementById('tubes-container');
    const guessesContainer = document.getElementById('guesses-container');
    tubesContainer.innerHTML = '';
    guessesContainer.innerHTML = '';

    // Randomly place 3 tubes and 3 containers in the layout
    let tubeIndexes = [1, 2, 3];
    let containerIndexes = [4, 5, 6];

    // Create tubes
    tubeIndexes.forEach((index) => {
        const tube = document.createElement('div');
        tube.classList.add('tube');
        tube.setAttribute('id', `tube-${index}`);
        tubes.push(tube);
        tubesContainer.appendChild(tube);
    });

    // Create containers
    containerIndexes.forEach((index) => {
        const container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('id', `container-${index}`);
        containers.push(container);
        tubesContainer.appendChild(container);

        // Create a guess button for each container
        const button = document.createElement('button');
        button.textContent = `Guess Container ${index}`;
        button.addEventListener('click', () => makeGuess(index));
        guessesContainer.appendChild(button);
    });

    // Randomly populate tubes with balls representing water
    tubes.forEach((tube) => {
        const water = document.createElement('div');
        water.classList.add('water');
        water.style.height = `${Math.random() * 80 + 20}px`; // Random height for water
        tube.appendChild(water);
    });
}

// Function for the player to make a guess
function makeGuess(containerIndex) {
    if (isGameOver) return;
    playerGuess = containerIndex;
    alert(`You guessed that container ${containerIndex} will fill first!`);
}

// Function to start the water flow
function startFlow() {
    if (waterFlowing || isGameOver) return;
    waterFlowing = true;
    const flowInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(flowInterval);
            return;
        }
        // Simulate water flowing
        const flowingTube = tubes[Math.floor(Math.random() * tubes.length)];
        const targetContainer = containers[Math.floor(Math.random() * containers.length)];

        // Check if the water can flow into the container
        const water = flowingTube.querySelector('.water');
        if (water) {
            // Simulate water flowing into container
            const containerWater = document.createElement('div');
            containerWater.classList.add('water');
            containerWater.style.height = `${parseFloat(water.style.height)}px`;
            targetContainer.appendChild(containerWater);

            // Check if the container is filled (assuming a threshold height)
            if (targetContainer.scrollHeight >= 130) {
                isGameOver = true;
                clearInterval(flowInterval);
                alert(`Container ${targetContainer.id} filled first!`);
                if (playerGuess === parseInt(targetContainer.id.split('-')[1])) {
                    alert("You won!");
                } else {
                    alert("You lost! Try again.");
                }
                document.getElementById('start-btn').disabled = false; // Allow the player to start a new game
            }
        }
    }, 1000); // Flow every second
}

// Initialize the game
function initializeGame() {
    generateGame();
    document.getElementById('start-btn').disabled = false; // Enable the "Start" button
}

initializeGame();
