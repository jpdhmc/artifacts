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
    handleIndexPaths(artifactsArray);
    handlePosterMovers(true);
    document.getElementById("homeButton").addEventListener("click", () => {
        goHome(artifactsArray);
    });
};

// Fetches artifacts json and creates Artifact objects
const generateArtifacts = () => {
    let artifactsArray = [];
    fetch("../include/artifacts.json")
        .then((response) => {
            return response.json();
        }).then((galleryJson) => {
            galleryJson.artifacts.forEach((jsonArtifact) => {
                const newArtifact = new Artifact(jsonArtifact.name, jsonArtifact.gallery, jsonArtifact.category, jsonArtifact.filePath, jsonArtifact.tags);
                artifactsArray.push(newArtifact);
            });
        });

    // Video files hosted on external websites
    fetch("../include/vidFiles.json")
        .then((response) => {
            return response.json();
        }).then((vidJson) => {
            vidJson.videos.forEach((vidFile) => {
                const newVidArtifact = new Artifact(vidFile.name, vidFile.gallery, vidFile.location, vidFile.link, vidFile.tags);
                artifactsArray.push(newVidArtifact);
            });
        });
    return artifactsArray;
};

// Transitions poster depending on selected gallery and calls its function
// TODO fix bug where you can click on a different button quickly before transition finishes
const galleryButtonClick = (selectedGallery, artifactsArray) => {
    const indexPoster = document.getElementById("indexPoster");
    const posterVideo = document.getElementById("posterVideo");
    const posterMover = document.getElementById("posterMover");
    const homeButton = document.getElementById("homeButton");


    let desiredArtifacts = [];
    artifactsArray.forEach((artifact) => {
        if (artifact.gallery == selectedGallery) {
            desiredArtifacts.push(artifact);
        }
    });

    posterVideo.src = "img/transitions/" + selectedGallery + "Transition.mp4";

    // Waits until poster scale transition finishes to trigger
    posterMover.addEventListener("transitionend", posterTransition = (e) => {
        if (e.target == posterMover) {
            posterMover.removeEventListener("transitionend", posterTransition);
            posterVideo.style.display = "block";

            // Onplay helps avoid a blank frame between image and video
            posterVideo.onplay = () => {
                indexPoster.style.display = "none";
                indexPoster.src = "img/stills/" + selectedGallery + "Still.jpg";

                // Hide svg glow
                showIndexPaths(false);
            };

            posterVideo.onended = () => {
                indexPoster.style.display = "block";
                posterVideo.style.display = "none";
                homeButton.style.display = "block";

                switch (selectedGallery) {
                    case "filmSlides":
                        displayFilmSlidesGallery(desiredArtifacts);
                        break;
                    case "vhs":
                        displayVhsGallery(desiredArtifacts);
                        break;
                    case "printedMedia":
                        displayPrintedMediaGallery(desiredArtifacts);
                        break;
                    case "cassettes":
                        displayCassettesGallery(desiredArtifacts);
                        break;
                    case "tapes":
                        displayTapesGallery(desiredArtifacts);
                }
            };
        }
    }
    );
    handlePosterMovers(false);
};

