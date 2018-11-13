<template lang="html">
  <div
    id="canvas-container">
    <div
      class="canvas-wrapper"
      :style="{ width: (imageWidth + 50) + 'px', height: (imageHeight + 50) + 'px' }">
      <img
        id="img"
        :src="imageSrc"
        :style="{ width: imageWidth  + 'px', height: imageHeight + 'px', opacity: imageOpacity }"
      />
      <div
        id="work-canvas"
        ref="workcanvas"
        :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
        @click="deselectAll"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
      >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  getCoordinates,
  getSVG,
  generateShapeID,
  generateFeaturePointID,
  _
} from "../../utils/app";
import {
  RECTANGLE,
  CIRCLE,
  POLYGON,
  MOVE,
  SHAPE
} from "../../utils/tool-names";
import { drawPoint } from "../tools/tools/point";
import {
  scaleFeaturePoint,
  scaleFeaturePoints,
  scaleShape,
  scaleShapePoints
} from "../../utils/scale-shapes";
import SVG from "svg.js";
import { MouseCoordBus } from "../../utils/mouseCoordBus";
import { Shape } from "../../models/Shape";
import { FeaturePoint } from "../../models/FeaturePoint";
import { debounceUpdateShape } from "./util.js";

/**
 * Workarea is the canvas for the svg shapes to be drawn on.
 * Canvas is redrawn when the internal state of the store changes and the visual
 * components need to be updated. For example, when the image selected changes
 * or when the image scale changes.
 *
 * But the canvas doesn't need to always be redrawn. Just update the visual
 * components themselves would suffice. For example. when the feature points are
 * selected via the side panel, we just make sure that the feature points on
 * the canvas are selected.
 */
