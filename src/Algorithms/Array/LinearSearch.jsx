import { useState, useEffect } from "react";
import "../../Styles/Array/LinearSearch.css"

export function createArray(size = 15, inputArray = [], target = null) {
    const boxes = document.querySelectorAll(".array-box");
    boxes.forEach(box => {
        box.classList = "array-box";
    })
    if (inputArray.length > 0) {
        target = target == null ? inputArray[Math.floor(Math.random() * (inputArray.length - 1))] : target;
        return [inputArray, target];
    }

    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 10));
    }
    const idx = Math.floor(Math.random() * (size - 1));
    return [array, array[idx]];
}

async function linearSearch(arr, target) {
    let last = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            visualizeLinearSearch(i, true, last++);
        } else {
            visualizeLinearSearch(i, false, last++);
        }
        await delayIt();
    }
    visualizeLinearSearch(-1, false, last++);

    return -1;
}

export function delayIt() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

function visualizeLinearSearch(index, found = false, last) {
    const boxes = document.querySelectorAll(".array-box");
    if (last != -1 && !boxes[last].classList.contains("found"))
        boxes[last].classList.add("visited");
    for (let i = 0; i < boxes.length; i++) {
        if (!boxes[i].classList.contains("found"))
            boxes[i].classList.remove("selected");
    }
    if (found && index != -1) boxes[index].classList.add("found");
    else if (index != -1)
        boxes[index].classList.add("selected");
}

const LinearSearch = () => {
    const [array, setArray] = useState([]);
    const [userArray, setUserArray] = useState([]);
    const [size, setSize] = useState(15);
    const [target, setTarget] = useState(0);

    function generateNewArray() {
        const [array, target] = createArray(size, userArray);
        setArray([...array]);
        setTarget(target);
    }

    function takeInputArray(e) {
        e.preventDefault();
        let inputArray = document.getElementById("input-array").value;

        inputArray = inputArray.replace(/[\[\]{}()]/g, "");
        inputArray = inputArray.trim().split(",");
        inputArray = inputArray.map((value) => parseInt(value));
        for (let i = 0; i < inputArray.length; i++) {
            if (isNaN(inputArray[i])) {
                alert("Invalid Input");
                return;
            }
        }
        setUserArray([...inputArray]);
    }

    function appear(index) {
        let options = document.getElementById("options");
        options.style.display = "none";
        let inputs = document.querySelectorAll("#input-array-parent >*");
        inputs[index].style.display = "flex";
        const searchBtn = document.getElementById("search-btn");
        searchBtn.style.display = "block";
    }

    async function startSearching() {
        disableButtons();
        document.querySelector("#target-box").style.display = "block";
        await linearSearch(array, target);
        enableButtons();
        document.querySelector("#search-btn").style.display = "none";
        document.querySelector("#search-again").style.display = "block";
    }

    function disableButtons() {
        const buttons = document.querySelectorAll("#binary-search-parent button, #array-controls input");
        buttons.forEach(a => {
            a.disabled = true;
        })
    }

    function enableButtons() {
        const buttons = document.querySelectorAll("#binary-search-parent button, #array-controls input");
        buttons.forEach(a => {
            a.disabled = false;
        })
    }
    useEffect(() => {
        generateNewArray();
    }, [size, userArray])

    return (
        <div id="linear-search-parent">
            <h1>Linear Search</h1>
            <div id="array-parent">
                {array.map((value, index) => {
                    return (
                        <div className="array-box" key={index}>
                            {value}
                        </div>
                    )
                })}
            </div>
            <div id="options">
                <button id="generate-array-btn" onClick={() => { appear(0) }}>Give Input Array</button>
                <button id="generate-array-btn" onClick={() => { appear(1) }}>Generate New Array</button>
            </div>
            <div id="input-array-parent">
                <form onSubmit={takeInputArray}>
                    <input type="text" id="input-array" placeholder="Enter Array" />
                    <input type="number" id="target" placeholder="Enter Target" />
                    <button type="submit">Give input</button>
                </form>
                <div id="random-generation">
                    <label htmlFor="size">Size of Array: {size}
                        <input type="range" id="size" min="10" max="22" value={size} onChange={(e) => setSize(e.target.value)} />
                    </label>

                    <button id="generate-array-btn" onClick={generateNewArray}>Generate New Array</button>
                </div>
            </div>
            <button id="search-btn" onClick={startSearching}>Start Searching</button>
            <button id="search-again" onClick={() => {
                window.location.reload();
            }}>Search Again</button>
            <div id="target-box">Target = {target}</div>
        </div>
    )
}

export default LinearSearch;