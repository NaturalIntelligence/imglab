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
              <button
                type="button"
                class="btn"
                @click="fileext = _ext.NIMN"
              >
                Project file
              </button>
              <button type="button" class="btn">
                Dlib XML
              </button>
              <button type="button" class="btn">
                Dlib pts
              </button>
              <button type="button" class="btn">
                COCO JSON
              </button>
              <button type="button" class="btn">
                Pascal VOC XML
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <modal-get-filename
      v-if="fileext"
      :value="defaultvalues[fileext]"
      :ext="fileext"
      @close="fileext = ''"
      @input="saveAs($event, _ext.NIMN)"
    >
    </modal-get-filename>
  </div>
</template>

<script>
import nimnImageStore from "../action/nimn-format-imagestore";
import nimnAppConfig from "../action/nimn-format-appconfig";
import nimnLabelData from "../action/nimn-format-labeldata";

import ModalGetFilename from "./modal-get-filename";
import { mapGetters } from "vuex";

import { Ext } from "../filetype";

const FileSaver = require('file-saver');

export default {
  components: {
    "modal-get-filename": ModalGetFilename
  },
  data() {
    return {
      fileext: "",
      defaultvalues: {
        [Ext.NIMN]: "Untitled_imgLab"
      },
    }
  },
  computed: {
    ...mapGetters("image-store", {
      dataImageStore: "getStoreData"
    }),

    ...mapGetters("app-config", {
      dataAppConfig: "getStoreData"
    }),

    ...mapGetters("label-data", {
      dataLabelData: "getStoreData"
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
        default: {
          console.error("Filetype unknown")
        }
      }
    },

    /**
     * Save store data to nimn format
     * @param {String} filename
     */
    saveAsNimn(filename) {
      var nimn = require("nimnjs");

      let dataStore = {
        "image-store": this.dataImageStore,
        "app-config": this.dataAppConfig,
        "label-data": this.dataLabelData
      };

      let nimnStore = {
        type: "map",
        detail: [nimnImageStore, nimnAppConfig, nimnLabelData]
      };

      let schemaStore = nimn.buildSchema(nimnStore);

      let stringStore = nimn.stringify(schemaStore, dataStore);

      this.download(stringStore, filename, "application/nimn");
    },
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
</style>
