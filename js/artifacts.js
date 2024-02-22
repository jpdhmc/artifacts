/**
 * Main js logic file
 * 
 * @author John Den Hartog
 */
const init = () => {
    console.log("artifacts.js init running");
    document.getElementById("exampleButton").addEventListener("click", indexButtonClick);
    handlePosterMovers(true);
}

const indexButtonClick = () => {
    const indexPoster = document.getElementById("indexPoster");
    const posterVideoOne = document.getElementById("posterVideoOne");
    const posterMover = document.getElementById("posterMover");
    const button = document.getElementById("exampleButton");

    // Waits until poster scale transition finishes to trigger
    posterMover.addEventListener("transitionend", () => {
        posterVideoOne.style.display = "block";

        // Onplay helps avoid a blank frame between image and video
        posterVideoOne.onplay = () => {
            indexPoster.style.display = "none";
            indexPoster.src = "img/slidesStill.JPG";
            button.style.display = "none";
        }

        posterVideoOne.onended = () => {
            indexPoster.style.display = "block";
            posterVideoOne.style.display = "none";
            showGallery();
        }
    });
    handlePosterMovers(false);
}

// Build and display the gallery
const showGallery = () => {
    let filmSlidesGallery = document.getElementById("filmSlidesGallery");
    let filmSlidesGalleryWrapper = document.getElementById("galleryWrapper");

    fetch("../include/imgFiles.json")
        .then((response) => {
            return response.json();
        }).then(galleryJson => {
            let galleryButtons = document.createElement("div");
            let columnsStyle = "auto ";
            let categoryList = [];
            galleryButtons.className = "galleryButtons";
            filmSlidesGallery.appendChild(galleryButtons);
            filmSlidesGalleryWrapper.style.display = "flex";
            handleCloseGalleryOrImage();

            // Create the button for removing gallery filtering
            let allCategory = document.createElement("button");
            allCategory.className = "tabButton tabButtonActive";
            allCategory.id = "allCategory"
            allCategory.innerHTML = "All Categories";
            galleryButtons.appendChild(allCategory);
            allCategory.addEventListener("click", () => {
                tabButtons = Array.from(galleryButtons.getElementsByTagName("button"))
                tabButtons.forEach(tabButton => {
                    tabButton.classList = "tabButton";
                })
                allCategory.className = "tabButton tabButtonActive"
                filterGallery("allCategory");
            });


            galleryJson.images.forEach(galleryObject => {
                let imgName = galleryObject.name;
                let imgCategory = galleryObject.category;

                // Populate gallery with all images
                let newImg = document.createElement("img");
                newImg.src = "img/gallery/" + imgCategory + "/" + imgName;
                newImg.dataset.category = imgCategory;
                filmSlidesGallery.appendChild(newImg);
                newImg.addEventListener("click", () => {
                    expandImage(newImg);
                })

                // Build category tabs
                if (!categoryList.includes(imgCategory)) {
                    categoryList.push(imgCategory);
                    columnsStyle += "auto ";
                    galleryButtons.style.gridTemplateColumns = columnsStyle;
                    let newCategory = document.createElement("button");
                    newCategory.className = "tabButton";
                    newCategory.id = imgCategory;
                    newCategory.innerHTML = imgCategory;
                    galleryButtons.appendChild(newCategory);
                    newCategory.addEventListener("click", () => {
                        tabButtons = Array.from(galleryButtons.getElementsByTagName("button"))
                        tabButtons.forEach(tabButton => {
                            tabButton.classList = "tabButton";
                        })
                        newCategory.className = "tabButton tabButtonActive";
                        filterGallery(newCategory.id);
                    });
                }
            });
        }).catch(err => console.error("Error: " + err));
}

// Handle the closing/cleaning up for the gallery or the expanded image
const handleCloseGalleryOrImage = () => {
    window.addEventListener("click", closer = (event) => {
        let filmSlidesGallery = document.getElementById("filmSlidesGallery");
        let filmSlidesGalleryWrapper = document.getElementById("galleryWrapper");
        let expandedWrapper = document.getElementById("expandedWrapper");

        // Clicks outside the gallery close it. If an expanded image is currently being shown clicks outside the image will close it
        if (expandedWrapper.style.display == "block") {
            if (event.target == expandedWrapper) {
                expandedWrapper.style.display = "none";
            }
        } else if (!filmSlidesGallery.contains(event.target)) {
            filmSlidesGalleryWrapper.addEventListener("animationend", animend = () => {
                filmSlidesGalleryWrapper.style.display = "none";
                filmSlidesGalleryWrapper.classList.remove("shrink");
                filmSlidesGalleryWrapper.removeEventListener("animationend", animend);
            })
            filmSlidesGalleryWrapper.classList.add("shrink");
            while (filmSlidesGallery.firstChild) {
                filmSlidesGallery.removeChild(filmSlidesGallery.lastChild);
            }
            document.getElementById("exampleButton").style.display = "block";
            window.removeEventListener("click", closer);
        }
    })
}

// Called when an image in the gallery is clicked, displays the full size image 
const expandImage = (selectedImg) => {
    let expandedWrapper = document.getElementById("expandedWrapper");
    let expandedImage = document.getElementById("expandedImg");
    expandedImage.src = selectedImg.src;
    expandedWrapper.style.display = "block";
    expandedImage.style.display = "block";
}

// Called when a gallery tab is clicked, repopulates the gallery with images filtered by category
const filterGallery = (filterCategory) => {
    let filmSlidesGallery = document.getElementById("filmSlidesGallery");
    let imgs = Array.from(filmSlidesGallery.getElementsByTagName("img"));
    for (let i = 0; i < imgs.length; i++) {
        let currentImg = imgs[i];
        if (filterCategory == "allCategory") {
            currentImg.style.display = "inline";
        } else if (currentImg.dataset.category == filterCategory) {
            currentImg.style.display = "inline";
        } else {
            currentImg.style.display = "none";
        }
    }
}

// Poster interactive zooming and panning
const handlePosterMovers = (isHandling) => {
    let posterMover = document.getElementById("posterMover");
    // If true assigns the event listeners, if false removes listeners and resets scale for smooth transition back
    if (isHandling) {
        posterMover.addEventListener('mouseover', mouseoverEvent = () => { posterMover.style.transform = "scale(1.05,1.05)" });
        posterMover.addEventListener('mouseout', mouseoutEvent = () => { posterMover.style.transform = "scale(1,1)" });

        // Uses mousemove event to calculate horizontal and vertical position of the mouse relative to the posterWrapper element
        posterMover.addEventListener('mousemove', mousemoveEvent = (e) => { posterMover.style.transformOrigin = calculateTransformOrigin(e, posterMover) });
    } else {
        posterMover.removeEventListener('mouseover', mouseoverEvent);
        posterMover.removeEventListener('mouseout', mouseoutEvent);
        posterMover.removeEventListener('mousemove', mousemoveEvent);
        posterMover.style.transform = "scale(1,1)";
    }
}

// Calculate transform of elements based on relative mouse position, to be called on mousemove
const calculateTransformOrigin = (ev, element) => {
    let trOrigin = ((ev.pageX - element.offsetLeft) / element.offsetWidth) * 100 + "% "
        + ((ev.pageY - element.offsetTop) / element.offsetHeight) * 100 + "%"
    return trOrigin;
}

window.onload = init;