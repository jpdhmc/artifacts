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
    document.getElementById("rightButtons").addEventListener("mouseover", toggleSidebar);
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
            showIndexPaths(false);
            galleryButtonClick(path.id, artifactsArray);
        });
        path.addEventListener("mouseover", () => {
            for (let i = 0; i < pathGlows.length; i++) {
                let pathGlow = pathGlows[i];
                pathGlow.style.strokeOpacity = 1;
            }
        });
        path.addEventListener("mouseout", () => {
            for (let i = 0; i < pathGlows.length; i++) {
                let pathGlow = pathGlows[i];
                pathGlow.style.strokeOpacity = 0;
            }
        });
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

    // Calculate transform of elements based on relative mouse position, to be called on mousemove
    const calculateTransformOrigin = (ev, element) => {
        let trOrigin = ((ev.pageX - element.offsetLeft) / element.offsetWidth) * 100 + "% "
            + ((ev.pageY - element.offsetTop) / element.offsetHeight) * 100 + "%";
        return trOrigin;
    };
};

// Delete temp gallery elements that are created when one is selected and return to index
const goHome = (artifactsArray) => {
    const galleryWrapper = document.getElementById("galleryWrapper");
    const indexPoster = document.getElementById("indexPoster");
    const posterWrapper = document.getElementById("posterWrapper");
    const homeButton = document.getElementById("homeButton");
    const expandedWrapper = document.getElementById("expandedWrapper");
    const galleryElements = document.querySelectorAll(".gallery");
    const rightButtons = document.getElementById("rightButtons");
    const audioElements = document.querySelectorAll("audio");
    const tempElements = document.querySelectorAll(".temp");
    const playerButtons = document.querySelectorAll(".playerButton")
    const scrollIndicator = document.getElementById("scrollIndicator");
    expandedWrapper.style.display = "none";
    scrollIndicator.style.display = "none";
    scrollIndicator.style.left = "initial";
    handlePosterMovers(false);
    handlePosterMovers(true);
    showIndexPaths(true);

    posterWrapper.addEventListener("transitionend", fadeTransition = (e) => {
        if (e.target == posterWrapper) {
            posterWrapper.removeEventListener("transitionend", fadeTransition);
            homeButton.style.display = "none";

            indexPoster.addEventListener("load", imgLoad = (e) => {
                if (e.target == indexPoster) {
                    for (let i = 0; i < tempElements.length; i++) {
                        tempElements[i].remove();
                    }
                    for (let i = 0; i < audioElements.length; i++) {
                        audioElements[i].pause();
                        audioElements[i].src = "";
                    }
                    for (let i = 0; i < playerButtons.length; i++) {
                        try {
                            playerButtons[i].removeEventListener("click", playAudio);
                        } catch (error) {
                            console.error("playaudio not initialized yet");
                        }
                    }
                    for (let i = 0; i < galleryElements.length; i++) {
                        galleryElements[i].style.display = "none";
                    }
                    galleryWrapper.style.display = "none";
                    rightButtons.style.display = "none";
                    posterWrapper.style.opacity = 1;
                }
            });
            indexPoster.src = "img/stills/deskStill.jpg";
        }
    });
    posterWrapper.style.opacity = 0;
};

// Open/close the right button menu
const toggleSidebar = () => {
    const rightButtons = document.getElementById("rightButtons");
    const toggleRightButtons = document.getElementById("toggleRightButtons");
    toggleRightButtons.style.animation = "initial";
    toggleRightButtons.style.right = "18vw";
    rightButtons.style.animation = "initial";
    rightButtons.style.left = "0vw";
    rightButtons.addEventListener("mouseleave", leaveButtons = () => {
        toggleRightButtons.style.right = "0vw";
        rightButtons.style.left = "18vw";
        rightButtons.removeEventListener("mouseleave", leaveButtons);
    });
};

