const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const playerSelect = document.getElementById('player');

let grid = [];
let player;
let computer;
let currentPlayer;
let gameStarted = false;
let gameOver = false;
let canvasSize = 400;
let cellSize;

const drawGrid = () => {
ctx.clearRect(0, 0, canvasSize, canvasSize);
ctx.beginPath();
for (let i = 1; i < grid.length; i++) {
// Draw horizontal lines
ctx.moveTo(0, i * cellSize);
ctx.lineTo(canvasSize, i * cellSize);
// Draw vertical lines
ctx.moveTo(i * cellSize, 0);
ctx.lineTo(i * cellSize, canvasSize);
}
ctx.stroke();
};

const initGame = () => {

grid = new Array(parseInt(rowsInput.value)).fill(null).map(() => new Array(parseInt(colsInput.value)).fill(null));

player = playerSelect.value;
computer = player === 'X' ? 'O' : 'X';

currentPlayer = player;

gameStarted = true;
gameOver = false;

restartBtn.disabled = false;
resetBtn.disabled = false;
};

const handleClick = (event) => {
if (!gameStarted || gameOver) return;

const rect = canvas.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;

const row = Math.floor(y / cellSize);
const col = Math.floor(x / cellSize);

if (grid[row][col] !== null) return;

grid[row][col] = currentPlayer;
drawSymbol(currentPlayer, row, col);

if (checkWin()) {
gameOver = true;
Swal.fire({
title: 'Congratulations!',
text: `You have won the game!`,
icon: 'success',
confirmButtonText: 'Play Again'
}).then(() => {
restartGame();
});
} else if (checkDraw()) {
gameOver = true;
Swal.fire({
title: 'It\'s a Draw!',
icon: 'info',
confirmButtonText: 'Play Again'
}).then(() => {
restartGame();
});
} else {
currentPlayer = currentPlayer === player ? computer : player;
if (currentPlayer === computer) {
setTimeout(computerMove, 500);
}
}
};

const drawSymbol = (symbol, row, col) => {
const x = col * cellSize + cellSize / 2;
const y = row * cellSize + cellSize / 2;

ctx.font = `${cellSize / 2}px Arial`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(symbol, x, y);
};

const checkWin = () => {
// Check rows
for (let i = 0; i < grid.length; i++) {
if (grid[i][0] === null) continue;
let j = 1;
while (j < grid[i].length && grid[i][j] === grid[i][0]) {
j++;
}
if (j === grid[i].length) return true;
}

// Check columns
for (let j = 0; j < grid[0].length; j++) {
if (grid[0][j] === null) continue;
let i = 1;
while (i < grid.length && grid[i][j] === grid[0][j]) {
i++;
}
if (i === grid.length) return true;
}

// Check diagonals
if (grid[0][0] !== null) {
let i = 1;
while (i < grid.length && grid[i][i] === grid[0][0]) {
i++;
}
if (i === grid.length) return true;
}
if (grid[0][grid[0].length - 1] !== null) {
let i = 1;
while (i < grid.length && grid[i][grid[0].length - 1 - i] === grid[0][grid[0].length - 1]) {
i++;
}
if (i === grid.length) return true;
}

return false;
};

const checkDraw = () => {
for (let row of grid) {
for (let cell of row) {
if (cell === null) return false;
}
}
return true;
};

const computerMove = () => {
const emptyCells = [];
for (let i = 0; i < grid.length; i++) {
for (let j = 0; j < grid[i].length; j++) {
if (grid[i][j] === null) {
emptyCells.push([i, j]);
}
}
}

const randomIndex = Math.floor(Math.random() * emptyCells.length);
const [row, col] = emptyCells[randomIndex];

grid[row][col] = currentPlayer;

drawSymbol(currentPlayer, row, col);

if (checkWin()) {
gameOver = true;
Swal.fire({
title: 'Oops!',
text: `${currentPlayer} has won the game!`,
icon: 'error',
confirmButtonText: 'Play Again'
}).then(() => {
restartGame();
});
} else if (checkDraw()) {
gameOver = true;
Swal.fire({
title: 'It\'s a Draw!',
icon: 'info',
confirmButtonText: 'Play Again'
}).then(() => {
restartGame();
});
} else {
currentPlayer = currentPlayer === player ? computer : player;
}
};

const restartGame = () => {
grid = [];
gameStarted = false;
gameOver = false;
restartBtn.disabled = true;
resetBtn.disabled = true;
ctx.clearRect(0, 0, canvasSize, canvasSize);
};

const resetGame = () => {
rowsInput.value = 3;
colsInput.value = 3;
playerSelect.value = 'X';
};

startBtn.addEventListener('click', () => {
cellSize = canvasSize / Math.max(parseInt(rowsInput.value), parseInt(colsInput.value));
canvas.width = cellSize * parseInt(colsInput.value);
canvas.height = cellSize * parseInt(rowsInput.value);
initGame();
drawGrid();
});

restartBtn.addEventListener('click', () => {
restartGame();
initGame();
drawGrid();
});

resetBtn.addEventListener('click', () => {
resetGame();
});

canvas.addEventListener('click', handleClick);










