<template lang="html">
  <div class="action-wrapper">
    <div class="range-slider">
      <input
        class="input-range"
        type="range"
        step="1"
        :value="featurePointSize"
        min="3"
        max="100"
        @input="setPointSize"
      >
    </div>

    <div class="colorpicker">
      <input
        type="color"
        id="colorpicker"
        name="colorpicker"
        :value="featurePointColor"
        @change="setColorInStore"
        @input="switchColor($event.target.value)"
      >
    </div>
  </div>
</template>

<script>
import { getSVG } from "../../../utils/app";
import { mapGetters, mapMutations } from "vuex";

const throttle = require("lodash.throttle");

/**
 * Sets feature point color and feature point size
 */
export default {
  computed: {
    /**
     * Computed getters from image-store and app-config
     */
    ...mapGetters("image-store", {
      imageSelected: "getImageSelected",
      featurePointSize: "getFeaturePointSize",
      getShapeFeaturePoints: "getShapeFeaturePoints",
      getShapeByID: "getShapeByID"
    }),

    ...mapGetters("app-config", {
      featurePointColor: "getFeaturePointColor"
    })
  },
  methods: {
    ...mapMutations("image-store", {
      setFeaturePointSize: "setFeaturePointSize"
    }),

    ...mapMutations("app-config", {
      setFeaturePointColor: "setFeaturePointColor"
    }),

    /**
     * Apply changes to all feature points in current image via callback function
     * @param {Function} cb - callback function
     */
    applyFeaturePointChanges(cb) {
      if (!this.imageSelected) return;

      let shapes = this.imageSelected.shapes.map(shapeID => {
        return this.getShapeByID(shapeID);
      });

      shapes.forEach(shape => {
        shape.featurePoints.forEach(cb);
      });
    },

    /**
     * Sets feature point color in store
     * @param {Event} event - change event
     */
    setColorInStore(event) {
      if (this.featurePointColor === event.target.value) return;
      this.setFeaturePointColor({ featurePointColor: event.target.value });
    },

    /**
     * Sets the feature point size
     * @param {Event} event - change event
     */
    setPointSize: throttle(function(event) {
      this.setFeaturePointSize({ featurePointSize: event.target.value });

      this.applyFeaturePointChanges(featurePointID => {
        let svgFP = getSVG({ svg: this.$svg, id: featurePointID });
        svgFP.radius(event.target.value);
      });
    }, 33),

    /**
     * Previews the color of featurePoints when the color is changed
     * @param {String} color - hexadecimal color code
     */
    switchColor: throttle(function(color) {
      if (!this.imageSelected) return;

      this.applyFeaturePointChanges(featurePointID => {
        let svgFP = getSVG({ svg: this.$svg, id: featurePointID });
        svgFP.fill(color);
      });
    }, 33)
  }
};
</script>

<style lang="css" scoped>
  .action-wrapper {
    margin-top: 10px;
  }
</style>
