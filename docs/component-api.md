# action-bar

Renders the corresponding action when a tool is selected.
Actions are loaded from the config file

## data

- `actions`

  List of actions available

**initial value:** `'_actions'`

- `action`

  Current action

**initial value:** `null`

# action-feature-point

Sets feature point color and feature point size

## methods

- `applyFeaturePointChanges(cb)`

  Apply changes to all feature points in current image via callback function

  **parameters:**

     - `cb` **Function** - callback function

- `setColorInStore(event)`

  Sets feature point color in store

  **parameters:**

     - `event` **Event** - change event

- `setPointSize(event)`

  Sets the feature point size

  **parameters:**

     - `event` **Event** - change event

- `switchColor(color)`

  Previews the color of featurePoints when the color is changed

  **parameters:**

     - `color` **String** - hexadecimal color code

# action-opacity

Sets image opacity through a slider

## computed properties

- `imageOpacity`

  Gets image opacity; default is 1

   **dependencies:** `imageSelected`, `imageSelected`


## methods

- `dispatch(event)`

  Generic method to set image opacity

  **parameters:**

     - `event` **Event** - range slider value change

# action-zoom

Rescales all items in the canvas, excluding the feature point

## data

- `scale`

  Current zoom scale

**initial value:** `100`

## computed properties

- `imageScale`

  Returns image scale; default is 100%

   **dependencies:** `imageSelected`, `imageSelected`


## methods

- `zoomIn()`

  Zoom in: Scale up both image and shapes

- `zoomOut()`

  Zoom out: Scale down both image and shapes

- `zoomReset()`

  Resets zoom to 100%
  All shapes are transformed to match their size at 100% image scale

- `rescaleShapes(oldScale, newScale)`

  Rescale shapes in selected image and set new scale

  **parameters:**

     - `oldScale` **Number** - old image scale
     - `newScale` **Number** - new image scale

- `rescaleImage(newScale)`

  Rescale image dimensions by new scale

  **parameters:**

     - `newScale` **Number** - new image scale

- `shortcuts(event)`

  List of shortcuts

  **parameters:**

     - `event` **Event** - keydown event

# autocomplete-input

Custom autocomplete component. Allows a list of suggested values to be
passed into the component. Toggle "filter" flag to either filter the list or
to display the whole list of suggestions. Allows placeholder and value to be
passed in as the default placeholder and initial value of autocomplete
component.

## props

- `autocomplete-class` ***Array*** (*optional*)

  Apply styles listed in the array of classes

- `filter` ***Boolean*** (*optional*) `default: true`

  Set filter to false to disable filtering list by input tag value

- `list` ***Array*** (*optional*) `default: []`

  List of recommended values

- `placeholder` ***String*** (*optional*) `default: ''`

  Initial input tag placeholder

- `value` ***String*** (*optional*) `default: ''`

  Initial input tag value

## data

- `text`

  Input tag text

**initial value:** `[object Object]`

- `selected`

  Selected item index from list

**initial value:** `[object Object]`

- `showSuggestions`

  Toggle suggestion list

**initial value:** `false`

## computed properties

- `suggestions`

  Returns a filtered list of suggestion

   **dependencies:** `filter`, `list`, `list`, `text`

- `debouncedEmitAddEvent`

  Debounce emitAddEvent is added here to allow method to be flushed

   **dependencies:** `emitAddEvent`


## events

- `added`

  Emits an added event with the current input value

  **arguments:**

     - `val` **String** - current input value

- `selected`

  Emits selected event if successful

  **arguments:**

     - `val` **String** - selected text

## methods

- `emitAddEvent(val)`

  Emits add event. Should not be used by itself.

  **parameters:**

     - `val` **String** - selected string value

- `isValid(index)`

  Checks if index is valid

  **parameters:**

     - `index` **Number** - list item index

  **return value:**

     - **Boolean** - true if valid; false otherwise
- `moveSelection(step)`

  Selects item based on index position

  **parameters:**

     - `step` **Number** - increment from current position by #step

