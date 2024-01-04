/**
 * Server-side code
 * 
 * @author John Den Hartog
 */
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

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

app.get('/update', (req, res) => {
    filesArray = [];
    traverseDirectory(imgFolderPath);
    fs.writeFileSync(outputPath, JSON.stringify(filesArray, null, 4));
    res.send("Hello world");
})

app.listen(3000, () => {
    console.log("listening");
})