// Build and display the film slides gallery
const displayFilmSlidesGallery = (artifactsArray) => {
    const filmSlidesGallery = document.getElementById("filmSlidesGallery");
    const filmSlidesGalleryWrapper = document.getElementById("galleryWrapper");

    const categoryButtons = document.createElement("div");
    categoryButtons.classList.add("categoryButtons", "temp");
    let categoryList = [];

    filmSlidesGalleryWrapper.appendChild(categoryButtons);
    filmSlidesGallery.style.display = "flex";
    filmSlidesGalleryWrapper.style.display = "flex";

    // Create the button for removing gallery filtering
    const allCategory = document.createElement("button");
    allCategory.classList.add("tabButton", "tabButtonActive");
    allCategory.id = "allCategory";
    allCategory.innerHTML = "All Categories";
    categoryButtons.appendChild(allCategory);
    allCategory.addEventListener("click", () => {
        tabButtons = Array.from(categoryButtons.getElementsByTagName("button"));
        tabButtons.forEach((tabButton) => {
            tabButton.classList = "tabButton";
        });
        allCategory.className = "tabButton tabButtonActive";
        filterGallery("allCategory", filmSlidesGallery);
    });


    artifactsArray.forEach((galleryObject) => {
        let imgCategory = galleryObject.category;
        let imgPath = galleryObject.filePath;
        let imgName = galleryObject.name;

        // Populate gallery with figures for all images
        let newFigure = document.createElement("figure");
        let newFigCaption = document.createElement("figcaption");
        let newImg = document.createElement("img");
        newImg.src = imgPath;
        newFigure.dataset.category = imgCategory;
        newFigure.classList.add("temp");
        newFigCaption.innerHTML = imgName;

        newFigure.appendChild(newImg);
        newFigure.appendChild(newFigCaption);
        filmSlidesGallery.appendChild(newFigure);
        newImg.addEventListener("click", () => {
            expandImage(newFigure);
        });

        // Build category tabs
        if (!categoryList.includes(imgCategory)) {
            categoryList.push(imgCategory);
            let newCategory = document.createElement("button");
            newCategory.className = "tabButton";
            newCategory.id = imgCategory;
            newCategory.innerHTML = imgCategory;
            categoryButtons.appendChild(newCategory);
            newCategory.addEventListener("click", () => {
                tabButtons = Array.from(categoryButtons.getElementsByTagName("button"));
                tabButtons.forEach((tabButton) => {
                    tabButton.classList = "tabButton";
                });
                newCategory.className = "tabButton tabButtonActive";
                filterGallery(newCategory.id, filmSlidesGallery);
            });
        }
    });
};

// Build and display the vhs gallery
const displayVhsGallery = (artifactsArray) => {
    const vhsGallery = document.getElementById("vhsGallery");
    const galleryWrapper = document.getElementById("galleryWrapper");
    const vhsFrame = document.createElement("iframe");
    vhsFrame.id = "vhsFrame";
    vhsFrame.classList.add("temp");
    vhsGallery.appendChild(vhsFrame);

    const vhsButtons = document.createElement("div");
    vhsButtons.classList.add("rightButtons", "temp");
    galleryWrapper.appendChild(vhsButtons);

    artifactsArray.forEach((videoArtifact) => {
        let vhsIconWrapper = document.createElement("div");

        let vhsIcon = document.createElement("img");
        let vhsName = document.createElement("div");
        vhsIconWrapper.appendChild(vhsIcon);
        vhsIconWrapper.appendChild(vhsName);
        vhsIcon.src = "img/icon/vhsIconClosed.png";
        vhsIconWrapper.classList.add("vhsIconWrapper", "temp");
        vhsIcon.classList.add("vhsIcon", "temp");
        vhsName.classList.add("vhsText", "temp");
        vhsName.innerHTML = videoArtifact.name + "<br>" + videoArtifact.category;

        vhsIconWrapper.addEventListener("click", () => {
            vhsFrame.src = videoArtifact.filePath;
        });

        vhsButtons.appendChild(vhsIconWrapper);
    });
    galleryWrapper.style.display = "flex";
    vhsGallery.style.display = "flex";
};

