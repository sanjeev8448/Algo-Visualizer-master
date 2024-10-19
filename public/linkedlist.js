class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
        this.nodeBase = null;
        this.nextPath = null;
        this.prevPath = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    async insertAtEnd() {
        let value = linkedListData.currNodeValue++;
        const node = new ListNode(value);
        node.nodeBase = await createNodeBase(value);
        node.nodeBase.addEventListener("click", () => {
            selectNode(node);
        })
        let currAddress = selectAddress();
        node.nodeBase.children[5].textContent = "#" + currAddress;
        if (this.tail == null) {
            this.head = node;
            this.tail = node;
        } else {
            let path = await createPath(this.tail, node);
            this.tail.nodeBase.children[4].textContent = "#" + currAddress;
            node.prev = this.tail;
            node.prevPath = path;
            this.tail.next = node;
            this.tail.nextPath = path;
            this.tail = node;
        }
        nodes.push(node);
        this.length++;
    }

    async insertAtStart() {
        reStructure(this.head, "+");
        await delayIt(400);
        let value = linkedListData.currNodeValue++;
        const node = new ListNode(value);
        node.nodeBase = await createNodeBase(value, "start");
        node.nodeBase.addEventListener("click", () => {
            selectNode(node);
        })
        let currAddress = selectAddress();
        node.nodeBase.children[5].textContent = "#" + currAddress;
        if (this.tail == null) {
            this.head = node;
            this.tail = node;
        } else {
            let path = await createPath(node, this.head);
            node.nodeBase.children[4].textContent = "#" + currAddress;
            node.prev = null;
            node.next = this.head;
            node.prevPath = null;
            this.head = node;

            if (path == null) return;
            node.nodeBase.children[4].textContent = this.head.nodeBase.children[5].textContent;
            node.nextPath = path;
            this.head.prev = node;
            this.head.prevPath = path;
        }
        nodes.unshift(node);
        this.length++;
    }

    async deleteAtEnd() {
        if (this.tail == null) return;
        nodes.splice(nodes.indexOf(this.tail), 1);

        this.tail.nodeBase.classList.add("delete");
        this.tail.prevPath?.classList.add("hide");
        await delayIt(400);
        if (this.tail.prev == null) {
            linkedListParent.removeChild(this.tail.nodeBase);
            this.head = null;
            this.tail = null;
        } else {
            linkedListParent.removeChild(this.tail.nodeBase);
            linkedListParent.removeChild(this.tail.prevPath);
            this.tail = this.tail.prev;
            this.tail.next = null;
        }
        NodeDimensions.x -= NodeDimensions.diffX;
        NodeDimensions.y -= NodeDimensions.diffY;
        selectedNode = null;
    }

    async deleteSpecific(node) {
        if (node == null) return;

        nodes.splice(nodes.indexOf(node), 1);
        node.nodeBase.classList.add("delete");
        node.nextPath?.classList.add("hide");
        if (node.next != null) node.next.prevPath?.classList.add("hide");
        await delayIt(400);
        if (node.prev != null) {
            node.prev.next = node.next;
        }
        if (node.next != null) {
            node.next.prev = node.prev;
        }
        if (node.next != null) {
            linkedListParent.removeChild(node.nextPath);
            node.next.prevPath = node.prevPath;
        } else if (node.prev != null) {
            linkedListParent.removeChild(node.prevPath);
        }
        linkedListParent.removeChild(node.nodeBase);
        reStructure(node.next, "-");
        NodeDimensions.x -= NodeDimensions.diffX;
        NodeDimensions.y -= NodeDimensions.diffY;

        selectedNode = null;
    }

    async deleteAtStart() {
        if (this.head == null) return;
        nodes.splice(nodes.indexOf(this.head), 1);
        this.head.nodeBase.classList.add("delete");
        this.head.nextPath?.classList.add("hide");
        await delayIt(400);
        linkedListParent.removeChild(this.head.nodeBase);
        if (this.head.next == null) {
            this.head = null;
            this.tail = null;
        } else {
            linkedListParent.removeChild(this.head.nextPath);
            this.head = this.head.next;
            this.head.prev = null;
        }
        reStructure(this.head, "-");
        NodeDimensions.x -= NodeDimensions.diffX;
        NodeDimensions.y -= NodeDimensions.diffY;
        selectedNode = null;
    }
}


const NodeDimensions = {
    width: 100,
    height: 70,
    initialX: 20,
    initialY: 100,
    x: 20,
    y: 100,
    gap: 120,
    diffX: 0, diffY: 0,
}

