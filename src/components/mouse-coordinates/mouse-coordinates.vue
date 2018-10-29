<template lang="html">
  <div>
    <small>
      {{ mousePos }}
    </small>
  </div>
</template>

<script>
import { MouseCoordBus } from "../../utils/mouseCoordBus";

export default {
  computed: {
    mousePos() {
      if (this.show) {
        return `${this.x}, ${this.y}`;
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      show: false
    };
  },
  methods: {
    hideMousePosition() {
      this.show = false;
      this.x = 0;
      this.y = 0;
    },

    updateMousePosition(x, y) {
      this.show = true;
      this.x = x;
      this.y = y;
    }
  },
  mounted() {
    MouseCoordBus.$on("mouse-move", this.updateMousePosition);
    MouseCoordBus.$on("mouse-leave", this.hideMousePosition);
  },
  beforeDestroy() {
    MouseCoordBus.$off("mouse-move", this.updateMousePosition);
    MouseCoordBus.$off("mouse-leave", this.hideMousePosition);
  }
};
</script>

<style lang="css">
</style>
