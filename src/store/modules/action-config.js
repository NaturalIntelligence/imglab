import { convertToArray, setAdd, setRemove } from "../../utils/app";

const state = {
  copiedElements: [],
  selectedTool: null,
  selectedToolDom: null,
  selected: {
    shapes: [],
    featurePoints: [],
    lastShape: null
  }
};

const mutations = {
  /**
   * Adds shapes / featurePoints
   * @param {String[]} shapes - array of shape ids
   * @param {String[]} featurePoints - array of featurePoint ids
   */
  addSelectedElement(state, { shapeID, featurePointID }) {
    if (shapeID) {
      setAdd({ arr: state.selected.shapes, item: shapeID });
      state.selected.lastShape = shapeID;
    }

    if (featurePointID) {
      setAdd({ arr: state.selected.featurePoints, item: featurePointID });
    }
  },

  /**
   * Removes a shape or featurePoint from selected elements
   * @param {String} shapeID - shape id
   * @param {String} featurePointID - featurePoint id
   */
  removeSelectedElement(state, { shapeID, featurePointID }) {
    if (shapeID === state.selected.lastShape) {
      state.selected.lastShape = null;
    }
    setRemove({ arr: state.selected.shapes, item: shapeID });
    setRemove({ arr: state.selected.featurePoints, item: featurePointID });
  },

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
   * @param {String || String[]} shapes - array of shape ids
   * @param {String || String[]} featurePoints - array of featurePoint ids
   */
  setSelectedElements(state, { shapes, featurePoints } = {}) {
    // Convert shapes and featurePoints to array if necessary
    state.selected.shapes = convertToArray(shapes);
    state.selected.featurePoints = convertToArray(featurePoints);
    state.selected.lastShape = state.selected.shapes.slice(-1)[0] || null;
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
        shapes: new Set(),
        featurePoints: new Set()
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

  /**
   * Returns the last shape id added into set
   * @returns {String} last shape id added
   */
  getSelectedShape: state => {
    return state.selected.lastShape;
  },

  /**
   * Returns an array of selected shape ids
   * @returns {String[]} array of selected shape ids
   */
  getSelectedShapes: state => {
    return state.selected.shapes;
  },

  /**
   * Returns an array of selected feature point ids
   * @returns {String[]} array of selected feature point ids
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
