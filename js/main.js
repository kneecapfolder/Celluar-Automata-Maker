let board = document.getElementById("board");
let gridSize = 10; // 10x10 grid
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

console.log(grid);


createGrid();















function createGrid() {
    board.innerHTML = ""; // Clear the board

    for(let i = 0; i < 100; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        if (grid[Math.floor(i / 10)][i % 10] === 1) {
            cell.classList.add("alive");
        }

        cell.onclick = () => getCell(i);
        board.appendChild(cell);
    }
}

function getCell(index) {
    let x = index % 10;
    let y = Math.floor(index / 10);
    console.log(`Cell clicked: ${x}, ${y}`);
    createGrid();
}