export default {
  data() {
    return {
      // Flag to check if shape is being drawn
      alreadyDrawing: false,
      // SVG canvas
      canvas: null,
      // Shape being drawn
      drawingShape: null
    };
  },
  computed: {
    // Map getters from action-config.js
    ...mapGetters("action-config", {
      copiedElements: "getCopiedElements",
      selectedTool: "getSelectedTool",
      selectedShapes: "getSelectedShapes",
      selectedFeaturePoints: "getSelectedFeaturePoints"
    }),

    // Map getters from image-store.js
    ...mapGetters("image-store", {
      imageSelected: "getImageSelected",
      getShapeByID: "getShapeByID",
      getShapeFeaturePoints: "getShapeFeaturePoints",
      getFeaturePointByID: "getFeaturePointByID",
      featurePointSize: "getFeaturePointSize"
    }),

    ...mapGetters("app-config", {
      featurePointColor: "getFeaturePointColor"
    }),

    // Get image width
    imageWidth() {
      return this.imageSelected ? this.imageSelected.size.scaledWidth : 0;
    },

    // Get image height
    imageHeight() {
      return this.imageSelected ? this.imageSelected.size.scaledHeight : 0;
    },

    // Get image opacity
    imageOpacity() {
      return this.imageSelected ? this.imageSelected.opacity : 1;
    },

    // Get image selected source
    imageSrc() {
      return this.imageSelected ? this.imageSelected.src : "";
    },

    // Get image scale
    imageScale() {
      return this.imageSelected ? this.imageSelected.size.imageScale : 0;
    }
  },
  watch: {
    /**
     * Redraw canvas when image changes
     */
    imageSelected() {
      this.setSelectedElements();
      this.drawCanvas();
    },

    /**
     * Redraw canvas when image scale changes
     */
    imageScale() {
      this.drawCanvas();
    },

    /**
     * Select shapes when selected shapes are changes
     */
    selectedShapes() {
      this.selectedShapes.forEach(shapeID => {
        let svgShape = getSVG({
          svg: this.$svg,
          id: shapeID
        });
        svgShape.selectize({
          rotationPoint: false
        });
      });
    },

    /**
     * Select feature points when selected feature points changes
     */
    selectedFeaturePoints() {
      this.selectedFeaturePoints.forEach(featurePointID => {
        let svgFP = getSVG({
          svg: this.$svg,
          id: featurePointID
        });
        svgFP.selectize({
          rotationPoint: false,
          points: []
        });
      });
    }
  },
  methods: {
    ...mapMutations("action-config", [
      "setCopiedElements",
      "addSelectedElement",
      "addCopiedElement",
      "setSelectedElements"
    ]),

    ...mapMutations("image-store", [
      "addImageToStore",
      "addShapeToImage",
      "addPointToShape",
      "detachShapeFromImage",
      "updateFeaturePoint",
      "updateShapeDetail"
    ]),

    ...mapMutations("image-store", {
      updateFeaturePointsInStore: "updateFeaturePoints"
    }),

    /**
     * Attach drag and click handlers to shape
     * @param {SVG.Shape} shape - SVG shape
     */
    attachEvents(shape) {
      // Only allow shape to be dragged on move tool
      this.dragOnMove(shape);

      // Drag handler
      this.customDragHandler(shape.parent(), () => {
        if (this.selectedTool && this.selectedTool.type === MOVE) {
          this.updateShapeDetail({
            shapeID: shape.node.id,
            rbox: shape.rbox(this.canvas),
            points: this.getPoints(shape)
          });
          // Update feature point in store
          this.updateFeaturePointsInStore({
            shapeID: shape.id(),
            featurePoints: this.getFeaturePointsFromSVG(shape.id())
          });
        }
      });

      // Click handler
      shape.on("click", event => {
        event.stopPropagation();

        if (this.selectedTool && this.selectedTool.type === "point") {
          // Selected tool is point, has highest precedence
          var point = drawPoint({
            event,
            shape,
            canvasOffset: this.canvas.node.getBoundingClientRect(),
            featurePointSize: this.featurePointSize,
            featurePointColor: this.featurePointColor
          });
          // Position of point is relative to canvas
          this.addPointToShape({
            shapeID: shape.node.id,
            pointID: point.node.id,
            position: point.rbox(this.canvas)
          });
          this.attachEventsToFeaturePoint(point, shape);
        } else if (event.altKey) {
          // Deep select shape
          this.deselectAll();
          shape.selectize({
            rotationPoint: false,
            deepSelect: true
          });
          this.addSelectedElement({
            shapeID: shape.id()
          });
        } else {
          if (!event.ctrlKey) {
            // Single click event
            this.deselectAll();
          }
          // select current element
          shape.selectize({
            rotationPoint: false
          });

          this.addSelectedElement({
            shapeID: shape.id()
          });
        }
      });
    },

    /**
     * Attach drag and click handlers to feature points
     * @param {SVG.Circle} featurePoint - SVG circle representing feature point
     * @param {SVG.Shape} shape - SVG shape
     */
    attachEventsToFeaturePoint(featurePoint, shape) {
      this.dragOnMove(featurePoint);

      this.customDragHandler(featurePoint, () => {
        this.updateFeaturePoint({
          shapeID: shape.id(),
          pointID: featurePoint.id(),
          position: featurePoint.rbox(this.canvas)
        });
      });

      featurePoint.on("click", event => {
        shape.selectize(false);

        if (!event.ctrlKey) {
          // Single select
          this.deselectAll({
            shape: true
          });
        }

        featurePoint.selectize({
          rotationPoint: false,
          points: []
        });

        this.addSelectedElement({
          shapeID: shape.id(),
          featurePointID: featurePoint.id()
        });

        event.stopPropagation();
      });
    },

    /**
     * Attach draw and resize handlers to a shape
     * @param {SVG.Shape} shape - SVG shape
     */
    attachShapeListeners(shape) {
      // Draw stop handler
      shape.on("drawstop", () => {
        // Set draw stop to false once done with drawing
        this.alreadyDrawing = false;
        this.drawingShape = null;
        /**
         * Add shape to image if valid, remove previously drawn shape otherwise
         * Make sure that the shape size is large enough to prevent accidental draws
         */
        if (!this.selectedTool.validate(shape)) {
          shape.parent().remove();
          shape.remove();
        } else {
          // Make shape draggable
          shape.parent().draggable();
          // Attach shape data
          this.addShapeToImage({
            id: shape.node.id,
            type: shape.type,
            rbox: shape.rbox(this.canvas),
            points: this.getPoints(shape)
          });
          // Attach events to shape
          this.attachEvents(shape);
        }
      });

      // Resize done handler
      shape.on("resizedone", () => {
        debounceUpdateShape({
          shapeID: shape.node.id,
          rbox: shape.rbox(this.canvas),
          points: this.getPoints(shape)
        });
      });
    },

    /**
     * Copy selected shapes
     */
    copyShape() {
      // Clear copied elements
      this.setCopiedElements();

      this.selectedShapes.forEach(shapeID => {
        let shape = this.getShapeByID(shapeID);
        // Copy feature point data
        let _featurePoints = [];
        shape.featurePoints.forEach(pointID => {
          let featurePoint = this.getFeaturePointByID(pointID);
          _featurePoints.push(new FeaturePoint(featurePoint));
        });
        // Copy shape data and add feature point data to shape
        // let _shape = scaleShape({ ...shape, scale: this.imageScale });
        let _shape = new Shape(shape);
        _shape.featurePoints = _featurePoints;
        // Add copied shape to store
        this.addCopiedElement({ item: _shape });
      });
    },

    /**
     * Custom drag event for SVG shapes
     * @param {SVG.Shape} el - a SVG shape to attach drag listener to
     * @param {Function} cb - callback function
     */
    customDragHandler(el, cb) {
      var mousestate = 0;
      el.on("mousedown", function() {
        mousestate = 1;

        let _mousemove = function() {
          mousestate = 2;
        };

        let _mouseup = function(e) {
          if (mousestate === 2) {
            cb && cb(e);
          }
          mousestate = 0;
          // unbind events
          el.off("mousemove", _mousemove);
          el.off("mouseup", _mouseup);
        };
        // bind events
        el.on("mousemove", _mousemove);
        el.on("mouseup", _mouseup);
      });
    },

    /**
     * Deselects all selected shapes / featurepoints
     * Able to specify which element to keep by passing in an options object
     * @param {Boolean} shape - keep shape if true; else remove
     * @param {Boolean} featurePoint - keep feature points if true; else remove
     */
    deselectAll({ shape = false, featurePoint = false } = {}) {
      // Deselect all svg elements
      this.selectedShapes.forEach(shapeID => {
        let svgShape = getSVG({
          svg: this.$svg,
          id: shapeID
        });
        svgShape.selectize(false);
      });

      this.selectedFeaturePoints.forEach(featurePointID => {
        let svgFP = getSVG({
          svg: this.$svg,
          id: featurePointID
        });
        svgFP.selectize(false);
      });

      // Set selected elements
      this.setSelectedElements({
        shapes: shape ? this.selectedShapes : [],
        featurePoints: featurePoint ? this.selectedFeaturePoints : []
      });
    },

    /**
     * Allows shapes to be dragged only if move tool is selected
     * @param {SVG.Shape} shape - SVG element
     */
    dragOnMove(shape) {
      shape.on(
        "mousedown",
        function(event) {
          if (!this.selectedTool || this.selectedTool.type !== "move") {
            event.preventDefault();
            event.stopPropagation();
          }
        },
        this
      );
    },

    /**
     * Draws all the shapes and fill their labels
     */
    drawCanvas() {
      if (this.canvas) {
        // Removes all children and replaces canvas with a new one
        this.canvas.clear();
        this.canvas.remove();
      }
      this.canvas = SVG("work-canvas");
      // Draws all shapes in image
      this.drawShapes();
    },

    /**
     * Draws all the feature points in the shape according to
     * current image scale and attach event listeners to points
     * @param {FeaturePoint[]} fPoints - array of shape feature points
     * @param {SVG.Shape} shape - shape that contains the feature points
     */
    drawFeaturePoints(fPoints, shape) {
      let scaledFPoints = scaleFeaturePoints(
        fPoints,
        this.imageSelected.size.imageScale
      );
      for (var fPointIndex in scaledFPoints) {
        var fPoint = drawPoint({
          position: scaledFPoints[fPointIndex],
          canvasOffset: {
            x: 0,
            y: 0
          },
          shape,
          featurePointSize: this.featurePointSize,
          featurePointColor: this.featurePointColor
        });
        fPoint.id(scaledFPoints[fPointIndex].id);
        this.attachEventsToFeaturePoint(fPoint, shape);
      }
    },

    /**
     * Draws a single shape
     * @param {Shape} shape - shape to be drawn
     */
    drawShape(shape) {
      if (!shape) return;
      let scale = this.imageScale;
      let currentShape;
      switch (shape.type) {
        case RECTANGLE: {
          let rect = this.canvas
            .nested()
            .rect(shape.points[2] * scale, shape.points[3] * scale)
            .move(shape.points[0] * scale, shape.points[1] * scale)
            .id(shape.id)
            .addClass("labelbox shape")
            .resize();
          rect.parent().draggable();
          currentShape = rect;
          break;
        }
        case CIRCLE: {
          let circle = this.canvas
            .nested()
            .circle()
            .radius(shape.points[2] * scale)
            .attr({
              cx: shape.points[0] * scale,
              cy: shape.points[1] * scale
            })
            .id(shape.id)
            .addClass("labelcircle shape")
            .resize();
          circle.parent().draggable();
          //Add feature points
          currentShape = circle;
          break;
        }
        case POLYGON: {
          var poly = this.canvas
            .nested()
            .polygon(scaleShapePoints(shape.points, scale, shape.type))
            .id(shape.id)
            .addClass("labelpolygon shape")
            .resize();
          poly.parent().draggable();
          currentShape = poly;
          break;
        }
        default: {
          console.error(shape.type + " does not exist");
        }
      }

      // Sanity checks
      if (currentShape) {
        this.attachEvents(currentShape);
        this.attachShapeListeners(currentShape);
        this.drawFeaturePoints(
          this.getShapeFeaturePoints(currentShape.id()),
          currentShape
        );
      }
    },

    /**
     * Draws all the shapes in the selected image
     */
    drawShapes() {
      if (this.imageSelected) {
        this.imageSelected.shapes.forEach(shapeID => {
          let shape = this.getShapeByID(shapeID);
          this.drawShape(shape);
        });
      }
    },

    /**
     * Flush debounced shape updates on keyup event
     * @param {Event} event - keyup event
     */
    flushShortcuts(event) {
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        debounceUpdateShape.flush();
      }
    },

    /**
     * Gets the feature points from the SVG shape
     * @param {String} shapeID - id of shape
     */
    getFeaturePointsFromSVG(shapeID) {
      let featurePoints = [];
      this.getShapeFeaturePoints(shapeID).forEach(({ id, label }) => {
        let svgFP = getSVG({
          svg: this.$svg,
          id
        });
        let { cx, cy } = svgFP.rbox(this.canvas);
        featurePoints.push(new FeaturePoint({ id, cx, cy, label }));
      });
      return featurePoints;
    },

    /**
     * Returns shape dimensions, used for exporting data
     * Eg. rectangle - [x-coord, y-coord, height, width]
     * @param {SVG.Shape} shape - SVG shape
     * @returns {Array} array filled with shape dimensions
     */
    getPoints(shape) {
      // Maps each shape type to a function
      let map = {
        [RECTANGLE]: () => {
          // Returns rectangle metadata, [x-coord, y-coord, width, height]
          let box = shape.rbox(this.canvas);
          return [box.x, box.y, box.w, box.h];
        },
        [CIRCLE]: () => {
          // Returns circle metadata, [cx-coord, cy-coord, radius]
          var box = shape.rbox(this.canvas);
          return [box.cx, box.cy, shape.attr("r")];
        },
        [POLYGON]: () => {
          /**
           * Returns a list containing pairs of polygon vertices,
           * [point1.x, point1.y, point2.x, point2.y]
           */
          var parentSvg = shape.parent();
          var calculatedPoints = [];
          // Polygon points are relative to it's container SVG
          var vector = {
            x: parseInt(parentSvg.attr("x"), 10) || 0,
            y: parseInt(parentSvg.attr("y"), 10) || 0
          };

          shape.array().value.forEach(pointArray => {
            calculatedPoints.push(
              pointArray[0] + vector.x,
              pointArray[1] + vector.y
            );
          });

          return calculatedPoints;
        }
      };
      return map[shape.type]();
    },

    /**
     * Mouse down on canvas: Draw shapes
     * @param {Event} event - mouse down event
     */
    mouseDown(event) {
      // Deselect all shapes
      this.deselectAll();
      /**
       * Checks that a drawable tool is selected and there exists no shape
       * being drawn
       */
      if (!this.selectedTool) return;
      if (this.alreadyDrawing) return;
      if (this.selectedTool.type !== SHAPE) return;

      this.alreadyDrawing = true;

      // Draw shape, rect/circle/polygon
      let shape = this.selectedTool.create({
        canvas: this.canvas,
        event
      });

      if (this.selectedTool.title !== POLYGON) {
        // Start drawing shape
        shape.draw(event);
      } else {
        // Adds an event listener for Enter to stop drawing polygon
        shape.on("drawstart", function() {
          _.on(document, "keydown", function _stopDrawing(e) {
            if (e.key === "Enter") {
              // Stop drawing
              shape.draw("done");
              shape.off("drawstart");
              // Make parent draggable
              shape.parent().draggable();
              // Remove listener
              _.off(document, "keydown", _stopDrawing);
            }
          });
        });
      }
      // Set drawn shape
      this.drawingShape = shape;
      // Attach listeners to shape
      this.attachShapeListeners(shape);
    },

    /**
     * Move selected shape by (dx, dy) pixels from original position
     * @param {Number} dx - move to left if negative; right if positive
     * @param {Number} dy - move to top if negative; bottom if positive
     */
    moveShape({ dx = 0, dy = 0 } = {}) {
      this.selectedShapes.forEach(shapeID => {
        let svgShape = getSVG({
          svg: this.$svg,
          id: shapeID
        });
        svgShape
          .parent()
          .dx(dx)
          .dy(dy);
        debounceUpdateShape({
          shapeID,
          rbox: svgShape.rbox(this.canvas),
          points: this.getPoints(svgShape),
          featurePoints: this.getFeaturePointsFromSVG(shapeID)
        });
      });
    },

    /**
     * Mouse up event handling
     * @param {Event} event - mouse up event
     */
    mouseUp(event) {
      if (this.drawingShape) {
        // Stops drawing for rectangle/circle; draws point for polygon
        this.drawingShape.draw(event);
      }
    },

    /**
     * Emits "mouse-move" event to MouseCoordBus on mouse move
     * @param {Event} event - mouse move event
     */
    onMouseMove(event) {
      let workcanvas = this.$refs.workcanvas;
      let coordinates = getCoordinates(event, workcanvas);
      /**
       * Emits mouse move event to MouseCoordBus
       * @param {Number} x - x coordinate
       * @param {Number} y - y coordinate
       */
      MouseCoordBus.$emit("mouse-move", coordinates.x, coordinates.y);
    },

    /**
     * Emits "mouse-leave" event to MouseCoordBus on mouse leave
     */
    onMouseLeave() {
      /**
       * Emits "mouse-leave" event to MouseCoordBus
       */
      MouseCoordBus.$emit("mouse-leave");
    },

    /**
     * Paste copied shapes to canvas
     */
    pasteShape() {
      // Empty selected elements
      this.setSelectedElements();

      this.copiedElements.forEach(shape => {
        // Get new shape id
        let shapeID = generateShapeID({ type: shape.type });
        // Scale shape to image
        let scale = this.imageScale / shape.zoomScale;
        let scaledShape = scaleShape({ ...shape, scale });
        // Add shape to image
        this.addShapeToImage({
          ...scaledShape,
          id: shapeID
        });
        // Add shape to selected shapes
        this.addSelectedElement({ shapeID });
        // Add feature points to shape
        shape.featurePoints.forEach(point => {
          let pointID = generateFeaturePointID({ shapeID });
          // scale feature point to image
          let scaledFP = scaleFeaturePoint({ point, scale });
          this.addPointToShape({
            shapeID,
            pointID,
            position: {
              cx: scaledFP.cx,
              cy: scaledFP.cy
            }
          });
        });
      });
      // Redraw canvas
      this.drawCanvas();
    },

    /**
     * Remove selected shapes from canvas
     */
    removeSelectedShapes() {
      // Del key. removes selected shapes and all feature points in shape
      this.selectedShapes.forEach(shapeID => {
        let svgShape = getSVG({
          svg: this.$svg,
          id: shapeID
        });
        // Deselect shape first
        svgShape.selectize(false);
        // Remove shape from store
        this.detachShapeFromImage({ shapeID });
        // Remove shape and feature points from canvas
        svgShape.parent().clear();
        svgShape.remove();
      });
      // Reset selected elements
      this.setSelectedElements();
    },

    /**
     * Select all shapes in the current image
     */
    selectAll() {
      if (this.imageSelected) {
        this.imageSelected.shapes.forEach(shapeID => {
          let shape = getSVG({
            svg: this.$svg,
            id: shapeID
          });
          shape.selectize({
            rotationPoint: false
          });
          this.addSelectedElement({
            shapeID
          });
        });
      }
    },

    /**
     * List of shortcuts
     */
    shortcuts(event) {
      if (event.key === "Delete") {
        event.preventDefault();
        event.stopPropagation();
        // Remove selected shapes from canvas
        this.removeSelectedShapes();
      } else if (event.key === "a" && event.altKey) {
        event.preventDefault();
        event.stopPropagation();
        //Select all the labels
        this.selectAll();
      }

      // Copy paste shortcuts
      let mapCopyPaste = {
        c: this.copyShape,
        v: this.pasteShape
      };

      // Ctrl + c|v
      if (mapCopyPaste[event.key] && event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();

        mapCopyPaste[event.key]();
        return;
      }

      // Move shape by 1 pixel shortcut
      let mapMoveShape = {
        ArrowLeft: { dx: -1 },
        ArrowRight: { dx: 1 },
        ArrowUp: { dy: -1 },
        ArrowDown: { dy: 1 }
      };

      // Ctrl + Shift + Arrow(Left | Right | Up | Down)
      if (mapMoveShape[event.key] && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        this.moveShape(mapMoveShape[event.key]);
        return;
      }
    }
  },
  mounted() {
    // Set up a new canvas
    this.canvas = SVG("work-canvas");
    this.drawCanvas();
    _.on(document, "keydown", this.shortcuts);
    _.on(document, "keyup", this.flushShortcuts);
  },
  destroyed() {
    // Remove all children and the canvas itself
    this.canvas.clear();
    this.canvas.remove();
    _.off(document, "keydown", this.shortcuts);
    _.off(document, "keyup", this.flushShortcuts);
  }
};
</script>

<style lang="css" scoped>
  #canvas-container {
    height: 100%;
    display: block;
    overflow: auto;
    position: relative;
  }

  #work-canvas {
    position: absolute;
    z-index: 1;
  }

  #img {
  	position: absolute;
  	top: 0px;
  	left: 0px;
  }
</style>
