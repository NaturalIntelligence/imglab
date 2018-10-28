<template lang="html">
  <div class="range-slider">
      <input
        class="input-range"
        type="range"
        :step="opacityStepSize"
        :value="imageOpacity"
        min="0"
        max="1.0"
        @change="dispatch">
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters("app-config", {
      "opacityStepSize": "getOpacityStepSize"
    }),

    ...mapGetters("image-store", {
      "imageSelected": "getImageSelected"
    }),

    imageOpacity() {
      return this.imageSelected ? this.imageSelected.opacity : 1;
    }
  },
  methods: {
    ...mapMutations("image-store", {
      "updateImageDetail": "updateImageDetail"
    }),

    /**
     * Generic method to set image opacity
     * @param {Event} event - range slider value change
     */
    dispatch(event) {
      // Set image opacity if image exists
      if (this.imageSelected) {
        this.updateImageDetail({ opacity: event.target.value });
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
