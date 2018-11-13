import store from "../store/store";
import { POINT } from "./tool-names";

/**
 * Returns the x and y coordinates of mouse on the canvas
 * @param {Event} event - mouse move event
 * @param {SVG.Element} element - svg canvas
 */
export function getCoordinates(event, element) {
  var rect = element.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  return {
    x: Math.round(x),
    y: Math.round(y)
  };
}

/**
 * Helper function to convert a single value to an array
 * @param {*} val - value to be converted
 */
export function convertToArray(val) {
  if (!val) return [];

  if (val.constructor === Array) {
    return val;
  }

  return [val];
}

/**
 * Adds a unique item to array
 * @param {Array} arr - array of items
 * @param {*} item - item to be added
 * @param {*} key - used to compare object equality
 */
export function setAdd({ arr, item, key }) {
  // Key default is set to item
  if (!key) {
    key = item;
  }

  let index = arr.findIndex(arrItem => {
    return arrItem === key || arrItem.key === key;
  });

  if (index === -1) {
    arr.push(item);
  }
}

/**
 * Removes a unique item from array
 * @param {Array} arr - array of items
 * @param {*} item - item to be removed
 * @param {*} key - used to compare object equality
 */
export function setRemove({ arr, item, key }) {
  // Key default is set to item
  if (!key) {
    key = item;
  }

  let index = arr.findIndex(arrItem => {
    return arrItem === key || arrItem.key === key;
  });

  if (index === -1) return;

  arr.splice(index, 1);
}

export const _ = {
  on(el, type, cb, useCapture = false) {
    return el.addEventListener(type, cb, useCapture);
  },

  off(el, type, cb, useCapture = false) {
    return el.removeEventListener(type, cb, useCapture);
  }
};

/**
 * Returns a formatted string based on arguments
 * e.g. formatID("shapeID", "attribute") returns "shapeID:attribute"
 * @returns {String}
 */
export function formatID() {
  let args = Array.from(arguments);
  return args.slice(1).reduce(function(acc, cur) {
    return acc + ":" + cur;
  }, args[0]);
}

/**
 * Helper function to get svg with custom id
 * @param {SVG.Element} svg - a SVG instance
 * @param {String} id - lookup id
 */
export function getSVG({ svg, id }) {
  let dom = document.getElementById(id);
  return svg.adopt(dom);
}

/**
 * Returns a shortened versioned of ID
 * @param {String} id
 * @returns {String} - type + id
 */
export function prettifyID({ id }) {
  let types = id.split("#");
  let hash = types[1].split("-");
  let eid = hash.pop();
  return types[0] + "#" + eid;
}

/**
 * Helper function to generate shape ID
 * @param {String} type - shape type
 * @returns {String}
 */
export function generateShapeID({ type }) {
  let index = store.getters["image-store/nextShapeHash"]();
  return type + "#" + index;
}

/**
 * Helper function to generate featurePoint ID
 * @param {String} shapeID
 * @returns {String}
 */
export function generateFeaturePointID({ shapeID }) {
  let index = store.getters["image-store/nextFeaturePointHash"](shapeID);
  return POINT + "#" + index;
}
