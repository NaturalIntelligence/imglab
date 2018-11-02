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
import {
  LABEL_TAG,
  CANVAS_TAG,
  RECTANGLE,
  CIRCLE,
  POLYGON,
  POINT,
  MOVE,
  ZOOM,
  OPACITY
} from "../../utils/tool-names";
import { _ } from "../../utils/app";
import { tools as t } from "./config/config";
import { mapGetters, mapMutations } from "vuex";

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
    },

    /**
     * List of tool shortcuts
     */
    shortcuts(event) {
      let keys = ["f", "r", "c", "p", "m", "z", "l"];
      let keyMappings = {
        f: POINT,
        r: RECTANGLE,
        c: CIRCLE,
        p: POLYGON,
        m: MOVE,
        z: ZOOM,
        l: OPACITY,
      };

      if (!keys.includes(event.key)) return;

      let toolname = keyMappings[event.key];
      let tools = Object.keys(this.tools[this.toolType]);
      if (!tools.includes(toolname)) return;

      if (event.altKey) {
        event.preventDefault();
        event.stopPropagation();
        this.$refs[toolname][0].click();
      }
    }
  },
  mounted() {
    _.on(document, "keydown", this.shortcuts);
  },
  beforeDestroy() {
    _.off(document, "keydown", this.shortcuts);
  }
};
</script>

<style lang="css" scoped>
  .tool-selected{
    background: coral;
  }
</style>
