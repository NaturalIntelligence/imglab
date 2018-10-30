<template lang="html">
  <transition name="modal">
    <modal-select-savetype
      v-if="showSaveDialog"
      @close="$emit('close')"
      @save="setFileType($event)"
    >
    </modal-select-savetype>
    <modal-get-filename
      v-else
      :value="defaultvalues[filetype]"
      :ext="filetype"
      @close="showSaveDialog = true"
      @input="saveAs($event, filetype)"
    >
    </modal-get-filename>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import {
  encodeAsNimn,
  encodeAsDlibXML,
  encodeAsDlibPts,
  encodeAsCocoJson
} from "../action/file-handler";
import { Ext } from "../filetype";
import ModalSaveType from "./modal-select-savetype";
import ModalGetFilename from "./modal-get-filename";

const FileSaver = require("file-saver");

export default {
  components: {
    "modal-select-savetype": ModalSaveType,
    "modal-get-filename": ModalGetFilename
  },
  data() {
    return {
      defaultvalues: {
        [Ext.NIMN]: "Untitled_imgLab",
        [Ext.DLIB_XML]: "_dlib-xml",
        [Ext.DLIB_PTS]: "_dlib_pts",
        [Ext.COCO_JSON]: "_coco"
      },
      filetype: null,
      showSaveDialog: true
    };
  },
  computed: {
    ...mapGetters("action-config", {
      selectedShapeID: "getSelectedShape"
    })
  },
  methods: {
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
      this.filetype = null;
      this.showSaveDialog = true;

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
      let ptsData = encodeAsDlibPts(this.$store, this.selectedShapeID);
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
     * Set file type and toggle prompt to get file name
     * @param {String} filetype
     */
    setFileType(filetype) {
      this.filetype = filetype;
      this.showSaveDialog = false;
    }
  }
};
</script>

<style lang="css" scoped>
  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
