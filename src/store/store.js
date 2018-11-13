import Vue from "vue";
import Vuex from "vuex";
import appConfig from "./modules/app-config";
import actionConfig from "./modules/action-config";
import imageStore from "./modules/image-store";
import labelData from "./modules/label-data";

Vue.use(Vuex);

// const throttle = require("lodash.throttle");

const mutations = {
  /**
   * Initialze the store with data stored in local storage
   * @param {String} storeData - json string containing store data
   */
  initializeStore(state, { storeData }) {
    if (!storeData) {
      storeData = localStorage.getItem("imglab-store");
    }
    this.replaceState(Object.assign(state, storeData));
  }
};

const getters = {
  getLocalStoreData: () => {
    return localStorage.getItem("imglab-store");
  }
};

const store = new Vuex.Store({
  modules: {
    "app-config": appConfig,
    "action-config": actionConfig,
    "image-store": imageStore,
    "label-data": labelData
  },
  getters,
  mutations
});

/**
 * Subscribe to store mutations and store state to local storage
 */
// store.subscribe(
// TODO: Use indexdb to store session data
// throttle(function(mutation, state) {
//   localStorage.setItem("imglab-store", JSON.stringify(state));
// }, 5000)
// );
export default store;
