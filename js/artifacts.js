/**
 * Main js logic file
 * 
 * @author John Den Hartog
 */
class Artifact {
    constructor(name, gallery, category, filePath, tags) {
        this.name = name;
        this.gallery = gallery;
        this.category = category;
        this.filePath = filePath;
        this.tags = tags;
    }
}

const init = () => {
    const artifactsArray = generateArtifacts();
    handleIndexPaths(true, artifactsArray);
    handlePosterMovers(true);
}

// Fetches artifacts json and creates Artifact objects
const generateArtifacts = () => {
    let artifactsArray = []
    fetch("../include/imgFiles.json")
        .then((response) => {
            return response.json();
        }).then(galleryJson => {
            galleryJson.artifacts.forEach(jsonArtifact => {
                const newArtifact = new Artifact(jsonArtifact.name, jsonArtifact.gallery, jsonArtifact.category, jsonArtifact.filePath, jsonArtifact.tags);
                artifactsArray.push(newArtifact);
            })
        });
    
    // Video files hosted on external websites
    fetch("../include/vidFiles.json")
        .then((response) => {
            return response.json();
        }).then(vidJson => {
            vidJson.videos.forEach(vidFile => {
                const newVidArtifact = new Artifact(vidFile.name, vidFile.gallery, vidFile.location, vidFile.link, vidFile.tags);
                artifactsArray.push(newVidArtifact);
            })
        })
    return artifactsArray;
}

// Transitions poster depending on selected gallery and calls its function
const galleryButtonClick = (selectedGallery, artifactsArray) => {
    const indexPoster = document.getElementById("indexPoster");
    const posterVideo = document.getElementById("posterVideo");
    const posterMover = document.getElementById("posterMover");

    let desiredArtifacts = [];
    artifactsArray.forEach(artifact => {
        if (artifact.gallery == selectedGallery) {
            desiredArtifacts.push(artifact);
        }
    })

    posterVideo.src = "img/" + selectedGallery + "Transition.mp4";

    // Waits until poster scale transition finishes to trigger
    posterMover.addEventListener("transitionend", posterTransition = () => {
        posterVideo.style.display = "block";

        // Onplay helps avoid a blank frame between image and video
        posterVideo.onplay = () => {
            indexPoster.style.display = "none";
            indexPoster.src = "img/" + selectedGallery + "Still.jpg";

            // Hide svg glow
            handleIndexPaths(false);
        }

        posterVideo.onended = () => {
            posterMover.removeEventListener("transitionend", posterTransition);
            indexPoster.style.display = "block";
            posterVideo.style.display = "none";
            switch (selectedGallery) {
                case "filmSlides":
                    displayFilmSlidesGallery(desiredArtifacts);
                    break;
                case "vhs":
                    displayVhsGallery(desiredArtifacts);
                    break;
                case "printedMedia":
                    displayprintedMedia(desiredArtifacts);
                    break;
                case "cassettes":
                    displayCassettes(desiredArtifacts);
                    break;
                case "tapes":
                    displayTapesGallery(desiredArtifacts);
            }
        }
    });
    handlePosterMovers(false);
}

