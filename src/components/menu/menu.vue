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
    <modal-select-savetype
      v-if="showModal"
      @close="showModal = false"
    >
  </modal-select-savetype>
  </div>

</template>

<script>
import nimnImageStore from "./action/nimn-format-imagestore";
import nimnAppConfig from "./action/nimn-format-appconfig";
import nimnLabelData from "./action/nimn-format-labeldata";

import { mapMutations } from "vuex";
import ModalSelectSavetype from "./model/modal-select-savetype";
import { saveAsNimn } from "./action/saveas-nimn";
import { _ } from "../../utils/app";
import { Ext } from "./filetype";

export default {
  components: {
    "modal-select-savetype": ModalSelectSavetype
  },
  data() {
    return {
      showModal: false
    }
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
    }
  }
}

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
