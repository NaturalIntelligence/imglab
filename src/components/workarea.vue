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
        @mouseout="showTrackingLine = false">
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
import TrackingLines from './tracking-lines/tracking-lines'
import { mapGetters } from 'vuex';
import { getCoordinates } from "../utils/app";

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
    // Map getters from actions-config.js
    ...mapGetters('actions-config', {
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
      this.drawCanvas();
      return (this.imageSelected && this.imageSelected.size.imageScale) || 0;
    }
  },
  methods: {
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
        let SVG = this.$svg;
        // Replace canvas with a new one
        this.canvas.remove();
        this.canvas = new SVG("work-canvas");
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
      let scale = this.iamgeSelected.size.imageScale;
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
    }
  },
  mounted() {
    // Set up a new canvas
    let SVG = this.$svg;
    let canvas = new SVG("work-canvas");
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
