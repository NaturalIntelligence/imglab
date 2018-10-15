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

export const _ = {
  on(el, type, cb) {
    return el.addEventListener(type, cb);
  },

  off(el, type, cb) {
    return el.removeEventListener(type, cb);
  }
};
