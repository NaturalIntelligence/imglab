<template lang="html">
  <div id="canvas-container">
    <img
      id="img"
      :src="imageSrc"
      :width="imageWidth"
      :height="imageHeight" />
    <div
      id="work-canvas"
      :width="imageWidth"
      :height="imageHeight">
    </div>
    <!-- <tracking-lines></tracking-lines> -->
  </div>
</template>

<script>
// import TrackingLines from './tracking-lines/tracking-lines'
import { mapGetters } from 'vuex';

export default {
  // components: {
  //   'tracking-lines': TrackingLines
  // },
  computed: {
    ...mapGetters('actions-config', {
      copiedElements: 'getCopiedElements',
      selectedTool: 'getSelectedTool',
      selectedElement: 'getSelectedElement',
      selectedElements: 'getSelectedElements',
      alreadyDrawing: 'getAlreadyDrawing'
    }),

    ...mapGetters('image-store', {
      imageSelected: 'getImageSelected'
    }),

    imageWidth() {
      return (this.imageSelected && this.imageSelected.size.width) || 0;
    },

    imageHeight() {
      return (this.imageSelected && this.imageSelected.size.height) || 0;
    },

    imageSrc() {
      return (this.imageSelected && this.imageSelected.src) || "";
    }
  }
}
</script>

<style lang="css">
</style>
