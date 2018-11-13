<template lang="html">
  <div class="zoom-bar">
    <div class="zoom-button">
      <font-awesome-icon
        :icon="['fas', 'search-plus']"
        style="font-size: 1.5em"
        @click="zoomIn"
      >
      </font-awesome-icon>
    </div>
    <div>
      <input
        id="zoom-scale"
        type='text'
        :value="imageScale + '%'"
        maxlength="4"
        size="4"
        disabled
      />
    </div>
    <div class="zoom-button">
      <font-awesome-icon
        :icon="['fas', 'search-minus']"
        @click="zoomOut"
      >
      </font-awesome-icon>
    </div>
    <div class="zoom-button">
      <font-awesome-icon
        :icon="['fas', 'undo']"
        @click="zoomReset"
      >
      </font-awesome-icon>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { _ } from "../../../utils/app";

/**
 * Rescales all items in the canvas, excluding the feature point
 */
export default {
  data() {
    return {
      // Current zoom scale
      scale: 100
    };
  },
  computed: {
    ...mapGetters("image-store", {
      imageSelected: "getImageSelected",
      getShapeByID: "getShapeByID"
    }),

    ...mapGetters("app-config", {
      zoomStepSize: "getZoomStepSize"
    }),

    /**
     * Returns image scale; default is 100%
     */
    imageScale() {
      return this.imageSelected
        ? Math.floor(this.imageSelected.size.imageScale * 100)
        : 100;
    }
  },
  methods: {
    ...mapMutations("image-store", ["updateShapeDetail", "updateImageDetail"]),

    /**
     * Zoom in: Scale up both image and shapes
     */
    zoomIn() {
      // No image selected, stop
      if (!this.imageSelected) return;
      // Image scale too large, stop
      if (this.imageSelected.size.imageScale >= 10) return;

      const oldScale = this.imageSelected.size.imageScale;
      const newScale = oldScale + this.zoomStepSize;

      // Rescale image and shape
      this.rescaleImage(newScale);
      this.rescaleShapes(oldScale, newScale);
    },

    /**
     * Zoom out: Scale down both image and shapes
     */
    zoomOut() {
      // No image selected, stop
      if (!this.imageSelected) return;
      // Image scale too small, stop
      if (this.imageSelected.size.imageScale <= 0.1) return;

      const oldScale = this.imageSelected.size.imageScale;
      const newScale = oldScale - this.zoomStepSize;

      // Rescale image and shape
      this.rescaleImage(newScale);
      this.rescaleShapes(oldScale, newScale);
    },

    /**
     * Resets zoom to 100%
     * All shapes are transformed to match their size at 100% image scale
     */
    zoomReset() {
      // No image selected, stop
      if (!this.imageSelected) return;

      // Rescale image
      this.rescaleImage(1);
      // Reset shapes to its original scale
      this.imageSelected.shapes.forEach(shapeID => {
        let shape = this.getShapeByID(shapeID);
        this.updateShapeDetail({
          shapeID: shape.id,
          zoomScale: shape.defaultZoomScale
        });
      });
    },

    /**
     * Rescale shapes in selected image and set new scale
     * @param {Number} oldScale - old image scale
     * @param {Number} newScale - new image scale
     */
    rescaleShapes(oldScale, newScale) {
      // Increase/Decrease each image scale
      this.imageSelected.shapes.forEach(shapeID => {
        let shape = this.getShapeByID(shapeID);
        this.updateShapeDetail({
          shapeID: shape.id,
          zoomScale: (shape.zoomScale * newScale) / oldScale
        });
      });
    },

    /**
     * Rescale image dimensions by new scale
     * @param {Number} newScale - new image scale
     */
    rescaleImage(newScale) {
      this.updateImageDetail({
        scaledWidth: Math.floor(this.imageSelected.size.width * newScale),
        scaledHeight: Math.floor(this.imageSelected.size.height * newScale),
        imageScale: newScale
      });
    },

    /**
     * List of shortcuts
     * @param {Event} event - keydown event
     */
    shortcuts(event) {
      let key = event.key;
      let zoomKeys = ["[", "]"];
      if (!zoomKeys.includes(key)) return;
      if (event.altKey && !event.ctrlKey) {
        key === "]" ? this.zoomIn() : this.zoomOut();
      }
    }
  },
  created() {
    _.on(document, "keydown", this.shortcuts);
  },
  beforeDestroy() {
    _.off(document, "keydown", this.shortcuts);
  }
};
</script>

<style lang="css" scoped>
.zoom-bar{
    display: flex;
  }
  .zoom-bar > div:not(:first-child){
    margin-left: .2em;
  }
  .zoom-button{
    padding: .3em;
    cursor: pointer;
  }
  .zoom-button:not(.zoom-selected):hover{
    background: grey;
  }
  input[type="text"]{
    border: 0px;
    text-align:center;
    margin-top:.2em;
  }
</style>
