<template lang="html">
  <div>
    <div
      v-for="(iconName, index) in icons" :key="index"
      class="tool-button"
      :id="iconName"
      :ref="iconName"
      @click="action(iconName)">
      <img
        :src="require('../../assets/icons/' + iconName + '.svg')"
        :alt="iconName">
      <div>
        {{ iconName }}
      </div>
    </div>
  </div>
</template>

<script>
import { tools } from "./config/config";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      icons: []
    }
  },
  computed: {
    ...mapGetters("action-config", {
      selectedTool: "getSelectedTool"
    })
  },
  methods: {
    ...mapMutations("action-config", {
      setSelectedTool: 'setSelectedTool'
    }),

    /**
     * Updates to newly selected tool
     * @param {String} toolName - name of selected tool
     */
    action(toolName) {
      let tool = tools[toolName];
      if (this.selectedTool) {
        let previousTool = this.$refs[this.selectedTool.type][0];
        previousTool.classList.remove("tool-selected");
      }
      // Add selected style to current tool
      let currentTool = this.$refs[tool.type][0];
      currentTool.classList.add("tool-selected");

      this.setSelectedTool({
        selectedTool: tool
      });
    }
  },
  created() {
    // Each tool name corresponds to an icon name
    this.icons = Object.keys(tools).map(toolname => {
      return toolname;
    })
  }
}
</script>

<style lang="css" scoped>
  .tool-selected{
    background: coral;
  }
</style>
