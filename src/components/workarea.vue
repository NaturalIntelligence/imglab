<template lang="html">
  <div
    id="canvas-container">
    <div
      class="canvas-wrapper"
      :style="{ width: (imageWidth + 50) + 'px', height: (imageHeight + 50) + 'px' }">
      <img
        id="img"
        :src="imageSrc"
        :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
      />
      <div
        id="work-canvas"
        ref="workcanvas"
        :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
        @mouseover="showTrackingLine = true"
        @mousemove="showPosition"
        @mouseout="showTrackingLine = false">
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
      yPos: 0
    };
  },
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
  },
  methods: {
    showPosition(event) {
      let workcanvas = this.$refs.workcanvas;
      let coordinates = getCoordinates(event, workcanvas);

      this.xPos = coordinates.x;
      this.yPos = coordinates.y;
    }
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
