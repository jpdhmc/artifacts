# DH Artifacts
https://jdhstuff.com/artifacts (Not yet functioning with Safari because I don't own an Apple device - Sorry!)

An immersive gallery of various family media built entirely with JavaScript.

### The Why
I took this project on primarily because I wanted to build my understanding of vanilla JavaScript as a language - Some solutions would surely have been much easier via the many frameworks and libraries available, but problem solving with just the tools that js provides helped to round out the fundamentals. And of course, the creative side was very rewarding - Putting together a sort of "virtual library" of my grandparents' old media is a compelling idea that I'm motivated to continue on with.

The only exception to this JavaScript-only rule was a [node.js script](serverside/app.js) I wrote to traverse through the server's directory structure and generate a [json file](include/artifacts.json) containing the details of the artifact files. Because I found there was no particularly convenient way for js to do this, I made this compromise - The actual program only interacts with the json document, which can be generated using the script every time new artifacts are added or the file structure changes.

### Functionality
* A shifting background that follows the user's mouse movement and places them "in" the office environment. Objects glow to signal interactivity.

[menu.webm](https://github.com/user-attachments/assets/9e2f444c-ed19-4851-921e-fa520c00c36e)

* When an option is selected, the website transitions to the desired gallery.

[openingfilmslides.webm](https://github.com/user-attachments/assets/b9155bac-fcdf-4a3b-969d-4c3d190fdb4d)

* Galleries can be filtered by category if applicable.

[categories.webm](https://github.com/user-attachments/assets/5fa80d48-733c-47f3-b14b-3c064c73dcb5)

* When returning home to select a different gallery, the site transitions again without ever having to reload.

[home.webm](https://github.com/user-attachments/assets/eb8484c4-7aaa-4443-912a-3c5fdc5031ac)

* Custom-built display for different media types, like audio!

[tapes.webm](https://github.com/user-attachments/assets/922fa20e-b3b9-458e-836d-1762524cd49f)
