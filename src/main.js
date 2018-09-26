import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen as farFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faImages, farFolderOpen);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
