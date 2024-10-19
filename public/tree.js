class TreeNode {
    constructor(value, left = null, right = null, index = null) {
        this.value = value;
        this.left = left;
        this.right = right;
        this.nodeBase = null;
        this.index = index;
        this.level = null;
        this.parent = null;
        this.dest = null;
        this.srcLeft = null;
        this.srcRight = null;
    }
}
class Tree {
    constructor() {
        this.root = new TreeNode(0);
        createNewNode(0, 0, null, this.root, null);
    }

    async levelOrder() {
        let queue = [];
        queue.push(this.root);
        handleNodeSelect();
        this.root.nodeBase.classList.add("visited");
        while (queue.length != 0) {
            let node = queue.shift();
            if (node.left != null) {
                await delayIt();
                node.srcLeft.classList.add("visited");
                node.left.nodeBase.classList.add("visited");
                queue.push(node.left);
            }
            if (node.right != null) {
                await delayIt();
                node.srcRight.classList.add("visited");
                node.right.nodeBase.classList.add("visited");
                queue.push(node.right);
            }
            traverSalResultBox.innerHTML += node.value + "<br /> ";
        }
    }

    async preOrder(node, currPath) {
        if (node == null) return;
        await delayIt();
        traverSalResultBox.innerHTML += node.value + "<br /> ";
        node.nodeBase.classList.add("visited");
        currPath?.classList.add("visited");
        await this.preOrder(node.left, node.srcLeft);
        await this.preOrder(node.right, node.srcRight);
    }

    async postOrder(node, currPath) {
        if (node == null) return;
        currPath?.classList.add("visited");
        node.nodeBase.classList.add("explored");
        console.log("explored ", node.value)
        await delayIt();
        await this.postOrder(node.left, node.srcLeft);
        await this.postOrder(node.right, node.srcRight);
        traverSalResultBox.innerHTML += node.value + "<br /> ";
        node.nodeBase.classList.add("visited");
        await delayIt();

    }

    async inOrder(node, currPath) {
        if (node == null) return;
        await delayIt();
        node.nodeBase.classList.add("explored");
        currPath?.classList.add("visited");
        await this.inOrder(node.left, node.srcLeft);
        node.nodeBase.classList.add("visited");
        traverSalResultBox.innerHTML += node.value + "<br /> ";
        let time2 = performance.now();
        await this.inOrder(node.right, node.srcRight);
        if (performance.now() - time2 < 100) await delayIt();
    }
}

let nodes = [];
let position = [];
const deleteNodeBtn = document.getElementById("delete-node-btn");
const editNodeInput = document.getElementById("edit-node");
const changeValueBtn = document.getElementById("change-value-btn");
const levelOrderBtn = document.getElementById("levelOrderBtn");
const preOrderBtn = document.getElementById("preOrderBtn");
const postOrderBtn = document.getElementById("postOrderBtn");
const inOrderBtn = document.getElementById("inOrderBtn");
const traverSalResultBox = document.getElementById("traversal-result");
const clearTreeBtn = document.getElementById("clear-tree");
const demoTreeBtn = document.getElementById("demo-tree-btn");
inOrderBtn.onclick = () => {
    handleNodeSelect();
    traverSalResultBox.innerHTML = "";
    tree.inOrder(tree.root);
}
postOrderBtn.onclick = () => {
    handleNodeSelect();
    traverSalResultBox.innerHTML = "";
    tree.postOrder(tree.root);
}
levelOrderBtn.onclick = () => {
    handleNodeSelect();
    traverSalResultBox.innerHTML = "";
    tree.levelOrder();
}
preOrderBtn.onclick = () => {
    handleNodeSelect();
    traverSalResultBox.innerHTML = "";
    tree.preOrder(tree.root);
}
demoTreeBtn.onclick = () => {
    initialize(10);
}

let selectedNode = null;
let container = document.getElementById("tree");
let treeParent = document.getElementById("tree-parent");
let tree = null;
let treeData = {};
let dragData = {};

function initialize(size = null) {
    treeData = {
        x: window.innerWidth / 2,
        y: 200,
        scale: 1,
        nodeRadius: 30,
        currNodeValue: 1,
    }
    dragData = {
        isDown: false,
        startX: 0,
        startY: 0,
    }
    tree = new Tree();
    if (size != null) demoTree(tree.root, size);
    changeTreePosition();
}

function demoTree(parent, size) {
    if (size == 0 || parent == null) return;
    let leftSize = Math.ceil(size / 2);
    let rightSize = Math.floor(size / 2);
    if (parent.left == null && leftSize > 0) {
        createNewNode(parent.level + 1, treeData.currNodeValue, parent, new TreeNode(treeData.currNodeValue++), "left");
        leftSize--;
    }
    if (parent.right == null && rightSize > 0) {
        createNewNode(parent.level + 1, treeData.currNodeValue, parent, new TreeNode(treeData.currNodeValue++), "right");
        rightSize--;
    }

    demoTree(parent.left, leftSize);
    demoTree(parent.right, rightSize);
}

