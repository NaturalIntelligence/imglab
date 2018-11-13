# imglab

Vue.js port of the imglab.

## Progress

Check out the current project progress by taking a look at the [checklist](checklist.md)

## New features

- __Side panel__
  - Shape attributes will now show a list of suggested values based on the shape property
  - Shape tags can be reordered
  - Feature point in list can be reordered
  - Feature point that is clicked on the side panel will be selected on the workarea
- __Toolbar__
  - Added a mouse coordinate component

## Changed features
- __Toolbar__
  - Added a component to display mouse coordinate
  - Remapped tool shortcuts
- __Zoom shortcuts__
  - Remapped zoom shortcuts
- __Decode COCO json__
  - Coco json will either decode a shape as a circle or a polygon. As there is no reliable way of determining if a shape is a rectangle or a polygon
- __Encode Dlib XML__
  - Label shall be encoded with either the shape.label or shape.type
- __Google Analytics__
  - Modified the data sent to google analytics

## Removed Features
- __gridlines__
  - Removed gridlines that act as visual indicators of the cursor

## Global Shortcuts
- __Toolbar__
  - __Feature Point Tool__: Alt + F
  - __Rectangle Tool__: Alt + R
  - __Circle Tool__: Alt + C
  - __Polygon Tool__: Alt + P
  - __Move Tool__: Alt + M
  - __Zoom Tool__: Alt + Z
    - __Zoom In__ : Alt + ]
    - __Zoom Out__: Alt + [
  - __Opacity Tool__: Alt + L
- __Thumbnail slider__
  - __Shift Thumbnail Left__: Ctrl + Alt + N
  - __Shift Thumbnail Right__: Ctrl + Alt + M
  - __Import Image__: Ctrl + Alt + O
  - __Import Folder__: Alt + O
- __Open project file__: Ctrl + I
- __Save project__: Ctrl + E
- __Workarea__:
  - __Select All__: Alt + A
  - __Delete__: Del
  - __Copy__: Ctrl + C
  - __Paste__: Ctrl + V
  - __Move Left 1 Pixel__: Ctrl + Shift + LeftArrow
  - __Move Right 1 Pixel__: Ctrl + Shift + RightArrow
  - __Move Up 1 Pixel__: Ctrl + Shift + UpArrow
  - __Move Down 1 Pixel__: Ctrl + Shift + DownArrow

## Built with
- [Vue.js](https://vuejs.org/)
- [SVG.js](https://svgjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
