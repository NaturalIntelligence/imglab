import { setAdd, setRemove } from "../../utils/app";

const state = {
  categories: [],
  attributes: [],
  tags: []
};

const mutations = {
  addCategory(state, { category }) {
    category && setAdd({ arr: state.category, item: category });
  },

  addAttribute(state, { attribute }) {
    attribute && setAdd({ arr: state.attributes, item: attribute });
  },

  addTag(state, { tag }) {
    tag && setAdd({ arr: state.tags, item: tag });
  },

  setCategories(state, { categories }) {
    state.categories = categories;
  },

  setAttributes(state, { attributes }) {
    state.attributes = attributes;
  },

  setTags(state, { tags }) {
    state.tags = tags;
  },

  removeCategory(state, { category }) {
    category && setRemove({ arr: state.category, item: category });
  },

  removeAttribute(state, { attribute }) {
    attribute && setRemove({ arr: state.attributes, item: attribute });
  },

  removeTag(state, { tag }) {
    tag && setRemove({ arr: state.tags, item: tag });
  }
};

const getters = {
  getCategory: state => {
    return state.categories;
  },

  getAttributes: state => {
    return state.attributes;
  },

  getTags: state => {
    return state.tags;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
