import { useEffect } from "react";
import AppendScript, { RemoveScript } from "../../Components/AppendScript";
import "../../Styles/Tree/Tree.css";
const Tree = () => {
    useEffect(() => {
        AppendScript('tree.js');
        return () => RemoveScript('tree.js')
    }, []);
    return (
        <>
            <div className="tree-taskbar">
                <form onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <input id="edit-node" type="text" placeholder="Enter Node Value" />
                    <button id="change-value-btn" >Change Value</button>
                </form>
                <button id="delete-node-btn">Delete Node</button>
                <button id="preOrderBtn">Pre Order</button>
                <button id="postOrderBtn">Post Order</button>
                <button id="inOrderBtn">In Order</button>
                <button id="levelOrderBtn">Level Order</button>
                <button id="clear-tree">Clear Tree</button>
                <button id="demo-tree-btn">Create Demo Tree</button>
            </div>
            <div id="traversal-result"></div>
            <svg id="tree" >
                <g id="tree-parent"></g>
            </svg>
        </>
    );

}

export default Tree;