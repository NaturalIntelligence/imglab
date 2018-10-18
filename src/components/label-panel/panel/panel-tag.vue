<template lang="html">
  <div class="tags-wrapper">
    <div
      class="tags"
      v-for="(tag, index) in tags"
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
      getTags: "getTags"
    }),

    ...mapGetters("action-config", {
      selectedShapeID: "getSelectedShape"
    }),

    ...mapGetters("image-store", {
      getShapeByID: "getShapeByID"
    }),

    tags() {
      let shape = this.getShapeByID(this.selectedShapeID);
      return shape && shape.tags;
    },

    placeholderText() {
      console.log("this.tags && this.tags.size")
      return this.tags && this.tags.size === 0 ? "Enter tags": "";
    }
  },
  methods: {
    ...mapMutations("image-store", {
      addTagToShape: "addTagToShape",
      removeTagFromShape: "removeTagFromShape"
    }),

    addTag(event) {

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
