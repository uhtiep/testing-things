// tetris.js

const canvas = document.getElementById("tetris-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 600;
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = canvas.width / COLS;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]] // J
];

let piece = randomPiece();
let position = { x: 3, y: 0 };

function randomPiece() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

function drawBlock(x, y, color = "cyan") {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) drawBlock(x, y, "gray");
    }));
    piece.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) drawBlock(position.x + x, position.y + y);
    }));
}

function movePiece(dir) {
    position.x += dir;
    if (collision()) position.x -= dir;
}

function dropPiece() {
    position.y++;
    if (collision()) {
        position.y--;
        mergePiece();
        piece = randomPiece();
        position = { x: 3, y: 0 };
        if (collision()) resetGame();
    }
}

function collision() {
    return piece.some((row, dy) =>
        row.some((cell, dx) =>
            cell &&
            (board[position.y + dy] === undefined ||
                board[position.y + dy][position.x + dx] === undefined ||
                board[position.y + dy][position.x + dx])
        )
    );
}

function mergePiece() {
    piece.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) board[position.y + y][position.x + x] = 1;
    }));
    clearLines();
}

function clearLines() {
    board = board.filter(row => row.some(cell => !cell));
    while (board.length < ROWS) board.unshift(Array(COLS).fill(0));
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") movePiece(-1);
    if (e.key === "ArrowRight") movePiece(1);
    if (e.key === "ArrowDown") dropPiece();
    if (e.key === "ArrowUp") rotatePiece();
});

function rotatePiece() {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i])).reverse();
    const oldPiece = piece;
    piece = rotated;
    if (collision()) piece = oldPiece;
}

setInterval(() => {
    dropPiece();
    drawBoard();
}, 500);
