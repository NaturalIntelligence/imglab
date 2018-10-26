import { getSVG } from "./app";
// Ascii keycode constants
export const KEY = {
  ENTER: 13,
  DEL: 46,
  A: 65,
  C: 67,
  V: 84
};

/**
 * Helper method to remove feature point from the canvas and the store
 * @param {SVG} SVG - expect (Vue.svg / this.$svg)
 * @param {Vuex} store - expect (Vue.store / this.$store)
 * @param {String} shapeID - shape id
 * @param {String} featurePointID - feature point id
 */
export function removeFeaturePoint({ svg, store, shapeID, featurePointID }) {
  // Deselect feature point and remove from canvas
  let svgFP = getSVG({ svg, id: featurePointID });
  svgFP.selectize(false);
  svgFP.remove();

  // Remove feature point from shape
  store.commit("image-store/detachFeaturePoint", {
    shapeID,
    featurePointID
  });

  // Remove from list of selected feature points
  store.commit("action-config/removeSelectedElement", {
    featurePointID
  });
}
