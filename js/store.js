var data_schema = {
    "v" : "string",
    data : [{
            "path" : "string", //filesystem path or url : filesystem path will be empty for web applications
            "imagename": "string",
            "attributes": [{
                "label" : "string",
                "value": ["string"]
            }],
            "tags": ["string"],
            "size" : {
                "width": "number",
                "height": "number"
            },
            "shapes": [{
                "label" : "string",
                "type" : "string", //Eg rectangle, line, circle, polygon, path
                "points": ["string"],
                "bbox" : {
                    "x": "number",
                    "y": "number",
                    "w": "number",
                    "h": "number"
                },
                "attributes": [{
                    "label" : "string",
                    "value": ["string"]
                }],
                "tags": ["string"],
                "featurePoints": [{
                    "x": "number",
                    "y": "number",
                    "label" : "string"
                }]
          }]
    }]
};

var counter = 0;

function generateLabel(hint){
    var label = hint || "label";
    return label + counter ++;
}

function createFeaturePoint(label , x,y){
    return {
        "x": x,
        "y": y,
        "label" : generateLabel(type)
    }
}

function createAttribute(label , val){
    return {
        "label" : label,
        "value": val //Array
    }
}

function updateLabel(oldLabel,newLabel){
    var shape = findInArray(labellingData[imgSelected].shapes, "label", oldLabel);
    shape.label = newLabel;
}

function findInArray(arr, property, val){
    arr.forEach( item => {
        if(item[property] === val) return item;
    })
}

function updateFeaturePointInStore(shapeId , pointid, position, newLabel){
    if(position){
        labellingData[imgSelected].shapes[shapeId].featurePoints[pointid].x = position.cx;
        labellingData[imgSelected].shapes[shapeId].featurePoints[pointid].y = position.cy;
    }

    if(newLabel){
        labellingData[imgSelected].shapes[shapeId].featurePoints[pointid].label = newLabel    
    }
}
function attachPointToShape(shapeId , pointid, position){
    labellingData[imgSelected].shapes[shapeId].featurePoints[pointid] = {
        "x": position.cx,
        "y": position.cy,
        "label" : generateLabel("point")
    };
}

function detachShape(shapeId){
    delete labellingData[imgSelected].shapes[shapeId];
}

function detachPoint(shapeId, pointid){
    delete labellingData[imgSelected].shapes[shapeId].featurePoints[pointid];
}
function updateShapeDetailInStore(id, bbox, points){
    bbox && (labellingData[imgSelected].shapes[id].bbox = bbox);
    points && (labellingData[imgSelected].shapes[id].points = points);
}
function attachShapeToImg(id, type, bbox, points){
    labellingData[imgSelected].shapes[id] = {
        "label" : generateLabel(type),
        "type" : type,
        "points": points,
        "bbox" : bbox || {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0        },
        "attributes": [],
        "tags": [],
        "featurePoints": {}
    };
}
function addImgToStore(imgname, size) {
    labellingData[imgname] = {
        //"path" : "",
        "imagename": imgname,
        "attributes": [],
        "tags": [],
        "size" : {
            "width": size.width,
            "height": size.height
        },
        "shapes": {}
    }
}

var labellingData = {};
// circle: schema.data[n].shapes[n].points = [cx, cy, r]
// eclipse: schema.data[n].shapes[n].points = [cx, cy, rx, ry]
// line: schema.data[n].shapes[n].points = [x1, y1, x2, y2]
// rectangle: schema.data[n].shapes[n].points = [x, y, w, h]
// polygon: schema.data[n].shapes[n].points = [x1, y1, x2, y2, ...]
// path: schema.data[n].shapes[n].path = ""