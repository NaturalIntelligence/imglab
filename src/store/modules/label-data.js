const state = {
  categories: new Set(),
  attributes: new Set(),
  tags: new Set()
};

const mutations = {
  addCategory(state, { category }) {
    category && state.category.add(category);
  },

  addAttribute(state, { attribute }) {
    attribute && state.attributes.add(attribute);
  },

  addTag(state, { tag }) {
    tag && state.tags.add(tag);
  },

  setCategories(state, { categories }) {
    state.categories = new Set(categories);
  },

  setAttributes(state, { attributes }) {
    state.attributes = new Set(attributes);
  },

  setTags(state, { tags }) {
    state.tags = new Set(tags);
  },

  removeCategory(state, { category }) {
    state.category.delete(category);
  },

  removeAttribute(state, { attribute }) {
    state.attributes.delete(attribute);
  },

  removeTag(state, { tag }) {
    state.tags.delete(tag);
  }
};

const getters = {
  getCategory: state => {
    return Array.from(state.categories);
  },

  getAttributes: state => {
    return Array.from(state.attributes);
  },

  getTags: state => {
    return Array.from(state.tags);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
