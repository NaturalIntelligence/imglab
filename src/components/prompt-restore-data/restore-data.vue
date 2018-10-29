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
            <h3 class="modal-title">Recovery</h3>
          </div>
          <div class="modal-body">
            You've previously saved data. Would you like to restore it?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              name="button"
              class="btn btn-secondary float-right"
              data-dismiss="modal"
              @click="clearCache"
            >
              No
            </button>
            <button
              type="button"
              name="button"
              class="btn btn-primary float-right"
              @click="restoreData"
            >
              Yes
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
  data() {
    return {
      storeData: null
    };
  },
  computed: {
    ...mapGetters({
      localStoreData: "getLocalStoreData"
    })
  },
  methods: {
    // TODO: Switch whole implementation once indexeddb is used

    /**
     * Checks if there is browser cache
     */
    checkBrowserCache() {
      let cache = this.localStoreData;
      if (!cache) return;
      this.storeData = cache;
    },

    /**
     * Clear local storage and emit close event
     */
    clearCache() {
      localStorage.clear();
      this.$emit("close");
    },

    /**
     * Restores data and emits close event
     */
    restoreData() {
      this.$store.commit("initializeStore", { storeData: this.storeData });
      this.$emit("close");
    }
  },
  mounted() {
    this.checkBrowserCache();
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
</style>
