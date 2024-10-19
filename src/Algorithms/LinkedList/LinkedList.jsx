import AppendScript, { RemoveScript } from '../../Components/AppendScript';
import { useState, useEffect } from 'react';
import "../../Styles/LinkedList/linked-list.css";

const LinkedList = () => {

    useEffect(() => {
        AppendScript("/linkedlist.js");
        return () => {
            RemoveScript("/linkedlist.js");
        }
    })
    return (
        <div id="linked-list-parent">
            <div id="linked-list-controls">
                <button id="linked-list-insert-start">Insert At Start</button>
                <button id="linked-list-delete-start">Delete At Start</button>
                <button id="linked-list-insert-end">Insert At End</button>
                <button id="linked-list-delete-end">Delete At End</button>
                <button id="linked-list-delete-specific">Delete This</button>
                <button id="linked-list-clear">Clear</button>
            </div>
            <svg id="linked-list-svg">
                <g id="linked-list-container"></g>
            </svg>
        </div>
    );
}

export default LinkedList;