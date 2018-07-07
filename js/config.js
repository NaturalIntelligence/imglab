var tools = {
    labelling : {
        "tool-point" : {
            type: "point",
            title  : "Point",
            desp : "Create a feature point inside the concave polygon or boundary box",
            icon : "point.svg",
            drawable : true,
            create : function(e,container){
                var canvasOffset = myCanvas.node.getBoundingClientRect();
                return getPointToDraw(e,container,canvasOffset);
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
        /* "tool-zoom" : {
            title  : "Zoom In",
            desp : "Enlarge the workarea",
            icon_font : "icon-zoom-in",
            actions : ["zoom"]
        }, */
        "tool-labels-only" : {
            title  : "Light",
            desp : "Highlight the labels",
            icon_font : "icon-lightbulb",
            actions : ["lightbulb"]
        }
    }
};

function getPointToDraw(position,container,canvasOffset){
    var containerOffset = {
        x: container.parent().attr("x"),
        y :container.parent().attr("y")
    }
    var point =  container.parent().circle().radius(3).attr({ cx: position.x - canvasOffset.x - containerOffset.x, cy: position.y - canvasOffset.y - containerOffset.y}).addClass('labelpoint');
    point.draggable();
    return point;
}
var imgSelected = "";
var selectedElements = [];
var selectedTool = null, selectedElement = null;
var alreadyDrawing = false;

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

var suggestedCategories = [];
var suggestedTags = [];
var suggestedAttributes = {
    "gender" : ["male", "female", "other"],
    "color" : ["red", "green", "blue", "orange", "yellow", "white", "black"],
};