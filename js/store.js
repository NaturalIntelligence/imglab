function createAttribute(label, val){
    return {
        "label" : label,
        "value": val //Array
    }
}

function updateLabel(oldLabel, newLabel){
    var shape = findInArray(labellingData[ imgSelected.name ].shapes, "label", oldLabel);
    shape.label = newLabel;
}

function updateFeaturePointInStore(shapeId, pointid, position, newLabel){
    var shape = getShape(shapeId);
    var scale = 1 / imgSelected.size.imageScale;
    var featurePoints = shape.featurePoints;
    var index = indexOf(featurePoints, "id", pointid);

    if(position){
        featurePoints[index].x = position.cx * scale;
        featurePoints[index].y = position.cy * scale;
    }

    if(newLabel){
        featurePoints[index].label = newLabel
    }
}

function getShape(shapeId){
    return findInArray(labellingData[ imgSelected.name ].shapes, "id", shapeId);
}

function attachPointToShape(shapeId, pointid, position){
    var shape = getShape(shapeId);
    var scale = 1 / imgSelected.size.imageScale;
    shape.featurePoints.push( {
        "x": position.cx * scale,
        "y": position.cy * scale,
        "label" : shape.featurePoints.length,
        "id" : pointid
    });
}

function detachShape(shapeId){
    var shapes = labellingData[ imgSelected.name ].shapes;
    var index = indexOf(shapes, "id", shapeId);
    shapes.splice(index,1);
}

function detachPoint(shapeId, pointid){
    var shape = getShape(shapeId);
    var featurePoints = shape.featurePoints;
    var index = indexOf(featurePoints, "id", pointid);
    featurePoints.splice(index, 1);
}

function detachPointByIndex(shapeId, pointIndex){
    var shape = getShape(shapeId);
    var featurePoints = shape.featurePoints;
    featurePoints.splice(pointIndex, 1);
}

/**
 * Scales the shape data based on scale
 * @param {string} id - id of shape
 * @param {string} label - label of shape
 * @param {Object} bbox - rbox of shape
 * @param {points[]} points - points that form the shape, e.g. 4 points of a rect
 * @param {number} scale - scale used to rescale shape
 * @returns {Object} scaled shape data
 */
function scaleShape(id, type, bbox, points, scale) {
    return {
        "id" : id,
        "label" : "unlabelled",
        "type" : type,
        "points": scaleShapePoints(points, scale, type),
        "bbox" : scaleBbox(bbox, scale) || {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0        },
        "attributes": [],
        "tags": [],
        "featurePoints": [],
        "zoomScale" : 1,
        "defaultZoomScale": 1/imgSelected.size.imageScale
    }
}

/**
 * Scales the points of the shape according to scale and type
 * @param {points[] | Array[points[]]} point
 * @param {number} scale
 * @param {string} type - type of shape
 * @returns {points[] | Array[points[]]} scaled points
 */
function scaleShapePoints(points, scale, type) {
    if (!points) return;

    if (type == "polygon") {
      return points.map(point => {
        return point.map(val => val * scale);
      });
    }
    // Return this for other shapes
    return points.map(point => point * scale);
}

/**
 * Scales the rbox of shape according to scale
 * @param {Object} bbox - rbox of shape
 * @param {number} scale
 * @returns {Object} scaled rbox
 */
function scaleBbox(bbox, scale) {
    return {
        'x': bbox.x * scale,
        'y': bbox.y * scale,
        'cx': (bbox.cx || 0) * scale,
        'cy': (bbox.cy || 0) * scale,
        'w': bbox.w * scale,
        'h': bbox.h * scale,
        'width': bbox.w * scale,
        'height': bbox.h * scale
    }
}

/**
 * Scales the feature points according to scale
 * @param {featurePoints[]} featurePoints - array of featurePoints
 * @param {number} scale
 * @returns {featurePoints[]} scaled featurePoints
 */
function scaleFeaturePoints(featurePoints, scale) {
    if (!featurePoints) return;

    return featurePoints.map(point => {
        return {
          "x": point.x * scale,
          "y": point.y * scale,
          "label" : point.label,
          "id" : point.id
        };
    });
}

function updateShapeDetailInStore(shapeId, bbox, points){
    var shapes = labellingData[ imgSelected.name ].shapes;
    var shape = getShape(shapeId);
    var index = indexOf(shapes, "id", shapeId);
    var scale = 1 / imgSelected.size.imageScale;
    bbox && (shapes[index].bbox = scaleBbox(bbox, scale));
    points && (shapes[index].points = scaleShapePoints(points, scale, shape.type));
}

/**
 * Adds a shape into labelling data and returns a shape object
 */
function attachShapeToImg(id, type, bbox, points){
    var shape = scaleShape(id, type, bbox, points, 1 / imgSelected.size.imageScale);
    labellingData[ imgSelected.name ].shapes.push(shape);
    return shape;
}

function addImgToStore(imgname, size) {
    // If we already have this image data in localstorage,
    // don't initialize its properties
    if(!labellingData[imgname]){
        labellingData[imgname] = {
            //"path" : "",
            "imagename": imgname,
            "attributes": [],
            "tags": [],
            "size" : {
                "width": size.width,
                "height": size.height
            },
            "shapes": [],
            "shapeIndex": 0,   // Used to generate new ids for copy pasted shapes
            "pointIndex": 0,    // Used to generate new ids for feature points
            "featurePointSize": 3 // Stores featurePointSize per image
        }
    }
}

var labellingData = {};
// circle: schema.data[n].shapes[n].points = [cx, cy, r]
// eclipse: schema.data[n].shapes[n].points = [cx, cy, rx, ry]
// line: schema.data[n].shapes[n].points = [x1, y1, x2, y2]
// rectangle: schema.data[n].shapes[n].points = [x, y, w, h]
// polygon: schema.data[n].shapes[n].points = [x1, y1, x2, y2, ...]
// path: schema.data[n].shapes[n].path = ""
