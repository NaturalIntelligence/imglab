# Development Guide

## Before starting

Get to know [Vue.js](https://vuejs.org/) by referring to their [quick start guide](https://vuejs.org/v2/guide/#Getting-Started).

## Project Structure

```
src/
  assets/                 -> static assets like images, css, etc    
  components/             -> features
  models/                 -> class models
  plugins/                -> custom vue plugins
  store/                  -> Vuex store
  utils/                  -> utility functions and constants
  App.vue                 -> project vue instance
  main.js                 -> app entry file
```

### Explanation

#### assets
Contains static assets. Static assets should be stored here. For example, images or css styles.

#### components

Contains component features. Each feature has been isolated into its own component folder. Each component can have their own config files, util files, etc.

#### models

Contains class models. If you feel that there's a need to create new class models, store them here.

#### plugins

Contains custom plugins. Custom plugins should be written here and then installed in main.js. [Guide on writing vue plugins](https://vuejs.org/v2/guide/plugins.html#ad).


#### store

Contains the main store instance and the store modules.

To get started, please read the [Vuex documentation](https://vuex.vuejs.org/).

The store instance can be accessed in any vue instance via `this.$store`. The modules used have individual namespaces via the `namespace: true` option. Hence, you need to access them using their respective namespaces defined in store.js.

Read the [Vuex guide on modules](https://vuex.vuejs.org/guide/modules.html) for more information on accessing the store apis.

#### utils

Contains any global utility functions and constants. Also contains an event bus that's only used to convey mouse operations between the workarea component and the mouse-coordinates component.

## Components

### Component API

Component data, events, computed properties, methods, etc can be found in the [component api](docs/component-api.md).

### Component overview

- __action-bar__:
  - __actions__:
    - __action-feature-point__: controls feature point colors and size
    - __action-opacity__: controls opacity
    - __action-zoom__: controls zoom
  - __config__: contains the list of actions
  - __action-bar__: renders the action if the selected tool contains one
- __autocomplete-input__: Custom autocomplete component
- __image-slider__: Thumbnail carousel
- __label-panel__:
  - __label-panel__: side panel that contains shape information
  - __panel__:
    - __panel-attribute__: list of shape attribute panel, supports addition and deletion of shape attributes
    - __panel-feature-point__: list of shape feature points, can be reordered/removed
    - __panel-tag__: list of tags assigned to shape, can be reordered
- __menu__:
  - __menu__: contains the open/save file, settings
  - __action__:
    - __file-handler__: encodes and decodes files
    - __nimn-format-*.js__: store object structure, required by .nimn files for encoding / decoding
  - __model__:
    - __modal-get-filename__: get filename on action save file
    - __modal-save__: parent controller of modal-get-filename and modal-select-savetype
    - __modal-select-savetype__: displays list of save file types and parses store data to respective file formats
- __mouse-coordinates__: displays mouse position on canvas
- __tools__:
  - __config__: contains the list of tools, separated by category
  - __tools__: contains the individual tools
  - __toolbox__: displays the list of tools as specified in the config file
- __workarea__:
  - __utils__: contains the utility functions for workarea
  - __workarea__: canvas for SVG to be drawn and interacted with

## Store overview

### Modules

- __action-config__: contains the selected elements and the selected tools
- __app-config__: contains the application settings, such as feature point color, zoom step size, opacity step size, and autosave settings(to be implemented)
- __image-store__: contains logic to add, update, remove images, shapes, and feature points.
- __label-data__: contains shape attributes, category, and tags. Used mainly as autocomplete hints.

## Utils Overview

- __app.js__: utility functions for the whole application
- __mouseCoordBus.js__: mouse coordinate event bus
- __scale-shape.js__: utility functions to scale shapes and feature points
- __tool-names.js__: stores tool names constants

## Manipulating SVG's

### Overview

Basic manipulation of SVG's are done through [SVG.js](https://svgjs.com/).

The SVG canvas is created using the following commands.

```javascript
import SVG from "SVG.js";

// Creates a canvas from a wrapper component that has the id of #work-canvas
this.canvas = SVG("work-canvas");

// Creates a rectangle that's 100 pixels wide and high
let rect = this.canvas.nested().rect(100, 100);
// Creates a circle that has a diameter of 100 pixels
let circle = this.canvas.nested().circle(100);
```

SVG.js is installed as a custom vue plugin. To access any SVG.js methods, use `this.$svg` in any vue component instance.

In `workarea.vue`, we have set up a canvas used to draw SVG's. To access the canvas, use `this.canvas` in `workarea.vue`.

### Generating SVG

When there's a need to generate SVG's, remember to generate the shape / feature point id using.

```javascript
// In app.js
function generateShapeID({ type }) {...}

or

function generateFeaturePointID({ shapeID }) {...}
```

### Getting the SVG element from an ID

To get the SVG element from the shape / feature point id, use the function below.

```javascript
// In app.js
function getSVG({ svg, id }) {...}
```

## Encoding / Decoding nimn files

If there's a need to change the store structure. Remember to update the .nimn object structure in menu/action/. For more information about the nimn file format, please refer to [nimnjs](https://github.com/nimndata/nimnjs).
