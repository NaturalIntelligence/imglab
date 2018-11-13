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
          <button
            type="button"
            name="button"
            class="btn float-right"
            @click="$emit('close')"
          >
            x
          </button>
        </div>
        <div class="modal-body">
          <ul class="list-empty-style">
            <li class="list-item-style">
              <button
                type="button"
                class="btn"
                @click="validate(_ext.NIMN)"
              >
                Project file
              </button>
            </li>
            <li class="list-item-style">
              <button
                type="button"
                class="btn"
                @click="validate(_ext.DLIB_XML)"
              >
                Dlib XML
              </button>
            </li>
            <li class="list-item-style">
              <button
                type="button"
                class="btn"
                @click="validate(_ext.DLIB_PTS)"
              >
                Dlib pts
              </button>
            </li>
            <li class="list-item-style">
              <button
                type="button"
                class="btn"
                @click="validate(_ext.COCO_JSON)"
              >
                COCO JSON
              </button>
            </li>
            <li class="list-item-style">
              <button type="button" class="btn">
                Pascal VOC XML
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalGetFilename from "./modal-get-filename";
import { mapGetters } from "vuex";

import { Ext } from "../filetype";
import { _ } from "../../../utils/app";

/**
 * Displays a list of save file types. Returns to parent controller when an
 * item is selected via the save/close events.
 */
export default {
  components: {
    "modal-get-filename": ModalGetFilename
  },
  data() {
    return {
      // Snackbar message
      snackbarMsg: ""
    };
  },
  computed: {
    ...mapGetters("image-store", {
      dataImageStore: "getStoreData",
      imageSelected: "getImageSelected"
    }),

    ...mapGetters("app-config", {
      dataAppConfig: "getStoreData"
    }),

    ...mapGetters("label-data", {
      dataLabelData: "getStoreData"
    }),

    ...mapGetters("action-config", {
      getSelectedShape: "getSelectedShape"
    }),

    /**
     * Used on template to access the Ext const
     */
    _ext() {
      return Ext;
    }
  },
  methods: {
    /**
     * Display a snackbar with a message
     * @param {String} message - message to be displayed
     */
    displaySnackbar(message) {
      // TODO: Implement a snackbar
      this.snackbarMsg = message;
    },

    /**
     * Defines possible shortcuts
     * @param {Event} event - keydown event
     */
    shortcuts(event) {
      if (event.key === "Escape") {
        /**
         * Emits close event
         */
        this.$emit("close");
      }
    },

    /**
     * Checks if action can be performed
     * @param {String} fileext - file extension
     */
    validate(fileext) {
      switch (fileext) {
        case Ext.DLIB_PTS: {
          let selectedShape = this.getSelectedShape;
          if (!selectedShape) {
            this.displaySnackbar(
              "Please create an image and select a shape to continue"
            );
            return;
          }
          /**
           * Emits save event
           * @param {String} filesxt - file extension
           */
          this.$emit("save", fileext);
          return true;
        }
        case Ext.COCO_JSON:
        case Ext.DLIB_XML:
        case Ext.NIMN:
          /**
           * Emits save event
           * @param {String} filesxt - file extension
           */
          this.$emit("save", fileext);
          return true;
        default:
          return false;
      }
    }
  },
  mounted() {
    // Add shortcuts to global keyup event handler
    _.on(document, "keyup", this.shortcuts);
  },
  beforeDestroy() {
    // Remove shortcuts to global keyup event handler
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

  .list-empty-style {
    list-style: none;
    padding: 0px 30px;
    margin: 0;
  }

  .list-item-style {
    margin: 12px;
  }
</style>
