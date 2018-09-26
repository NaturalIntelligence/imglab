import { Image } from "../../models/Image";
import {
  scaleShape,
  scaleShapePoints,
  scaleRbox
} from "../../utils/scale-shapes";

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
   * Adds a shape to image and returns a shape data object
   */
  attachShapeToImage(state, { id, type, rbox, points }) {
    var shape = scaleShape(
      id,
      type,
      rbox,
      points,
      1 / state.imageSelected.size.imageScale
    );
    state.images[state.imageSelected.name].shapes.push(shape);
    return shape;
  },

  /**
   * Removes shape from image
   * @param {String} shapeID
   */
  detachShapeFromImage(state, { imageName, shapeID }) {
    let name = imageName || state.imageSelected.name;
    var index = state.images[name].shapes.findIndex(shape => {
      return shape.id === shapeID;
    });

    if (index !== -1) {
      this.shapes.splice(index, 1);
    }
  },

  /**
   * Sets selected image via name
   * @param {String} name - image name
   */
  setImageSelected(state, { name }) {
    if (name) {
      state.imageSelected = state.images[name];
    }
  },

  /**
   * Update shape label
   */
  updateLabel(status, { shapeID, newLabel }) {
    let shape = getShape(state, state.imageSelected.name, shapeID);
    if (shape) {
      shape.label = newLabel;
    }
  },

  updateFeaturePoints(state, { shapeID, pointID, position, newLabel }) {
    var shape = getShape(state, state.imageSelected.name, shapeID);
    var scale = 1 / state.imageSelected.size.imageScale;
    var featurePoints = shape.featurePoints;
    var index = featurePoints.findIndex(point => {
      return point.id == pointID;
    });

    if (position) {
      featurePoints[index].x = position.cx * scale;
      featurePoints[index].y = position.cy * scale;
    }

    if (newLabel) {
      featurePoints[index].label = newLabel;
    }
  },

  updateShapeDetailInStore(state, { shapeID, rbox, points }) {
    var shapes = state.images[state.imageSelected.name].shapes;
    var shape = getShape(state, state.imageSelected.name, shapeID);
    var index = shapes.findIndex(shape => {
      return shape.id === shapeID;
    });
    var scale = 1 / state.imageSelected.size.imageScale;
    rbox && (shapes[index].rbox = scaleRbox(rbox, scale));
    points &&
      (shapes[index].points = scaleShapePoints(points, scale, shape.type));
  }
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
  getImageSelected: state => {
    return state.imageSelected;
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
   * Gers shape by id
   * @returns {Function(): Shape} takes a shapeID and returns a shape
   */
  getShapeByID: state => shapeID => {
    return getShape(state, state.imageSelected.name, shapeID);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
