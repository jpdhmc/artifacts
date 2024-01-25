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

    showGallery();
}

// Build and display the gallery
const showGallery = () => {
    fetch("../include/imgFiles.json")
    .then((response) => {
        return response.json();
    }).then(galleryJson => {
        let filmSlidesGallery = document.getElementById("filmSlidesGallery");
        let filmSlidesGalleryWrapper = document.getElementById("galleryWrapper");
        let galleryButtons = document.getElementById("galleryButtons");
        categoryList = [];

        filmSlidesGalleryWrapper.style.transform = "scale(1)";
        galleryJson.images.forEach(galleryObject => {
            imgName = galleryObject.name;
            imgCategory = galleryObject.category;

            // Build gallery tabs
            if (!categoryList.includes(imgCategory)) {
                categoryList.push(imgCategory);
                let newCategory = document.createElement("button");
                newCategory.className = "tabButton";
                newCategory.id = imgCategory;
                newCategory.innerHTML = imgCategory;
                galleryButtons.appendChild(newCategory);
            }

            // Populate gallery with images
            let newImg = document.createElement("img");
            newImg.src = "img/gallery/" + imgCategory + "/" + imgName;
            filmSlidesGallery.appendChild(newImg);
        });
    })
    

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