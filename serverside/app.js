/**
 * Server-side nodejs code to build a json file based on the directory structure of the server
 * 
 * @author John Den Hartog
 */
const fs = require("fs");
const path = require("path");

const imgFolderPath = "../img/gallery";
const outputPath = "../include/artifacts.json"

let filesArray = [];

// Traverse server directory and add artifacts to filesArray
const traverseDirectory = (directory) => {
    let filesAndFolders = fs.readdirSync(directory);

    filesAndFolders.forEach(fileOrFolder => {
        let fullPath = path.join(directory, fileOrFolder);
        let fileOrFolderStats = fs.statSync(fullPath);

        if (fileOrFolderStats.isDirectory()) {
            // if directory, recursively traverse it
            traverseDirectory(fullPath);
        } else if (!fileOrFolder.includes(".jpg")) {
            // if file + not a fullsized img, create an object to represent it and place it in the filesArray
            let parentFolder = path.relative(imgFolderPath, directory);
            let galleryFolder = parentFolder.split("\\")[0];
            let categoryFolder = parentFolder.split("\\")[1];
            let title = fileOrFolder.split(".")[0].split("=")[0];
            // this is to allow us to use special character in filenames
            if (title.includes("[")) {
                title = title.replace("[qm]", "?");
                title = title.replace("[dq]", "\"");
                title = title.replace("[sl]", "/");
                title = title.replace("[co]", ":");
                title = title.replace("[as]", "\'");
                title = title.replace("[pe]", ".");
            }
            let tags = fileOrFolder.split(".")[0].split("=")[1];
            let artifactPath = "img/gallery/" + galleryFolder + "/" + categoryFolder + "/" + fileOrFolder;
            let file = {
                name: title,
                gallery: galleryFolder,
                category: categoryFolder,
                filePath: artifactPath,
                tags: tags,
            };
            filesArray.push(file);
        }
    });
}

console.log("Building a new JSON file.");
traverseDirectory(imgFolderPath);
fs.writeFileSync(outputPath, JSON.stringify({artifacts: filesArray}, null, 4));
process.exit();