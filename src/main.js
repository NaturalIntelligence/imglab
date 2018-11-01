import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import svgjs from "./plugins/svg";
import InputTag from "vue-input-tag";
import Draggable from "vuedraggable";
import AutocompleteInput from "./components/autocomplete-input/autocomplete-input";
import VueAnalytics from "vue-analytics";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faChevronLeft,
  faChevronRight,
  faImages,
  faPlus,
  faSearchPlus,
  faSearchMinus,
  faTimes,
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import {
  faFolderOpen as farFolderOpen,
  faHandRock as farHandRock,
  faLightbulb as farLightbulb,
  faTrashAlt as farTrashAlt
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";

Vue.use(VueAnalytics, {
  id: "UA-128418867-1"
});
Vue.use(svgjs);

library.add(
  faBars,
  faChevronLeft,
  faChevronRight,
  faImages,
  faPlus,
  faSearchPlus,
  faSearchMinus,
  faTimes,
  faUndo,
  farFolderOpen,
  farHandRock,
  farLightbulb,
  farTrashAlt
);

Vue.component("autocomplete-input", AutocompleteInput);
Vue.component("draggable", Draggable);
Vue.component("input-tag", InputTag);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
