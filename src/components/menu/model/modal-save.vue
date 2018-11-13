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
  getStoreData,
  encodeAsNimn,
  encodeAsDlibXML,
  encodeAsDlibPts,
  encodeAsCocoJson
} from "../action/file-handler";
import { Ext } from "../filetype";
import ModalSaveType from "./modal-select-savetype";
import ModalGetFilename from "./modal-get-filename";

const FileSaver = require("file-saver");

/**
 * Toggles between showing the save file types and the get-filename modal.
 * Proceeds to encode store data and save it into the file if valid.
 */
export default {
  components: {
    "modal-select-savetype": ModalSaveType,
    "modal-get-filename": ModalGetFilename
  },
  data() {
    return {
      // Contains a mapping of file extension to default names
      defaultvalues: {
        [Ext.NIMN]: "Untitled_imgLab",
        [Ext.DLIB_XML]: "_dlib-xml",
        [Ext.DLIB_PTS]: "_dlib_pts",
        [Ext.COCO_JSON]: "_coco"
      },
      // Selected file type / exntension
      filetype: null,
      // Boolean toggle for displaying save options / get filename component
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
     * Google analytics: Report file metadata
     * @param {String} filetype - file type
     */
    analyticsReport(filetype) {
      this.analyticsFileType(filetype);
      this.analyticsImageStore();
      this.analyticsLabelData();
    },

    /**
     * Sends metadata about the image store to google analytics
     */
    analyticsImageStore() {
      let storeData = getStoreData(this.$store);
      let imageStore = storeData["image-store"];

      this.$ga.event({
        eventCategory: "image - count",
        eventAction: "save",
        eventLabel: `${Object.keys(imageStore.images).length} images`
      });

      this.$ga.event({
        eventCategory: "shape - count",
        eventAction: "save",
        eventLabel: `${Object.keys(imageStore.shapes).length} shapes`
      });

      this.$ga.event({
        eventCategory: "points - count",
        eventAction: "save",
        eventLabel: `${
          Object.keys(imageStore.featurePoints).length
        } feature points`
      });
    },

    /**
     * Sends label metadata to google analytics
     */
    analyticsLabelData() {
      let storeData = getStoreData(this.$store);
      let labelData = storeData["label-data"];

      labelData.categories.forEach(category => {
        this.$ga.event({
          eventCategory: "category",
          eventAction: "save",
          eventLabel: category
        });
      });
    },

    /**
     * Sends file type to google analytics
     */
    analyticsFileType(filetype) {
      this.$ga.event({
        eventCategory: "filetype",
        eventAction: "save",
        eventLabel: filetype
      });
    },

    /**
     * Save given data to a file
     * @param {*} data - string data
     * @param {String} filename - file name
     * @param {String} type - Mime type
     */
    download(data, filename, type, encoding = "utf-8") {
      let blobData = new Blob([data], {
        type: type + ";charset=" + encoding
      });
      FileSaver.saveAs(blobData, filename);
    },

    /**
     * Checks if file type is supported
     * @param {String} filetype - file type
     * @returns {Boolean} true if exists; false otherwise
     */
    isSupported(filetype) {
      return Object.values(Ext).includes(filetype);
    },

    /**
     * Given file name and file type, save data to corresponding format
     * @param {String} filename - filename that includes the file extension
     * @param {String} filetype - used to determine which handler to call
     */
    saveAs(filename, filetype) {
      this.filetype = null;
      this.showSaveDialog = true;

      // Prints an error on console and returns if filetype not supported
      if (!this.isSupported(filetype)) {
        console.error(`${filetype} not supported`);
        return;
      }

      this.analyticsReport(filetype);
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
          console.error("Unknown error, shouldn't reach here");
        }
      }
    },

    /**
     * Saves whole project as coco json
     * @param {String} filename - file name
     */
    saveAsCocoJSON(filename) {
      let cocoData = encodeAsCocoJson(this.$store);
      this.download(cocoData, filename, "application/json");
    },

    /**
     * Save selected shape into a pts file
     * @param {String} filename - file name
     */
    saveAsDlibPts(filename) {
      let ptsData = encodeAsDlibPts(this.$store, this.selectedShapeID);
      this.download(ptsData, filename, "text/plain");
    },

    /**
     * Save project as dlib xml
     * @param {String} filename - file name
     */
    saveAsDlibXml(filename) {
      let dlibXML = encodeAsDlibXML(this.$store);
      this.download(dlibXML, filename, "text/xml");
    },

    /**
     * Save store data to nimn format
     * @param {String} filename - filename
     */
    saveAsNimn(filename) {
      let nimnStore = encodeAsNimn(this.$store);
      this.download(nimnStore, filename, "application/nimn");
    },

    /**
     * Set file type and toggle prompt to display get-file-name component
     * @param {String} filetype - file type
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
