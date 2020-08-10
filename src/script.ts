const canvas = document.querySelector<HTMLCanvasElement>("#game");
const width = canvas.width;
const height = canvas.height;
const context = canvas.getContext("2d");

const TILE_SIZE = 20;
const TILES_X = width / TILE_SIZE;
const TILES_Y = height / TILE_SIZE;

let isGamePause = false;

context.fillStyle = "rgb(100, 240, 150)";
context.strokeStyle = "rgb(90, 90, 90)";
context.lineWidth = 0.5;

function drawBorders() {
    for (let i = 0; i < TILES_X; i++) {
        context.beginPath();
        context.moveTo(i * TILE_SIZE - 0.5, 0);
        context.lineTo(i * TILE_SIZE - 0.5, height);
        context.stroke();
    }
    for (let i = 0; i < TILES_Y; i++) {
        context.beginPath();
        context.moveTo(0, i * TILE_SIZE - 0.5);
        context.lineTo(width, i * TILE_SIZE - 0.5);
        context.stroke();
    }
}

function prepareBoard(): boolean[][] {
    const board = [];
    for (let i = 0; i < TILES_X; i++) {
        const row = [];
        for (let j = 0; j < TILES_Y; j++) {
            row.push(false);
        }
        board.push(row);
    }
    return board;
}

function isCellAlive(x: number, y: number): number {
    if (x < 0 || x >= TILES_X || y < 0 || y >= TILES_Y) {
        return 0;
    }
    return BOARD[x][y] ? 1 : 0;
}

function neighboursCount(x: number, y: number): number {
    let count = 0;
    for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
            count += isCellAlive(x + i, y + j);
        }
    }
    return count;
}

function drawBoard() {
    for (let i = 0; i < TILES_X; i++) {
        for (let j = 0; j < TILES_Y; j++) {
            if (!isCellAlive(i, j)) {
                continue;
            }
            context.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function computeNextGeneration(): boolean[][] {
    const board = prepareBoard();
    for (let x = 0; x < TILES_X; x++) {
        for (let y = 0; y < TILES_Y; y++) {
            if (isCellAlive(x, y)) {
                const count = neighboursCount(x, y);
                if (count === 2 || count === 3) {
                    board[x][y] = true;
                }
            } else if (neighboursCount(x, y) === 3) {
                board[x][y] = true;
            }
        }
    }
    return board;
}

function clear() {
    context.clearRect(0, 0, width, height);
}

function drawAll() {
    clear();
    drawBoard();
    drawBorders();
}

function nextGen() {
    if (!isGamePause) {
        BOARD = computeNextGeneration();
        drawAll();
    }

}

function nextGenLoop() {
    nextGen();
    setTimeout(nextGenLoop, 100);
}

let BOARD = prepareBoard();

BOARD[1][0] = true;
BOARD[2][1] = true;
BOARD[0][2] = true;
BOARD[1][2] = true;
BOARD[2][2] = true;
BOARD[3][2] = true;
BOARD[3][4] = true;
BOARD[6][4] = true;
BOARD[6][3] = true;

BOARD == computeNextGeneration();

canvas.addEventListener("click", event => {
    const x = Math.floor((event.clientX - canvas.offsetLeft) / TILE_SIZE);
    const y = Math.floor((event.clientY - canvas.offsetTop) / TILE_SIZE);
    BOARD[x][y] = !BOARD[x][y];
    drawAll();
});

document.addEventListener("keydown", event => {
    if (event.key == "p") {
        isGamePause = !isGamePause;
    }
})

nextGenLoop();

