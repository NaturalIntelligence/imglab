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
import {
  mapGetters,
  mapMutations
} from "vuex";
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
  MOVE
} from "../../utils/tool-names";
import {
  drawPoint
} from "../tools/tools/point";
import {
  scaleFeaturePoints,
  scaleShapePoints
} from "../../utils/scale-shapes";
import {
  KEY
} from "../../utils/actions";
import SVG from "svg.js";
import {
  MouseCoordBus
} from "../../utils/mouseCoordBus";
import {
  Shape
} from "../../models/Shape";
import {
  FeaturePoint
} from "../../models/FeaturePoint"
import { debounceUpdateShape, debounceUpdateFeaturePoint } from "./util.js";

export default {
  data() {
    return {
      alreadyDrawing: false,
      canvas: null,
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
      this.setSelectedElements();
      this.drawCanvas();
    },

    /**
     * Redraw canvas when image scale changes
     */
    imageScale() {
      this.drawCanvas();
    },

    selectedShapes() {
      this.selectedShapes.forEach(shapeID => {
        let svgShape = getSVG({
          svg: this.$svg,
          id: shapeID
        });
        svgShape.selectize({
          rotationPoint: false
        })
      })
    },

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
     * Draws all the shapes and fill their labels
     */
    drawCanvas() {
      if (this.canvas) {
        // Removes all children and replaces canvas with a new one
        this.canvas.clear();
        this.canvas.remove();
        this.canvas = SVG("work-canvas");
        // Draws all shapes in image
        this.drawShapes();
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
     * Draws a single shape
     * @param {Shape} shape - shape object
     */
    drawShape(shape) {
      if (!shape) return;
      let scale = this.imageScale;
      let currentShape;
      switch (shape.type) {
        case RECTANGLE:
          {
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
        case CIRCLE:
          {
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
        case POLYGON:
          {
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
        default:
          {
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
     * Deselects previously selected elements and selects the current element
     */
    mouseDown(event) {
      this.deselectAll();

      if (
        this.selectedTool &&
        this.selectedTool.drawable &&
        !this.alreadyDrawing
      ) {
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
      if (
        this.selectedTool &&
        this.selectedTool.drawable &&
        this.alreadyDrawing
      ) {
        this.drawingShape.draw(event);
      }
    },

    /**
     * Mouse over event
     */
    onMouseMove(event) {
      let workcanvas = this.$refs.workcanvas;
      let coordinates = getCoordinates(event, workcanvas);

      MouseCoordBus.$emit("mouse-move", coordinates.x, coordinates.y);
    },

    /**
     * Event handling when mouse moves out of canvas
     */
    onMouseLeave(event) {
      MouseCoordBus.$emit("mouse-leave");
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
     * @param {Boolean} shape - deselect shape
     * @param {Boolean} featurePoint - deselect feature point
     */
    deselectAll({
      shape = false,
      featurePoint = false
    } = {}) {
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

      shape.on("resizedone", () => {
        debounceUpdateShape({
          shapeID: shape.node.id,
          rbox: shape.rbox(this.canvas),
          points: this.getPoints(shape)
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
          return [box.x, box.y, box.w, box.h];
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
     * Loops through feautre points of shape and updates their position
     * @param {SVG.Shape} shape - SVG shape
     */
    updateFeaturePoints(shape) {
      let shapeFeaturePoints = this.getShapeFeaturePoints(shape.id());
      // Map feature point ID to label
      let fpLabelToID = {};
      shapeFeaturePoints.forEach(({
        id,
        label
      }) => {
        fpLabelToID[id] = label;
      });
      // Create a list of feature points with the updated position
      let featurePoints = shape.siblings().reduce((accumulator, point) => {
        if (point.attr("for")) {
          let pos = point.rbox(this.canvas);
          accumulator.push(
            new FeaturePoint({
              cx: pos.cx,
              cy: pos.cy,
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

    flushShortcuts(event) {
      if (event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        debounceUpdateShape.flush();
      }
    },

    /**
     * List of shortcuts
     */
    shortcuts(event) {
      if (event.key === "Delete") {
        event.preventDefault();
        event.stopPropagation();
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
        });

        this.setSelectedElements();
        // Redraw canvas
        this.drawCanvas();
      } else if (event.key === 'a' && event.altKey) {
        //Select all the labels
        this.selectAll();
        event.preventDefault();
        event.stopPropagation();
      } else if (event.key === 'c' && event.ctrlKey) {
        // Prevent browser defaults
        event.preventDefault();
        event.stopPropagation();
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
          let _shape = new Shape(shape);
          _shape.featurePoints = _featurePoints;
          // Add copied shape to store
          this.addCopiedElement({ item: _shape });
        });

      } else if (event.key === 'v' && event.ctrlKey) {
        // Stop browser default actions
        event.preventDefault();
        event.stopPropagation();

        // Empty selected elements
        this.setSelectedElements();

        this.copiedElements.forEach(shape => {
          // Get new shape id
          let shapeID = generateShapeID({ type: shape.type });
          // Add shape to image
          this.addShapeToImage({
            ...shape,
            id: shapeID,
          });
          // Add shape to selected shapes
          this.addSelectedElement({ shapeID });
          // Add feature points to shape
          shape.featurePoints.forEach(point => {
            let pointID = generateFeaturePointID({ shapeID });
            this.addPointToShape({
              shapeID,
              pointID,
              position: {
                cx: point.cx,
                cy: point.cy
              }
            });
          });
        });
        // Redraw canvas
        this.drawCanvas();
      } else if (event.key === 'ArrowLeft' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        this.selectedShapes.forEach(shapeID => {
          let svgShape = getSVG({
            svg: this.$svg,
            id: shapeID
          });
          svgShape.parent().dx(-1);
          debounceUpdateShape({
            shapeID,
            rbox: svgShape.rbox(this.canvas),
            points: this.getPoints(svgShape),
            featurePoints: this._updateFeaturePoints(shapeID)
          });
        });
      } else if (event.key === 'ArrowRight' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        this.selectedShapes.forEach(shapeID => {
          let svgShape = getSVG({
            svg: this.$svg,
            id: shapeID
          });
          svgShape.parent().dx(1);
          debounceUpdateShape({
            shapeID,
            rbox: svgShape.rbox(this.canvas),
            points: this.getPoints(svgShape),
            featurePoints: this._updateFeaturePoints(shapeID)
          });
        });

      } else if (event.key === 'ArrowUp' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        this.selectedShapes.forEach(shapeID => {
          let svgShape = getSVG({
            svg: this.$svg,
            id: shapeID
          });
          svgShape.parent().dy(-1);
          debounceUpdateShape({
            shapeID,
            rbox: svgShape.rbox(this.canvas),
            points: this.getPoints(svgShape),
            featurePoints: this._updateFeaturePoints(shapeID)
          });
        });
      } else if (event.key === 'ArrowDown' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();

        this.selectedShapes.forEach(shapeID => {
          let svgShape = getSVG({
            svg: this.$svg,
            id: shapeID
          })
          svgShape.parent().dy(1);
          debounceUpdateShape({
            shapeID,
            rbox: svgShape.rbox(this.canvas),
            points: this.getPoints(svgShape),
            featurePoints: this._updateFeaturePoints(shapeID)
          });
        });
      }
    },

    _updateFeaturePoints(shapeID) {
      let featurePoints = [];
      this.getShapeFeaturePoints(shapeID).forEach(({ id, label }) => {
        let svgFP = getSVG({
          svg: this.$svg,
          id
        });
        let { cx, cy } = svgFP.rbox(this.canvas);
        featurePoints.push(new FeaturePoint({ id, cx, cy, label }))
      });
      return featurePoints;
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
