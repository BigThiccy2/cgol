// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const numCols = canvas.width / cellSize;
const numRows = canvas.height / cellSize;

let grid;
let animationFrameId;
let isRunning = false;

function initializeGrid() {
    grid = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => 0)
    );
    // You can add random initialization here or a specific pattern
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (grid[r][c] === 1) {
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }
}

function countLiveNeighbors(r, c) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skip the cell itself
            const neighborR = r + i;
            const neighborC = c + j;

            if (
                neighborR >= 0 && neighborR < numRows &&
                neighborC >= 0 && neighborC < numCols &&
                grid[neighborR][neighborC] === 1
            ) {
                count++;
            }
        }
    }
    return count;
}

function updateGrid() {
    const nextGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const liveNeighbors = countLiveNeighbors(r, c);
            if (grid[r][c] === 1) { // Live cell
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    nextGrid[r][c] = 0; // Dies
                }
            } else { // Dead cell
                if (liveNeighbors === 3) {
                    nextGrid[r][c] = 1; // Becomes alive
                }
            }
        }
    }
    grid = nextGrid;
}

function gameLoop() {
    if (isRunning) {
        updateGrid();
        drawGrid();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Event Listeners for buttons
document.getElementById('startButton').addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        gameLoop();
    }
});

document.getElementById('pauseButton').addEventListener('click', () => {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
});

document.getElementById('clearButton').addEventListener('click', () => {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    initializeGrid();
    drawGrid();
});

document.getElementById('randomButton').addEventListener('click', () => {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
    initializeGrid();
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            grid[r][c] = Math.random() > 0.7 ? 1 : 0; // Randomly set initial state
        }
    }
    drawGrid();
});

// Initial setup
initializeGrid();
drawGrid();