// Build and display the 3 in tapes gallery
const displayTapesGallery = (artifactsArray) => {
    const tapesGallery = document.getElementById("tapesGallery");
    const galleryWrapper = document.getElementById("galleryWrapper");
    const playerButton = document.getElementById("playerButton");
    const volumeButton = document.getElementById("volumeButton");
    const playerTimeline = document.getElementById("timeline");
    const tapesAudio = document.getElementById("tapesAudio");
    const tapesImagesGallery = document.getElementById("tapesImages");
    const volumeSlider = document.getElementById("volumeSlider");
    let audioTimeInterval;

    galleryWrapper.style.display = "flex";
    tapesGallery.style.display = "flex";

    const tapesButtons = document.createElement("div");
    tapesButtons.classList.add("rightButtons", "temp");
    galleryWrapper.appendChild(tapesButtons);

    artifactsArray.filter((artifact) => artifact.category === "tapesAudio").forEach((artifact) => {
        let tapeIcon = document.createElement("img");
        tapeIcon.src = "img/icon/tapes/" + artifact.name + ".png";
        tapeIcon.classList.add("tapeIcon", "temp");
        tapeIcon.addEventListener("click", () => {
            if (document.getElementById("tapesCaption") != null) {
                document.getElementById("tapesCaption").remove();
            }
            const audioPlayer = document.getElementById("audioPlayer");
            const tapesCaption = document.createElement("span");
            tapesCaption.innerHTML = artifact.name;
            tapesCaption.id = "tapesCaption";
            tapesCaption.classList.add("temp");
            audioPlayer.appendChild(tapesCaption);

            tapesAudio.src = artifact.filePath;
            tapesImagesGallery.innerHTML = "";
            // get images to display in secondary gallery if tags matching
            let selectedTapesImages = artifactsArray.filter((imageArtifact) => imageArtifact.category === "tapesImages" && imageArtifact.tags === artifact.tags);
            selectedTapesImages.forEach((tapesImage) => {
                let newFigure = document.createElement("figure");
                let newFigCaption = document.createElement("figcaption");
                let newImg = document.createElement("img");
                newImg.src = tapesImage.filePath;
                newFigure.classList.add("temp");
                newFigCaption.innerHTML = tapesImage.name;
                newFigure.appendChild(newImg);
                newFigure.appendChild(newFigCaption);
                newImg.addEventListener("click", () => {
                    expandImage(newFigure);
                });
                tapesImagesGallery.appendChild(newFigure);
            });
        });
        tapesButtons.appendChild(tapeIcon);
    });

    // Play/pause
    playerButton.addEventListener("click", () => {
        if (tapesAudio.paused) {
            tapesAudio.play();
            // TODO change to pause icon - maybe just depressed/undepressed svg button to sell the tape recorder feel
            audioTimeInterval = setInterval(setTapesAudio, 80);

        } else {
            tapesAudio.pause();
            // change to play icon
            clearInterval(audioTimeInterval);
        }
    });
    tapesAudio.onended = () => {
        // change to pause icon
    };

    // Volume
    volumeSlider.addEventListener("change", () => {
        volumeValue = volumeSlider.value / 100;
        tapesAudio.volume = volumeValue;
    });
    volumeButton.addEventListener("mouseover", () => {
        // TODO this - expand slider out on mouse over
        volumeSlider.style.width = "20%";
    });

    // Handles the timeline and svgs depending on audio time
    const setTapesAudio = () => {
        const reelSvgStart = document.getElementById("reelSvgStart");
        const reelSvgEnd = document.getElementById("reelSvgEnd");
        const reelCircleStart = document.getElementById("reelCircleStart");
        const reelCircleEnd = document.getElementById("reelCircleEnd");
        let percentage = (100 * tapesAudio.currentTime) / tapesAudio.duration;
        if (isNaN(percentage)) {
            percentage = 0;
        }
        playerTimeline.style.backgroundSize = percentage + "% 100%";
        playerTimeline.value = percentage;

        let angle = 360 * (percentage * -0.04);
        let rotation = "rotate(" + angle + ")";
        // set radius using a sliding scale where 0% is 37 and 100% is 79
        let endRadius = 0.6 * percentage + 37;
        let startRadius = 79 - (endRadius - 37);

        reelSvgStart.setAttribute("transform", rotation);
        reelCircleStart.setAttribute("r", startRadius);
        reelSvgEnd.setAttribute("transform", rotation);
        reelCircleEnd.setAttribute("r", endRadius);
    };

    playerTimeline.addEventListener("change", () => {
        let time = (playerTimeline.value * tapesAudio.duration) / 100;
        tapesAudio.currentTime = time;
    });

    playerTimeline.addEventListener("mousedown", () => {
        tapesAudio.pause();
        clearInterval(audioTimeInterval);
    });

    playerTimeline.addEventListener("mouseup", () => {
        tapesAudio.play();
        audioTimeInterval = setInterval(setTapesAudio, 80);
    });
};

// Called when an image in the gallery is clicked, displays the full size image 
// TODO Maybe make it so this can handle img and video depending on whats passed to it
const expandImage = (selectedFigure) => {
    const expandedWrapper = document.getElementById("expandedWrapper");
    const expandedFigure = document.getElementById("expandedFigure");
    expandedFigure.innerHTML = selectedFigure.innerHTML;
    expandedWrapper.style.display = "flex";
    handleCloseExpandedWrapper();
};

// Handle the closing/cleaning up for the expanded image
const handleCloseExpandedWrapper = () => {
    const expandedWrapper = document.getElementById("expandedWrapper");
    expandedWrapper.addEventListener("click", closer = (event) => {
        expandedWrapper.style.display = "none";
    });
};

