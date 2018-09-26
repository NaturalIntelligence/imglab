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
    <tracking-lines></tracking-lines>
  </div>
</template>

<script>
import TrackingLines from './tracking-lines/tracking-lines'
import { mapGetters } from 'vuex'

export default {
  components: {
    'tracking-lines': TrackingLines
  },
  data() {
    return {
      imageWidth: 0,
      imageHeight: 0
    }
  },
  computed: {
    ...mapGetters('images-config', {
      imgSelected: 'getImageSelected',
      copiedElements: 'getCopiedElements',
      selectedTool: 'getSelectedTool',
      selectedElement: 'getSelectedElement',
      selectedElements: 'getSelectedElements',
      alreadyDrawing: 'getAlreadyDrawing'
    }),

    imageWidth() {
      return this.imgSelected.size.width;
    },

    imageHeight() {
      return this.imgSelected.size.height;
    },

    imageSrc() {
      return this.imgSelected.src;
    }
  }
}
</script>

<style lang="css">
</style>