// Show or hide index glows
const showIndexPaths = (showing) => {
    const glowSVG = document.getElementById("indexGlow");
    const allPathGlows = document.getElementsByClassName("indexPath");
    const pathSelectors = document.getElementsByClassName("indexPathSelector");
    if (showing) {
        for (let i = 0; i < pathSelectors.length; i++) {
            pathSelectors[i].style.display = "initial";
        }
        for (let i = 0; i < allPathGlows.length; i++) {
            allPathGlows[i].style.strokeOpacity = 0;
        }
        glowSVG.style.display = "block";
    } else {
        for (let i = 0; i < pathSelectors.length; i++) {
            pathSelectors[i].style.display = "none";
        }
        glowSVG.style.display = "none";
    }
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
                    case "printed":
                        displayPrintedGallery(desiredArtifacts);
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
    const filmSlidesButtons = document.getElementById("rightButtons");
    const scrollIndicator = document.getElementById("scrollIndicator");
    let categoryList = [];

    filmSlidesButtons.style.display = "flex";
    filmSlidesGallery.style.display = "flex";
    filmSlidesGalleryWrapper.style.display = "flex";
    scrollIndicator.style.display = "block";

    // Create button for filtering by all categories
    const allCategoryWrapper = document.createElement("div");
    const allCategoryName = document.createElement("div");
    const allCategoryIcon = document.createElement("img");
    
    allCategoryWrapper.classList.add("iconWrapper", "temp");
    allCategoryIcon.classList.add("iconImg", "temp");
    allCategoryName.classList.add("iconText", "slidesIconText", "temp");
    allCategoryIcon.src = "img/icon/slidesBox.png";
    allCategoryName.innerHTML = "All Categories";
    allCategoryWrapper.appendChild(allCategoryIcon);
    allCategoryWrapper.appendChild(allCategoryName);
    allCategoryWrapper.addEventListener("click", () => {
        filterGallery("allCategory", filmSlidesGallery);
        scrollIndicator.style.display = "block";
    });
    allCategoryWrapper.addEventListener("mouseover", () => {
        allCategoryIcon.src = "img/icon/slidesBoxOpen.png"
    });
    allCategoryWrapper.addEventListener("mouseout", () => {
        allCategoryIcon.src = "img/icon/slidesBox.png";
    });
    
    filmSlidesButtons.appendChild(allCategoryWrapper);


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
            expandImage(galleryObject);
        });

        // Create buttons for filtering by category
        if (!categoryList.includes(imgCategory)) {
            let newCategoryWrapper = document.createElement("div");
            let newCategoryName = document.createElement("div");
            let newCategoryIcon = document.createElement("img");
            newCategoryWrapper.classList.add("iconWrapper", "temp")
            newCategoryIcon.classList.add("iconImg", "temp");
            newCategoryName.classList.add("iconText", "slidesIconText", "temp");
            newCategoryIcon.src = "img/icon/slidesBox.png";
            newCategoryName.innerHTML = imgCategory;
            newCategoryWrapper.appendChild(newCategoryIcon);
            newCategoryWrapper.appendChild(newCategoryName);
            newCategoryWrapper.addEventListener("click", () => {
                filterGallery(imgCategory, filmSlidesGallery);
            });
            newCategoryWrapper.addEventListener("mouseover", () => {
                newCategoryIcon.src = "img/icon/slidesBoxOpen.png"
            });
            newCategoryWrapper.addEventListener("mouseout", () => {
                newCategoryIcon.src = "img/icon/slidesBox.png";
            });
            filmSlidesButtons.appendChild(newCategoryWrapper);
            categoryList.push(imgCategory);
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

    const vhsButtons = document.getElementById("rightButtons");

    artifactsArray.forEach((videoArtifact) => {
        let vhsIconWrapper = document.createElement("div");

        let vhsIcon = document.createElement("img");
        let vhsName = document.createElement("div");
        vhsIconWrapper.appendChild(vhsIcon);
        vhsIconWrapper.appendChild(vhsName);
        vhsIcon.src = "img/icon/vhsIconClosed.png";
        vhsIconWrapper.classList.add("iconWrapper", "temp");
        vhsIcon.classList.add("iconImg", "temp");
        vhsName.classList.add("iconText", "vhsIconText", "temp");
        vhsName.innerHTML = videoArtifact.name + "<br>" + videoArtifact.category;
        vhsIconWrapper.addEventListener("click", () => {
            vhsFrame.src = videoArtifact.filePath;
        });
        vhsIconWrapper.addEventListener("mouseover", () => {
            vhsIcon.src = "img/icon/vhsIconOpen.png"
        });
        vhsIconWrapper.addEventListener("mouseout", () => {
            vhsIcon.src = "img/icon/vhsIconClosed.png"
        });
        vhsButtons.appendChild(vhsIconWrapper);
    });
    galleryWrapper.style.display = "flex";
    vhsGallery.style.display = "flex";
    vhsButtons.style.display = "flex";
};