// Delete temp gallery elements that are created when one is selected and return to index
const goHome = (artifactsArray) => {
    const galleryWrapper = document.getElementById("galleryWrapper");
    const indexPoster = document.getElementById("indexPoster");
    const posterWrapper = document.getElementById("posterWrapper");
    const homeButton = document.getElementById("homeButton");
    const expandedWrapper = document.getElementById("expandedWrapper");
    const galleryElements = document.querySelectorAll(".gallery");
    let tempElements = document.querySelectorAll(".temp");
    expandedWrapper.style.display = "none";
    handlePosterMovers(false);
    handlePosterMovers(true);
    showIndexPaths(true);

    posterWrapper.addEventListener("transitionend", fadeTransition = (e) => {
        if (e.target == posterWrapper) {
            posterWrapper.removeEventListener("transitionend", fadeTransition);
            homeButton.style.display = "none";

            indexPoster.addEventListener("load", imgLoad = (e) => {
                if (e.target == indexPoster) {
                    for (i = 0; i < tempElements.length; i++) {
                        tempElements[i].remove();
                    }
                    for (i = 0; i < galleryElements.length; i++) {
                        galleryElements[i].style.display = "none";
                    }
                    galleryWrapper.style.display = "none";
                    posterWrapper.style.opacity = 1;
                }
            });
            indexPoster.src = "img/stills/deskStill.jpg";
        }
    });
    posterWrapper.style.opacity = 0;
};

// Called when a gallery tab is clicked, repopulates the gallery with images filtered by category
const filterGallery = (filterCategory, currentGallery) => {
    let figures = Array.from(currentGallery.getElementsByTagName("figure"));
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
};

// Poster interactive zooming and panning
const handlePosterMovers = (isHandling) => {
    const posterMover = document.getElementById("posterMover");
    // If true assigns the event listeners, if false removes listeners and resets scale for smooth transition back
    if (isHandling) {
        posterMover.addEventListener("mouseover", mouseoverEvent = () => {
            posterMover.style.transform = "scale(1.1,1.1)";
        });
        posterMover.addEventListener("mouseout", mouseoutEvent = () => {
            posterMover.style.transform = "scale(1,1)";
        });

        // Uses mousemove event to calculate horizontal and vertical position of the mouse relative to the posterWrapper element
        posterMover.addEventListener("mousemove", mousemoveEvent = (e) => {
            posterMover.style.transformOrigin = calculateTransformOrigin(e, posterMover);
        });
    } else {
        posterMover.removeEventListener("mouseover", mouseoverEvent);
        posterMover.removeEventListener("mouseout", mouseoutEvent);
        posterMover.removeEventListener("mousemove", mousemoveEvent);
        posterMover.style.transform = "scale(1,1)";
    }
};

// Shows/hides the index svg glows and selectable buttons
const handleIndexPaths = (artifactsArray) => {
    const glowSVG = document.getElementById("indexGlow");
    const paths = document.getElementsByClassName("indexPathSelector");
    const allPathGlows = document.getElementsByClassName("indexPath");
    glowSVG.style.display = "block";

    // Path glow timer
    const timerFunc = () => {
        const endGlow = (e) => {
            // Check in case mouseover occurred during transition
            if (e.target.style.strokeOpacity != 1) {
                e.target.style.strokeOpacity = 0;
            }
            e.target.removeEventListener("transitionend", endGlow);
        };

        for (let i = 0; i < allPathGlows.length; i++) {
            let pathGlow = allPathGlows[i];
            // If we are not already mousing over
            if (pathGlow.style.strokeOpacity != 1) {
                pathGlow.addEventListener("transitionend", endGlow);
                pathGlow.style.strokeOpacity = 0.5;
            }
        }
    };
    let glowTimer = setInterval(timerFunc, 6000);

    // Path selector logic
    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let pathGlowClass = path.id + "Glow";
        let pathGlows = document.getElementsByClassName(pathGlowClass);
        path.addEventListener("click", () => {
            galleryButtonClick(path.id, artifactsArray);
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
}

// Show or hide index glows
const showIndexPaths = (showing) => {
    const glowSVG = document.getElementById("indexGlow");
    const allPathGlows = document.getElementsByClassName("indexPath");
    if (showing) {
        for (let i = 0; i < allPathGlows.length; i++) {
            allPathGlows[i].style.strokeOpacity = 0;
        }
        glowSVG.style.display = "block";
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