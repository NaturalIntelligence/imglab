import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import svgjs from "./plugins/svg";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faImages,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen as farFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.use(svgjs);

library.add(faImages, farFolderOpen, faChevronLeft, faChevronRight);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
