const state = {
  selectedElements: [],
  copiedElements: [],
  selectedToolDom: null,
  selectedTool: null,
  selectedElement: null,
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
   * Assign currently selected element
   * @param {SVGElement} selectedElement - currently selected SVGElement on the canvas
   */
  setSelectedElement(state, { selectedElement = null } = {}) {
    state.selectedElement = selectedElement;
  },

  /**
   * Assign selected elements
   * @param {SVGElement[]} selectedElements - array of SVGElements that are selected on the canvas
   */
  setSelectedElements(state, { selectedElements = [] } = {}) {
    state.selectedElements = selectedElements;
  },

  /**
   * Adds a single shape into selectedElements
   * @param {Shape} shape - SVG shape
   */
  addShapeToSelectedElements(state, { shape }) {
    if (shape) {
      state.selectedElements.push(shape);
    }
  },

  /**
   * Intialize the state of the image
   * @param {shape[]} copiedElements - array of copied shapes
   * @param {object} selectedTool - selected tool
   * @param {SVGElement} selectedElement - selected shape, used to show label data
   * @param {SVGElement[]} selectedElements - array of selected SVGElements
   * @param {boolean} alreadyDrawing - toggle to draw/stop
   */
  init(
    state,
    {
      copiedElements = [],
      selectedTool = null,
      selectedElement = null,
      selectedElements = []
    } = {}
  ) {
    state = {
      copiedElements,
      selectedTool,
      selectedElement,
      selectedElements,
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
   * Returns a selected element
   * @returns {SVGElement} selected element
   */
  getSelectedElement: state => {
    return state.selectedElement;
  },

  /**
   * Returns an array of selected elements
   * @returns {SVGElement[]} array of selected element
   */
  getSelectedElements: state => {
    return state.selectedElements;
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
