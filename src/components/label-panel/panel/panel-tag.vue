<template lang="html">
  <div class="tags-wrapper">
    <div
      class="tags"
      v-for="(tag, index) in shapeTags"
      :key="tag"
    >
      {{ tag }}
    </div>
    <label for="tag-input">
      <input
        class="tags"
        type="text"
        name="tag-input"
        style=""
        :placeholder="placeholderText"
        @change="addTag"
      >
    </label>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters("label-data", {
      appTags: "getTags"
    }),

    ...mapGetters("action-config", {
      selectedShapeID: "getSelectedShape"
    }),

    ...mapGetters("image-store", {
      getShapeByID: "getShapeByID"
    }),

    shapeTags() {
      let shape = this.getShapeByID(this.selectedShapeID);
      console.log("shapeTags", shape && shape.tags);
      return shape && shape.tags;
    },

    placeholderText() {
      return this.tags && this.tags.size === 0 ? "Enter tags": "";
    }
  },
  methods: {
    ...mapMutations("image-store", {
      addTagToShape: "addTagToShape",
      removeTagFromShape: "removeTagFromShape"
    }),

    ...mapMutations("label-data", {
      addTagToApp: "addTag"
    }),

    /**
     * Adds tag to shape and app if doesn't exist
     * @param {Event} event - change event
     */
    addTag(event) {
      console.log("tag added", event.target.value);
      let tag = event.target.value;
      let shapeID = this.selectedShapeID;
      this.addTagToShape({ shapeID, tag });
      this.addTagToApp({ tag });
    }
  }
}
</script>

<style lang="css" scoped>
  input[class="tags"] {
    box-shadow: 0 0 3px #CC0000;
    margin: 10px;
  }
</style>
