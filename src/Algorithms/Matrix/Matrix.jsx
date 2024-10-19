import "../../Styles/Matrix/matrix.css"
import AppendScript, { RemoveScript } from "../../Components/AppendScript"
import { useEffect } from "react"
const Matrix = () => {
    useEffect(() => {
        AppendScript("/matrix.js")
        return () => {
            RemoveScript("/matrix.js")
        }
    })
    return (
        <div id='matrix-page'>
            <div id="matrix-container">
                <div id="matrix-controls">
                    <button id="bfs-start">Start Bfs</button>
                    <div id="path-length">Shortest Path : </div>
                </div>
                <div id="matrix-parent"></div>
            </div>
        </div>
    )
}

export default Matrix;