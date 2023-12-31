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
    const indexPoster = document.getElementById("indexPoster");
    const posterVideoOne = document.getElementById("posterVideoOne");
    //indexPoster.style.display = "none";
    document.getElementById("exampleButton").style.display = "none";
    //posterVideoOne.style.display = "block";

    requestFilenames().then(fileNames => {
        showGallery(fileNames);
    }).catch(error => {
        console.error("Error: ", error);
    });
}

// Use an xmlhttprequest to get a string containing the filenames from the server
const requestFilenames = () => {
    return new Promise((resolve, reject) => {
        let file = "include/asdf.txt"

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    let fileNames = xhttp.responseText.split(" ");
                    resolve(fileNames);
                } else {
                    reject(new Error("Request for file names failed"));
                }
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send()
    });
}

// Build and display the gallery
const showGallery = (fileNames) => {
    let filmSlidesGallery = document.getElementById("filmSlidesGallery");
    let filmSlidesGalleryWrapper = document.getElementById("galleryWrapper");
    filmSlidesGalleryWrapper.style.transform = "scale(1)";

    // Close/cleanup
    window.onclick = (event) => {
        if (!filmSlidesGallery.contains(event.target)) {
            filmSlidesGalleryWrapper.style.transform = "scale(0)";
            while (filmSlidesGallery.firstChild) {
                filmSlidesGallery.removeChild(filmSlidesGallery.lastChild);
            }
            document.getElementById("exampleButton").style.display = "block";
        }
    }

    fileNames.forEach(fileName => {
        let newImg = document.createElement("img");
        newImg.src = fileName;
        filmSlidesGallery.appendChild(newImg);
    });

    // Navigation
    document.getElementById("openBtn").onclick = (event) => {
        document.getElementById("overlayNav").style.height = "100%";
    }
    document.getElementById("closeBtn").onclick = (event) => {
        document.getElementById("overlayNav").style.height = "0%";
    }
}

// Poster interactive zooming and panning
const handlePosterMovers = () => {
    const posters = document.getElementsByClassName("posterWrapper");

    for (let i = 0; i < posters.length; i++) {
        let posterMover = posters[i].querySelector(".posterMover");
        posters[i].addEventListener('mouseover', () => { posterMover.style.transform = "scale(1.05,1.05)" });
        posters[i].addEventListener('mouseout', () => { posterMover.style.transform = "scale(1,1)" });

        // Uses mousemove event to calculate horizontal and vertical position of the mouse relative to the posterWrapper element
        posters[i].addEventListener('mousemove', (e) => { posterMover.style.transformOrigin = calculateTransformOrigin(e, posters[i]) })
    }
}

// Calculate transform of elements based on relative mouse position, to be called on mousemove
const calculateTransformOrigin = (ev, element) => {
    let trOrigin = ((ev.pageX - element.offsetLeft) / element.offsetWidth) * 100 + "% "
        + ((ev.pageY - element.offsetTop) / element.offsetHeight) * 100 + "%"
    return trOrigin;
}

window.onload = init;