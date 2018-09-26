<template lang="html">
  <div>
    <span id="tooltip-span"></span>
    <div class="trackingline" ref="v_line"></div>
    <div class="trackingline" ref="h_line"></div>
  </div>
</template>

<script>
export default {
  created() {
    this.$refs["v_line"]
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
</style>