// Build and display the 3 in tapes gallery
const displayTapesGallery = (artifactsArray) => {
    const tapesGallery = document.getElementById("tapesGallery");
    const galleryWrapper = document.getElementById("galleryWrapper");
    const playerButton = document.getElementById("tapesPlayerButton");
    const volumeButton = document.getElementById("tapesVolumeButton");
    const playerTimeline = document.getElementById("tapesTimeline");
    const tapesAudio = document.getElementById("tapesAudio");
    const tapesImagesGallery = document.getElementById("tapesImages");
    const volumeSlider = document.getElementById("tapesVolumeSlider");
    const tapesButtons = document.getElementById("rightButtons");
    let audioTimeInterval;

    galleryWrapper.style.display = "flex";
    tapesGallery.style.display = "flex";
    tapesButtons.style.display = "flex";

    artifactsArray.filter((artifact) => artifact.category === "tapesAudio").forEach((artifact) => {
        let tapeIconWrapper = document.createElement("div");
        let tapeIcon = document.createElement("img");
        let tapeName = document.createElement("div");
        tapeIconWrapper.appendChild(tapeIcon);
        tapeIconWrapper.appendChild(tapeName);
        tapeIcon.src = "img/icon/tapes/" + artifact.name +".png";
        tapeIconWrapper.classList.add("iconWrapper", "tapeIconWrapper", "temp");
        tapeIcon.classList.add("iconImg", "temp");
        tapeName.classList.add("iconText", "tapeIconText", "temp");
        tapeName.innerHTML = artifact.name;
        tapeIconWrapper.addEventListener("click", () => {
            if (document.getElementById("tapesCaption") != null) {
                document.getElementById("tapesCaption").remove();
            }
            const audioPlayer = document.getElementById("tapesAudioPlayer");
            const tapesCaption = document.createElement("span");
            tapesCaption.innerHTML = artifact.name;
            tapesCaption.id = "tapesCaption";
            tapesCaption.classList.add("temp");
            audioPlayer.appendChild(tapesCaption);

            tapesAudio.src = artifact.filePath;
            tapesImagesGallery.innerHTML = "";

            // get images to display in secondary gallery if tags matching
            let selectedTapesImages = artifactsArray.filter((imageArtifact) => imageArtifact.category === "tapesImages" && imageArtifact.tags.includes(artifact.tags));
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
                    expandImage(tapesImage);
                });
                tapesImagesGallery.appendChild(newFigure);
            });
        });
        tapesButtons.appendChild(tapeIconWrapper);
    });

    // Play/pause
    playerButton.addEventListener("click", playAudio = () => {
        const tapesKnob = document.getElementById("tapesKnob");
        const tapesKnobMark = document.getElementById("tapesKnobMark");
        if (tapesAudio.paused && tapesAudio.readyState == 4) {
            tapesAudio.play();
            tapesKnob.setAttribute("transform", "rotate(60, 171, 100)");
            tapesKnobMark.setAttribute("transform", "rotate(60, 171, 100)");
            audioTimeInterval = setInterval(setTapesAudio, 40);

        } else {
            tapesAudio.pause();
            tapesKnob.setAttribute("transform", "rotate(0, 171, 100)");
            tapesKnobMark.setAttribute("transform", "rotate(0, 171, 100)");
            clearInterval(audioTimeInterval);
        }
    });
    tapesAudio.onended = () => {
        tapesKnob.setAttribute("transform", "rotate(0, 171, 100)");
        tapesKnobMark.setAttribute("transform", "rotate(0, 171, 100)");
        clearInterval(audioTimeInterval);
    };

    // Volume
    volumeSlider.addEventListener("change", () => {
        let volumeValue = volumeSlider.value / 100;
        tapesAudio.volume = volumeValue;
    });
    volumeButton.addEventListener("mouseover", () => {
        // TODO this - expand slider out on mouse over
    });

    // Handles the timeline and svgs depending on audio time
    const setTapesAudio = () => {
        const reelSvgStart = document.getElementById("tapesReelSvgStart");
        const reelSvgEnd = document.getElementById("tapesReelSvgEnd");
        const reelCircleStart = document.getElementById("tapesReelCircleStart");
        const reelCircleEnd = document.getElementById("tapesReelCircleEnd");
        let percentage = (100 * tapesAudio.currentTime) / tapesAudio.duration;
        if (isNaN(percentage)) {
            percentage = 0;
        }
        playerTimeline.style.backgroundSize = percentage + "% 100%";
        playerTimeline.value = percentage;

        let angle = 360 * (percentage * -0.32);
        let rotation = "rotate(" + angle + ")";
        // set radius using a sliding scale where 0% is 37 and 100% is 79
        let endRadius = 0.42 * percentage + 37;
        let startRadius = 79 - (0.42 * percentage);

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
        audioTimeInterval = setInterval(setTapesAudio, 40);
    });
};

