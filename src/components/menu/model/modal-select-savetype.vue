<template lang="html">
  <div class="">
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
    </transition>
    <modal-get-filename
      v-if="fileext"
      :value="defaultvalues[fileext]"
      :ext="fileext"
      @close="fileext = null"
      @input="saveAs($event, fileext)"
    >
    </modal-get-filename>
  </div>
</template>

<script>
import ModalGetFilename from "./modal-get-filename";
import { mapGetters } from "vuex";

import { Ext } from "../filetype";
import {
  encodeAsNimn,
  encodeAsDlibXML,
  encodeAsDlibPts,
  encodeAsCocoJson
} from "../action/file-handler";

const FileSaver = require("file-saver");

export default {
  components: {
    "modal-get-filename": ModalGetFilename
  },
  data() {
    return {
      fileext: null,
      defaultvalues: {
        [Ext.NIMN]: "Untitled_imgLab",
        [Ext.DLIB_XML]: "_dlib-xml",
        [Ext.DLIB_PTS]: "_dlib_pts",
        [Ext.COCO_JSON]: "_coco"
      },
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
     * @param {String} message
     */
    displaySnackbar(message) {
      // TODO: Implement a snackbar
      this.snackbarMsg = message;
    },
    /**
     * Save given data to a file
     * @param {Any} data - string data
     * @param {String} filename
     * @param {String} type - Mime type
     */
    download(data, filename, type, encoding = "utf-8") {
      let blobData = new Blob([data], {
        type: type + ";charset=" + encoding
      });
      FileSaver.saveAs(blobData, filename);
    },

    /**
     * Given file name and file type, save data to corresponding format
     * @param {String} filename - filename that includes the file extension
     * @param {String} filetype - used to determine which handler to call
     */
    saveAs(filename, filetype) {
      this.fileext = "";

      switch (filetype) {
        case Ext.NIMN: {
          this.saveAsNimn(filename);
          break;
        }
        case Ext.DLIB_XML: {
          this.saveAsDlibXml(filename);
          break;
        }
        case Ext.DLIB_PTS: {
          this.saveAsDlibPts(filename);
          break;
        }
        case Ext.COCO_JSON: {
          this.saveAsCocoJSON(filename);
          break;
        }
        default: {
          console.error("Filetype unknown", filetype);
        }
      }
    },

    /**
     * Saves whole project as coco json
     * @param {String} filename
     */
    saveAsCocoJSON(filename) {
      let cocoData = encodeAsCocoJson(this.$store);
      this.download(cocoData, filename, "application/json");
    },

    /**
     * Save selected shape into a pts file
     * @param {String} filename
     */
    saveAsDlibPts(filename) {
      let selectedShape = this.getSelectedShape;
      let ptsData = encodeAsDlibPts(this.$store, selectedShape);
      this.download(ptsData, filename, "text/plain");
    },

    saveAsDlibXml(filename) {
      let dlibXML = encodeAsDlibXML(this.$store);
      this.download(dlibXML, filename, "text/xml");
    },

    /**
     * Save store data to nimn format
     * @param {String} filename
     */
    saveAsNimn(filename) {
      let nimnStore = encodeAsNimn(this.$store);
      this.download(nimnStore, filename, "application/nimn");
    },

    /**
     * Checks if action can be performed
     * @param {String} fileext
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
          this.fileext = fileext;
          return true;
        }
        case Ext.COCO_JSON:
        case Ext.DLIB_XML:
        case Ext.NIMN:
          this.fileext = fileext;
          return true;
        default:
          return false;
      }
    }
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
