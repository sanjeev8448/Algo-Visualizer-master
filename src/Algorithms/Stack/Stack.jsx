import { useEffect } from "react";
import AppendScript from "../../Components/AppendScript";
import "../../Styles/Stack/Stack.css";


const Stack = () => {
    useEffect(() => {

    }, [])

    function pushToContainer() {
        let value = document.getElementById("stack-input").value;
        let stackBox = document.getElementById("stack-box");
        let newDiv = document.createElement("div");
        newDiv.classList.add("stack-item");
        newDiv.innerHTML = value;
        stackBox.appendChild(newDiv);
        newDiv.classList.add("appear");
        document.getElementById("stack-input").value = "";
        stackBox.querySelector(".empty-filler").style.display = "none";
    }

    function popFromContainer() {
        let stackBox = document.getElementById("stack-box");
        if (stackBox.children.length === 0) return;
        let lastChild = stackBox.querySelectorAll(".stack-item")[stackBox.children.length - 2];
        if (lastChild) {
            lastChild.classList.add("disappear");
            setTimeout(() => {
                stackBox.removeChild(lastChild);
                if (stackBox.querySelectorAll(".stack-item").length === 0) {
                    stackBox.querySelector(".empty-filler").style.display = "flex";
                }
            }, 1000);
        }
    }

    function clearContainer() {
        let stackBox = document.getElementById("stack-box");
        let children = stackBox.querySelectorAll(".stack-item");
        children.forEach(child => {
            child.classList.add("disappear");
            setTimeout(() => {
                stackBox.removeChild(child);
            }, 1000);
        })
    }

    function peekContainer() {
        let stackBox = document.getElementById("stack-box");
        if (stackBox.children.length === 0) return;
        let lastChild = stackBox.querySelectorAll(".stack-item")[stackBox.children.length - 2];
        if (lastChild) {
            lastChild.classList.add("selected");
            setTimeout(() => {
                lastChild.classList.remove("selected");
            }, 1500);
        }
    }

    return (
        <div id="stack-container">
            <h1> Stack</h1>
            <div className="stack-data">
                <div id="stack-box">
                    <div className="empty-filler">
                        <div>STACK</div>
                    </div>
                </div>
                <form id='stack-form' onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <div className="push-data">
                        <input type="text" id="stack-input" placeholder="Enter a value" />
                        <button id="stack-push" onClick={pushToContainer}>Push</button>
                    </div>
                    <div className="rest-buttons">
                        <button id="stack-pop" onClick={popFromContainer}>Pop</button>
                        <button id="stack-clear" onClick={clearContainer}>Clear</button>
                        <button id="stack-peek" onClick={peekContainer}>Peek</button>
                    </div>


                </form>
            </div>

        </div>
    )
}

export default Stack;