// Build and display the cassettes gallery
const displayCassettesGallery = (artifactsArray) => {
    const cassettesGallery = document.getElementById("cassettesGallery");
    const galleryWrapper = document.getElementById("galleryWrapper");
    const playerButton = document.getElementById("cassettesPlayerButton");
    const volumeButton = document.getElementById("cassettesVolumeButton");
    const playerTimeline = document.getElementById("cassettesTimeline");
    const cassettesAudio = document.getElementById("cassettesAudio");
    const cassettesImagesGallery = document.getElementById("cassettesImages");
    const volumeSlider = document.getElementById("cassettesVolumeSlider");
    const cassettesButtons = document.getElementById("rightButtons");
    let audioTimeInterval;

    galleryWrapper.style.display = "flex";
    cassettesGallery.style.display = "flex";
    cassettesButtons.style.display = "flex";

    artifactsArray.filter((artifact) => artifact.category === "cassettesAudio").forEach((artifact) => {
        let cassettesIcon = document.createElement("img");
        cassettesIcon.src = "img/icon/cassettes/" + artifact.name + ".png";
        cassettesIcon.classList.add("cassettesIcon", "temp");
        cassettesIcon.addEventListener("click", () => {
            if (document.getElementById("cassettesCaption") != null) {
                document.getElementById("cassettesCaption").remove();
            }
            const audioPlayer = document.getElementById("cassettesAudioPlayer");
            const cassettesCaption = document.createElement("span");
            cassettesCaption.innerHTML = artifact.name;
            cassettesCaption.id = "cassettesCaption";
            cassettesCaption.classList.add("temp");
            audioPlayer.appendChild(cassettesCaption);
            cassettesAudio.src = artifact.filePath;
            cassettesImagesGallery.innerHTML = "";

            // Get images to display in secondary gallery if tags matching
            let selectedCassettesImages = artifactsArray.filter((imageArtifact) => imageArtifact.category === "cassettesImages" && imageArtifact.tags.includes(artifact.tags));
            selectedCassettesImages.forEach((cassettesImage) => {
                let newFigure = document.createElement("figure");
                let newFigCaption = document.createElement("figcaption");
                let newImg = document.createElement("img");
                newImg.src = cassettesImage.filePath;
                newFigure.classList.add("temp");
                newFigCaption.innerHTML = cassettesImage.name;
                newFigure.appendChild(newImg);
                newFigure.appendChild(newFigCaption);
                newImg.addEventListener("click", () => {
                    expandImage(cassettesImage);
                });
                cassettesImagesGallery.appendChild(newFigure);
            });
        });
        cassettesButtons.appendChild(cassettesIcon);
    });

    // Play/pause
    playerButton.addEventListener("click", playAudio = () => {
        if (cassettesAudio.paused && cassettesAudio.readyState == 4) {
            cassettesAudio.play();
            audioTimeInterval = setInterval(setCassettesAudio, 80);
        } else {
            cassettesAudio.pause();
            // change to play icon
            clearInterval(audioTimeInterval);
        }
    });
    cassettesAudio.onended = () => {
        // change to pause icon
    };

    // Volume
    volumeSlider.addEventListener("change", () => {
        let volumeValue = volumeSlider.value / 100;
        cassettesAudio.volume = volumeValue;
    });

    // Handles the timeline and svgs depending on audio time
    const setCassettesAudio = () => {
        const reelSvgStart = document.getElementById("cassettesReelSvgStart");
        const reelSvgEnd = document.getElementById("cassettesReelSvgEnd");
        const reelCircleStart = document.getElementById("cassettesReelCircleStart");
        const reelCircleEnd = document.getElementById("cassettesReelCircleEnd");
        let percentage = (100 * cassettesAudio.currentTime) / cassettesAudio.duration;
        if (isNaN(percentage)) {
            percentage = 0;
        }
        playerTimeline.style.backgroundSize = percentage + "% 100%";
        playerTimeline.value = percentage;

        let angle = 360 * (percentage * -0.04);
        let rotation = "rotate(" + angle + ")";
        // set radius using a sliding scale where 0% is 37 and 100% is 79
        let endRadius = 0.42 * percentage + 37;
        let startRadius = 79 - (0.42 * percentage);

        reelSvgStart.setAttribute("transform", rotation);
        reelCircleStart.setAttribute("r", startRadius);
        reelSvgEnd.setAttribute("transform", rotation);
        reelCircleEnd.setAttribute("r", endRadius);
    };

    playerTimeline.addEventListener("change", () => {
        let time = (playerTimeline.value * cassettesAudio.duration) / 100;
        cassettesAudio.currentTime = time;
    });

    playerTimeline.addEventListener("mousedown", () => {
        cassettesAudio.pause();
        clearInterval(audioTimeInterval);
    });

    playerTimeline.addEventListener("mouseup", () => {
        cassettesAudio.play();
        audioTimeInterval = setInterval(setCassettesAudio, 80);
    });
};

