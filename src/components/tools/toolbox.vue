<template lang="html">
  <div
    v-if="tools[toolType]"
  >
    <div
      v-for="(tool, index) in tools[toolType]" :key="index"
      class="tool-button"
      :id="tool.title"
      :ref="tool.title"
      @click="dispatch(tool)"
    >
      <img
        v-if="tool.icon.isSVG"
        :src="require('../../assets/icons/' + tool.icon.name)"
        :alt="tool.title"
      >
      <font-awesome-icon
        v-else
        :icon="[tool.icon.type, tool.icon.name]"
        style="font-size: 1.5em"
      >
      </font-awesome-icon>
      <div>
        {{ tool.title }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  LABEL_TAG,
  RECTANGLE,
  CIRCLE,
  POLYGON,
  POINT,
  MOVE,
  ZOOM,
  OPACITY
} from "../../utils/tool-names";
import { _ } from "../../utils/app";
import { tools as config } from "./config/config";
import { mapGetters, mapMutations } from "vuex";

/**
 * Loads the tools specified in config file. Shortcuts can be invoked to select
 * tool.
 */
export default {
  props: {
    toolType: {
      type: String,
      default: LABEL_TAG
    }
  },
  data() {
    return {
      // Set list of tools from config
      tools: config
    };
  },
  computed: {
    ...mapGetters("action-config", {
      selectedTool: "getSelectedTool"
    })
  },
  methods: {
    ...mapMutations("action-config", {
      setSelectedTool: "setSelectedTool"
    }),

    /**
     * Updates to newly selected tool
     * @param {Tool} tool - selected tool
     */
    dispatch(tool) {
      let currentTool = this.$refs[tool.title][0];

      if (this.selectedTool && tool.title === this.selectedTool.title) {
        // Unselect current tool
        this.setSelectedTool();
      } else {
        // Select new tool
        this.setSelectedTool({
          dom: currentTool,
          selectedTool: tool
        });
      }
    },

    /**
     * List of tool shortcuts
     * @param {Event} event - keydown event
     */
    shortcuts(event) {
      let key = event.key;
      // Check if action keys was pressed and map to action key
      let actionKeys = ["[", "]"];
      if (actionKeys.includes(key) && event.altKey) {
        let sTool = this.selectedTool;
        if (sTool && sTool.title === ZOOM) return;
        key = "z";
      }
      // List of available keys and mappings
      let keys = ["f", "r", "c", "p", "m", "z", "l"];
      let keyMappings = {
        f: POINT,
        r: RECTANGLE,
        c: CIRCLE,
        p: POLYGON,
        m: MOVE,
        z: ZOOM,
        l: OPACITY
      };
      // Stop if key doesn't exist in list of shortcuts
      if (!keys.includes(key)) return;
      // Check if tool exists in toolbar
      let toolname = keyMappings[key];
      let tools = Object.keys(this.tools[this.toolType]);
      if (!tools.includes(toolname)) return;
      // Activate tool via click
      if (event.altKey && !event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        this.$refs[toolname][0].click();
      }
    }
  },
  mounted() {
    /**
     * Attach shortcuts to global keydown event
     */
    _.on(document, "keydown", this.shortcuts);
  },
  beforeDestroy() {
    /**
     * Detach shortcuts from global keydown event
     */
    _.off(document, "keydown", this.shortcuts);
  }
};
</script>

<style lang="css" scoped>
  .tool-selected{
    background: coral;
  }
</style>
