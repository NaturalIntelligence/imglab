import { setAdd, setRemove, formatID } from "../../utils/app";
import { Image } from "../../models/Image";
import { FeaturePoint } from "../../models/FeaturePoint";
import { Attribute } from "../../models/Attribute";
import {
  scaleShape,
  scaleShapePoints,
  scaleRbox,
  scaleFeaturePoints
} from "../../utils/scale-shapes";

const state = {
  images: {},
  shapes: {},
  featurePoints: {},
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
      state.images = { ...state.images, [name]: newImage };
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

    state.imageSelected.shapes.push(id);
    state.shapes = { ...state.shapes, [id]: shape };

    return shape;
  },

  /**
   * Adds a feature point to a shape
   * @param {String} shapeID - id of shape
   * @param {String} pointID - id of point
   * @param {SVG.Rbox} position - rbox of point
   */
  addPointToShape(state, { shapeID, pointID, position }) {
    var shape = state.shapes[shapeID];
    var scale = 1 / state.imageSelected.size.imageScale;
    shape.featurePoints.push(pointID);
    state.featurePoints = {
      ...state.featurePoints,
      [pointID]: new FeaturePoint({
        x: position.cx * scale,
        y: position.cy * scale,
        id: pointID,
        label: shape.featurePoints.length
      })
    };
  },

  /**
   * Adds a attribute to shape with a valid property and value
   * @param {String} attribute - attribute
   */
  addAttributeToShape(state, { shapeID, property, value }) {
    if (!property || !value) return;

    let key = formatID(property, value);
    state.shapes[shapeID].attributes.push(
      new Attribute({ key, property, value })
    );
  },

  /**
   * Adds a category to shape
   * @param {String} categpry - category
   */
  addCategoryToShape(state, { shapeID, category }) {
    setAdd({ arr: state.shapes[shapeID].category, item: category });
  },

  /**
   * Adds a tag to shape
   * @param {String} shapeID - id of shape
   * @param {String} tag - tag
   */
  addTagToShape(state, { shapeID, tag }) {
    setAdd({ arr: state.shapes[shapeID].tags, item: tag });
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
    // Detach shape from image
    let shape = shapes.splice(index, 1);

    // Detach feature points from shape
    state.shapes[shapeID].featurePoints.forEach(featurePointID => {
      state.featurePoints[featurePointID] = undefined;
    });

    // Detach shape
    state.shapes[shapeID] = undefined;

    return shape;
  },

  detachFeaturePoint(state, { shapeID, featurePointID }) {
    let shape = state.shapes[shapeID];

    let index = shape.featurePoints.findIndex(fpID => {
      return fpID === featurePointID;
    });

    // Feature point does not exist
    if (index === -1) return;

    // Remove feature point from shape
    shape.featurePoints.splice(index, 1);
    state.featurePoints[featurePointID] = undefined;
  },

  /**
   * Removes an attribute from shape
   * @param {String} shapeID - shape id
   * @param {String} attribute - attribute
   */
  removeAttributeFromShape(state, { shapeID, index }) {
    state.shapes[shapeID].attributes.splice(index, 1);
  },

  /**
   * Removes a category from shape
   * @param {String} shapeID - shape id
   * @param {String} category - category
   */
  removeCategoryFromShape(state, { shapeID, category }) {
    setRemove({ arr: state.shapes[shapeID].category, item: category });
  },

  /**
   * Removes a tag from shape
   * @param {String} shapeID - shape id
   * @param {String} tag - tag
   */
  removeTagFromShape(state, { shapeID, tag }) {
    setRemove({ arr: state.shapes[shapeID].tags, item: tag });
  },

  /**
   * Removes a value from shape attribute
   * @param {String} shapeID - shape id
   * @param {String} tag - tag
   */
  removeValueFromAttribute(state, { shapeID, attribute, value }) {
    let id = formatID(shapeID, attribute);
    // Only remove if id exists
    if (state.shapeAttributes[id]) {
      setRemove({ arr: state.shapeAttributes[id], item: value });
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
   * Sets feature point size for current image
   * @param {Number} featurePointSize
   */
  setFeaturePointSize(state, { featurePointSize }) {
    if (state.imageSelected) {
      state.imageSelected.featurePointSize = featurePointSize;
    }
  },

  /**
   * Updates shape attribute only if attribute fields are filled
   * @param {String} shapeID
   * @param {String} oldProp
   * @param {String} oldValue
   * @param {String} newProp
   * @param {String} newValue
   */
  updateAttribute(state, { shapeID, oldProp, oldValue, newProp, newValue }) {
    if (!oldProp || !oldValue || !newProp || !newValue) return;

    let oldID = formatID(oldProp, oldValue);
    let newID = formatID(newProp, newValue);
    let shapeAttrs = state.shapes[shapeID].attributes;

    let index = shapeAttrs.findIndex(attr => {
      return attr.key === oldID;
    });

    shapeAttrs.splice(
      index,
      1,
      new Attribute({ key: newID, property: newProp, value: newValue })
    );
  },

  /**
   * Updates a single feature point
   * @param {String} pointID - id of point
   * @param {SVG.Rbox} position
   * @param {String} newLabel - new label for feature point
   */
  updateFeaturePoint(state, { pointID, position, newLabel = undefined }) {
    let scale = 1 / state.imageSelected.size.imageScale;

    let point = state.featurePoints[pointID];

    if (position) {
      point.x = position.cx * scale;
      point.y = position.cy * scale;
    }

    newLabel && (point.label = newLabel);
  },

  /**
   * Updates feature points of shape
   * @param {String} shapeID
   * @param {FeaturePoint[]} featurePoints
   * @param {Boolean} switchposition - flag to indicate position switch only
   */
  updateFeaturePoints(
    state,
    { shapeID, featurePoints, switchPosition = false }
  ) {
    let shape = state.shapes[shapeID];
    let scale = 1 / state.imageSelected.size.imageScale;

    // Update list of feature point list of shape
    shape.featurePoints = featurePoints.map(featurePoint => {
      return featurePoint.id;
    });

    // Stop after switch positions
    if (switchPosition) return;

    // Scale feature points and insert into store
    let scaledFeaturePoints = scaleFeaturePoints(featurePoints, scale);

    // Use temp to batch assign feature points
    let temp = {};
    scaledFeaturePoints.forEach(sFP => (temp[sFP.id] = sFP));

    state.featurePoints = { ...state.featurePoints, ...temp };
  },

  /**
   * Update shape details
   * @param {String} shapeID - id of shape
   * @param {String[]} attributes - shape attributes
   * @param {String[]} category - shape categories
   * @param {String[]} tags - shape tags
   * @param {String} label - shape label
   * @param {Point[]} points - points of a shape, e.g. 4 corners of a rectangle
   * @param {SVG.Rbox} rbox - shape rbox
   * @param {Number} zoomScale - shape zoomScale
   */
  updateShapeDetail(
    state,
    { shapeID, category, tags, label, points, rbox, zoomScale }
  ) {
    var shape = state.shapes[shapeID];
    var scale = 1 / state.imageSelected.size.imageScale;

    category && (shape.category = category);
    tags && (shape.tags = tags);
    label && (shape.label = label);
    points && (shape.points = scaleShapePoints(points, scale, shape.type));
    rbox && (shape.rbox = scaleRbox(rbox, scale));
    zoomScale && (shape.zoomScale = zoomScale);
  },

  /**
   * Updates selected image details
   */
  updateImageDetail(
    state,
    {
      name,
      scaledWidth,
      scaledHeight,
      imageScale,
      shapeIndex,
      pointIndex,
      featurePointSize,
      opacity
    }
  ) {
    let image = state.imageSelected;
    name && (image.name = name);
    scaledWidth && (image.size.scaledWidth = scaledWidth);
    scaledHeight && (image.size.scaledHeight = scaledHeight);
    imageScale && (image.size.imageScale = imageScale);
    shapeIndex && (image.shapeIndex = shapeIndex);
    pointIndex && (image.pointIndex = pointIndex);
    featurePointSize && (image.featurePointSize = featurePointSize);
    opacity && (image.opacity = opacity);
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
   * Returns an image from a name
   * @param {String} name - image name
   * @returns {Function(): }
   */
  getImageByName: state => name => {
    return state.images[name];
  },

  /**
   * Gets shape by id
   * @param {String} shapeID
   * @returns {Function(): Shape} takes a shapeID and returns a shape
   */
  getShapeByID: state => shapeID => {
    return state.shapes[shapeID];
  },

  /**
   * Returns an array of shape attributes
   * @param {String} shapeID - shape id
   * @returns {Function(): String[]} - array of shape attributes
   */
  getShapeAttributes: state => shapeID => {
    return state.shapes[shapeID].attributes;
  },

  /**
   * Returns values associated with the shape attribute
   * @param {String} shapeID - shape id
   * @returns {Function(): String[]} - array of shape attribute values
   */
  getShapeAttributeValues: state => ({ shapeID, attribute }) => {
    let id = formatID(shapeID, attribute);
    return state.shapeAttributes[id];
  },

  /**
   * Gets shape feature points
   * @param {String} shapeID
   * @returns {Function(): FeaturePoint[]} takes a shape ID and returns an array of feature points
   */
  getShapeFeaturePoints: state => shapeID => {
    return state.shapes[shapeID].featurePoints.map(featurePointID => {
      return state.featurePoints[featurePointID];
    });
  },

  /**
   * Get shape feature point ids
   * @param {String} shapeID
   * @returns {Function(): String[]} featurePoints
   */
  getShapeFeaturePointIDs: state => shapeID => {
    return state.shapes[shapeID].featurePoints;
  },

  /**
   * Gets feature point by ID
   * @param {String} featurePointID
   * @returns {Function: FeaturePoint}
   */
  getFeaturePointByID: state => featurePointID => {
    return state.featurePoints[featurePointID];
  },

  /**
   * Returns feature point size for an image,
   * Default size, which is the min size, is 3
   * @returns {Number} feature point size
   */
  getFeaturePointSize: state => {
    return (state.imageSelected && state.imageSelected.featurePointSize) || 3;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters
};