changeValueBtn.addEventListener("click", () => {
    if (selectedNode == null) {
        alert("Select any node first");
        return;
    }
    let value = editNodeInput.value;
    if (value === "") {
        alert("enter valid value");
        return;
    }
    selectedNode.value = value;
    selectedNode.nodeBase.children[1].innerHTML = value;
    handleNodeSelect();
    reStructure();
});
deleteNodeBtn.addEventListener("click", () => {
    deleteNode(selectedNode);
    handleNodeSelect();
    reStructure();
});



function createNewNode(level, currValue, parentNode, currNode, direction = null) {
    if (!nodes[level]) addLevel(level);
    let group = createGroup();
    currNode.nodeBase = group;
    currNode.level = level;
    treeParent.appendChild(group);
    currNode.index = parentNode == null ? 0 : parentNode.index * 2 + (direction === "left" ? 0 : 1);
    nodes[level][currNode.index] = currNode;
    if (direction === "left") parentNode.left = currNode;
    else if (direction === "right") parentNode.right = currNode;

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("node-path");
    if (parentNode != null) {
        currNode.parent = parentNode;
        currNode.dest = path;
        if (direction === "left") parentNode.srcLeft = path;
        else parentNode.srcRight = path;
    }
    treeParent.append(path);


    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", treeData.nodeRadius);
    group.appendChild(circle);


    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("fill", "black");
    text.setAttribute("stroke", "black");
    text.setAttribute("stroke-width", "1");
    text.setAttribute("font-size", "20px");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");

    text.innerHTML = currValue;
    group.appendChild(text);
    reStructure();
    console.log(currNode);
    return currNode;
}

function createGroup() {
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("node-base");
    group.addEventListener("mouseover", () => {
        group.style.cursor = "pointer";
    });
    group.addEventListener("click", () => {
        handleNodeSelect(group);
    });
    return group;
}

function handleNodeSelect(group = null) {
    if (!(group !== null && group.children[1].innerHTML === "+")) {
        let node = giveSelectedNode(group);
        if (node == null) return;
        let left = node.level === nodes.length - 1 ? null : nodes[node.level + 1][node.index * 2];
        let right = node.level === nodes.length - 1 ? null : nodes[node.level + 1][node.index * 2 + 1];


        if (left == null) {
            createPlus(node.level + 1, node, "left")
        }
        if (right == null) {
            createPlus(node.level + 1, node, "right")
        }
    } else if (group == null) {
        return;
    } else {
        let node = null;
        if (selectedNode.right != null && selectedNode.right.nodeBase === group) {
            node = selectedNode.right;
        } else {
            node = selectedNode.left;
        }
        if (node.value === '+') {
            console.log("+");
            node.value = treeData.currNodeValue
            node.nodeBase.children[1].innerHTML = treeData.currNodeValue++;
            treeParent.appendChild(node.dest);
            return;
        }
    }
}

function giveSelectedNode(group) {
    nodes.forEach(level => {
        level.forEach(node => {
            if (node != null) {
                node.nodeBase.classList.remove("selected");
            }
        })
    })
    removePlus();
    group?.classList.add("selected");
    let selectedGroup = document.querySelector(".node-base.selected");
    if (selectedGroup == null) {
        selectedNode = null;
        return;
    }
    let node = null;
    nodes.forEach(level => {
        level.forEach(n => {
            if (n != null && n.nodeBase === selectedGroup) node = n;
        })
    });
    selectedNode = node;
    editNodeInput.value = node.value;
    return node;
}

function createPlus(level, parent, direction) {
    let plusNode = createNewNode(level, "+", parent, new TreeNode("+"), direction);
    let plusNodePath = plusNode.dest;
    treeParent.removeChild(plusNodePath);
}

function removePlus() {
    nodes.forEach(level => {
        level.forEach(node => {
            if (node != null && node.value === "+") {
                deleteNode(node);
            }
        })
    })
}

function deleteNode(node) {
    if (node == null) return;
    deleteNode(node.left);
    deleteNode(node.right);
    if (node.parent != null) {
        if (node.parent.srcLeft === node.dest) {
            node.parent.srcLeft = null;
            node.parent.left = null;
        }
        else {
            node.parent.srcRight = null;
            node.parent.right = null;
        }
    }
    treeParent.removeChild(node.nodeBase);
    if (node.dest != null && treeParent.contains(node.dest))
        treeParent.removeChild(node.dest);
    nodes[node.level][node.index] = null;
    // if all the nodes in the level are deleted then delete the level
    deleteLevel(node.level);
}

function addLevel(level) {
    nodes[level] = [];
    position[level] = [];
    if (level === 0) {
        nodes[level].push(null);
        position[level].push({ x: 0, y: 0 });
    } else {
        for (let i = 0; i < Math.pow(2, level); i++) {
            nodes[level].push(null);
            position[level].push({ x: 0, y: 0 });
        }
    }
}

