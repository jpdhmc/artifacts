/**
 * Main js logic file
 * 
 * @author John Den Hartog
 */
const init = () => {
    console.log("artifacts.js init running");
    document.getElementById("exampleButton").addEventListener("click", indexButtonClick);
    handlePosterMovers();
}

const indexButtonClick = () => {
    console.log("example button clicked");
    const indexPoster = document.getElementById("indexPoster");
    const posterVideoOne = document.getElementById("posterVideoOne");
    indexPoster.style.display = "none";
    posterVideoOne.style.display = "block";
    requestFilenames();
}

const requestFilenames = () => {
    let file = "include/asdf.txt"

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                handleFilenames(this.responseText);
            }
        }
    }
    xhttp.open("GET", file, true);
    xhttp.send()
}

const handleFilenames = (fileText) => {
    let fileNames = fileText.split(" ");
    console.log(fileNames);
}

// Poster interactive zooming and panning
const handlePosterMovers = () => {
    const posters = document.getElementsByClassName("posterWrapper");

    for (let i = 0; i < posters.length; i++) {
        let posterMover = posters[i].querySelector(".posterMover");
        posters[i].addEventListener('mouseover', () => {posterMover.style.transform = "scale(1.05,1.05)"});
        posters[i].addEventListener('mouseout', () => {posterMover.style.transform = "scale(1,1)"});

        // Uses mousemove event to calculate horizontal and vertical position of the mouse relative to the posterWrapper element
        posters[i].addEventListener('mousemove', (e) => {posterMover.style.transformOrigin = calculateTransformOrigin(e, posters[i])})
    }
}

// Calculate transform of elements based on relative mouse position, to be called on mousemove
const calculateTransformOrigin = (ev, element) => {
    let trOrigin = ((ev.pageX - element.offsetLeft) / element.offsetWidth) * 100 + "% "
    + ((ev.pageY - element.offsetTop) / element.offsetHeight) * 100 + "%"
    return trOrigin;
}

window.onload = init;