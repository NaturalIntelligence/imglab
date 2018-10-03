import Vue from "vue";
import Vuex from "vuex";
import appConfig from "./modules/app-config";
import actionConfig from "./modules/action-config";
import imageStore from "./modules/image-store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    "app-config": appConfig,
    "action-config": actionConfig,
    "image-store": imageStore
  }
});
