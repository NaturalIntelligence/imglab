<template lang="html">
  <div class="">
    <div class="dropdown" >
      <div class="dropbtn">
        <font-awesome-icon
          :icon="['fas', 'bars']"
          style="font-size:1.5em; color: green"
        >
        </font-awesome-icon>
      </div>
      <div class="dropdown-content">
        <a href="#" >
          <label class="btn-bs-file">Open
            <input
              class="filebutton"
              ref="open"
              type="file"
              accept=".fpp,.nimn,.xml,.json"
              @change="openFile"
            >
          </label>
          <span>Ctrl + i</span>
        </a>
        <a
          href="#"
          ref="save"
          @click="showModal = true"
        >
          <label>Save</label>
          <span>Ctrl + e</span>
        </a>
        <a
          href="#"
          @click="openSettings"
        >
          Settings
        </a>
      </div>
    </div>

    <modal-save
      v-if="showModal"
      @close="showModal = false"
    >
    </modal-save>

  </div>

</template>

<script>
import nimnImageStore from "./action/nimn-format-imagestore";
import nimnAppConfig from "./action/nimn-format-appconfig";
import nimnLabelData from "./action/nimn-format-labeldata";
import ModalSave from "./model/modal-save";

import { mapMutations } from "vuex";
import { Ext } from "./filetype";
import { decodeCocoJson, decodeDlibXML } from "./action/file-handler";
import { _ } from "../../utils/app";

/**
 * Menu component. Valid actions are open/save file, or to open app settings.
 * This component also handles decoding files for the "open" action.
 */
export default {
  components: {
    "modal-save": ModalSave
  },
  data() {
    return {
      // Boolean toggle to display modal-save component
      showModal: false
    };
  },
  methods: {
    ...mapMutations("app-config", {
      initAppConfig: "init"
    }),

    ...mapMutations("image-store", {
      initImageStore: "init"
    }),
    ...mapMutations("label-data", {
      initLabelData: "init"
    }),

    /**
     * Loads dlib xml file data to store
     * @param {String} data - dlib xml data
     */
    loadDlibXml(data) {
      let storeData = decodeDlibXML(data);
      this.initImageStore(storeData);
    },

    /**
     * Loads Coco json file data to store
     * @param {String} data - coco json data
     */
    loadJSONFile(data) {
      let storeData = decodeCocoJson(JSON.parse(data));
      this.initImageStore(storeData["image-store"]);
      this.initLabelData(storeData["label-data"]);
    },

    /**
     * Loads .nimn file data to store
     * @param {String} data - nimn file data
     */
    loadProjectFile(data) {
      var nimn = require("nimnjs");

      let nimnStore = {
        type: "map",
        detail: [nimnImageStore, nimnAppConfig, nimnLabelData]
      };

      let schemaStore = nimn.buildSchema(nimnStore);
      let nimnObj = nimn.parse(schemaStore, data);

      this.initAppConfig(nimnObj["app-config"]);
      this.initImageStore(nimnObj["image-store"]);
      this.initLabelData(nimnObj["label-data"]);
    },

    openSettings() {
      console.log("openSettings");
    },

    /**
     * Opens file and initialize store
     * @param {Event} event - click Event
     */
    openFile(event) {
      var input = event.srcElement;
      if (input.files && input.files[0]) {
        var dataFile = input.files[0];

        var reader = new FileReader();
        reader.onload = e => {
          if (dataFile.name.endsWith(".json")) {
            this.loadJSONFile(e.target.result);
          } else if (dataFile.name.endsWith(Ext.NIMN)) {
            this.loadProjectFile(e.target.result);
          } else if (dataFile.name.endsWith(".fpp")) {
            this.loadFpp(e.target.result);
          } else if (dataFile.name.endsWith(".xml")) {
            this.loadDlibXml(e.target.result);
          } else {
            console.log("Not supported");
          }
        };

        reader.readAsText(input.files[0]);
      }
      input.value = null;
    },

    /**
     * Shortcuts
     * @param {Event} event - keydown event
     */
    shortcuts(event) {
      if (
        (event.key === "I" || event.key === "i") &&
        !event.shiftKey &&
        !event.altKey &&
        event.ctrlKey
      ) {
        this.$refs.open.click();
        event.preventDefault();
        event.stopPropagation();
      } else if (
        (event.key === "E" || event.key === "e") &&
        !event.shiftKey &&
        !event.altKey &&
        event.ctrlKey
      ) {
        this.$refs.save.click();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },
  mounted() {
    // Adds shortcuts to global keydown event
    _.on(document, "keydown", this.shortcuts);
  },
  beforeDestroy() {
    // Remove shortcuts from global keydown event
    _.off(document, "keydown", this.shortcuts);
  }
};
</script>

<style lang="css" scoped>
  .dropdown-content{
    z-index: 4;
  }

  .dropdown-content > a {
    display: flex;
    justify-content: space-between;
  }

  .dropdown-content > a > span{
    padding: .2em .4em .4em .4em;
    font-size: 80%;
  }

  .dropbtn {
    color: white;
    font-size: 16px;
    border: none;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content a:hover {
    background-color: #ddd;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown:hover .dropbtn {
    background-color: #17a2b8;
  }

  .btn-bs-file {
    position:relative;
  }

  .btn-bs-file input[type="file"] {
    position: absolute;
    top: -9999999;
    filter: alpha(opacity=0);
    opacity: 0;
    width:0;
    height:0;
    outline: none;
    cursor: inherit;
  }
</style>
