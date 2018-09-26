const state = {
  autosave: {
    syncingInterval: 10 * 1000, //10 seconds
    enable: true,
    deleteIfExported: true //Mark the data as saved when exported as nimn format, and delte the copy from browser cache.
  },
  zoomStepSize: 0.1,
  featurePointColor: "#ee0000"
};

const mutations = {
  /**
   * Set zoom step size
   * @param {number} zoomStepSize - zoom step size
   */
  setZoomStepSize(state, { zoomStepSize = 0.1 } = {}) {
    state.zoomStepSize = zoomStepSize;
  },

  /**
   * Set feature point color
   * @param {string} featurePointColor - color of feature point, default color is red
   */
  setFeaturePointColor(state, { featurePointColor = "#ee0000" } = {}) {
    state.featurePointColor = featurePointColor;
  },

  /**
   * Set autosave config
   * @param {number} synchingInterval - synchingInterval in milliseconds
   * @param {boolean} enable
   * @param {boolean} deleteIfExported
   */
  setAutoSave(
    state,
    { syncingInterval = 1, enable = true, deleteIfExported = true } = {}
  ) {
    state.autosave = {
      syncingInterval,
      enable,
      deleteIfExported
    };
  }
};

const getters = {
  /**
   * Returns the feature point color
   */
  getFeaturePointColor: state => {
    return state.featurePointColor;
  },

  /**
   * Returns the zoom step size
   */
  getZoomStepSize: state => {
    return state.zoomStepSize;
  },

  /**
   * Returns the current autosave config
   * @returns {Object} - {
   *   synchingInterval : number,
   *   enable           : boolean,
   *   deleteIfExported : boolean,
   * }
   */
  getAutosave: state => {
    return state.autosave;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
