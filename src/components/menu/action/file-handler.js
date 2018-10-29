import nimnImageStore from "./nimn-format-imagestore";
import nimnAppConfig from "./nimn-format-appconfig";
import nimnLabelData from "./nimn-format-labeldata";
import { RECTANGLE, POLYGON, CIRCLE, POINT } from "../../../utils/tool-names";
import { Image } from "../../../models/Image";
import { Shape } from "../../../models/Shape";
import { FeaturePoint } from "../../../models/FeaturePoint";

function getStoreData(store) {
  let dataImageStore = store.getters["image-store/getStoreData"];
  let dataAppConfig = store.getters["app-config/getStoreData"];
  let dataLabelData = store.getters["label-data/getStoreData"];

  return {
    "image-store": dataImageStore,
    "app-config": dataAppConfig,
    "label-data": dataLabelData
  };
}

/**
 * Decode coco json to json
 */
export function decodeCocoJson(cocoData) {
  let {
    images: _images,
    annotations: _annotations,
    categories: _categories
  } = cocoData;

  // label-data store data
  let categories = _categories.reduce((acc, val) => {
    acc.push(val.name);
    return acc;
  }, []);
  // image-store data
  let images = {};
  let shapes = {};

  // Store images
  _images.forEach((image, index) => {
    images[image.file_name] = new Image({
      id: index,
      name: image.file_name,
      size: {
        width: image.width,
        height: image.height,
        scaledWidth: image.width,
        scaledHeight: image.height,
        imageScale: 1
      }
    });
  });

  // Store shape data
  _annotations.forEach(annotation => {
    let { id, image_id, category_id, segmentation, bbox } = annotation;
    // Set type to either circle or polygon
    let type = segmentation[0].length === 2 ? CIRCLE : POLYGON;
    // Set points based on shape type
    let points = null;
    // set rbox based on shape type
    let rbox = null;
    let [x, y, width, height] = bbox;
    if (type === CIRCLE) {
      let [cx, cy] = segmentation[0];
      points = [cx, cy, height / 2];
      rbox = { cx, cy, width, height, w: width, h: height };
    } else {
      points = [...segmentation[0]];
      rbox = { x, y, width, height, w: width, h: height };
    }
    // Create shape and store in map
    let shape = new Shape({
      id: `${type}#${image_id}-${id}`,
      category: categories[category_id],
      points,
      type,
      rbox
    });
    shapes[shape.id] = shape;
    // Add shape to image
    let imagename = _images[image_id].file_name;
    let image = images[imagename];
    image.shapes.push(shape.id);
    // Increment image's shape index
    ++image.shapeIndex;
  });

  let storeData = {
    "image-store": {
      images,
      shapes
    },
    "label-data": {
      categories
    }
  };

  return storeData;
}

export function decodeDlibXML(data) {
  var convert = require("xml-js");
  var options = {
    alwaysChildren: true,
    compact: true,
    ignoreComment: true
  };

  var result = convert.xml2js(data, options);

  let dataset = result.dataset;
  // Images should be stored under the dataset/images/image
  let images = dataset.images.image;

  if (images.constructor !== Array) images = [images];

  // New store data
  let _images = {};
  let _shapes = {};
  let _featurePoints = {};
  let _imageIndex = 0;

  images.forEach(({ _attributes: { file }, box = [] }) => {
    let image = new Image({ name: file, id: _imageIndex++ });

    let shapes = [];
    // Keeps track of uid of shapes per image
    let _shapeIndex = 0;

    if (box.constructor !== Array) box = [box];

    box.forEach(
      ({
        _attributes: { top: y, left: x, width: w, height: h },
        label: { _text },
        part = []
      }) => {
        let index = _shapeIndex++;
        let shapeHash = image.id + "-" + index;
        // Populate shape data
        let shape = new Shape({
          id: RECTANGLE + "#" + shapeHash,
          label: _text || RECTANGLE + "#" + index,
          type: RECTANGLE,
          rbox: { x, y, w, h },
          points: [x, y, w, h]
        });

        // Populate feature point data
        let featurePoints = [];
        // Keeps track of uid for featurepoint of shape
        let _featurePointIndex = 0;

        if (part.constructor !== Array) part = [part];

        part.forEach(({ _attributes: { x, y } }) => {
          let index = _featurePointIndex++;
          let fpHash = shapeHash + "-" + index;
          let featurePoint = new FeaturePoint({
            x,
            y,
            id: POINT + "#" + fpHash,
            label: POINT + "#" + index
          });
          // Add feature point to list
          featurePoints.push(featurePoint.id);
          // Add feature point data to map
          _featurePoints[featurePoint.id] = featurePoint;
        });

        // Shape keeps track of feature point uids
        shape.featurePointIndex = _featurePointIndex;
        // Add feature points
        shape.featurePoints = featurePoints;
        // Add shape to list of shapes
        shapes.push(shape.id);
        // Add shape data to map
        _shapes[shape.id] = shape;
      }
    );
    // Image keeps track of shape uid
    image.shapeIndex = _shapeIndex;
    // Add list of shapes to image
    image.shapes = shapes;
    // Add image data to map
    _images[image.name] = image;
  });

  let storeData = {
    images: _images,
    shapes: _shapes,
    featurePoints: _featurePoints,
    imageIndex: _imageIndex
  };

  return storeData;
}

/**
 * Encodes store data to .nimn format
 * @param {Vuex.Store} store - vuex store instance
 */
