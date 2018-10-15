const SVG = require("svg.js");
require("svg.draw.js");
require("svg.select.js");
require("svg.draggable.js");
require("svg.resize.js");

export default {
  install: Vue => {
    Vue.prototype.$svg = SVG;
  }
};
