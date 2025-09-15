const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const numCols = canvas.width / cellSize;
const numRows = canvas.height / cellSize;

let grid;
let animationFrameId;
let isRunning = false;
let speed = 200; // Delay in ms between frames (increase for slower speed)
let previewCell = null;
let isMouseDown = false;

function initializeGrid() {
    grid = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => 0)
    );
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (grid[r][c] === 1) {
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }
    // Draw preview cell if mouse is over canvas
    if (previewCell) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "blue";
        ctx.fillRect(previewCell.col * cellSize, previewCell.row * cellSize, cellSize, cellSize);
        ctx.restore();
    }
}

function countLiveNeighbors(r, c) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
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
    const nextGrid = JSON.parse(JSON.stringify(grid));
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const liveNeighbors = countLiveNeighbors(r, c);
            if (grid[r][c] === 1) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    nextGrid[r][c] = 0;
                }
            } else {
                if (liveNeighbors === 3) {
                    nextGrid[r][c] = 1;
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
        animationFrameId = setTimeout(gameLoop, speed);
    }
}

// Button event listeners
document.getElementById('startButton').addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        gameLoop();
    }
});

document.getElementById('pauseButton').addEventListener('click', () => {
    isRunning = false;
    clearTimeout(animationFrameId);
});

document.getElementById('clearButton').addEventListener('click', () => {
    isRunning = false;
    clearTimeout(animationFrameId);
    initializeGrid();
    drawGrid();
});

document.getElementById('randomButton').addEventListener('click', () => {
    isRunning = false;
    clearTimeout(animationFrameId);
    initializeGrid();
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            grid[r][c] = Math.random() > 0.7 ? 1 : 0;
        }
    }
    drawGrid();
});

// Mouse events for preview and drag-to-draw
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
        previewCell = { row, col };
        if (isMouseDown) {
            grid[row][col] = 1;
        }
    } else {
        previewCell = null;
    }
    drawGrid();
});

canvas.addEventListener('mousedown', function(event) {
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
        grid[row][col] = 1;
        previewCell = { row, col };
        drawGrid();
    }
});

canvas.addEventListener('mouseup', function() {
    isMouseDown = false;
});

canvas.addEventListener('mouseleave', function() {
    previewCell = null;
    isMouseDown = false;
    drawGrid();
});

// Initial setup
initializeGrid();
drawGrid();

function updateGrid() {
    const nextGrid = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => 0)
    );
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const liveNeighbors = countLiveNeighbors(r, c);
            if (grid[r][c] === 1) {
                if (liveNeighbors === 2 || liveNeighbors === 3) {
                    nextGrid[r][c] = 1;
                }
            } else {
                if (liveNeighbors === 3) {
                    nextGrid[r][c] = 1;
                }
            }
        }
    }
    grid = nextGrid;
}



canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
        previewCell = { row, col };
        if (isMouseDown) {
            // Toggle cell state while dragging
            if (eraseMode) {
                grid[row][col] = 0;
            } else {
                grid[row][col] = 1;
            }
        }
    } else {
        previewCell = null;
    }
    drawGrid();
});

let eraseMode = false;

canvas.addEventListener('mousedown', function(event) {
    isMouseDown = true;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
        eraseMode = grid[row][col] === 1; // If cell is alive, erase; else, draw
        grid[row][col] = eraseMode ? 0 : 1;
        previewCell = { row, col };
        drawGrid();
    }
});

canvas.addEventListener('mouseup', function() {
    isMouseDown = false;
});

canvas.addEventListener('mouseleave', function() {
    previewCell = null;
    isMouseDown = false;
    drawGrid();
});

