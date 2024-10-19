import "../../Styles/LinkedList/linked-list-animation.css";
import AppendScript, { RemoveScript } from "../../Components/AppendScript";
import { useEffect } from "react";
const Animation = () => {

    useEffect(() => {
        AppendScript("/linked-list-animation.js");
        return () => {
            RemoveScript("/linked-list-animation.js");
        }
    }, []);
    return (
        <div id="linked-list-animation-container">
            <div id="linked-list-parent"></div>
        </div>
    )
}

export default Animation;