const linkedListParent = document.getElementById('linked-list-container');
const linkedListContainer = document.getElementById('linked-list-svg');
let linkedList = null;
let linkedListData = {}
let dragData = {};
let nodes = [];
let insertAtStartButton = document.getElementById('linked-list-insert-start');
let insertAtEndButton = document.getElementById('linked-list-insert-end');
let deleteAtEndButton = document.getElementById('linked-list-delete-end');
let deleteSpecificButton = document.getElementById('linked-list-delete-specific');
let deleteAtStartButton = document.getElementById('linked-list-delete-start');
let selectedNode = null;
let clearButton = document.getElementById('linked-list-clear');
const addresses = {};


function initialize() {
    linkedList = new LinkedList();
    linkedListData = {
        x: 0,
        y: 0,
        scale: 1,
        currNodeValue: 1,
    }

    dragData = {
        isDown: false,
        prevX: 0,
        prevY: 0,
    }

    NodeDimensions.diffX = NodeDimensions.width * 2 + NodeDimensions.gap;
    NodeDimensions.diffY = NodeDimensions.height + NodeDimensions.gap / 2;

    createLinkedList();
}
async function createNodeBase(data, location = "end") {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const dataRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const pointerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const containerRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    dataRect.classList.add("data-node");
    pointerRect.classList.add("pointer-node");
    containerRect.classList.add("container-node");
    group.classList.add("linked-list-node-base");

    let x = location == "end" ? NodeDimensions.x : NodeDimensions.initialX;
    let y = location == "end" ? NodeDimensions.y : NodeDimensions.initialY;
    dataRect.setAttribute('x', x);
    dataRect.setAttribute('y', y);
    pointerRect.setAttribute('x', x + NodeDimensions.width);
    pointerRect.setAttribute('y', y);
    containerRect.setAttribute('x', x - 20);
    containerRect.setAttribute('y', y - 20);

    NodeDimensions.x += NodeDimensions.diffX;
    NodeDimensions.y += NodeDimensions.diffY;
    group.appendChild(containerRect);
    group.appendChild(dataRect);
    group.appendChild(pointerRect);
    linkedListParent.appendChild(group);

    const dataText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const pointerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const addressText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pointerText.classList.add("address-text");
    dataText.classList.add("node-text");
    addressText.classList.add("address-text");

    dataText.textContent = data;
    pointerText.textContent = "Null";
    addressText.textContent = "";
    pointerText.setAttribute('font-size', '30px');
    console.log(dataRect.getBoundingClientRect().height, NodeDimensions.height);
    dataText.setAttribute('x', parseInt(dataRect.getAttribute('x')) + parseInt(NodeDimensions.width) / 2);
    dataText.setAttribute('y', parseInt(dataRect.getAttribute('y')) + NodeDimensions.height / 2);
    pointerText.setAttribute('x', parseInt(pointerRect.getAttribute('x')) + parseInt(NodeDimensions.width) / 2);
    pointerText.setAttribute('y', parseInt(pointerRect.getAttribute('y')) + (NodeDimensions.height / 2));
    addressText.setAttribute("x", parseInt(dataRect.getAttribute('x')) + parseInt(NodeDimensions.width));
    addressText.setAttribute("y", parseInt(dataRect.getAttribute('y')) - 40);
    group.appendChild(dataText);
    group.appendChild(pointerText);
    group.appendChild(addressText);

    group.classList.add("appear");
    await delayIt(500);
    return group;
}

async function createLinkedList() {
    for (let i = 1; i <= 5; i++) {
        await linkedList.insertAtEnd();
    }
}

async function createPath(prevNode, currNode) {
    if (prevNode == null || currNode == null) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add("node-path");

    let prevPointerNode = prevNode.nodeBase.children[2];
    let currDataNode = currNode.nodeBase.children[1];
    let data = {
        prevX: parseInt(prevPointerNode.getAttribute('x')) + parseInt(NodeDimensions.width / 2),
        prevY: parseInt(prevPointerNode.getAttribute('y')) + parseInt(NodeDimensions.height) + 20,
        currX: parseInt(currDataNode.getAttribute('x')) - 20,
        currY: parseInt(currDataNode.getAttribute('y')) + parseInt(NodeDimensions.height / 2),
    }

    let d = `M ${data.prevX} ${data.prevY} C ${data.prevX} ${data.prevY + 50}, ${data.currX} ${data.currY - 50}, ${data.currX} ${data.currY}`;
    path.setAttribute('d', d);
    linkedListParent.appendChild(path);

    path.classList.add("hide");
    await delayIt(100);
    path.classList.remove("hide");
    return path;
}

