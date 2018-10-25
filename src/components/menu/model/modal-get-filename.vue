<template lang="html">
  <transition name="modal">
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
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    ext: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filename: this.value + this.ext,
      showError: false
    }
  },
  methods: {
    onInput(event) {
      if (event.target.value.length) {
        this.showError = false;
      }
      this.filename = event.target.value;
    },

    setFilename() {
      if (this.validFilename && this.filename.length) {
        this.$emit("input", this.filename);
      } else {
        this.showError = true;
      }
    },

    validFilename() {
      return /^[a-z0-9_.@()-]/i.test(this.filename) &&
        this.filename.endsWith(this.ext);
    }
  }
}
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