// Build and display the film slides gallery
const displayFilmSlidesGallery = (artifactsArray) => {
    // TODO change strength of poster move effect
    handlePosterMovers(true)
    let filmSlidesGallery = document.getElementById("filmSlidesGallery");
    let filmSlidesGalleryWrapper = document.getElementById("galleryWrapper");

    let galleryButtons = document.createElement("div");
    let categoryList = [];

    galleryButtons.className = "galleryButtons";
    filmSlidesGalleryWrapper.appendChild(galleryButtons);
    filmSlidesGallery.style.display = "flex";
    filmSlidesGalleryWrapper.style.display = "flex";
    
    handleCloseGalleryOrImage();

    // Create the button for removing gallery filtering
    let allCategory = document.createElement("button");
    allCategory.className = "tabButton tabButtonActive";
    allCategory.id = "allCategory"
    allCategory.innerHTML = "All Categories";
    galleryButtons.appendChild(allCategory);
    allCategory.addEventListener("click", () => {
        tabButtons = Array.from(galleryButtons.getElementsByTagName("button"));
        tabButtons.forEach(tabButton => {
            tabButton.classList = "tabButton";
        })
        allCategory.className = "tabButton tabButtonActive"
        filterGallery("allCategory");
    });


    artifactsArray.forEach(galleryObject => {
        let imgCategory = galleryObject.category;
        let imgPath = galleryObject.filePath;
        let imgName = galleryObject.name;

        // Populate gallery with figures for all images
        let newFigure = document.createElement("figure");
        let newFigCaption = document.createElement("figcaption");
        let newImg = document.createElement("img");
        newImg.src = imgPath;
        newFigure.dataset.category = imgCategory;
        newFigCaption.innerHTML = imgName;

        newFigure.appendChild(newImg);
        newFigure.appendChild(newFigCaption);
        filmSlidesGallery.appendChild(newFigure);
        newImg.addEventListener("click", () => {
            expandImage(newFigure);
        })

        // Build category tabs
        if (!categoryList.includes(imgCategory)) {
            categoryList.push(imgCategory);
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
}

const displayVhsGallery = (artifactsArray) => {
    let vhsGallery = document.getElementById("vhsGallery");
    let galleryWrapper = document.getElementById("galleryWrapper");
    let vhsFrame = document.getElementById("vhsFrame");

    let vhsButtons = document.createElement("div");
    vhsButtons.classList.add("galleryButtons");
    galleryWrapper.appendChild(vhsButtons);

    // TODO on video select set false
    handlePosterMovers(true);

    artifactsArray.forEach(videoArtifact => {
        let vhsIconWrapper = document.createElement("div");
        let vhsIcon = document.createElement("img");
        let vhsName = document.createElement("div");
        vhsIconWrapper.appendChild(vhsIcon);
        vhsIconWrapper.appendChild(vhsName);
        vhsIcon.src = "img/icon/vhsIconClosed.png";
        vhsIconWrapper.classList.add("vhsIconWrapper");
        vhsIcon.classList.add("vhsIcon");
        vhsName.classList.add("vhsText");
        vhsName.innerHTML = videoArtifact.name;
        //onclick
        vhsButtons.appendChild(vhsIconWrapper);
    })

    
    galleryWrapper.style.display = "flex";
    vhsGallery.style.display = "flex";

    
}

// Called when an image in the gallery is clicked, displays the full size image 
// TODO Maybe make it so this can handle img and video depending on whats passed to it
const expandImage = (selectedFigure) => {
    handlePosterMovers(false);
    let expandedWrapper = document.getElementById("expandedWrapper");
    let expandedFigure = document.getElementById("expandedFigure");
    expandedFigure.innerHTML = selectedFigure.innerHTML;
    expandedWrapper.style.display = "flex";
}

// Handle the closing/cleaning up for the expanded image
const handleCloseGalleryOrImage = () => {
    let expandedWrapper = document.getElementById("expandedWrapper");
    expandedWrapper.addEventListener("click", closer = (event) => {
        expandedWrapper.style.display = "none";
        handlePosterMovers(true);
    })
}

const goHome = () => {

}

// Called when a gallery tab is clicked, repopulates the gallery with images filtered by category
const filterGallery = (filterCategory) => {
    let filmSlidesGallery = document.getElementById("filmSlidesGallery");
    let figures = Array.from(filmSlidesGallery.getElementsByTagName("figure"));
    for (let i = 0; i < figures.length; i++) {
        let currentFig = figures[i];
        if (filterCategory == "allCategory") {
            currentFig.style.display = "block";
        } else if (currentFig.dataset.category == filterCategory) {
            currentFig.style.display = "block";
        } else {
            currentFig.style.display = "none";
        }
    }
}

// Poster interactive zooming and panning
const handlePosterMovers = (isHandling) => {
    let posterMover = document.getElementById("posterMover");
    // If true assigns the event listeners, if false removes listeners and resets scale for smooth transition back
    if (isHandling) {
        posterMover.addEventListener("mouseover", mouseoverEvent = () => { posterMover.style.transform = "scale(1.1,1.1)" });
        posterMover.addEventListener("mouseout", mouseoutEvent = () => { posterMover.style.transform = "scale(1,1)" });

        // Uses mousemove event to calculate horizontal and vertical position of the mouse relative to the posterWrapper element
        posterMover.addEventListener("mousemove", mousemoveEvent = (e) => { posterMover.style.transformOrigin = calculateTransformOrigin(e, posterMover) });
    } else {
        posterMover.removeEventListener("mouseover", mouseoverEvent);
        posterMover.removeEventListener("mouseout", mouseoutEvent);
        posterMover.removeEventListener("mousemove", mousemoveEvent);
        posterMover.style.transform = "scale(1,1)";
    }
}

// Shows/hides the index svg glows and selectable buttons
const handleIndexPaths = (isHandling, artifactsArray) => {
    let glowSVG = document.getElementById("indexGlow");
    if (isHandling) {
        let paths = document.getElementsByClassName("indexPathSelector");
        let allPathGlows = document.getElementsByClassName("indexPath");
        glowSVG.style.display = "block";

        // Path glow timer
        const timerFunc = () => {
            const endGlow = (e) => {
                // Check in case mouseover occurred during transition
                if (e.target.style.strokeOpacity != 1) {
                    e.target.style.strokeOpacity = 0;
                }
                e.target.removeEventListener("transitionend", endGlow);
            }

            for (let i = 0; i < allPathGlows.length; i++) {
                let pathGlow = allPathGlows[i];
                // If we are not already mousing over
                if (pathGlow.style.strokeOpacity != 1) {
                    pathGlow.addEventListener("transitionend", endGlow)
                    pathGlow.style.strokeOpacity = 0.5;
                }
            }
        }
        let glowTimer = setInterval(timerFunc, 6000);

        // Path selector logic
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let pathGlowClass = path.id + "Glow";
            let pathGlows = document.getElementsByClassName(pathGlowClass);
            path.addEventListener("click", () => {
                galleryButtonClick(path.id, artifactsArray)
            })
            path.addEventListener("mouseover", () => {
                for (let i = 0; i < pathGlows.length; i++) {
                    let pathGlow = pathGlows[i];
                    pathGlow.style.strokeOpacity = 1;
                }
            })
            path.addEventListener("mouseout", () => {
                for (let i = 0; i < pathGlows.length; i++) {
                    let pathGlow = pathGlows[i];
                    pathGlow.style.strokeOpacity = 0;
                }
            })
        }
    } else {
        glowSVG.style.display = "none";
    }
}

// Calculate transform of elements based on relative mouse position, to be called on mousemove
const calculateTransformOrigin = (ev, element) => {
    let trOrigin = ((ev.pageX - element.offsetLeft) / element.offsetWidth) * 100 + "% "
        + ((ev.pageY - element.offsetTop) / element.offsetHeight) * 100 + "%"
    return trOrigin;
}

window.onload = init;