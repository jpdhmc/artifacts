/**
 * Main js logic file
 * 
 * @author John Den Hartog
 */
const init = () => {
    console.log("artifacts.js init running");
    document.getElementById("exampleButton").addEventListener("click", indexButtonClick);
    handlePosterImages();
}

const indexButtonClick = () => {
    console.log("example button clicked");
    const indexPoster = document.getElementById("indexPoster");
    const posterVideoOne = document.getElementById("posterVideoOne");
    indexPoster.style.display = "none";
    posterVideoOne.style.display = "block";
}

// Poster image background zooming and panning
const handlePosterImages = () => {
    const posters = document.getElementsByClassName("posterWrapper");
    for (let i = 0; i < posters.length; i++) {
        let posterImg = posters[i].querySelector("img");
        posters[i].addEventListener('mouseover', () => {posterImg.style.transform = "scale(1.05,1.05)"});
        posters[i].addEventListener('mouseout', () => {posterImg.style.transform = "scale(1,1)"});

        // Uses mousemove event to calculate horizontal and vertical position of the mouse relative to the posterWrapper element
        posters[i].addEventListener('mousemove', (e) => {posterImg.style.transformOrigin = calculateTransformOrigin(e, posters[i])})
    }
}

// Calculate movement of elements based on relative mouse position, to be called on mousemove
const calculateTransformOrigin = (ev, element) => {
    let trOrigin = ((ev.pageX - element.offsetLeft) / element.offsetWidth) * 100 + "% "
    + ((ev.pageY - element.offsetTop) / element.offsetHeight) * 100 + "%"
    return trOrigin;
}

window.onload = init;