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
        @mouseover="showTrackingLine = true"
        @mousemove="showPosition"
        @mouseleave="mouseLeave"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
      >
        <!-- <tracking-lines
          :show="showTrackingLine"
          :xPos="xPos"
          :yPos="yPos"
        >
        </tracking-lines> -->
      </div>
    </div>
  </div>
</template>

<script>
import TrackingLines from "./tracking-lines/tracking-lines";
import { FeaturePoint } from "../models/FeaturePoint";
import { mapGetters, mapMutations } from "vuex";
import { getCoordinates, _, getSVG } from "../utils/app";
import { dispatch } from "../utils/actions.js";
import { RECTANGLE, CIRCLE, POLYGON, POINT, MOVE, ZOOM, OPACITY } from "../utils/tool-names";
import { drawPoint } from "./tools/tools/point";
import { scaleFeaturePoints, scaleShapePoints } from "../utils/scale-shapes";
import { KEY } from "../utils/actions";
import SVG from "svg.js";

const debounce = require("lodash.debounce");

export default {
  components: {
    'tracking-lines': TrackingLines
  },
  data() {
    return {
      alreadyDrawing: false,
      canvas: null,
      showTrackingLine: false,
      xPos: 0,
      yPos: 0,
      drawingShape: undefined
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
      // this.$nextTick(function() {
        this.setSelectedElements();
        this.drawCanvas();
      // });
    },

    /**
     * Redraw canvas when image scale changes
     */
    imageScale() {
      // this.$nextTick(function() {
        this.drawCanvas();
      // });
    },

    selectedFeaturePoints() {
      // this.$nextTick(function() {
        this.selectedFeaturePoints.forEach(featurePointID => {
          let svgFP = getSVG({ svg: this.$svg, id: featurePointID });
          svgFP.selectize({
            rotationPoint: false,
            points: []
          });
        });
      // })
    }
  },
  methods: {
    ...mapMutations("action-config", [
      "setCopiedElements",
      "addSelectedElement",
      "setSelectedElements"
    ]),

    ...mapMutations("image-store", [
      "addImageToStore",
      "addShapeToImage",
      "addPointToShape",
      "updateFeaturePoint",
      "updateShapeDetail"
    ]),

    ...mapMutations("image-store", {
      "updateFeaturePointsInStore": "updateFeaturePoints"
    }),

    /**
     * Sets the mouse position accordingly
     * @param {MouseEvent} event - mouse event
     * @see getCoordinates() for more information about calculating mouse coordinates
     */
    showPosition(event) {
      let workcanvas = this.$refs.workcanvas;
      let coordinates = getCoordinates(event, workcanvas);

      this.xPos = coordinates.x;
      this.yPos = coordinates.y;
    },

    /**
     * Draws all the shapes and fill their labels
     */
    drawCanvas() {
      if (this.canvas) {
        // Removes all children and replaces canvas with a new one
        this.canvas.clear();
        this.canvas.remove();
        this.canvas = SVG("work-canvas");
        // Draws all shapes in image
        this.drawShapes()
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
        })
      }
    },

    /**
     * Draws a single shape
     * @param {Shape} shape - shape object
     */
    drawShape(shape) {
      if (!shape) return;
      let scale = this.imageScale;
      let currentShape;
      switch (shape.type) {
        case RECTANGLE:
          let rect = this.canvas
            .nested()
            .rect(shape.points[2] * scale, shape.points[3] * scale)
            .move(shape.points[0] * scale, shape.points[1] * scale)
            .id(shape.id)
            .addClass('labelbox shape')
            .resize();
          rect.parent().draggable();
          currentShape = rect;
          break;
        case CIRCLE:
          let circle = this.canvas
            .nested()
            .circle()
            .radius(shape.points[2] * scale)
            .attr({
              cx: shape.points[0] * scale,
              cy: shape.points[1] * scale
            })
            .id(shape.id)
            .addClass('labelcircle shape')
            .resize();
          circle.parent().draggable();
          //Add feature points
          currentShape = circle;
          break;
        case POLYGON:
          var poly = this.canvas
            .nested()
            .polygon(scaleShapePoints(shape.points, scale, shape.type))
            .id(shape.id)
            .addClass('labelpolygon shape')
            .resize();
          poly.parent().draggable();
          currentShape = poly;
          break;
        default:
          console.error(shape.type + ' does not exist');
          break;
      }

      // Sanity checks
      if (currentShape) {
        this.attachEvents(currentShape);
        this.attachShapeListeners(currentShape);
        this.drawFeaturePoints(this.getShapeFeaturePoints(currentShape.id()), currentShape);
      }
    },

    /**
     * Deselects previously selected elements and selects the current element
     */
    mouseDown(event) {
      this.deselectAll();

      if (this.selectedTool && this.selectedTool.drawable
        && !this.alreadyDrawing) {
        // Set drawing flag to true
        this.alreadyDrawing = true;
        // Creates a new shape, rect/circle/polygon
        let shape = this.selectedTool.create({
          canvas: this.canvas,
          event
        });

        if (shape.type !== POLYGON) {
          shape.draw(event);
        } else {
          shape.draw();
          // Adds an event listener for Enter to stop drawing polygon
          shape.on("drawstart", function() {
            document.addEventListener("keydown", function(e) {
              if (e.keyCode == KEY.ENTER) {
                shape.draw("done");
                shape.off("drawstart");
                shape.parent().draggable();
              }
            });
          });
        }
        this.drawingShape = shape;

        this.attachShapeListeners(shape);
      }
    },

    /**
     * Event handling for mouse up
     */
    mouseUp(event) {
      if (this.selectedTool && this.selectedTool.drawable && this.alreadyDrawing) {
        this.drawingShape.draw(event);
      }
    },

    /**
     * Event handling when mouse moves out of canvas
     */
    mouseLeave(event) {
      // Hide tracking lines
      this.showTrackingLine = false;
    },

    /**
     * Closure function to monitor shape drag event
     * @param {SVG.Shape} el - a SVG shape to attach drag listener to
     * @param {Function} cb - callback function
     */
    customDragHandler(el, cb) {
      var mousestate = 0;
      el.on("mousedown", function(e) {
        mousestate = 1;

        let _mousemove = function(e) {
          mousestate = 2;
        }
        let _mouseup = function(e) {
          if (mousestate === 2) {
              cb && cb(e);
          }
          mousestate = 0;
          // unbind events
          el.off("mousemove", _mousemove);
          el.off("mouseup", _mouseup);
        }
        // bind events
        el.on("mousemove", _mousemove);
        el.on("mouseup", _mouseup);
      });
    },

    /**
     * Deselects all selected shapes / featurepoints
     * Able to specify which element to keep by passing in an options object
     * @param {Boolean} shape - deselect shape
     * @param {Boolean} featurePoint - deselect feature point
     */
    deselectAll({ shape = false, featurePoint = false } = {}) {
      // Deselect all svg elements
      this.selectedShapes.forEach(shapeID => {
        let domShape = document.getElementById(shapeID);
        let svgShape = this.$svg.adopt(domShape);
        svgShape.selectize(false);
      })

      this.selectedFeaturePoints.forEach(featurePointID => {
        let svgFP = getSVG({ svg: this.$svg, id: featurePointID });
        svgFP.selectize(false);
      })

      // Set selected elements
      this.setSelectedElements({
        shapes: shape ? this.selectedShapes : [],
        featurePoints: featurePoint ? this.selectedFeaturePoints : []
      });
    },

    /**
     * Select all shapes in the current image
     */
    selectAll() {
      if (this.imageSelected) {
        this.imageSelected.shapes.forEach(shapeID => {
          let shape = getSVG({ svg: this.$svg, id: shapeID });
          shape.selectize({
            rotationPoint: false
          });
          this.addSelectedElement({
            shapeID
          });
        })
      }
    },

    /**
     * Allows shapes to be dragged only if move tool is selected
     * @param {SVG.Shape} shape - SVG element
     */
    dragOnMove(shape) {
      shape.on("mousedown", function(event) {
        if (!this.selectedTool || this.selectedTool.type !== "move") {
          event.preventDefault();
          event.stopPropagation();
        }
      }, this);
    },

    /**
     * Attach draw and resize listeners to a shape
     * @param {SVG.Shape} shape - SVG shape
     */
    attachShapeListeners(shape) {
      /**
       * Set draw stop to false once done with drawing
       * Make sure that the shape size is large enough to prevent accidental draws
       * Add shape to image if valid, remove previously drawn shape otherwise
       */
      shape.on("drawstop", () => {
        // Reset flags
        this.alreadyDrawing = false;
        this.drawingShape = undefined;
        if (!this.selectedTool.validate(shape)) {
          shape.parent().remove();
          shape.remove();
        } else {
          // Make shape draggable
          shape.parent().draggable();
          // Attach shape data
          let points = this.getPoints(shape);
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

      shape.on('resizedone', () => {
        this.updateShapeDetail({
          shapeID: shape.node.id,
          rbox: shape.rbox(this.canvas),
          points: this.getPoints(shape),
        });
      });
    },

    /**
     * Returns the shapes that make up the SVG Element
     * Eg. four points of a rectangle
     * @param {SVG.Shape} shape - SVG shape
     */
    getPoints(shape) {
      // Maps each shape type to a function
      let map = {
        // Returns rectangle metadata, [x-coord, y-coord, width, height]
        [RECTANGLE]: () => {
          let box = shape.rbox(this.canvas);
          return [box.x, box.y, box.w, box.h]
        },
        // Returns circle metadata, [cx-coord, cy-coord, radius]
        [CIRCLE]: () => {
          var box = shape.rbox(this.canvas);
          return [box.cx, box.cy, shape.attr("r")];
        },
        // Returns list of polygon vertices, [[point1.x, point1.y], ...]
        [POLYGON]: () => {
          var parentSvg = shape.parent();
          var calculatedPoints = [];
          // Polygon points are relative to it's container SVG
          var vector = {
            x: parseInt(parentSvg.attr("x"), 10) || 0,
            y: parseInt(parentSvg.attr("y"), 10) || 0
          }

          shape.array().value.forEach(pointArray => {
            calculatedPoints.push(pointArray[0] + vector.x, pointArray[1] + vector.y);
          });

          return calculatedPoints;
        }
      };
      return map[shape.type]();
    },

    /**
     * @param {SVG.Shape} shape - SVG shape
     */
    attachEvents(shape) {
      this.dragOnMove(shape);

      this.customDragHandler(shape.parent(), event => {
        if (this.selectedTool && this.selectedTool.type === MOVE) {
          this.updateShapeDetail({
            shapeID: shape.node.id,
            rbox: shape.rbox(this.canvas),
            points: this.getPoints(shape)
          });
          this.updateFeaturePoints(shape);
        }
      });

      shape.on("click", event => {
        event.stopPropagation();

        if (this.selectedTool && this.selectedTool.type === "point") {
          // Selected tool is point, has highest precedence
          var point = drawPoint({
            position: event,
            canvasOffset: this.canvas.node.getBoundingClientRect(),
            shape,
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
     * Attach events to feature points
     * @param {SVG.Circle} featurePoint - SVG circle representing feature point
     * @param {SVG.Shape} shape - SVG shape
     */
    attachEventsToFeaturePoint(featurePoint, shape) {
      this.dragOnMove(featurePoint);

      this.customDragHandler(featurePoint, event => {
        this.updateFeaturePoint({
          shapeID: shape.id(),
          pointID: featurePoint.id(),
          position: featurePoint.rbox(this.canvas)
        });
      });

      featurePoint.on('click', event => {
        shape.selectize(false);

        if (!event.ctrlKey) {
          // Single select
          this.deselectAll({ shape: true });
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
     * Loops through feautre points of shape and updates their position
     * @param {SVG.Shape} shape - SVG shape
     */
    updateFeaturePoints(shape) {
      let shapeFeaturePoints = this.getShapeFeaturePoints(shape.id());
      // Map feature point ID to label
      let fpLabelToID = {};
      shapeFeaturePoints.forEach(({id , label}) => {
        fpLabelToID[id] = label;
      });
      // Create a list of feature points with the updated position
      let featurePoints = shape.siblings().reduce((accumulator, point) => {
        if (point.attr("for")) {
          let pos = point.rbox(this.canvas);
          accumulator.push(
            new FeaturePoint({
              x: pos.cx,
              y: pos.cy,
              label: fpLabelToID[point.id()],
              id: point.id()
            })
          );
        }
        return accumulator;
      }, []);

      // Update feature point in store
      this.updateFeaturePointsInStore({
        shapeID: shape.id(),
        featurePoints
      });
    },

    /**
     * Draws all the feature points in the shape according to
     * current image scale and attachEventListeners to points
     * @param {FeaturePoint[]} fPoints - array of shape featurePoints
     * @param {SVG.Shape} shape - shape that contains the feature points
     * @see getPoints
     */
    drawFeaturePoints(fPoints, shape) {
      let scaledFPoints = scaleFeaturePoints(fPoints, this.imageSelected.size.imageScale);
      for (var fPointIndex in scaledFPoints) {
        var fPoint = drawPoint({
          position: scaledFPoints[fPointIndex],
          canvasOffset: { x: 0, y: 0 },
          shape,
          featurePointSize: this.featurePointSize,
          featurePointColor: this.featurePointColor
        });
        fPoint.id(scaledFPoints[fPointIndex].id);
        this.attachEventsToFeaturePoint(fPoint, shape);
      }
    }
  },
  mounted() {
    // Set up a new canvas
    this.canvas = SVG("work-canvas");
    this.drawCanvas();
  },
  destroyed() {
    // Remove all children and the canvas itself
    this.canvas.clear();
    this.canvas.remove();
  }
}
</script>

<style lang="css" scoped>
  #canvas-container {
    height: calc(100vh - 190px);
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
