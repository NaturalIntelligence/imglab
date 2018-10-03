<template lang="html">
  <div
    id="canvas-container">
    <div
      class="canvas-wrapper"
      :style="{ width: (imageWidth + 50) + 'px', height: (imageHeight + 50) + 'px' }">
      <img
        id="img"
        :src="imageSrc"
        :style="{ width: imageWidth  + 'px', height: imageHeight + 'px' }"
      />
      <div
        id="work-canvas"
        ref="workcanvas"
        :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
        @mouseover="showTrackingLine = true"
        @mousemove="showPosition"
        @mouseout="showTrackingLine = false"
        @mousedown="mouseDown"
        @mouseup="mouseUp">
        <!-- Span used for calculating image scale changes  -->
        <span
          visibility="hidden"
          style="position: absolute;"
          :data-scale="imageScale"></span>
        <tracking-lines
          :show="showTrackingLine"
          :xPos="xPos"
          :yPos="yPos"
        ></tracking-lines>
      </div>
    </div>
  </div>
</template>

<script>
import TrackingLines from "./tracking-lines/tracking-lines";
import { mapGetters, mapMutations } from "vuex";
import { getCoordinates } from "../utils/app";
import { dispatch } from "../utils/actions.js";
import { RECTANGLE, CIRCLE, POLYGON } from "../utils/tool-names";

const debounce = require("lodash.debounce");

export default {
  components: {
    'tracking-lines': TrackingLines
  },
  data() {
    return {
      showTrackingLine: false,
      xPos: 0,
      yPos: 0,
      canvas: null
    };
  },
  computed: {
    // Map getters from action-config.js
    ...mapGetters('action-config', {
      copiedElements: 'getCopiedElements',
      selectedTool: 'getSelectedTool',
      selectedElement: 'getSelectedElement',
      selectedElements: 'getSelectedElements',
      alreadyDrawing: 'getAlreadyDrawing'
    }),

    // Map getters from image-store.js
    ...mapGetters('image-store', {
      imageSelected: 'getImageSelected'
    }),

    // Get image width
    imageWidth() {
      return (this.imageSelected && this.imageSelected.size.scaledWidth) || 0;
    },

    // Get image height
    imageHeight() {
      return (this.imageSelected && this.imageSelected.size.scaledHeight) || 0;
    },

    // Get image selected source
    imageSrc() {
      return (this.imageSelected && this.imageSelected.src) || "";
    },

    // Trick: Returns image scale and redraws canvas everytime image/scale changes
    imageScale() {
      return (this.imageSelected && this.imageSelected.size.imageScale) || 0;
    }
  },
  watch: {
    /**
     * Call draw canvas when image scale changes
     */
    imageScale() {
      this.drawCanvas();
    }
  },
  methods: {
    ...mapMutations("action-config", [
      "setAlreadyDrawing",
      "setSelectedElement"
    ]),

    ...mapMutations("image-store", [
      "addImageToStore",
      "addShapeToImage",
      "updateFeaturePoint",
      "updateShapeDetail"
    ]),

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
        // Replace canvas with a new one
        this.canvas.remove();
        this.canvas = this.$svg("work-canvas");
        // Draws all shapes in image
        this.drawShapes()
      }
    },

    /**
     * Draws all the shapes in the selected image
     */
    drawShapes() {
      if (this.imageSelected) {
        this.imageSelected.shapes.forEach(shape => {
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
        case "rect":
          let rect = this.canvas.nested()
            .rect(shape.points[2] * scale, shape.points[3] * scale)
            .move(shape.points[0] * scale, shape.points[1] * scale)
            .addClass('labelbox shape')
            .id(shape.id)
            .resize();
          rect.parent().draggable();
          currentShape = rect;
          break;
      }
    },

    /**
     * Deselects previously selected elements and selects the current element
     */
    mouseDown(event) {
      this.deselectAll();

      if (this.selectedTool && this.selectedTool.type !== "point"
        && !this.alreadyDrawing && this.selectedTool.drawable) {
        // Creates a new shape
        let shape = this.selectedTool.create(this.canvas, event);
        this.attachShapeListeners(shape);

        if (shape.type !== "polygon") shape.draw(event);
        this.setSelectedElement({ selectedElement: shape });
      }
    },

    /**
     *
     */
    mouseUp(event) {
      if (this.selectedTool && this.selectedElement) {
        this.selectedElement.draw(event);
      }
    },

    /**
     * Deselects all selectedElements
     * @see getSelectedElements for more details
     */
    deselectAll() {
      if (this.selectedElements) {
        this.selectedElements.forEach(el => {
          el.selectize(false, {
            deepSelect: true
          });
          el.selectize(false);
        })
      }
    },

    /**
     * Allows shapes to be dragged only if move tool is selected
     * @param {SVG.Shape} shape - SVG element
     */
    dragOnMove(shape) {
      shape.on("mousedown", (event) => {
        if (!this.selectedTool || this.selectedTool.type !== "move") {
          event.preventDefault();
          event.stopPropogation();
        }
      })
    },

    /**
     * Attach draw and resize listeners to a shape
     * @param {SVG.Shape} shape - SVG shape
     */
    attachShapeListeners(shape) {
      // Set draw start to true when drawing
      shape.on("drawstart", () => {
        this.setAlreadyDrawing({
          alreadyDrawing: true
        });
      });

      /**
       * Set draw stop to false once done with drawing
       * Make sure that the shape size is large enough to prevent accidental draws
       * Add shape to image if valid, remove previously drawn shape otherwise
       */
      shape.on("drawstop", () => {
        this.setAlreadyDrawing({
          alreadyDrawing: false
        });

        if (!this.selectedTool.validate(shape)) {
          shape.parent().remove();
          shape.remove();
        } else {
          // Attach shape data
          let points = this.getPoints(shape);
          this.addShapeToImage({
            id: shape.node.id,
            type: shape.type,
            rbox: shape.rbox(this.canvas),
            points: this.getPoints(shape)
          });
          //
          this.attachEvents(shape);
        }
      });

      shape.on('resizedone', () => {
        this.updateShapeDetail(
          shape.node.id,
          shape.rbox(this.canvas),
          getPoints(shape)
        );
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
        [RECTANGLE]: function() {
          let box = shape.rbox(this.canvas);
          return [box.x, box.y, box.w, box.w]
        },
        // Returns circle metadata, [cx-coord, cy-coord, radius]
        [CIRCLE]: function() {
          var box = shape.rbox(this.canvas);
          return [box.cx, box.cy, shape.attr("r")];
        },
        // Returns list of polygon vertices, [[point1.x, point1.y], ...]
        [POLYGON]: function() {
          var parentSvg = shape.parent();
          var calculatedPoints = [];
          // Polygon points are relative to it's container SVG
          var vector = {
              x: parseInt(parentSvg.attr("x"), 10) || 0,
              y: parseInt(parentSvg.attr("y"), 10) || 0
          }

          shape.array().value.forEach(pointArray => {
              calculatedPoints.push([pointArray[0] + vector.x, pointArray[1] + vector.y]);
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

      // TODO: Complete actions
    }
  },
  mounted() {
    // Set up a new canvas
    let canvas = this.$svg("work-canvas");
    this.canvas = canvas;
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
