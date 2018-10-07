import { Image } from "../../models/Image";
import { FeaturePoint } from "../../models/FeaturePoint";
import {
  scaleShape,
  scaleShapePoints,
  scaleRbox,
  scaleFeaturePoints
} from "../../utils/scale-shapes";

/**
 * Helper function to get the shape via the image name and shape ID
 * @param {Observer} state - state of image store
 * @param {String} imageName - name of image
 * @param {String} shapeID - shape ID
 */
function getShape(state, imageName, shapeID) {
  return state.images[imageName].shapes.find(shape => {
    return shape.id === shapeID;
  });
}

const state = {
  images: {},
  imageSelected: null
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
   * Adds a shape to current image and returns a Shape object
   * @param {String} id - id of shape
   * @param {String} type - type of shape
   * @param {SVG.Rbox} rbox - rbox of shape
   * @param {Array[]} points - array of shape metadata,
   * @returns {Shape} shape - a Shape object
   * @see getPoints for more info about points
   */
  addShapeToImage(state, { id, type, rbox, points }) {
    var shape = scaleShape(
      id,
      type,
      rbox,
      points,
      1 / state.imageSelected.size.imageScale
    );

    state.imageSelected.shapes.push(shape);

    return shape;
  },

  /**
   * Adds a feature point to a shape
   * @param {String} shapeID - id of shape
   * @param {String} pointID - id of point
   * @param {SVG.Rbox} position - rbox of point
   */
  addPointToShape(state, { shapeID, pointID, position }) {
    var shape = getShape(state, state.imageSelected.name, shapeID);
    var scale = 1 / state.imageSelected.size.imageScale;
    shape.featurePoints.push(
      new FeaturePoint({
        x: position.cx * scale,
        y: position.cy * scale,
        id: pointID,
        label: shape.featurePoints.length
      })
    );
  },

  /**
   * Removes shape from image
   * @param {String} shapeID
   * @returns {Shape | undefined} removed shape or undefined if shape DNE
   */
  detachShapeFromImage(state, { imageName, shapeID }) {
    let name = imageName || state.imageSelected.name;

    let shapes = state.images[name].shapes;
    let index = shapes.findIndex(shape => shape.id === shapeID);

    if (index < 0) return;

    let shape = shapes.splice(index, 1);
    return shape;
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
   * Sets the current image opacity
   * @param {Number} opacity - image opacity
   */
  setImageOpacity(state, { opacity = 1 }) {
    if (state.imageSelected) {
      state.imageSelected.opacity = opacity;
    }
  },

  /**
   * Update shape label
   * @param {String} shapeID - id of shape
   * @param {String} newLabel - new label
   */
  updateLabel(status, { shapeID, newLabel }) {
    let shape = getShape(state, state.imageSelected.name, shapeID);
    if (shape) {
      shape.label = newLabel;
    }
  },

  /**
   * Updates a single feature point
   * @param {String} shapeID - id of shape
   * @param {String} pointID - id of point
   * @param {SVG.Rbox} position
   * @param {String} newLabel - new label for feature point
   */
  updateFeaturePoint(
    state,
    { shapeID, pointID, position, newLabel = undefined }
  ) {
    var shape = getShape(state, state.imageSelected.name, shapeID);
    var scale = 1 / state.imageSelected.size.imageScale;

    var index = shape.featurePoints.findIndex(featurePoint => {
      return featurePoint.id == pointID;
    });
    var point = shape.featurePoints[index];

    shape.featurePoints[index] = new FeaturePoint({
      x: position.cx * scale,
      y: position.cy * scale,
      label: newLabel || point.label,
      id: pointID
    });
  },

  updateFeaturePoints(state, { shapeID, featurePoints }) {
    let shape = state.imageSelected.shapes.find(shape => shape.id === shapeID);
    let scale = 1 / state.imageSelected.size.imageScale;

    shape.featurePoints = scaleFeaturePoints(featurePoints, scale);
  },

  /**
   * Update shape details
   * @param {String} shapeID - id of shape
   * @param {SVG.Rbox} rbox
   * @param {Point[]} points - points of a shape, e.g. 4 corners of a rectangle
   */
  updateShapeDetail(state, { shapeID, rbox, points }) {
    var shapes = state.images[state.imageSelected.name].shapes;
    var shape = shapes.find(shape => {
      return shape.id === shapeID;
    });
    var scale = 1 / state.imageSelected.size.imageScale;
    rbox && (shape.rbox = scaleRbox(rbox, scale));
    points && (shape.points = scaleShapePoints(points, scale, shape.type));
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
     * Takes a name and returns an image
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