- `onInput(event)`

  Sets the text used to filter and show suggestions

  **parameters:**

     - `event` **Event** - input event

- `onInputBlur(event)`

  Blur event: When input loses focus, check if component also loses focus,
  flush previous `added` events and reset state if true; stop otherwise

  **parameters:**

     - `event` **Event** - blur event

- `resetState()`

  Hide suggestion list and reset selected position to -1

- `selectSuggestion(event)`

  Sends clicked suggestion via `selected` event

  **parameters:**

     - `event` **Event** - click event

# image-slider

Previews images in a carousel like fashion, click on an image to load image
to workarea and start annotating.

## props

- `thumbnail-width` ***String*** (*optional*) `default: "80px"`

  Set thumbnail width

## data

- `thumbnails`

  Array of Images

**initial value:** `[object Object]`

## methods

- `loadImage(imageData)`

  Loads the image dynamically and stores it in the image store

  **parameters:**

     - `imageData` **Image** - an Image object from models/Image

- `loadIntoWorkArea(index)`

  Set the clicked thumbnail as the image selected

  **parameters:**

     - `index` **Number** - index in the list of thumbnails

- `readImageFile(file)`

  Reads file data, loads the image, and stores the image detail in the
  list of thumbnails

  **parameters:**

     - `file` **File** - native file interface

- `readImageFiles(e)`

  Reads a list of files

  **parameters:**

     - `e` **Event** - native Event interface

- `slideleft()`

  Slides the thumbnail preview to the left

- `slideright()`

  Slides the thumbnail preview to the right

- `shortcuts(event)`

  List of shortcuts

  **parameters:**

     - `event` **Event** - keydown event

# label-panel

Side panel that displays the shape category, attributes, tags, and
feature points.

## computed properties

- `selectedShape`

  Returns the selected shape from image-store

   **dependencies:** `selectedShapeID`, `getShapeByID`, `selectedShapeID`


## methods

- `addCategory(category)`

  Adds a new category via `added` event

  **parameters:**

     - `category` **String** - category

- `updateLabel(event)`

  Updates shape label

  **parameters:**

     - `event` **Event** - change event

# panel-attribute

Panel that shows a list of shape attributes. Allows users to add or remove
existing attributes.

## data

- `enterProperty`

  Property to be added

**initial value:** `''`

- `enterValue`

  Value to be added

**initial value:** `''`

## computed properties

- `shapeAttributes`

  Return shape attributes

   **dependencies:** `selectedShapeID`, `getShapeAttributes`


## methods

- `addAttribute()`

  Adds an attribute to both shape and store

- `removeAttribute(index)`

  Remove an attribute from shape based on index

  **parameters:**

     - `index` **Number** - list item index

- `suggestedValues(property)`

  Returns a list of suggested values for autocompletion

  **parameters:**

     - `property` **String** - property used for filtering

  **return value:**

     - **String[]** - array of suggested values
- `updateAttributeProp(attribute, newProp)`

  Updates an attribute property when it's changed

  **parameters:**

     - `attribute` **Attribute** - contains old property-value pair
     - `newProp` **String** - new property

- `updateAttributeValue(attribute, newValue)`

  Update attribute value when it's changed

  **parameters:**

     - `attribute` **Attribute** - contains old property and value
     - `newValue` **String** - new value

# panel-feature-point

Shows the list of shape feature points. Feature points can be reordered by
dragging the list item.

## computed properties

- `featurePoints`

  Computed getter and setter needed for draggable component

   **dependencies:** `selectedShape`, `getShapeFeaturePoints`


## methods

- `deleteFeaturePoint(featurePointID)`

  Removes feature point from canvas and store

  **parameters:**

     - `featurePointID` **String** - feature point id

- `deselectShape()`

  Deselect shape on canvas, does not remove shape from store

- `deselectShapeFeaturePoints()`

  Deselect and remove all feature points in selected shape

- `forceFocusOut()`

  Handles behavior when list loses focus by clicking on the component

