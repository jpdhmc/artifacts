/**
 * Server-side code
 * 
 * @author John Den Hartog
 */
const fs = require("fs");
const path = require("path");

const imgFolderPath = "../img";
const outputPath = "../include/imgFiles.json"

let filesArray = [];

// Traverse server directory and add images to filesArray
const traverseDirectory = (directory) => {
    let filesAndFolders = fs.readdirSync(directory);

    filesAndFolders.forEach(fileOrFolder => {
        let fullPath = path.join(directory, fileOrFolder);
        let fileOrFolderStats = fs.statSync(fullPath);

        if (fileOrFolderStats.isDirectory()) {
            // if directory, recursively traverse it
            traverseDirectory(fullPath);
        } else {
            // if file, create an object to represent it and place it in the filesArray
            let parentFolder = path.relative(imgFolderPath, directory);
            let file = {
                name: fileOrFolder,
                category: parentFolder,
            };
            filesArray.push(file);
        }
    });
}

console.log("Building a new JSON file.");
traverseDirectory(imgFolderPath);
fs.writeFileSync(outputPath, JSON.stringify(filesArray, null, 4));
process.exit();