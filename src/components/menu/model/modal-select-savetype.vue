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
                    @click="fileext = _ext.NIMN"
                  >
                    Project file
                  </button>
                </li>
                <li class="list-item-style">
                  <button
                    type="button"
                    class="btn"
                    @click="fileext = _ext.DLIB_XML"
                  >
                    Dlib XML
                  </button>
                </li>
                <li class="list-item-style">
                  <button
                    type="button"
                    class="btn"
                    @click="fileext = ext.DLIB_PTS"
                  >
                    Dlib pts
                  </button>
                </li>
                <li class="list-item-style">
                  <button type="button" class="btn">
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
import { encodeAsNimn, encodeAsDlibXML } from "../action/file-handler";

const FileSaver = require('file-saver');

export default {
  components: {
    "modal-get-filename": ModalGetFilename
  },
  data() {
    return {
      fileext: null,
      defaultvalues: {
        [Ext.NIMN]: "Untitled_imgLab",
        [Ext.DLIB_XML]: "imglab",
        [Ext.DLIB_PTS]: "imglab"
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
        case Ext.DLIB_XML: {
          this.saveAsDlibXml(filename);
          break;
        }
        case Ext.DLIB_PTS: {
          this.saveAsDlibPts(filename);
          break;
        }
        default: {
          console.error("Filetype unknown")
        }
      }
    },

    saveAsDlibPts(filename) {

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

  .list-empty-style {
    list-style: none;
    padding: 0px 30px;
    margin: 0;
  }

  .list-item-style {
    margin: 12px;
  }
</style>
