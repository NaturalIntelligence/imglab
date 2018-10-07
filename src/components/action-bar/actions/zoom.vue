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

export default {
  data() {
    return {
      scale: 100
    }
  },
  computed: {
    ...mapGetters("image-store", {
      imageSelected: "getImageSelected"
    }),

    ...mapGetters("app-config", {
      zoomStepSize: "getZoomStepSize"
    }),

    ...mapGetters("image-store", {
      imageSelected: "getImageSelected"
    }),

    imageScale() {
      return this.imageSelected ?
        Math.floor(this.imageSelected.size.imageScale * 100) : 100;
    }
  },
  methods: {
    ...mapMutations("image-store", [
      "setImageSelected"
    ]),

    /**
     * Zoom in
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
     * Zoom out
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
      this.imageSelected.shapes.forEach(shape => {
        shape.zoomScale = shape.defaultZoomScale;
      });
    },

    /**
     * Helper function to rescale shapes in selected image and set new scale
     * @param {Number} oldScale - old image scale
     * @param {Number} newScale - new image scale
     */
    rescaleShapes(oldScale, newScale) {
      // Increase/Decrease each image scale
      this.imageSelected.shapes.forEach(shape => {
        shape.zoomScale = shape.zoomScale * newScale / oldScale;
      });
    },

    /**
     * Helper method to rescale image
     * @param {Number} newScale - new image scale
     */
    rescaleImage(newScale) {
      this.imageSelected.size.scaledWidth =
        Math.floor(this.imageSelected.size.width * newScale);
      this.imageSelected.size.scaledHeight =
        Math.floor(this.imageSelected.size.height * newScale);
      // Set new image scale
      this.imageSelected.size.imageScale = newScale;
    }
  }
}
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
