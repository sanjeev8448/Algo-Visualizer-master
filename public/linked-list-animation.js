const parent = document.getElementById("linked-list-parent");
const container = document.getElementById("linked-list-animation-container");
let fillerGap = 10 * window.innerWidth;
parent.style.width = `${fillerGap * 4 + 400 * 5 + window.innerWidth}px`;
parent.style.paddingLeft = `${window.innerWidth / 2}px`;
for (let i = 0; i < 5; i++) {
    const div = document.createElement("div");
    div.classList.add("linked-list-node");
    parent.appendChild(div);
    const dataNode = document.createElement("div");
    dataNode.classList.add("data-node");
    div.appendChild(dataNode);
    const pointerNode = document.createElement("div");
    pointerNode.classList.add("pointer-node");
    div.appendChild(pointerNode);
    dataNode.innerHTML = "data";
    pointerNode.innerHTML = "next";
    if (i === 4) continue;
    const fillerBlock = document.createElement("div");
    fillerBlock.classList.add("filler-block");
    fillerBlock.style.width = `${fillerGap}px`;
    parent.appendChild(fillerBlock);
    for (let j = 0; j < 100; j++) {
        const fillerNode = document.createElement("div");
        fillerNode.classList.add("filler-node");
        fillerBlock.appendChild(fillerNode);
    }
}

const startAnimateBtn = document.createElement("button");
startAnimateBtn.innerHTML = "Start Animation";
startAnimateBtn.id = "start-animate-btn";
parent.parentNode.appendChild(startAnimateBtn);

startAnimateBtn.addEventListener("click", () => {
    const currentXScroll = window.scrollX;
    const toScroll = fillerGap + 400;
    window.scrollTo({
        top: 0,
        left: currentXScroll + toScroll,
        behavior: "smooth"
    });

});

