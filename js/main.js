const board = document.getElementById("board");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const stepBtn = document.getElementById("stepBtn");

let gridSize = 30; // gridSize x gridSize
let grid = [];
let running = false;


// Start
resetGrid();
document.documentElement.style.setProperty('--grid-dimentions', gridSize);







onkeydown = () => step();

playBtn.onclick = () => {
    running = true;
    board.className = '';
    playBtn.hidden = true;
    stopBtn.hidden = false;
    run();
}

stopBtn.onclick = () => {
    running = false;
    board.className = 'editable';
    stopBtn.hidden = true;
    playBtn.hidden = false;
}

stepBtn.onclick = step;

function run() {
    if (!running)
        return;


    step();

    setTimeout(run, 50);
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
    
    console.log(grid);
    gird = newGrid;
    console.log(grid);


    updateGrid();
}

function updateGrid() {
    board.innerHTML = ""; // Clear the board

    for(let i = 0; i < gridSize*gridSize; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        if (grid[Math.floor(i / gridSize)][i % gridSize] === 1) 
            cell.classList.add("alive");
        

        cell.onclick = () => getCell(i);
        board.appendChild(cell);
    }
}

function resetGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    updateGrid();
}

function cycleRange(n, min, max) {
    return n < min? max: n > max? min: n;
}

function getCell(index) {
    let x = index % gridSize;
    let y = Math.floor(index / gridSize);
    // console.log(`Cell clicked: ${x}, ${y}`);

    grid[y][x] = grid[y][x] === 1 ? 0 : 1; // Toggle cell state
    
    updateGrid();
}