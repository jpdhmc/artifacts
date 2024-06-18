# DH Artifacts
https://jdhstuff.com/artifacts

An immersive gallery of various family media built entirely with JavaScript.

### The Why
I took this project on primarily because I wanted to build my understanding of vanilla JavaScript as a language - Some solutions would surely have been much easier via the many frameworks and libraries available, but problem solving with just the tools that js provides helped to round out the fundamentals. And of course, the creative side was very rewarding - Putting together a sort of "virtual library" of my grandparents' old media is a compelling idea that I'm motivated to continue on with.

The only exception to this JavaScript-only rule was a [node.js script](serverside/app.js) I wrote to traverse through the server's directory structure and generate a [json file](include/artifacts.json) containing the details of the artifact files. Because I found there was no particularly convenient way for js to do this, I made this compromise - The actual program only interacts with the json document, which can be generated using the script every time new artifacts are added or the file structure changes.