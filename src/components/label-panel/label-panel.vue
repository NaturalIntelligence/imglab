<template lang="html">
  <div
    v-show="selectedShape">
    <div
      class="d-flex flex-column"
      style="height: 100%;"
    >
        <!-- <div ref="category-data" class="mb-2 mt-2">
          Category Name
          <select id="category-select-box" class="form-text">
            <option
              v-for="(category, index) in suggestedCategories"
              :key="index"
              :selected="category === targetShape.category"
            >
              {{ category }}
            </option>
          </select>
        </div>
        <div ref="label-data" class="mb-2 mt-2">
          Label Name
          <input
            type="text"
            class="form-text w-100"
            value="{ targetShape.label }"
            onchange={updateLabel}
            placeholder="Label the shape, Eg: face, clock .."
          >
        </div>
        <div ref="label-data" class="mb-2 mt-2">
          <attributes-list attributes={targetShape.attributes}></attributes-list>
        </div>
        <div ref="label-data" class="mb-2 mt-2">
          Tags <small>(separated by comma)</small>
          <div id="tags-input-box" class="input tagarea clearfix"></div>
        </div> -->
      <panel-tag></panel-tag>
      <list-feature-point></list-feature-point>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ListFeaturePoints from "./panel/list-feature-point";
import PanelTag from "./panel/panel-tag";

export default {
  components: {
    "list-feature-point": ListFeaturePoints,
    "panel-tag": PanelTag
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters("action-config", {
      selectedShape: "getSelectedShape",
    })
  }
}
</script>

<style lang="css" scoped>
  .hidePanel {
    display: none;
  }
</style>
