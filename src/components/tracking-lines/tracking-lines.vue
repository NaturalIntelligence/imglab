<template lang="html">
  <div>
    <span
      id="tooltip-span"
      ref="tooltip"
      :style="tooltipStyle"
      v-show="showTrackingLine"
    >
      x: {{ xPos }}
      <br>
      y: {{ yPos }}
    </span>
    <div
      id="v_line"
      class="trackingline"
      :style="{ height: height + 'px', left: xPos + 'px'}"
      ref="v_line"
      v-show="showTrackingLine"
    ></div>
    <div
      id="h_line"
      class="trackingline"
      :style="{ width: width + 'px', top: yPos + 'px'}"
      ref="h_line"
      v-show="showTrackingLine"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    xPos: {
      type: Number,
      default: 0
    },
    yPos: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showTrackingLine: false,
      prevTpWidth: 0,
      prevTpHeight: 0
    }
  },
  computed: {
    /**
     * Map getters from image-store
     */
    ...mapGetters('image-store', {
      imageSelected: 'getImageSelected'
    }),

    /**
     * Gets the current image width
     */
    width() {
      return (this.imageSelected && this.imageSelected.size.scaledWidth) || 0;
    },

    /**
     * Gets the current image height
     */
    height() {
      return (this.imageSelected && this.imageSelected.size.scaledHeight) || 0;
    },

    /**
     * Set the tooltip location based on mouse position\
     */
    tooltipStyle() {
      if (this.showTrackingLine) {
        let tooltip = this.$refs["tooltip"];
        let tpWidth = this.prevTpWidth = Math.max(tooltip.offsetWidth, this.prevTpWidth);
        let tpHeight = this.prevTpHeight = Math.max(tooltip.offsetHeight, this.prevTpHeight);

        return {
          "left": (this.xPos + 15 + tpWidth < this.width) ?
            (this.xPos + 15) + "px" : (this.xPos - tpWidth) + "px",
          "top": (this.yPos + 15 + tpHeight < this.height) ?
            (this.yPos + 15) + "px" : (this.yPos - tpHeight) + "px"
        };
      }
    }
  },
  watch: {
    /**
     * Watch for changes to the 'show' prop and sets showTrackingLine
     * @param {Boolean} val - true if mouse is over canvas, false otherwise
     */
    show: function(val) {
      this.showTrackingLine = val;
    }
  }
}
</script>

<style lang="css" scoped>
  .trackingline{
    outline: 1px solid yellow;
    opacity: 0.5;
    position: absolute;
    display: block;
  }

  #h_line, #v_line, #tooltip-span {
    position: absolute;
  }

  #tooltip-span {
    background-color: black;
  	color: white;
  	z-index: 1000;
    text-align: center;
  }
</style>
