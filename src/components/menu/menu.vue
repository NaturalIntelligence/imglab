<template lang="html">
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
        @click="saveFile"
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
</template>

<script>

import { _ } from "../../utils/app";

export default {
  methods: {
    openFile(event) {
      console.log("openFile");
    },

    openSettings(event) {
      console.log("openSettings");
    },

    saveFile(event) {
      console.log("saveFile");
      let cache = localStorage.getItem("imglab-store");
      console.log("cache", cache);
    },

    registerShortcuts(event) {
      if ((event.key == "I" || event.key == "i") && !event.shiftKey && !event.altKey && event.ctrlKey) {
        // Open file
        this.$refs.open.click();
        event.preventDefault();
        event.stopPropagation();
      } else if ((event.key == "event" || event.key == "event") && !event.shiftKey && !event.altKey && event.ctrlKey) {
        // Save file
        this.$refs.save.click();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },
  mounted() {
    _.on(document, "keydown", this.registerShortcuts);
  },
  beforeDestroy() {
    _.off(document, "keydown", this.registerShortcuts);
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
