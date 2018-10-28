<template lang="html">
  <div
    v-if="tools[toolType]"
  >
    <div
      v-for="(tool, index) in tools[toolType]" :key="index"
      class="tool-button"
      :id="tool.type"
      :ref="tool.type"
      @click="dispatch(tool)"
    >
      <img
        v-if="tool.icon.isSVG"
        :src="require('../../assets/icons/' + tool.icon.name)"
        :alt="tool.type"
      >
      <font-awesome-icon
        v-else
        :icon="[tool.icon.type, tool.icon.name]"
        style="font-size: 1.5em"
      >
      </font-awesome-icon>
      <div>
        {{ tool.type }}
      </div>
    </div>
  </div>
</template>

<script>
import { tools as t } from "./config/config";
import { mapGetters, mapMutations } from "vuex";
import { LABEL_TAG } from "../../utils/tool-names";

export default {
  props: {
    toolType: {
      type: String,
      default: LABEL_TAG
    }
  },
  data() {
    return {
      tools: t
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
     * @param {Tool} tool - selected tool
     */
    dispatch(tool) {
      let currentTool = this.$refs[tool.type][0];

      if (this.selectedTool && tool.type === this.selectedTool.type) {
        // Unselect current tool
        this.setSelectedTool();
      } else {
        // Select new tool
        this.setSelectedTool({
          dom: currentTool,
          selectedTool: tool
        });
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .tool-selected{
    background: coral;
  }
</style>
