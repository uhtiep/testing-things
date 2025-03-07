// Tetris.js

const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const rows = 20;
const columns = 10;
const squareSize = 30;
let grid = [];

// Initialize the game grid
function initializeGrid() {
    grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < columns; col++) {
            grid[row][col] = 'empty';
        }
    }
}

// Draw the grid
function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (grid[row][col] !== 'empty') {
                ctx.fillStyle = grid[row][col];
                ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
            }
        }
    }
}

// Tetrimino shapes
const tetrominoes = [
    { color: 'cyan', shape: [[1, 1, 1, 1]] }, // I
    { color: 'blue', shape: [[1, 1], [1, 1]] }, // O
    { color: 'orange', shape: [[0, 1, 0], [1, 1, 1]] }, // T
    { color: 'green', shape: [[1, 1, 0], [0, 1, 1]] }, // S
    { color: 'red', shape: [[0, 1, 1], [1, 1, 0]] }, // Z
    { color: 'purple', shape: [[1, 0, 0], [1, 1, 1]] }, // L
    { color: 'yellow', shape: [[0, 0, 1], [1, 1, 1]] }, // J
];

// Randomly select a tetromino
function randomTetromino() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

// Tetromino properties
let currentTetromino;
let currentX = 4;
let currentY = 0;

// Draw the current tetromino
function drawTetromino() {
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                ctx.fillStyle = color;
                ctx.fillRect((currentX + col) * squareSize, (currentY + row) * squareSize, squareSize, squareSize);
                ctx.strokeStyle = 'black';
                ctx.strokeRect((currentX + col) * squareSize, (currentY + row) * squareSize, squareSize, squareSize);
            }
        }
    }
}

// Check if the tetromino can move to the given position
function isValidMove(newX, newY, newShape) {
    for (let row = 0; row < newShape.length; row++) {
        for (let col = 0; col < newShape[row].length; col++) {
            if (newShape[row][col]) {
                const x = newX + col;
                const y = newY + row;
                if (x < 0 || x >= columns || y >= rows || grid[y][x] !== 'empty') {
                    return false;
                }
            }
        }
    }
    return true;
}

// Place the current tetromino on the grid
function placeTetromino() {
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                grid[currentY + row][currentX + col] = color;
            }
        }
    }
    checkLines();
}

// Check for completed lines
function checkLines() {
    for (let row = rows - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== 'empty')) {
            grid.splice(row, 1);
            grid.unshift(Array(columns).fill('empty'));
            updateScore(100); // Add score for clearing a line
        }
    }
}

// Update the score display
let score = 0;
function updateScore(points) {
    score += points;
    document.getElementById('tetrisScore').innerText = 'Score: ' + score;
}

// Move the tetromino down
function moveDown() {
    if (isValidMove(currentX, currentY + 1, currentTetromino.shape)) {
        currentY++;
    } else {
        placeTetromino();
        currentTetromino = randomTetromino();
        currentX = 4;
        currentY = 0;
        if (!isValidMove(currentX, currentY, currentTetromino.shape)) {
            // Game over if the new tetromino can't be placed
            alert("Game Over!");
            initializeGrid();
            score = 0;
            document.getElementById('tetrisScore').innerText = 'Score: ' + score;
        }
    }
}

// Rotate the tetromino
function rotateTetromino() {
    const newShape = currentTetromino.shape[0].map((_, index) => currentTetromino.shape.map(row => row[index]));
    if (isValidMove(currentX, currentY, newShape)) {
        currentTetromino.shape = newShape;
    }
}

// Move the tetromino left or right
function moveTetromino(dir) {
    const newX = currentX + dir;
    if (isValidMove(newX, currentY, currentTetromino.shape)) {
        currentX = newX;
    }
}

// Handle user input for movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveTetromino(-1);
    } else if (event.key === 'ArrowRight') {
        moveTetromino(1);
    } else if (event.key === 'ArrowDown') {
        moveDown();
    } else if (event.key === 'ArrowUp') {
        rotateTetromino();
    }
});

// Start a new game
function startTetris() {
    initializeGrid();
    currentTetromino = randomTetromino();
    currentX = 4;
    currentY = 0;
    score = 0;
    document.getElementById('tetrisScore').innerText = 'Score: ' + score;

    const gameInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawTetromino();
        moveDown();
    }, 500); // Speed of falling blocks
}

// Pause game (stop the game loop)
function pauseTetris() {
    clearInterval(gameInterval);
}

// Reset game
function resetTetris() {
    clearInterval(gameInterval);
    startTetris();
}
