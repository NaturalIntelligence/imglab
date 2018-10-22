import Vue from "vue";
import App from "./App.vue";
// import App from "./test.vue";
import store from "./store/store";
import svgjs from "./plugins/svg";
import InputTag from "vue-input-tag";
import Draggable from "vuedraggable";
import AutocompleteInput from "./components/autocomplete-input/autocomplete-input";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faImages,
  faChevronLeft,
  faChevronRight,
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

Vue.use(svgjs);

library.add(
  faImages,
  faChevronLeft,
  faChevronRight,
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