- `onClick(event, featurePoint)`

  Set selected elements (featurePoints) on click

  **parameters:**

     - `event` **Event** - click event
     - `featurePoint` **FeaturePoint** - featurePoint

- `setFeaturePointLabel(event, featurePoint)`

  Sets the feature point label

  **parameters:**

     - `event` **Event** - change / keyup.enter event
     - `featurePoint` **FeaturePoint** - FeaturePoint

# panel-tag

List the shape tags. Duplicate tags are not allowed. Tags and be reordered by
dragging.

## data

- `selectedTag`

  Used to set focus to selected tag

**initial value:** `null`

- `tagText`

  Input tag text

**initial value:** `''`

## computed properties

- `shapeTags`

  Computed getter and setter needed by draggable component

   **dependencies:** `getShapeByID`, `selectedShapeID`


## methods

- `addTag(event)`

  Adds tag to shape and store

  **parameters:**

     - `event` **Event** - change event

- `focusInput()`

  Sets focus on input tag

- `onInput(event)`

  Set tag text to event value and set selected tag to null

  **parameters:**

     - `event` **Event** - input event

- `removeTagByCross(tag)`

  Remove tag on click event on cross

  **parameters:**

     - `tag` **String** - tag value

- `removeTagByBackspace()`

  Remove tag when backspace is pressed on the active and empty input tag

# menu

Menu component. Valid actions are open/save file, or to open app settings.
This component also handles decoding files for the "open" action.

## data

- `showModal`

  Boolean toggle to display modal-save component

**initial value:** `false`

## methods

- `loadDlibXml(data)`

  Loads dlib xml file data to store

  **parameters:**

     - `data` **String** - dlib xml data

- `loadJSONFile(data)`

  Loads Coco json file data to store

  **parameters:**

     - `data` **String** - coco json data

- `loadProjectFile(data)`

  Loads .nimn file data to store

  **parameters:**

     - `data` **String** - nimn file data

- `openSettings()`

- `openFile(event)`

  Opens file and initialize store

  **parameters:**

     - `event` **Event** - click Event

- `shortcuts(event)`

  Shortcuts

  **parameters:**

     - `event` **Event** - keydown event

# modal-get-filename

Displays a modal to get the file name. There are 2 types of events emitted.

Input event is emitted on providing a valid filename and on continue
Close event is emitted on cancel / exit

## props

- `value` ***String*** (*required*)

  Initial input value

- `ext` ***String*** (*required*)

  Expected file format

## data

- `filename`

  Filename that contains a file extension

**initial value:** `[object Object]`

- `showError`

  Boolean toggle to display error styles if true

**initial value:** `false`

## events

- `input`

  Emits an input event

  **arguments:**

     - `filename` **String** - correctly formatted file name

- `close`

  Emits a close event to toggle component display

## methods

- `onInput(event)`

  Toggles showError if input tag is empty. Assigns input value as filename
  otherwise

  **parameters:**

     - `event` **Event** - input event

- `setFilename()`

  Emits `input` event if filename is valid, toggle showError to show
  display error styling otherwise

- `shortcuts(event)`

  Shortcuts

  **parameters:**

     - `event` **Event** - keyup event

- `validFilename()`

  Checks that the filename is correct and has the correct extension

  **return value:**

     - **Boolean** - true if valid; false otherwise

# modal-save

Toggles between showing the save file types and the get-filename modal.
Proceeds to encode store data and save it into the file if valid.

## data

- `defaultvalues`

  Contains a mapping of file extension to default names

**initial value:** `[object Object]`

- `filetype`

  Selected file type / exntension

**initial value:** `null`

- `showSaveDialog`

  Boolean toggle for displaying save options / get filename component

**initial value:** `true`

## methods

- `analyticsReport(filetype)`

  Google analytics: Report file metadata

  **parameters:**

     - `filetype` **String** - file type

- `analyticsImageStore()`

  Sends metadata about the image store to google analytics

- `analyticsLabelData()`

  Sends label metadata to google analytics

- `analyticsFileType(filetype)`

  Sends file type to google analytics

