import { Image } from "../../models/Image";
import { Shape } from "../../models/Shape";

function getShape(state, imageName, shapeID) {
  return state.images[imageName].shapes.find(shape => {
    return shape.id === shapeID;
  });
}

const state = {
  images: {},
  imageSelected: ""
};

const mutations = {
  /**
   * Adds an image to images array
   * @param {String} imageName - name of image
   * @param {Object} imageSize - {
   *   width        - original width of image
   *   height       - original height of image
   *   scaledWidth  - scaled width of image
   *   scaledHeight - scaled height of image
   *   imageScale   - current image scale
   * }
   */
  addImageToStore(state, { name, src, size }) {
    // Only add image to array if it has never been added before
    if (!state.images[name]) {
      let newImage = new Image({ name, src, size });
      state.images[name] = newImage;
    }
  },

  /**
   * Sets selected image via name
   * @param {String} name - image name
   */
  setImageSelected(state, { name }) {
    if (name) {
      state.imageSelected = name;
    }
  },

  /**
   * Adds a shape to image and returns a shape data object
   */
  // attachShapeToImage(id, type, bbox, points){
  //   var shape = scaleShape(id, type, bbox, points, 1 / imgSelected.size.imageScale);
  //   labellingData[ imgSelected.name ].shapes.push(shape);
  //   return shape;
  // },

  /**
   * Update shape label
   */
  updateLabel(newLabel) {
    this.label = newLabel;
  },

  // updateFeaturePointInStore(shapeId, pointid, position, newLabel){
  //   var shape = getShape(shapeId);
  //   var scale = 1 / imgSelected.size.imageScale;
  //   var featurePoints = shape.featurePoints;
  //   var index = indexOf(featurePoints, "id", pointid);
  //
  //   if (position) {
  //     featurePoints[index].x = position.cx * scale;
  //     featurePoints[index].y = position.cy * scale;
  //   }
  //
  //   if (newLabel) {
  //     featurePoints[index].label = newLabel
  //   }
  // },

  /**
   * Returns a shape if shapeID exists, else -1
   * @param {String} shapeID
   * @returns {Shape | Number} - returns shape if exists, else -1
   */
  // getShapeByID(shapeID){
  //   return this.shapes.find(shape => {
  //     return shape.id === shapeId;
  //   });
  // },

  /**
   * Removes shape from image
   * @param {String} shapeID
   */
  detachShape(shapeID) {
    var index = this.shapes.findIndex(shape => {
      return shape.id === shapeID;
    });
    this.shapes.splice(index, 1);
  },

  /**
   * Scales the rbox of shape according to scale
   * @param {Object} bbox - rbox of shape
   * @param {number} scale
   * @returns {Object} scaled rbox
   */
  scaleBbox(bbox, scale) {
    return {
      x: bbox.x * scale,
      y: bbox.y * scale,
      cx: (bbox.cx || 0) * scale,
      cy: (bbox.cy || 0) * scale,
      w: bbox.w * scale,
      h: bbox.h * scale,
      width: bbox.w * scale,
      height: bbox.h * scale
    };
  },

  /**
   * Scales the feature points according to scale
   * @param {featurePoints[]} featurePoints - array of featurePoints
   * @param {number} scale
   * @returns {featurePoints[]} scaled featurePoints
   */
  scaleFeaturePoints(featurePoints, scale) {
    if (!featurePoints) return;

    return featurePoints.map(point => {
      return {
        x: point.x * scale,
        y: point.y * scale,
        label: point.label,
        id: point.id
      };
    });
  }

  // updateShapeDetailInStore(shapeId, bbox, points){
  //   var shapes = labellingData[ imgSelected.name ].shapes;
  //   var shape = getShape(shapeId);
  //   var index = indexOf(shapes, "id", shapeId);
  //   var scale = 1 / imgSelected.size.imageScale;
  //   bbox && (shapes[index].bbox = scaleBbox(bbox, scale));
  //   points && (shapes[index].points = scaleShapePoints(points, scale, shape.type));
  // },

  /**
   * Adds a shape into labelling data and returns a shape object
   */
  // attachShapeToImg(id, type, bbox, points){
  //   var shape = scaleShape(id, type, bbox, points, 1 / imgSelected.size.imageScale);
  //   labellingData[ imgSelected.name ].shapes.push(shape);
  //   return shape;
  // }
};

const getters = {
  /**
   * Returns an array of images
   * @returns {Image[]} array of images
   */
  getImages: state => {
    return state.images;
  },

  /**
   * Returns selected image
   * @returns {Image | undefined} selected image, else undefined
   */
  getImageSelected: (state, getters) => {
    return getters.getImageByName(state.imageSelected);
  },

  /**
   * Get image by name
   * @returns {Function(): Image} takes an image name and returns an Image object
   */
  getImageByName: state =>
    /**
     * Returns and image
     * @param {String} name - image name
     * @returns {Image | undefined}
     */
    name => {
      return state.images[name];
    },
  /**
   * Gets image property by supplying image name and image prop
   * @returns {Function(): any} takes
   */
  getImageProp: state =>
    /**
     * Returns image property
     * @param {String} name - image names
     * @param {String} prop - prop name
     * @returns {any} any property type if it exists, else undefined
     */
    (name, prop) => {
      return state.images[name][prop];
    }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
