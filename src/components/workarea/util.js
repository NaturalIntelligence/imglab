import store from "../../store/store";

const debounce = require("lodash.debounce");

export let debounceUpdateShape = debounce(function({
  shapeID,
  rbox,
  points,
  featurePoints
}) {
  store.commit("image-store/updateFeaturePoints", { shapeID, featurePoints });
  store.commit("image-store/updateShapeDetail", { shapeID, rbox, points });
},
500);
