var tools = {
    labelling : {
        "tool-point" : {
            type: "point",
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg",
            drawable : true,
            actions: ["landmark", "colorpicker"],
            create : function(e, container){
                var canvasOffset = myCanvas.node.getBoundingClientRect();
                return getPointToDraw(e, container, canvasOffset);
            },
            validate: function(el){
                return true;
            }
        },
        "tool-circle" : {
            type: "circle",
            title  : "Circle",
            desp : "Create a circle",
            icon : "circle.svg",
            drawable : true,
            create : function(){
                var circle =  myCanvas.nested().circle().radius().addClass('labelcircle shape')/* .draw() */;
                circle.resize();
                circle.parent().draggable();
                return circle;
            },
            validate: function(el){
                return Number.parseInt(el.attr("r")) > 3;
            }
        },
        "tool-rectangle" : {
            type: "rect",
            title  : "Rectangle",
            desp : "Create a Boundary boxrectangle",
            icon : "rectangle.svg",
            drawable : true,
            create : function(){
                var rect =  myCanvas.nested().rect().addClass('labelbox shape')/* .draw() */;
                rect.resize();
                rect.parent().draggable();
                return rect;
            },
            validate: function(el){
                return Number.parseInt(el.attr("width")) > 3;
            },
        },
        "tool-polygon" : {
            type: "poly",
            title  : "Polygon",
            desp : "Create a concave polygon",
            icon : "polygon.svg",
            drawable : true,
            create : function(){//TODO: bug: creating duplicate points
                var poly =  myCanvas.nested().polygon().addClass('labelpolygon shape')/* .draw() */;
                poly.resize();
                poly.parent().draggable();

                poly.on('drawstart', function(e){
                    document.addEventListener('keydown', function(e){
                        if(e.keyCode == 13){
                            poly.draw('done');
                            poly.off('drawstart');

                            /* poly.on('dblclick', function(event){
                                if(selectedTool.type === "poly"){
                                    var points = myCanvas.point(event.x, event.y);
                                    var polyArray = poly.array().valueOf();
                                    for(var p_i=0; p_i< polyArray.length; p_i++){
                                        var point1 = polyArray[ p_i];
                                        var point2 = [];

                                        if(i === length -1 ){
                                            point2 = polyArray[ 0];
                                        }else{
                                            point2 = polyArray[ p_i + 1 ];
                                        }
                                        var distance  = pDistance(point1[0], point1[1], point2[0], point2[1], points.x, points.y);
                                        if(distance < 11){
                                            polyArray.splice(p_i+1, 0, [points.x, points.y] );
                                            poly.plot(polyArray);
                                            break;
                                        }
                                    }
                                }
                            }) */
                        }
                    });
                });

                return poly;
            },
            validate: function(el){
                return true;
            },
        }
    },
    canvas : {
        "tool-move" : {
            title  : "Move",
            desp : "Move an element or the entire workarea",
            icon : "move.svg",
            type : "move",
        },
        "tool-zoom" : {
            title  : "Zoom",
            desp : "Enlarge the workarea",
            icon_font : "icon-zoom-in",
            actions : ["zoom"]
        },
        "tool-light" : {
            title  : "Light",
            desp : "Highlight the labels",
            icon_font : "icon-lightbulb",
            actions : ["lightbulb"]
        }
    }
};

/**
 * Draws a featurePoint on myCanvas
 * @param {Event} position - click position
 * @param {SVGElement} container - shape that should hold the featurePoint
 * @param {DOMReact | Object} canvasOffset - offset due to canvas
 * @returns {SVGElement} SVGElement of featurePoint
 */
function getPointToDraw(position, container, canvasOffset) {
    // Get the parent svg element that surrounds the container
    var parentSvg = $('#'+container.node.id).closest('svg');
    var containerOffset = {
        x: parseInt(parentSvg.attr("x"), 10) || 0,
        y: parseInt(parentSvg.attr("y"), 10) || 0
    }
    // Feature point size should be local to each image
    var featurePointSize = labellingData[imgSelected.name].featurePointSize;
    var point =  container.parent().circle()
        .radius(Math.floor(featurePointSize))
        .attr({
            cx: position.x - canvasOffset.x - containerOffset.x,
            cy: position.y - canvasOffset.y - containerOffset.y})
        .addClass('labelpoint');
    // Set feature point colors with appConfig.featurePointColor
    $('.labelpoint').css('fill', appConfig.featurePointColor);
    point.draggable();
    return point;
}
var imgSelected = "";
var selectedElements = [];
var copiedElements;
var selectedTool = null, selectedElement = null;
var alreadyDrawing = false;
var eventBus; // Event bus used to propogate changes between tags

var plugins = {
    "facepp" : {
        title: "Face Plus Plus",
        tagName: 'facepp'
    }
}
var pluginsStore = {
    "facepp" : {
    }
}

var suggestedCategories = ["dog", "cat", "car", "vehicle", "truck", "animal", "building", "person"];
var suggestedTags = [];
var suggestedAttributes = {
    "gender" : ["male", "female", "other"],
    "color" : ["red", "green", "blue", "orange", "yellow", "white", "black"],
};
