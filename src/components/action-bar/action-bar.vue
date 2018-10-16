<template lang="html">
  <component :is="action"></component>
</template>

<script>
import { mapGetters } from "vuex";
import { actions as _actions } from "./config/config";

export default {
  data() {
    return {
      actions: _actions,
      action: null
    }
  },
  computed: {
    ...mapGetters("action-config", {
      "selectedTool": "getSelectedTool"
    })
  },
  watch: {
    selectedTool() {
      // Check that tool is selected and has an action
      if (this.selectedTool && this.selectedTool.actionable) {
        // Dynamically set action by binding the Vue options object
        this.action = this.actions[this.selectedTool.type];
      } else {
        this.action = null;
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
