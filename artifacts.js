/**
 * Main js logic file
 * 
 * @author John Den Hartog
 */
const init = () => {
    console.log("artifacts.js init running")
    document.querySelector("#exampleButton").addEventListener("click", buttonClick);
}

const buttonClick = () => {
    console.log("example button clicked")
}

window.onload = init;