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
    ...mapGetters('image-store', {
      imageSelected: 'getImageSelected'
    }),

    width() {
      return (this.imageSelected && this.imageSelected.size.scaledWidth) || 0;
    },

    height() {
      return (this.imageSelected && this.imageSelected.size.scaledHeight) || 0;
    },

    tooltipStyle() {
      if (this.showTrackingLine) {
        let tooltip = this.$refs["tooltip"];
        let tpWidth = this.prevTpWidth = Math.max(tooltip.offsetWidth, this.prevTpWidth);
        let tpHeight = this.prevTpHeight = Math.max(tooltip.offsetHeight, this.prevTpHeight);
        console.log('tooltip', tpWidth, tpHeight)
        return {
          "left": (this.xPos + 15 + tpWidth < this.width) ?
            (this.xPos + 15) + "px" : (this.xPos - tpWidth) + "px",
          "top": (this.yPos + 15 + tpHeight < this.height) ?
            (this.yPos + 15) + "px" : (this.yPos - tpHeight) + "px"
        };
      }
    }
  },
  methods: {
    showPosition(event) {
      if (this.showTrackingLine) {
        console.log('event', event);
        // let cordinates = getCoordinates(event, canvas);
        // $("#tooltip-span").css({
        //     "left": cordinates.x + 15 + "px",
        //     "top": cordinates.y + 15 + "px"
        // });
        // $("#tooltip-span").html("x:" + cordinates.x + "<br> y:" + cordinates.y);
        // $(tag.refs["h_line"]).css({
        //     top: cordinates.y
        // });
        // $(tag.refs["v_line"]).css({
        //     left: cordinates.x
        // });
      }
    }
  },
  watch: {
    show: function(val) {
      this.showTrackingLine = val;
      console.log('showTrackingLine', this.showTrackingLine)
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
