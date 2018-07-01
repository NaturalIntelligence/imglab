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
    var shape = findInArray(labellingData[ imgSelected.name ].shapes, "label", oldLabel);
    shape.label = newLabel;
}

function updateFeaturePointInStore(shapeId , pointid, position, newLabel){
    var shape = getShape(shapeId);
    var featurePoints = shape.featurePoints;
    var index = indexOf(featurePoints, pointid);

    if(position){
        featurePoints[index].x = position.cx;
        featurePoints[index].y = position.cy;
    }

    if(newLabel){
        featurePoints[index].label = newLabel    
    }
}
function getShape(shapeId){
    return findInArray(labellingData[ imgSelected.name ].shapes, "id", shapeId);
}
function attachPointToShape(shapeId , pointid, position){
    var shape = getShape(shapeId);
    shape.featurePoints.push( {
        "x": position.cx,
        "y": position.cy,
        "label" : generateLabel("point"),
        "id" : pointid
    });
}

function detachShape(shapeId){
    var shapes = labellingData[ imgSelected.name ].shapes;
    var index = indexOf(shapes, shapeId);
    shapes.splice(index,1);
}

function detachPoint(shapeId, pointid){
    var shape = getShape(shapeId);
    var featurePoints = shape.featurePoints;
    var index = indexOf(featurePoints, pointid);
    featurePoints.splice(index, 1);
}
function updateShapeDetailInStore(shapeId, bbox, points){
    var shapes = labellingData[ imgSelected.name ].shapes;
    var index = indexOf(shapes, shapeId);

    bbox && (shapes[index].bbox = bbox);
    points && (shapes[index].points = points);
}
function attachShapeToImg(id, type, bbox, points){
    labellingData[ imgSelected.name ].shapes.push( {
        "id" : id,
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
        "featurePoints": []
    } );
}
function addImgToStore(imgname, size) {
    //If we already have this image data in localstorage, 
    //don't initialize its properties
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
            "shapes": []
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