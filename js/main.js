const board = document.getElementById("board");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");
const gridToggleInput = document.getElementById("gridToggle");
const genDurInput = document.getElementById("genDur");

let gridSize = 30; // gridSize x gridSize
let grid = [];
let running = false;
let genDur = 50;


// Start
resetGrid();
document.documentElement.style.setProperty('--grid-dimentions', gridSize);
genDurInput.value = genDur;



onkeydown = (e) => {
    if (e.key == ' ')
        togglePlayStop();
}

stepBtn.onclick = () => {
    if (!running)
        step();
};

resetBtn.onclick = () => {
    if (running)
        togglePlayStop();
    resetGrid();
}



gridToggleInput.onchange = () => {
    document.documentElement.style.setProperty('--cell-border', `${gridToggleInput.checked? 1: 0}px`);
}

genDurInput.onchange = () => {
    genDur = genDurInput.value;
}







function run() {
    if (!running)
        return;

    step();

    setTimeout(run, genDur);
}

function togglePlayStop() {
    running = !running;
    board.className = running? '': 'editable';
    playBtn.hidden = running;
    stopBtn.hidden = !running;
    if (running)
        run();
}

function step() {
    let newGrid = grid;
    resetGrid();

    for(let y = 0; y < gridSize; y++) {
        for(let x = 0; x < gridSize; x++) {
            let aliveNeighbors = 0;

            // Count alive neighbors
            for(let dy = -1; dy <= 1; dy++)
                for(let dx = -1; dx <= 1; dx++)
                    if (newGrid[cycleRange(y + dy, 0, gridSize - 1)][cycleRange(x + dx, 0, gridSize - 1)] === 1)
                        aliveNeighbors += (dx == 0 && dy == 0? 0 : 1);

            // Apply rules of life
            if (newGrid[y][x] === 1) {
                    grid[y][x] = aliveNeighbors > 3 || aliveNeighbors < 2? 0: 1;
            }
            else if (aliveNeighbors === 3)
                grid[y][x] = 1;
        }
    }
    
    gird = newGrid;

    updateGrid();
}

function updateGrid() {
    board.innerHTML = ""; // Clear the board

    for(let i = 0; i < gridSize*gridSize; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        if (grid[Math.floor(i / gridSize)][i % gridSize] === 1) 
            cell.classList.add("alive");
        
        if (!running)
            cell.onclick = () => getCell(i);
        board.appendChild(cell);
    }
}

function resetGrid() {
    // console.log('resetBtn');
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    updateGrid();
}

function cycleRange(n, min, max) {
    return n < min? max: n > max? min: n;
}

function getCell(index) {
    let x = index % gridSize;
    let y = Math.floor(index / gridSize);
    console.log(`Cell clicked: ${x}, ${y}`);

    grid[y][x] = grid[y][x] === 1 ? 0 : 1; // Toggle cell state
    
    updateGrid();
}