<template lang="html">
  <div
    class="modal-mask"
  >
    <div
      class="modal-wrapper"
      role="document"
    >
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">File Name</h3>
        </div>
        <div class="modal-body">
          <label for="file-name">
            <input
              class="form-control"
              type="text"
              name="file-name"
              :class="{ error: showError }"
              :value="filename"
              @input="onInput"
            >
          </label>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            name="button"
            class="btn btn-secondary float-right"
            data-dismiss="modal"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            name="button"
            class="btn btn-primary float-right"
            @click="setFilename"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _ } from "../../../utils/app";

/**
 * Displays a modal to get the file name. There are 2 types of events emitted.
 *
 * Input event is emitted on providing a valid filename and on continue
 * Close event is emitted on cancel / exit
 */
export default {
  props: {
    // Initial input value
    value: {
      type: String,
      required: true
    },
    // Expected file format
    ext: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // Filename that contains a file extension
      filename: this.value + this.ext,
      // Boolean toggle to display error styles if true
      showError: false
    };
  },
  methods: {
    /**
     * Toggles showError if input tag is empty. Assigns input value as filename
     * otherwise
     * @param {Event} event - input event
     */
    onInput(event) {
      if (event.target.value.length) {
        this.showError = false;
      }
      this.filename = event.target.value;
    },

    /**
     * Emits `input` event if filename is valid, toggle showError to show
     * display error styling otherwise
     */
    setFilename() {
      if (this.validFilename() && this.filename.length) {
        /**
         * Emits an input event
         * @param {String} filename - correctly formatted file name
         */
        this.$emit("input", this.filename);
      } else {
        this.showError = true;
      }
    },

    /**
     * Shortcuts
     * @param {Event} event - keyup event
     */
    shortcuts(event) {
      if (event.key === "Escape") {
        /**
         * Emits a close event to toggle component display
         */
        this.$emit("close");
      }
    },

    /**
     * Checks that the filename is correct and has the correct extension
     * @return {Boolean} true if valid; false otherwise
     */
    validFilename() {
      return (
        /^[a-z0-9_.@()-]/i.test(this.filename) &&
        this.filename.endsWith(this.ext)
      );
    }
  },
  mounted() {
    // Add shortcut to global keydown event
    _.on(document, "keyup", this.shortcuts);
  },
  beforeDestroy() {
    // Remove shortcut from global keydown event
    _.off(document, "keyup", this.shortcuts);
  }
};
</script>

<style lang="css" scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .error {
    border: 2px solid red;
  }
</style>
