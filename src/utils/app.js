export function getCoordinates(event, element) {
  var rect = element.getBoundingClientRect();
  var x = event.pageX - rect.left;
  var y = event.pageY - rect.top;
  return {
    x: x,
    y: y
  };
}

/**
 * Helper function to convert a single value to an array
 */
export function convertToArray(val) {
  if (val instanceof Array) {
    return val;
  }

  return [val];
}

/**
 * Toggles existence of item in array
 * E.g. If item exists, then remove from array. Else add to array
 * @param {Array} arr - any array
 * @param {Any} item - item to be inserted/removed
 */
export function toggleItemInArray(arr, item) {
  if (item) {
    let exists = arr.findIndex(_item => {
      return _item.id == item.id;
    });

    if (exists === -1) {
      arr = arr.concat([item]);
    } else {
      arr.splice(exists, 1);
    }
  }
}

/**
 * Adds a unique item to array
 * @param {Array} arr - array of items
 * @param {Any} item - item to be added
 * @param {Any} key - used to compare object equality
 */
export function setAdd({ arr, item, key }) {
  // Key default is set to item
  if (!key) {
    key = item;
  }

  let index = arr.findIndex(arrItem => {
    return arrItem === key || arrItem === key;
  });

  if (index === -1) {
    arr.push(item);
  }
}

/**
 * Removes a unique item from array
 * @param {Array} arr - array of items
 * @param {Any} item - item to be removed
 * @param {Any} key - used to compare object equality
 */
export function setRemove({ arr, item, key }) {
  // Key default is set to item
  if (!key) {
    key = item;
  }

  let index = arr.findIndex(arrItem => {
    return arrItem === key || arrItem === key;
  });

  if (index === -1) return;

  arr.splice(index, 1);
}

export const _ = {
  on(el, type, cb) {
    return el.addEventListener(type, cb);
  },

  off(el, type, cb) {
    return el.removeEventListener(type, cb);
  }
};
