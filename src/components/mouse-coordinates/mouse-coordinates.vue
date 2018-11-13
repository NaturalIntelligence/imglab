<template lang="html">
  <div>
    <small v-show="show">
      {{ x }}, {{ y }}
    </small>
  </div>
</template>

<script>
import { MouseCoordBus } from "../../utils/mouseCoordBus";

/**
 * Displays the mouse coordinates on the canvas
 */
export default {
  data() {
    return {
      // Mouse x coord
      x: 0,
      // Mouse y coord
      y: 0,
      // Boolean toggle to show mouse coordinate
      show: false
    };
  },
  methods: {
    /**
     * Hides mouse position on mouse leave event
     */
    hideMousePosition() {
      this.show = false;
      this.x = 0;
      this.y = 0;
    },

    /**
     * Updates mouse position on mouse move event
     */
    updateMousePosition(x, y) {
      this.show = true;
      this.x = x;
      this.y = y;
    }
  },
  mounted() {
    /**
     * Listens to mouse-move and mouse-leave events on MOuseCoordBus event bus
     */
    MouseCoordBus.$on("mouse-move", this.updateMousePosition);
    MouseCoordBus.$on("mouse-leave", this.hideMousePosition);
  },
  beforeDestroy() {
    /**
     * Stops listening to mouse-move and mouse-leave events on event bus
     */
    MouseCoordBus.$off("mouse-move", this.updateMousePosition);
    MouseCoordBus.$off("mouse-leave", this.hideMousePosition);
  }
};
</script>

<style lang="css">
</style>
