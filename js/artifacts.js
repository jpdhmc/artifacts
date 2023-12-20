/**
 * Main js logic file
 * 
 * @author John Den Hartog
 */
const init = () => {
    console.log("artifacts.js init running");
    // document.getElementById("exampleButton").addEventListener("click", indexButtonClick);
    const posters = document.getElementsByClassName("posterWrapper");
    // cant use foreach because its an htmlcollection not an array
    for (let i = 0; i < posters.length; i++) {
        let posterImg = posters[i].querySelector("img");
        posters[i].addEventListener('mouseover', () => {posterImg.style.transform = "scale(1.05,1.05)"});
        posters[i].addEventListener('mouseout', () => {posterImg.style.transform = "scale(1,1)"});
        posters[i].addEventListener('mousemove', (e) => {posterImg.style.transformOrigin = ((e.pageX - posters[i].offsetLeft) / posters[i].offsetWidth) * 100 + "% "
                                                                                            + ((e.pageY - posters[i].offsetTop) / posters[i].offsetHeight) * 100 + "%"});
    }
}

const indexButtonClick = () => {
    console.log("example button clicked");
    const indexPoster = document.getElementById("indexPoster");
    const posterVideoOne = document.getElementById("posterVideoOne");
    indexPoster.style.display = "none";
    posterVideoOne.style.display = "block";
}

window.onload = init;