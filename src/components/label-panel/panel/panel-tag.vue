<template lang="html">
  <div
    ref="wrapper"
  >
    <div class="tags-header">
      Tags
    </div>
    <div
      class="form-group"
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
          placeholder="Enter Tag"
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

/**
 * List the shape tags. Duplicate tags are not allowed. Tags and be reordered by
 * dragging.
 */
export default {
  data() {
    return {
      // Used to set focus to selected tag
      selectedTag: null,
      // Input tag text
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
     * Adds tag to shape and store
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

    /**
     * Set tag text to event value and set selected tag to null
     * @param {Event} event - input event
     */
    onInput(event) {
      this.tagText = event.target.value;
      this.selectedTag = null;
    },

    /**
     * Remove tag on click event on cross
     * @param {String} tag - tag value
     */
    removeTagByCross(tag) {
      let shapeID = this.selectedShapeID;
      tag && this.removeTagFromShape({ shapeID, tag });
    },

    /**
     * Remove tag when backspace is pressed on the active and empty input tag
     */
    removeTagByBackspace() {
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
