<template lang="html">
  <div
    class="tags-wrapper"
    ref="wrapper"
  >
    <div class="tags-header">
      Tags
    </div>
    <div
      class="form-control"
      @click="focusInput"
    >
      <draggable
        v-model="shapeTags"
      >
        <div
          v-for="tag in shapeTags"
          class="tags"
          :class="{ focused: tag === selectedTag }"
          :key="tag"
        >
          {{ tag }}
          <font-awesome-icon
            :icon="['fas', 'times']"
            style="font-size: 1.5em; padding: 5px;"
            @click="removeTagByCross(tag)"
          >
          </font-awesome-icon>
        </div>
      </draggable>

      <label for="tag-input">
        <input
          id="tag-input"
          ref="taginput"
          type="text"
          name="tag-input"
          :placeholder="placeholderText"
          :value="tagText"
          @input="onInput"
          @change="addTag"
          @keyup.delete="removeTagByBackspace"
        >
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      selectedTag: null,
      tagText: ""
    };
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

    /**
     * Computed getter and setter needed by draggable component
     */
    shapeTags: {
      get() {
        let shape = this.getShapeByID(this.selectedShapeID);
        return shape && shape.tags;
      },

      set(val) {
        this.updateShapeDetail({ shapeID: this.selectedShapeID, tags: val });
      }
    },

    placeholderText() {
      return this.tags && this.tags.size === 0 ? "Enter tags" : "";
    }
  },
  methods: {
    ...mapMutations("image-store", {
      addTagToShape: "addTagToShape",
      removeTagFromShape: "removeTagFromShape",
      updateShapeDetail: "updateShapeDetail"
    }),

    ...mapMutations("label-data", {
      addTagToApp: "addTag"
    }),

    /**
     * Adds tag to shape and app if doesn't exist
     * @param {Event} event - change event
     */
    addTag(event) {
      let tag = event.target.value;
      let shapeID = this.selectedShapeID;
      this.addTagToShape({ shapeID, tag });
      this.addTagToApp({ tag });
      // Clear input after adding tags
      this.tagText = "";
    },

    /**
     * Sets focus on input tag
     */
    focusInput() {
      let inputNode = this.$refs.taginput;
      inputNode.focus();
    },

    onInput(event) {
      this.tagText = event.target.value;
      this.selectedTag = null;
    },

    removeTagByCross(tag) {
      let shapeID = this.selectedShapeID;
      tag && this.removeTagFromShape({ shapeID, tag });
    },

    removeTagByBackspace() {
      console.log("removeTagByBackspace");
      // Stop if there's text in input tag
      if (this.tagText.length !== 0) return;

      // Stop and remove tag only if there's one selected
      if (this.selectedTag !== null) {
        let shapeID = this.selectedShapeID;
        this.removeTagFromShape({ shapeID, tag: this.selectedTag });
        // Reset flag to null
        this.selectedTag = null;
        // Focus input tag again
        this.$refs.taginput.focus();
        return;
      }

      // Focus and select on tag if one exists
      let tags = this.shapeTags;
      let lastTag = tags.slice(-1)[0];
      if (lastTag) {
        this.selectedTag = lastTag;
      }
    }
  },
  mounted() {
    let el = this.$refs.wrapper;
    let compStyles = window.getComputedStyle(el);
    this.inputWidth = compStyles.width;
  }
};
</script>

<style lang="css" scoped>
  input {
    border: none;
  }

  .tags {
    background-color: #26a69a;
    margin: 5px;
    border-radius: 5%;
    display: inline-block;
  }

  label {
    display: inline-block;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .focused {
    background-color: #00766c;
  }
</style>
