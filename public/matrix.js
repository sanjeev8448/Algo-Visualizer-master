const matrixContainer = document.querySelector('#matrix-parent');
const width = matrixContainer.clientWidth;
const height = matrixContainer.clientHeight;
const rows = Math.floor(height / 50);
const columns = Math.floor(width / 50);
const matrixNode = [];
let target = null;
let source = null;
let parent = [];
let pathLength = 1;
for (let i = 0; i < rows * columns; i++) {
    parent.push(-1);
}
// pick audio file from local
let startBfsBtn = document.querySelector('#bfs-start');
let pathLengthNode = document.querySelector('#path-length');
startBfsBtn.addEventListener('click', startBfs);
for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.classList.add('matrix-row');
    matrixContainer.appendChild(row);
    matrixNode.push([]);
    for (let j = 0; j < columns; j++) {
        const box = document.createElement('div');
        box.classList.add('matrix-box');
        row.appendChild(box);
        matrixNode[i].push(box);
        box.setAttribute('row', i);
        box.setAttribute('col', j);
    }
}

function toggleObstacle(e) {
    const node = e.target;
    if (node.classList.contains('source') || node.classList.contains('target')) return;
    node.classList.toggle('obstacle');
}
let sounds = [];
let currSound = 0;
for (let i = 0; i < 10; i++) {
    sounds.push(new Audio(`./bubble pop 2.mp3`));
}
async function bfs(startRow, startCol) {
    const queue = [{ row: startRow, col: startCol }];
    const visited = new Set();
    visited.add(startRow + ',' + startCol);
    while (queue.length > 0) {
        let length = queue.length;
        for (let i = 0; i < length; i++) {
            const row = queue[0].row;
            const col = queue[0].col;
            queue.shift();
            let dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]];
            let currIdx = (row * columns) + col;
            for (let dir of dirs) {
                const newRow = row + dir[0];
                const newCol = col + dir[1];
                if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns || matrixNode[newRow][newCol].classList.contains("obstacle")) continue;
                if (visited.has(newRow + ',' + newCol)) continue;
                let newIdx = (newRow * columns) + newCol;
                parent[newIdx] = currIdx;

                visited.add(newRow + ',' + newCol);
                queue.push({ row: newRow, col: newCol });
                if (!(newRow === target.row && newCol === target.col)) {
                    matrixNode[newRow][newCol].classList.add('visited');
                    sounds[currSound].currentTime = 0;
                    sounds[currSound].play();
                    sounds[currSound].volume = 0.1;
                    currSound = (currSound + 1) % 6;
                }
            }
        }
        await delayIt(100);
    }
    findParent();
}

function delayIt(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startBfs(e) {
    bfs(source.row, source.col);
}

function setTarget() {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * columns);
    let node = matrixNode[row][col];
    target = { row, col };
    node.classList.add('target');
}

function setSource() {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * columns);
    let node = matrixNode[row][col];
    while (node.classList.contains('target')) {
        row = Math.floor(Math.random() * rows);
        col = Math.floor(Math.random() * columns);
        node = matrixNode[row][col];
    }
    source = { row, col };
    node.classList.add('source');
}

async function findParent(row = target.row, col = target.col) {
    while (true) {
        let idx = row * columns + col;
        let parentNode = parent[idx];
        row = Math.floor(parentNode / columns);
        col = parentNode % columns;
        if (row === source.row && col === source.col || (row == -1 || col == -1)) break;
        console.log(row, col);
        matrixNode[row][col].classList.add("path");
        pathLength++;
        pathLengthNode.innerHTML = `Shortest Path : ${pathLength}`;
        await delayIt(100);
        let audio = new Audio("./bubble pop 2.mp3");
        audio.play();
    }
    pathLengthNode.innerHTML = `Shortest Path : ${pathLength}`;
}

setTarget();
setSource();


for (let i in matrixNode) {
    for (let j in matrixNode[i]) {
        matrixNode[i][j].addEventListener('click', toggleObstacle);
    }
}


matrixContainer.addEventListener('mousedown', (e) => {
    startSelecting(e);
    matrixContainer.addEventListener("mouseover", startSelecting);
    matrixContainer.addEventListener("mouseup", () => {
        matrixContainer.removeEventListener("mouseover", startSelecting);
    });
})

function startSelecting(e) {
    console.log(e.target);
    if (e.target.classList.contains('matrix-box')) {
        if (e.target.classList.contains('source') || e.target.classList.contains('target')) return;
        e.target.classList.toggle('obstacle');
    }
}