- `download(data, filename, type)`

  Save given data to a file

  **parameters:**

     - `data` **Any** - string data
     - `filename` **String** - file name
     - `type` **String** - Mime type

- `isSupported(filetype)`

  Checks if file type is supported

  **parameters:**

     - `filetype` **String** - file type

  **return value:**

     - **Boolean** - true if exists; false otherwise
- `saveAs(filename, filetype)`

  Given file name and file type, save data to corresponding format

  **parameters:**

     - `filename` **String** - filename that includes the file extension
     - `filetype` **String** - used to determine which handler to call

- `saveAsCocoJSON(filename)`

  Saves whole project as coco json

  **parameters:**

     - `filename` **String** - file name

- `saveAsDlibPts(filename)`

  Save selected shape into a pts file

  **parameters:**

     - `filename` **String** - file name

- `saveAsDlibXml(filename)`

  Save project as dlib xml

  **parameters:**

     - `filename` **String** - file name

- `saveAsNimn(filename)`

  Save store data to nimn format

  **parameters:**

     - `filename` **String** - filename

- `setFileType(filetype)`

  Set file type and toggle prompt to display get-file-name component

  **parameters:**

     - `filetype` **String** - file type

# modal-select-savetype

Displays a list of save file types. Returns to parent controller when an
item is selected via the save/close events.

## data

- `snackbarMsg`

  Snackbar message

**initial value:** `''`

## computed properties

- `_ext`

  Used on template to access the Ext const

## events

- `close`

  Emits close event

- `save`

  Emits save event

  **arguments:**

     - `filesxt` **String** - file extension

## methods

- `displaySnackbar(message)`

  Display a snackbar with a message

  **parameters:**

     - `message` **String** - message to be displayed

- `shortcuts(event)`

  Defines possible shortcuts

  **parameters:**

     - `event` **Event** - keydown event

- `validate(fileext)`

  Checks if action can be performed

  **parameters:**

     - `fileext` **String** - file extension

# mouse-coordinates

Displays the mouse coordinates on the canvas

## data

- `x`

  Mouse x coord

**initial value:** `0`

- `y`

  Mouse y coord

**initial value:** `0`

- `show`

  Boolean toggle to show mouse coordinate

**initial value:** `false`

## methods

- `hideMousePosition()`

  Hides mouse position on mouse leave event

- `updateMousePosition(x, y)`

  Updates mouse position on mouse move event

# restore-data

WIP: Switch implementation to indexeddb

## data

- `show`

  Toggle component

**initial value:** `false`

- `storeData`

**initial value:** `null`

## methods

- `checkBrowserCache()`

  Checks if there is browser cache

- `clearCache()`

  Clear local storage and emit close event

- `restoreData()`

  Restores data and emits close event

# toolbox

Loads the tools specified in config file. Shortcuts can be invoked to select
tool.

## props

- `tool-type` ***String*** (*optional*) `default: 'LABEL_TAG'`

## data

- `tools`

  Set list of tools from config

**initial value:** `'config'`

## methods

- `dispatch(tool)`

  Updates to newly selected tool

  **parameters:**

     - `tool` **Tool** - selected tool

- `shortcuts(event)`

  List of tool shortcuts

  **parameters:**

     - `event` **Event** - keydown event

# workarea

Workarea is the canvas for the svg shapes to be drawn on.
Canvas is redrawn when the internal state of the store changes and the visual
components need to be updated. For example, when the image selected changes
or when the image scale changes.

But the canvas doesn't need to always be redrawn. Just update the visual
components themselves would suffice. For example. when the feature points are
selected via the side panel, we just make sure that the feature points on
the canvas are selected.

## data

- `alreadyDrawing`

  Flag to check if shape is being drawn

**initial value:** `false`

- `canvas`

  SVG canvas

**initial value:** `null`

- `drawingShape`

  Shape being drawn

**initial value:** `null`

## computed properties

- `imageWidth`

  Get image width

   **dependencies:** `imageSelected`, `imageSelected`

