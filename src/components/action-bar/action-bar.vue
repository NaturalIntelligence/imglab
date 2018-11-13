<template lang="html">
  <component :is="action"></component>
</template>

<script>
import { mapGetters } from "vuex";
import { actions as _actions } from "./config/config";

/**
 * Renders the corresponding action when a tool is selected.
 * Actions are loaded from the config file
 */
export default {
  data() {
    return {
      // List of actions available
      actions: _actions,
      // Current action
      action: null
    };
  },
  computed: {
    ...mapGetters("action-config", {
      selectedTool: "getSelectedTool"
    })
  },
  watch: {
    selectedTool() {
      // Check that tool is selected and has an action
      if (this.selectedTool && this.selectedTool.actionable) {
        // Dynamically set action by binding the Vue options object
        this.action = this.actions[this.selectedTool.type];
      } else {
        // Reset action to null
        this.action = null;
      }
    }
  }
};
</script>

<style lang="css" scoped>
</style>
