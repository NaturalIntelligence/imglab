# ImgLab User Guide:

### [Auto suggestion:](#auto-suggestion)

![Auto suggestion](/img/imglab-autosuggestion.gif)

### [Plugins:](#plug-ins)

Use 3rd party plugins such as Face Plus Plus for a one click annotation.

1. Click the puzzle icon on the top right-hand corner.
2. On the drag-down menu, select Face Plus Plus.
3. Enter the api_key if applicable (or leave blank).
4. Click Plot with Face++.

![Plugins](/img/imglab-fpp.gif)

### [Different Shapes:](#polygon)

Create various shapes (circles, rectangles, polygons) on your image.

1. Select any shapes tool on the toolbar on the left-hand side.
2. Left click on the starting point of the image.
3. Drag the curse while holding the left click to adjust the size of the shape.

![Polygons](/img/imglab-polygon.gif)

### [Keyboard Shortcuts:](#hotkeys)

Use the following shortcuts to speed up your work and save yourself some clicking.

*File Management:*

* Shift + Alt + O : Open image folder.
* Ctrl + I : Import data file.
* Ctrl + E : Export data file.
* Alt + Left/Right Arrow : Navigate through images in the slider.

*Image Manipulation:*

* Del : Delete selected shapes or feature points.
* Enter : Confirm action.
* Alt + A : Select all shapes.
* Ctrl + Directional Arrow : Move the currently selected shape in the corresponding direction.

*Toolbar Shortcuts:*

* Alt + F : Feature Point
* Alt + C : Circle
* Alt + R : Rectangle
* Alt + P : Polygon
* Alt + M : Move
* Alt + L : Light
* Alt + E : Ellipse
* Alt + + (Plus key) : Zoom
* Alt + W : Magic wand

![Hotkeys](/img/imglab-hotkeys.gif)

### [Zoom In/Out:](#zoom)

Zoom in and out of your image to adjust your precision or simply get a different view.

1. Select the magnifying glass in the toolbar on the top left-hand corner.
2. Click the magnifying glass with the (+) to zoom in or (-) to zoom out.

![Zoom](/img/imglab-zoom.gif)

### [Copy/Paste Labels Across Images:](#copy-paste)

A short description of the feature will go here.

1. Steps to complete this operation will be available here.
2. Placeholder. Work in progress.

DEMONSTRATION GIF NOT YET AVAILABLE.

### [Offline Installation:](#offline-install)

To use it offline, you can either download installers or clone this repo and run it on a local server.

#### Installing

1. Fork this repository on github and make a clone from your forked copy
2. Go to the folder you wish the create the directory and type ``` $ git clone 'your_local_fork_on_github' ``` in your terminal.

#### Setup local environment

1. Install node and npm
2. Open the terminal and run `$ npm install -g live-server` to install node live server.
3. Run `$ live-server` in /imglab/ folder.
4. Open your browser (if it hasn't popped up already) at: `http://127.0.0.1:8080/`

*Note that* [live-server](https://www.npmjs.com/package/live-server) is just an app to run the server in easy way. You may try any other option as well. 