import Vue from "vue";
import Vuex from "vuex";
import appConfig from "./modules/app-config";
import imagesConfig from "./modules/imagesconfig";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    appConfig,
    imagesConfig
  }
});