function deleteLevel(level) {
    let isEmpty = true;
    nodes[level].forEach(node => {
        if (node != null) {
            isEmpty = false;
            return;
        }
    });

    if (isEmpty) {
        nodes.pop();
        position.pop();
    }
    if (nodes.length === 0) {
        tree = new Tree();
        treeData.currNodeValue = 1;
    }
}

function reStructure() {
    let max = Math.pow(2, nodes.length - 1) - 1;
    let gaps = [0, 200, 200, 140, 100]
    let gap = gaps[nodes.length - 1];
    if (gap < 60 || gap == null) gap = 60;
    if (nodes.length > 5) {
        treeData.nodeRadius = 20;
        nodes.forEach(level => {
            level.forEach(node => {
                if (node != null) {
                    node.nodeBase.children[0].setAttribute("r", treeData.nodeRadius);
                }
            })
        });
    } else {
        treeData.nodeRadius = 30;
        nodes.forEach(level => {
            level.forEach(node => {
                if (node != null) {
                    node.nodeBase.children[0].setAttribute("r", treeData.nodeRadius);
                }
            })
        });
    }
    for (let i = position.length - 1; i >= 0; i--) {
        for (let j = 0; j < position[i].length; j++) {
            if (i === position.length - 1) {
                position[i][j].x = -(max / 2 - j) * gap;
                position[i][j].y = 100 * i;
            } else {
                let left = position[i + 1][j * 2];
                let right = position[i + 1][j * 2 + 1];
                position[i][j].x = (left.x + right.x) / 2;
                position[i][j].y = 100 * i;
            }
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].length; j++) {
            if (nodes[i][j] == null) continue;
            nodes[i][j].nodeBase.style.transform = `translate(${position[i][j].x}px, ${position[i][j].y}px)`;
            if (nodes[i][j].srcLeft != null) {
                let xLeft = position[i][j].x - position[i + 1][j * 2].x;
                let yLeft = position[i][j].y - position[i + 1][j * 2].y;
                let angleLeft = Math.atan2(yLeft, xLeft);
                let xLeftEdge = position[i][j].x - treeData.nodeRadius * Math.cos(angleLeft);
                let yLeftEdge = position[i][j].y - treeData.nodeRadius * Math.sin(angleLeft);
                let destX = position[i + 1][j * 2].x + treeData.nodeRadius * Math.cos(angleLeft);
                let destY = position[i + 1][j * 2 + 1].y + treeData.nodeRadius * Math.sin(angleLeft);
                nodes[i][j].srcLeft?.setAttribute("d", `M ${xLeftEdge} ${yLeftEdge} L ${destX} ${destY}`);

            }

            if (nodes[i][j].srcRight != null) {
                let xRight = position[i][j].x - position[i + 1][j * 2 + 1].x;
                let yRight = position[i][j].y - position[i + 1][j * 2 + 1].y;
                let angleRight = Math.atan2(yRight, xRight);

                let xRightEdge = position[i][j].x - treeData.nodeRadius * Math.cos(angleRight);
                let yRightEdge = position[i][j].y - treeData.nodeRadius * Math.sin(angleRight);
                let destX = position[i + 1][j * 2 + 1].x + treeData.nodeRadius * Math.cos(angleRight);
                let destY = position[i + 1][j * 2 + 1].y + treeData.nodeRadius * Math.sin(angleRight);
                nodes[i][j].srcRight?.setAttribute("d", `M ${xRightEdge} ${yRightEdge} L ${destX} ${destY}`);
            }
        }
    }
}

function clearTree() {
    traverSalResultBox.innerHTML = "";
    nodes = [];
    position = [];
    treeParent.innerHTML = "";
    initialize();
}

clearTreeBtn.addEventListener("click", clearTree);

function changeTreePosition() {
    treeParent.style.transform = `scale(${treeData.scale}) translate(${treeData.x / treeData.scale}px, ${treeData.y / treeData.scale}px)`;
}

initialize();
function delayIt() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}



container.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        if (treeData.scale >= 1) return;
        treeData.scale += 0.05;
    }
    else {
        if (treeData.scale <= 0.25) return;
        treeData.scale -= 0.05;
    }


    changeTreePosition();
})
container.addEventListener('mousedown', (e) => {
    if (dragData.isDown) return;
    dragData.isDown = true;
    dragData.startX = e.clientX;
    dragData.startY = e.clientY;
    container.style.cursor = 'grabbing';
});

container.addEventListener('mouseleave', () => {
    dragData.isDown = false;
    container.style.cursor = 'grab';
}
);

container.addEventListener('mouseup', () => {
    dragData.isDown = false;
    container.style.cursor = 'grab';
}
);

container.addEventListener('mousemove', (e) => {
    if (!dragData.isDown) return;
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    const walkX = (x - dragData.startX);
    const walkY = (y - dragData.startY);
    treeData.x += walkX;
    treeData.y += walkY;
    dragData.startX = x;
    dragData.startY = y;
    changeTreePosition();
}
);