function delayIt(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeTreePosition() {
    linkedListParent.style.transform = `scale(${linkedListData.scale}) translate(${linkedListData.x / linkedListData.scale}px, ${linkedListData.y / linkedListData.scale}px)`;
}

function selectNode(node) {
    console.log(node);
    for (let i of nodes) {
        i.nodeBase.classList.remove("selected");
    }
    node.nodeBase.classList.add("selected");
    selectedNode = node;

}

linkedListContainer.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        if (linkedListData.scale >= 1) return;
        linkedListData.scale += 0.05;
    }
    else {
        if (linkedListData.scale <= 0.25) return;
        linkedListData.scale -= 0.05;
    }


    changeTreePosition();
})
linkedListContainer.addEventListener('mousedown', (e) => {
    if (dragData.isDown) return;
    dragData.isDown = true;
    dragData.startX = e.clientX;
    dragData.startY = e.clientY;
    linkedListContainer.style.cursor = 'grabbing';
});

linkedListContainer.addEventListener('mouseleave', () => {
    dragData.isDown = false;
    linkedListContainer.style.cursor = 'grab';
}
);

linkedListContainer.addEventListener('mouseup', () => {
    dragData.isDown = false;
    linkedListContainer.style.cursor = 'grab';
}
);

linkedListContainer.addEventListener('mousemove', (e) => {
    if (!dragData.isDown) return;
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    const walkX = (x - dragData.startX);
    const walkY = (y - dragData.startY);
    linkedListData.x += walkX;
    linkedListData.y += walkY;
    dragData.startX = x;
    dragData.startY = y;
    changeTreePosition();
}
);

insertAtEndButton.addEventListener('click', async () => {
    await linkedList.insertAtEnd();
});

deleteAtEndButton.addEventListener('click', async () => {
    await linkedList.deleteAtEnd();
});

deleteSpecificButton.addEventListener('click', async () => {
    await linkedList.deleteSpecific(selectedNode);
});

insertAtStartButton.addEventListener('click', async () => {
    await linkedList.insertAtStart();
});

deleteAtStartButton.addEventListener('click', async () => {
    await linkedList.deleteAtStart();
});

linkedListContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains("linked-list-node-base") || e.target.parentNode.classList.contains("linked-list-node-base")) return;
    for (let i of nodes) {
        i.nodeBase.classList.remove("selected");
    }
    selectedNode = null;
});

function reStructure(node, operation) {
    let diffX = operation == '+' ? NodeDimensions.diffX : -NodeDimensions.diffX;
    let diffY = operation == '+' ? NodeDimensions.diffY : -NodeDimensions.diffY;
    if (node == null) return;
    while (node != null) {
        let firstBox = node.nodeBase.children[1];
        let secondBox = node.nodeBase.children[2];
        let nodeText = node.nodeBase.children[3];
        let pointerText = node.nodeBase.children[4];
        let addressText = node.nodeBase.children[5];
        let containerBox = node.nodeBase.children[0];
        let firstX = parseInt(firstBox.getAttribute('x'));
        let firstY = parseInt(firstBox.getAttribute('y'));
        let secondX = parseInt(secondBox.getAttribute('x'));
        let secondY = parseInt(secondBox.getAttribute('y'));
        firstBox.setAttribute('x', firstX + diffX);
        firstBox.setAttribute('y', firstY + diffY);
        secondBox.setAttribute('x', secondX + diffX);
        secondBox.setAttribute('y', secondY + diffY);

        nodeText.setAttribute('x', parseInt(nodeText.getAttribute('x')) + diffX);
        nodeText.setAttribute('y', parseInt(nodeText.getAttribute('y')) + diffY);
        pointerText.setAttribute('x', parseInt(pointerText.getAttribute('x')) + diffX);
        pointerText.setAttribute('y', parseInt(pointerText.getAttribute('y')) + diffY);
        addressText.setAttribute('x', parseInt(addressText.getAttribute('x')) + diffX);
        addressText.setAttribute('y', parseInt(addressText.getAttribute('y')) + diffY);
        containerBox.setAttribute('x', parseInt(containerBox.getAttribute('x')) + diffX);
        containerBox.setAttribute('y', parseInt(containerBox.getAttribute('y')) + diffY);


        let pathToMove = node.nextPath;
        if (pathToMove == null) {
            node = node.next;
            return;
        }
        let startX = parseInt(pathToMove.getAttribute('d').split(" ")[1]);
        let startY = parseInt(pathToMove.getAttribute('d').split(" ")[2]);
        let endX = parseInt(pathToMove.getAttribute('d').split(" ")[8]);
        let endY = parseInt(pathToMove.getAttribute('d').split(" ")[9]);
        let d = `M ${startX + diffX} ${startY + diffY} C ${startX + diffX} ${startY + diffY + 50}, ${endX + diffX} ${endY + diffY - 50}, ${endX + diffX} ${endY + diffY}`;
        pathToMove.setAttribute('d', d);
        node = node.next;

    }
}

function selectAddress() {
    let address = Math.floor(Math.random() * 65535);
    address = address.toString(16);
    while (addresses[address] != null) {
        address = Math.floor(Math.random() * 65535);
        address = address.toString(16);
    }

    addresses[address] = true;
    return address;
}

initialize();