// Build and display the printed media gallery
const displayPrintedGallery = (artifactsArray) => {
    const printedButtons = document.getElementById("rightButtons");
    const galleryWrapper = document.getElementById("galleryWrapper");
    const printedGallery = document.getElementById("printedGallery");
    const scrollIndicator = document.getElementById("scrollIndicator");
    let categoryList = [];

    galleryWrapper.style.display = "flex";
    printedGallery.style.display = "flex";
    printedButtons.style.display = "flex";
    scrollIndicator.style.display = "block";
    scrollIndicator.style.left = "38%";

    // Create button for filtering by all categories
    const allCategoryWrapper = document.createElement("div");
    const allCategoryName = document.createElement("div");
    const allCategoryIcon = document.createElement("img");
    allCategoryWrapper.classList.add("iconWrapper", "temp");
    allCategoryIcon.classList.add("iconImg", "temp");
    allCategoryName.classList.add("iconText", "printedIconText", "temp");
    allCategoryIcon.src = "img/icon/folderIcon.png";
    allCategoryName.innerHTML = "All Categories";
    allCategoryWrapper.appendChild(allCategoryIcon);
    allCategoryWrapper.appendChild(allCategoryName);
    allCategoryWrapper.addEventListener("click", () => {
        filterGallery("allCategory", printedGallery);
        scrollIndicator.style.display = "block";
    });
    printedButtons.appendChild(allCategoryWrapper);


    artifactsArray.forEach((printedArtifact) => {
        let imgCategory = printedArtifact.category;
        let imgPath = printedArtifact.filePath;
        let imgName = printedArtifact.name;

        // Populate gallery with figures for all images
        let newFigure = document.createElement("figure");
        let newFigCaption = document.createElement("figcaption");
        let newImg = document.createElement("img");
        newFigure.dataset.category = imgCategory;
        newFigure.classList.add("printedFigure", "temp");
        newImg.src = imgPath;
        newFigCaption.innerHTML = imgName;

        newFigure.appendChild(newImg);
        newFigure.appendChild(newFigCaption);
        printedGallery.appendChild(newFigure);
        newFigure.addEventListener("click", () => {
            expandImage(printedArtifact);
        });

        // Create buttons for filtering by category
        if (!categoryList.includes(imgCategory)) {
            let newCategoryWrapper = document.createElement("div");
            let newCategoryName = document.createElement("div");
            let newCategoryIcon = document.createElement("img");
            newCategoryWrapper.classList.add("iconWrapper", "temp")
            newCategoryIcon.classList.add("iconImg", "temp");
            newCategoryName.classList.add("iconText", "printedIconText", "temp");
            newCategoryIcon.src = "img/icon/folderIcon.png";
            newCategoryName.innerHTML = imgCategory;
            newCategoryWrapper.appendChild(newCategoryIcon);
            newCategoryWrapper.appendChild(newCategoryName);
            newCategoryWrapper.addEventListener("click", () => {
                filterGallery(imgCategory, printedGallery);
            });
            printedButtons.appendChild(newCategoryWrapper);
            categoryList.push(imgCategory);
        }
    });

};

// Called when an image in the gallery is clicked, displays the full size image (jpg)
const expandImage = (selectedArtifact) => {
    const expandedWrapper = document.getElementById("expandedWrapper");
    const expandedImg = document.getElementById("expandedImg");
    const expandedCaption = document.getElementById("expandedCaption")
    let expandedFilepath = selectedArtifact.filePath.split(".")[0].split("=")[0] + ".jpg";
    console.log(expandedFilepath);

    expandedImg.src = expandedFilepath;
    expandedCaption.innerHTML = selectedArtifact.name;
    expandedWrapper.style.display = "flex";
    expandedWrapper.addEventListener("click", closer = (event) => {
        expandedWrapper.style.display = "none";
        expandedWrapper.removeEventListener("click", closer);
    });
};

// Called when a gallery tab is clicked, repopulates the gallery with images filtered by category
const filterGallery = (filterCategory, currentGallery) => {
    const scrollIndicator = document.getElementById("scrollIndicator");
    scrollIndicator.style.display = "none";
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
    if (currentGallery.scrollHeight > currentGallery.clientHeight) {
        scrollIndicator.style.display = "block";
    } else {
        scrollIndicator.style.display = "none";
    }
};

window.onload = init;