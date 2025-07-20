const board = document.getElementById("board");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");
const gridToggleInput = document.getElementById("gridToggle");
const hoverToggleInput = document.getElementById("hoverToggle");
const genDurInput = document.getElementById("genDur");
const gridSizeInput = document.getElementById("gridSize");
const blocksList = document.getElementById("cells");

let gridSize = 30; // gridSize x gridSize
let grid = [];
let running = false;
let genDur = 50;
let selectedIndex = 0;
let brush = 0;
let templates = [];
let colors = [ 'black', 'white', 'red', 'blue', 'yellow', 'lime', 'magenta' ];


// Start
clearGrid();
document.documentElement.style.setProperty('--grid-dimentions', gridSize);
gridSizeInput.value = gridSize;
genDurInput.value = genDur;
addNewTemplate();

function updateStateBlocks() {
    blocksList.innerHTML = '';
    for(let i = 0; i < templates.length; i++)
        blocksList.innerHTML += `
            <div onclick="selectedIndex = ${i}; updateStateBlocks()" ${selectedIndex == i? 'style="border: 1px solid white;"': ""} class="state-template">
                <div>
                    <h3>neighbours:</h3>
                    <button onclick="cycleNeighbourIndex(${i}, -1)"><i class="fa-solid fa-caret-left"></i></button>
                    <h2>${templates[i].currIndex}</h2>
                    <button onclick="cycleNeighbourIndex(${i}, 1)"><i class="fa-solid fa-caret-right"></i></button>
                </div>
                <i class="fa-solid fa-arrow-right"></i>
                <div>
                    <h3>state:</h3>
                    <button onclick="cycleStates(${i}, -1)"><i class="fa-solid fa-caret-left"></i></button>
                    <h2>${templates[i].arr[templates[i].currIndex]}</h2>
                    <button onclick="cycleStates(${i}, 1)"><i class="fa-solid fa-caret-right"></i></button>
                </div>
            </div>`;
}

function cycleNeighbourIndex(i, change) {
    templates[i].currIndex += change;
    templates[i].currIndex = templates[i].currIndex > 8? 0: templates[i].currIndex < 0? 8: templates[i].currIndex;
    updateStateBlocks();
}

function cycleStates(i, change) {
    templates[i].arr[templates[i].currIndex] += change;
    templates[i].arr[templates[i].currIndex] = templates[i].arr[templates[i].currIndex] >= templates.length? 0: templates[i].arr[templates[i].currIndex] < 0? templates.length - 1: templates[i].arr[templates[i].currIndex];
    updateStateBlocks();
}

function addNewTemplate() {
    if (templates.length >= 7)
        return;

    selectedIndex = templates.length;

    templates.push({
        currIndex: 0,
        arr: Array(9).fill(0)
    });
    updateStateBlocks();
}

function clearBlocks() {
    reset();
    selectedIndex = 0;
    templates = [];
    addNewTemplate();
    updateStateBlocks();
}



onkeydown = (e) => {
    switch(e.key) {
        case ' ':
            togglePlayStop();
            break;

        case 'r':
            reset();
            break;

        case 'g':
            gridToggleInput.checked = !gridToggleInput.checked;
            document.documentElement.style.setProperty('--cell-border', `${gridToggleInput.checked? 1: 0}px`);
            updateGrid();
            break;
    }
}

document.addEventListener('contextmenu', event => event.preventDefault());

stepBtn.onclick = () => {
    if (!running)
        step();
};

resetBtn.onclick = reset;
onmouseup = () => brush = -1;

function reset() {
    if (running)
        togglePlayStop();
    clearGrid();
}



gridToggleInput.onchange = () => {
    document.documentElement.style.setProperty('--cell-border', `${gridToggleInput.checked? 1: 0}px`);
    updateGrid();
}

hoverToggleInput.onchange = () => {
    if (hoverToggleInput.checked)
        board.classList.add('hover');
    else board.classList.remove('hover');
}

genDurInput.onchange = () => {
    genDur = genDurInput.value;
}

gridSizeInput.onchange = () => {
    gridSize = gridSizeInput.value;
    console.log(gridSizeInput.value);
    document.documentElement.style.setProperty('--grid-dimentions', gridSize);
    updateGrid();
    setTimeout(() => {
        updateGrid();
    }, 100);
}


function togglePlayStop() {
    running = !running;
    if (running)
        board.classList.remove('editable');
    else board.classList.add('editable');

    playBtn.hidden = running;
    stopBtn.hidden = !running;
    if (running)
        run();
    else updateGrid();
}



// Simulation Logic
function run() {
    if (!running)
        return;

    step();

    setTimeout(run, genDur);
}

function step() {
    let newGrid = grid;
    clearGrid();

    for(let y = 0; y < gridSize; y++) {
        for(let x = 0; x < gridSize; x++) {
            let aliveNeighbors = 0;

            // Count alive neighbors
            for(let dy = -1; dy <= 1; dy++)
                for(let dx = -1; dx <= 1; dx++)
                    if (newGrid[cycleRange(y + dy, 0, gridSize - 1)][cycleRange(x + dx, 0, gridSize - 1)] === 1)
                        aliveNeighbors += (dx == 0 && dy == 0? 0 : 1);

            // Apply rules of life
            /* if (newGrid[y][x] === 1) {
                    grid[y][x] = aliveNeighbors > 3 || aliveNeighbors < 2? 0: 1;
            }
            else if (aliveNeighbors === 3)
                grid[y][x] = 1; */
            grid[y][x] = templates[newGrid[y][x]].arr[aliveNeighbors];
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

        cell.draggable = false;
        cell.ondragstart = () => { return false };
        
        cell.style.backgroundColor = colors[grid[Math.floor(i / gridSize)][i % gridSize]];
        
        if (!running)
            cell.onmousedown = (e) => {
                switch(e.buttons) {
                    case 1:
                        brush = selectedIndex;
                        break;
                        
                    case 2:
                        brush = 0;
                        break;
                }
                getCell(i, brush);
            }

            cell.onmouseover = (e) => {
                if (brush != -1)
                    getCell(i, brush);
            }
        board.appendChild(cell);
    }
}

function clearGrid() {
    // console.log('resetBtn');
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    updateGrid();
}

function getCell(index, num) {
    let x = index % gridSize;
    let y = Math.floor(index / gridSize);
    // console.log(`Cell clicked: ${x}, ${y}`);

    if (grid[y][x] === num)
        return;

    grid[y][x] = num; // Toggle cell state
    
    updateGrid();
}

// Helper funtions
function cycleRange(n, min, max) {
    return n < min? max: n > max? min: n;
}