- `imageHeight`

  Get image height

   **dependencies:** `imageSelected`, `imageSelected`

- `imageOpacity`

  Get image opacity

   **dependencies:** `imageSelected`, `imageSelected`

- `imageSrc`

  Get image selected source

   **dependencies:** `imageSelected`, `imageSelected`

- `imageScale`

  Get image scale

   **dependencies:** `imageSelected`, `imageSelected`


## events

- `mouse-move`

  Emits mouse move event to MouseCoordBus

  **arguments:**

     - `x` **Number** - x coordinate
     - `y` **Number** - y coordinate

- `mouse-leave`

  Emits "mouse-leave" event to MouseCoordBus

## methods

- `attachEvents(shape)`

  Attach drag and click handlers to shape

  **parameters:**

     - `shape` **SVG.Shape** - SVG shape

- `attachEventsToFeaturePoint(featurePoint, shape)`

  Attach drag and click handlers to feature points

  **parameters:**

     - `featurePoint` **SVG.Circle** - SVG circle representing feature point
     - `shape` **SVG.Shape** - SVG shape

- `attachShapeListeners(shape)`

  Attach draw and resize handlers to a shape

  **parameters:**

     - `shape` **SVG.Shape** - SVG shape

- `copyShape()`

  Copy selected shapes

- `customDragHandler(el, cb)`

  Custom drag event for SVG shapes

  **parameters:**

     - `el` **SVG.Shape** - a SVG shape to attach drag listener to
     - `cb` **Function** - callback function

- `deselectAll(shape, featurePoint)`

  Deselects all selected shapes / featurepoints
  Able to specify which element to keep by passing in an options object

  **parameters:**

     - `shape` **Boolean** - keep shape if true; else remove
     - `featurePoint` **Boolean** - keep feature points if true; else remove

- `dragOnMove(shape)`

  Allows shapes to be dragged only if move tool is selected

  **parameters:**

     - `shape` **SVG.Shape** - SVG element

- `drawCanvas()`

  Draws all the shapes and fill their labels

- `drawFeaturePoints(fPoints, shape)`

  Draws all the feature points in the shape according to
  current image scale and attach event listeners to points

  **parameters:**

     - `fPoints` **FeaturePoint[]** - array of shape feature points
     - `shape` **SVG.Shape** - shape that contains the feature points

- `drawShape(shape)`

  Draws a single shape

  **parameters:**

     - `shape` **Shape** - shape to be drawn

- `drawShapes()`

  Draws all the shapes in the selected image

- `flushShortcuts(event)`

  Flush debounced shape updates on keyup event

  **parameters:**

     - `event` **Event** - keyup event

- `getFeaturePointsFromSVG(shapeID)`

  Gets the feature points from the SVG shape

  **parameters:**

     - `shapeID` **String** - id of shape

- `getPoints(shape)`

  Returns shape dimensions, used for exporting data
  Eg. rectangle - [x-coord, y-coord, height, width]

  **parameters:**

     - `shape` **SVG.Shape** - SVG shape

  **return value:**

     - **Array** - array filled with shape dimensions
- `mouseDown(event)`

  Mouse down on canvas: Draw shapes

  **parameters:**

     - `event` **Event** - mouse down event

- `moveShape(dx, dy)`

  Move selected shape by (dx, dy) pixels from original position

  **parameters:**

     - `dx` **Number** - move to left if negative; right if positive
     - `dy` **Number** - move to top if negative; bottom if positive

- `mouseUp(event)`

  Mouse up event handling

  **parameters:**

     - `event` **Event** - mouse up event

- `onMouseMove(event)`

  Emits "mouse-move" event to MouseCoordBus on mouse move

  **parameters:**

     - `event` **Event** - mouse move event

- `onMouseLeave()`

  Emits "mouse-leave" event to MouseCoordBus on mouse leave

- `pasteShape()`

  Paste copied shapes to canvas

- `removeSelectedShapes()`

  Remove selected shapes from canvas

- `selectAll()`

  Select all shapes in the current image

- `shortcuts(event)`

  List of shortcuts
