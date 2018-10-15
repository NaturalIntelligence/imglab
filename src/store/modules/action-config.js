import { convertToArray } from "../../utils/app";

const state = {
  copiedElements: [],
  selectedToolDom: null,
  selectedTool: null,
  selected: {
    shapes: [],
    featurePoints: []
  }
};

const mutations = {
  /**
   * Sets the copied elements into an array
   * @param {shape[]} copiedElements - array of shape data
   */
  setCopiedElements(state, { copiedElements = [] } = {}) {
    state.copiedElements = copiedElements;
  },

  /**
   * Assign selected tool
   * @param {Element} selectedTool - Dom element of selected tool
   * @see /components/tools/tools/[shape].js for more info
   */
  setSelectedTool(state, { dom, selectedTool } = {}) {
    if (state.selectedTool) {
      // Remove previous tool style
      state.selectedToolDom.classList.remove("tool-selected");
    }
    state.selectedTool = selectedTool;
    state.selectedToolDom = dom;
    // Add selected style to current tool
    if (dom) {
      state.selectedToolDom.classList.add("tool-selected");
    }
  },

  /**
   * Assign selected shapes / featurePoints
   * @param {String[]} shapes - array of shape ids
   * @param {String[]} featurePoints - array of featurePoint ids
   */
  setSelectedElements(state, { shapes = [], featurePoints = [] } = {}) {
    // Convert shapes and featurePoints to array if necessary
    state.selected.shapes = convertToArray(shapes);
    state.selected.featurePoints = convertToArray(featurePoints);
  },

  /**
   * Adds shapes / featurePoints
   * @param {String[]} shapes - array of shape ids
   * @param {String[]} featurePoints - array of featurePoint ids
   */
  addSelectedElement(state, { shapeID, featurePointID }) {
    if (shapeID) {
      state.selected.shapes = state.selected.shapes.concat([shapeID]);
    }

    if (featurePointID) {
      state.selected.featurePoints = state.selected.shapes.concat([
        featurePointID
      ]);
    }
  },

  /**
   * Intialize the state of the image
   * @param {Shape[]} copiedElements - array of copied shapes
   * @param {Object} selectedTool - selected tool
   * @param {Object} selected - object containing array of shapes and featurePoints
   * @param {Boolean} alreadyDrawing - toggle to draw/stop
   */
  init(
    state,
    {
      copiedElements = [],
      selectedTool = null,
      selected = {
        shapes: [],
        featurePoints: []
      }
    } = {}
  ) {
    state = {
      copiedElements,
      selectedTool,
      selected
    };
  }
};

const getters = {
  /**
   * Returns an array of copied elements
   * @returns {shape[]} array of copied elements
   */
  getCopiedElements: state => {
    return state.copiedElements;
  },

  /**
   * Returns selected tool
   * @returns {object} tool selected
   */
  getSelectedTool: state => {
    return state.selectedTool;
  },

  getSelectedShape: state => {
    return state.selected.shapes.slice(-1)[0]
  },
  /**
   * Returns an array of selected shapes
   * @returns {SVG.Shape[]} array of selected shapes
   */
  getSelectedShapes: state => {
    return state.selected.shapes;
  },

  /**
   * Returns an array of selected feature points
   * @returns {FeaturePoint[]} array of selected feature points
   */
  getSelectedFeaturePoints: state => {
    return state.selected.featurePoints;
  },

  /**
   * Returns the config Object
   * @returns {Object} config object
   */
  getConfig: state => {
    return state;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
