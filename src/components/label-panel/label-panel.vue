<template lang="html">
  <div
    v-if="selectedShape"
  >
    <div
      class="d-flex flex-column"
      style="height: 100%;"
    >
      <div class="mb-2 mt-2">
        Category Name
        <autocomplete-input
          :value="selectedShape.category"
          :list="appCategories"
          @added="addCategory"
          @selected="addCategory"
        >
        </autocomplete-input>
      </div>
      <div class="mb-2 mt-2">
        Label Name
        <input
          type="text"
          class="form-text w-100"
          placeholder="Label the shape, Eg: face, clock .."
          :value="selectedShape.label"
          @change="updateLabel"
        >
      </div>
      <panel-attribute></panel-attribute>
      <panel-tag></panel-tag>
      <panel-feature-point></panel-feature-point>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import PanelFeaturePoint from "./panel/panel-feature-point";
import PanelTag from "./panel/panel-tag";
import PanelAttribute from "./panel/panel-attribute";

export default {
  components: {
    "panel-feature-point": PanelFeaturePoint,
    "panel-tag": PanelTag,
    "panel-attribute": PanelAttribute
  },
  computed: {
    ...mapGetters("action-config", {
      selectedShapeID: "getSelectedShape"
    }),

    ...mapGetters("image-store", {
      getShapeByID: "getShapeByID"
    }),

    ...mapGetters("label-data", {
      appCategories: "getCategory"
    }),

    selectedShape() {
      return this.selectedShapeID && this.getShapeByID(this.selectedShapeID);
    }
  },
  methods: {
    ...mapMutations("image-store", {
      setShapeCategory: "setShapeCategory",
      updateShapeDetail: "updateShapeDetail"
    }),

    ...mapMutations("label-data", {
      addCategoryToApp: "addCategory"
    }),

    addCategory(category) {
      this.setShapeCategory({
        category,
        shapeID: this.selectedShapeID
      });
      this.addCategoryToApp({ category });
    },

    /**
     * Updates shape label
     * @param {Event} - change event
     */
    updateLabel(event) {
      this.updateShapeDetail({
        shapeID: this.selectedShapeID,
        label: event.target.value
      });
    }
  }
};
</script>

<style lang="css" scoped>
  .hidePanel {
    display: none;
  }
</style>
