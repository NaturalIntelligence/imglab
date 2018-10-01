import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import svgJs from "./plugins/svg";
import svgDrawJs from "./plugins/svgDrawJs";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faImages,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen as farFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faImages, farFolderOpen, faChevronLeft, faChevronRight);

// Add svg.js and svg.draw.js as plugins
Vue.use(svgJs);
Vue.use(svgDrawJs);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