export function encodeAsNimn(store) {
  var nimn = require("nimnjs");

  let storeData = getStoreData(store);

  let nimnStore = {
    type: "map",
    detail: [nimnImageStore, nimnAppConfig, nimnLabelData]
  };

  let schemaStore = nimn.buildSchema(nimnStore);
  let stringStore = nimn.stringify(schemaStore, storeData);

  return stringStore;
}

/**
 * Encodes store data as dlib xml
 * @param {Vuex.Store} store - store instance
 */
export function encodeAsDlibXML(store) {
  let dlib_header = `
  <?xml version='1.0' encoding='ISO-8859-1'?>
  <?xml-stylesheet type='text/xsl' href='image_metadata_stylesheet.xsl'?>
  <dataset>
    <name>dlib face detection dataset generated by ImgLab</name>

    <comment>
      This dataset is manually crafted or adjusted using ImgLab web annotation tool
      For more details, please go to https://github.com/NaturalIntelligence/imglab
    </comment>

    <images>
  `;

  let storeData = getStoreData(store);

  let xml = "";
  let { images, shapes, featurePoints } = storeData["image-store"];

  Object.values(images).forEach(image => {
    xml += `
      <image file='${image.name}'>
    `;

    image.shapes.forEach(shapeID => {
      let shape = shapes[shapeID];
      let box = shape.rbox;
      xml += `
        <box top='${box.y}' left='${box.x}' width='${box.w}' height='${box.h}'>
          <label>${shapes[shapeID].label || shapes[shapeID].type}</label>`;

      shape.featurePoints.forEach(featurePointID => {
        let fp = featurePoints[featurePointID];
        xml += `
          <part name='${fp.id}' x='${Math.floor(fp.x)}' y='${Math.floor(
          fp.y
        )}'/>`;
      });
      xml += `
        </box>
      `;
    });

    xml += `
      </image>
    `;
  });

  let dlib_footer = `
    </images>
  </dataset>`;

  return dlib_header + xml + dlib_footer;
}

/**
 * Saves selected shape data as pts file
 * @param {Vuex.Store} store - store instance
 * @param {String} shapeID
 */
export function encodeAsDlibPts(store, shapeID) {
  let storeData = getStoreData(store);
  let shapes = storeData["image-store"].shapes;
  let shape = shapes[shapeID];
  var data = `version: 1
n_points: ${shape.featurePoints.length}
{
`;

  let featurePoints = storeData["image-store"].featurePoints;
  shape.featurePoints.forEach(featurePointID => {
    let featurePoint = featurePoints[featurePointID];
    data += `${Math.floor(featurePoint.x)} ${Math.floor(featurePoint.y)}\n`;
  });

  data += "}";

  return data;
}

/**
 * Encode data as coco json format
 * @param {Vuex.Store} store - store instance
 */
export function encodeAsCocoJson(store) {
  // Get image store and label store data
  let { "image-store": imageStore, "label-data": labelStore } = getStoreData(
    store
  );
  let { images: _images, shapes: _shapes } = imageStore;
  let { categories: _categories } = labelStore;

  // Add a uncategorized category for shapes with an empty category
  _categories.push("uncategorized");

  let cocoData = {
    images: [],
    annotations: [],
    categories: [],
    type: "instances"
  };

  // Used to generate unique ids
  let shapeIndex = 0;
  Object.values(_images).forEach((image, imageIndex) => {
    // Add image
    let name = image.name;
    cocoData.images.push({
      file_name: name,
      height: image.size.height,
      width: image.size.width,
      id: imageIndex
    });

    // Add annotations / shapes
    image.shapes.forEach(shapeID => {
      let shape = _shapes[shapeID];
      let area = 0;
      let points = [];
      if (shape.type === POLYGON) {
        points = [...shape.points];
        area = calcArea(points);
      } else if (shape.type === CIRCLE) {
        points = [shape.points[0], shape.points[1]];
        area = shape.points[2] * shape.points[2] * Math.PI;
      } else if (shape.type === RECTANGLE) {
        points = [
          // top left corner
          shape.points[0],
          shape.points[1],
          // top right corner
          shape.points[0] + shape.points[2],
          shape.points[1],
          // bottom left corner
          shape.points[0] + shape.points[2],
          shape.points[1] + shape.points[3],
          // bottom right corner
          shape.points[0],
          shape.points[1] + shape.points[3]
        ];
        area = calcArea(points);
      } else {
        console.error("Unknown type");
      }

      // empty category defaults to uncategorized
      let category_id = shape.category
        ? _categories.indexOf(shape.category)
        : _categories.length - 1;

      // annotation bbox
      let { x, y, width, height } = shape.rbox;
      cocoData.annotations.push({
        id: shapeIndex++,
        image_id: imageIndex,
        category_id,
        segmentation: [points],
        area,
        bbox: [x, y, width, height],
        iscrowd: 0,
        ignore: 0
      });
    });
  });

  _categories.forEach((category, index) => {
    cocoData.categories.push({
      id: index,
      name: category,
      supercategory: "none"
    });
  });

  return JSON.stringify(cocoData);
}

/**
 * Helper method to calculate area of shape
 * @param {Points[]} coords - array of points
 * @see getPoints for more details
 */
function calcArea(coords) {
  let area = 0;
  let numCoords = coords.length;

  for (var i = 0; i < numCoords; i += 2) {
    // make last+1 wrap around to zero
    let nexti = (i + 2) % numCoords;
    area += coords[i] * coords[nexti + 1] - coords[i + 1] * coords[nexti];
  }
  return Math.abs(area / 2);
}
