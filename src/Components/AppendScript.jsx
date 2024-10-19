const AppendScript = (scriptToAppend) => {

    // if script exists do not append
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === scriptToAppend) {
            return;
        }
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptToAppend;
    document.head.appendChild(script);
}

export default AppendScript;

export const RemoveScript = (scriptToDisAppend) => {

    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === scriptToDisAppend) {
            scripts[i].remove();
        }
    }
}


