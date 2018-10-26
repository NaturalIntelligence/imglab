import { setAdd, setRemove } from "../../utils/app";

const state = {
  properties: [],
  propValues: {},
  categories: [],
  tags: []
};

const mutations = {
  /**
   * Add an attribute to app
   * @param {String} property
   * @param {String} value
   */
  addAttribute(state, { property, value }) {
    if (!property || !value) return;
    setAdd({ arr: state.properties, item: property });

    if (!state.propValues[property]) {
      state.propValues = { ...state.propValues, [property]: [value] };
    } else {
      setAdd({ arr: state.propValues[property], item: value });
    }
  },

  /**
   * Adds an property to store, if property doesn't exist, create a new
   * property to value mapping
   * @param {String} property
   */
  addProperty(state, { property }) {
    // Stop if property is invalid
    if (!property) return;
    setAdd({ arr: state.properties, item: property });

    // Stop if property already exists
    if (state.propValues[property]) return;
    // Create a new entry in propValues
    state.propValues = { ...state.propValues, [property]: [] };
  },

  /**
   * Adds a category to store
   * @param {String} category
   */
  addCategory(state, { category }) {
    category && setAdd({ arr: state.categories, item: category });
  },

  /**
   * Adds a tag to store
   * @param {String} tag
   */
  addTag(state, { tag }) {
    tag && setAdd({ arr: state.tags, item: tag });
  },

  /**
   * Maps property to value
   * @param {String} property
   * @param {String} value
   */
  addValue(state, { property, value }) {
    property &&
      value &&
      setAdd({ arr: state.propValues[property], item: value });
  },

  /**
   * Sets new property to values mapping
   * @param {String[]} properties - array of properties
   * @param {Object} propValues - object containing property-value mappings
   */
  setProperties(state, { properties, propValues }) {
    state.properties = properties;
    state.propValues = propValues;
  },

  /**
   * Set an existing property's values
   * @param {String} property - property name
   * @param {String[]} values - new values
   */
  setProperty(state, { property, values }) {
    let propValues = state.propValues[property];
    propValues && (state.propValues[property] = values);
  },

  /**
   * Sets a new category for store
   * @param {String[]} categories
   */
  setCategories(state, { categories }) {
    state.categories = categories;
  },

  /**
   * Sets new tags for store
   * @param {String[]} rags
   */
  setTags(state, { tags }) {
    state.tags = tags;
  },

  /**
   * Remove a property and its values from store
   * @param {String} property
   */
  removeProperty(state, { property }) {
    property && setRemove({ arr: state.properties, item: property });
    state.propValues[property] = undefined;
  },

  /**
   * Remove a category from store
   * @param {String} category
   */
  removeCategory(state, { category }) {
    category && setRemove({ arr: state.categories, item: category });
  },

  /**
   * Remove a tag from store
   * @param {String} tag
   */
  removeTag(state, { tag }) {
    tag && setRemove({ arr: state.tags, item: tag });
  },

  /**
   * Remove a value from store
   * @param {String} property
   * @param {String} value
   */
  removeValue(state, { property, value }) {
    value && setRemove({ arr: state.propValues[property], item: value });
  },

  /**
   * Initialize store with appropriate values
   * @param {String[]} properties
   * @param {Object} propValues
   * @param {String[]} categories
   * @param {String[]} tags
   */
  init(
    state,
    { properties = [], propValues = {}, categories = [], tags = [] }
  ) {
    properties && (state.properties = properties);
    propValues && (state.propValues = propValues);
    categories && (state.categories = categories);
    tags && (state.tags = tags);
  }
};

const getters = {
  getCategory: state => {
    return state.categories;
  },

  getProperties: state => {
    return state.properties;
  },

  getTags: state => {
    return state.tags;
  },

  getValues: state => property => {
    return state.propValues[property];
  },

  /**
   * Returns store data: Returns raw data
   */
  getStoreData: state => {
    let cloneDeepWith = require("lodash.clonedeepwith");
    return cloneDeepWith(state);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
