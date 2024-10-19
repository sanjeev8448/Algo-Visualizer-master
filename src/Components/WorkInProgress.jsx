import "../Styles/WorkInProgress.css";
const WorkInProgress = () => {
    const goToHomePage = () => {
        window.location.href = "/";
    }
    return (
        <div className="error-boundary">
            <h1>This feature is yet to be implemented</h1>
            <button onClick={goToHomePage} id="home-page-btn" >Home Page</button>
        </div>
    )
}

export default WorkInProgress;