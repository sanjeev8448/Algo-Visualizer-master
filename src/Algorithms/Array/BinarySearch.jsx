import { useState, useEffect } from "react";
import '../../Styles/Array/BinarySearch.css';
import { createArray, delayIt } from "./LinearSearch";

async function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        visualizeBinarySearch(low, high, mid, false);
        if (arr[mid] == target) {
            await delayIt(1000);
            visualizeBinarySearch(low, high, mid, true, true);
            return mid;
        }
        else if (arr[mid] < target) {
            await delayIt(1000);
            visualizeBinarySearch(low, mid, null, false, true);
            low = mid + 1;
        }
        else {
            await delayIt(1000);
            visualizeBinarySearch(mid, high, null, false, true)
            high = mid - 1;
        }
        await delayIt(1000);
    }
}

function visualizeBinarySearch(start, end, mid, found = false, visited = false) {
    let boxes = document.getElementsByClassName("array-box");
    if (!visited) {
        boxes[start].classList.add("start-box");
        boxes[end].classList.add("end-box");
        boxes[mid].classList.add("mid-box");
    } else if (!found) {
        for (let i = start; i <= end; i++) {
            boxes[i].classList.add("visited");
        }
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].classList.remove("start-box");
            boxes[i].classList.remove("end-box");
            boxes[i].classList.remove("mid-box");
        }
    } else {
        boxes[mid].classList.add("found");
        for (let i = start; i <= end; i++) {
            if (i != mid)
                boxes[i].classList.add("visited");
        }
    }

}
const BinarySearch = () => {
    const [array, setArray] = useState([]);
    const [userArray, setUserArray] = useState([]);
    const [size, setSize] = useState(20);
    const [target, setTarget] = useState(0);
    const [searchFinished, setSearchFinished] = useState(true);

    function generateNewArray() {
        const [array, newTarget] = createArray(size, userArray, target);
        array.sort((a, b) => a - b);
        setArray([...array]);
        setTarget(newTarget);
        console.log(target);
    }

    async function startSearching() {
        disableButtons();
        document.querySelector("#target-box").style.display = "block";
        await binarySearch(array, target);
        enableButtons();
        document.querySelector("#search-btn").style.display = "none";
        document.querySelector("#search-again").style.display = "block";
    }

    function takeInputArray(e) {
        e.preventDefault();
        let inputArray = document.getElementById("input-array").value;
        let newTarget = document.getElementById("target").value;
        inputArray = inputArray.replace(/[\[\]{}()]/g, "");
        inputArray = inputArray.trim().split(",");
        inputArray = inputArray.map((value) => parseInt(value));
        for (let i = 0; i < inputArray.length; i++) {
            if (isNaN(inputArray[i])) {
                alert("Invalid Input");
                return;
            }
        }
        setTarget(newTarget);
        setUserArray([...inputArray]);
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

    function appear(index) {
        let options = document.getElementById("options");
        options.style.display = "none";
        let inputs = document.querySelectorAll("#input-array-parent >*");
        inputs[index].style.display = "flex";
        const searchBtn = document.getElementById("search-btn");
        searchBtn.style.display = "block";
    }

    useEffect(() => {
        generateNewArray();
    }, [userArray])

    useEffect(() => {
        setUserArray([]);
        generateNewArray();
    }, [size])
    return (
        <div id="binary-search-parent">
            <h1>Binary Search</h1>
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

export default BinarySearch;
